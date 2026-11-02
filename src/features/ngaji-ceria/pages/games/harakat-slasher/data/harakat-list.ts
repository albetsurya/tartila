export type SlasherMode = "harakat" | "huruf" | "kata" | "ayat";

export interface SlasherTargetItem {
  id: string;
  name: string;
  symbol: string;
  sound?: string;
  category: SlasherMode;
}

export const SLASHER_MODE_LABELS: Record<SlasherMode, { title: string; subtitle: string }> = {
  harakat: { title: "Harakat", subtitle: "Tebas tanda baca" },
  huruf: { title: "Huruf Hijaiyah", subtitle: "Tebas huruf tunggal" },
  kata: { title: "Kata Mufrodat", subtitle: "Tebas kosa kata Arab" },
  ayat: { title: "Potongan Ayat", subtitle: "Tebas lafaz & ayat Al-Qur'an" },
};

// Mode 1: Harakat
export const HARAKAT_LIST: readonly SlasherTargetItem[] = [
  { id: "fathah", name: "Fathah", symbol: "بَ", sound: "a", category: "harakat" },
  { id: "kasrah", name: "Kasrah", symbol: "بِ", sound: "i", category: "harakat" },
  { id: "dhammah", name: "Dhammah", symbol: "بُ", sound: "u", category: "harakat" },
  { id: "sukun", name: "Sukun", symbol: "بْ", sound: "mati", category: "harakat" },
  { id: "fathatain", name: "Fathatain", symbol: "بً", sound: "an", category: "harakat" },
  { id: "kasratain", name: "Kasratain", symbol: "بٍ", sound: "in", category: "harakat" },
  { id: "dhammatain", name: "Dhammatain", symbol: "بٌ", sound: "un", category: "harakat" },
] as const;

// Mode 2: Huruf Hijaiyah
export const HURUF_LIST: readonly SlasherTargetItem[] = [
  { id: "alif", name: "Alif", symbol: "ا", category: "huruf" },
  { id: "ba", name: "Ba", symbol: "ب", category: "huruf" },
  { id: "ta", name: "Ta", symbol: "ت", category: "huruf" },
  { id: "tsa", name: "Tsa", symbol: "ث", category: "huruf" },
  { id: "jim", name: "Jim", symbol: "ج", category: "huruf" },
  { id: "ha", name: "Ha", symbol: "ح", category: "huruf" },
  { id: "kha", name: "Kha", symbol: "خ", category: "huruf" },
  { id: "dal", name: "Dal", symbol: "د", category: "huruf" },
  { id: "dzal", name: "Dzal", symbol: "ذ", category: "huruf" },
  { id: "ra", name: "Ra", symbol: "ر", category: "huruf" },
  { id: "zai", name: "Zai", symbol: "ز", category: "huruf" },
  { id: "sin", name: "Sin", symbol: "س", category: "huruf" },
  { id: "syin", name: "Syin", symbol: "ش", category: "huruf" },
  { id: "shad", name: "Shad", symbol: "ص", category: "huruf" },
  { id: "dhad", name: "Dhad", symbol: "ض", category: "huruf" },
  { id: "tha", name: "Tha", symbol: "ط", category: "huruf" },
  { id: "zha", name: "Zha", symbol: "ظ", category: "huruf" },
  { id: "ain", name: "'Ain", symbol: "ع", category: "huruf" },
  { id: "ghain", name: "Ghain", symbol: "غ", category: "huruf" },
  { id: "fa", name: "Fa", symbol: "ف", category: "huruf" },
  { id: "qaf", name: "Qaf", symbol: "ق", category: "huruf" },
  { id: "kaf", name: "Kaf", symbol: "ك", category: "huruf" },
  { id: "lam", name: "Lam", symbol: "ل", category: "huruf" },
  { id: "mim", name: "Mim", symbol: "م", category: "huruf" },
  { id: "nun", name: "Nun", symbol: "ن", category: "huruf" },
  { id: "waw", name: "Waw", symbol: "و", category: "huruf" },
  { id: "ha_besar", name: "Ha'", symbol: "هـ", category: "huruf" },
  { id: "ya", name: "Ya", symbol: "ي", category: "huruf" },
] as const;

