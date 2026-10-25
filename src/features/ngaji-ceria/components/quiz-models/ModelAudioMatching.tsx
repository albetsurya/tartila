import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { AudioMatchingOption, AudioMatchingQuestion, QuizModelBaseProps } from "./types";
import { getAudioUrl } from "../../utils/audioUrl";
import { playVoiceFeedback } from "../../utils/voiceFeedback";
import { AnswerFeedbackSheet } from "../AnswerFeedbackSheet";
import { answerFeedbackAnimation } from "./feedbackMotion";

export interface ModelAudioMatchingProps extends QuizModelBaseProps {
  question: AudioMatchingQuestion;
}

const KAHOOT_PALETTE = [
  { bg: "bg-[#E21B3C]", hover: "hover:bg-[#C91433]", activeBorder: "border-[#990F24]", name: "Merah" },
  { bg: "bg-[#1368CE]", hover: "hover:bg-[#0F53A4]", activeBorder: "border-[#0C3F7E]", name: "Biru" },
  { bg: "bg-[#D89E00]", hover: "hover:bg-[#B08100]", activeBorder: "border-[#8A6500]", name: "Kuning" },
  { bg: "bg-[#26890C]", hover: "hover:bg-[#1E6D09]", activeBorder: "border-[#165207]", name: "Hijau" },
];

/** Ikon Speaker + Soundwave Putih Besar (>= 32px) dengan animasi bar saat memutar */
function KahootAudioIcon({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* Ikon Speaker */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-white drop-shadow-sm"
      >
        <path d="M11 5L6 9H2V15H6L11 19V5Z" />
        <path d="M15.54 8.46C16.48 9.4 17 10.67 17 12C17 13.33 16.48 14.6 15.54 15.54L14.13 14.13C14.69 13.56 15 12.8 15 12C15 11.2 14.69 10.44 14.13 9.87L15.54 8.46Z" />
        <path d="M19.07 4.93C20.94 6.81 22 9.33 22 12C22 14.67 20.94 17.19 19.07 19.07L17.66 17.66C19.16 16.15 20 14.13 20 12C20 9.87 19.16 7.85 17.66 6.34L19.07 4.93Z" />
      </svg>
      {/* Animasi Bouncing Wave Bars */}
      <div className="flex items-end gap-1 h-7">
        <motion.span
          className="w-1.5 bg-white rounded-full"
          animate={isPlaying ? { height: [8, 22, 10, 8] } : { height: 8 }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        />
        <motion.span
          className="w-1.5 bg-white rounded-full"
          animate={isPlaying ? { height: [14, 28, 8, 14] } : { height: 14 }}
          transition={{ repeat: Infinity, duration: 0.5, delay: 0.1, ease: "easeInOut" }}
        />
        <motion.span
          className="w-1.5 bg-white rounded-full"
          animate={isPlaying ? { height: [20, 10, 26, 20] } : { height: 20 }}
          transition={{ repeat: Infinity, duration: 0.7, delay: 0.2, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export function ModelAudioMatching({
  question,
  onAnswerSubmit,
  onNext,
}: ModelAudioMatchingProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlayCard = (option: AudioMatchingOption) => {
    if (status !== "idle") return;
    setSelectedId(option.id);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(getAudioUrl(option.audioUrl) ?? option.audioUrl);
    audioRef.current = audio;
    audio.currentTime = 0;
    setPlayingId(option.id);

    audio.onended = () => {
      setPlayingId(null);
    };
    audio.onerror = () => {
      setPlayingId(null);
    };
    void audio.play().catch(() => setPlayingId(null));
  };

  const handleCheck = () => {
    if (selectedId === null || status !== "idle") return;
    const isCorrect =
      selectedId === question.correctAnswer ||
      question.options.find((o) => o.id === selectedId)?.audioUrl === question.correctAnswer;

    setStatus(isCorrect ? "correct" : "wrong");
    onAnswerSubmit?.(isCorrect);

    audioRef.current?.pause();
    setPlayingId(null);

    if (isCorrect) {
      playVoiceFeedback("correct");
    } else {
      playVoiceFeedback("wrong");
    }
  };

  const handleRetry = () => {
    setSelectedId(null);
    setStatus("idle");
    setPlayingId(null);
  };

  const optionCount = question.options.length;
  // Dynamic grid: 2x2 for 4 items, 1 col or 2 cols for fewer
  const gridLayout =
    optionCount <= 2
      ? "grid-cols-2"
      : optionCount === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-2";

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 flex flex-col bg-transparent">
      {/* Kartu Soal Teks Arab */}
      <div className="rounded-3xl bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#0284C7)] shadow-[4px_4px_0px_var(--border-color,#0284C7)] py-8 px-4 text-center mb-6">
        <p className="text-xs font-black uppercase text-[#134E4A]/60 tracking-wider mb-2">
          Pilih Audio yang Tepat
        </p>
        <p
          className="text-4xl sm:text-5xl font-arabic font-bold text-[var(--text-main,#0369A1)] leading-loose break-words"
          dir="rtl"
        >
          {question.arabicText}
        </p>
      </div>

      {/* Grid Kartu Audio Berwarna Khas Kahoot (Merah, Biru, Kuning, Hijau) */}
      <div className={`grid ${gridLayout} gap-3.5`}>
        {question.options.map((option, index) => {
          const palette = KAHOOT_PALETTE[index % KAHOOT_PALETTE.length];
          const isSelected = selectedId === option.id;
          const isPlayingThis = playingId === option.id;
          const isAnswer =
            option.id === question.correctAnswer || option.audioUrl === question.correctAnswer;
          const showCorrect = status !== "idle" && isAnswer;
          const showWrong = status === "wrong" && isSelected && !isAnswer;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handlePlayCard(option)}
              aria-label={`Opsi Audio ${index + 1}`}
              animate={answerFeedbackAnimation(
                showCorrect ? "correct" : showWrong ? "wrong" : "none",
                reducedMotion ?? false,
              )}
              className={`relative min-h-[96px] sm:min-h-[110px] rounded-2xl flex flex-col items-center justify-center p-4 text-white transition-all border-[3px] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] active:translate-y-[2px] active:shadow-none cursor-pointer ${
                palette.bg
              } ${palette.hover} ${
                showCorrect
                  ? "!border-white ring-4 ring-emerald-400 ring-offset-2"
                  : showWrong
                    ? "!border-white ring-4 ring-rose-500 ring-offset-2 opacity-80"
                    : isSelected
                      ? "border-white ring-4 ring-white ring-offset-2 scale-[1.02]"
                      : "border-black/20"
              }`}
            >
              {/* Ripple ping effect when playing audio */}
              {isPlayingThis && (
                <span className="absolute inset-0 rounded-2xl bg-white/20 animate-ping pointer-events-none" />
              )}

              <KahootAudioIcon isPlaying={isPlayingThis} />

              <span className="mt-2 text-xs font-black tracking-wide text-white/95 uppercase drop-shadow">
                {isPlayingThis ? "Memutar Suara…" : isSelected ? "Terpilih" : "Ketuk Dengar"}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Tombol Periksa Jawaban */}
      <div className="w-full mt-6">
        <button
          type="button"
          disabled={selectedId === null || status !== "idle"}
          onClick={handleCheck}
          className={`w-full py-4 px-6 rounded-2xl font-display font-black text-base border-[3px] transition-all flex items-center justify-center ${
            selectedId === null || status !== "idle"
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

export default ModelAudioMatching;
