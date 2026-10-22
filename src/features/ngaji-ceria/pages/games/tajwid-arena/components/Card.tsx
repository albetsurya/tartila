import type { TajwidCard } from "../data/cards";
import { ZapSvg } from "@/components/ui/CustomIcons";

export function Card({ card, active, disabled, onPlay }: { card: TajwidCard; active: boolean; disabled: boolean; onPlay: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPlay}
      className={`min-w-24 rounded-2xl border p-3 text-center transition-transform active:scale-95 ${active ? "border-teal-300 bg-teal-500/25" : "border-white/15 bg-white/5"}`}
    >
      <span className="game-arabic text-3xl text-teal-200">{card.icon}</span>
      <span className="mt-1 block text-[10px] font-black text-white">{card.name}</span>
      <span className="mt-1 flex items-center justify-center gap-1 text-[9px] text-white/60">
        <ZapSvg size={12} className="text-[#FBBF24] fill-[#FBBF24]" />
        <span>{card.energy} · {card.damage} dmg</span>
      </span>
    </button>
  );
}
