import type { QuestionData } from "../components/quiz-models/types";
import { generateAvailableLetters } from "../components/quiz-models/quizModelRandomizer";
import type { QuizQuestion } from "./tilawatiQuizTypes";
import { getRandomQuestions } from "./TilawatiDataProvider";
import { ARABIC_VOCAB_QUESTIONS } from "./arabicVocabData";
import { JUZ_AMMA_VERSES } from "../pages/games/juz-amma-speedrun/data/juz-amma-questions";
import { ANGEL_MISSIONS } from "../pages/games/malaikat-mission/data/missions";
import { CHRONICLES } from "../pages/games/nabi-chronicles/data/chronicles";

// Import adventure quiz data
import {
  MISI_5_WAKTU_LEVELS,
  PETA_IMAN_LEVELS,
  AIR_KEHIDUPAN_LEVELS,
  TAMENG_RAMADAN_LEVELS,
  MISI_BERBAGI_LEVELS,
  PANDUAN_KSATRIA_LEVELS,
  LORONG_WAKTU_LEVELS,
  PUNCAK_ARAFAH_LEVELS,
  MISI_5_WAKTU_QUESTIONS,
  PETA_IMAN_QUESTIONS,
  AIR_KEHIDUPAN_QUESTIONS,
  TAMENG_RAMADAN_QUESTIONS,
  MISI_BERBAGI_QUESTIONS,
  PANDUAN_KSATRIA_QUESTIONS,
  LORONG_WAKTU_QUESTIONS,
  PUNCAK_ARAFAH_QUESTIONS,
  getCategoryUnlockedLevel as getAdventureUnlockedLevel,
  saveCategoryLevelCompleted as saveAdventureLevel,
  QUIZ_PROGRESS_STORAGE_KEY,
  type QuizAdventureLevel,
} from "./quizAdventureData";

export type QuizHubCategory =
  | "tilawati"
  | "juz-amma"
  | "kisah-doa"
  | "bahasa-arab"
  | "misi-5-waktu"
  | "peta-iman"
  | "air-kehidupan"
  | "tameng-ramadan"
  | "misi-berbagi"
  | "panduan-ksatria"
  | "lorong-waktu"
  | "puncak-arafah";

export interface QuizCategoryInfo {
  id: QuizHubCategory;
  title: string;
  tag: string;
  description: string;
  color: string;
  borderColor: string;
  bgBadge: string;
  levels?: QuizAdventureLevel[];
}

export const QUIZ_HUB_CATEGORIES: QuizCategoryInfo[] = [
  {
    id: "tilawati",
    title: "Tilawati",
    tag: "Makhraj & Harakat",
    description:
      "Kenali makhraj huruf hijaiyah, harakat, dan hukum tajwid dasar.",
    color: "#059669",
    borderColor: "#065F46",
    bgBadge: "#D1FAE5",
  },
  {
    id: "juz-amma",
    title: "Juz 'Amma",
    tag: "Potongan Ayat",
    description:
      "Sambung dan lengkapi potongan ayat surat-surat pendek Al-Qur'an.",
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
    description:
      "Kosakata Durus al-Lughah, benda sehari-hari, dan susun kalimat.",
    color: "#7C3AED",
    borderColor: "#6D28D9",
    bgBadge: "#EDE9FE",
  },
  // ============================================
  // NEW: 8 Adventure Quiz Categories
  // ============================================
  {
    id: "misi-5-waktu",
    title: "Misi 5 Waktu",
    tag: "Ibadah Sholat",
    description: "Petualangan menegakkan sholat.",
    color: "#EA580C",
    borderColor: "#C2410C",
    bgBadge: "#FFEDD5",
    levels: MISI_5_WAKTU_LEVELS,
  },
  {
    id: "peta-iman",
    title: "Peta Iman",
    tag: "Aqidah & Rukun Iman",
    description: "Mengenal dasar tauhid dan rukun iman.",
    color: "#7C3AED",
    borderColor: "#6D28D9",
    bgBadge: "#EDE9FE",
    levels: PETA_IMAN_LEVELS,
  },
  {
    id: "air-kehidupan",
    title: "Air Kehidupan",
    tag: "Thaharah & Wudu",
    description: "Misi bersuci dengan wudu.",
    color: "#0284C7",
    borderColor: "#0369A1",
    bgBadge: "#E0F2FE",
    levels: AIR_KEHIDUPAN_LEVELS,
  },
  {
    id: "tameng-ramadan",
    title: "Tameng Ramadan",
    tag: "Ibadah Puasa",
    description: "Petualangan puasa di bulan Ramadan.",
    color: "#DC2626",
    borderColor: "#B91C1C",
    bgBadge: "#FEE2E2",
    levels: TAMENG_RAMADAN_LEVELS,
  },
  {
    id: "misi-berbagi",
    title: "Misi Berbagi",
    tag: "Zakat & Sedekah",
    description: "Belajar zakat dan sedekah.",
    color: "#059669",
    borderColor: "#047857",
    bgBadge: "#D1FAE5",
    levels: MISI_BERBAGI_LEVELS,
  },
  {
    id: "panduan-ksatria",
    title: "Panduan Ksatria",
    tag: "Fikih & Adab",
    description: "Fikih ibadah dan adab harian.",
    color: "#B45309",
    borderColor: "#92400E",
    bgBadge: "#FEF3C7",
    levels: PANDUAN_KSATRIA_LEVELS,
  },
  {
    id: "lorong-waktu",
    title: "Lorong Waktu",
    tag: "Sejarah & Sirah",
    description: "Menelusuri sejarah Islam dan para nabi.",
    color: "#DB2777",
    borderColor: "#BE185D",
    bgBadge: "#FCE7F3",
    levels: LORONG_WAKTU_LEVELS,
  },
  {
    id: "puncak-arafah",
    title: "Puncak Arafah",
    tag: "Haji & Umrah",
    description: "Mengenal ibadah haji dan umrah.",
    color: "#0D9488",
    borderColor: "#0F766E",
    bgBadge: "#CCFBF1",
    levels: PUNCAK_ARAFAH_LEVELS,
  },
];

// 1. Bank Soal Kategori Tilawati — diambil dari dataset inti Tilawati via Provider.
function toTilawatiQuestionData(question: QuizQuestion): QuestionData {
  const correctReading = question.transliterationParts.join(" ");
  const distractorPool = Array.from(
    new Set(question.options.filter((option) => option !== correctReading)),
  );
  return {
    id: `tilawati-${question.id}`,
    type: "fill-in-the-blank",
    prompt: "Lengkapi bacaan latin dari lafal berikut.",
    arabicTemplate: question.arabic,
    arabicText: question.arabic,
    options: shuffleArray([correctReading, ...distractorPool.slice(0, 3)]),
    availableLetters: generateAvailableLetters(
      question.transliterationParts,
      question.options,
      4,
    ),
    correctAnswer: question.transliterationParts,
    audioUrl: question.audioUrl || undefined,
    transliteration: correctReading,
  };
}

