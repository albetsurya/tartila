import { isTartilaAdmin, normalizeRole } from "./roles";

/**
 * Cek apakah saat ini berada dalam mode playtest game oleh admin.
 * Syarat:
 * 1. Query parameter ?mode=playtest pada URL.
 * 2. Role user HANYA 'tartila_admin' atau 'superadmin'.
 * Role 'admin' (Sambung Ngaji) atau 'member' TIDAK BOLEH berada dalam mode playtest.
 */
export function isPlaytestMode(
  search?: string,
  userRole?: string | null,
): boolean {
  const searchStr =
    search ?? (typeof window !== "undefined" ? window.location.search : "");
  if (!searchStr) return false;
  const params = new URLSearchParams(searchStr);
  if (params.get("mode") !== "playtest") {
    return false;
  }

  let role = userRole;
  if (!role && typeof window !== "undefined") {
    try {
      const cached = window.localStorage.getItem("tartila_cached_user");
      if (cached) {
        const u = JSON.parse(cached);
        role = u?.role;
      }
    } catch {
      // noop
    }
  }

  return isTartilaAdmin(role);
}

/**
 * Cek apakah sesi saat ini adalah sesi Playtest atau Admin (tidak boleh masuk leaderboard & database).
 */
export function isPlaytestOrAdminSession(
  search?: string,
  userRole?: string | null,
): boolean {
  if (isPlaytestMode(search, userRole)) return true;

  let role = userRole;
  if (!role && typeof window !== "undefined") {
    try {
      const cached = window.localStorage.getItem("tartila_cached_user");
      if (cached) {
        const u = JSON.parse(cached);
        role = u?.role;
      }
    } catch {
      // noop
    }
  }

  return isTartilaAdmin(role) || normalizeRole(role) === "admin";
}

/**
 * Menghasilkan rute tombol Back:
 * - Jika ?mode=playtest, arahkan kembali ke Panel Admin (/admin/games).
 * - Jika mode normal, arahkan ke fallback (Game Hub Member /member/ngaji-ceria/games).
 */
export function getGameBackUrl(
  search?: string,
  defaultUrl = "/member/ngaji-ceria/games",
): string {
  const searchStr =
    search ?? (typeof window !== "undefined" ? window.location.search : "");
  const params = new URLSearchParams(searchStr);
  if (params.get("mode") === "playtest") {
    return "/admin/games";
  }
  return defaultUrl;
}

/**
 * Buat URL untuk membuka game dalam mode playtest dari Panel Admin.
 */
export function getGamePlaytestUrl(gameId: string): string {
  if (gameId === "quiz-hub") return "/member/ngaji-ceria/quiz-hub?mode=playtest";
  if (gameId === "memory-match")
    return "/member/ngaji-ceria/games/tilawati-memory?mode=playtest";
  return `/member/ngaji-ceria/games/${gameId}?mode=playtest`;
}
