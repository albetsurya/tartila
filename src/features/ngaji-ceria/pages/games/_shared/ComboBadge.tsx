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
            <span className="text-sm leading-none">🔥</span>
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