export const TILAWATI_QUESTIONS: QuestionData[] = getRandomQuestions(1, 10).map(
  toTilawatiQuestionData,
);

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
  {
    id: "juz-amma-bank-001",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    options: [
      "Surah Asy-Syams",
      "Surah Adh-Dhuha",
      "Surah An-Nas",
      "Surah Al-Ikhlas",
    ],
    correctAnswer: "Surah Al-Ikhlas",
  },
  {
    id: "juz-amma-bank-002",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
    options: [
      "Surah An-Nashr",
      "Surah Al-Lahab",
      "Surah Al-Kautsar",
      "Surah Az-Zalzalah",
    ],
    correctAnswer: "Surah Al-Kautsar",
  },
  {
    id: "juz-amma-bank-003",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
    options: [
      "Surah Al-Kafirun",
      "Surah Al-Ma'un",
      "Surah An-Naba'",
      "Surah Al-'Alaq",
    ],
    correctAnswer: "Surah Al-Kafirun",
  },
  {
    id: "juz-amma-bank-004",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
    options: [
      "Surah Al-Insyirah",
      "Surah Adh-Dhuha",
      "Surah Al-Kautsar",
      "Surah Al-Lahab",
    ],
    correctAnswer: "Surah Al-Lahab",
  },
  {
    id: "juz-amma-bank-005",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
    options: [
      "Surah An-Nashr",
      "Surah Al-Ma'un",
      "Surah Al-Fil",
      "Surah Al-Humazah",
    ],
    correctAnswer: "Surah An-Nashr",
  },
  {
    id: "juz-amma-bank-006",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "لِإِيلَافِ قُرَيْشٍ",
    options: [
      "Surah At-Tin",
      "Surah Al-Kautsar",
      "Surah 'Abasa",
      "Surah Quraisy",
    ],
    correctAnswer: "Surah Quraisy",
  },
  {
    id: "juz-amma-bank-007",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
    options: [
      "Surah Al-Humazah",
      "Surah An-Nas",
      "Surah Al-Fil",
      "Surah Az-Zalzalah",
    ],
    correctAnswer: "Surah Al-Fil",
  },
  {
    id: "juz-amma-bank-008",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "وَالْعَصْرِ",
    options: [
      "Surah Al-Humazah",
      "Surah Al-'Ashr",
      "Surah At-Tin",
      "Surah An-Naba'",
    ],
    correctAnswer: "Surah Al-'Ashr",
  },
  {
    id: "juz-amma-bank-009",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "أَلْهَاكُمُ التَّكَاثُرُ",
    options: [
      "Surah Al-'Alaq",
      "Surah At-Takatsur",
      "Surah Al-Insyirah",
      "Surah Al-Qari'ah",
    ],
    correctAnswer: "Surah At-Takatsur",
  },
  {
    id: "juz-amma-bank-010",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "وَمَا أَدْرَاكَ مَا الْقَارِعَةُ",
    options: [
      "Surah Al-Qari'ah",
      "Surah Al-Insyirah",
      "Surah An-Nas",
      "Surah Al-'Ashr",
    ],
    correctAnswer: "Surah Al-Qari'ah",
  },
  {
    id: "juz-amma-bank-011",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا",
    options: [
      "Surah Al-A'la",
      "Surah Az-Zalzalah",
      "Surah Al-Insyirah",
      "Surah Al-Lahab",
    ],
    correctAnswer: "Surah Az-Zalzalah",
  },
  {
    id: "juz-amma-bank-012",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
    options: [
      "Surah Al-Lail",
      "Surah Adh-Dhuha",
      "Surah Al-Qadr",
      "Surah 'Abasa",
    ],
    correctAnswer: "Surah Al-Qadr",
  },
  {
    id: "juz-amma-bank-013",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    options: [
      "Surah Al-Fil",
      "Surah Al-Humazah",
      "Surah Al-'Alaq",
      "Surah Quraisy",
    ],
    correctAnswer: "Surah Al-'Alaq",
  },
  {
    id: "juz-amma-bank-014",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "وَالتِّينِ وَالزَّيْتُونِ",
    options: [
      "Surah Al-Falaq",
      "Surah At-Tin",
      "Surah Al-Fil",
      "Surah Al-Humazah",
    ],
    correctAnswer: "Surah At-Tin",
  },
  {
    id: "juz-amma-bank-015",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
    options: [
      "Surah Az-Zalzalah",
      "Surah Al-Insyirah",
      "Surah An-Naba'",
      "Surah Asy-Syams",
    ],
    correctAnswer: "Surah Al-Insyirah",
  },
  {
    id: "juz-amma-bank-016",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "وَالضُّحَى",
    options: [
      "Surah Al-Lahab",
      "Surah Al-Ma'un",
      "Surah Al-Kafirun",
      "Surah Adh-Dhuha",
    ],
    correctAnswer: "Surah Adh-Dhuha",
  },
  {
    id: "juz-amma-bank-017",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "وَالشَّمْسِ وَضُحَاهَا",
    options: [
      "Surah Al-Falaq",
      "Surah Al-Lahab",
      "Surah Asy-Syams",
      "Surah Al-Fil",
    ],
    correctAnswer: "Surah Asy-Syams",
  },
  {
    id: "juz-amma-bank-018",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "وَاللَّيْلِ إِذَا يَغْشَى",
    options: [
      "Surah Al-Lail",
      "Surah An-Naba'",
      "Surah Asy-Syams",
      "Surah Az-Zalzalah",
    ],
    correctAnswer: "Surah Al-Lail",
  },
  {
    id: "juz-amma-bank-019",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى",
    options: [
      "Surah Al-Qari'ah",
      "Surah Al-Qadr",
      "Surah Al-Ikhlas",
      "Surah Al-A'la",
    ],
    correctAnswer: "Surah Al-A'la",
  },
  {
    id: "juz-amma-bank-020",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
    options: [
      "Surah Al-Falaq",
      "Surah An-Nas",
      "Surah Al-Ma'un",
      "Surah Asy-Syams",
    ],
    correctAnswer: "Surah Al-Ma'un",
  },
  {
    id: "juz-amma-bank-021",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ",
    options: [
      "Surah Al-Humazah",
      "Surah Al-Insyirah",
      "Surah Al-Falaq",
      "Surah Al-Fil",
    ],
    correctAnswer: "Surah Al-Humazah",
  },
  {
    id: "juz-amma-bank-022",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    options: [
      "Surah Al-Ma'un",
      "Surah Al-Falaq",
      "Surah Al-Qari'ah",
      "Surah An-Nas",
    ],
    correctAnswer: "Surah Al-Falaq",
  },
  {
    id: "juz-amma-bank-023",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    options: [
      "Surah Adh-Dhuha",
      "Surah An-Nas",
      "Surah Al-Ikhlas",
      "Surah Asy-Syams",
    ],
    correctAnswer: "Surah An-Nas",
  },
  {
    id: "juz-amma-bank-024",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "عَبَسَ وَتَوَلَّى",
    options: [
      "Surah Al-Falaq",
      "Surah At-Takatsur",
      "Surah Al-A'la",
      "Surah 'Abasa",
    ],
    correctAnswer: "Surah 'Abasa",
  },
  {
    id: "juz-amma-bank-025",
    type: "multiple-choice-text",
    prompt: "Ayat berikut termasuk surah apa?",
    arabicText: "عَمَّ يَتَسَاءَلُونَ",
    options: [
      "Surah Al-Kautsar",
      "Surah Al-Qari'ah",
      "Surah An-Naba'",
      "Surah Az-Zalzalah",
    ],
    correctAnswer: "Surah An-Naba'",
  },
  {
    id: "juz-amma-bank-026",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    options: [
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      "مَلِكِ النَّاسِ",
      "اللَّهُ الصَّمَدُ",
      "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    ],
    correctAnswer: "اللَّهُ الصَّمَدُ",
  },
  {
    id: "juz-amma-bank-027",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    options: [
      "اللَّهُ الصَّمَدُ",
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      "مِنْ شَرِّ مَا خَلَقَ",
    ],
    correctAnswer: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
  },
  {
    id: "juz-amma-bank-028",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    options: [
      "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      "مَلِكِ النَّاسِ",
      "مِنْ شَرِّ مَا خَلَقَ",
    ],
    correctAnswer: "مِنْ شَرِّ مَا خَلَقَ",
  },
  {
    id: "juz-amma-bank-029",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "مَلِكِ النَّاسِ",
    options: [
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "مِنَ الْجِنَّةِ وَالنَّاسِ",
      "إِلَهِ النَّاسِ",
      "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    ],
    correctAnswer: "إِلَهِ النَّاسِ",
  },
  {
    id: "juz-amma-bank-030",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
    options: [
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
      "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا",
    ],
    correctAnswer:
      "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
  },
  {
    id: "juz-amma-bank-031",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "لَا أَعْبُدُ مَا تَعْبُدُونَ",
    options: [
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
    ],
    correctAnswer: "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
  },
  {
    id: "juz-amma-bank-032",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ",
    options: [
      "فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
      "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
      "تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ",
      "لِإِيلَافِ قُرَيْشٍ",
    ],
    correctAnswer: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
  },
  {
    id: "juz-amma-bank-033",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ",
    options: [
      "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ",
      "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ",
      "لِإِيلَافِ قُرَيْشٍ",
      "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
    ],
    correctAnswer: "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ",
  },
  {
    id: "juz-amma-bank-034",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    options: [
      "وَإِلَى رَبِّكَ فَارْغَبْ",
      "فَإِذَا فَرَغْتَ فَانْصَبْ",
      "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
      "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    ],
    correctAnswer: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
  },
  {
    id: "juz-amma-bank-035",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "وَاللَّيْلِ إِذَا سَجَى",
    options: [
      "وَالضُّحَى",
      "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَى",
      "وَالنَّهَارِ إِذَا تَجَلَّى",
      "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى",
    ],
    correctAnswer: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى",
  },
  {
    id: "juz-amma-bank-036",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
    options: [
      "بِأَنَّ رَبَّكَ أَوْحَى لَهَا",
      "وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
      "وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا",
      "وَقَالَ الْإِنْسَانُ مَا لَهَا",
    ],
    correctAnswer: "وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
  },
  {
    id: "juz-amma-bank-037",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    options: [
      "عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ",
      "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ",
      "خَلَقَ الْإِنْسَانَ مِنْ عَلَقٍ",
      "الَّذِي عَلَّمَ بِالْقَلَمِ",
    ],
    correctAnswer: "خَلَقَ الْإِنْسَانَ مِنْ عَلَقٍ",
  },
  {
    id: "juz-amma-bank-038",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
    options: [
      "وَالْعَصْرِ",
      "أَلْهَاكُمُ التَّكَاثُرُ",
      "حَتَّى زُرْتُمُ الْمَقَابِرَ",
      "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    ],
    correctAnswer:
      "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
  },
  {
    id: "juz-amma-bank-039",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى",
    options: [
      "هَلْ أَتَاكَ حَدِيثُ الْغَاشِيَةِ",
      "الَّذِي خَلَقَ فَسَوَّى",
      "وَالسَّمَاءِ ذَاتِ الْبُرُوجِ",
      "وَالسَّمَاءِ وَالطَّارِقِ",
    ],
    correctAnswer: "الَّذِي خَلَقَ فَسَوَّى",
  },
  {
    id: "juz-amma-bank-040",
    type: "multiple-choice-text",
    prompt: "Lanjutan dari ayat berikut adalah...",
    arabicText: "فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ",
    options: [
      "الَّذِينَ هُمْ يُرَاءُونَ",
      "فَوَيْلٌ لِلْمُصَلِّينَ",
      "وَيَمْنَعُونَ الْمَاعُونَ",
      "وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ",
    ],
    correctAnswer: "وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ",
  },
  {
    id: "juz-amma-bank-041",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Ikhlas berikut:",
    arabicTemplate: "قُلْ هُوَ اللَّهُ ______",
    options: ["الرَّحْمَٰنُ", "الصَّمَدُ", "وَاحِدٌ", "أَحَدٌ"],
    availableLetters: ["الرَّحْمَٰنُ", "الصَّمَدُ", "وَاحِدٌ", "أَحَدٌ"],
    correctAnswer: ["أَحَدٌ"],
  },
  {
    id: "juz-amma-bank-042",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Ikhlas berikut:",
    arabicTemplate: "اللَّهُ ______",
    options: ["الْخَالِقُ", "أَحَدٌ", "الصَّمَدُ", "الرَّحِيمُ"],
    availableLetters: ["الْخَالِقُ", "أَحَدٌ", "الصَّمَدُ", "الرَّحِيمُ"],
    correctAnswer: ["الصَّمَدُ"],
  },
  {
    id: "juz-amma-bank-043",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Ikhlas berikut:",
    arabicTemplate: "لَمْ يَلِدْ وَلَمْ ______",
    options: ["يَذْهَبْ", "يَكُنْ", "يَسْجُدْ", "يُولَدْ"],
    availableLetters: ["يَذْهَبْ", "يَكُنْ", "يَسْجُدْ", "يُولَدْ"],
    correctAnswer: ["يُولَدْ"],
  },
  {
    id: "juz-amma-bank-044",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Ikhlas berikut:",
    arabicTemplate: "وَلَمْ يَكُنْ لَهُ ______ أَحَدٌ",
    options: ["وَلَدًا", "شَرِيكًا", "كُفُوًا", "صَاحِبَةً"],
    availableLetters: ["وَلَدًا", "شَرِيكًا", "كُفُوًا", "صَاحِبَةً"],
    correctAnswer: ["كُفُوًا"],
  },
  {
    id: "juz-amma-bank-045",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Falaq berikut:",
    arabicTemplate: "قُلْ أَعُوذُ بِرَبِّ ______",
    options: ["الْفَجْرِ", "النَّاسِ", "الْعَالَمِينَ", "الْفَلَقِ"],
    availableLetters: ["الْفَجْرِ", "النَّاسِ", "الْعَالَمِينَ", "الْفَلَقِ"],
    correctAnswer: ["الْفَلَقِ"],
  },
  {
    id: "juz-amma-bank-046",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Falaq berikut:",
    arabicTemplate: "مِنْ شَرِّ مَا ______",
    options: ["وَسْوَسَ", "خَلَقَ", "حَسَدَ", "عَمِلَ"],
    availableLetters: ["وَسْوَسَ", "خَلَقَ", "حَسَدَ", "عَمِلَ"],
    correctAnswer: ["خَلَقَ"],
  },
  {
    id: "juz-amma-bank-047",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Falaq berikut:",
    arabicTemplate: "وَمِنْ شَرِّ ______ إِذَا وَقَبَ",
    options: ["الْوَسْوَاسِ", "غَاسِقٍ", "النَّفَّاثَاتِ", "حَاسِدٍ"],
    availableLetters: ["الْوَسْوَاسِ", "غَاسِقٍ", "النَّفَّاثَاتِ", "حَاسِدٍ"],
    correctAnswer: ["غَاسِقٍ"],
  },
  {
    id: "juz-amma-bank-048",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah An-Nas berikut:",
    arabicTemplate: "مَلِكِ ______",
    options: ["النَّاسِ", "الْعَالَمِينَ", "الْجِنَّةِ", "الْفَلَقِ"],
    availableLetters: ["النَّاسِ", "الْعَالَمِينَ", "الْجِنَّةِ", "الْفَلَقِ"],
    correctAnswer: ["النَّاسِ"],
  },
  {
    id: "juz-amma-bank-049",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah An-Nas berikut:",
    arabicTemplate: "الَّذِي يُوَسْوِسُ فِي ______ النَّاسِ",
    options: ["قُلُوبِ", "عُيُونِ", "صُدُورِ", "بُيُوتِ"],
    availableLetters: ["قُلُوبِ", "عُيُونِ", "صُدُورِ", "بُيُوتِ"],
    correctAnswer: ["صُدُورِ"],
  },
  {
    id: "juz-amma-bank-050",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Lahab berikut:",
    arabicTemplate: "تَبَّتْ يَدَا أَبِي ______ وَتَبَّ",
    options: ["لَهَبٍ", "طَالِبٍ", "جَهْلٍ", "بَكْرٍ"],
    availableLetters: ["لَهَبٍ", "طَالِبٍ", "جَهْلٍ", "بَكْرٍ"],
    correctAnswer: ["لَهَبٍ"],
  },
  {
    id: "juz-amma-bank-051",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Lahab berikut:",
    arabicTemplate: "فِي جِيدِهَا حَبْلٌ مِنْ ______",
    options: ["ذَهَبٍ", "مَسَدٍ", "حَدِيدٍ", "نَارٍ"],
    availableLetters: ["ذَهَبٍ", "مَسَدٍ", "حَدِيدٍ", "نَارٍ"],
    correctAnswer: ["مَسَدٍ"],
  },
  {
    id: "juz-amma-bank-052",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Kautsar berikut:",
    arabicTemplate: "إِنَّا أَعْطَيْنَاكَ ______",
    options: ["الْكَوْثَرَ", "الْكِتَابَ", "الْقُرْآنَ", "الْخَيْرَ"],
    availableLetters: ["الْكَوْثَرَ", "الْكِتَابَ", "الْقُرْآنَ", "الْخَيْرَ"],
    correctAnswer: ["الْكَوْثَرَ"],
  },
  {
    id: "juz-amma-bank-053",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Kautsar berikut:",
    arabicTemplate: "فَصَلِّ لِرَبِّكَ ______",
    options: ["وَارْكَعْ", "وَاشْكُرْ", "وَانْحَرْ", "وَاسْجُدْ"],
    availableLetters: ["وَارْكَعْ", "وَاشْكُرْ", "وَانْحَرْ", "وَاسْجُدْ"],
    correctAnswer: ["وَانْحَرْ"],
  },
  {
    id: "juz-amma-bank-054",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Kafirun berikut:",
    arabicTemplate: "لَكُمْ دِينُكُمْ وَلِيَ ______",
    options: ["عَمَلِ", "دِينِ", "كِتَابِ", "نَبِيِّ"],
    availableLetters: ["عَمَلِ", "دِينِ", "كِتَابِ", "نَبِيِّ"],
    correctAnswer: ["دِينِ"],
  },
  {
    id: "juz-amma-bank-055",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah An-Nashr berikut:",
    arabicTemplate: "إِذَا جَاءَ نَصْرُ اللَّهِ ______",
    options: ["وَالْفَتْحُ", "وَالْحَمْدُ", "وَالْعِلْمُ", "وَالرِّزْقُ"],
    availableLetters: [
      "وَالْفَتْحُ",
      "وَالْحَمْدُ",
      "وَالْعِلْمُ",
      "وَالرِّزْقُ",
    ],
    correctAnswer: ["وَالْفَتْحُ"],
  },
  {
    id: "juz-amma-bank-056",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah An-Nashr berikut:",
    arabicTemplate:
      "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ ______",
    options: ["بَصِيرًا", "تَوَّابًا", "قَدِيرًا", "صَبُورًا"],
    availableLetters: ["بَصِيرًا", "تَوَّابًا", "قَدِيرًا", "صَبُورًا"],
    correctAnswer: ["تَوَّابًا"],
  },
  {
    id: "juz-amma-bank-057",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Quraisy berikut:",
    arabicTemplate: "الَّذِي أَطْعَمَهُمْ مِنْ ______ وَآمَنَهُمْ مِنْ خَوْفٍ",
    options: ["جُوعٍ", "فَقْرٍ", "حَرْبٍ", "ظُلْمٍ"],
    availableLetters: ["جُوعٍ", "فَقْرٍ", "حَرْبٍ", "ظُلْمٍ"],
    correctAnswer: ["جُوعٍ"],
  },
  {
    id: "juz-amma-bank-058",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Fil berikut:",
    arabicTemplate: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا ______",
    options: ["عَظِيمًا", "كَثِيرًا", "أَسْوَدَ", "أَبَابِيلَ"],
    availableLetters: ["عَظِيمًا", "كَثِيرًا", "أَسْوَدَ", "أَبَابِيلَ"],
    correctAnswer: ["أَبَابِيلَ"],
  },
  {
    id: "juz-amma-bank-059",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Fil berikut:",
    arabicTemplate: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ ______",
    options: ["الْفِيلِ", "الرَّسِّ", "الْكَهْفِ", "الْأُخْدُودِ"],
    availableLetters: ["الْفِيلِ", "الرَّسِّ", "الْكَهْفِ", "الْأُخْدُودِ"],
    correctAnswer: ["الْفِيلِ"],
  },
  {
    id: "juz-amma-bank-060",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Insyirah berikut:",
    arabicTemplate: "فَإِنَّ مَعَ الْعُسْرِ ______",
    options: ["يُسْرًا", "نَصْرًا", "فَرَجًا", "خَيْرًا"],
    availableLetters: ["يُسْرًا", "نَصْرًا", "فَرَجًا", "خَيْرًا"],
    correctAnswer: ["يُسْرًا"],
  },
  {
    id: "juz-amma-bank-061",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Adh-Dhuha berikut:",
    arabicTemplate: "مَا وَدَّعَكَ رَبُّكَ وَمَا ______",
    options: ["تَرَكَ", "قَلَى", "نَسِيَ", "أَحَبَّ"],
    availableLetters: ["تَرَكَ", "قَلَى", "نَسِيَ", "أَحَبَّ"],
    correctAnswer: ["قَلَى"],
  },
  {
    id: "juz-amma-bank-062",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-Qadr berikut:",
    arabicTemplate: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ ______ شَهْرٍ",
    options: ["خَمْسِينَ", "مِائَةِ", "أَلْفِ", "عَشْرَةِ"],
    availableLetters: ["خَمْسِينَ", "مِائَةِ", "أَلْفِ", "عَشْرَةِ"],
    correctAnswer: ["أَلْفِ"],
  },
  {
    id: "juz-amma-bank-063",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-'Alaq berikut:",
    arabicTemplate: "خَلَقَ الْإِنْسَانَ مِنْ ______",
    options: ["تُرَابٍ", "مَاءٍ", "عَلَقٍ", "نُورٍ"],
    availableLetters: ["تُرَابٍ", "مَاءٍ", "عَلَقٍ", "نُورٍ"],
    correctAnswer: ["عَلَقٍ"],
  },
  {
    id: "juz-amma-bank-064",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah At-Tin berikut:",
    arabicTemplate: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ ______",
    options: ["خَلْقٍ", "صُورَةٍ", "هَيْئَةٍ", "تَقْوِيمٍ"],
    availableLetters: ["خَلْقٍ", "صُورَةٍ", "هَيْئَةٍ", "تَقْوِيمٍ"],
    correctAnswer: ["تَقْوِيمٍ"],
  },
  {
    id: "juz-amma-bank-065",
    type: "fill-in-the-blank",
    prompt: "Lengkapi ayat Surah Al-'Ashr berikut:",
    arabicTemplate: "وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا ______",
    options: ["بِالْعَدْلِ", "بِالصَّبْرِ", "بِالْخَيْرِ", "بِالشُّكْرِ"],
    availableLetters: [
      "بِالْعَدْلِ",
      "بِالصَّبْرِ",
      "بِالْخَيْرِ",
      "بِالشُّكْرِ",
    ],
    correctAnswer: ["بِالصَّبْرِ"],
  },
  {
    id: "juz-amma-bank-066",
    type: "word-scramble",
    instruction: "Susun ayat 4 Surah Al-Ikhlas",
    prompt: "Dan tidak ada sesuatu pun yang setara dengan Dia",
    correctWords: ["وَلَمْ", "يَكُنْ", "لَهُ", "كُفُوًا", "أَحَدٌ"],
    bankWords: ["يَكُنْ", "الصَّمَدُ", "أَحَدٌ", "لَهُ", "كُفُوًا", "وَلَمْ"],
    correctAnswer: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
  },
  {
    id: "juz-amma-bank-067",
    type: "word-scramble",
    instruction: "Susun ayat 1 Surah Al-Falaq",
    prompt:
      "Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh (fajar)",
    correctWords: ["قُلْ", "أَعُوذُ", "بِرَبِّ", "الْفَلَقِ"],
    bankWords: ["بِرَبِّ", "قُلْ", "أَعُوذُ", "النَّاسِ", "الْفَلَقِ"],
    correctAnswer: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
  },
  {
    id: "juz-amma-bank-068",
    type: "word-scramble",
    instruction: "Susun ayat 2 Surah Al-Falaq",
    prompt: "dari kejahatan makhluk yang Dia ciptakan",
    correctWords: ["مِنْ", "شَرِّ", "مَا", "خَلَقَ"],
    bankWords: ["غَاسِقٍ", "خَلَقَ", "شَرِّ", "مِنْ", "مَا"],
    correctAnswer: "مِنْ شَرِّ مَا خَلَقَ",
  },
  {
    id: "juz-amma-bank-069",
    type: "word-scramble",
    instruction: "Susun ayat 4 Surah An-Nas",
    prompt: "dari kejahatan (bisikan) setan yang bersembunyi",
    correctWords: ["مِنْ", "شَرِّ", "الْوَسْوَاسِ", "الْخَنَّاسِ"],
    bankWords: ["الْفَلَقِ", "الْوَسْوَاسِ", "شَرِّ", "مِنْ", "الْخَنَّاسِ"],
    correctAnswer: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
  },
  {
    id: "juz-amma-bank-070",
    type: "word-scramble",
    instruction: "Susun ayat 6 Surah Al-Kafirun",
    prompt: "Untukmu agamamu, dan untukku agamaku",
    correctWords: ["لَكُمْ", "دِينُكُمْ", "وَلِيَ", "دِينِ"],
    bankWords: ["وَلِيَ", "أَعْبُدُ", "دِينِ", "دِينُكُمْ", "لَكُمْ"],
    correctAnswer: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
  },
  {
    id: "juz-amma-bank-071",
    type: "word-scramble",
    instruction: "Susun ayat 3 Surah Al-Kautsar",
    prompt: "Sesungguhnya orang-orang yang membencimu dialah yang terputus",
    correctWords: ["إِنَّ", "شَانِئَكَ", "هُوَ", "الْأَبْتَرُ"],
    bankWords: ["هُوَ", "شَانِئَكَ", "الْأَبْتَرُ", "إِنَّ", "الْكَوْثَرَ"],
    correctAnswer: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
  },
  {
    id: "juz-amma-bank-072",
    type: "word-scramble",
    instruction: "Susun ayat 1 Surah An-Nashr",
    prompt: "Apabila telah datang pertolongan Allah dan kemenangan",
    correctWords: ["إِذَا", "جَاءَ", "نَصْرُ", "اللَّهِ", "وَالْفَتْحُ"],
    bankWords: [
      "إِذَا",
      "اللَّهِ",
      "جَاءَ",
      "وَالْفَتْحُ",
      "نَصْرُ",
      "أَفْوَاجًا",
    ],
    correctAnswer: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
  },
  {
    id: "juz-amma-bank-073",
    type: "word-scramble",
    instruction: "Susun ayat 1 Surah Quraisy",
    prompt: "Karena kebiasaan orang-orang Quraisy",
    correctWords: ["لِإِيلَافِ", "قُرَيْشٍ"],
    bankWords: ["الشِّتَاءِ", "لِإِيلَافِ", "قُرَيْشٍ"],
    correctAnswer: "لِإِيلَافِ قُرَيْشٍ",
  },
  {
    id: "juz-amma-bank-074",
    type: "word-scramble",
    instruction: "Susun ayat 3 Surah Quraisy",
    prompt: "Maka hendaklah mereka menyembah Tuhan pemilik rumah ini (Ka'bah)",
    correctWords: ["فَلْيَعْبُدُوا", "رَبَّ", "هَذَا", "الْبَيْتِ"],
    bankWords: [
      "رَبَّ",
      "الْبَيْتِ",
      "هَذَا",
      "أَطْعَمَهُمْ",
      "فَلْيَعْبُدُوا",
    ],
    correctAnswer: "فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ",
  },
  {
    id: "juz-amma-bank-075",
    type: "word-scramble",
    instruction: "Susun ayat 2 Surah Al-Fil",
    prompt: "Bukankah Dia telah menjadikan tipu daya mereka itu sia-sia?",
    correctWords: ["أَلَمْ", "يَجْعَلْ", "كَيْدَهُمْ", "فِي", "تَضْلِيلٍ"],
    bankWords: [
      "أَلَمْ",
      "فِي",
      "كَيْدَهُمْ",
      "تَضْلِيلٍ",
      "طَيْرًا",
      "يَجْعَلْ",
    ],
    correctAnswer: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ",
  },
  {
    id: "juz-amma-bank-076",
    type: "word-scramble",
    instruction: "Susun ayat 3 Surah Al-Fil",
    prompt: "Dan Dia mengirimkan kepada mereka burung yang berbondong-bondong",
    correctWords: ["وَأَرْسَلَ", "عَلَيْهِمْ", "طَيْرًا", "أَبَابِيلَ"],
    bankWords: [
      "أَبَابِيلَ",
      "سِجِّيلٍ",
      "طَيْرًا",
      "عَلَيْهِمْ",
      "وَأَرْسَلَ",
    ],
    correctAnswer: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
  },
  {
    id: "juz-amma-bank-077",
    type: "word-scramble",
    instruction: "Susun ayat 5 Surah Al-Fil",
    prompt: "Lalu Dia menjadikan mereka seperti daun-daun yang dimakan (ulat)",
    correctWords: ["فَجَعَلَهُمْ", "كَعَصْفٍ", "مَأْكُولٍ"],
    bankWords: ["تَضْلِيلٍ", "كَعَصْفٍ", "فَجَعَلَهُمْ", "مَأْكُولٍ"],
    correctAnswer: "فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
  },
  {
    id: "juz-amma-bank-078",
    type: "word-scramble",
    instruction: "Susun ayat 7 Surah Al-Ma'un",
    prompt: "dan enggan (menolong dengan) barang berguna",
    correctWords: ["وَيَمْنَعُونَ", "الْمَاعُونَ"],
    bankWords: ["الْيَتِيمَ", "وَيَمْنَعُونَ", "الْمَاعُونَ"],
    correctAnswer: "وَيَمْنَعُونَ الْمَاعُونَ",
  },
  {
    id: "juz-amma-bank-079",
    type: "word-scramble",
    instruction: "Susun ayat 5 Surah Al-Insyirah",
    prompt: "Maka sesungguhnya bersama kesulitan ada kemudahan",
    correctWords: ["فَإِنَّ", "مَعَ", "الْعُسْرِ", "يُسْرًا"],
    bankWords: ["يُسْرًا", "فَإِنَّ", "مَعَ", "صَدْرَكَ", "الْعُسْرِ"],
    correctAnswer: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
  },
  {
    id: "juz-amma-bank-080",
    type: "word-scramble",
    instruction: "Susun ayat 7 Surah Al-Insyirah",
    prompt:
      "Maka apabila engkau telah selesai (dari suatu urusan), tetaplah bekerja keras (untuk urusan yang lain)",
    correctWords: ["فَإِذَا", "فَرَغْتَ", "فَانْصَبْ"],
    bankWords: ["فَانْصَبْ", "فَإِذَا", "فَرَغْتَ", "فَارْغَبْ"],
    correctAnswer: "فَإِذَا فَرَغْتَ فَانْصَبْ",
  },
  {
    id: "juz-amma-bank-081",
    type: "word-scramble",
    instruction: "Susun ayat 3 Surah Al-Qadr",
    prompt: "Malam kemuliaan itu lebih baik daripada seribu bulan",
    correctWords: [
      "لَيْلَةُ",
      "الْقَدْرِ",
      "خَيْرٌ",
      "مِنْ",
      "أَلْفِ",
      "شَهْرٍ",
    ],
    bankWords: [
      "شَهْرٍ",
      "مِنْ",
      "الْقَدْرِ",
      "أَلْفِ",
      "الْمَلَائِكَةُ",
      "خَيْرٌ",
      "لَيْلَةُ",
    ],
    correctAnswer: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ",
  },
  {
    id: "juz-amma-bank-082",
    type: "word-scramble",
    instruction: "Susun ayat 1 Surah Al-'Alaq",
    prompt: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan",
    correctWords: ["اقْرَأْ", "بِاسْمِ", "رَبِّكَ", "الَّذِي", "خَلَقَ"],
    bankWords: ["عَلَقٍ", "بِاسْمِ", "رَبِّكَ", "اقْرَأْ", "خَلَقَ", "الَّذِي"],
    correctAnswer: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
  },
  {
    id: "juz-amma-bank-083",
    type: "word-scramble",
    instruction: "Susun ayat 4 Surah At-Tin",
    prompt:
      "Sungguh, Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya",
    correctWords: [
      "لَقَدْ",
      "خَلَقْنَا",
      "الْإِنْسَانَ",
      "فِي",
      "أَحْسَنِ",
      "تَقْوِيمٍ",
    ],
    bankWords: [
      "فِي",
      "الْإِنْسَانَ",
      "لَقَدْ",
      "الزَّيْتُونِ",
      "تَقْوِيمٍ",
      "خَلَقْنَا",
      "أَحْسَنِ",
    ],
    correctAnswer: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
  },
  {
    id: "juz-amma-bank-084",
    type: "word-scramble",
    instruction: "Susun ayat 2 Surah Al-'Ashr",
    prompt: "Sungguh, manusia berada dalam kerugian",
    correctWords: ["إِنَّ", "الْإِنْسَانَ", "لَفِي", "خُسْرٍ"],
    bankWords: ["إِنَّ", "خُسْرٍ", "الصَّبْرِ", "الْإِنْسَانَ", "لَفِي"],
    correctAnswer: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
  },
  {
    id: "juz-amma-bank-085",
    type: "word-scramble",
    instruction: "Susun ayat 3 Surah Adh-Dhuha",
    prompt: "Tuhanmu tidak meninggalkanmu dan tidak (pula) membencimu",
    correctWords: ["مَا", "وَدَّعَكَ", "رَبُّكَ", "وَمَا", "قَلَى"],
    bankWords: ["وَمَا", "مَا", "قَلَى", "فَتَرْضَى", "رَبُّكَ", "وَدَّعَكَ"],
    correctAnswer: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى",
  },
  {
    id: "juz-amma-bank-086",
    type: "multiple-choice-text",
    prompt: "Surah terakhir dalam Al-Qur'an adalah...",
    arabicText: "",
    options: ["Al-Falaq", "An-Nashr", "An-Nas", "Al-Ikhlas"],
    correctAnswer: "An-Nas",
  },
  {
    id: "juz-amma-bank-087",
    type: "multiple-choice-text",
    prompt: "Surah pertama pada Juz 30 (Juz 'Amma) adalah...",
    arabicText: "",
    options: ["'Abasa", "Al-Ikhlas", "An-Nazi'at", "An-Naba'"],
    correctAnswer: "An-Naba'",
  },
  {
    id: "juz-amma-bank-088",
    type: "multiple-choice-text",
    prompt: "Surah terpendek dalam Al-Qur'an adalah...",
    arabicText: "",
    options: ["Al-Kautsar", "An-Nas", "Al-Ikhlas", "Al-Falaq"],
    correctAnswer: "Al-Kautsar",
  },
  {
    id: "juz-amma-bank-089",
    type: "multiple-choice-text",
    prompt: "Surah Al-Ikhlas terdiri dari berapa ayat?",
    arabicText: "سُورَةُ الْإِخْلَاصِ",
    options: ["4 ayat", "3 ayat", "5 ayat", "6 ayat"],
    correctAnswer: "4 ayat",
  },
  {
    id: "juz-amma-bank-090",
    type: "multiple-choice-text",
    prompt: "Surah An-Nas terdiri dari berapa ayat?",
    arabicText: "سُورَةُ النَّاسِ",
    options: ["7 ayat", "5 ayat", "6 ayat", "4 ayat"],
    correctAnswer: "6 ayat",
  },
  {
    id: "juz-amma-bank-091",
    type: "multiple-choice-text",
    prompt: "Surah Al-Falaq terdiri dari berapa ayat?",
    arabicText: "سُورَةُ الْفَلَقِ",
    options: ["6 ayat", "5 ayat", "4 ayat", "3 ayat"],
    correctAnswer: "5 ayat",
  },
  {
    id: "juz-amma-bank-092",
    type: "multiple-choice-text",
    prompt: "Surah yang terletak setelah Surah Al-Ikhlas adalah...",
    arabicText: "",
    options: ["Al-Kafirun", "Al-Falaq", "An-Nas", "Al-Lahab"],
    correctAnswer: "Al-Falaq",
  },
  {
    id: "juz-amma-bank-093",
    type: "multiple-choice-text",
    prompt: "Surah yang terletak sebelum Surah Al-Ikhlas adalah...",
    arabicText: "",
    options: ["Al-Kafirun", "An-Nashr", "Al-Falaq", "Al-Lahab"],
    correctAnswer: "Al-Lahab",
  },
  {
    id: "juz-amma-bank-094",
    type: "multiple-choice-text",
    prompt: "Apa arti nama Surah Al-Fil?",
    arabicText: "الْفِيلُ",
    options: ["Unta", "Burung", "Gajah", "Kuda"],
    correctAnswer: "Gajah",
  },
  {
    id: "juz-amma-bank-095",
    type: "multiple-choice-text",
    prompt: "Apa arti nama Surah Al-Kautsar?",
    arabicText: "الْكَوْثَرُ",
    options: ["Nikmat yang banyak", "Masa", "Pertolongan", "Kemenangan"],
    correctAnswer: "Nikmat yang banyak",
  },
  {
    id: "juz-amma-bank-096",
    type: "multiple-choice-text",
    prompt: "Apa arti nama Surah Al-'Ashr?",
    arabicText: "الْعَصْرُ",
    options: ["Siang", "Masa (waktu)", "Malam", "Fajar"],
    correctAnswer: "Masa (waktu)",
  },
  {
    id: "juz-amma-bank-097",
    type: "multiple-choice-text",
    prompt: "Surah yang pertama kali diturunkan (ayat 1-5) adalah...",
    arabicText: "",
    options: ["Al-Ikhlas", "Al-Fatihah", "Al-'Alaq", "Al-Muddatstsir"],
    correctAnswer: "Al-'Alaq",
  },
  {
    id: "juz-amma-bank-098",
    type: "multiple-choice-text",
    prompt: "Berapa jumlah surah yang terdapat dalam Juz 30 (Juz 'Amma)?",
    arabicText: "",
    options: ["37 surah", "33 surah", "40 surah", "30 surah"],
    correctAnswer: "37 surah",
  },
  {
    id: "juz-amma-bank-099",
    type: "multiple-choice-text",
    prompt:
      "Menurut hadits sahih, membaca Surah Al-Ikhlas setara dengan membaca ... Al-Qur'an",
    arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    options: ["Seperempat", "Sepertiga", "Setengah", "Seluruh"],
    correctAnswer: "Sepertiga",
  },
  {
    id: "juz-amma-bank-100",
    type: "multiple-choice-text",
    prompt:
      "Surah yang berisi kabar pertolongan Allah dan kemenangan (Fathu Makkah) adalah...",
    arabicText: "",
    options: ["Al-Fil", "Al-Kafirun", "An-Nashr", "Al-Ma'un"],
    correctAnswer: "An-Nashr",
  },
];

/**
 * Soal Juz 'Amma yang dihasilkan dari bank ayat lama (Juz Amma Speedrun /
 * Quran Quiz Royale) sehingga Pusat Kuis menjadi gerbang tunggal soal.
 */
const UNIQUE_SURAHS = [...new Set(JUZ_AMMA_VERSES.map((v) => v.surahName))];
function pickSurahOptions(correct: string): string[] {
  const others = UNIQUE_SURAHS.filter((s) => s !== correct);
  const picked: string[] = [];
  for (let i = 0; i < others.length && picked.length < 3; i++) {
    const candidate = others[Math.floor((i * 7 + 3) % others.length)];
    if (!picked.includes(candidate)) picked.push(candidate);
  }
  return shuffleArray([...picked, correct]);
}
function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
const JUZ_AMMA_VERSE_QUESTIONS: QuestionData[] = JUZ_AMMA_VERSES.slice(
  0,
  10,
).map((v) => ({
  id: `juz-amma-ayat-${v.id}`,
  type: "multiple-choice-text",
  prompt: "Ayat berikut termasuk surah apa?",
  arabicText: v.arabic,
  options: pickSurahOptions(v.surahName),
  correctAnswer: v.surahName,
}));
const JUZ_AMMA_TRANSLATION_QUESTIONS: QuestionData[] = JUZ_AMMA_VERSES.slice(
  0,
  6,
).map((v) => ({
  id: `juz-amma-terjemahan-${v.id}`,
  type: "fill-in-the-blank",
  prompt: `Apa arti ayat: ${v.arabic}?`,
  arabicTemplate: `______`,
  availableLetters: shuffleArray([v.surahName, v.translation]),
  options: shuffleArray([v.surahName, v.translation]),
  correctAnswer: [v.translation],
}));

JUZ_AMMA_QUESTIONS.push(
  ...JUZ_AMMA_VERSE_QUESTIONS,
  ...JUZ_AMMA_TRANSLATION_QUESTIONS,
);

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
    prompt:
      "Nabi yang membuat bahtera/kapal besar atas perintah Allah adalah...",
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
  {
    id: "kisah-doa-bank-001",
    type: "multiple-choice-text",
    prompt:
      "Siapakah nabi pertama sekaligus manusia pertama yang diciptakan Allah?",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Nuh AS",
      "Nabi Adam AS",
      "Nabi Idris AS",
      "Nabi Ibrahim AS",
    ],
    correctAnswer: "Nabi Adam AS",
  },
  {
    id: "kisah-doa-bank-002",
    type: "multiple-choice-text",
    prompt: "Siapakah nabi dan rasul terakhir yang diutus Allah?",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Muhammad SAW",
      "Nabi Ibrahim AS",
      "Nabi Isa AS",
      "Nabi Musa AS",
    ],
    correctAnswer: "Nabi Muhammad SAW",
  },
  {
    id: "kisah-doa-bank-003",
    type: "multiple-choice-text",
    prompt: "Berapa jumlah nabi dan rasul yang wajib diketahui umat Islam?",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["10", "25", "20", "30"],
    correctAnswer: "25",
  },
  {
    id: "kisah-doa-bank-004",
    type: "multiple-choice-text",
    prompt:
      "Api yang dinyalakan untuk membakar Nabi Ibrahim AS atas izin Allah menjadi...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Berubah menjadi asap hitam",
      "Dingin dan menyelamatkan",
      "Semakin besar menyala",
      "Berubah menjadi air",
    ],
    correctAnswer: "Dingin dan menyelamatkan",
  },
  {
    id: "kisah-doa-bank-005",
    type: "multiple-choice-text",
    prompt: "Kaum Nabi Nuh AS yang durhaka dihancurkan oleh Allah dengan...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Gempa bumi", "Banjir besar", "Angin topan", "Hujan batu"],
    correctAnswer: "Banjir besar",
  },
  {
    id: "kisah-doa-bank-006",
    type: "multiple-choice-text",
    prompt:
      "Nabi yang pernah ditelan ikan besar dan berdoa dalam kegelapan adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Musa AS",
      "Nabi Ayyub AS",
      "Nabi Yusuf AS",
      "Nabi Yunus AS",
    ],
    correctAnswer: "Nabi Yunus AS",
  },
  {
    id: "kisah-doa-bank-007",
    type: "multiple-choice-text",
    prompt: "Nabi yang diberi mukjizat dapat melunakkan besi adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Isa AS",
      "Nabi Musa AS",
      "Nabi Daud AS",
      "Nabi Sulaiman AS",
    ],
    correctAnswer: "Nabi Daud AS",
  },
  {
    id: "kisah-doa-bank-008",
    type: "multiple-choice-text",
    prompt:
      "Nabi yang diberi kemampuan memahami bahasa hewan dan menundukkan angin adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Sulaiman AS",
      "Nabi Daud AS",
      "Nabi Yusuf AS",
      "Nabi Harun AS",
    ],
    correctAnswer: "Nabi Sulaiman AS",
  },
  {
    id: "kisah-doa-bank-009",
    type: "multiple-choice-text",
    prompt:
      "Nabi yang membelah laut dengan tongkatnya atas izin Allah adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Nabi Nuh AS", "Nabi Musa AS", "Nabi Isa AS", "Nabi Ibrahim AS"],
    correctAnswer: "Nabi Musa AS",
  },
  {
    id: "kisah-doa-bank-010",
    type: "multiple-choice-text",
    prompt: "Nabi yang dilahirkan tanpa seorang ayah adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Yahya AS",
      "Nabi Zakariya AS",
      "Nabi Isa AS",
      "Nabi Yusuf AS",
    ],
    correctAnswer: "Nabi Isa AS",
  },
  {
    id: "kisah-doa-bank-011",
    type: "multiple-choice-text",
    prompt:
      "Nabi yang terkenal sangat sabar menghadapi penyakit dan ujian adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Nabi Hud AS", "Nabi Saleh AS", "Nabi Ayyub AS", "Nabi Yunus AS"],
    correctAnswer: "Nabi Ayyub AS",
  },
  {
    id: "kisah-doa-bank-012",
    type: "multiple-choice-text",
    prompt:
      "Nabi yang dilemparkan ke dalam sumur oleh saudara-saudaranya adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Yusuf AS",
      "Nabi Musa AS",
      "Nabi Ismail AS",
      "Nabi Yunus AS",
    ],
    correctAnswer: "Nabi Yusuf AS",
  },
  {
    id: "kisah-doa-bank-013",
    type: "multiple-choice-text",
    prompt: "Mukjizat unta betina yang keluar dari batu diberikan kepada...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Hud AS",
      "Nabi Saleh AS",
      "Nabi Syu'aib AS",
      "Nabi Luth AS",
    ],
    correctAnswer: "Nabi Saleh AS",
  },
  {
    id: "kisah-doa-bank-014",
    type: "multiple-choice-text",
    prompt: "Nabi Hud AS diutus kepada kaum...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Kaum Tsamud", "Kaum Madyan", "Kaum 'Ad", "Kaum Saba'"],
    correctAnswer: "Kaum 'Ad",
  },
  {
    id: "kisah-doa-bank-015",
    type: "multiple-choice-text",
    prompt: "Nabi Syu'aib AS diutus kepada penduduk...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Mesir", "Tsamud", "Madyan", "'Ad"],
    correctAnswer: "Madyan",
  },
  {
    id: "kisah-doa-bank-016",
    type: "multiple-choice-text",
    prompt:
      "Ibadah kurban berawal dari kisah ketaatan Nabi Ibrahim AS dan putranya, yaitu...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Ismail AS",
      "Nabi Yusuf AS",
      "Nabi Daud AS",
      "Nabi Harun AS",
    ],
    correctAnswer: "Nabi Ismail AS",
  },
  {
    id: "kisah-doa-bank-017",
    type: "multiple-choice-text",
    prompt: "Ayah dari Nabi Yusuf AS adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Ya'qub AS",
      "Nabi Nuh AS",
      "Nabi Ismail AS",
      "Nabi Ibrahim AS",
    ],
    correctAnswer: "Nabi Ya'qub AS",
  },
  {
    id: "kisah-doa-bank-018",
    type: "multiple-choice-text",
    prompt: "Nabi Musa AS mendapat julukan...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Habibullah", "Khalilullah", "Kalimullah", "Ruhullah"],
    correctAnswer: "Kalimullah",
  },
  {
    id: "kisah-doa-bank-019",
    type: "multiple-choice-text",
    prompt: "Nabi Ibrahim AS mendapat julukan...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Ruhullah", "Khalilullah", "Kalimullah", "Safiyullah"],
    correctAnswer: "Khalilullah",
  },
  {
    id: "kisah-doa-bank-020",
    type: "multiple-choice-text",
    prompt: "Kitab Taurat diturunkan kepada...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Musa AS",
      "Nabi Isa AS",
      "Nabi Daud AS",
      "Nabi Muhammad SAW",
    ],
    correctAnswer: "Nabi Musa AS",
  },
  {
    id: "kisah-doa-bank-021",
    type: "multiple-choice-text",
    prompt: "Kitab Zabur diturunkan kepada...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Muhammad SAW",
      "Nabi Isa AS",
      "Nabi Musa AS",
      "Nabi Daud AS",
    ],
    correctAnswer: "Nabi Daud AS",
  },
  {
    id: "kisah-doa-bank-022",
    type: "multiple-choice-text",
    prompt: "Kitab Injil diturunkan kepada...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Muhammad SAW",
      "Nabi Daud AS",
      "Nabi Isa AS",
      "Nabi Musa AS",
    ],
    correctAnswer: "Nabi Isa AS",
  },
  {
    id: "kisah-doa-bank-023",
    type: "multiple-choice-text",
    prompt: "Kitab Al-Qur'an diturunkan kepada...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Musa AS",
      "Nabi Muhammad SAW",
      "Nabi Daud AS",
      "Nabi Isa AS",
    ],
    correctAnswer: "Nabi Muhammad SAW",
  },
  {
    id: "kisah-doa-bank-024",
    type: "multiple-choice-text",
    prompt: "Nabi Harun AS adalah saudara dan pendamping dakwah dari...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Nabi Isa AS", "Nabi Yusuf AS", "Nabi Nuh AS", "Nabi Musa AS"],
    correctAnswer: "Nabi Musa AS",
  },
  {
    id: "kisah-doa-bank-025",
    type: "multiple-choice-text",
    prompt: "Siapakah ibunda Nabi Isa AS?",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["Maryam", "Hajar", "Asiyah", "Sarah"],
    correctAnswer: "Maryam",
  },
  {
    id: "kisah-doa-bank-026",
    type: "multiple-choice-text",
    prompt: "Yang BUKAN termasuk Rasul Ulul Azmi adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Ibrahim AS",
      "Nabi Yunus AS",
      "Nabi Musa AS",
      "Nabi Nuh AS",
    ],
    correctAnswer: "Nabi Yunus AS",
  },
  {
    id: "kisah-doa-bank-027",
    type: "multiple-choice-text",
    prompt: "Berapa jumlah Rasul Ulul Azmi?",
    arabicText: "نَبِيُّ اللَّهِ",
    options: ["4", "5", "7", "3"],
    correctAnswer: "5",
  },
  {
    id: "kisah-doa-bank-028",
    type: "multiple-choice-text",
    prompt: "Siapakah dua nabi yang meninggikan fondasi Ka'bah?",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Nabi Daud AS dan Nabi Sulaiman AS",
      "Nabi Musa AS dan Nabi Harun AS",
      "Nabi Nuh AS dan Nabi Hud AS",
      "Nabi Ibrahim AS dan Nabi Ismail AS",
    ],
    correctAnswer: "Nabi Ibrahim AS dan Nabi Ismail AS",
  },
  {
    id: "kisah-doa-bank-029",
    type: "multiple-choice-text",
    prompt: "Mukjizat Nabi Isa AS dengan izin Allah adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Menyembuhkan orang buta dan menghidupkan orang mati",
      "Membelah lautan",
      "Melunakkan besi",
      "Menundukkan angin",
    ],
    correctAnswer: "Menyembuhkan orang buta dan menghidupkan orang mati",
  },
  {
    id: "kisah-doa-bank-030",
    type: "multiple-choice-text",
    prompt: "Mukjizat terbesar Nabi Muhammad SAW adalah...",
    arabicText: "نَبِيُّ اللَّهِ",
    options: [
      "Al-Qur'an",
      "Unta betina dari batu",
      "Api yang menjadi dingin",
      "Tongkat yang menjadi ular",
    ],
    correctAnswer: "Al-Qur'an",
  },
  {
    id: "kisah-doa-bank-031",
    type: "multiple-choice-text",
    prompt:
      "Malaikat yang bertugas menyampaikan wahyu kepada para nabi adalah...",
    arabicText: "الْمَلَائِكَةُ",
    options: ["Mikail", "Israfil", "Izrail", "Jibril"],
    correctAnswer: "Jibril",
  },
  {
    id: "kisah-doa-bank-032",
    type: "multiple-choice-text",
    prompt:
      "Malaikat yang bertugas membagi rezeki dan menurunkan hujan adalah...",
    arabicText: "الْمَلَائِكَةُ",
    options: ["Malik", "Jibril", "Mikail", "Israfil"],
    correctAnswer: "Mikail",
  },
  {
    id: "kisah-doa-bank-033",
    type: "multiple-choice-text",
    prompt:
      "Malaikat yang bertugas meniup sangkakala pada hari kiamat adalah...",
    arabicText: "الْمَلَائِكَةُ",
    options: ["Jibril", "Ridwan", "Israfil", "Mikail"],
    correctAnswer: "Israfil",
  },
  {
    id: "kisah-doa-bank-034",
    type: "multiple-choice-text",
    prompt: "Malaikat yang bertugas mencabut nyawa adalah...",
    arabicText: "الْمَلَائِكَةُ",
    options: ["Malik", "Mikail", "Izrail", "Jibril"],
    correctAnswer: "Izrail",
  },
  {
    id: "kisah-doa-bank-035",
    type: "multiple-choice-text",
    prompt: "Malaikat yang bertugas menanyai manusia di alam kubur adalah...",
    arabicText: "الْمَلَائِكَةُ",
    options: [
      "Malik dan Ridwan",
      "Jibril dan Mikail",
      "Munkar dan Nakir",
      "Raqib dan Atid",
    ],
    correctAnswer: "Munkar dan Nakir",
  },
  {
    id: "kisah-doa-bank-036",
    type: "multiple-choice-text",
    prompt:
      "Malaikat yang bertugas mencatat amal baik dan buruk manusia adalah...",
    arabicText: "الْمَلَائِكَةُ",
    options: [
      "Munkar dan Nakir",
      "Raqib dan Atid",
      "Malik dan Ridwan",
      "Jibril dan Mikail",
    ],
    correctAnswer: "Raqib dan Atid",
  },
  {
    id: "kisah-doa-bank-037",
    type: "multiple-choice-text",
    prompt: "Malaikat yang bertugas menjaga pintu neraka adalah...",
    arabicText: "الْمَلَائِكَةُ",
    options: ["Malik", "Jibril", "Mikail", "Ridwan"],
    correctAnswer: "Malik",
  },
  {
    id: "kisah-doa-bank-038",
    type: "multiple-choice-text",
    prompt: "Malaikat yang bertugas menjaga pintu surga adalah...",
    arabicText: "الْمَلَائِكَةُ",
    options: ["Israfil", "Malik", "Ridwan", "Izrail"],
    correctAnswer: "Ridwan",
  },
  {
    id: "kisah-doa-bank-039",
    type: "multiple-choice-text",
    prompt: "Malaikat diciptakan Allah dari...",
    arabicText: "الْمَلَائِكَةُ",
    options: ["Tanah", "Cahaya (nur)", "Air", "Api"],
    correctAnswer: "Cahaya (nur)",
  },
  {
    id: "kisah-doa-bank-040",
    type: "multiple-choice-text",
    prompt: "Berapa jumlah rukun iman?",
    arabicText: "أَرْكَانُ الْإِيمَانِ",
    options: ["7", "6", "4", "5"],
    correctAnswer: "6",
  },
  {
    id: "kisah-doa-bank-041",
    type: "multiple-choice-text",
    prompt: "Nabi Muhammad SAW dilahirkan di kota...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Thaif", "Makkah", "Madinah", "Yaman"],
    correctAnswer: "Makkah",
  },
  {
    id: "kisah-doa-bank-042",
    type: "multiple-choice-text",
    prompt: "Nabi Muhammad SAW lahir pada tahun yang dikenal sebagai...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Tahun Hijrah",
      "Tahun Perjanjian",
      "Tahun Duka Cita",
      "Tahun Gajah",
    ],
    correctAnswer: "Tahun Gajah",
  },
  {
    id: "kisah-doa-bank-043",
    type: "multiple-choice-text",
    prompt: "Siapa nama ayah Nabi Muhammad SAW?",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Abu Lahab bin Abdul Muthalib",
      "Abu Thalib bin Abdul Muthalib",
      "Hamzah bin Abdul Muthalib",
      "Abdullah bin Abdul Muthalib",
    ],
    correctAnswer: "Abdullah bin Abdul Muthalib",
  },
  {
    id: "kisah-doa-bank-044",
    type: "multiple-choice-text",
    prompt:
      "Kakek yang mengasuh Nabi Muhammad SAW setelah ibunda beliau wafat adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Hasyim", "Abu Bakar", "Abdul Muthalib", "Abu Thalib"],
    correctAnswer: "Abdul Muthalib",
  },
  {
    id: "kisah-doa-bank-045",
    type: "multiple-choice-text",
    prompt:
      "Wanita yang menyusui Nabi Muhammad SAW di perkampungan Bani Sa'ad adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Fathimah", "Khadijah", "Aminah", "Halimah as-Sa'diyah"],
    correctAnswer: "Halimah as-Sa'diyah",
  },
  {
    id: "kisah-doa-bank-046",
    type: "multiple-choice-text",
    prompt: "Sebelum menjadi nabi, Muhammad SAW dijuluki...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Dzun Nurain", "Ash-Shiddiq", "Al-Amin", "Al-Faruq"],
    correctAnswer: "Al-Amin",
  },
  {
    id: "kisah-doa-bank-047",
    type: "multiple-choice-text",
    prompt: "Istri pertama Nabi Muhammad SAW adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Aisyah binti Abu Bakar",
      "Ummu Salamah",
      "Hafshah binti Umar",
      "Khadijah binti Khuwailid",
    ],
    correctAnswer: "Khadijah binti Khuwailid",
  },
  {
    id: "kisah-doa-bank-048",
    type: "multiple-choice-text",
    prompt: "Wahyu pertama yang diterima Nabi Muhammad SAW adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Surah Al-Muddatstsir",
      "Surah Al-Ikhlas",
      "Surah Al-Fatihah",
      "Surah Al-'Alaq ayat 1-5",
    ],
    correctAnswer: "Surah Al-'Alaq ayat 1-5",
  },
  {
    id: "kisah-doa-bank-049",
    type: "multiple-choice-text",
    prompt: "Wahyu pertama diterima Nabi Muhammad SAW di sebuah gua bernama...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Gua Kahfi", "Gua Hira", "Gua Safa", "Gua Tsur"],
    correctAnswer: "Gua Hira",
  },
  {
    id: "kisah-doa-bank-050",
    type: "multiple-choice-text",
    prompt: "Nabi Muhammad SAW berhijrah dari Makkah ke kota...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Habasyah", "Madinah", "Thaif", "Yaman"],
    correctAnswer: "Madinah",
  },
  {
    id: "kisah-doa-bank-051",
    type: "multiple-choice-text",
    prompt:
      "Sahabat yang menemani Nabi Muhammad SAW saat hijrah ke Madinah adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Utsman bin Affan",
      "Umar bin Khattab",
      "Abu Bakar ash-Shiddiq",
      "Ali bin Abi Thalib",
    ],
    correctAnswer: "Abu Bakar ash-Shiddiq",
  },
  {
    id: "kisah-doa-bank-052",
    type: "multiple-choice-text",
    prompt: "Saat hijrah, Nabi dan sahabatnya bersembunyi di gua...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Gua Safa", "Gua Tsur", "Gua Kahfi", "Gua Hira"],
    correctAnswer: "Gua Tsur",
  },
  {
    id: "kisah-doa-bank-053",
    type: "multiple-choice-text",
    prompt: "Peristiwa Isra' Mi'raj melahirkan perintah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Shalat lima waktu", "Haji", "Zakat", "Puasa Ramadhan"],
    correctAnswer: "Shalat lima waktu",
  },
  {
    id: "kisah-doa-bank-054",
    type: "multiple-choice-text",
    prompt: "Muadzin pertama dalam Islam adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Abdullah bin Ummi Maktum",
      "Salman al-Farisi",
      "Umar bin Khattab",
      "Bilal bin Rabah",
    ],
    correctAnswer: "Bilal bin Rabah",
  },
  {
    id: "kisah-doa-bank-055",
    type: "multiple-choice-text",
    prompt:
      "Masjid pertama yang dibangun Nabi saat tiba di sekitar Madinah adalah Masjid...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Al-Haram", "Nabawi", "Quba", "Al-Aqsha"],
    correctAnswer: "Quba",
  },
  {
    id: "kisah-doa-bank-056",
    type: "multiple-choice-text",
    prompt:
      "Putri Nabi Muhammad SAW yang menikah dengan Ali bin Abi Thalib adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["Zainab", "Ruqayyah", "Fathimah az-Zahra", "Ummu Kultsum"],
    correctAnswer: "Fathimah az-Zahra",
  },
  {
    id: "kisah-doa-bank-057",
    type: "multiple-choice-text",
    prompt: "Khalifah pertama setelah Rasulullah SAW wafat adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Ali bin Abi Thalib",
      "Abu Bakar ash-Shiddiq",
      "Utsman bin Affan",
      "Umar bin Khattab",
    ],
    correctAnswer: "Abu Bakar ash-Shiddiq",
  },
  {
    id: "kisah-doa-bank-058",
    type: "multiple-choice-text",
    prompt: "Nabi Muhammad SAW wafat pada usia...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: ["50 tahun", "70 tahun", "40 tahun", "63 tahun"],
    correctAnswer: "63 tahun",
  },
  {
    id: "kisah-doa-bank-059",
    type: "multiple-choice-text",
    prompt: "Penanggalan Hijriyah dimulai dari peristiwa...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Hijrah Nabi dari Makkah ke Madinah",
      "Perang Badar",
      "Kelahiran Nabi",
      "Turunnya wahyu pertama",
    ],
    correctAnswer: "Hijrah Nabi dari Makkah ke Madinah",
  },
  {
    id: "kisah-doa-bank-060",
    type: "multiple-choice-text",
    prompt: "Sahabat Nabi yang bergelar Al-Faruq adalah...",
    arabicText: "السِّيرَةُ النَّبَوِيَّةُ",
    options: [
      "Utsman bin Affan",
      "Abu Bakar ash-Shiddiq",
      "Ali bin Abi Thalib",
      "Umar bin Khattab",
    ],
    correctAnswer: "Umar bin Khattab",
  },
  {
    id: "kisah-doa-bank-061",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    options: [
      "Segala puji bagi Allah Tuhan semesta alam",
      "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
      "Aku memohon ampun kepada Allah",
      "Maha Suci Allah dan segala puji bagi-Nya",
    ],
    correctAnswer: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
  },
  {
    id: "kisah-doa-bank-062",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "الْحَمْدُ لِلَّهِ",
    options: [
      "Dengan nama Allah",
      "Segala puji bagi Allah",
      "Maha Suci Allah",
      "Allah Maha Besar",
    ],
    correctAnswer: "Segala puji bagi Allah",
  },
  {
    id: "kisah-doa-bank-063",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "أَسْتَغْفِرُ اللَّهَ",
    options: [
      "Aku memohon ampun kepada Allah",
      "Aku berlindung kepada Allah",
      "Segala puji bagi Allah",
      "Allah Maha Besar",
    ],
    correctAnswer: "Aku memohon ampun kepada Allah",
  },
  {
    id: "kisah-doa-bank-064",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "سُبْحَانَ اللَّهِ",
    options: [
      "Maha Suci Allah",
      "Tiada daya dan upaya kecuali dengan Allah",
      "Segala puji bagi Allah",
      "Allah Maha Besar",
    ],
    correctAnswer: "Maha Suci Allah",
  },
  {
    id: "kisah-doa-bank-065",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "اللَّهُ أَكْبَرُ",
    options: [
      "Maha Suci Allah",
      "Segala puji bagi Allah",
      "Aku memohon ampun kepada Allah",
      "Allah Maha Besar",
    ],
    correctAnswer: "Allah Maha Besar",
  },
  {
    id: "kisah-doa-bank-066",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "غُفْرَانَكَ",
    options: [
      "Aku memohon ampunan-Mu",
      "Aku memohon perlindungan-Mu",
      "Aku memohon rezeki-Mu",
      "Aku memohon petunjuk-Mu",
    ],
    correctAnswer: "Aku memohon ampunan-Mu",
  },
  {
    id: "kisah-doa-bank-067",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "رَبِّ زِدْنِي عِلْمًا",
    options: [
      "Ya Tuhanku, berilah aku rezeki",
      "Ya Tuhanku, lapangkanlah dadaku",
      "Ya Tuhanku, tambahkanlah ilmu kepadaku",
      "Ya Tuhanku, ampunilah aku",
    ],
    correctAnswer: "Ya Tuhanku, tambahkanlah ilmu kepadaku",
  },
  {
    id: "kisah-doa-bank-068",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "يَرْحَمُكَ اللَّهُ",
    options: [
      "Semoga Allah memberimu petunjuk",
      "Semoga Allah menjagamu",
      "Semoga Allah mengampunimu",
      "Semoga Allah merahmatimu",
    ],
    correctAnswer: "Semoga Allah merahmatimu",
  },
  {
    id: "kisah-doa-bank-069",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    options: [
      "Segala puji bagi Allah atas segala keadaan",
      "Sesungguhnya Allah bersama orang-orang yang sabar",
      "Cukuplah Allah sebagai penolong kami",
      "Sesungguhnya kami milik Allah dan kepada-Nya kami kembali",
    ],
    correctAnswer: "Sesungguhnya kami milik Allah dan kepada-Nya kami kembali",
  },
  {
    id: "kisah-doa-bank-070",
    type: "multiple-choice-text",
    prompt: "Apa arti dari ucapan berikut?",
    arabicText: "مَا شَاءَ اللَّهُ",
    options: [
      "Cukuplah Allah bagi kami",
      "Kami berserah diri kepada Allah",
      "Jika Allah menghendaki",
      "Apa yang Allah kehendaki (terjadi)",
    ],
    correctAnswer: "Apa yang Allah kehendaki (terjadi)",
  },
  {
    id: "kisah-doa-bank-071",
    type: "word-scramble",
    instruction: "Susun lanjutan doa sebelum makan",
    prompt: "Dan lindungilah kami dari siksa neraka",
    correctWords: ["وَقِنَا", "عَذَابَ", "النَّارِ"],
    bankWords: ["النَّارِ", "عَذَابَ", "بَارِكْ", "وَقِنَا"],
    correctAnswer: "وَقِنَا عَذَابَ النَّارِ",
  },
  {
    id: "kisah-doa-bank-072",
    type: "word-scramble",
    instruction: "Susun doa sesudah makan",
    prompt:
      "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami muslim",
    correctWords: [
      "الْحَمْدُ",
      "لِلَّهِ",
      "الَّذِي",
      "أَطْعَمَنَا",
      "وَسَقَانَا",
      "وَجَعَلَنَا",
      "مُسْلِمِينَ",
    ],
    bankWords: [
      "وَسَقَانَا",
      "الْحَمْدُ",
      "بَارِكْ",
      "لِلَّهِ",
      "أَطْعَمَنَا",
      "الَّذِي",
      "وَجَعَلَنَا",
      "مُسْلِمِينَ",
    ],
    correctAnswer:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
  },
  {
    id: "kisah-doa-bank-073",
    type: "word-scramble",
    instruction: "Susun doa sebelum tidur",
    prompt: "Dengan nama-Mu ya Allah, aku hidup dan aku mati",
    correctWords: ["بِاسْمِكَ", "اللَّهُمَّ", "أَحْيَا", "وَأَمُوتُ"],
    bankWords: [
      "أَصْبَحْنَا",
      "أَحْيَا",
      "بِاسْمِكَ",
      "وَأَمُوتُ",
      "اللَّهُمَّ",
    ],
    correctAnswer: "بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ",
  },
  {
    id: "kisah-doa-bank-074",
    type: "word-scramble",
    instruction: "Susun doa bangun tidur",
    prompt:
      "Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan",
    correctWords: [
      "الْحَمْدُ",
      "لِلَّهِ",
      "الَّذِي",
      "أَحْيَانَا",
      "بَعْدَ",
      "مَا",
      "أَمَاتَنَا",
      "وَإِلَيْهِ",
      "النُّشُورُ",
    ],
    bankWords: [
      "الْحَمْدُ",
      "أَمَاتَنَا",
      "لِلَّهِ",
      "أَحْيَانَا",
      "وَإِلَيْهِ",
      "مَا",
      "الَّذِي",
      "النُّشُورُ",
      "بَعْدَ",
    ],
    correctAnswer:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
  },
  {
    id: "kisah-doa-bank-075",
    type: "word-scramble",
    instruction: "Susun doa masuk kamar mandi",
    prompt:
      "Ya Allah, aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan",
    correctWords: [
      "اللَّهُمَّ",
      "إِنِّي",
      "أَعُوذُ",
      "بِكَ",
      "مِنَ",
      "الْخُبُثِ",
      "وَالْخَبَائِثِ",
    ],
    bankWords: [
      "وَالْخَبَائِثِ",
      "إِنِّي",
      "بِكَ",
      "مِنَ",
      "الْخُبُثِ",
      "اللَّهُمَّ",
      "أَعُوذُ",
    ],
    correctAnswer:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
  },
  {
    id: "kisah-doa-bank-076",
    type: "word-scramble",
    instruction: "Susun doa masuk masjid",
    prompt: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu",
    correctWords: ["اللَّهُمَّ", "افْتَحْ", "لِي", "أَبْوَابَ", "رَحْمَتِكَ"],
    bankWords: [
      "اللَّهُمَّ",
      "لِي",
      "أَبْوَابَ",
      "افْتَحْ",
      "رَحْمَتِكَ",
      "فَضْلِكَ",
    ],
    correctAnswer: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
  },
  {
    id: "kisah-doa-bank-077",
    type: "word-scramble",
    instruction: "Susun doa keluar masjid",
    prompt: "Ya Allah, sungguh aku memohon kepada-Mu sebagian dari karunia-Mu",
    correctWords: ["اللَّهُمَّ", "إِنِّي", "أَسْأَلُكَ", "مِنْ", "فَضْلِكَ"],
    bankWords: [
      "إِنِّي",
      "رَحْمَتِكَ",
      "مِنْ",
      "فَضْلِكَ",
      "أَسْأَلُكَ",
      "اللَّهُمَّ",
    ],
    correctAnswer: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
  },
  {
    id: "kisah-doa-bank-078",
    type: "word-scramble",
    instruction: "Susun potongan doa naik kendaraan",
    prompt: "Maha Suci Allah yang telah menundukkan kendaraan ini bagi kami",
    correctWords: ["سُبْحَانَ", "الَّذِي", "سَخَّرَ", "لَنَا", "هَذَا"],
    bankWords: ["خَلَقَ", "هَذَا", "سَخَّرَ", "سُبْحَانَ", "الَّذِي", "لَنَا"],
    correctAnswer: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
  },
  {
    id: "kisah-doa-bank-079",
    type: "word-scramble",
    instruction: "Susun doa untuk kedua orang tua",
    prompt:
      "Ya Tuhanku, sayangilah keduanya sebagaimana mereka berdua mendidikku waktu kecil",
    correctWords: ["رَبِّ", "ارْحَمْهُمَا", "كَمَا", "رَبَّيَانِي", "صَغِيرًا"],
    bankWords: [
      "رَبِّ",
      "اغْفِرْ",
      "كَمَا",
      "رَبَّيَانِي",
      "ارْحَمْهُمَا",
      "صَغِيرًا",
    ],
    correctAnswer: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
  },
  {
    id: "kisah-doa-bank-080",
    type: "word-scramble",
    instruction: "Susun doa sapu jagat",
    prompt: "Ya Tuhan kami, berilah kami kebaikan di dunia",
    correctWords: ["رَبَّنَا", "آتِنَا", "فِي", "الدُّنْيَا", "حَسَنَةً"],
    bankWords: [
      "الْآخِرَةِ",
      "رَبَّنَا",
      "آتِنَا",
      "فِي",
      "الدُّنْيَا",
      "حَسَنَةً",
    ],
    correctAnswer: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
  },
  {
    id: "kisah-doa-bank-081",
    type: "word-scramble",
    instruction: "Susun doa menambah ilmu",
    prompt: "Ya Tuhanku, tambahkanlah ilmu kepadaku",
    correctWords: ["رَبِّ", "زِدْنِي", "عِلْمًا"],
    bankWords: ["زِدْنِي", "رَبِّ", "عِلْمًا", "اغْفِرْ"],
    correctAnswer: "رَبِّ زِدْنِي عِلْمًا",
  },
  {
    id: "kisah-doa-bank-082",
    type: "word-scramble",
    instruction: "Susun doa ketika bercermin",
    prompt:
      "Ya Allah, sebagaimana Engkau telah memperindah penciptaanku, perindahlah akhlakku",
    correctWords: [
      "اللَّهُمَّ",
      "كَمَا",
      "حَسَّنْتَ",
      "خَلْقِي",
      "فَحَسِّنْ",
      "خُلُقِي",
    ],
    bankWords: [
      "خَلْقِي",
      "اللَّهُمَّ",
      "خُلُقِي",
      "فَحَسِّنْ",
      "كَمَا",
      "حَسَّنْتَ",
    ],
    correctAnswer: "اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
  },
  {
    id: "kisah-doa-bank-083",
    type: "word-scramble",
    instruction: "Susun doa masuk rumah",
    prompt: "Dengan nama Allah kami masuk",
    correctWords: ["بِسْمِ", "اللَّهِ", "وَلَجْنَا"],
    bankWords: ["وَلَجْنَا", "خَرَجْنَا", "بِسْمِ", "اللَّهِ"],
    correctAnswer: "بِسْمِ اللَّهِ وَلَجْنَا",
  },
  {
    id: "kisah-doa-bank-084",
    type: "word-scramble",
    instruction: "Susun doa Nabi Yunus AS",
    prompt: "Tidak ada tuhan selain Engkau, Maha Suci Engkau",
    correctWords: ["لَا", "إِلَهَ", "إِلَّا", "أَنْتَ", "سُبْحَانَكَ"],
    bankWords: ["لَا", "أَنْتَ", "إِلَّا", "سُبْحَانَكَ", "إِلَهَ"],
    correctAnswer: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ",
  },
  {
    id: "kisah-doa-bank-085",
    type: "word-scramble",
    instruction: "Susun doa Nabi Musa AS",
    prompt: "Ya Tuhanku, lapangkanlah dadaku",
    correctWords: ["رَبِّ", "اشْرَحْ", "لِي", "صَدْرِي"],
    bankWords: ["اشْرَحْ", "أَمْرِي", "لِي", "رَبِّ", "صَدْرِي"],
    correctAnswer: "رَبِّ اشْرَحْ لِي صَدْرِي",
  },
  {
    id: "kisah-doa-bank-086",
    type: "fill-in-the-blank",
    prompt: "Doa keluar kamar mandi (memohon ampunan-Mu):",
    arabicTemplate: "______",
    options: ["سُبْحَانَكَ", "غُفْرَانَكَ", "لَبَّيْكَ", "أَسْتَغْفِرُ"],
    availableLetters: [
      "سُبْحَانَكَ",
      "غُفْرَانَكَ",
      "لَبَّيْكَ",
      "أَسْتَغْفِرُ",
    ],
    correctAnswer: ["غُفْرَانَكَ"],
  },
  {
    id: "kisah-doa-bank-087",
    type: "fill-in-the-blank",
    prompt: "Ucapan ketika bersin (segala puji bagi Allah):",
    arabicTemplate: "الْحَمْدُ ______",
    options: ["لِلْعَبْدِ", "لِلْمَلِكِ", "لِلنَّبِيِّ", "لِلَّهِ"],
    availableLetters: ["لِلْعَبْدِ", "لِلْمَلِكِ", "لِلنَّبِيِّ", "لِلَّهِ"],
    correctAnswer: ["لِلَّهِ"],
  },
  {
    id: "kisah-doa-bank-088",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa untuk orang tua:",
    arabicTemplate: "وَارْحَمْهُمَا كَمَا رَبَّيَانِي ______",
    options: ["جَمِيلًا", "صَغِيرًا", "سَرِيعًا", "كَبِيرًا"],
    availableLetters: ["جَمِيلًا", "صَغِيرًا", "سَرِيعًا", "كَبِيرًا"],
    correctAnswer: ["صَغِيرًا"],
  },
  {
    id: "kisah-doa-bank-089",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa sesudah makan:",
    arabicTemplate: "وَجَعَلَنَا ______",
    options: ["فَائِزِينَ", "كَاتِبِينَ", "مُجْتَهِدِينَ", "مُسْلِمِينَ"],
    availableLetters: [
      "فَائِزِينَ",
      "كَاتِبِينَ",
      "مُجْتَهِدِينَ",
      "مُسْلِمِينَ",
    ],
    correctAnswer: ["مُسْلِمِينَ"],
  },
  {
    id: "kisah-doa-bank-090",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa sapu jagat (kebaikan di akhirat):",
    arabicTemplate: "وَفِي الْآخِرَةِ ______ وَقِنَا عَذَابَ النَّارِ",
    options: ["حَسَنَةً", "سَيِّئَةً", "جَنَّةً", "ذُرِّيَّةً"],
    availableLetters: ["حَسَنَةً", "سَيِّئَةً", "جَنَّةً", "ذُرِّيَّةً"],
    correctAnswer: ["حَسَنَةً"],
  },
  {
    id: "kisah-doa-bank-091",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa menambah ilmu:",
    arabicTemplate: "رَبِّ زِدْنِي ______",
    options: ["رِزْقًا", "عِلْمًا", "مَالًا", "عُمُرًا"],
    availableLetters: ["رِزْقًا", "عِلْمًا", "مَالًا", "عُمُرًا"],
    correctAnswer: ["عِلْمًا"],
  },
  {
    id: "kisah-doa-bank-092",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa Nabi Adam AS dan Hawa:",
    arabicTemplate: "رَبَّنَا ظَلَمْنَا ______",
    options: ["أَهْلَنَا", "أَنْفُسَنَا", "بُيُوتَنَا", "قَوْمَنَا"],
    availableLetters: ["أَهْلَنَا", "أَنْفُسَنَا", "بُيُوتَنَا", "قَوْمَنَا"],
    correctAnswer: ["أَنْفُسَنَا"],
  },
  {
    id: "kisah-doa-bank-093",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa Nabi Yunus AS:",
    arabicTemplate: "سُبْحَانَكَ إِنِّي كُنْتُ مِنَ ______",
    options: [
      "الْمُؤْمِنِينَ",
      "الْمُتَّقِينَ",
      "الصَّالِحِينَ",
      "الظَّالِمِينَ",
    ],
    availableLetters: [
      "الْمُؤْمِنِينَ",
      "الْمُتَّقِينَ",
      "الصَّالِحِينَ",
      "الظَّالِمِينَ",
    ],
    correctAnswer: ["الظَّالِمِينَ"],
  },
  {
    id: "kisah-doa-bank-094",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa Nabi Musa AS (mudahkanlah urusanku):",
    arabicTemplate: "وَيَسِّرْ لِي ______",
    options: ["رِزْقِي", "قَوْمِي", "بَيْتِي", "أَمْرِي"],
    availableLetters: ["رِزْقِي", "قَوْمِي", "بَيْتِي", "أَمْرِي"],
    correctAnswer: ["أَمْرِي"],
  },
  {
    id: "kisah-doa-bank-095",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa Nabi Ayyub AS:",
    arabicTemplate: "أَنِّي مَسَّنِيَ ______ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ",
    options: ["الضُّرُّ", "الْجُوعُ", "الْخَوْفُ", "الْحُزْنُ"],
    availableLetters: ["الضُّرُّ", "الْجُوعُ", "الْخَوْفُ", "الْحُزْنُ"],
    correctAnswer: ["الضُّرُّ"],
  },
  {
    id: "kisah-doa-bank-096",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa keluar rumah:",
    arabicTemplate: "بِسْمِ اللَّهِ تَوَكَّلْتُ ______ اللَّهِ",
    options: ["إِلَى", "فِي", "عَلَى", "مِنْ"],
    availableLetters: ["إِلَى", "فِي", "عَلَى", "مِنْ"],
    correctAnswer: ["عَلَى"],
  },
  {
    id: "kisah-doa-bank-097",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa masuk masjid:",
    arabicTemplate: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ ______",
    options: ["الْكَعْبَةِ", "رَحْمَتِكَ", "الْبَيْتِ", "الْمَدِينَةِ"],
    availableLetters: [
      "الْكَعْبَةِ",
      "رَحْمَتِكَ",
      "الْبَيْتِ",
      "الْمَدِينَةِ",
    ],
    correctAnswer: ["رَحْمَتِكَ"],
  },
  {
    id: "kisah-doa-bank-098",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa bangun tidur (dan kepada-Nya kami dibangkitkan):",
    arabicTemplate: "وَإِلَيْهِ ______",
    options: ["النُّشُورُ", "الطُّهُورُ", "الْعُبُورُ", "الظُّهُورُ"],
    availableLetters: ["النُّشُورُ", "الطُّهُورُ", "الْعُبُورُ", "الظُّهُورُ"],
    correctAnswer: ["النُّشُورُ"],
  },
  {
    id: "kisah-doa-bank-099",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa naik kendaraan:",
    arabicTemplate: "سُبْحَانَ الَّذِي ______ لَنَا هَذَا",
    options: ["رَزَقَ", "خَلَقَ", "أَنْزَلَ", "سَخَّرَ"],
    availableLetters: ["رَزَقَ", "خَلَقَ", "أَنْزَلَ", "سَخَّرَ"],
    correctAnswer: ["سَخَّرَ"],
  },
  {
    id: "kisah-doa-bank-100",
    type: "fill-in-the-blank",
    prompt: "Lengkapi doa berbuka puasa:",
    arabicTemplate: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ ______",
    options: ["الْقُلُوبُ", "الْأَيْدِي", "الْعُرُوقُ", "الْعُيُونُ"],
    availableLetters: ["الْقُلُوبُ", "الْأَيْدِي", "الْعُرُوقُ", "الْعُيُونُ"],
    correctAnswer: ["الْعُرُوقُ"],
  },
];

