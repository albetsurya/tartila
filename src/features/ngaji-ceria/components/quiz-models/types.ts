import type { ReactNode } from "react";

export type QuizModelType =
  | "fill-in-the-blank"
  | "multiple-choice-text"
  | "multiple-choice-audio"
  | "audio-matching"
  | "material";

export type ShapeVariant = "circle" | "square" | "triangle" | "diamond";

export interface FillInTheBlankQuestion {
  id: string;
  type: "fill-in-the-blank";
  /** Teks Arab dengan bagian rumpang, mis. "بَ ... بَ". */
  arabicTemplate: string;
  /** Kepingan huruf/kata yang bisa dipilih anak. */
  availableLetters: string[];
  /** Urutan jawaban yang benar. */
  correctAnswer: string[];
  audioUrl?: string;
}

export interface MultipleChoiceTextQuestion {
  id: string;
  type: "multiple-choice-text";
  arabicText: string;
  options: string[];
  correctAnswer: string;
  audioUrl?: string;
}

export interface MultipleChoiceAudioQuestion {
  id: string;
  type: "multiple-choice-audio";
  audioUrl: string;
  options: string[];
  correctAnswer: string;
}

export interface AudioMatchingOption {
  id: string;
  audioUrl: string;
  shape: ShapeVariant;
}

export interface AudioMatchingQuestion {
  id: string;
  type: "audio-matching";
  arabicText: string;
  options: AudioMatchingOption[];
}

export interface MaterialItem {
  id: string;
  type: "material";
  arabicText: string;
  transliteration: string;
  audioUrl?: string;
  instruction: string;
}

export type QuizModelQuestion =
  | FillInTheBlankQuestion
  | MultipleChoiceTextQuestion
  | MultipleChoiceAudioQuestion
  | AudioMatchingQuestion
  | MaterialItem;

/**
 * Bentuk data pertanyaan yang fleksibel (dari database/timeline).
 * `type` adalah tipe ASLI; field spesifik model bersifat opsional karena
 * QuizEngine memilih model secara acak berdasarkan data yang tersedia.
 */
export interface QuestionData {
  id: string;
  /** Tipe asli dari database. */
  type: QuizModelType;
  arabicTemplate?: string;
  arabicText?: string;
  options?: string[];
  availableLetters?: string[];
  audioShapes?: AudioMatchingOption[];
  correctAnswer: string | string[];
  audioUrl?: string;
  transliteration?: string;
  instruction?: string;
  isListenOnly?: boolean;
}

export interface QuizModelBaseProps {
  onAnswerSubmit?: (isCorrect: boolean) => void;
  onNext?: () => void;
  /** When provided, the model delegates playback to the host engine. */
  onPlayAudio?: () => void;
  isAudioPlaying?: boolean;
}

export type QuizModelRenderable = ReactNode;
