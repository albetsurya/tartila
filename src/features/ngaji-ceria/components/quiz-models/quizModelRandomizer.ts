import type { AudioMatchingOption, QuestionData, QuizModelType } from "./types";

/** Daftar huruf Arab standar Tilawati untuk pengecoh */
export const ARABIC_DISTRACTORS: readonly string[] = [
  "اَ", "بَ", "تَ", "ثَ", "جَ", "حَ", "خَ", "دَ", "ذَ", "رَ",
  "زَ", "سَ", "شَ", "صَ", "ضَ", "طَ", "ظَ", "عَ", "غَ", "فَ",
  "قَ", "كَ", "لَ", "مَ", "نَ", "وَ", "هـَ", "يَ",
];

/** Daftar suku kata Latin standar untuk pengecoh */
export const LATIN_DISTRACTORS: readonly string[] = [
  "a", "ba", "ta", "tsa", "ja", "ha", "kho", "da", "dza", "ro",
  "za", "sa", "sya", "sho", "dho", "tho", "dzo", "‘a", "gho", "fa",
  "qo", "ka", "la", "ma", "na", "wa", "ya", "i", "u",
];

export function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Mengekstrak kata/kepingan huruf Arab bersih (tanpa tanda sama dengan '=', strip '-', tanda waqaf, atau lingkaran ayat).
 */
export function extractArabicTokens(arabicText: string): string[] {
  return arabicText
    .split(/\s+/)
    .map((w) => w.replace(/[=\-—:.,○\u25cb\u25ef[\]()]/g, "").trim())
    .filter((w) => w.length > 0 && isArabicText(w));
}

/**
 * Generator Bank Huruf (availableLetters / bankLetters).
 * Aturan Mutlak:
 * 1. Seluruh frekuensi elemen `correctAnswer` disalin utuh (huruf kembar TIDAK boleh dihilangkan via Set).
 * 2. Tambahkan 3-4 pengecoh secara acak.
 * 3. Standarisasi format: Teks Arab HANYA boleh berisi Teks Arab. Transliterasi Latin HANYA boleh berisi Latin.
 */
export function generateAvailableLetters(
  correctAnswer: string[],
  siblingTokens: string[] = [],
  distractorCount: number = 3,
): string[] {
  // Salin semua huruf dari jawaban benar (menjaga frekuensi kembar)
  const rawTokens = [...correctAnswer.map((s) => s.trim()).filter(Boolean)];
  if (rawTokens.length === 0) return [];

  // Deteksi apakah format jawaban adalah Teks Arab
  const isArabic = rawTokens.some((token) => isArabicText(token));

  // Bersihkan tanda baca non-Arab jika format adalah Teks Arab
  const bank = isArabic
    ? rawTokens
        .map((s) => s.replace(/[=\-—:.,○\u25cb\u25ef[\]()]/g, "").trim())
        .filter((s) => s.length > 0 && isArabicText(s))
    : rawTokens;

  if (bank.length === 0) return [];

  // Kumpulkan calon pengecoh yang sesuai format (Arab vs Latin)
  const pool = isArabic ? ARABIC_DISTRACTORS : LATIN_DISTRACTORS;
  const filteredSiblings = siblingTokens
    .map((s) => (isArabic ? s.replace(/[=\-—:.,○\u25cb\u25ef[\]()]/g, "").trim() : s.trim()))
    .filter((s) => s.length > 0 && (isArabic ? isArabicText(s) : !isArabicText(s)));

  // Ambil kandidat unik yang bukan bagian dari jawaban benar
  const existingSet = new Set(bank);
  const candidatePool = Array.from(new Set([...filteredSiblings, ...pool])).filter(
    (distractor) => !existingSet.has(distractor),
  );

  // Acak calon pengecoh dan ambil 3–4
  const shuffledCandidates = [...candidatePool].sort(() => Math.random() - 0.5);
  const pickedDistractors = shuffledCandidates.slice(
    0,
    Math.max(distractorCount, Math.min(4, shuffledCandidates.length)),
  );

  // Gabungkan jawaban asli (termasuk huruf kembar) + pengecoh, lalu kocok
  const result = [...bank, ...pickedDistractors];
  return result.sort(() => Math.random() - 0.5);
}

/**
 * Memvalidasi apakah bank huruf memuat semua huruf yang dibutuhkan correctAnswer
 * (termasuk jumlah frekuensi huruf kembar) serta keseragaman format (Arab vs Latin).
 */
