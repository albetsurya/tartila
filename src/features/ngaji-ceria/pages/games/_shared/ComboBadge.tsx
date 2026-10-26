import { AnimatePresence, motion } from "framer-motion";

interface ComboBadgeProps {
  combo: number;
  multiplier?: number;
  className?: string;
}

export function ComboBadge({
  combo,
  multiplier,
  className = "",
}: ComboBadgeProps) {
  return (
    <div
      className={`pointer-events-none flex items-center justify-center ${className}`}
    >
      <AnimatePresence mode="popLayout">
        {combo >= 2 && (
          <motion.div
            key={combo}
            initial={{ scale: 0.65, opacity: 0, y: -6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -4 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 18,
            }}
            className="inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-[#134E4A] bg-[#FF6B6B] px-3 py-1 text-xs font-black text-white shadow-[0_3px_0px_#134E4A]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#FDE047"
              stroke="#134E4A"
              strokeWidth="2.2"
              strokeLinejoin="round"
              className="shrink-0"
              aria-hidden="true"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>

            <span className="tracking-wide uppercase">
              Kombo <span className="text-[#FEF08A]">{combo}×</span>
            </span>

            {multiplier !== undefined && (
              <span className="ml-0.5 rounded-full border border-[#134E4A] bg-[#FEF08A] px-1.5 py-0.2 text-[10px] font-black leading-tight text-[#134E4A]">
                {multiplier.toFixed(1)}×
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
