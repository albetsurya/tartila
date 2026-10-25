import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  XSvg,
  TrophySvg,
  SwordsSvg,
  WhatsAppSvg,
  CoinSvg,
  SparklesSvg,
  CheckSvg,
  RefreshCwSvg,
} from "@/components/ui/CustomIcons";
import { QuizEngine } from "../components/quiz-models/QuizEngine";
import {
  getQuizHubQuestions,
  QUIZ_HUB_CATEGORIES,
  QuizHubCategory,
} from "../data/quizHubData";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { playSoundEffect } from "../utils/audioPlayer";

export default function QuizHubPlayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawCategory = (searchParams.get("category") || "bahasa-arab") as QuizHubCategory;
  const validCategory = QUIZ_HUB_CATEGORIES.some((c) => c.id === rawCategory)
    ? rawCategory
    : "bahasa-arab";
  const categoryInfo = QUIZ_HUB_CATEGORIES.find((c) => c.id === validCategory)!;

  const mode = (searchParams.get("mode") || "all") as "all" | "mcq" | "scramble";
  const seedParam = searchParams.get("seed");
  const seedNumber = seedParam ? parseInt(seedParam, 10) : undefined;
  const isVersus = Boolean(seedNumber && !isNaN(seedNumber));
  const challengerName = searchParams.get("challenger") || "Teman Santri";

  // Ambil bank soal
  const questions = useMemo(() => {
    return getQuizHubQuestions(validCategory, mode, seedNumber, 5);
  }, [validCategory, mode, seedNumber]);

  const totalQuestions = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [awarded, setAwarded] = useState(false);

  const addCoins = useEconomyStore((s) => s.addCoins);
  const coins = useEconomyStore((s) => s.coins);

  const currentQuestion = questions[currentIndex] || questions[0];
  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Selesai kuis
      setIsFinished(true);
      playSoundEffect("win");
      if (!awarded) {
        setAwarded(true);
        // Hadiah koin: 10 koin per jawaban benar
        const earned = Math.max(10, (correctCount + 1) * 10);
        addCoins(earned, "Quiz Hub");
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsFinished(false);
    setAwarded(false);
  };

  const handleShareVersusResult = () => {
    const text = `Alhamdulillah! Aku berhasil menyelesaikan tantangan kuis di Tartila dengan skor ${correctCount}/${totalQuestions}!\n\nBisakah kamu mengalahkanku? Mainkan soal yang sama di sini:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#0F172A] flex flex-col font-sans selection:bg-[#FDE047]">
      {/* 1. Header Duolingo/AMNA Style */}
      <header className="sticky top-0 z-30 bg-white border-b-3 border-[#0F172A] px-4 py-3 shadow-[0_2px_0_#0F172A]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Tombol Keluar */}
          <button
            type="button"
            onClick={() => navigate("/quiz-hub")}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-[#0F172A] flex items-center justify-center cursor-pointer transition-colors"
            title="Keluar dari Kuis"
          >
            <XSvg size={18} />
          </button>

          {/* Progress Bar Duolingo Style */}
          <div className="flex-1 mx-2">
            <div className="h-3.5 w-full bg-slate-100 rounded-full border-2 border-[#0F172A] overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-full bg-[#10B981] rounded-full"
              />
            </div>
          </div>

          {/* Indikator Langkah / Koin */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEF08A] border-2 border-[#0F172A] text-xs font-black">
            <span>{currentIndex + 1}</span>
            <span className="text-slate-500">/</span>
            <span>{totalQuestions}</span>
          </div>
        </div>

        {/* Banner Mode Tantang Teman jika aktif */}
        {isVersus && (
          <div className="max-w-md mx-auto mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-900">
            <span className="inline-flex items-center gap-1">
              <SwordsSvg size={14} />
              <span>Lawan: {challengerName}</span>
            </span>
            <span className="font-mono bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300">
              Seed: #{seedNumber}
            </span>
          </div>
        )}
      </header>

      {/* 2. Main Play Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 flex flex-col justify-between">
        {!isFinished ? (
          <div className="w-full flex-1 flex flex-col justify-center">
            {/* Tag Kategori Soal */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span
                className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#0F172A]"
                style={{ backgroundColor: categoryInfo.bgBadge, color: categoryInfo.borderColor }}
              >
                {categoryInfo.title} · {categoryInfo.tag}
              </span>
            </div>

            {/* Quiz Engine */}
            <QuizEngine
              key={`${currentQuestion.id}-${currentIndex}`}
              question={currentQuestion}
              questionIndex={currentIndex}
              onAnswerSubmit={handleAnswerSubmit}
              onNext={handleNext}
            />
          </div>
        ) : (
          /* 3. Result Screen Neo-Brutalism */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-6 text-center"
          >
            {/* Icon Piala */}
            <div className="w-20 h-20 rounded-3xl bg-[#FEF08A] border-4 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] flex items-center justify-center mb-5">
              {isVersus ? <SwordsSvg size={44} /> : <TrophySvg size={44} />}
            </div>

            <h2 className="text-2xl font-black text-[#0F172A] mb-1">
              {isVersus ? "Tantangan Selesai!" : "Luar Biasa!"}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              {isVersus
                ? `Kamu telah menuntaskan soal tantangan dari ${challengerName}.`
                : "Kamu telah menyelesaikan seluruh soal pada sesi ini."}
            </p>

            {/* Card Statistik Skor */}
            <div className="w-full max-w-xs p-5 rounded-3xl bg-white border-3 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] mb-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">Jawaban Tepat</span>
                <span className="text-lg font-black text-[#10B981]">
                  {correctCount} / {totalQuestions}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">Akurasi</span>
                <span className="text-lg font-black text-[#0369A1]">
                  {Math.round((correctCount / totalQuestions) * 100)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Bonus Koin</span>
                <div className="inline-flex items-center gap-1 font-black text-amber-600 text-base">
                  <CoinSvg size={18} />
                  <span>+{Math.max(10, (correctCount + 1) * 10)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-xs space-y-3">
              {isVersus && (
                <button
                  type="button"
                  onClick={handleShareVersusResult}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] border-3 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] font-black text-sm text-white flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 active:shadow-none"
                >
                  <WhatsAppSvg size={20} />
                  <span>Kirim Hasil ke WhatsApp</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border-3 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] font-black text-sm text-[#0F172A] flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 active:shadow-none"
              >
                <RefreshCwSvg size={16} />
                <span>Mainkan Lagi</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/quiz-hub")}
                className="w-full py-3 px-4 rounded-2xl bg-[#BAE6FD] hover:bg-[#7DD3FC] border-3 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] font-black text-sm text-[#0369A1] cursor-pointer active:translate-y-0.5 active:shadow-none"
              >
                Kembali ke Pusat Kuis
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
