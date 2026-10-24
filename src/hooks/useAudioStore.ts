import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AudioPreferenceState {
  /** false = suara asli, true = variasi (pitch & reverb). */
  useModifiedAudio: boolean;
  toggleModifiedAudio: () => void;
  setModifiedAudio: (value: boolean) => void;
}

/**
 * Preferensi audio Tilawati. Default `false` = suara asli.
 * Disimpan di LocalStorage via middleware `persist`.
 */
export const useAudioStore = create<AudioPreferenceState>()(
  persist(
    (set) => ({
      useModifiedAudio: false,
      toggleModifiedAudio: () =>
        set((state) => ({ useModifiedAudio: !state.useModifiedAudio })),
      setModifiedAudio: (value) => set({ useModifiedAudio: value }),
    }),
    { name: "tartila_audio_preference" },
  ),
);
