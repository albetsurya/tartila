import { useEffect, useMemo, useRef } from "react";
import { ModelAudioMatching } from "./ModelAudioMatching";
import { ModelArrangeLetters } from "./ModelArrangeLetters";
import { ModelFillInTheBlank } from "./ModelFillInTheBlank";
import { ModelMaterialCard } from "./ModelMaterialCard";
import { ModelMultipleChoiceAudio } from "./ModelMultipleChoiceAudio";
import { ModelMultipleChoiceText } from "./ModelMultipleChoiceText";
import { ModelWordScramble } from "./ModelWordScramble";
import { getRandomQuizModel, generateAvailableLetters } from "./quizModelRandomizer";
import type { QuizModelBaseProps, QuestionData } from "./types";

export interface QuizEngineProps extends QuizModelBaseProps {
  question: QuestionData;
  /** Indeks pertanyaan; dipakai agar model diacak ulang setiap soal baru. */
  questionIndex?: number;
}

export function QuizEngine({
  question,
  questionIndex,
  onAnswerSubmit,
  onNext,
  onPlayAudio,
  isAudioPlaying,
}: QuizEngineProps) {
  // Model diacak sekali per pertanyaan (stabil antar re-render).
  // `material` tidak diacak karena merupakan langkah belajar, bukan soal.
  // Sertakan status audio agar jika audio selesai di-resolve, model audio dapat ikut dipilih.
  // Membungkus onPlayAudio ke ref agar tidak menjadi dependensi yang berubah tiap render
  const onPlayAudioRef = useRef(onPlayAudio);
  onPlayAudioRef.current = onPlayAudio;

  const hasAudio = Boolean(question.audioUrl);
  const modelKey = `${questionIndex ?? -1}:${question.id}:${question.type}:${hasAudio ? "audio" : "noaudio"}`;
  const assignedModel = useMemo(
    () => (question.type === "material" ? "material" : getRandomQuizModel(question)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modelKey],
  );

  const arabic = question.arabicTemplate ?? question.arabicText ?? "";
  const options = question.options ?? [];
  const shapes = question.audioShapes ?? [];
  const correctArray = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [question.correctAnswer];
  const correctText = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.join(" ")
    : question.correctAnswer;

  const arrangeCorrect =
    question.correctLetters ??
    (arabic.trim().length > 0 ? arabic.split(/\s+/).filter(Boolean) : correctArray);
  const arrangeBank =
    question.bankLetters && question.bankLetters.length >= arrangeCorrect.length
      ? question.bankLetters
      : generateAvailableLetters(arrangeCorrect, []);

  const scrambleCorrect =
    question.correctWords ??
    (arabic.trim().length > 0 ? arabic.split(/\s+/).filter(Boolean) : correctArray);
  const scrambleBank =
    question.bankWords && question.bankWords.length >= scrambleCorrect.length
      ? question.bankWords
      : [...scrambleCorrect].sort(() => Math.random() - 0.5);

  const fillAvailable =
    question.availableLetters && question.availableLetters.length >= correctArray.length
      ? question.availableLetters
      : generateAvailableLetters(correctArray, options);

  const shared = { onAnswerSubmit, onNext, onPlayAudio, isAudioPlaying };

  useEffect(() => {
    // Auto-play: SEMUA model SEKALI audio-matching.
    // Model audio-matching menunggu klik user, sisanya auto-play saat dimuat.
    // HANYA bergantung pada question.id — assignedModel didapat dari useMemo
    // yang sudah bergantung pada question, jadi akan update otomatis saat question berubah.
    if (assignedModel !== "audio-matching" && assignedModel !== "material" && question.audioUrl && onPlayAudioRef.current) {
      onPlayAudioRef.current();
    }
  }, [question.id]);

  return (
    <div
      key={modelKey}
      className="w-full bg-transparent selection:bg-[var(--border-color,#0284C7)]/20"
    >
      {(() => {
        switch (assignedModel) {
          case "fill-in-the-blank":
            return (
              <ModelFillInTheBlank
                key={question.id}
                question={{
                  id: question.id,
                  type: "fill-in-the-blank",
                  arabicTemplate: arabic,
                  availableLetters: fillAvailable,
                  correctAnswer: correctArray,
                  audioUrl: question.audioUrl,
                }}
                {...shared}
              />
            );
          case "multiple-choice-text":
            return (
              <ModelMultipleChoiceText
                key={question.id}
                question={{
                  id: question.id,
                  type: "multiple-choice-text",
                  arabicText: arabic,
                  options,
                  correctAnswer: correctText,
                  audioUrl: question.audioUrl,
                  prompt: question.prompt,
                  illustration: question.illustration,
                }}
                {...shared}
              />
            );
          case "multiple-choice-audio":
            return (
              <ModelMultipleChoiceAudio
                key={question.id}
                question={{
                  id: question.id,
                  type: "multiple-choice-audio",
                  audioUrl: question.audioUrl ?? "",
                  options: question.arabicOptions ?? options,
                  correctAnswer: question.arabicText ?? correctText,
                }}
                {...shared}
              />
            );
          case "audio-matching":
            return (
              <ModelAudioMatching
                key={question.id}
                question={{
                  id: question.id,
                  type: "audio-matching",
                  arabicText: arabic,
                  options: shapes,
                  correctAnswer: question.correctAudioId || question.audioUrl || "",
                }}
                {...shared}
              />
            );
          case "arrange-letters":
            return (
              <ModelArrangeLetters
                key={question.id}
                question={{
                  id: question.id,
                  type: "arrange-letters",
                  audioUrl: question.audioUrl ?? "",
                  correctLetters: arrangeCorrect,
                  bankLetters: arrangeBank,
                }}
                {...shared}
              />
            );
          case "word-scramble":
            return (
              <ModelWordScramble
                key={question.id}
                question={{
                  id: question.id,
                  type: "word-scramble",
                  instruction: question.instruction,
                  prompt: question.prompt,
                  illustration: question.illustration,
                  audioUrl: question.audioUrl,
                  correctWords: scrambleCorrect,
                  bankWords: scrambleBank,
                }}
                {...shared}
              />
            );
          case "material":
            return (
              <ModelMaterialCard
                key={question.id}
                material={{
                  id: question.id,
                  type: "material",
                  arabicText: arabic,
                  transliteration: question.transliteration ?? "",
                  audioUrl: question.audioUrl,
                  instruction: question.instruction ?? "",
                }}
                {...shared}
              />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default QuizEngine;