/**
 * Soal Kisah Nabi & Doa yang dihasilkan dari bank misi lama (Quiz Ngaji /
 * Petualangan Santri) sehingga Pusat Kuis menjadi gerbang tunggal soal.
 */
const ANGEL_QUESTIONS: QuestionData[] = ANGEL_MISSIONS.map((m) => ({
  id: `kisah-malaikat-${m.id}`,
  type: "multiple-choice-text",
  prompt: m.prompt,
  arabicText: "ﷺ",
  options: [...m.options],
  correctAnswer: m.options[m.correctIndex],
}));
const CHRONICLE_QUESTIONS: QuestionData[] = CHRONICLES.map((ch) => {
  const goodChoice = ch.choices.reduce((best, c) =>
    c.delta.wisdom + c.delta.mercy > best.delta.wisdom + best.delta.mercy
      ? c
      : best,
  );
  return {
    id: `kisah-nabi-${ch.id}`,
    type: "multiple-choice-text",
    prompt: ch.prompt,
    arabicText: "ﷺ",
    options: ch.choices.map((c) => c.text),
    correctAnswer: goodChoice.text,
  };
});

KISAH_DOA_QUESTIONS.push(...ANGEL_QUESTIONS, ...CHRONICLE_QUESTIONS);

// Peta Kategori ke Bank Soal
export const QUIZ_HUB_QUESTIONS: Record<QuizHubCategory, QuestionData[]> = {
  tilawati: TILAWATI_QUESTIONS,
  "juz-amma": JUZ_AMMA_QUESTIONS,
  "kisah-doa": KISAH_DOA_QUESTIONS,
  "bahasa-arab": ARABIC_VOCAB_QUESTIONS,
  "misi-5-waktu": MISI_5_WAKTU_QUESTIONS,
  "peta-iman": PETA_IMAN_QUESTIONS,
  "air-kehidupan": AIR_KEHIDUPAN_QUESTIONS,
  "tameng-ramadan": TAMENG_RAMADAN_QUESTIONS,
  "misi-berbagi": MISI_BERBAGI_QUESTIONS,
  "panduan-ksatria": PANDUAN_KSATRIA_QUESTIONS,
  "lorong-waktu": LORONG_WAKTU_QUESTIONS,
  "puncak-arafah": PUNCAK_ARAFAH_QUESTIONS,
};

