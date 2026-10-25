import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameStoreState {
  /**
   * Menyimpan level tertinggi yang terbuka per gameId.
   * Default: 1 (Level 1 selalu terbuka untuk setiap game baru).
   */
  gameProgress: Record<string, number>;

  /** Mengambil level tertinggi yang sudah terbuka untuk game tertentu (default: 1). */
  getUnlockedLevel: (gameId: string) => number;

  /** Mengecek apakah suatu level sudah terbuka untuk game tertentu. */
  isLevelUnlocked: (gameId: string, level: number) => boolean;

  /** Membuka level berikutnya setelah pemain menyelesaikan currentLevel. */
  unlockNextLevel: (gameId: string, currentLevel: number) => void;

  /** Mengatur level tertinggi secara eksplisit jika diperlukan. */
  setLevelProgress: (gameId: string, level: number) => void;

  /** Reset progress level untuk satu game atau semua game. */
  resetGameProgress: (gameId?: string) => void;
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      gameProgress: {},

      getUnlockedLevel: (gameId: string) => {
        const progress = get().gameProgress;
        return progress[gameId] ?? 1;
      },

      isLevelUnlocked: (gameId: string, level: number) => {
        const unlocked = get().getUnlockedLevel(gameId);
        return level <= unlocked;
      },

      unlockNextLevel: (gameId: string, currentLevel: number) => {
        set((state) => {
          const currentMax = state.gameProgress[gameId] ?? 1;
          const nextLevel = Math.max(currentMax, currentLevel + 1);
          return {
            gameProgress: {
              ...state.gameProgress,
              [gameId]: nextLevel,
            },
          };
        });
      },

      setLevelProgress: (gameId: string, level: number) => {
        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            [gameId]: Math.max(1, level),
          },
        }));
      },

      resetGameProgress: (gameId?: string) => {
        if (gameId) {
          set((state) => ({
            gameProgress: {
              ...state.gameProgress,
              [gameId]: 1,
            },
          }));
        } else {
          set({ gameProgress: {} });
        }
      },
    }),
    {
      name: "tartila_game_progress",
    }
  )
);
