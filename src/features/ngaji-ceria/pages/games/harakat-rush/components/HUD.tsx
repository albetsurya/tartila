import { Heart, Star, Trophy } from "@/components/ui/FontAwesomeIcons";
import { StatCard } from "@/components/ui/StatCard";
import { StickerCard } from "@/components/ui/StickerCard";
import { HARAKAT_LIST, type HarakatId } from "../data/harakat-list";

export function HUD({
  score,
  target,
  level,
  progress,
  targetCount,
  lives,
  themeColor,
}: {
  score: number;
  target: HarakatId;
  level: number;
  progress: number;
  targetCount: number;
  lives: number;
  themeColor: string;
}) {
  const item = HARAKAT_LIST.find((h) => h.id === target)!;
  const percent = Math.min(100, (progress / targetCount) * 100);

  return (
    <StickerCard accent="none" className="p-2">
      <div className="flex items-stretch gap-2">
        <StatCard
          icon={<Trophy size={16} />}
          label="Skor"
          value={score}
          iconColor="text-[#0D9488]"
        />

        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-[2px] border-[#134E4A] bg-[#F0FDF4] px-2 py-1 text-center shadow-[2px_2px_0px_#134E4A]">
          <p className="text-[8px] font-black uppercase tracking-wider text-[#134E4A]/60">
            Target
          </p>
          <p dir="rtl" className="text-2xl font-black leading-none text-[#FF6B6B]">
            {item.symbol}
          </p>
          <p className="truncate text-[9px] font-black text-[#0D9488]">
            {item.name}
          </p>
        </div>

        <StatCard
          icon={<Star size={16} />}
          label={`Lvl ${level}`}
          value={`${progress}/${targetCount}`}
          iconColor="text-[#F59E0B]"
        />
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full border-[2px] border-[#134E4A] bg-white">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: themeColor }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-center gap-1">
        {[0, 1, 2].map((i) => (
          <Heart
            key={i}
            size={15}
            className={i < lives ? "text-[#FF6B6B]" : "text-[#134E4A]/15"}
          />
        ))}
      </div>
    </StickerCard>
  );
}
