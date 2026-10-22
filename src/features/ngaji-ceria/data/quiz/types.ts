/**
 * Universal Question Model for Tartila Arena & Exam Center
 * Supports: Multiple Choice, Audio Guess, Fill Blank
 */

export type QuestionType = "multiple_choice" | "audio_guess" | "fill_blank";
export type QuestionCategory = "tilawati" | "tajwid" | "nabi";

export interface QuestionOption {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
  arabic?: string;
  isCorrect?: boolean; // Seed & server-side only; stripped when sent to player
}

export interface UniversalQuestion {
  id: string;
  type: QuestionType;
  category: QuestionCategory;
  title: string;
  prompt: string;
  arabicPrompt?: string;
  audioUrl?: string; // URL audio pelafalan untuk tipe "audio_guess"
  fillBlankTemplate?: string; // Template teks berlubang untuk tipe "fill_blank"
  options: QuestionOption[];
  correctAnswer: string; // ID opsi benar (misal "A") atau string jawaban tepat
  explanation?: string;
  points?: number; // Skor dasar (default 1000)
  timeLimitSeconds?: number; // Batas waktu detik (default 20s)
}

/** Format soal yang aman dikirim ke pemain (Anti-Cheat: correct_answer dihapus) */
export interface ClientQuestionPayload {
  id: string;
  questionIndex: number;
  totalQuestions: number;
  type: QuestionType;
  category: QuestionCategory;
  title: string;
  prompt: string;
  arabicPrompt?: string;
  audioUrl?: string;
  fillBlankTemplate?: string;
  options: Array<{ id: string; text: string; arabic?: string }>;
  timeLimitSeconds: number;
}