export function validateAvailableLetters(
  correctAnswer: string[],
  availableLetters: string[],
): { valid: boolean; reason?: string } {
  const needed: Record<string, number> = {};
  for (const token of correctAnswer) {
    const clean = token.trim();
    if (!clean) continue;
    needed[clean] = (needed[clean] || 0) + 1;
  }

  const available: Record<string, number> = {};
  for (const token of availableLetters) {
    const clean = token.trim();
    if (!clean) continue;
    available[clean] = (available[clean] || 0) + 1;
  }

  for (const [token, count] of Object.entries(needed)) {
    if ((available[token] || 0) < count) {
      return {
        valid: false,
        reason: `Huruf "${token}" membutuhkan ${count} buah, tetapi di bank hanya ada ${available[token] || 0}`,
      };
    }
  }

  const isAnswerArabic = correctAnswer.some((t) => isArabicText(t));
  const hasMixedFormat = availableLetters.some((t) =>
    isAnswerArabic ? !isArabicText(t) : isArabicText(t),
  );
  if (hasMixedFormat) {
    return {
      valid: false,
      reason: `Format bank huruf bercampur antara teks Arab dan Latin`,
    };
  }

  return { valid: true };
}

/** Model yang boleh diacak. `material` bukan soal, jadi tidak diacak. */
export type RandomizableQuizModel = Exclude<QuizModelType, "material">;

export const RANDOMIZABLE_QUIZ_MODELS: RandomizableQuizModel[] = [
  "fill-in-the-blank",
  "multiple-choice-text",
  "multiple-choice-audio",
  "audio-matching",
  "arrange-letters",
  "word-scramble",
];

/**
 * Mengecek model mana saja yang datanya tersedia pada sebuah pertanyaan.
 * Semakin lengkap datanya, semakin banyak model yang bisa dipakai.
 */
export function getAvailableModels(data: QuestionData): RandomizableQuizModel[] {
  // Jika tipe pertanyaan eksplisit word-scramble, prioritaskan model tersebut
  if (data.type === "word-scramble") {
    return ["word-scramble"];
  }

  const arabic = data.arabicTemplate ?? data.arabicText ?? "";
  const options = data.options ?? [];
  const letters = data.bankLetters ?? data.availableLetters ?? data.options ?? [];
  const shapes: AudioMatchingOption[] = data.audioShapes ?? [];

  const hasArabic = arabic.trim().length > 0;
  const answer = data.correctAnswer;
  const isArrayAnswer = Array.isArray(answer);
  const answerText = isArrayAnswer ? answer.join(" ") : answer;
  const mcqReady = options.length >= 2 && answerText.trim().length > 0 && options.includes(answerText);
  const arabicMcqReady =
    data.arabicOptions &&
    data.arabicOptions.length >= 2 &&
    (data.arabicText ? data.arabicOptions.includes(data.arabicText) : true);

  const models: RandomizableQuizModel[] = [];

  // Susun kata (Word Scramble) jika ada correctWords
  if (data.correctWords && data.correctWords.length > 0) {
    models.push("word-scramble");
  }

  // Isi rumpang butuh jawaban per-kepingan (array) + bank huruf.
  if (hasArabic && isArrayAnswer && answer.length > 0 && letters.length > 0) {
    models.push("fill-in-the-blank");
  }
  if (hasArabic && mcqReady) {
    models.push("multiple-choice-text");
  }
  // Audio pilihan ganda: mendengar audio -> memilih teks Arab (atau opsi teks)
  if (data.audioUrl && (arabicMcqReady || mcqReady)) {
    models.push("multiple-choice-audio");
  }
  // Audio matching Kahoot: teks Arab -> memilih kartu audio (minimal 2 audio, ideal 4 audio)
  if (hasArabic && shapes.length >= 2) {
    models.push("audio-matching");
  }
  // Susun huruf: mendengar audio -> menyusun huruf Arab ke drop zone
  if (data.audioUrl && hasArabic && letters.length > 0) {
    models.push("arrange-letters");
  }

  return models;
}

/**
 * Mengambil model kuis secara acak dari model yang datanya tersedia.
 * Fallback: pilihan ganda teks bila ada opsi, selain itu isi rumpang.
 */
export function getRandomQuizModel(data: QuestionData): RandomizableQuizModel {
  const available = getAvailableModels(data);

  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  if ((data.options?.length ?? 0) > 0) {
    return "multiple-choice-text";
  }
  return "fill-in-the-blank";
}
