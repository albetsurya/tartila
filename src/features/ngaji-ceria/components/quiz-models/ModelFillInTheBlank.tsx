import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  RefreshCw,
  Volume2,
} from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { answerFeedbackAnimation } from "./feedbackMotion";
import type { FillInTheBlankQuestion, QuizModelBaseProps } from "./types";
import { getAudioUrl } from "../../utils/audioUrl";
import { AnswerFeedbackSheet } from "../AnswerFeedbackSheet";

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

  useEffect(() => {
    setSelected([]);
    setStatus("idle");
  }, [question.id, question.availableLetters]);

  const selectedLetters = selected.map(
    (index) => question.availableLetters[index],
  );

  const isArabicLetters = question.availableLetters.some((l) => /[\u0600-\u06FF]/.test(l));
  const letterFontClass = isArabicLetters ? "font-arabic text-2xl font-bold" : "font-display text-xl font-black";

  // Tombol dianggap digunakan jika indeks spesifiknya sedang terpilih di slot susunan
  const isLetterUsed = (_letter: string, index: number) => {
    return selected.includes(index) || status !== "idle";
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
      audioRef.current = new Audio(getAudioUrl(question.audioUrl) ?? question.audioUrl);
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    void audio.play();
  };

  const playing = Boolean(isAudioPlaying);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col bg-transparent">
      {/* Kartu Teks Arab */}
      <div className="relative p-8 text-center mb-6 rounded-3xl bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#0284C7)] shadow-[4px_4px_0px_var(--border-color,#0284C7)]">
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Putar Audio"
          className={`absolute top-3 right-3 w-10 h-10 rounded-full border-2 border-[var(--border-color,#0284C7)] flex items-center justify-center transition-all ${
            playing
              ? "bg-[var(--border-color,#0284C7)] text-white"
              : "bg-white text-[var(--text-main,#0369A1)] hover:bg-sky-50 shadow-[2px_2px_0px_var(--border-color,#0284C7)]"
          }`}
        >
          {playing ? (
            <EqualizerIcon isPlaying={true} size={18} barClassName="bg-white" />
          ) : (
            <Volume2 size={18} />
          )}
        </button>
        <p
          className="text-5xl font-arabic text-[var(--text-main,#0369A1)] leading-loose break-words"
          dir="rtl"
        >
          {question.arabicTemplate}
        </p>
      </div>

      {/* Area Slot Rumpang Terpilih */}
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
              : "border-[var(--border-color,#0284C7)]"
        }`}
      >
        {selectedLetters.length === 0 ? (
          <span className="text-sm font-bold text-[var(--text-main,#0369A1)]/50 text-center">
            Pilih kepingan huruf di bawah
          </span>
        ) : (
          selectedLetters.map((letter, slot) => (
            <button
              key={`${letter}-${slot}`}
              type="button"
              onClick={() => handleRemove(slot)}
              className={`min-h-0 h-12 px-4 py-0 ${letterFontClass} rounded-xl bg-white border-2 border-[var(--border-color,#0284C7)] text-[var(--text-main,#0369A1)] shadow-[2px_2px_0px_var(--border-color,#0284C7)] active:translate-y-[1px]`}
            >
              {letter}
            </button>
          ))
        )}
      </motion.div>

      {/* Bagian Keyboard Pilihan Huruf */}
      <div className="w-full mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main,#0369A1)]">
            Pilihan Huruf
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-[#FF6B6B] flex items-center gap-1 text-xs font-black tracking-wide hover:underline cursor-pointer"
          >
            <RefreshCw size={14} /> Hapus
          </button>
        </div>

        {/* Keyboard Huruf: Putih Bersih dengan Border Tebal Teal */}
        <div className="grid grid-cols-4 gap-2.5">
          {question.availableLetters.map((letter, index) => {
            const used = isLetterUsed(letter, index);
            return (
              <button
                key={`${letter}-${index}`}
                type="button"
                disabled={used}
                onClick={() => handlePick(index)}
                className={`h-16 rounded-xl border-[3px] ${letterFontClass} transition-all ${
                  used
                    ? "border-sky-200 bg-sky-50/60 text-sky-300 cursor-not-allowed opacity-40 shadow-none"
                    : "border-[var(--border-color,#0284C7)] bg-white text-[var(--text-main,#0369A1)] shadow-[2px_2px_0px_var(--border-color,#0284C7)] active:translate-y-[2px] active:shadow-none hover:bg-sky-50"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tombol Periksa Jawaban */}
      <div className="w-full mt-6">
        <button
          type="button"
          disabled={selected.length === 0 || status !== "idle"}
          onClick={handleCheck}
          className={`w-full py-4 px-6 rounded-2xl font-display font-black text-base border-[3px] transition-all flex items-center justify-center ${
            selected.length === 0 || status !== "idle"
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
        onReset={handleClear}
      />
    </div>
  );
}

export default ModelFillInTheBlank;
