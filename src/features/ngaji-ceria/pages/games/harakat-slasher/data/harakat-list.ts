import { normalizeArabicText } from "@/utils/arabic";

export type SlasherMode = "harakat" | "huruf" | "kata" | "ayat";
export type HarakatName =
  | "fathah"
  | "kasrah"
  | "dhammah"
  | "sukun"
  | "fathatain"
  | "kasratain"
  | "dhammatain";
export type HarakatTargetMode = "harakat" | "syllable";

export interface SlasherTargetItem {
  id: string;
  name: string;
  symbol: string;
  sound?: string;
  category: SlasherMode;
  targetMode?: HarakatTargetMode;
  harakatName?: HarakatName;
}

export const HARAKAT_CHAR_MAP: Record<string, HarakatName> = {
  "\u064E": "fathah",      // َ Fathah
  "\u0650": "kasrah",      // ِ Kasrah
  "\u064F": "dhammah",     // ُ Dhammah
  "\u0652": "sukun",       // ْ Sukun
  "\u064B": "fathatain",   // ً Fathatain
  "\u064D": "kasratain",   // ٍ Kasratain
  "\u064C": "dhammatain",  // ٌ Dhammatain
};

/** Mengekstrak harakat pertama yang ditemukan dari teks Arab */
export function extractHarakat(text?: string | null): HarakatName | null {
  if (!text) return null;
  for (const ch of text) {
    if (HARAKAT_CHAR_MAP[ch]) {
      return HARAKAT_CHAR_MAP[ch];
    }
  }
  return null;
}

/**
 * Memeriksa kecocokan target tebasan:
 * - mode === "harakat": tebas huruf apa saja dengan harakat sama dianggap BENAR.
 * - mode === "syllable" / lainnya: tebas huruf/kata/ayat dengan teks SAMA PERSIS.
 */
export function matchesSlasherTarget(
  target: SlasherTargetItem,
  item: SlasherTargetItem
): boolean {
  const mode =
    target.targetMode ?? (target.category === "harakat" ? "harakat" : "syllable");

  if (mode === "harakat") {
    const targetHarakat =
      target.harakatName ?? extractHarakat(target.symbol);
    const itemHarakat =
      item.harakatName ?? extractHarakat(item.symbol);
    if (targetHarakat && itemHarakat) {
      return targetHarakat === itemHarakat;
    }
  }

  return normalizeArabicText(target.symbol) === normalizeArabicText(item.symbol);
}

export const SLASHER_MODE_LABELS: Record<SlasherMode, { title: string; subtitle: string }> = {
  harakat: { title: "Harakat", subtitle: "Tebas tanda baca" },
  huruf: { title: "Huruf Hijaiyah", subtitle: "Tebas huruf tunggal" },
  kata: { title: "Kata Mufrodat", subtitle: "Tebas kosa kata Arab" },
  ayat: { title: "Potongan Ayat", subtitle: "Tebas lafaz & ayat Al-Qur'an" },
};

// Mode 1: Harakat
export const HARAKAT_LIST: readonly SlasherTargetItem[] = [
  // Fathah
  { id: "fathah", name: "Ba Fathah", symbol: "بَ", sound: "ba", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "ta_fathah", name: "Ta Fathah", symbol: "تَ", sound: "ta", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "tsa_fathah", name: "Tsa Fathah", symbol: "ثَ", sound: "tsa", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "jim_fathah", name: "Jim Fathah", symbol: "جَ", sound: "ja", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "ha_fathah", name: "Ha Fathah", symbol: "حَ", sound: "ha", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "dal_fathah", name: "Dal Fathah", symbol: "دَ", sound: "da", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "ra_fathah", name: "Ra Fathah", symbol: "رَ", sound: "ra", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  // Kasrah
  { id: "kasrah", name: "Ba Kasrah", symbol: "بِ", sound: "bi", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "ta_kasrah", name: "Ta Kasrah", symbol: "تِ", sound: "ti", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "tsa_kasrah", name: "Tsa Kasrah", symbol: "ثِ", sound: "tsi", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "jim_kasrah", name: "Jim Kasrah", symbol: "جِ", sound: "ji", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "dal_kasrah", name: "Dal Kasrah", symbol: "دِ", sound: "di", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "ra_kasrah", name: "Ra Kasrah", symbol: "رِ", sound: "ri", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  // Dhammah
  { id: "dhammah", name: "Ba Dhammah", symbol: "بُ", sound: "bu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "ta_dhammah", name: "Ta Dhammah", symbol: "تُ", sound: "tu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "tsa_dhammah", name: "Tsa Dhammah", symbol: "ثُ", sound: "tsu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "jim_dhammah", name: "Jim Dhammah", symbol: "جُ", sound: "ju", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "dal_dhammah", name: "Dal Dhammah", symbol: "دُ", sound: "du", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "ra_dhammah", name: "Ra Dhammah", symbol: "رُ", sound: "ru", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  // Sukun
  { id: "sukun", name: "Ba Sukun", symbol: "بْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "ta_sukun", name: "Ta Sukun", symbol: "تْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "dal_sukun", name: "Dal Sukun", symbol: "دْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "ra_sukun", name: "Ra Sukun", symbol: "رْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  // Tanwin
  { id: "fathatain", name: "Ba Fathatain", symbol: "بً", sound: "ban", category: "harakat", targetMode: "harakat", harakatName: "fathatain" },
  { id: "kasratain", name: "Ba Kasratain", symbol: "بٍ", sound: "bin", category: "harakat", targetMode: "harakat", harakatName: "kasratain" },
  { id: "dhammatain", name: "Ba Dhammatain", symbol: "بٌ", sound: "bun", category: "harakat", targetMode: "harakat", harakatName: "dhammatain" },
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
