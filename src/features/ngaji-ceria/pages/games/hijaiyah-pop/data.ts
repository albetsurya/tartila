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

/** Fallback kata bila dataset tidak tersedia */
function getFallbackWords(jilid: number): string[][] {
  const fallbackBase: string[][] = [
    ["ا", "ب"],
    ["ا", "ا"],
    ["ب", "ب"],
    ["ت", "ت"],
    ["ث", "ث"],
    ["ح", "ح"],
    ["خ", "خ"],
    ["د", "د"],
    ["ذ", "ذ"],
    ["ر", "ر"],
    ["ز", "ز"],
    ["س", "س"],
    ["ش", "ش"],
    ["ص", "ص"],
    ["ض", "ض"],
    ["ط", "ط"],
    ["ظ", "ظ"],
    ["ع", "ع"],
    ["غ", "غ"],
    ["ف", "ف"],
    ["ق", "ق"],
    ["ك", "ك"],
    ["ل", "ل"],
    ["م", "م"],
    ["ن", "ن"],
    ["ه", "ه"],
    ["و", "و"],
    ["ي", "ي"],
  ];
  return jilid >= 4 ? [...fallbackBase, ["ال", "له"], ["بِس", "مِ"]] : fallbackBase;
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
 * Mengembalikan minimal 20 kata acak.
 * Setiap kata adalah array huruf (dengan harakat).
 * 
 * Level 1 (isWord: false): 2-3 huruf per kata
 * Level 2-5 (isWord: true): 3+ huruf per kata
 * Level 3 & 5 (2 kata): menggabungkan 2 kata menjadi 1 target
 */
export async function getWordsForLevel(levelIndex: number): Promise<string[][]> {
  const jilid = levelIndex + 1; // level 1 = jilid 1
  const levelConfig = LEVELS[levelIndex];
  const isWord = levelConfig?.isWord ?? true;
  
  let allWords = await collectWordsFromDataset(jilid);

  // Jika dataset tidak tersedia, kembalikan data fallback
  if (allWords.length === 0) {
    allWords = getFallbackWords(jilid);
  }

  // Filter berdasarkan level
  let filteredWords: string[][] = [];
  
  if (!isWord) {
    // Level 1: Huruf Lepas - 2-3 huruf per kata
    filteredWords = allWords.filter(w => w.length >= 2 && w.length <= 3);
  } else if (levelIndex === 2) {
    // Level 3: 2 Kata Sambung (3 huruf masing-masing) - gabung jadi 6 huruf
    const twoWordTargets = allWords
      .filter(w => w.length === 3)
      .flatMap(w1 => 
        allWords
          .filter(w2 => w2.length === 3 && w2 !== w1)
          .map(w2 => [...w1, ...w2])
      )
      .slice(0, 100);
    return pickRandom(twoWordTargets.length > 0 ? twoWordTargets : allWords, Math.max(MIN_WORDS_PER_LEVEL / 2, 15));
  } else if (levelIndex === 4) {
    // Level 5: 2 Kata Panjang - gabung 2 kata
    const twoWordTargets = allWords
      .filter(w => w.length >= 5)
      .flatMap(w1 => 
        allWords
          .filter(w2 => w2.length >= 5 && w2 !== w1)
          .map(w2 => [...w1, ...w2])
      )
      .slice(0, 100);
    return pickRandom(twoWordTargets.length > 0 ? twoWordTargets : allWords, Math.max(MIN_WORDS_PER_LEVEL / 2, 15));
  } else {
    // Level 2, 4, 6: Kata Sambung - 3+ huruf
    filteredWords = allWords.filter(w => w.length >= 3);
  }

  return pickRandom(filteredWords.length > 0 ? filteredWords : allWords, Math.max(MIN_WORDS_PER_LEVEL, filteredWords.length));
}