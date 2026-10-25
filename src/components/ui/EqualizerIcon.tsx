import React from "react";
import { motion } from "framer-motion";

export interface EqualizerIconProps {
  isPlaying?: boolean;
  size?: number;
  className?: string;
  barClassName?: string;
}

/**
 * Standardized Equalizer (Sound Wave) Icon
 * Animates strictly when isPlaying is true.
 * Stays completely static at resting height when isPlaying is false.
 */
export const EqualizerIcon: React.FC<EqualizerIconProps> = ({
  isPlaying = false,
  size = 18,
  className = "",
  barClassName = "bg-current",
}) => {
  const scale = size / 24;

  const bars = [
    { min: 5, max: 17, delay: 0, dur: 0.6 },
    { min: 9, max: 23, delay: 0.15, dur: 0.5 },
    { min: 13, max: 21, delay: 0.3, dur: 0.7 },
    { min: 7, max: 15, delay: 0.1, dur: 0.55 },
  ];

  return (
    <div
      className={`inline-flex items-end justify-center gap-[2px] ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {bars.map((bar, i) => (
        <motion.span
          key={i}
          className={`rounded-full ${barClassName}`}
          style={{ width: Math.max(2, Math.round(3 * scale)) }}
          animate={
            isPlaying
              ? { height: [bar.min * scale, bar.max * scale, bar.min * scale] }
              : { height: bar.min * scale }
          }
          transition={
            isPlaying
              ? {
                  repeat: Infinity,
                  duration: bar.dur,
                  delay: bar.delay,
                  ease: "easeInOut",
                }
              : { duration: 0.15 }
          }
        />
      ))}
    </div>
  );
};

export default EqualizerIcon;
