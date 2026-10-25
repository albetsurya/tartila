import React from "react";
import { motion } from "framer-motion";
import { PlaySvg, LockSvg, StarSvg } from "@/components/ui/CustomIcons";

export interface GameCardProps {
  title: string;
  cover: React.ReactNode;
  description?: string;
  genre?: string;
  tagline?: string;
  onClick: () => void;
  locked?: boolean;
  best?: number;
  badge?: string;
  index?: number;
  layout?: "vertical" | "horizontal";
  bgColor?: string;
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  cover,
  description,
  genre,
  tagline,
  onClick,
  locked = false,
  best = 0,
  badge,
  index,
  layout = "vertical",
  bgColor = "bg-[var(--bg-card,#FFFFFF)]",
  className = "",
}) => {
  const cardBorder = "border-[3px] border-[var(--border-color,#134E4A)]";
  const cardShadow = "shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]";
  const cardBg =
    !bgColor || bgColor === "bg-white" || bgColor === "bg-[var(--bg-card)]"
      ? "bg-[var(--bg-card,#FFFFFF)]"
      : `${bgColor} dark:bg-[var(--bg-card,#FFFFFF)]`;
  const titleText = "text-[var(--text-main,#134E4A)]";
  const descText = "text-[var(--text-main,#134E4A)]/70";
  const dropShadow = "drop-shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]";

  const displayTag = tagline || genre || (index !== undefined ? `Mode ${index + 1}` : undefined);

  const renderCover = (sizeClass: string) => {
    if (typeof cover === "string") {
      return (
        <img
          src={cover}
          alt=""
          aria-hidden="true"
          className={`h-full w-full object-contain ${dropShadow} transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3 ${
            locked ? "grayscale opacity-50" : ""
          }`}
          draggable={false}
        />
      );
    }
    return (
      <div
        className={`flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3 ${
          locked ? "grayscale opacity-50" : ""
        }`}
      >
        {cover}
      </div>
    );
  };

  if (layout === "horizontal") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.95, y: 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-[24px] border-[3px] ${cardBorder} p-4 text-left ${cardShadow} select-none cursor-pointer ${cardBg} ${
          locked ? "opacity-85" : ""
        } ${className}`}
      >
        {/* Teks Kiri */}
        <div className="relative z-10 flex-1 pr-4">
          {displayTag && (
            <span className={`mb-2 inline-flex items-center gap-1 rounded-md border-[2px] ${cardBorder} bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] px-2 py-0.5 text-[9px] font-black uppercase`}>
              {displayTag}
            </span>
          )}

          <h3 className={`font-display text-lg font-black leading-tight ${titleText}`}>
            {title}
          </h3>

          {description && (
            <p className={`mt-1 text-[11px] font-bold ${descText} line-clamp-2`}>
              {description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl border-[2.5px] px-3.5 py-1.5 text-[11px] font-black text-white ${
                locked
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-[var(--border-color,#134E4A)]/50 shadow-none"
                  : `border-[var(--border-color,#134E4A)] bg-[#0D9488] hover:bg-[#0F766E] shadow-[2.5px_2.5px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none`
              }`}
            >
              {locked ? (
                <>
                  <LockSvg size={12} /> Terkunci
                </>
              ) : (
                <>
                  <PlaySvg size={12} className="fill-white" /> Mainkan
                </>
              )}
            </span>

            {best > 0 && !locked && (
              <span className={`inline-flex items-center gap-1 rounded-lg border-[2px] ${cardBorder} bg-[var(--bg-card,#FFFFFF)] px-2 py-1.5 text-[10px] font-black ${titleText} shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]`}>
                <StarSvg size={12} className="text-[#FF6B6B] fill-[#FF6B6B]" />{" "}
                {best}
              </span>
            )}
          </div>
        </div>

        {/* Gambar / Cover Kanan */}
        <div className="relative z-10 flex h-24 w-24 shrink-0 items-center justify-center">
          <div className="absolute inset-0 m-auto h-20 w-20 rounded-full border-[2.5px] border-[#134E4A] dark:border-white/80 bg-white shadow-[2.5px_2.5px_0px_#134E4A] dark:shadow-[0_0_12px_rgba(255,255,255,0.35)]" />
          <div className="relative z-10 flex items-center justify-center text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]">
            {renderCover("h-20 w-20")}
          </div>
        </div>
      </motion.button>
    );
  }

  // Layout Vertical (Default untuk Grid Game)
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.95, y: 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative flex flex-col items-center w-full rounded-[24px] border-[3px] ${cardBorder} p-3 text-center overflow-hidden ${cardShadow} select-none cursor-pointer ${cardBg} ${
        locked ? "opacity-80 grayscale-[25%]" : ""
      } ${className}`}
    >
      {/* Badge Top Left */}
      {locked ? (
        <div className={`absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-gray-200 dark:bg-gray-800 px-2 py-0.5 text-[9px] font-black text-gray-700 dark:text-gray-300 border-2 ${cardBorder} shadow-[1px_1px_0px_currentColor]`}>
          <LockSvg size={10} /> TERKUNCI
        </div>
      ) : best > 0 ? (
        <div className={`absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-[#FEF3C7] dark:bg-amber-950 px-2 py-0.5 text-[10px] font-black text-[#D97706] dark:text-amber-400 border-2 ${cardBorder} shadow-[1px_1px_0px_currentColor]`}>
          <StarSvg size={10} className="fill-[#F59E0B]" /> {best}
        </div>
      ) : badge ? (
        <div className={`absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-[#DCFCE7] dark:bg-emerald-950 text-[var(--text-main,#134E4A)] border-2 border-[var(--border-color,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] px-2 py-0.5 text-[9px] font-black`}>
          {badge}
        </div>
      ) : null}

      {/* Stage Cover Tengah */}
      <div className="relative z-10 mt-4 flex h-24 w-full items-center justify-center">
        {/* Lingkaran Ornamen Latar Belakang - Sticker Backdrop */}
        <div className="absolute inset-0 m-auto h-20 w-20 rounded-full border-[2.5px] border-[#134E4A] dark:border-white/80 bg-white shadow-[2.5px_2.5px_0px_#134E4A] dark:shadow-[0_0_12px_rgba(255,255,255,0.35)]" />
        <div className="relative z-10 flex items-center justify-center text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]">
          {renderCover("h-20 w-20")}
        </div>
      </div>

      {/* Teks Judul & Genre */}
      <div className="mt-3 flex w-full flex-col items-center text-center z-10">
        <h3 className={`font-display text-[15px] font-black leading-tight ${titleText} line-clamp-1`}>
          {title}
        </h3>
        {displayTag && (
          <p className={`mt-0.5 text-[10px] font-bold ${descText} line-clamp-1`}>
            {displayTag}
          </p>
        )}
      </div>

      {/* Tombol Aksi di Bawah Kartu */}
      <div className="mt-3 w-full z-10">
        <span
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl border-[2.5px] py-2 text-xs font-black transition-all ${
            locked
              ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-[var(--border-color,#134E4A)]/50 shadow-none"
              : "bg-[#0D9488] hover:bg-[#0F766E] text-white border-[var(--border-color,#134E4A)] shadow-[2.5px_2.5px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none"
          }`}
        >
          {locked ? (
            <>
              <LockSvg size={12} /> Terkunci
            </>
          ) : (
            <>
              <PlaySvg size={12} className="fill-white" /> Main
            </>
          )}
        </span>
      </div>
    </motion.button>
  );
};

export default GameCard;
