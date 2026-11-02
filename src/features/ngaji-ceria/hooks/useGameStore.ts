import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LearningRecord {
  bestAccuracy: number;
  lastAccuracy: number;
  frequentMistakes: string[];
  updatedAt: string;
}

export interface GameStoreState {
  /**
   * Menyimpan level tertinggi yang terbuka per gameId.
   * Default: 1 (Level 1 selalu terbuka untuk setiap game baru).
   */
  gameProgress: Record<string, number>;

  /** Catatan performa dan analitik belajar per gameId */
  learningRecords: Record<string, LearningRecord>;

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

  /** Menyimpan hasil dan rekor akurasi belajar pemain */
  recordLearningResult: (
    gameId: string,
    accuracy: number | null,
    mistakes?: string[]
  ) => void;

  /** Mengambil catatan rekor belajar */
  getLearningRecord: (gameId: string) => LearningRecord | undefined;
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      gameProgress: {},
      learningRecords: {},

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

      recordLearningResult: (
        gameId: string,
        accuracy: number | null,
        mistakes: string[] = []
      ) => {
        if (accuracy === null || isNaN(accuracy)) return;
        set((state) => {
          const prev = state.learningRecords?.[gameId];
          const bestAccuracy = Math.max(prev?.bestAccuracy ?? 0, accuracy);
          const mergedMistakes = Array.from(
            new Set([...(prev?.frequentMistakes ?? []), ...mistakes])
          ).slice(0, 10);

          return {
            learningRecords: {
              ...(state.learningRecords ?? {}),
              [gameId]: {
                bestAccuracy,
                lastAccuracy: accuracy,
                frequentMistakes: mergedMistakes,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      getLearningRecord: (gameId: string) => {
        return get().learningRecords?.[gameId];
      },
    }),
    {
      name: "tartila_game_progress",
    }
  )
);