/**
 * Generator Pseudorandom Number Generator (Mulberry32) deterministik berbasis Seed.
 */
export function getSeededRandom(seed: number): () => number {
  let s = Math.floor(seed) || 12345;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
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
 * Mengambil soal untuk Pusat Kuis dengan opsi mode, seed, dan level.
 */
export function getQuizHubQuestions(
  category: QuizHubCategory = "bahasa-arab",
  mode: "all" | "mcq" | "scramble" = "all",
  seed?: number,
  limit = 5,
  level?: number,
): QuestionData[] {
  const catInfo = QUIZ_HUB_CATEGORIES.find((c) => c.id === category);

  // Jika level diberikan, cek apakah kategori punya levels eksplisit
  let rawPool: QuestionData[] = [];
  if (level && catInfo?.levels) {
    const lvlData = catInfo.levels.find((l) => l.level === level);
    if (lvlData && lvlData.questions.length > 0) {
      rawPool = [...lvlData.questions];
    }
  }

  // Fallback: jika tidak ada questions khusus level, pakai bank utama dan potong
  if (rawPool.length === 0) {
    rawPool =
      category === "tilawati"
        ? getRandomQuestions(1, Math.max(limit * 2, 10)).map(toTilawatiQuestionData)
        : QUIZ_HUB_QUESTIONS[category] || ARABIC_VOCAB_QUESTIONS;

    // Jika level diberikan, potong menjadi chunk sebesar (total / 6) untuk kategori lama
    if (level && level >= 1 && level <= 6 && rawPool.length > 6) {
      const chunkSize = Math.max(5, Math.floor(rawPool.length / 6));
      const start = (level - 1) * chunkSize;
      const end = start + chunkSize;
      const sliced = rawPool.slice(start, end);
      if (sliced.length > 0) {
        rawPool = sliced;
      }
    }
  }

  let filtered = rawPool;
  if (mode === "scramble") {
    filtered = rawPool.filter(
      (q) =>
        q.type === "word-scramble" ||
        (q.correctWords && q.correctWords.length > 0),
    );
    // Jika tidak cukup soal scramble di kategori ini, sertakan dari seluruh kategori
    if (filtered.length < limit) {
      const allScramble = Object.values(QUIZ_HUB_QUESTIONS)
        .flat()
        .filter(
          (q) =>
            q.type === "word-scramble" ||
            (q.correctWords && q.correctWords.length > 0),
        );
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

// Re-export adventure level utilities
export {
  ADVENTURE_LEVEL_DEFINITIONS,
  getCategoryUnlockedLevel,
  saveCategoryLevelCompleted,
  QUIZ_PROGRESS_STORAGE_KEY,
  type QuizAdventureLevel,
} from "./quizAdventureData";
