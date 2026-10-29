import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WordScrambleQuestion, QuizModelBaseProps } from "./types";
import { AnswerFeedbackSheet } from "../AnswerFeedbackSheet";
import { SparklesSvg, RotateCcwSvg as ResetIcon } from "@/components/ui/CustomIcons";

interface BankWordItem {
  uid: string;
  word: string;
}

export interface ModelWordScrambleProps extends QuizModelBaseProps {
  question: WordScrambleQuestion;
}

export function ModelWordScramble({
  question,
  onAnswerSubmit,
  onNext,
}: ModelWordScrambleProps) {
  const [placed, setPlaced] = useState<BankWordItem[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  // Inisialisasi Bank Kata dengan UID unik
  const [bank, setBank] = useState<BankWordItem[]>(() => {
    const words = question.bankWords && question.bankWords.length > 0
      ? question.bankWords
      : [...question.correctWords].sort(() => Math.random() - 0.5);

    return words.map((word, index) => ({
      uid: `${question.id}-${index}-${word}-${Math.random().toString(36).slice(2, 7)}`,
      word,
    }));
  });

  // Sinkronisasi saat pertanyaan berganti
  useEffect(() => {
    setStatus("idle");
    setPlaced([]);
    const words = question.bankWords && question.bankWords.length > 0
      ? question.bankWords
      : [...question.correctWords].sort(() => Math.random() - 0.5);

    setBank(
      words.map((word, index) => ({
        uid: `${question.id}-${index}-${word}-${Math.random().toString(36).slice(2, 7)}`,
        word,
      })),
    );
  }, [question.id, question.bankWords, question.correctWords]);

  // Ketuk kata di bank -> pindah ke drop zone
  const handlePickFromBank = (item: BankWordItem) => {
    if (status !== "idle") return;
    setBank((prev) => prev.filter((b) => b.uid !== item.uid));
    setPlaced((prev) => [...prev, item]);
  };

  // Ketuk kata di drop zone -> kembalikan ke bank
  const handleRemoveFromPlaced = (item: BankWordItem) => {
    if (status !== "idle") return;
    setPlaced((prev) => prev.filter((p) => p.uid !== item.uid));
    setBank((prev) => [...prev, item]);
  };

  // Reset semua kata kembali ke bank
  const handleResetAll = () => {
    if (status !== "idle" || placed.length === 0) return;
    setBank((prev) => [...prev, ...placed]);
    setPlaced([]);
  };

  // Cek apakah semua slot kata sudah terisi
  const targetCount = question.correctWords.length;
  const isReadyToCheck = placed.length >= targetCount && placed.length > 0;

  const handleCheck = () => {
    if (!isReadyToCheck || status !== "idle") return;

    const placedSentence = placed.map((p) => p.word.trim()).join(" ");
    const correctSentence = question.correctWords.map((w) => w.trim()).join(" ");

    // Bandingkan kalimat utuh
    const isCorrect = placedSentence === correctSentence;
    setStatus(isCorrect ? "correct" : "wrong");
    onAnswerSubmit?.(isCorrect);
  };

  const handleRetry = () => {
    setStatus("idle");
    const words = question.bankWords && question.bankWords.length > 0
      ? question.bankWords
      : [...question.correctWords].sort(() => Math.random() - 0.5);

    setBank(
      words.map((word, index) => ({
        uid: `${question.id}-${index}-${word}-${Math.random().toString(36).slice(2, 7)}`,
        word,
      })),
    );
    setPlaced([]);
  };

  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);
  const correctTextDisplay = question.correctWords.join(" ");

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col bg-transparent">
      {/* 1. Header Instruksi */}
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border-2 border-[#0F172A] text-xs font-black text-[#0369A1] shadow-[2px_2px_0px_#0F172A]">
          <SparklesSvg size={14} />
          <span>{question.instruction || "Susun kalimat lengkap"}</span>
        </div>

        {placed.length > 0 && status === "idle" && (
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border-2 border-[#0F172A] text-xs font-bold text-slate-700 shadow-[2px_2px_0px_#0F172A] hover:bg-slate-100 active:translate-y-0.5"
            title="Reset susunan"
          >
            <ResetIcon size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 2. Prompt Kalimat / Terjemahan (Duolingo Style Bubble) */}
      {question.prompt && (
        <div className="mb-4 p-4 rounded-2xl bg-[#FEF3C7] border-3 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] relative">
          <div className="text-xs font-black uppercase tracking-wider text-[#B45309] mb-1">
            Arti / Petunjuk:
          </div>
          <div className="text-base sm:text-lg font-bold text-[#78350F]">
            {question.prompt}
          </div>
        </div>
      )}

      {/* 3. Ilustrasi Opsional (Jika Ada) */}
      {question.illustration && (
        <div className="flex justify-center items-center my-2">
          {question.illustration}
        </div>
      )}

      {/* 4. Drop Zone (Area Penyusunan Kata) */}
      <div className="mt-2 mb-6">
        <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
          Susunan Kalimat ({placed.length}/{targetCount}):
        </div>
        <div
          dir={isArabic(question.correctWords[0] || "") ? "rtl" : "ltr"}
          className={`min-h-[80px] w-full p-3.5 rounded-2xl border-3 border-dashed transition-all flex flex-wrap items-center justify-center gap-2.5 ${
            status === "correct"
              ? "bg-[#ECFDF5] border-[#10B981] shadow-[3px_3px_0px_#065F46]"
              : status === "wrong"
              ? "bg-[#FEF2F2] border-[#EF4444] shadow-[3px_3px_0px_#991B1B]"
              : placed.length > 0
              ? "bg-white border-[#0F172A] shadow-[4px_4px_0px_#0F172A]"
              : "bg-slate-50/80 border-slate-300"
          }`}
        >
          {placed.length === 0 ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-400 text-center select-none py-2">
              Ketuk kata di bank bawah untuk mulai menyusun kalimat
            </p>
          ) : (
            placed.map((item, index) => {
              const arabicWord = isArabic(item.word);
              return (
                <motion.button
                  key={item.uid}
                  layoutId={item.uid}
                  type="button"
                  onClick={() => handleRemoveFromPlaced(item)}
                  disabled={status !== "idle"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3.5 py-2 rounded-xl border-2 border-[#0F172A] font-bold shadow-[2px_2px_0px_#0F172A] transition-colors cursor-pointer select-none ${
                    status === "correct"
                      ? "bg-[#34D399] text-white"
                      : status === "wrong"
                      ? "bg-[#F87171] text-white"
                      : "bg-[#FDE047] text-slate-900 hover:bg-[#FACC15]"
                  } ${arabicWord ? "font-amiri text-2xl leading-relaxed" : "text-base font-black"}`}
                >
                  <span className="inline-block">{item.word}</span>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Bank Kata (Kata Tersedia) */}
      <div className="mb-6">
        <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
          Pilihan Kata:
        </div>
        <div
          dir={isArabic(question.correctWords[0] || "") ? "rtl" : "ltr"}
          className="min-h-[64px] flex flex-wrap items-center justify-center gap-2.5 p-3 rounded-2xl bg-slate-100 border-2 border-[#0F172A]/20"
        >
          <AnimatePresence>
            {bank.length === 0 ? (
              <span className="text-xs font-medium text-slate-400 py-1">
                Semua kata sudah ditempatkan di atas
              </span>
            ) : (
              bank.map((item) => {
                const arabicWord = isArabic(item.word);
                return (
                  <motion.button
                    key={item.uid}
                    layoutId={item.uid}
                    type="button"
                    onClick={() => handlePickFromBank(item)}
                    disabled={status !== "idle"}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95, y: 1 }}
                    className={`px-4 py-2.5 rounded-xl border-3 border-[#0F172A] bg-white text-slate-900 font-bold shadow-[3px_3px_0px_#0F172A] hover:bg-amber-50 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all cursor-pointer select-none ${
                      arabicWord ? "font-amiri text-2xl leading-relaxed" : "text-base font-black"
                    }`}
                  >
                    <span>{item.word}</span>
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 6. Tombol Periksa Jawaban (Duolingo Style Footer Button) */}
      <div className="mt-auto pt-2">
        <motion.button
          type="button"
          onClick={handleCheck}
          disabled={!isReadyToCheck || status !== "idle"}
          whileTap={isReadyToCheck && status === "idle" ? { scale: 0.98 } : {}}
          className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider border-3 transition-all ${
            isReadyToCheck && status === "idle"
              ? "bg-[#10B981] hover:bg-[#059669] text-white border-[#0F172A] shadow-[4px_4px_0px_#0F172A] cursor-pointer"
              : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60 shadow-none"
          }`}
        >
          Periksa Jawaban
        </motion.button>
      </div>

      {/* 7. Answer Feedback Sheet Neo-Brutalism */}
      <AnswerFeedbackSheet
        isOpen={status !== "idle"}
        isCorrect={status === "correct"}
        mascotMessage={
          status === "correct"
            ? "Muntaz! Susunan kalimatmu tepat sekali."
            : `Jawaban tepat: ${correctTextDisplay}`
        }
        onNext={() => {
          setStatus("idle");
          onNext?.();
        }}
        onRetry={handleRetry}
      />
    </div>
  );
}

export default ModelWordScramble;