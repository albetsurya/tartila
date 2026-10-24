import { useAudioStore } from "@/hooks/useAudioStore";

const ORIGINAL_SEGMENT = "/audio/tilawati/";
const MODIFIED_SEGMENT = "/audio/tilawati_modified/";

/**
 * Mengubah URL audio Tilawati menjadi varian (tilawati_modified) ketika
 * preferensi "Gunakan Variasi Suara" aktif. URL lain dikembalikan apa adanya.
 *
 * - useModifiedAudio = false → /audio/tilawati/jilid_1/hal1/audio.ogg
 * - useModifiedAudio = true  → /audio/tilawati_modified/jilid_1/hal1/audio.ogg
 *
 * Membaca state via getState() agar aman dipanggil di luar React render.
 */
export function getAudioUrl(url: string | null | undefined): string | null {
  if (!url) return url ?? null;
  if (!url.includes(ORIGINAL_SEGMENT)) return url;
  if (!useAudioStore.getState().useModifiedAudio) return url;
  return url.split(ORIGINAL_SEGMENT).join(MODIFIED_SEGMENT);
}

/** Versi hook: memaksa re-render saat preferensi berubah. */
export function useAudioUrl(url: string | null | undefined): string | null {
  useAudioStore((state) => state.useModifiedAudio);
  return getAudioUrl(url);
}
