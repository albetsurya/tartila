import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const NEO_CONFETTI_COLORS = ["#F59E0B", "#0D9488", "#FF6B6B"];

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  isCircle: boolean;
  initialRotate: number;
  rotateDelta: number;
}

export const VictoryConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  const shouldReduceMotion = useReducedMotion();

  const pieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.floor((i / 32) * 92 + (Math.random() * 4 - 2) + 4),
      delay: Math.random() * 0.7,
      duration: 2.2 + Math.random() * 1.1,
      size: 10 + Math.floor(Math.random() * 6),
      color: NEO_CONFETTI_COLORS[i % NEO_CONFETTI_COLORS.length],
      isCircle: i % 3 === 0,
      initialRotate: Math.floor(Math.random() * 360),
      rotateDelta: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
    }));
  }, []);

  if (!active || shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: "-8vh",
            rotate: p.initialRotate,
            opacity: 1,
          }}
          animate={{
            y: "106vh",
            rotate: p.initialRotate + p.rotateDelta,
            opacity: [1, 1, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.6,
          }}
          className={`absolute border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] ${
            p.isCircle ? "rounded-full" : "rounded-sm"
          }`}
          style={{
            width: `${p.size}px`,
            height: `${p.isCircle ? p.size : Math.round(p.size * 1.35)}px`,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
};
