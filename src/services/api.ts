import { API_BASE_URL } from "../constants";

const REQUEST_TIMEOUT_MS = 15000;
const TOKEN_COOKIE = "tartila_token";
const GROUP_ID_COOKIE = "tartila_group_id";

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let sessionExpiryNotified = false;

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
    const match = document.cookie.match(
      /(?:^|;\s*)tartila_token=([^;]*)/,
    );
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  sessionExpiryNotified = false;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
    token,
  )}; path=/; SameSite=Strict`;
}

export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; SameSite=Strict; Max-Age=-1`;
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
): Promise<T> {
  let baseUrl = API_BASE_URL || "/api";
  if (baseUrl.endsWith("/api")) {
    baseUrl = baseUrl.slice(0, -4);
  }
  let url = `${baseUrl}${path}`;
  if (queryParams) {
    const search = new URLSearchParams();
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null) search.append(k, String(v));
    });
    const q = search.toString();
    if (q) url += `?${q}`;
  }

  const token = getToken();
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