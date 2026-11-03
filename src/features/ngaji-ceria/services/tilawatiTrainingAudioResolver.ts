/**
 * Centralized Audio Resolver for Tilawati Training Modules
 * (Lab Irama, Rhythm Memory, Arena Kartu).
 * 
 * SSOT Audio Tilawati: /audio/tilawati/jilid_X/halY/...
 */

export interface TrainingAudioOptions {
  jilid: number;
  halaman?: number;
  tipe?: string;
  fallbackUrl?: string;
}

/**
 * Resolves Tilawati training audio URL.
 * Supports positional parameters or direct fallback passthrough.
 */
export function resolveTrainingAudio(
  jilid: number,
  halaman: number = 1,
  tipe?: string,
  fallbackUrl?: string,
): string {
  if (fallbackUrl) {
    return fallbackUrl;
  }

  if (!tipe) {
    return `/audio/tilawati/jilid_${jilid}/hal${halaman}/hal${halaman}_baris_01.ogg`;
  }

  // Jika sudah merupakan path lengkap
  if (tipe.startsWith("/") || tipe.startsWith("http")) {
    return tipe;
  }

  // Jika nama file sudah menyertakan ekstensi audio
  if (tipe.endsWith(".ogg") || tipe.endsWith(".mp3")) {
    return `/audio/tilawati/jilid_${jilid}/hal${halaman}/${tipe}`;
  }

  // Jika tipe berupa baris/header (misal 'baris_01' atau 'header_datar')
  return `/audio/tilawati/jilid_${jilid}/hal${halaman}/hal${halaman}_${tipe}.ogg`;
}
