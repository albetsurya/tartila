import { useMemo } from "react";
import { ModelAudioMatching } from "./ModelAudioMatching";
import { ModelFillInTheBlank } from "./ModelFillInTheBlank";
import { ModelMaterialCard } from "./ModelMaterialCard";
import { ModelMultipleChoiceAudio } from "./ModelMultipleChoiceAudio";
import { ModelMultipleChoiceText } from "./ModelMultipleChoiceText";
import { getRandomQuizModel } from "./quizModelRandomizer";
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
  // Key sengaja memakai identitas soal, bukan objek `question` yang selalu baru.
  const modelKey = `${questionIndex ?? -1}:${question.id}:${question.type}`;
  const assignedModel = useMemo(
    () => (question.type === "material" ? "material" : getRandomQuizModel(question)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modelKey],
  );

  const arabic = question.arabicTemplate ?? question.arabicText ?? "";
  const options = question.options ?? [];
  const letters = question.availableLetters ?? question.options ?? [];
  const shapes = question.audioShapes ?? [];
  const correctArray = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [question.correctAnswer];
  const correctText = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.join(" ")
    : question.correctAnswer;

  const shared = { onAnswerSubmit, onNext, onPlayAudio, isAudioPlaying };

  return (
    <div className="w-full bg-[#F0FDF4] selection:bg-[#0D9488]/20">
      {(() => {
        switch (assignedModel) {
          case "fill-in-the-blank":
            return (
              <ModelFillInTheBlank
                question={{
                  id: question.id,
                  type: "fill-in-the-blank",
                  arabicTemplate: arabic,
                  availableLetters: letters,
                  correctAnswer: correctArray,
                  audioUrl: question.audioUrl,
                }}
                {...shared}
              />
            );
          case "multiple-choice-text":
            return (
              <ModelMultipleChoiceText
                question={{
                  id: question.id,
                  type: "multiple-choice-text",
                  arabicText: arabic,
                  options,
                  correctAnswer: correctText,
                  audioUrl: question.audioUrl,
                }}
                {...shared}
              />
            );
          case "multiple-choice-audio":
            return (
              <ModelMultipleChoiceAudio
                question={{
                  id: question.id,
                  type: "multiple-choice-audio",
                  audioUrl: question.audioUrl ?? "",
                  options,
                  correctAnswer: correctText,
                }}
                {...shared}
              />
            );
          case "audio-matching":
            return (
              <ModelAudioMatching
                question={{
                  id: question.id,
                  type: "audio-matching",
                  arabicText: arabic,
                  options: shapes,
                }}
                {...shared}
              />
            );
          case "material":
            return (
              <ModelMaterialCard
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
