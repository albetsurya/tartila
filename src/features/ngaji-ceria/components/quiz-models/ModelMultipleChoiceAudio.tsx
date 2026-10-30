import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { answerFeedbackAnimation } from "./feedbackMotion";
import type { MultipleChoiceAudioQuestion, QuizModelBaseProps } from "./types";
import { getAudioUrl } from "../../utils/audioUrl";
import { AnswerFeedbackSheet } from "../AnswerFeedbackSheet";

export interface ModelMultipleChoiceAudioProps extends QuizModelBaseProps {
  question: MultipleChoiceAudioQuestion;
}

/** Ikon garis-garis Soundwave / Equalizer berwarna putih */
function SoundwaveBars({ isPlaying }: { isPlaying?: boolean }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <motion.rect
        x="6"
        y="16"
        width="4.5"
        height="16"
        rx="2.25"
        fill="currentColor"
        animate={isPlaying ? { height: [16, 26, 12, 16], y: [16, 11, 18, 16] } : { height: 16, y: 16 }}
        transition={isPlaying ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" } : { duration: 0.2 }}
      />
      <motion.rect
        x="14"
        y="10"
        width="4.5"
        height="28"
        rx="2.25"
        fill="currentColor"
        animate={isPlaying ? { height: [28, 14, 34, 28], y: [10, 17, 7, 10] } : { height: 28, y: 10 }}
        transition={isPlaying ? { repeat: Infinity, duration: 0.7, delay: 0.1, ease: "easeInOut" } : { duration: 0.2 }}
      />
      <motion.rect
        x="22"
        y="6"
        width="4.5"
        height="36"
        rx="2.25"
        fill="currentColor"
        animate={isPlaying ? { height: [36, 18, 38, 36], y: [6, 15, 5, 6] } : { height: 36, y: 6 }}
        transition={isPlaying ? { repeat: Infinity, duration: 0.6, delay: 0.2, ease: "easeInOut" } : { duration: 0.2 }}
      />
      <motion.rect
        x="30"
        y="12"
        width="4.5"
        height="24"
        rx="2.25"
        fill="currentColor"
        animate={isPlaying ? { height: [24, 32, 14, 24], y: [12, 8, 17, 12] } : { height: 24, y: 12 }}
        transition={isPlaying ? { repeat: Infinity, duration: 0.75, delay: 0.15, ease: "easeInOut" } : { duration: 0.2 }}
      />
      <motion.rect
        x="38"
        y="18"
        width="4.5"
        height="12"
        rx="2.25"
        fill="currentColor"
        animate={isPlaying ? { height: [12, 22, 10, 12], y: [18, 13, 19, 18] } : { height: 12, y: 18 }}
        transition={isPlaying ? { repeat: Infinity, duration: 0.85, delay: 0.05, ease: "easeInOut" } : { duration: 0.2 }}
      />
    </svg>
  );
}

export function ModelMultipleChoiceAudio({
  question,
  onAnswerSubmit,
  onNext,
  onPlayAudio,
  isAudioPlaying,
  isRetryable,
  correctAnswer,
  explanation,
}: ModelMultipleChoiceAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (onPlayAudio) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [question.id, question.audioUrl, onPlayAudio]);

  const handlePlay = () => {
    if (onPlayAudio) {
      onPlayAudio();
      return;
    }
    if (!question.audioUrl) return;

    if (audioRef.current) {
      const sameUrl =
        question.audioUrl &&
        audioRef.current.src ===
          new URL(question.audioUrl, window.location.href).href;
      if (!sameUrl) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
    if (!audioRef.current) {
      const audio = new Audio(getAudioUrl(question.audioUrl) ?? question.audioUrl);
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      audio.onloadstart = () => setIsAudioLoading(true);
      audio.oncanplay = () => setIsAudioLoading(false);
      audio.onwaiting = () => setIsAudioLoading(true);
      audio.onplaying = () => setIsAudioLoading(false);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsAudioLoading(false);
        setIsPlaying(false);
      };
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    audio.currentTime = 0;
    void audio.play();
    setIsPlaying(true);
  };

  const playing = onPlayAudio ? Boolean(isAudioPlaying) : isPlaying;

  const handlePick = (option: string) => {
    if (status !== "idle") return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (selected === null || status !== "idle") return;
    const isCorrect = selected === question.correctAnswer;
    setStatus(isCorrect ? "correct" : "wrong");
    onAnswerSubmit?.(isCorrect);

    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleRetry = () => {
    setSelected(null);
    setStatus("idle");
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col bg-transparent">
      {/* Tombol Audio Utama (Lingkaran Luar Mint + Lingkaran Dalam Olive + Equalizer Bars) */}
      <div className="flex flex-col items-center mb-6">
        <motion.button
          type="button"
          onClick={handlePlay}
          animate={{ scale: playing ? [1, 1.08, 1] : 1 }}
          transition={playing ? { repeat: Infinity, duration: 1, ease: "easeInOut" } : { duration: 0.2 }}
          className="relative w-32 h-32 rounded-full flex items-center justify-center p-3 bg-[#DCFCE7] border-[3px] border-[#4D7C0F]/40 shadow-[4px_4px_0px_#4D7C0F]/30 active:scale-95 transition-transform cursor-pointer"
          aria-label="Putar Suara"
        >
          {playing && (
            <span className="absolute inset-0 rounded-full bg-[#4D7C0F]/20 animate-ping" />
          )}
          <div className="w-full h-full rounded-full flex items-center justify-center bg-[#4D7C0F] shadow-inner">
            {isAudioLoading && !playing ? (
              <span
                aria-label="Memuat audio"
                className="block h-8 w-8 animate-spin rounded-full border-[3px] border-white/30 border-t-white"
              />
            ) : (
              <SoundwaveBars isPlaying={playing} />
            )}
          </div>
        </motion.button>
        <p className="mt-3 text-xs font-black text-[#134E4A] tracking-wide">
          {isAudioLoading && !playing ? "Memuat Audio…" : "Sentuh untuk Putar Suara"}
        </p>
      </div>

      {/* Grid Opsi Pilihan Jawaban (Teks Arab, bebas diklik kapan saja tanpa lock) */}
      <div className="flex flex-col gap-3">
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
              className={`min-h-[68px] rounded-2xl border-[3px] p-4 text-3xl font-arabic font-bold text-center leading-relaxed break-words transition-all shadow-[3px_3px_0px_var(--border-color,#0284C7)] active:translate-y-[2px] active:shadow-none cursor-pointer ${
                showCorrect
                  ? "border-[#0D9488] bg-[#F0FDF4] text-[#0D9488]"
                  : showWrong
                    ? "border-[#FF6B6B] bg-[#FFF0F0] text-[#FF6B6B]"
                    : isSelected
                      ? "border-[var(--border-color,#0284C7)] bg-sky-100/70 text-[var(--text-main,#0369A1)] ring-2 ring-[var(--border-color,#0284C7)]"
                      : "border-[var(--border-color,#0284C7)] bg-white text-[var(--text-main,#0369A1)] hover:bg-sky-50"
              }`}
              dir="rtl"
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
        isRetryable={isRetryable}
        correctAnswer={correctAnswer}
        explanation={explanation}
      />
    </div>
  );
}

export default ModelMultipleChoiceAudio;
