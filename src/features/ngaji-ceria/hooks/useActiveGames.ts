import { useEffect } from "react";
import { create } from "zustand";
import { callREST } from "@/services/api";
import { canonicalGameId } from "../data/gameAccess";

export interface ActiveGameItem {
  game_id: string;
  is_active: boolean;
  display_type?: "standalone" | "hub";
  parent_hub_id?: string | null;
  sort_order?: number;
  updated_at?: string;
}

export const DEFAULT_ACTIVE_GAMES: ActiveGameItem[] = [
  { game_id: "quiz-hub", is_active: true, display_type: "standalone", sort_order: 1 },
  { game_id: "harakat-slasher", is_active: true, display_type: "standalone", sort_order: 2 },
  { game_id: "memory-match", is_active: true, display_type: "standalone", sort_order: 3 },
  { game_id: "ayat-scramble", is_active: true, display_type: "standalone", sort_order: 4 },
  { game_id: "hijaiyah-2048", is_active: true, display_type: "standalone", sort_order: 5 },
  { game_id: "hijaiyah-pop", is_active: true, display_type: "standalone", sort_order: 6 },
  // Disabled: inactive game (quiz-ngaji)
  /*
  { game_id: "quiz-ngaji", is_active: true, display_type: "standalone", sort_order: 7 },
  */
];

interface ActiveGamesState {
  activeGameIds: Set<string>;
  activeGames: ActiveGameItem[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  fetchActiveGames: (force?: boolean) => Promise<void>;
  isGameActive: (gameId: string) => boolean;
}

export const useActiveGamesStore = create<ActiveGamesState>((set, get) => ({
  activeGameIds: new Set<string>(DEFAULT_ACTIVE_GAMES.map((g) => canonicalGameId(g.game_id))),
  activeGames: [...DEFAULT_ACTIVE_GAMES],
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchActiveGames: async (force = false) => {
    if (get().isLoading) return;
    if (get().hasLoaded && !force) return;

    set({ isLoading: true, error: null });
    try {
      const data = await callREST<ActiveGameItem[]>("GET", "/api/v1/games");
      const list = Array.isArray(data) ? data : [];
      const idSet = new Set<string>(list.map((g) => canonicalGameId(g.game_id)));
      set({
        activeGames: list,
        activeGameIds: idSet,
        isLoading: false,
        hasLoaded: true,
      });
    } catch (err: any) {
      console.warn("[useActiveGames] Gagal mengambil daftar game aktif:", err);
      set({
        isLoading: false,
        error: err?.message || "Gagal memuat status game aktif",
      });
    }
  },

  isGameActive: (gameId: string) => {
    const { hasLoaded, activeGameIds } = get();
    // Jika belum selesai inisialisasi load dari backend, anggap aktif sementara (agar tidak flashing lock)
    if (!hasLoaded) return true;
    const canonical = canonicalGameId(gameId);
    return activeGameIds.has(canonical);
  },
}));

export function useActiveGames() {
  const {
    activeGames,
    activeGameIds,
    isLoading,
    hasLoaded,
    error,
    fetchActiveGames,
    isGameActive,
  } = useActiveGamesStore();

  useEffect(() => {
    fetchActiveGames();
    const handleUpdate = () => {
      fetchActiveGames(true);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("tartila:game-catalog-updated", handleUpdate);
      return () => {
        window.removeEventListener("tartila:game-catalog-updated", handleUpdate);
      };
    }
  }, [fetchActiveGames]);

  return {
    activeGames,
    activeGameIds,
    isLoading,
    hasLoaded,
    error,
    refresh: () => fetchActiveGames(true),
    isGameActive,
  };
}
