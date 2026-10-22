import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  RefreshCw,
  Volume2,
  X,
} from "../../../../components/ui/CustomIcons";
import {
  StickerButton,
  StickerCard,
  TilaMascot,
} from "../../../../components/ui";
import { answerFeedbackAnimation } from "./feedbackMotion";
import type { FillInTheBlankQuestion, QuizModelBaseProps } from "./types";
import { playVoiceFeedback } from "../../utils/voiceFeedback";

export interface ModelFillInTheBlankProps extends QuizModelBaseProps {
  question: FillInTheBlankQuestion;
}

export function ModelFillInTheBlank({
  question,
  onAnswerSubmit,
  onNext,
  onPlayAudio,
  isAudioPlaying,
}: ModelFillInTheBlankProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const reducedMotion = useReducedMotion();

  const selectedLetters = selected.map(
    (index) => question.availableLetters[index],
  );

  const usedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const index of selected) {
      const letter = question.availableLetters[index];
      counts[letter] = (counts[letter] ?? 0) + 1;
    }
    return counts;
  }, [selected, question.availableLetters]);

  const isLetterUsed = (letter: string, index: number) => {
    if (selected.includes(index) || status !== "idle") return true;
    const total = question.availableLetters.filter(
      (item) => item === letter,
    ).length;
    return (usedCounts[letter] ?? 0) >= total;
  };

  const handlePick = (index: number) => {
    if (status !== "idle") return;
    setSelected((prev) => [...prev, index]);
  };

  const handleRemove = (slot: number) => {
    if (status !== "idle") return;
    setSelected((prev) => prev.filter((_, index) => index !== slot));
  };

  const handleClear = () => {
    if (status !== "idle") return;
    setSelected([]);
  };

  const handleCheck = () => {
    if (status !== "idle") return;
    const attempt = selectedLetters.join("\u0001");
    const answer = question.correctAnswer.join("\u0001");
    const isCorrect = attempt === answer;
    setStatus(isCorrect ? "correct" : "wrong");
    onAnswerSubmit?.(isCorrect);

    audioRef.current?.pause();
    if (isCorrect) {
      playVoiceFeedback("correct");
    } else {
      playVoiceFeedback("wrong");
    }
  };

  const handleRetry = () => {
    setSelected([]);
    setStatus("idle");
  };

  const handlePlay = () => {
    if (onPlayAudio) {
      onPlayAudio();
      return;
    }
    if (!question.audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(question.audioUrl);
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    void audio.play();
  };

  const playing = Boolean(isAudioPlaying);

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 flex flex-col bg-[#F0FDF4]">
      <StickerCard className="relative p-8 text-center mb-6">
        <StickerButton
          variant="secondary"
          size="sm"
          onClick={handlePlay}
          className={`absolute top-3 right-3 !w-10 !h-10 !p-0 !rounded-full ${playing ? "!bg-[#0D9488] !text-white animate-pulse" : ""}`}
        >
          <Volume2 size={18} />
        </StickerButton>
        <p
          className="text-4xl sm:text-5xl font-arabic text-[#134E4A] leading-loose break-words"
          dir="rtl"
        >
          {question.arabicTemplate}
        </p>
      </StickerCard>

      <motion.div
        animate={answerFeedbackAnimation(
          status === "idle" ? "none" : status,
          reducedMotion ?? false,
        )}
        className={`w-full min-h-[100px] border-[3px] border-dashed rounded-2xl p-4 bg-white flex items-center justify-center gap-2.5 flex-wrap ${
          status === "correct"
            ? "border-[#0D9488]"
            : status === "wrong"
              ? "border-[#FF6B6B]"
              : "border-[#0D9488]"
        }`}
      >
        {selectedLetters.length === 0 ? (
          <span className="text-sm font-bold text-[#134E4A]/50 text-center">
            Pilih kepingan huruf di bawah
          </span>
        ) : (
          selectedLetters.map((letter, slot) => (
            <StickerButton
              key={`${letter}-${slot}`}
              variant="primary"
              onClick={() => handleRemove(slot)}
              className="!min-h-0 !h-12 !px-4 !py-0 !text-2xl !font-arabic"
            >
              {letter}
            </StickerButton>
          ))
        )}
      </motion.div>

      <div className="w-full mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#134E4A]/70">
            Pilihan Huruf
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-[#FF6B6B] flex items-center gap-1 text-xs font-black tracking-wide"
          >
            <RefreshCw size={14} /> Hapus
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {question.availableLetters.map((letter, index) => {
            const used = isLetterUsed(letter, index);
            return (
              <button
                key={`${letter}-${index}`}
                type="button"
                disabled={used}
                onClick={() => handlePick(index)}
                className={`h-16 rounded-xl border-[3px] font-arabic text-2xl font-bold transition-all ${
                  used
                    ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {status !== "idle" && (
        <div className="w-full mt-6">
          <StickerCard
            accent={status === "correct" ? "deep-teal" : "coral"}
            className={`flex items-center gap-4 p-4 ${
              status === "correct" ? "bg-[#F0FDF4]" : "bg-[#FFF0F0]"
            }`}
          >
            <div className="shrink-0 -mt-8 -ml-2">
              <TilaMascot
                size={72}
                mood={status === "correct" ? "excited" : "sad"}
                animation="bounce"
              />
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-black ${status === "correct" ? "text-[#0D9488]" : "text-[#FF6B6B]"}`}
              >
                {status === "correct"
                  ? "Masya Allah, tepat!"
                  : "Hampir tepat, coba lagi ya."}
              </p>
            </div>
          </StickerCard>
        </div>
      )}

      <div className="w-full mt-6">
        {status === "idle" ? (
          <StickerButton
            variant="primary"
            fullWidth
            disabled={selected.length === 0}
            onClick={handleCheck}
          >
            Periksa Jawaban
          </StickerButton>
        ) : (
          <StickerButton
            variant={status === "correct" ? "primary" : "danger"}
            fullWidth
            onClick={status === "correct" ? onNext : handleRetry}
          >
            {status === "correct" ? "Lanjut →" : "Coba Lagi"}
          </StickerButton>
        )}
      </div>
    </div>
  );
}

export default ModelFillInTheBlank;
