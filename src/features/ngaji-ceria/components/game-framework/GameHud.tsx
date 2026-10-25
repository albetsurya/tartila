import React from "react";
import { motion } from "framer-motion";
import { PauseSvg, HeartSvg, StarSvg, TrophySvg } from "@/components/ui/CustomIcons";

export interface GameHudProps {
  gameTitle?: string;
  level?: number;
  timeLeft: number; // Dalam satuan detik
  score: number;
  targetScore?: number;
  lives?: number;
  maxLives?: number;
  combo?: number;
  onPause?: () => void;
  className?: string;
}

export const GameHud: React.FC<GameHudProps> = ({
  gameTitle,
  level,
  timeLeft,
  score,
  targetScore,
  lives,
  maxLives = 3,
  combo,
  onPause,
  className = "",
}) => {
  const isUrgent = timeLeft < 10;

  // Format detik menjadi MM:SS jika lebih dari 60 detik, atau SS jika pendek
  const formatTime = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return `${secs}s`;
  };

  return (
    <div
      className={`relative z-40 flex w-full items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 ${className}`}
    >
      {/* Sisi Kiri: Pause Button & Badge Level */}
      <div className="flex items-center gap-2">
        {onPause && (
          <button
            type="button"
            onClick={onPause}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-[2.5px] border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            aria-label="Pause Permainan"
          >
            <PauseSvg size={18} />
          </button>
        )}

        {level !== undefined && (
          <div className="flex items-center gap-1 rounded-xl border-[2.5px] border-[#134E4A] bg-[#DCFCE7] px-2.5 py-1 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <TrophySvg size={14} className="text-[#0D9488]" />
            <span>Lv. {level}</span>
          </div>
        )}

        {gameTitle && !level && (
          <span className="hidden font-display text-sm font-black text-[#134E4A] sm:inline-block">
            {gameTitle}
          </span>
        )}
      </div>

      {/* Bagian Tengah: TIMER (Menyala merah jika < 10 detik) */}
      <motion.div
        animate={isUrgent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={isUrgent ? { repeat: Infinity, duration: 0.6 } : {}}
        className={`flex items-center gap-1.5 rounded-2xl border-[3px] px-3.5 py-1 text-center font-display shadow-[3px_3px_0px_#134E4A] transition-colors ${
          isUrgent
            ? "border-[#134E4A] bg-[#EF4444] text-white animate-pulse"
            : "border-[#134E4A] bg-white text-[#134E4A]"
        }`}
      >
        <span className="text-xs font-black uppercase tracking-wider opacity-80">
          Waktu:
        </span>
        <span className="text-base font-black tracking-tight sm:text-lg">
          {formatTime(timeLeft)}
        </span>
      </motion.div>

      {/* Sisi Kanan: Skor, Target & Nyawa */}
      <div className="flex items-center gap-2">
        {/* Nyawa (Hearts) jika disediakan */}
        {lives !== undefined && (
          <div className="hidden sm:flex items-center gap-0.5 rounded-xl border-2 border-[#134E4A] bg-white px-2 py-1 shadow-[2px_2px_0px_#134E4A]">
            {Array.from({ length: maxLives }).map((_, i) => (
              <HeartSvg
                key={i}
                size={14}
                className={
                  i < lives
                    ? "text-[#FF6B6B] fill-[#FF6B6B]"
                    : "text-gray-300 fill-gray-300"
                }
              />
            ))}
          </div>
        )}

        {/* Badge Skor */}
        <div className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] px-3 py-1 shadow-[2px_2px_0px_#134E4A]">
          <StarSvg size={14} className="text-[#D97706] fill-[#D97706]" />
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-black uppercase text-[#78350F]">
              Skor
            </span>
            <span className="font-display text-sm font-black text-[#134E4A] sm:text-base">
              {score}
            </span>
            {targetScore !== undefined && (
              <span className="text-[10px] font-bold text-[#134E4A]/60">
                /{targetScore}
              </span>
            )}
          </div>
          {combo && combo > 1 && (
            <span className="ml-1 rounded-md border border-[#134E4A] bg-[#FF6B6B] px-1 text-[9px] font-black text-white">
              x{combo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
