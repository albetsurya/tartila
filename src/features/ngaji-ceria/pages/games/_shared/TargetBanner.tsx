import { motion } from "framer-motion";

type LetterBoxProps = {
  letter: string;
  index: number;
  isCollected: boolean;
  isActive: boolean;
};

function LetterBox({ letter, index, isCollected, isActive }: LetterBoxProps) {
  if (isCollected) {
    return (
      <motion.div
        key={`collected-${letter}-${index}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border-[3px] border-[#16A34A] bg-[#DCFCE7] text-[#166534] shadow-[2px_2px_0px_#16A34A] font-black text-2xl sm:text-3xl"
      >
        {letter}
      </motion.div>
    );
  }

  if (isActive) {
    return (
      <motion.div
        key={`active-${letter}-${index}`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border-[3px] border-[#16A34A] bg-[#FEF3C7] text-[#B45309] shadow-[2px_2px_0px_#16A34A] font-black text-2xl sm:text-3xl animate-pulse"
      >
        {letter}
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`pending-${letter}-${index}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border-[3px] border-dashed border-[#CBD5E1] bg-[#F1F5F9] text-[#94A3B8]/60 shadow-[2px_2px_0px_#CBD5E1] font-black text-2xl sm:text-3xl"
    >
      {letter}
    </motion.div>
  );
}

export function TargetBanner({
  targetLetters,
  collectedLetters,
  isWord = false,
  className = "",
}: {
  targetLetters: string[];
  collectedLetters: string[];
  isWord?: boolean;
  className?: string;
}) {
  if (!targetLetters || targetLetters.length === 0) {
    return null;
  }

  const allCollected = collectedLetters.length >= targetLetters.length;

  return (
    <motion.div
      className={`flex flex-col items-center gap-1.5 border-[3px] border-[#134E4A] rounded-2xl bg-[#CCFBF1] px-3 py-2 shadow-[4px_4px_0px_#134E4A] ${className}`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#134E4A]/70">
        <span className="font-black">SUSUN</span>
        <span className="h-1.5 w-px bg-[#134E4A]/30" />
        <span className="font-bold">
          {collectedLetters.length}/{targetLetters.length}
        </span>
      </div>

      {isWord && targetLetters.length > 1 ? (
        <div
          dir="rtl"
          className="font-arabic text-3xl sm:text-4xl font-black leading-none"
        >
          <span
            style={{
              color: "#16A34A",
            }}
          >
            {targetLetters.slice(0, collectedLetters.length).join("")}
          </span>
          <span
            style={{
              color: "#94A3B8",
            }}
          >
            {targetLetters.slice(collectedLetters.length).join("")}
          </span>
        </div>
      ) : (
        <div
          dir="rtl"
          className="flex flex-wrap items-center justify-center gap-1"
        >
          {targetLetters.map((letter, index) => {
            const isCollected = index < collectedLetters.length;
            const isActive = collectedLetters.length === index;
            return (
              <LetterBox
                key={`${letter}-${index}`}
                letter={letter}
                index={index}
                isCollected={isCollected}
                isActive={isActive}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
}