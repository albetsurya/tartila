// Admin user service.
//
// Uses the shared REST client (`callREST`), which already attaches the
// `Authorization: Bearer <jwt>` header from the auth token cookie
// (managed by src/services/api.ts + AuthContext) and unwraps the
// `{ success, data, message }` envelope.

import { ApiError, callREST } from "@/services/api";

export type AdminUserRole = "superadmin" | "tartila_admin" | "member";
export type AdminUserStatus = "active" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joinedAt: string;
}

export interface UserPayload {
  name: string;
  username: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
}

/**
 * Maps any thrown value to a user-facing message. Surfaces the backend
 * `message` for 4xx/5xx (e.g. "email sudah digunakan") so it can be shown
 * inside the form modal or as an inline table error.
 */
export function getAdminErrorMessage(
  err: unknown,
  fallback = "Terjadi kesalahan. Coba lagi.",
): string {
  if (err instanceof ApiError) {
    if (err.statusCode === 401) {
      return "Sesi Anda telah berakhir. Silakan masuk kembali.";
    }
    if (err.statusCode === 403) {
      return "Anda tidak memiliki akses untuk tindakan ini.";
    }
    if (err.cancelled) return "Permintaan ke server timeout. Coba lagi.";
    return err.message || fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

const ROLE_MAP: Record<string, AdminUserRole> = {
  super_admin: "superadmin",
  superadmin: "superadmin",
  tartila_admin: "tartila_admin",
  // Sambung Ngaji internal admins are plain members inside Tartila.
  admin: "member",
  member: "member",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function normalizeRole(value: unknown): AdminUserRole {
  if (typeof value !== "string") return "member";
  return ROLE_MAP[value.trim().toLowerCase()] ?? "member";
}

function normalizeStatus(value: unknown, isActive: unknown): AdminUserStatus {
  if (typeof value === "string") {
    const status = value.trim().toLowerCase();
    if (["suspended", "inactive", "banned", "blocked"].includes(status)) {
      return "suspended";
    }
    if (status === "active") return "active";
  }
  if (typeof isActive === "boolean") return isActive ? "active" : "suspended";
  return "active";
}

function formatJoinedAt(value: unknown): string {
  const raw = asString(value);
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeUser(raw: unknown, index: number): AdminUser {
  const row = isRecord(raw) ? raw : {};
  const name =
    asString(row.name ?? row.full_name) || asString(row.username) || "Tanpa Nama";
  return {
    id: asString(row.id ?? row.user_id ?? row.member_id) || `user-${index}`,
    name,
    email: asString(row.email) || "-",
    username: asString(row.username) || "-",
    role: normalizeRole(row.role ?? row.role_name),
    status: normalizeStatus(row.status ?? row.account_status, row.is_active),
    joinedAt: formatJoinedAt(
      row.joined_at ?? row.joinedAt ?? row.created_at ?? row.createdAt,
    ),
  };
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    if (Array.isArray(payload.users)) return payload.users;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;
  }
  return [];
}

export async function fetchUsers(): Promise<AdminUser[]> {
  const payload = await callREST<unknown>("GET", "/api/admin/users");
  return extractList(payload).map(normalizeUser);
}

export async function createUser(payload: UserPayload): Promise<void> {
  await callREST<unknown>("POST", "/api/admin/users", { ...payload });
}

export async function updateUser(
  id: string,
  payload: UserPayload,
): Promise<void> {
  await callREST<unknown>(
    "PUT",
    `/api/admin/users/${encodeURIComponent(id)}`,
    { ...payload },
  );
}

export async function deleteUser(id: string): Promise<void> {
  await callREST<unknown>(
    "DELETE",
    `/api/admin/users/${encodeURIComponent(id)}`,
  );
}

/**
 * Suspend / reactivate a user. Uses PATCH with a partial `{ status }` body;
 * adjust to the real backend route if it differs (e.g. a dedicated
 * `/api/admin/users/:id/suspend` endpoint).
 */
export async function setUserStatus(
  id: string,
  status: AdminUserStatus,
): Promise<void> {
  await callREST<unknown>(
    "PATCH",
    `/api/admin/users/${encodeURIComponent(id)}`,
    { status },
  );
}
