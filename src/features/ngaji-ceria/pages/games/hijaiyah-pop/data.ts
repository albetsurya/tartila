/**
 * Data game "Hijaiyah Harvest" (Hijaiyah Pop transformasi).
 * Mengambil data kata dari Tilawati Jilid 1-6.
 */
import { loadTilawatiDataset } from "@/features/ngaji-ceria/data/tilawatiPageDatasets";

/** Huruf Arab dasar (bukan harakat) */
function isArabicLetter(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x0621 && code <= 0x064A) || (code >= 0x0660 && code <= 0x066F);
}

/** Semua tanda baca/huruf yang harus dipisah */
function isArabicDiacritic(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x064B && code <= 0x065F) || code === 0x0670 || code === 0x0671;
}

/**
 * Pecah teks Arab menjadi array huruf (letter + harakat).
 * Contoh: "بِسْمِ" -> ["بِ", "سْ", "مِ"]
 * Menjaga harakat agar tidak hilang.
 */
function splitArabicToLetters(text: string): string[] {
  const result: string[] = [];
  let current = "";

  for (const char of text) {
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
    } else if (char === "=") {
      // Tanda "=" di antara pilihan, abaikan
      if (current) {
        result.push(current);
        current = "";
      }
    } else if (char === "◘") {
      // Simbol waqaf (misalnya ◘، ؛)
      if (current) {
        result.push(current);
        current = "";
      }
    }
  }

  if (current) result.push(current);
  return result;
}

/** Minimal huruf untuk satu kata yang valid */
const MIN_LETTERS_PER_WORD = 1;

/** Jumlah kata minimum per level */
const MIN_WORDS_PER_LEVEL = 25;

export interface LevelConfig {
  id: number;
  title: string;
  desc: string;
  isWord: boolean;
}

/** Kurikulum level untuk game Hijaiyah Harvest */
export const LEVELS: LevelConfig[] = [
  { id: 1, title: "Huruf Lepas", desc: "2-3 Huruf", isWord: false },
  { id: 2, title: "Kata Sambung", desc: "3 Huruf", isWord: true },
  { id: 3, title: "Kata Sambung", desc: "2 Kata (3 Huruf)", isWord: true },
  { id: 4, title: "Kata Sambung", desc: "Kata Panjang", isWord: true },
  { id: 5, title: "Kata Sambung", desc: "2 Kata Panjang", isWord: true },
  { id: 6, title: "Kata Sambung", desc: "Tantangan Akhir", isWord: true },
];

