import { AnimatePresence, motion } from "framer-motion";

export function ComboBadge({
  combo,
  multiplier,
}: {
  combo: number;
  multiplier?: number;
}) {
  return (
    <div className="flex min-h-[36px] items-center justify-center">
      <AnimatePresence>
        {combo >= 2 && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            // Menggunakan gaya stiker: Coral #FF6B6B, border tebal, bayangan keras
            className="flex items-center gap-1.5 rounded-xl border-[2px] border-[#134E4A] bg-[#FF6B6B] px-3 py-1 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FDE047" stroke="#134E4A" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>
            <span>Kombo {combo}</span>
            {multiplier !== undefined && (
              <span className="rounded-md bg-white/25 px-1.5 py-0.5 text-[10px] font-black tracking-tighter">
                {multiplier.toFixed(1)}×
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
