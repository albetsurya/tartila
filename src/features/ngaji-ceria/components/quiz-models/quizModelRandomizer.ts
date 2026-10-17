import type { AudioMatchingOption, QuestionData, QuizModelType } from "./types";

/** Model yang boleh diacak. `material` bukan soal, jadi tidak diacak. */
export type RandomizableQuizModel = Exclude<QuizModelType, "material">;

export const RANDOMIZABLE_QUIZ_MODELS: RandomizableQuizModel[] = [
  "fill-in-the-blank",
  "multiple-choice-text",
  "multiple-choice-audio",
  "audio-matching",
];

/**
 * Mengecek model mana saja yang datanya tersedia pada sebuah pertanyaan.
 * Semakin lengkap datanya, semakin banyak model yang bisa dipakai.
 */
export function getAvailableModels(data: QuestionData): RandomizableQuizModel[] {
  const arabic = data.arabicTemplate ?? data.arabicText ?? "";
  const options = data.options ?? [];
  const letters = data.availableLetters ?? data.options ?? [];
  const shapes: AudioMatchingOption[] = data.audioShapes ?? [];

  const hasArabic = arabic.trim().length > 0;
  const answer = data.correctAnswer;
  const isArrayAnswer = Array.isArray(answer);
  const answerText = isArrayAnswer ? answer.join(" ") : answer;
  const mcqReady = options.length >= 2 && answerText.trim().length > 0 && options.includes(answerText);

  const models: RandomizableQuizModel[] = [];

  // Isi rumpang butuh jawaban per-kepingan (array) + bank huruf.
  if (hasArabic && isArrayAnswer && answer.length > 0 && letters.length > 0) {
    models.push("fill-in-the-blank");
  }
  if (hasArabic && mcqReady) {
    models.push("multiple-choice-text");
  }
  if (data.audioUrl && mcqReady) {
    models.push("multiple-choice-audio");
  }
  if (shapes.length >= 2) {
    models.push("audio-matching");
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
