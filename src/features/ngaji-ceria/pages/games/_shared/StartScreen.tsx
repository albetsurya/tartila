import { motion } from "framer-motion";
import { Play, Star, BookOpen, ChevronLeft } from "@/components/ui/CustomIcons";
import { StickerButton } from "@/components/ui/StickerButton";
import { type GameAccent } from "./types";
import type { ReactNode } from "react";

export function StartScreen({
  title,
  tagline,
  description,
  coverImage,
  best = 0,
  onStart,
  onExit,
  accent = "pink",
  hideStartButton = false,
  children,
}: {
  title: string;
  tagline: string;
  description: string;
  coverImage?: ReactNode;
  best?: number;
  onStart: () => void;
  onExit?: () => void;
  accent?: GameAccent;
  hideStartButton?: boolean;
  children?: ReactNode;
}) {
  return (
    // Wrapper untuk menengahkan kartu secara vertikal dan horizontal
    <div className="flex flex-1 flex-col items-center justify-center w-full px-4 py-8 pb-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-sm md:max-w-md mx-auto flex flex-col items-center bg-white rounded-[32px] border-[4px] border-[#134E4A] shadow-[6px_6px_0px_#134E4A] p-6 md:p-8 pt-12 md:pt-14 text-center"
      >
        {/* Tombol Kembali (Hanya muncul jika onExit dikirim) */}
        {onExit && (
          <button
            onClick={onExit}
            className="absolute top-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#F0FDF4] text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
            aria-label="Kembali"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Ornamen Latar Belakang */}
        <div className="absolute inset-0 overflow-hidden rounded-[28px] pointer-events-none z-0">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F0FDF4] rounded-full blur-2xl opacity-60" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FF6B6B]/10 rounded-full blur-2xl opacity-60" />
        </div>

        {/* Badge Skor Terbaik */}
        <motion.div
          initial={{ rotate: -5, scale: 0 }}
          animate={{ rotate: 5, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="absolute -top-5 -right-3 z-20 flex items-center gap-1.5 rounded-xl border-[3px] border-[#134E4A] bg-[#FEF3C7] px-3 py-1.5 text-xs font-black text-[#B45309] shadow-[3px_3px_0px_#134E4A]"
        >
          <Star size={14} className="fill-[#B45309]" />
          Rekor: {best}
        </motion.div>

        {/* Gambar Cover */}
        <div className="relative z-10 -mt-24 mb-4 flex items-center justify-center">
          {coverImage ? (
            typeof coverImage === "string" ? (
              <img
                src={coverImage}
                alt=""
                className="h-28 w-28 object-contain drop-shadow-[4px_4px_0px_#134E4A] sm:h-32 sm:w-32"
              />
            ) : (
              <div className="h-28 w-28 sm:h-32 sm:w-32 flex items-center justify-center drop-shadow-[4px_4px_0px_#134E4A]">
                {coverImage}
              </div>
            )
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-[3px] border-[#134E4A] bg-[#0D9488] shadow-[4px_4px_0px_#134E4A] rotate-3">
              <BookOpen size={40} className="text-white" />
            </div>
          )}
        </div>

        {/* Teks Konten */}
        <div className="relative z-10 flex flex-col items-center w-full">
          <span className="mb-2 inline-block rounded-full bg-[#FF6B6B] border-[2px] border-[#134E4A] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#134E4A]">
            {tagline}
          </span>

          <h1 className="font-display text-3xl font-black leading-tight text-[#134E4A] mb-2 drop-shadow-sm">
            {title}
          </h1>

          <p className="max-w-[260px] text-sm font-bold leading-relaxed text-[#134E4A]/70 mb-5">
            {description}
          </p>

          {children}

          {!hideStartButton && (
            <StickerButton
              variant="primary"
              size="lg"
              fullWidth
              className="mt-2 text-lg shadow-[4px_4px_0px_#134E4A] active:translate-y-[4px]"
              onClick={onStart}
            >
              <Play size={20} className="fill-current" />
              Mulai Bermain
            </StickerButton>
          )}
        </div>
      </motion.div>
    </div>
  );
}
