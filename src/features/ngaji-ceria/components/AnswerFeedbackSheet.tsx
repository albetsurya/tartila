import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, StarSvg, SparklesSvg, ChevronRightSvg } from "@/components/ui/CustomIcons";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { playSfx } from "../pages/games/_shared/audio";

export interface AnswerFeedbackSheetProps {
  isOpen: boolean;
  isCorrect: boolean;
  onNext?: () => void;
  onRetry?: () => void;
  onReset?: () => void;
  onClose?: () => void;
  mascotMessage?: string;
}

export function AnswerFeedbackSheet({
  isOpen,
  isCorrect,
  onNext,
  onRetry,
  onReset,
  onClose,
  mascotMessage,
}: AnswerFeedbackSheetProps) {
  useEffect(() => {
    if (isOpen) {
      void playSfx(isCorrect ? "answer-correct" : "answer-wrong");
    }
  }, [isOpen, isCorrect]);

  return (
    <AppBottomSheet
      isOpen={isOpen}
      onClose={onClose ?? (() => {})}
      title={isCorrect ? "Jawaban Tepat" : "Belum Tepat"}
    >
      {isCorrect ? (
        /* ================= BENAR (CORRECT) ================= */
        <div className="w-full flex flex-col items-center text-center">
          {/* Maskot & Efek Animasi Bintang / Konfeti */}
          <div className="relative my-2 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -top-3 -left-6 text-[#F59E0B]"
            >
              <StarSvg size={22} fill="#F59E0B" />
            </motion.div>
            <motion.div
              animate={{ y: [-3, 3, -3], rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 text-[#FBBF24]"
            >
              <SparklesSvg size={24} />
            </motion.div>
            <motion.div
              animate={{ scale: [0.9, 1.2, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute -bottom-2 -left-4 text-[#2DD4BF]"
            >
              <SparklesSvg size={18} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute -bottom-1 -right-5 text-[#F59E0B]"
            >
              <StarSvg size={18} fill="#F59E0B" />
            </motion.div>

            <div className="relative z-10 py-1">
              <TilaMascot
                size={90}
                mood="excited"
                animation="bounce"
              />
            </div>
          </div>

          {/* Teks Benar */}
          <h3 className="font-display font-black text-2xl text-[#0D9488] leading-tight mt-1">
            Masya Allah, Tepat Sekali!
          </h3>
          <p className="text-sm font-bold text-[#134E4A]/80 mt-1 max-w-[280px]">
            {mascotMessage || "Jawabanmu benar! Teruskan semangat belajarmu."}
          </p>

          {/* Tombol Lanjut (Full Width) */}
          <button
            type="button"
            onClick={onNext}
            className="w-full mt-6 py-4 px-6 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-black text-lg border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lanjut</span>
            <ChevronRightSvg size={20} />
          </button>
        </div>
      ) : (
        /* ================= SALAH (INCORRECT) ================= */
        <div className="w-full flex flex-col items-center text-center">
          {/* Maskot Sedih / Shy */}
          <div className="relative my-2 py-1">
            <TilaMascot
              size={86}
              mood="sad"
              animation="float"
            />
          </div>

          {/* Teks Belum Tepat */}
          <h3 className="font-display font-black text-2xl text-[#FF6B6B] leading-tight mt-1">
            Belum tepat, coba lagi ya!
          </h3>
          <p className="text-sm font-bold text-[#134E4A]/80 mt-1 max-w-[280px]">
            {mascotMessage || "Jangan berkecil hati, perhatikan lagi bunyi dan harakatnya."}
          </p>

          {/* Tombol Aksi */}
          <div className="w-full mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onRetry}
              className="w-full py-4 px-6 rounded-2xl bg-[#FF6B6B] hover:bg-[#E63946] text-white font-display font-black text-lg border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={20} className="stroke-[2.5]" />
              <span>Ulangi</span>
            </button>

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#78350F] font-bold text-sm border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Hapus Jawaban</span>
              </button>
            )}
          </div>
        </div>
      )}
    </AppBottomSheet>
  );
}

export default AnswerFeedbackSheet;