/** Ambil kata acak dari array */
function pickRandom<T>(items: T[], count: number): T[] {
  if (items.length <= count) return [...items];
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Fallback kata per level (0-indexed), sesuai batasan panjang tiap level. */
export function getFallbackWords(levelIndex: number): string[][] {
  const twoLetters = [
    ["ا", "ب"],
    ["ت", "ت"],
    ["د", "د"],
    ["س", "س"],
    ["ع", "ع"],
    ["ف", "ف"],
    ["ل", "ل"],
    ["ن", "ن"],
    ["و", "و"],
    ["ي", "ي"],
  ];
  const threeLetters = [
    ["ب", "ا", "ب"],
    ["م", "ا", "ت"],
    ["ن", "ا", "ر"],
    ["ق", "ل", "م"],
    ["ت", "ي", "ن"],
    ["ج", "ي", "ل"],
  ];
  const fourOrFive = [
    ["ا", "ل", "ل", "ه"],
    ["ك", "ت", "ا", "ب"],
    ["ج", "ا", "م", "ي"],
    ["ا", "ل", "م", "ا", "س"],
    ["ق", "م", "ي", "ن"],
  ];
  const sixPlus = [
    ["م", "س", "ا", "ف", "ر", "ة"],
    ["ج", "م", "ع", "ي", "ة"],
    ["م", "ص", "ن", "و", "ع", "ا", "ت"],
    ["ط", "ل", "ب", "ة", "ك", "م"],
  ];

  switch (levelIndex) {
    case 0:
      return twoLetters;
    case 1:
      return threeLetters;
    case 2:
      // Dua kata masing-masing tepat 3 huruf
      return [
        [...threeLetters[0], ...threeLetters[1]],
        [...threeLetters[2], ...threeLetters[3]],
        [...threeLetters[4], ...threeLetters[5]],
        [...threeLetters[1], ...threeLetters[2]],
        [...threeLetters[3], ...threeLetters[0]],
      ];
    case 3:
      return fourOrFive;
    case 4:
      // Dua kata masing-masing 4-5 huruf
      return [
        [...fourOrFive[0], ...fourOrFive[1]],
        [...fourOrFive[2], ...fourOrFive[3]],
        [...fourOrFive[4], ...fourOrFive[0]],
        [...fourOrFive[1], ...fourOrFive[2]],
      ];
    case 5:
      return sixPlus;
    default:
      return twoLetters;
  }
}

/**
 * Ambil semua kata (array huruf) dari dataset jilid.
 */
async function collectWordsFromDataset(jilid: number): Promise<string[][]> {
  try {
    const dataset = await loadTilawatiDataset(jilid);
    const words: string[][] = [];
    for (const page of Object.values(dataset)) {
      for (const q of page.questions) {
        const arabic = (q.arabic || "").trim();
        if (!arabic) continue;

        // Bersihkan teks: hapus tanda "=" dan waqaf
        const cleaned = arabic
          .replace(/\s*=\s*/g, " ")
          .replace(/[○ۚ⁖ۗۘۙ]/g, "")
          .replace(/\s+/g, " ")
          .trim();

        if (!cleaned) continue;

        const letters = splitArabicToLetters(cleaned);

        // Minimal huruf untuk permainan susun kata
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
 * Ambil kata untuk level tertentu (0-indexed).
 * Setiap kata adalah array huruf (dengan harakat).
 *
 * Progresi gradual berdasarkan batas panjang huruf:
 * - Level 1: 2-3 huruf
 * - Level 2: tepat 3 huruf
 * - Level 3: gabungan 2 kata masing-masing tepat 3 huruf
 * - Level 4: 4-5 huruf
 * - Level 5: gabungan 2 kata masing-masing 4-5 huruf
 * - Level 6: >= 6 huruf
 */

/** Batas panjang huruf per level (0-indexed): [min, max] — max null = tanpa batas atas. */
const LEVEL_WORD_LENGTHS: [number, number | null][] = [
  [2, 3],
  [3, 3],
  [3, 3],
  [4, 5],
  [4, 5],
  [6, null],
];

/** Gabungkan setiap 2 kata berbeda menjadi satu target (maks 100 kombinasi). */
function combineWordPairs(words: string[][]): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < words.length && out.length < 100; i++) {
    for (let j = i + 1; j < words.length && out.length < 100; j++) {
      out.push([...words[i], ...words[j]]);
    }
  }
  return out;
}

export async function getWordsForLevel(levelIndex: number): Promise<string[][]> {
  const jilid = Math.min(levelIndex + 1, LEVELS.length); // level 1 = jilid 1
  const [min, max] = LEVEL_WORD_LENGTHS[levelIndex] ?? [3, null];

  const allWords = await collectWordsFromDataset(jilid);

  // Filter ketat panjang huruf sesuai level
  const filteredWords = allWords.filter(
    (w) => w.length >= min && (max === null || w.length <= max),
  );

  // Gabungan 2 kata (Level 3 & 5)
  let finalWords = filteredWords;
  if (levelIndex === 2 || levelIndex === 4) {
    const pairs = combineWordPairs(filteredWords);
    if (pairs.length > 0) finalWords = pairs;
  }

  // Dataset/filter gagal dipenuhi -> fallback per level
  if (finalWords.length === 0) {
    finalWords = getFallbackWords(levelIndex);
  }

  return pickRandom(finalWords, Math.max(MIN_WORDS_PER_LEVEL, finalWords.length));
}