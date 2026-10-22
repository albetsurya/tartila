import { motion } from "framer-motion";
import type { Card as CardData } from "../data/match-pairs";

export function Card({
  card,
  index,
  disabled,
  onFlip,
}: {
  card: CardData;
  index: number;
  disabled: boolean;
  onFlip: () => void;
}) {
  const open = card.isFlipped || card.isMatched;
  return (
    <button
      onClick={onFlip}
      disabled={disabled || open}
      aria-label={
        open
          ? `${card.content}${card.isMatched ? ", cocok" : ""}`
          : `Kartu ${index + 1}, tertutup`
      }
      data-card-id={card.id}
      className="relative min-h-16 w-full rounded-xl active:scale-[0.97]"
      style={{ perspective: 600, aspectRatio: "1 / 1.15" }}
    >
      <motion.div
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#0D9488] shadow-[2px_2px_0px_#134E4A]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="font-display font-black text-white text-2xl select-none">؟</span>
        </div>
        <div
          aria-hidden={!open}
          className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 p-1 ${card.isMatched ? "border-teal-400 bg-teal-950 text-teal-100" : "border-teal-300 bg-teal-100 text-teal-950"} ${card.type === "arabic" ? "game-arabic text-3xl" : "text-[11px] font-black leading-tight"}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {card.content}
        </div>
      </motion.div>
    </button>
  );
}
