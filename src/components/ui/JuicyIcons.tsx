// src/components/ui/JuicyIcons.tsx
import React from "react";
import { motion } from "framer-motion";
import { CoinSvg, StarSvg, FireSvg, HeartSvg } from "./CustomIcons";

export interface JuicyIconProps {
  size?: number;
  className?: string;
  value?: number | string;
  stroke?: string;
}

/**
 * JuicyCoin: Berputar 360 derajat & pop saat nilai koin bertambah/berkurang
 */
export const JuicyCoin: React.FC<JuicyIconProps> = ({
  size = 14,
  className = "",
  value,
  stroke,
}) => {
  return (
    <motion.span
      key={value !== undefined ? String(value) : undefined}
      animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="inline-flex shrink-0 items-center justify-center select-none"
    >
      <CoinSvg size={size} className={className} stroke={stroke} />
    </motion.span>
  );
};

/**
 * JuicyStar: Kelap-kelip halus (sparkle/twinkle loop) untuk menarik perhatian
 */
export const JuicyStar: React.FC<JuicyIconProps> = ({
  size = 14,
  className = "",
  stroke,
}) => {
  return (
    <motion.span
      animate={{ opacity: [1, 0.6, 1], rotate: [0, 8, -8, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="inline-flex shrink-0 items-center justify-center select-none"
    >
      <StarSvg size={size} className={className} stroke={stroke} />
    </motion.span>
  );
};

/**
 * JuicyFire: Kobaran api bernapas (pulse/breathing loop)
 */
export const JuicyFire: React.FC<JuicyIconProps> = ({
  size = 14,
  className = "",
  stroke,
}) => {
  return (
    <motion.span
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      className="inline-flex shrink-0 items-center justify-center select-none"
    >
      <FireSvg size={size} className={className} stroke={stroke} />
    </motion.span>
  );
};

/**
 * JuicyHeart: Detak jantung / pop saat nilai nyawa berkurang/bertambah
 */
export const JuicyHeart: React.FC<JuicyIconProps> = ({
  size = 14,
  className = "",
  value,
  stroke,
}) => {
  return (
    <motion.span
      key={value !== undefined ? String(value) : undefined}
      animate={{ scale: [1, 1.18, 1] }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="inline-flex shrink-0 items-center justify-center select-none"
    >
      <HeartSvg size={size} className={className} stroke={stroke} />
    </motion.span>
  );
};
