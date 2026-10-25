import type { QuestionData } from "../components/quiz-models/types";
import { ARABIC_VOCAB_QUESTIONS } from "./arabicVocabData";

export type QuizHubCategory = "tilawati" | "juz-amma" | "kisah-doa" | "bahasa-arab";

export interface QuizCategoryInfo {
  id: QuizHubCategory;
  title: string;
  tag: string;
  description: string;
  color: string;
  borderColor: string;
  bgBadge: string;
}

export const QUIZ_HUB_CATEGORIES: QuizCategoryInfo[] = [
  {
    id: "tilawati",
    title: "Tilawati",
    tag: "Makhraj & Harakat",
    description: "Kenali makhraj huruf hijaiyah, harakat, dan hukum tajwid dasar.",
    color: "#059669",
    borderColor: "#065F46",
    bgBadge: "#D1FAE5",
  },
  {
    id: "juz-amma",
    title: "Juz 'Amma",
    tag: "Potongan Ayat",
    description: "Sambung dan lengkapi potongan ayat surat-surat pendek Al-Qur'an.",
    color: "#0284C7",
    borderColor: "#0369A1",
    bgBadge: "#E0F2FE",
  },
  {
    id: "kisah-doa",
    title: "Kisah Nabi & Doa",
    tag: "Sirah & Adab",
    description: "Pelajari kisah para Nabi, malaikat, dan doa harian penting.",
    color: "#D97706",
    borderColor: "#B45309",
    bgBadge: "#FEF3C7",
  },
  {
    id: "bahasa-arab",
    title: "Bahasa Arab",
    tag: "Mufradat & Scramble",
    description: "Kosakata Durus al-Lughah, benda sehari-hari, dan susun kalimat.",
    color: "#7C3AED",
    borderColor: "#6D28D9",
    bgBadge: "#EDE9FE",
  },
];

// 1. Bank Soal Kategori Tilawati
export const TILAWATI_QUESTIONS: QuestionData[] = [
  {
    id: "quiz-tila-1",
    type: "multiple-choice-text",
    prompt: "Manakah huruf yang keluar dari tenggorokan bagian tengah (Halq)?",
    arabicText: "ع - ح",
    options: ["ع - ح", "ب - م", "ت - د", "ك - ق"],
    correctAnswer: "ع - ح",
  },
  {
    id: "quiz-tila-2",
    type: "fill-in-the-blank",
    prompt: "Lengkapi pasangan harakat fathah kasrah dhammah:",
    arabicTemplate: "بَ - بِ - ______",
    availableLetters: ["بُ", "تُ", "ثُ", "جُ"],
    options: ["بُ", "تُ", "ثُ"],
    correctAnswer: ["بُ"],
  },
  {
    id: "quiz-tila-3",
    type: "multiple-choice-text",
    prompt: "Huruf apakah yang memiliki sifat Qalqalah (memantul)?",
    arabicText: "ق - ط - ب - ج - د",
    options: ["ق - ط - ب - ج - د", "ف - ح - ث", "ص - س - ز", "م - ن - و"],
    correctAnswer: "ق - ط - ب - ج - د",
  },
  {
    id: "quiz-tila-4",
    type: "word-scramble",
    instruction: "Susun urutan huruf hijaiyah berikut dengan benar",
    prompt: "Urutan huruf alif sampai tsa",
    correctWords: ["ا", "ب", "ت", "ث"],
    bankWords: ["ت", "ا", "ث", "ب"],
    correctAnswer: "ا ب ت ث",
  },
  {
    id: "quiz-tila-5",
    type: "multiple-choice-text",
    prompt: "Berapa harakat panjang bacaan Mad Thobi'i (Mad Asli)?",
    arabicText: "مَدٌّ طَبِيعِيٌّ",
    options: ["2 Harakat", "4 Harakat", "6 Harakat", "1 Harakat"],
    correctAnswer: "2 Harakat",
  },
];

// 2. Bank Soal Kategori Juz 'Amma
export const JUZ_AMMA_QUESTIONS: QuestionData[] = [
  {
    id: "quiz-juz-1",
    type: "word-scramble",
    instruction: "Susun ayat 1 Surah Al-Ikhlas",
    prompt: "Katakanlah: Dialah Allah, Yang Maha Esa",
    correctWords: ["قُلْ", "هُوَ", "اللَّهُ", "أَحَدٌ"],
    bankWords: ["أَحَدٌ", "قُلْ", "الصَّمَدُ", "هُوَ", "اللَّهُ"],
    correctAnswer: "قُلْ هُوَ اللَّهُ أَحَدٌ",
  },
  {
    id: "quiz-juz-2",
    type: "fill-in-the-blank",
    prompt: "Lengkapi lanjutan ayat: قُلْ أَعُوذُ بِرَبِّ ______",
    arabicTemplate: "قُلْ أَعُوذُ بِرَبِّ ______",
    availableLetters: ["الْفَلَقِ", "النَّاسِ", "الْعَالَمِينَ"],
    options: ["الْفَلَقِ", "النَّاسِ", "الْعَالَمِينَ"],
    correctAnswer: ["الْفَلَقِ"],
  },
  {
    id: "quiz-juz-3",
    type: "word-scramble",
    instruction: "Susun ayat 1 Surah An-Nas",
    prompt: "Katakanlah: Aku berlindung kepada Tuhannya manusia",
    correctWords: ["قُلْ", "أَعُوذُ", "بِرَبِّ", "النَّاسِ"],
    bankWords: ["النَّاسِ", "بِرَبِّ", "قُلْ", "الْفَلَقِ", "أَعُوذُ"],
    correctAnswer: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
  },
  {
    id: "quiz-juz-4",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ' adalah...",
    arabicText: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
    options: [
      "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "مَالِكِ يَوْمِ الدِّينِ",
    ],
    correctAnswer: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
  },
  {
    id: "quiz-juz-5",
    type: "word-scramble",
    instruction: "Susun kalimat basmalah dengan urutan tepat",
    prompt: "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang",
    correctWords: ["بِسْمِ", "اللَّهِ", "الرَّحْمَٰنِ", "الرَّحِيمِ"],
    bankWords: ["الرَّحِيمِ", "بِسْمِ", "الرَّحْمَٰنِ", "اللَّهِ"],
    correctAnswer: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  },
];

