import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { grantCoins, awardProgress } from '../pages/games/_shared/progression';

export type LabIramaTab = 'guide' | 'ear-training' | 'tap-beat';

export interface LabIramaState {
  // Rekor Ear Training
  bestEarScore: number;
  bestEarAccuracy: number;
  earGamesPlayed: number;

  // Rekor Tap The Beat
  bestTapScore: number;
  tapMaxCombo: number;
  tapGamesPlayed: number;

  // Preferensi Metronom & UI
  preferredBpm: number;
  metronomeSound: boolean;
  activeTab: LabIramaTab;

  // Actions
  setActiveTab: (tab: LabIramaTab) => void;
  setPreferredBpm: (bpm: number) => void;
  setMetronomeSound: (enabled: boolean) => void;
  recordEarTraining: (score: number, accuracy: number) => { coinsEarned: number; isNewRecord: boolean };
  recordTapTheBeat: (score: number, maxCombo: number, accuracy: number) => { coinsEarned: number; isNewRecord: boolean };
}

export const useLabIramaStore = create<LabIramaState>()(
  persist(
    (set, get) => ({
      bestEarScore: 0,
      bestEarAccuracy: 0,
      earGamesPlayed: 0,

      bestTapScore: 0,
      tapMaxCombo: 0,
      tapGamesPlayed: 0,

      preferredBpm: 75,
      metronomeSound: true,
      activeTab: 'guide',

      setActiveTab: (tab) => set({ activeTab: tab }),

      setPreferredBpm: (bpm) => set({ preferredBpm: Math.min(100, Math.max(60, bpm)) }),

      setMetronomeSound: (enabled) => set({ metronomeSound: enabled }),

      recordEarTraining: (score, accuracy) => {
        const state = get();
        const isNewRecord = score > state.bestEarScore;
        const newBestScore = Math.max(state.bestEarScore, score);
        const newBestAcc = Math.max(state.bestEarAccuracy, accuracy);

        // Koin: 5 koin per skor benar, bonus 15 koin jika rekor baru
        const coinsEarned = Math.round(score / 10) + (isNewRecord ? 15 : 5);
        grantCoins(coinsEarned, 'Lab Irama · Tebak Nada');
        awardProgress('lab-irama-ear', score, coinsEarned);

        set({
          bestEarScore: newBestScore,
          bestEarAccuracy: newBestAcc,
          earGamesPlayed: state.earGamesPlayed + 1,
        });

        return { coinsEarned, isNewRecord };
      },

      recordTapTheBeat: (score, maxCombo, accuracy) => {
        const state = get();
        const isNewRecord = score > state.bestTapScore;
        const newBestScore = Math.max(state.bestTapScore, score);
        const newMaxCombo = Math.max(state.tapMaxCombo, maxCombo);

        // Koin: sebanding dengan performa ketukan
        const coinsEarned = Math.round(score / 50) + (isNewRecord ? 20 : 5);
        grantCoins(coinsEarned, 'Lab Irama · Ketuk Irama');
        awardProgress('lab-irama-tap', score, coinsEarned);

        set({
          bestTapScore: newBestScore,
          tapMaxCombo: newMaxCombo,
          tapGamesPlayed: state.tapGamesPlayed + 1,
        });

        return { coinsEarned, isNewRecord };
      },
    }),
    {
      name: 'tartila_lab_irama_store',
    },
  ),
);
