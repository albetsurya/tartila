import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ArrangeLettersQuestion, QuizModelBaseProps } from "./types";
import { getAudioUrl } from "../../utils/audioUrl";
import { playVoiceFeedback } from "../../utils/voiceFeedback";
import { AnswerFeedbackSheet } from "../AnswerFeedbackSheet";

function CloseIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ResetIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export interface ModelArrangeLettersProps extends QuizModelBaseProps {
  question: ArrangeLettersQuestion;
}

/** Soundwave Equalizer Icon */
function SoundwaveBars({ isPlaying }: { isPlaying?: boolean }) {
  return (
    <svg
      width="44"
      height="44"
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

interface BankItem {
  uid: string;
  letter: string;
}

export function ModelArrangeLetters({
  question,
  onAnswerSubmit,
  onNext,
  onPlayAudio,
  isAudioPlaying,
}: ModelArrangeLettersProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [placed, setPlaced] = useState<BankItem[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  // Inisialisasi Bank Huruf dengan UID unik agar huruf kembar bisa dilacak secara independen
  const [bank, setBank] = useState<BankItem[]>(() =>
    question.bankLetters.map((letter, index) => ({
      uid: `${question.id}-${index}-${letter}-${Math.random().toString(36).slice(2, 7)}`,
      letter,
    })),
  );

  // Sinkronisasi ulang saat pertanyaan atau bankHuruf diperbarui
  useEffect(() => {
    setStatus("idle");
    setPlaced([]);
    setBank(
      question.bankLetters.map((letter, index) => ({
        uid: `${question.id}-${index}-${letter}-${Math.random().toString(36).slice(2, 7)}`,
        letter,
      })),
    );
  }, [question.id, question.bankLetters]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlay = () => {
    if (onPlayAudio) {
      onPlayAudio();
      return;
    }
    if (!question.audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(getAudioUrl(question.audioUrl) ?? question.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
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

  // Ketuk huruf di bank -> pindah ke drop zone
  const handlePickFromBank = (item: BankItem) => {
    if (status !== "idle") return;
    setBank((prev) => prev.filter((b) => b.uid !== item.uid));
    setPlaced((prev) => [...prev, item]);
  };

  // Hapus 1 huruf dari drop zone -> kembali ke bank
  const handleRemoveFromPlaced = (item: BankItem) => {
    if (status !== "idle") return;
    setPlaced((prev) => prev.filter((p) => p.uid !== item.uid));
    setBank((prev) => [...prev, item]);
  };

  // Reset semua huruf di drop zone
  const handleResetAll = () => {
    if (status !== "idle" || placed.length === 0) return;
    setBank((prev) => [...prev, ...placed]);
    setPlaced([]);
  };

  const handleCheck = () => {
    if (placed.length === 0 || status !== "idle") return;
    const placedText = placed.map((p) => p.letter.trim()).join("");
    const correctText = question.correctLetters.map((l) => l.trim()).join("");
    const isCorrect = placedText === correctText;

    setStatus(isCorrect ? "correct" : "wrong");
    onAnswerSubmit?.(isCorrect);

    audioRef.current?.pause();
    setIsPlaying(false);

    if (isCorrect) {
      playVoiceFeedback("correct");
    } else {
      playVoiceFeedback("wrong");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    setBank(
      question.bankLetters.map((letter, index) => ({
        uid: `${question.id}-${index}-${letter}-${Math.random().toString(36).slice(2, 7)}`,
        letter,
      })),
    );
    setPlaced([]);
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 flex flex-col bg-transparent">
      {/* 1. Tombol Audio Equalizer Utama */}
      <div className="flex flex-col items-center mb-6">
        <motion.button
          type="button"
          onClick={handlePlay}
          animate={{ scale: playing ? [1, 1.08, 1] : 1 }}
          transition={playing ? { repeat: Infinity, duration: 1, ease: "easeInOut" } : { duration: 0.2 }}
          className="relative w-28 h-28 rounded-full flex items-center justify-center p-2.5 bg-[#DCFCE7] border-[3px] border-[#4D7C0F]/40 shadow-[4px_4px_0px_#4D7C0F]/30 active:scale-95 transition-transform cursor-pointer"
          aria-label="Dengarkan Suara"
        >
          {playing && (
            <span className="absolute inset-0 rounded-full bg-[#4D7C0F]/20 animate-ping" />
          )}
          <div className="w-full h-full rounded-full flex items-center justify-center bg-[#4D7C0F] shadow-inner">
            <SoundwaveBars isPlaying={playing} />
          </div>
        </motion.button>
        <p className="mt-2 text-xs font-black text-[#134E4A] tracking-wide">
          Dengarkan Suara & Susun Huruf
        </p>
      </div>

      {/* 2. Drop Zone Horizontal Bergaris Putus-putus */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-black uppercase text-[#134E4A]/60 tracking-wider">
            Kotak Susunan ({placed.length}/{question.correctLetters.length})
          </span>
          {placed.length > 0 && status === "idle" && (
            <button
              type="button"
              onClick={handleResetAll}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <ResetIcon className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        <div
          className={`min-h-[96px] rounded-2xl border-[3px] border-dashed p-3 flex items-center justify-center gap-2.5 flex-wrap transition-colors ${
            status === "correct"
              ? "border-emerald-500 bg-emerald-50/80"
              : status === "wrong"
                ? "border-rose-500 bg-rose-50/80"
                : "border-[#0D9488]/50 bg-[#F0FDF4]/70"
          }`}
          dir="rtl"
        >
          {placed.length === 0 ? (
            <p className="text-xs font-bold text-[#0D9488]/70 select-none text-center">
              Ketuk huruf di Bank Huruf untuk menyusun
            </p>
          ) : (
            <AnimatePresence mode="popLayout">
              {placed.map((item) => (
                <motion.div
                  key={item.uid}
                  layout
                  initial={{ scale: 0.6, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative group"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border-[3px] border-[#0D9488] shadow-[3px_3px_0px_#0D9488] flex items-center justify-center font-arabic text-3xl font-bold text-[#134E4A] select-none">
                    {item.letter}
                  </div>
                  {/* Tombol X kecil di pojok untuk menghapus huruf */}
                  {status === "idle" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFromPlaced(item)}
                      aria-label={`Hapus huruf ${item.letter}`}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow hover:bg-rose-600 active:scale-90 transition-transform cursor-pointer"
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* 3. Bank Huruf (Grid Huruf Arab Acak / Pengecoh) */}
      <div className="mb-6">
        <p className="text-[11px] font-black uppercase text-[#134E4A]/60 tracking-wider mb-2 px-1">
          Bank Huruf
        </p>
        <div
          className="flex items-center justify-center gap-2.5 flex-wrap min-h-[72px] p-2 rounded-2xl bg-slate-50 border-2 border-slate-200"
          dir="rtl"
        >
          {bank.length === 0 ? (
            <p className="text-xs font-bold text-slate-400 select-none py-3">
              Semua huruf telah dipindahkan
            </p>
          ) : (
            <AnimatePresence mode="popLayout">
              {bank.map((item) => (
                <motion.button
                  key={item.uid}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  type="button"
                  onClick={() => handlePickFromBank(item)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border-[3px] border-[#0D9488] shadow-[3px_3px_0px_#0D9488] flex items-center justify-center font-arabic text-3xl font-bold text-[#134E4A] hover:bg-emerald-50 active:translate-y-[2px] active:shadow-none cursor-pointer select-none"
                >
                  {item.letter}
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* 4. Tombol Periksa Jawaban */}
      <div className="w-full">
        <button
          type="button"
          disabled={placed.length === 0 || status !== "idle"}
          onClick={handleCheck}
          className={`w-full py-4 px-6 rounded-2xl font-display font-black text-base border-[3px] transition-all flex items-center justify-center ${
            placed.length === 0 || status !== "idle"
              ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-[#0D9488] hover:bg-[#0D9488]/90 text-white border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] cursor-pointer"
          }`}
        >
          Periksa Jawaban
        </button>
      </div>

      {/* Bottom Sheet Feedback Jawaban */}
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

export default ModelArrangeLetters;
