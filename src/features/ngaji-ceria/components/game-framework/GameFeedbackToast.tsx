import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSvg, InfoSvg } from "@/components/ui/CustomIcons";

export interface GameFeedbackMessage {
  id: number;
  text: string;
  type: "correct" | "wrong";
  arabicText?: string;
}

export interface GameFeedbackToastProps {
  feedback: GameFeedbackMessage | null;
  className?: string;
}

export const GameFeedbackToast: React.FC<GameFeedbackToastProps> = ({
  feedback,
  className = "",
}) => {
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 ${className}`}
    >
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: -10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className={`flex items-center gap-2 rounded-2xl border-[3px] border-[#134E4A] px-4 py-2 shadow-[3px_3px_0px_#134E4A] ${
              feedback.type === "correct"
                ? "bg-[#CCFBF1] text-[#0D9488]"
                : "bg-[#FFFBEB] text-[#B91C1C]"
            }`}
          >
            {feedback.type === "correct" ? (
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0D9488] text-white shadow-[1px_1px_0px_#134E4A]">
                <CheckSvg size={12} stroke="#FFFFFF" />
              </span>
            ) : (
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-[1px_1px_0px_#134E4A]">
                <InfoSvg size={12} stroke="#FFFFFF" />
              </span>
            )}

            <span className="font-display text-xs sm:text-sm font-black tracking-tight leading-snug">
              {feedback.text}
            </span>

            {feedback.arabicText && (
              <span
                dir="rtl"
                className="font-arabic text-base sm:text-lg font-black leading-normal text-[#134E4A] px-1 py-0.5"
              >
                {feedback.arabicText}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
