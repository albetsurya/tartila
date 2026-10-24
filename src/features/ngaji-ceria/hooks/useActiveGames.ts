import { useEffect } from "react";
import { create } from "zustand";
import { callREST } from "@/services/api";
import { canonicalGameId } from "../data/gameAccess";

export interface ActiveGameItem {
  game_id: string;
  is_active: boolean;
  updated_at?: string;
}

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
  activeGameIds: new Set<string>(),
  activeGames: [],
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
