/**
 * Data provider untuk game "Hijaiyah Harvest" (Integrasi SSOT Tilawati Jilid 1-6).
 * Mengambil teks Arab utuh langsung dari dataset Tilawati tanpa penggabungan acak.
 */
import { loadJilidPages } from "./tilawatiPageDatasets";

/** Huruf Arab dasar (bukan harakat) */
function isArabicLetter(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x0621 && code <= 0x064A) || (code >= 0x0660 && code <= 0x066F);
}

/** Semua tanda baca/harakat yang harus dipisah bersama huruf */
function isArabicDiacritic(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x064B && code <= 0x065F) || code === 0x0670 || code === 0x0671;
}

/**
 * Pecah teks Arab utuh menjadi array huruf (setiap item: 1 huruf + harakat terkait).
 * Contoh: "بِسْمِ" -> ["بِ", "سْ", "مِ"]
 * Menjaga integritas harakat dan membuang tatweel serta pemisah kata.
 */
export function splitArabicToLetters(text: string): string[] {
  const result: string[] = [];
  let current = "";

  for (const char of text) {
    if (char === "\u0640") {
      // Abaikan karakter Tatweel agar bentuk huruf tetap murni isolasi/mandiri
      continue;
    }
    if (isArabicLetter(char)) {
      if (current) result.push(current);
      current = char;
    } else if (isArabicDiacritic(char) && current) {
      current += char;
    } else if (char === " " || char === "\n" || char === "\t" || char === "\r") {
      if (current) {
        result.push(current);
        current = "";
      }
    } else if (char === "=" || char === "◘") {
      // Abaikan pemisah latihan atau simbol waqaf
      if (current) {
        result.push(current);
        current = "";
      }
    }
  }

  if (current) result.push(current);
  return result;
}

/** Minimal huruf untuk satu kata/frasa yang valid */
const MIN_LETTERS_PER_WORD = 2;

/** Jumlah kata minimum per level */
const MIN_WORDS_PER_LEVEL = 25;

export interface LevelConfig {
  id: number;
  title: string;
  desc: string;
  isWord: boolean;
  targetScore: number;
  durationSeconds: number;
}

/** Kurikulum level untuk game Hijaiyah Harvest */
export const LEVELS: LevelConfig[] = [
  { id: 1, title: "Huruf Lepas", desc: "2-3 Huruf", isWord: false, targetScore: 300, durationSeconds: 60 },
  { id: 2, title: "Kata Sambung", desc: "3 Huruf", isWord: true, targetScore: 500, durationSeconds: 60 },
  { id: 3, title: "Kata Sambung", desc: "Kata Sedang", isWord: true, targetScore: 700, durationSeconds: 75 },
  { id: 4, title: "Kata Sambung", desc: "Kata Bertasydid", isWord: true, targetScore: 1000, durationSeconds: 75 },
  { id: 5, title: "Kata Sambung", desc: "Frasa 2 Kata", isWord: true, targetScore: 1200, durationSeconds: 90 },
  { id: 6, title: "Kata Sambung", desc: "Tantangan Akhir", isWord: true, targetScore: 1500, durationSeconds: 90 },
];

/**
 * Batas panjang huruf per level (0-indexed): [min, max] — max null = tanpa batas atas.
 * Disesuaikan langsung dengan panjang frasa utuh dari Al-Qur'an / Tilawati:
 * - Level 0 (Jilid 1): 2-3 huruf lepas
 * - Level 1 (Jilid 2): 3-4 huruf kata sambung pendek
 * - Level 2 (Jilid 3): 4-6 huruf kata sambung berharakat sukun
 * - Level 3 (Jilid 4): 4-8 huruf kata bertasydid / kata sedang
 * - Level 4 (Jilid 5): 5-12 huruf frasa 2 kata tajwid
 * - Level 5 (Jilid 6): 6-16 huruf ayat pendek Al-Qur'an
 */
export const LEVEL_WORD_LENGTHS: [number, number | null][] = [
  [2, 3],
  [3, 4],
  [4, 6],
  [4, 8],
  [5, 12],
  [6, 16],
];

