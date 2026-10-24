/**
 * Akses Ngaji Ceria berbasis peran (kebijakan baru).
 *
 * - Tamu / publik (tanpa login): Jilid 1–2, serta game Hijaiyah Pop,
 *   hub Ritme Ngaji, hub Quiz Ngaji, dan Arabic Wordle.
 * - Member (sudah login, peran apa pun): seluruh Jilid 1–5 dan seluruh game.
 * - Super Admin: semua terbuka (termasuk konten pratinjau).
 * - Jilid 6 selalu "Segera Hadir" (lencana, bukan konten).
 */

import { isAdminRole } from "@/lib/roles";
import { getGameOverrides } from "@/features/admin/services/gameCatalogAdminService";

/** Alias route -> id kanonis (beberapa route lama menunjuk game yang sama). */
const GAME_ALIASES: Record<string, string> = {
  "hijaiyah-burst": "hijaiyah-pop",
  "hijaiyah-match": "hijaiyah-match-arena",
  "verse-quest": "juz-amma-speedrun",
  "word-builder": "ayat-scramble",
};

export function canonicalGameId(routeId: string): string {
  return GAME_ALIASES[routeId] ?? routeId;
}

export type AccessTier = "guest" | "member" | "superadmin";

export function tierForRole(role: string | undefined | null): AccessTier {
  if (isAdminRole(role)) return "superadmin";
  if (role) return "member";
  return "guest";
}

/** Id game yang terbuka untuk tamu (hanya 1 game uji coba: Hijaiyah Pop; selain itu wajib login). */
export const GUEST_OPEN_GAME_IDS: ReadonlySet<string> = new Set([
  "hijaiyah-pop",
]);

/** Daftar hub yang terbuka untuk tamu (ritme-ngaji terbuka agar tamu dapat mencoba Hijaiyah Pop). */
export const OPEN_HUB_IDS: ReadonlySet<string> = new Set([
  "ritme-ngaji",
]);

export function isGameOpenForGuest(routeId: string): boolean {
  const canonical = canonicalGameId(routeId);
  try {
    const overrides = getGameOverrides();
    if (overrides && overrides[canonical]?.access) {
      return overrides[canonical].access === "guest-open";
    }
  } catch {
    // fallback jika error membaca overrides
  }
  return GUEST_OPEN_GAME_IDS.has(canonical);
}

/** Kompat: nama lama — kini berarti "terbuka untuk tamu". */
export const OPEN_GAME_IDS: ReadonlySet<string> = GUEST_OPEN_GAME_IDS;
export function isGameOpenForMember(routeId: string): boolean {
  return isGameOpenForGuest(routeId);
}

export function isGameOpen(routeId: string, tier: AccessTier): boolean {
  if (tier !== "guest") return true;
  return isGameOpenForGuest(routeId) || OPEN_HUB_IDS.has(routeId);
}

/** Jilid maksimum berdasarkan tier (Jilid 6 selalu segera-hadir). */
export function maxJilidForTier(tier: AccessTier): number {
  if (tier === "guest") return 2;
  return 5;
}

export function isComingSoonJilid(jilidId: number): boolean {
  return jilidId >= 6;
}

/** "jilid-3" -> 3 (0 bila tak dikenali). */
export function parseJilidNumber(jilidId: string): number {
  const match = /(\d+)\s*$/.exec(jilidId);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function isJilidOpen(jilidId: number, tier: AccessTier): boolean {
  if (isComingSoonJilid(jilidId)) return false;
  return jilidId <= maxJilidForTier(tier);
}
