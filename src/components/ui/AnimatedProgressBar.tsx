// src/components/ui/AnimatedProgressBar.tsx
import React from "react";
import { motion } from "framer-motion";

export interface AnimatedProgressBarProps {
  /** Nilai progress dalam persen (0 - 100) */
  value: number;
  /** Kelas wrapper luar */
  className?: string;
  /** Kelas styling bar bagian dalam (default: bg-[#0D9488]) */
  barClassName?: string;
  /** Tinggi bar (default: h-3) */
  height?: string;
  /** Apakah menampilkan efek kilauan/shimmer bergerak */
  showShimmer?: boolean;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  className = "",
  barClassName = "bg-[#0D9488]",
  height = "h-3",
  showShimmer = true,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`relative w-full overflow-hidden rounded-full border-2 border-[var(--border-color,#134E4A)] bg-gray-100 dark:bg-gray-800 ${height} ${className}`}
    >
      <motion.div
        className={`relative h-full rounded-full border-r-2 border-[var(--border-color,#134E4A)] ${barClassName}`}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Shimmer kilauan bergerak samar */}
        {showShimmer && clamped > 0 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              repeatDelay: 1.2,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
