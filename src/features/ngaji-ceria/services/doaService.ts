/**
 * Service untuk memuat data doa & audio eksternal dari API publik:
 * - rn0x/Adhkar-json (GitHub raw)
 * - EQuran.id API
 */

export interface ExternalAdhkar {
  id: number;
  category: string;
  audio?: string;
  filename?: string;
  array: Array<{
    id: number;
    text: string;
    count: number;
    audio?: string;
    filename?: string;
  }>;
}

const ADHKAR_RAW_URL =
  "https://raw.githubusercontent.com/rn0x/Adhkar-json/main/adhkar.json";
const ADHKAR_AUDIO_BASE =
  "https://raw.githubusercontent.com/rn0x/Adhkar-json/main";

let cachedAdhkar: ExternalAdhkar[] | null = null;

export async function fetchAdhkarData(): Promise<ExternalAdhkar[]> {
  if (cachedAdhkar) return cachedAdhkar;
  try {
    const res = await fetch(ADHKAR_RAW_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ExternalAdhkar[] = await res.json();
    cachedAdhkar = data;
    return data;
  } catch (err) {
    console.warn("Gagal memuat adhkar dari repository rn0x:", err);
    return [];
  }
}

/**
 * Mencari URL audio doa yang sesuai dari dataset eksternal jika tersedia.
 */
export async function getDoaAudioUrl(doaId: string, title: string): Promise<string | null> {
  // 1. Cek Quranic doa via CDN EveryAyah / EQuran
  if (doaId === "al-ikhlas") return "https://everyayah.com/data/Alafasy_128kbps/112001.mp3";
  if (doaId === "al-falaq") return "https://everyayah.com/data/Alafasy_128kbps/113001.mp3";
  if (doaId === "an-nas") return "https://everyayah.com/data/Alafasy_128kbps/114001.mp3";
  if (doaId === "ayat-kursi") return "https://everyayah.com/data/Alafasy_128kbps/002255.mp3";
  if (doaId === "kebaikan-dunia-akhirat") return "https://everyayah.com/data/Alafasy_128kbps/002201.mp3";

  // 2. Cek dari adhkar.json repo
  try {
    const adhkar = await fetchAdhkarData();
    const cleanTitle = title.toLowerCase();

    for (const group of adhkar) {
      if (group.audio && cleanTitle.includes(group.category.toLowerCase())) {
        return `${ADHKAR_AUDIO_BASE}${group.audio}`;
      }
      for (const item of group.array || []) {
        if (item.audio) {
          return `${ADHKAR_AUDIO_BASE}${item.audio}`;
        }
      }
    }
  } catch {
    // fallback
  }

  return null;
}
