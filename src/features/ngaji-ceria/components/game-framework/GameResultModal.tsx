import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { StarSvg, RotateCcwSvg, ChevronRight, HomeSvg, BookOpenSvg } from "@/components/ui/CustomIcons";
import { AppModal } from "@/components/ui/AppModal";
import type { LearningSummary } from "@/features/ngaji-ceria/types/game";
import { VictoryConfetti } from "./VictoryConfetti";

export interface GameResultModalProps {
  isOpen: boolean;
  isWin: boolean;
  score: number;
  targetScore?: number;
  stars?: number; // 0 sampai 3
  level?: number;
  hasNextLevel?: boolean;
  title?: string;
  message?: string;
  loseReason?: "lives" | "time" | string | null;
  learningSummary?: LearningSummary | null;
  onRetry: () => void;
  onNextLevel?: () => void;
  onBackToHub: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  isWin,
  score,
  targetScore,
  stars,
  level,
  hasNextLevel = true,
  title,
  message,
  loseReason,
  learningSummary,
  onRetry,
  onNextLevel,
  onBackToHub,
}) => {
  const displayStars =
    stars !== undefined
      ? stars
      : isWin
        ? level !== undefined
          ? Math.min(Math.max(1, level), 3)
          : 3
        : 0;

  const displayTitle =
    title ||
    (isWin
      ? "Alhamdulillah! Berhasil!"
      : loseReason === "lives"
        ? "Kesempatan Habis! Jangan Menyerah!"
        : "Waktu Habis! Jangan Menyerah!");

  const displayMessage =
    message ||
    (isWin
      ? level !== undefined
        ? `Hebat! Kamu berhasil menuntaskan Level ${level} dengan baik.`
        : "Hebat! Kamu berhasil menyelesaikan tantangan ini."
      : loseReason === "lives"
        ? "Nyawa kamu telah habis. Ayo lebih teliti memperhatikan target hurufnya!"
        : "Waktu bermain telah selesai. Ayo latih terus kecepatan dan ketepatanmu!");

  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <VictoryConfetti active={isOpen && isWin} />
      <AppModal isOpen={isOpen} onClose={onBackToHub} title={displayTitle} variant="warm">
        {/* Header Badge Status */}
        <div className="mb-3 text-center">
          <span
            className={`inline-block rounded-full border-2 border-[#134E4A] px-4 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_#134E4A] ${
              isWin
                ? "bg-[#DCFCE7] text-[#15803D]"
                : "bg-[#FEE2E2] text-[#B91C1C]"
            }`}
          >
            {isWin ? "Level Selesai" : "Coba Lagi"}
          </span>
          <p className="mt-2 text-xs font-medium text-[#134E4A]/70 leading-relaxed px-2">
            {displayMessage}
          </p>
        </div>

        {/* Bintang Penilaian (1 - 3 Bintang) */}
        <div className="my-5 flex items-center justify-center gap-3">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= displayStars;
            return (
              <motion.div
                key={starIndex}
                initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, rotate: -30 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2 }
                    : {
                        delay: 0.15 * starIndex,
                        type: "spring",
                        stiffness: 300,
                      }
                }
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] ${
                  isEarned
                    ? "bg-[#FEF08A] text-[#D97706]"
                    : "bg-gray-100 text-gray-300"
                }`}
              >
                <StarSvg
                  size={32}
                  className={isEarned ? "fill-[#D97706]" : "fill-transparent"}
                />
              </motion.div>
            );
          })}
        </div>

      {/* Papan Skor Ringkasan */}
      <div className="mb-4 rounded-2xl border-2 border-[#134E4A] bg-white p-3 shadow-[3px_3px_0px_#134E4A]">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#134E4A]/70">
            Skor Akhir
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-black text-[#134E4A]">
              {score}
            </span>
            {targetScore !== undefined && (
              <span className="text-xs font-bold text-[#134E4A]/50">
                / {targetScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Panel Ringkasan Belajar (Bab 9.3 & Bab 17) */}
      {learningSummary && (
        <div className="mb-6 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] p-3.5 shadow-[3px_3px_0px_#134E4A]">
          <div className="flex items-center justify-between gap-2 border-b-2 border-[#134E4A]/15 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <BookOpenSvg size={16} className="text-[#134E4A]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#134E4A]">
                Ringkasan Belajar
              </span>
            </div>
            <span className="rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-2.5 py-0.5 text-xs font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]">
              Akurasi: {learningSummary.accuracy !== null && learningSummary.accuracy !== undefined ? `${learningSummary.accuracy}%` : "-"}
            </span>
          </div>

          <p className="text-xs font-bold leading-relaxed text-[#134E4A]">
            {isWin
              ? learningSummary.appreciation || "Kamu sudah sangat baik mengenali target materi!"
              : learningSummary.recommendation || "Ayo perhatikan kembali target materi dan coba lagi!"}
          </p>

          {/* Indikator Per-Harakat (Khusus Harakat Slasher) */}
          {learningSummary.accuracyByHarakat && Object.keys(learningSummary.accuracyByHarakat).length > 0 && (
            <div className="mt-2.5 grid grid-cols-3 gap-1.5 pt-2 border-t border-[#134E4A]/15">
              {[
                { key: "fathah", label: "Fathah", symbol: "\u064E" },
                { key: "kasrah", label: "Kasrah", symbol: "\u0650" },
                { key: "dhammah", label: "Dhammah", symbol: "\u064F" },
              ].map(({ key, label, symbol }) => {
                const stat = learningSummary.accuracyByHarakat?.[key] || { correct: 0, wrong: 0 };
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center rounded-xl border-2 border-[#134E4A] bg-white p-1.5 shadow-[2px_2px_0px_#134E4A]"
                  >
                    <span className="font-arabic text-lg font-bold text-[#134E4A] leading-tight">
                      {symbol}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-tight text-[#134E4A]/80">
                      {label}
                    </span>
                    <div className="mt-1 flex flex-col items-center gap-0.5 text-[9px] font-bold">
                      <span className="text-[#15803D]">{stat.correct} Benar</span>
                      {stat.wrong > 0 && (
                        <span className="text-[#B91C1C]">{stat.wrong} Salah</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Indikator Huruf yang Sering Salah (Khusus Hijaiyah Harvest) */}
          {learningSummary.troubleLetters && learningSummary.troubleLetters.length > 0 && (
            <div className="mt-2.5 flex items-center justify-between gap-2 rounded-xl border-2 border-[#134E4A] bg-white p-2 shadow-[2px_2px_0px_#134E4A]">
              <span className="text-[10px] font-black uppercase text-[#134E4A]/70">
                Huruf Perlu Dilatih:
              </span>
              <div className="flex items-center gap-1.5">
                {learningSummary.troubleLetters.slice(0, 4).map((char, idx) => (
                  <span
                    key={idx}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEE2E2] font-arabic text-sm font-black text-[#B91C1C] shadow-[1px_1px_0px_#134E4A]"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Indikator Kesalahan Urutan (Khusus Hijaiyah Harvest) */}
          {learningSummary.sequenceErrors !== undefined && learningSummary.sequenceErrors > 0 && (
            <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold text-[#134E4A]/70 px-1">
              <span>Kesalahan Urutan:</span>
              <span className="font-black text-[#B91C1C]">
                {learningSummary.sequenceErrors} kali
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="flex flex-col gap-2.5">
        {/* Tombol Level Berikutnya (Hanya jika menang dan ada next level) */}
        {isWin && hasNextLevel && onNextLevel && (
          <button
            type="button"
            onClick={onNextLevel}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] py-3.5 text-base font-black text-white shadow-[4px_4px_0px_#134E4A] hover:bg-[#0F766E] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <span>Lanjut Level Berikutnya</span>
            <ChevronRight size={20} />
          </button>
        )}

        {/* Tombol Selesai Tamat (Jika menang di level terakhir) */}
        {isWin && !hasNextLevel && (
          <button
            type="button"
            onClick={onBackToHub}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] py-3.5 text-base font-black text-white shadow-[4px_4px_0px_#134E4A] hover:bg-[#0F766E] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <span>Alhamdulillah! Tamat (Kembali ke Menu)</span>
            <ChevronRight size={20} />
          </button>
        )}

        {/* Tombol Ulangi / Main Lagi */}
        <button
          type="button"
          onClick={onRetry}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] py-3 text-sm font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] hover:bg-[#FDE047] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <RotateCcwSvg size={18} />
          <span>{isWin ? "Main Lagi Level Ini" : "Coba Lagi"}</span>
        </button>

        {/* Tombol Kembali ke Hub Game */}
        <button
          type="button"
          onClick={onBackToHub}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#134E4A] bg-white py-2.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#F0FDF4] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <HomeSvg size={16} />
          <span>Kembali ke Menu Game</span>
        </button>
      </div>
    </AppModal>
    </>
  );
};