/** Ambil frasa acak dari array */
function pickRandom<T>(items: T[], count: number): T[] {
  if (items.length <= count) return [...items];
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Data fallback frasa Arab otentik Al-Qur'an dan bacaan sholat per level (0-indexed).
 * Tidak menggunakan kombinasi kata buatan acak.
 */
export function getFallbackWords(levelIndex: number): string[][] {
  const level1Phrases = ["اَ بَ", "تَ ثَ", "جَ حَ", "دَ ذَ", "رَ زَ", "سَ شَ", "قُلْ", "هُوَ"];
  const level2Phrases = ["اَحَدٌ", "صَمَدُ", "فَلَقِ", "وَقَبَ", "حَسَدَ", "كُتِبَ", "خَلَقَ"];
  const level3Phrases = ["حَمَلْنَا", "فَقُلْنَا", "اَنْعَمْتَ", "يَعْلَمُوْنَ", "نَسْتَعِيْنُ", "مُسْتَقِيْمَ"];
  const level4Phrases = ["اَلصَّمَدُ", "اَلْفَلَقِ", "اَلْخَنَّاسِ", "وَالصَّيْفِ", "اَلْمَغْضُوْبِ", "اَلضَّالِّيْنَ"];
  const level5Phrases = [
    "بِسْمِ اللّٰهِ",
    "اَلْحَمْدُ لِلّٰهِ",
    "رَبِّ الْعٰلَمِيْنَ",
    "مٰلِكِ يَوْمِ الدِّيْنِ",
    "اِيَّاكَ نَعْبُدُ",
    "سُبْحَانَ اللّٰهِ",
  ];
  const level6Phrases = [
    "قُلْ هُوَ اللّٰهُ اَحَدٌ",
    "قُلْ اَعُوْذُ بِرَبِّ النَّاسِ",
    "قُلْ اَعُوْذُ بِرَبِّ الْفَلَقِ",
    "اَللّٰهُ لَا اِلٰهَ اِلَّا هُوَ",
    "اِنَّا اَعْطَيْنٰكَ الْكَوْثَرَ",
  ];

  let rawList: string[];
  switch (levelIndex) {
    case 0:
      rawList = level1Phrases;
      break;
    case 1:
      rawList = level2Phrases;
      break;
    case 2:
      rawList = level3Phrases;
      break;
    case 3:
      rawList = level4Phrases;
      break;
    case 4:
      rawList = level5Phrases;
      break;
    case 5:
      rawList = level6Phrases;
      break;
    default:
      rawList = level1Phrases;
      break;
  }

  return rawList.map((p) => splitArabicToLetters(p));
}

/**
 * Ambil semua frasa utuh (sebagai array huruf) langsung dari dataset Tilawati Jilid tertentu.
 * Teks diambil sebagai satu kesatuan frasa (q.arabic utuh), bukan dipisah lalu digabung acak.
 */
export async function collectWordsFromDataset(jilid: number): Promise<string[][]> {
  try {
    const dataset = await loadJilidPages(jilid);
    const words: string[][] = [];

    for (const page of Object.values(dataset)) {
      for (const q of page.questions) {
        // Lewati baris pembuka / instruksi yang bukan materi kuis
        if (q.isOpening || q.isListenOnly) continue;

        const arabic = (q.arabic || "").trim();
        if (!arabic) continue;

        // Bersihkan teks: hilangkan baris baru, tanda waqaf, angka ayat, dan pemisah
        const cleaned = arabic
          .replace(/[\n\r]+/g, " ")
          .replace(/[○ۚ⁖ۗۘۙ،؛=◘\u0660-\u06690-9\u06D6-\u06ED]/g, "")
          .replace(/\s+/g, " ")
          .trim();

        if (!cleaned) continue;

        // Jangan masukkan header basmalah panjang yang sering berulang
        if (cleaned.startsWith("بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ")) continue;

        const letters = splitArabicToLetters(cleaned);

        if (letters.length >= MIN_LETTERS_PER_WORD) {
          words.push(letters);
        }
      }
    }
    return words;
  } catch {
    return [];
  }
}

/**
 * Ambil kata/frasa untuk level tertentu (0-indexed).
 * Menghubungkan Level 0 -> Jilid 1, Level 1 -> Jilid 2, dst.
 * Frasa disaring berdasarkan panjang huruf aslinya tanpa penggabungan kata acak.
 */
export async function getWordsForLevel(levelIndex: number): Promise<string[][]> {
  const jilid = Math.min(Math.max(1, levelIndex + 1), LEVELS.length);
  const [min, max] = LEVEL_WORD_LENGTHS[levelIndex] ?? [3, null];

  const allWords = await collectWordsFromDataset(jilid);

  // Filter panjang huruf sesuai kurikulum level pada frasa utuh
  let finalWords = allWords.filter(
    (w) => w.length >= min && (max === null || w.length <= max),
  );

  // Jika dataset jilid belum memuat atau tidak ada yang lolos filter, gunakan fallback otentik
  if (finalWords.length === 0) {
    finalWords = getFallbackWords(levelIndex);
  }

  return pickRandom(finalWords, Math.max(MIN_WORDS_PER_LEVEL, finalWords.length));
}
