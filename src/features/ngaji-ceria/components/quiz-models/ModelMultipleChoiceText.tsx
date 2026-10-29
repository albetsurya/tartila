import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Volume2 } from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { answerFeedbackAnimation } from "./feedbackMotion";
import type { MultipleChoiceTextQuestion, QuizModelBaseProps } from "./types";
import { getAudioUrl } from "../../utils/audioUrl";
import { AnswerFeedbackSheet } from "../AnswerFeedbackSheet";

export interface ModelMultipleChoiceTextProps extends QuizModelBaseProps {
  question: MultipleChoiceTextQuestion;
}

export function ModelMultipleChoiceText({
  question,
  onAnswerSubmit,
  onNext,
  onPlayAudio,
  isAudioPlaying,
}: ModelMultipleChoiceTextProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [localPlaying, setLocalPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [question.id]);

  const handlePlayAudio = () => {
    if (onPlayAudio) {
      onPlayAudio();
      return;
    }
    if (!question.audioUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(getAudioUrl(question.audioUrl) ?? question.audioUrl);
    audioRef.current = audio;
    setLocalPlaying(true);
    audio.onended = () => setLocalPlaying(false);
    audio.onerror = () => setLocalPlaying(false);
    void audio.play().catch(() => setLocalPlaying(false));
  };

  const isPlaying = Boolean(isAudioPlaying || localPlaying);

  const handlePick = (option: string) => {
    if (status !== "idle") return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (selected === null || status !== "idle") return;
    const isCorrect = selected === question.correctAnswer;
    setStatus(isCorrect ? "correct" : "wrong");
    onAnswerSubmit?.(isCorrect);
  };

  const handleRetry = () => {
    setSelected(null);
    setStatus("idle");
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col bg-transparent">
      {/* Prompt Petunjuk (Jika Ada) */}
      {question.prompt && (
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] text-center">
          <p className="text-sm sm:text-base font-bold text-amber-900">
            {question.prompt}
          </p>
        </div>
      )}

      {/* Kartu Teks Arab / Ilustrasi SVG */}
      <div className="relative p-6 sm:p-8 text-center mb-6 rounded-3xl bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#0284C7)] shadow-[4px_4px_0px_var(--border-color,#0284C7)] flex flex-col items-center justify-center">
        {question.audioUrl && (
          <button
            type="button"
            onClick={handlePlayAudio}
            aria-label="Putar Audio"
            className={`absolute top-3 right-3 w-10 h-10 rounded-full border-2 border-[var(--border-color,#0284C7)] flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-[var(--border-color,#0284C7)] text-white"
                : "bg-white text-[var(--text-main,#0369A1)] hover:bg-sky-50 shadow-[2px_2px_0px_var(--border-color,#0284C7)]"
            }`}
          >
            {isPlaying ? (
              <EqualizerIcon isPlaying={true} size={18} barClassName="bg-white" />
            ) : (
              <Volume2 size={18} />
            )}
          </button>
        )}

        {question.illustration && (
          <div className="flex justify-center items-center my-2">
            {question.illustration}
          </div>
        )}

        {question.arabicText && (
          <p
            className="text-5xl font-arabic text-[var(--text-main,#0369A1)] leading-loose break-words"
            dir="rtl"
          >
            {question.arabicText}
          </p>
        )}
      </div>

      {/* Grid Opsi Pilihan Ganda */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = option === question.correctAnswer;
          const showCorrect = status !== "idle" && isAnswer;
          const showWrong = status === "wrong" && isSelected && !isAnswer;

          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => handlePick(option)}
              animate={answerFeedbackAnimation(
                showCorrect ? "correct" : showWrong ? "wrong" : "none",
                reducedMotion ?? false,
              )}
              className={`min-h-[68px] rounded-2xl border-[3px] p-4 text-2xl sm:text-3xl font-arabic font-bold text-center flex items-center justify-center leading-snug break-words transition-all shadow-[3px_3px_0px_var(--border-color,#0284C7)] active:translate-y-[2px] active:shadow-none cursor-pointer ${
                showCorrect
                  ? "border-[#0D9488] bg-[#F0FDF4] text-[#0D9488]"
                  : showWrong
                    ? "border-[#FF6B6B] bg-[#FFF0F0] text-[#FF6B6B]"
                    : isSelected
                      ? "border-[var(--border-color,#0284C7)] bg-sky-100/70 text-[var(--text-main,#0369A1)] ring-2 ring-[var(--border-color,#0284C7)]"
                      : "border-[var(--border-color,#0284C7)] bg-white text-[var(--text-main,#0369A1)] hover:bg-sky-50"
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Tombol Periksa Jawaban */}
      <div className="w-full mt-6">
        <button
          type="button"
          disabled={selected === null || status !== "idle"}
          onClick={handleCheck}
          className={`w-full py-4 px-6 rounded-2xl font-display font-black text-base border-[3px] transition-all flex items-center justify-center ${
            selected === null || status !== "idle"
              ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-[var(--border-color,#0284C7)] hover:bg-[#0284C7]/90 text-white border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] cursor-pointer"
          }`}
        >
          Periksa Jawaban
        </button>
      </div>

      {/* Bottom Sheet Notifikasi Jawaban Benar / Salah */}
      <AnswerFeedbackSheet
        isOpen={status !== "idle"}
        isCorrect={status === "correct"}
        onNext={onNext}
        onRetry={handleRetry}
        onReset={handleRetry}
      />
    </div>
  );
}

export default ModelMultipleChoiceText;
