import { API_BASE_URL } from "../constants";
import { authApi } from "./authApi";

const REQUEST_TIMEOUT_MS = 15000;
const TOKEN_COOKIE = "tartila_token";
const GROUP_ID_COOKIE = "tartila_group_id";

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let sessionExpiryNotified = false;
let refreshInProgress = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Helper to retry a request with refreshed token.
 * Prevents infinite retry loops with `_retry` flag.
 */
async function retryWithFreshToken<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  data?: Record<string, any>,
  queryParams?: Record<string, any>,
  bearer?: string | null,
  _retry?: boolean,
): Promise<T> {
  if (refreshInProgress && !_retry) {
    // Wait for any in-progress refresh
    if (refreshPromise) {
      await refreshPromise;
    }
    // Retry with fresh token after refresh completes
    return callREST<T>(method, path, data, queryParams, bearer, true);
  }

  // Don't retry auth endpoints to avoid infinite loop
  if (_retry && path.includes("/auth/refresh")) {
    throw new ApiError("Session expired", undefined, { retryable: false });
  }

  // Try to refresh token silently
  refreshInProgress = true;
  refreshPromise = authApi.refreshToken();

  try {
    const newToken = await refreshPromise;
    if (newToken && !_retry) {
      // Token refreshed, retry request with new token
      return callREST<T>(method, path, data, queryParams, newToken, true);
    }
    // Refresh failed or already retried - session truly expired
    // Hard redirect to login with clear token state
    clearToken();
    if (sessionExpiryNotified) {
      // sudah pernah notif di lifecycle ini, jangan redirect lagi
      throw new ApiError("Session expired", undefined, { retryable: false });
    }
    sessionExpiryNotified = true;
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw new ApiError("Session expired. Please log in again.", undefined, {
      retryable: false,
    });
  } finally {
    refreshInProgress = false;
    refreshPromise = null;
  }
}

/**
 * Register a global handler invoked once when the API reports an
 * expired/invalid session (401) or forbidden access (403).
 * Wired to `AuthContext.logout()` + a redirect to `/login` by
 * `SessionExpiryHandler` (mounted inside the router in App.tsx).
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

function notifyUnauthorized() {
  if (sessionExpiryNotified) return;
  sessionExpiryNotified = true;
  try {
    unauthorizedHandler?.();
  } catch {
    /* handler errors must not mask the original API error */
  }
}

export function getToken(): string | null {
  try {
    // 1. Cek localStorage (kompatibilitas dengan auth token dan localStorage.getItem("token"))
    if (typeof window !== "undefined" && window.localStorage) {
      const lsToken =
        window.localStorage.getItem("token") ||
        window.localStorage.getItem("tartila_token") ||
        window.localStorage.getItem("auth_token");
      if (lsToken) return lsToken.replace(/^Bearer\s+/i, "").trim();
    }

    // 2. Cek document.cookie (tartila_token, pengajian_token, token)
    if (typeof document !== "undefined" && document.cookie) {
      const match = document.cookie.match(
        /(?:^|;\s*)(?:tartila_token|pengajian_token|token)=([^;]*)/,
      );
      if (match) return decodeURIComponent(match[1]).replace(/^Bearer\s+/i, "").trim();
    }

    // 3. Cek sessionStorage
    if (typeof window !== "undefined" && window.sessionStorage) {
      const ssToken =
        window.sessionStorage.getItem("token") ||
        window.sessionStorage.getItem("tartila_token");
      if (ssToken) return ssToken.replace(/^Bearer\s+/i, "").trim();
    }

    return null;
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  sessionExpiryNotified = false;
  const clean = token.replace(/^Bearer\s+/i, "").trim();
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
      clean,
    )}; path=/; SameSite=Strict`;
    document.cookie = `token=${encodeURIComponent(
      clean,
    )}; path=/; SameSite=Strict`;
  }
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem("token", clean);
      window.localStorage.setItem("tartila_token", clean);
    } catch {
      // ignore
    }
  }
}

export function clearToken() {
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_COOKIE}=; path=/; SameSite=Strict; Max-Age=-1`;
    document.cookie = `token=; path=/; SameSite=Strict; Max-Age=-1`;
  }
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("tartila_token");
      window.localStorage.removeItem("auth_token");
    } catch {
      // ignore
    }
  }
}

export function setGroupId(groupId: string | null) {
  if (groupId) {
    document.cookie = `${GROUP_ID_COOKIE}=${encodeURIComponent(
      groupId,
    )}; path=/; SameSite=Strict`;
  } else {
    document.cookie = `${GROUP_ID_COOKIE}=; path=/; SameSite=Strict; Max-Age=-1`;
  }
}

export class ApiError extends Error {
  statusCode?: number;
  retryable: boolean;
  cancelled?: boolean;

  constructor(
    message: string,
    _response?: unknown,
    options: { retryable?: boolean; statusCode?: number; cancelled?: boolean } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.retryable = options.retryable ?? false;
    this.statusCode = options.statusCode;
    this.cancelled = options.cancelled;
  }
}

export async function callREST<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  data?: Record<string, any>,
  queryParams?: Record<string, any>,
  bearer?: string | null,
  _retry?: boolean,
): Promise<T> {
  const baseUrl = API_BASE_URL
    ? API_BASE_URL.replace(/\/api(\/v1)?\/?$/, "").replace(/\/+$/, "")
    : "";
  let url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  if (queryParams) {
    const search = new URLSearchParams();
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null) search.append(k, String(v));
    });
    const q = search.toString();
    if (q) url += `?${q}`;
  }

  // `bearer` menimpa token Go (mis. JWT Supabase untuk /auth/sync-profile).
  const token = bearer !== undefined ? bearer : getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      signal: controller.signal,
    });

    let json: { success?: boolean; data?: T; message?: string };
    try {
      json = await res.json();
    } catch {
      throw new ApiError("Response server tidak valid", undefined, {
        retryable: res.status >= 500,
        statusCode: res.status,
      });
    }
    if (!res.ok || json.success === false) {
      if (res.status === 401 || res.status === 403) {
        if (!_retry) {
          // Try silent token refresh before notifying
          try {
            return await retryWithFreshToken<T>(method, path, data, queryParams, bearer, false);
          } catch {
            // retryWithFreshToken handles notification and error
          }
        }
        notifyUnauthorized();
      }
      throw new ApiError(json.message || `REST request gagal (${res.status})`, undefined, {
        statusCode: res.status,
      });
    }
    return json.data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Permintaan timeout", undefined, {
        retryable: true,
        cancelled: true,
      });
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Gagal terhubung ke server",
      undefined,
      { retryable: true },
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}