/**
 * Kanonisasi peran pengguna Tartila.
 *
 * Peran disimpan di beberapa tempat dengan format berbeda
 * (metadata Supabase, tabel users, localStorage): "member",
 * "tartila_admin", "superadmin", "SUPER_ADMIN", "ustadz", "ustadzah".
 * Semua pemeriksaan peran WAJIB lewat normalizeRole agar tidak ada
 * format yang lolos/keliru.
 */

export type AppRole =
  | "member"
  | "ustadz"
  | "ustadzah"
  | "admin"
  | "superadmin";

const ROLE_ALIASES: Record<string, AppRole> = {
  member: "member",
  santri: "member",
  user: "member",
  ustadz: "ustadz",
  ustaz: "ustadz",
  ustadzah: "ustadzah",
  ustazah: "ustadzah",
  admin: "admin",
  tartila_admin: "admin",
  superadmin: "superadmin",
  super_admin: "superadmin",
  superadmin1: "superadmin",
};

/** Ubah peran apa pun (huruf besar/kecil, alias lama) ke peran kanonis. */
export function normalizeRole(
  role: string | null | undefined,
): AppRole | null {
  if (!role) return null;
  const cleaned = role
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return ROLE_ALIASES[cleaned] ?? null;
}

/** Ustadz/ustadzah murni (admin/superadmin bukan ustadz). */
export function isUstadzRole(role: string | null | undefined): boolean {
  const normalized = normalizeRole(role);
  return normalized === "ustadz" || normalized === "ustadzah";
}

/** Admin panel: admin & superadmin (termasuk alias tartila_admin/SUPER_ADMIN). */
export function isAdminRole(role: string | null | undefined): boolean {
  return normalizeRole(role) === "admin" || normalizeRole(role) === "superadmin";
}

/** Ustadz berdasarkan peran ATAU flag is_ustadz (legacy users.role_ustadz = 1). */
export function isUstadzUser(
  user: { role?: string | null; is_ustadz?: boolean | null } | null
    | undefined,
): boolean {
  return user?.is_ustadz === true || isUstadzRole(user?.role);
}

export type ClassroomRole = "ustadz" | "murid" | "monitor";

/**
 * Peran dalam kelas:
 * - ustadz/ustadzah -> pengajar (buat & kelola kelas)
 * - admin/superadmin -> pemantau (lihat dashboard, tanpa aksi mengubah)
 * - member/lainnya -> murid (gabung lewat kode join)
 */
export function classroomRoleFor(
  role: string | null | undefined,
): ClassroomRole | null {
  const normalized = normalizeRole(role);
  if (normalized === null) return null;
  if (normalized === "ustadz" || normalized === "ustadzah") return "ustadz";
  if (normalized === "admin" || normalized === "superadmin") return "monitor";
  return "murid";
}

/**
 * Peran kelas dari objek pengguna utuh (role ATAU flag is_ustadz).
 * Ustadz dengan role "member" tetap dihitung pengajar selama flag
 * is_ustadz = true; admin tetap pemantau meski flag terpasang.
 */
export function classroomRoleForUser(
  user: { role?: string | null; is_ustadz?: boolean | null } | null
    | undefined,
): ClassroomRole | null {
  if (user?.is_ustadz === true) {
    const role = normalizeRole(user.role);
    if (role === "admin" || role === "superadmin") return "monitor";
    return "ustadz";
  }
  return classroomRoleFor(user?.role);
}
