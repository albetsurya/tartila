import React from "react";
import { motion } from "framer-motion";
import { StarSvg, RotateCcwSvg, ChevronRight, HomeSvg } from "@/components/ui/CustomIcons";
import { AppModal } from "@/components/ui/AppModal";

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
  onRetry: () => void;
  onNextLevel?: () => void;
  onBackToHub: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  isOpen,
  isWin,
  score,
  targetScore,
  stars = isWin ? 3 : 0,
  level,
  hasNextLevel = true,
  title,
  message,
  onRetry,
  onNextLevel,
  onBackToHub,
}) => {
  const displayTitle =
    title ||
    (isWin
      ? "Alhamdulillah! Berhasil!"
      : "Waktu Habis! Jangan Menyerah!");

  const displayMessage =
    message ||
    (isWin
      ? level !== undefined
        ? `Hebat! Kamu berhasil menuntaskan Level ${level} dengan baik.`
        : "Hebat! Kamu berhasil menyelesaikan tantangan ini."
      : "Ayo latih terus fokus dan ketepatanmu, coba lagi sekarang!");

  return (
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
          const isEarned = starIndex <= stars;
          return (
            <motion.div
              key={starIndex}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.15 * starIndex,
                type: "spring",
                stiffness: 300,
              }}
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
      <div className="mb-6 rounded-2xl border-2 border-[#134E4A] bg-white p-3 shadow-[3px_3px_0px_#134E4A]">
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
  );
};
