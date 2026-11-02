import React from "react";
import { motion } from "framer-motion";
import { HeartSvg, StarSvg, TrophySvg } from "@/components/ui/CustomIcons";

export interface GameHudProps {
  gameTitle?: string;
  level?: number;
  timeLeft?: number; // Opsional: Hanya dipakai jika game punya timer
  score: number;
  targetScore?: number;
  lives?: number;
  maxLives?: number;
  combo?: number;
  className?: string;
  onHelpClick?: () => void;
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
  className = "",
  onHelpClick,
}) => {
  const isUrgent = timeLeft !== undefined && timeLeft < 10;

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
      className={`relative z-40 flex w-full items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 pointer-events-none ${className}`}
    >
      {/* Sisi Kiri: Badge Level & Bantuan */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {level !== undefined && (
          <div className="flex items-center gap-1 rounded-xl border-[2.5px] border-[#134E4A] bg-[#DCFCE7] px-2.5 py-1 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <TrophySvg size={14} className="text-[#0D9488]" />
            <span>Lv. {level}</span>
          </div>
        )}

        {onHelpClick && (
          <button
            type="button"
            onClick={onHelpClick}
            aria-label="Petunjuk dan Aturan Permainan"
            className="flex h-7 w-7 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] font-black text-xs text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-[#FDE047]"
          >
            ?
          </button>
        )}

        {gameTitle && !level && (
          <span className="hidden font-display text-sm font-black text-[#134E4A] sm:inline-block">
            {gameTitle}
          </span>
        )}
      </div>

      {/* Bagian Tengah: TIMER (Hanya muncul jika timeLeft dikirim) */}
      {timeLeft !== undefined && (
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
      )}

      {/* Sisi Kanan: Skor, Target & Nyawa */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Nyawa (Hearts) */}
        {lives !== undefined && (
          <div className="flex items-center gap-1 rounded-xl border-2 border-[#134E4A] bg-white px-2 py-1 shadow-[2px_2px_0px_#134E4A]">
            {Array.from({ length: maxLives }).map((_, i) => (
              <HeartSvg
                key={i}
                size={16}
                fill={i < lives ? "#FF6B6B" : "#CBD5E1"}
                stroke={i < lives ? "#134E4A" : "#94A3B8"}
                className={i < lives ? "transition-transform scale-100" : "transition-transform scale-90 opacity-60"}
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
