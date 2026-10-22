import { motion } from "framer-motion";

const SPARKLES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const distance = 70 + (i % 4) * 22;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 14 + (i % 3) * 6,
    delay: (i % 5) * 0.03,
  };
});

/**
 * Ledakan kilau emas saat jawaban benar (item roadmap 4B).
 * Ringan (framer-motion, tanpa dependensi confetti) + hormat reduced-motion.
 */
export function SparkleBurst({ burstKey }: { burstKey: string }) {
  return (
    <div
      key={burstKey}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible"
    >
      {SPARKLES.map((spark, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={{
            x: spark.x,
            y: spark.y,
            scale: [0.4, 1.2, 0.6],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.75, delay: spark.delay, ease: "easeOut" }}
          className="inline-block"
        >
          <svg
            width={spark.size}
            height={spark.size}
            viewBox="0 0 24 24"
            fill="#FACC15"
            stroke="#134E4A"
            strokeWidth="1.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </motion.span>
      ))}
    </div>
  );
}
