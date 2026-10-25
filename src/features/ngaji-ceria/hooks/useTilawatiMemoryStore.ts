import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LevelRecord {
  stars: number;
  bestTimeSeconds: number;
  bestScore: number;
}

export interface TilawatiMemoryStoreState {
  /**
   * Rekor level tertinggi yang terbuka per Jilid (1-6).
   * Default: hanya Level 1 yang terbuka untuk setiap Jilid.
   */
  unlockedLevels: Record<number, number>;

  /**
   * Catatan skor dan bintang per level: Key berbentuk `${jilid}-${level}`.
   */
  levelRecords: Record<string, LevelRecord>;

  getUnlockedLevel: (jilid: number) => number;
  isLevelUnlocked: (jilid: number, level: number) => boolean;
  unlockLevel: (jilid: number, levelToUnlock: number) => void;
  recordLevelComplete: (
    jilid: number,
    level: number,
    stars: number,
    timeSeconds: number,
    score: number
  ) => { isNewUnlock: boolean; nextLevel: number };
  resetProgress: () => void;
}

const DEFAULT_UNLOCKED: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
};

export const useTilawatiMemoryStore = create<TilawatiMemoryStoreState>()(
  persist(
    (set, get) => ({
      unlockedLevels: { ...DEFAULT_UNLOCKED },
      levelRecords: {},

      getUnlockedLevel: (jilid: number) => {
        const state = get();
        return state.unlockedLevels[jilid] || 1;
      },

      isLevelUnlocked: (jilid: number, level: number) => {
        const maxUnlocked = get().getUnlockedLevel(jilid);
        return Number(level) <= maxUnlocked;
      },

      unlockLevel: (jilid: number, levelToUnlock: number) => {
        const currentMax = get().getUnlockedLevel(jilid);
        const capped = Math.min(4, Math.max(currentMax, levelToUnlock));
        set((prev) => ({
          unlockedLevels: {
            ...prev.unlockedLevels,
            [jilid]: capped,
          },
        }));
      },

      recordLevelComplete: (
        jilid: number,
        level: number,
        stars: number,
        timeSeconds: number,
        score: number
      ) => {
        const state = get();
        const currentMax = state.getUnlockedLevel(jilid);
        const nextLevel = Math.min(4, level + 1);
        const isNewUnlock = level >= currentMax && nextLevel > currentMax;

        const recordKey = `${jilid}-${level}`;
        const prevRecord = state.levelRecords[recordKey];

        const updatedRecord: LevelRecord = {
          stars: Math.max(prevRecord?.stars || 0, stars),
          bestTimeSeconds: prevRecord?.bestTimeSeconds
            ? Math.min(prevRecord.bestTimeSeconds, timeSeconds)
            : timeSeconds,
          bestScore: Math.max(prevRecord?.bestScore || 0, score),
        };

        const newUnlocked = isNewUnlock
          ? { ...state.unlockedLevels, [jilid]: nextLevel }
          : state.unlockedLevels;

        set({
          unlockedLevels: newUnlocked,
          levelRecords: {
            ...state.levelRecords,
            [recordKey]: updatedRecord,
          },
        });

        return { isNewUnlock, nextLevel };
      },

      resetProgress: () => {
        set({
          unlockedLevels: { ...DEFAULT_UNLOCKED },
          levelRecords: {},
        });
      },
    }),
    {
      name: 'tartila_tilawati_memory_store',
    }
  )
);