// Mode 3: Kata Mufrodat
export const KATA_LIST: readonly SlasherTargetItem[] = [
  { id: "kitab", name: "Kitabun (Buku)", symbol: "كِتَابٌ", category: "kata" },
  { id: "qalam", name: "Qalamun (Pena)", symbol: "قَلَمٌ", category: "kata" },
  { id: "bait", name: "Baitun (Rumah)", symbol: "بَيْتٌ", category: "kata" },
  { id: "masjid", name: "Masjidun (Masjid)", symbol: "مَسْجِدٌ", category: "kata" },
  { id: "bab", name: "Babun (Pintu)", symbol: "بَابٌ", category: "kata" },
  { id: "qalb", name: "Qalbun (Hati)", symbol: "قَلْبٌ", category: "kata" },
  { id: "nur", name: "Nurun (Cahaya)", symbol: "نُوْرٌ", category: "kata" },
  { id: "salam", name: "Salamun (Damai)", symbol: "سَلَامٌ", category: "kata" },
  { id: "ilm", name: "'Ilmun (Ilmu)", symbol: "عِلْمٌ", category: "kata" },
  { id: "rizq", name: "Rizqun (Rezeki)", symbol: "رِزْقٌ", category: "kata" },
  { id: "shalah", name: "Shalatun (Salat)", symbol: "صَلَاةٌ", category: "kata" },
  { id: "jannah", name: "Jannatun (Surga)", symbol: "جَنَّةٌ", category: "kata" },
] as const;

// Mode 4: Potongan Ayat
export const AYAT_LIST: readonly SlasherTargetItem[] = [
  { id: "bismillah", name: "Bismillah", symbol: "بِسْمِ اللَّهِ", category: "ayat" },
  { id: "alhamdulillah", name: "Alhamdulillah", symbol: "الْحَمْدُ لِلَّهِ", category: "ayat" },
  { id: "min_syarri", name: "Min Syarri", symbol: "مِنْ شَرِّ", category: "ayat" },
  { id: "rabbil_alamin", name: "Rabbil 'Alamin", symbol: "رَبِّ الْعَالَمِينَ", category: "ayat" },
  { id: "qul_huwa", name: "Qul Huwallahu", symbol: "قُلْ هُوَ اللَّهُ", category: "ayat" },
  { id: "maliki_yawm", name: "Maliki Yawmi", symbol: "مَالِكِ يَوْمِ", category: "ayat" },
  { id: "iyyaka_na'budu", name: "Iyyaka Na'budu", symbol: "إِيَّاكَ نَعْبُدُ", category: "ayat" },
  { id: "ihdina", name: "Ihdinash Shiratha", symbol: "اهْدِنَا الصِّرَاطَ", category: "ayat" },
  { id: "fi_shudur", name: "Fi Shuduri", symbol: "فِي صُدُورِ", category: "ayat" },
  { id: "minal_jinnah", name: "Minal Jinnati", symbol: "مِنَ الْجِنَّةِ", category: "ayat" },
] as const;

export function getSlasherItems(mode: SlasherMode): readonly SlasherTargetItem[] {
  switch (mode) {
    case "huruf":
      return HURUF_LIST;
    case "kata":
      return KATA_LIST;
    case "ayat":
      return AYAT_LIST;
    case "harakat":
    default:
      return HARAKAT_LIST;
  }
}

export type HarakatId = string;
export type PowerUpType = "magnet" | "slowmo" | "shield";
export const POWER_UP_LABELS = { magnet: "Magnet", slowmo: "Gerak lambat", shield: "Perisai" };
