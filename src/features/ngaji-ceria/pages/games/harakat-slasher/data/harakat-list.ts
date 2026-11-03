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
  const isHarakatCheck =
    target.targetMode === "harakat" ||
    target.category === "harakat" ||
    item.targetMode === "harakat" ||
    item.category === "harakat";

  if (isHarakatCheck) {
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

/**
 * Pemetaan representasi visual netral tanda harakat menggunakan karakter Tatweel (ـ).
 * Mengisolasi tanda baca tanpa terikat huruf konsonan dasar (Bab 6.2 & 6.3).
 */
export const HARAKAT_WORDS: Record<HarakatName, string> = {
  fathah: "ــَ",
  kasrah: "ــِ",
  dhammah: "ــُ",
  sukun: "ــْ",
  fathatain: "ــً",
  kasratain: "ــٍ",
  dhammatain: "ــٌ",
};

/**
 * Definisi tanda harakat murni untuk target mode "harakat" (Bab 6.2 & 6.3).
 * Nama target murni tanda baca ("Fathah", "Kasrah", dll) dengan representasi Tatweel netral.
 * DILARANG menghasilkan nama gabungan spesifik seperti "Ra Sukun" di mode Harakat.
 */
export interface HarakatDefinition {
  harakatName: HarakatName;
  name: string;
  symbol: string;
  exampleLetter: string;
  sound?: string;
}

export const HARAKAT_DEFINITIONS: readonly HarakatDefinition[] = [
  { harakatName: "fathah", name: "Fathah", symbol: HARAKAT_WORDS.fathah, exampleLetter: HARAKAT_WORDS.fathah, sound: "a" },
  { harakatName: "kasrah", name: "Kasrah", symbol: HARAKAT_WORDS.kasrah, exampleLetter: HARAKAT_WORDS.kasrah, sound: "i" },
  { harakatName: "dhammah", name: "Dhammah", symbol: HARAKAT_WORDS.dhammah, exampleLetter: HARAKAT_WORDS.dhammah, sound: "u" },
  { harakatName: "sukun", name: "Sukun", symbol: HARAKAT_WORDS.sukun, exampleLetter: HARAKAT_WORDS.sukun, sound: "mati" },
  { harakatName: "fathatain", name: "Fathatain", symbol: HARAKAT_WORDS.fathatain, exampleLetter: HARAKAT_WORDS.fathatain, sound: "an" },
  { harakatName: "kasratain", name: "Kasratain", symbol: HARAKAT_WORDS.kasratain, exampleLetter: HARAKAT_WORDS.kasratain, sound: "in" },
  { harakatName: "dhammatain", name: "Dhammatain", symbol: HARAKAT_WORDS.dhammatain, exampleLetter: HARAKAT_WORDS.dhammatain, sound: "un" },
];

// Mode 1: Harakat Spawning Pool (variasi huruf hijaiyah berharakat untuk buah yang jatuh)
export const HARAKAT_LIST: readonly SlasherTargetItem[] = [
  // Fathah
  { id: "ba_fathah", name: "Ba Fathah", symbol: "بَ", sound: "ba", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "ta_fathah", name: "Ta Fathah", symbol: "تَ", sound: "ta", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "tsa_fathah", name: "Tsa Fathah", symbol: "ثَ", sound: "tsa", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "jim_fathah", name: "Jim Fathah", symbol: "جَ", sound: "ja", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "ha_fathah", name: "Ha Fathah", symbol: "حَ", sound: "ha", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "dal_fathah", name: "Dal Fathah", symbol: "دَ", sound: "da", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "ra_fathah", name: "Ra Fathah", symbol: "رَ", sound: "ra", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "sin_fathah", name: "Sin Fathah", symbol: "سَ", sound: "sa", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "mim_fathah", name: "Mim Fathah", symbol: "مَ", sound: "ma", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "nun_fathah", name: "Nun Fathah", symbol: "نَ", sound: "na", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  { id: "lam_fathah", name: "Lam Fathah", symbol: "لَ", sound: "la", category: "harakat", targetMode: "harakat", harakatName: "fathah" },
  // Kasrah
  { id: "ba_kasrah", name: "Ba Kasrah", symbol: "بِ", sound: "bi", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "ta_kasrah", name: "Ta Kasrah", symbol: "تِ", sound: "ti", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "tsa_kasrah", name: "Tsa Kasrah", symbol: "ثِ", sound: "tsi", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "jim_kasrah", name: "Jim Kasrah", symbol: "جِ", sound: "ji", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "dal_kasrah", name: "Dal Kasrah", symbol: "دِ", sound: "di", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "ra_kasrah", name: "Ra Kasrah", symbol: "رِ", sound: "ri", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "sin_kasrah", name: "Sin Kasrah", symbol: "سِ", sound: "si", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "mim_kasrah", name: "Mim Kasrah", symbol: "مِ", sound: "mi", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "nun_kasrah", name: "Nun Kasrah", symbol: "نِ", sound: "ni", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  { id: "lam_kasrah", name: "Lam Kasrah", symbol: "لِ", sound: "li", category: "harakat", targetMode: "harakat", harakatName: "kasrah" },
  // Dhammah
  { id: "ba_dhammah", name: "Ba Dhammah", symbol: "بُ", sound: "bu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "ta_dhammah", name: "Ta Dhammah", symbol: "تُ", sound: "tu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "tsa_dhammah", name: "Tsa Dhammah", symbol: "ثُ", sound: "tsu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "jim_dhammah", name: "Jim Dhammah", symbol: "جُ", sound: "ju", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "dal_dhammah", name: "Dal Dhammah", symbol: "دُ", sound: "du", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "ra_dhammah", name: "Ra Dhammah", symbol: "رُ", sound: "ru", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "sin_dhammah", name: "Sin Dhammah", symbol: "سُ", sound: "su", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "mim_dhammah", name: "Mim Dhammah", symbol: "مُ", sound: "mu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "nun_dhammah", name: "Nun Dhammah", symbol: "نُ", sound: "nu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  { id: "lam_dhammah", name: "Lam Dhammah", symbol: "لُ", sound: "lu", category: "harakat", targetMode: "harakat", harakatName: "dhammah" },
  // Sukun
  { id: "ba_sukun", name: "Ba Sukun", symbol: "بْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "ta_sukun", name: "Ta Sukun", symbol: "تْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "dal_sukun", name: "Dal Sukun", symbol: "دْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "ra_sukun", name: "Ra Sukun", symbol: "رْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "sin_sukun", name: "Sin Sukun", symbol: "سْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "mim_sukun", name: "Mim Sukun", symbol: "مْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  { id: "nun_sukun", name: "Nun Sukun", symbol: "نْ", sound: "mati", category: "harakat", targetMode: "harakat", harakatName: "sukun" },
  // Tanwin
  { id: "ba_fathatain", name: "Ba Fathatain", symbol: "بً", sound: "ban", category: "harakat", targetMode: "harakat", harakatName: "fathatain" },
  { id: "ta_fathatain", name: "Ta Fathatain", symbol: "تً", sound: "tan", category: "harakat", targetMode: "harakat", harakatName: "fathatain" },
  { id: "ba_kasratain", name: "Ba Kasratain", symbol: "بٍ", sound: "bin", category: "harakat", targetMode: "harakat", harakatName: "kasratain" },
  { id: "ta_kasratain", name: "Ta Kasratain", symbol: "تٍ", sound: "tin", category: "harakat", targetMode: "harakat", harakatName: "kasratain" },
  { id: "ba_dhammatain", name: "Ba Dhammatain", symbol: "بٌ", sound: "bun", category: "harakat", targetMode: "harakat", harakatName: "dhammatain" },
  { id: "ta_dhammatain", name: "Ta Dhammatain", symbol: "تٌ", sound: "tun", category: "harakat", targetMode: "harakat", harakatName: "dhammatain" },
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

export interface SlasherLevelConfig {
  level: number;
  title: string;
  targetScore: number;
  targetTotal: number;
  durationSeconds: number;
  description: string;
  spawnRate: number; // jeda muncul buah dalam ms
  fallSpeed: number; // kecepatan jatuh (base)
  distractorRatio: number; // persentase buah pengecoh (0.0 - 1.0)
  targetLength: number; // jumlah karakter target
}

export const SLASHER_LEVELS: SlasherLevelConfig[] = [
  {
    level: 1,
    title: "Level 1: Pemula",
    targetScore: 100,
    targetTotal: 10,
    durationSeconds: 60,
    description: "Tebas 10 buah berharakat target dalam 60 detik.",
    spawnRate: 1200,
    fallSpeed: 8,
    distractorRatio: 0.2,
    targetLength: 1,
  },
  {
    level: 2,
    title: "Level 2: Terampil",
    targetScore: 200,
    targetTotal: 12,
    durationSeconds: 60,
    description: "Tebas 12 buah berharakat target dalam 60 detik.",
    spawnRate: 1000,
    fallSpeed: 10,
    distractorRatio: 0.35,
    targetLength: 2,
  },
  {
    level: 3,
    title: "Level 3: Mahir",
    targetScore: 350,
    targetTotal: 15,
    durationSeconds: 60,
    description: "Tebas 15 buah berharakat target dalam 60 detik.",
    spawnRate: 800,
    fallSpeed: 12,
    distractorRatio: 0.5,
    targetLength: 3,
  },
  {
    level: 4,
    title: "Level 4: Pendekar",
    targetScore: 500,
    targetTotal: 18,
    durationSeconds: 60,
    description: "Tebas 18 buah berharakat target dalam 60 detik.",
    spawnRate: 600,
    fallSpeed: 15,
    distractorRatio: 0.65,
    targetLength: 4,
  },
  {
    level: 5,
    title: "Level 5: Master",
    targetScore: 750,
    targetTotal: 20,
    durationSeconds: 60,
    description: "Tebas 20 buah berharakat target dalam 60 detik.",
    spawnRate: 450,
    fallSpeed: 18,
    distractorRatio: 0.75,
    targetLength: 5,
  },
];
