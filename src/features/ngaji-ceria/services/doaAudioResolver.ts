const API_AUDIO_BASE = "https://quranapi.misryoum.com/audio";

const DOA_AUDIO_MAP: Record<string, string> = {
  // Pagi & Sore
  "doa-39": "75.mp3", "doa-58": "75.mp3",
  "doa-40": "76.mp3", "doa-59": "76.mp3",
  "doa-41": "76.mp3", "doa-60": "76.mp3",
  "doa-42": "76.mp3", "doa-61": "76.mp3",
  "doa-43": "77.mp3", "doa-62": "77.mp3",
  "doa-44": "78.mp3", "doa-63": "78.mp3",
  "doa-45": "79.mp3", "doa-64": "79.mp3",
  "doa-46": "82.mp3", "doa-65": "82.mp3",
  "doa-47": "84.mp3", "doa-66": "84.mp3",
  "doa-48": "85.mp3", "doa-67": "85.mp3",
  "doa-49": "86.mp3", "doa-68": "86.mp3",
  "doa-50": "87.mp3", "doa-69": "87.mp3",
  "doa-51": "88.mp3", "doa-70": "88.mp3",
  "doa-52": "89.mp3", "doa-71": "89.mp3",
  "doa-53": "92.mp3", "doa-72": "92.mp3",
  "doa-54": "94.mp3", "doa-73": "94.mp3",
  "doa-55": "95.mp3",
  "doa-56": "91.mp3", "doa-74": "91.mp3",
  "doa-57": "96.mp3", "doa-75": "96.mp3",
  "doa-76": "97.mp3",
  // Harian
  "harian-wc-masuk": "10.mp3",
  "harian-wc-keluar": "11.mp3",
  "harian-rumah-keluar": "16.mp3",
  "harian-rumah-masuk": "18.mp3",
  "harian-masjid-masuk": "20.mp3",
  "harian-masjid-keluar": "21.mp3",
  "harian-pakaian-memakai": "5.mp3",
  "harian-pakaian-melepas": "9.mp3",
  "harian-tidur-bangun": "1.mp3",
  // Alias mapping untuk DOA_LIST explore
  "masuk-wc": "10.mp3",
  "keluar-wc": "11.mp3",
  "keluar-rumah": "16.mp3",
  "masuk-rumah": "18.mp3",
  "masuk-masjid": "20.mp3",
  "keluar-masjid": "21.mp3",
  "memakai-pakaian": "5.mp3",
  "melepas-pakaian": "9.mp3",
  "bangun-tidur": "1.mp3",
  "ayat-kursi": "75.mp3",
  "al-ikhlas": "76.mp3",
  "al-falaq": "76.mp3",
  "an-nas": "76.mp3",
};

export function resolveDoaAudio(doaId: string): string | null {
  const filename = DOA_AUDIO_MAP[doaId];
  return filename ? `${API_AUDIO_BASE}/${filename}` : null;
}