// 3. Bank Soal Kategori Kisah Nabi & Doa
export const KISAH_DOA_QUESTIONS: QuestionData[] = [
  {
    id: "quiz-doa-1",
    type: "word-scramble",
    instruction: "Susun doa sebelum makan",
    prompt: "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami",
    correctWords: ["اللَّهُمَّ", "بَارِكْ", "لَنَا", "فِيمَا", "رَزَقْتَنَا"],
    bankWords: ["فِيمَا", "اللَّهُمَّ", "رَزَقْتَنَا", "لَنَا", "بَارِكْ"],
    correctAnswer: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا",
  },
  {
    id: "quiz-nabi-1",
    type: "multiple-choice-text",
    prompt: "Nabi yang diberi mukjizat selamat dari kobaran api adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Nabi Ibrahim AS", "Nabi Nuh AS", "Nabi Musa AS", "Nabi Isa AS"],
    correctAnswer: "Nabi Ibrahim AS",
  },
  {
    id: "quiz-nabi-2",
    type: "multiple-choice-text",
    prompt: "Nabi yang membuat bahtera/kapal besar atas perintah Allah adalah...",
    arabicText: "سَفِينَةٌ",
    options: ["Nabi Nuh AS", "Nabi Hud AS", "Nabi Yunus AS", "Nabi Saleh AS"],
    correctAnswer: "Nabi Nuh AS",
  },
  {
    id: "quiz-doa-2",
    type: "fill-in-the-blank",
    prompt: "Doa kedua orang tua: رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ ______",
    arabicTemplate: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ ______",
    availableLetters: ["وَارْحَمْهُمَا", "وَاهْدِنَا", "وَارْزُقْنَا"],
    options: ["وَارْحَمْهُمَا", "وَاهْدِنَا", "وَارْزُقْنَا"],
    correctAnswer: ["وَارْحَمْهُمَا"],
  },
  {
    id: "quiz-nabi-3",
    type: "multiple-choice-text",
    prompt: "Siapakah nama Ibunda Nabi Muhammad shallallahu 'alaihi wasallam?",
    arabicText: "أُمُّ الرَّسُولِ",
    options: ["Aminah", "Khadijah", "Fathimah", "Halimah"],
    correctAnswer: "Aminah",
  },
];

// Peta Kategori ke Bank Soal
export const QUIZ_HUB_QUESTIONS: Record<QuizHubCategory, QuestionData[]> = {
  tilawati: TILAWATI_QUESTIONS,
  "juz-amma": JUZ_AMMA_QUESTIONS,
  "kisah-doa": KISAH_DOA_QUESTIONS,
  "bahasa-arab": ARABIC_VOCAB_QUESTIONS,
};

/**
 * Generator Pseudorandom Number Generator (Mulberry32) deterministik berbasis Seed.
 */
export function getSeededRandom(seed: number): () => number {
  let s = Math.floor(seed) || 12345;
  return function () {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Mengocok array secara deterministik dengan seed tertentu.
 */
export function shuffleWithSeed<T>(items: readonly T[], seed: number): T[] {
  const rng = getSeededRandom(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Mengambil soal untuk Pusat Kuis dengan opsi mode & seed tantang teman.
 */
export function getQuizHubQuestions(
  category: QuizHubCategory = "bahasa-arab",
  mode: "all" | "mcq" | "scramble" = "all",
  seed?: number,
  limit = 5,
): QuestionData[] {
  const rawPool = QUIZ_HUB_QUESTIONS[category] || ARABIC_VOCAB_QUESTIONS;

  let filtered = rawPool;
  if (mode === "scramble") {
    filtered = rawPool.filter(
      (q) => q.type === "word-scramble" || (q.correctWords && q.correctWords.length > 0),
    );
    // Jika tidak cukup soal scramble di kategori ini, sertakan dari seluruh kategori
    if (filtered.length < limit) {
      const allScramble = Object.values(QUIZ_HUB_QUESTIONS)
        .flat()
        .filter((q) => q.type === "word-scramble" || (q.correctWords && q.correctWords.length > 0));
      filtered = Array.from(new Set([...filtered, ...allScramble]));
    }
  } else if (mode === "mcq") {
    filtered = rawPool.filter((q) => q.type !== "word-scramble");
  }

  // Jika seed diberikan (Tantang Teman / Versus Mode), gunakan deterministic shuffle
  if (typeof seed === "number" && !isNaN(seed)) {
    return shuffleWithSeed(filtered, seed).slice(0, limit);
  }

  // Pengacakan standar
  return [...filtered].sort(() => Math.random() - 0.5).slice(0, limit);
}
