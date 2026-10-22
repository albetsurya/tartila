import { ReactNode } from "react";
import {
  ChevronLeftSvg,
  HeartSvg,
  CoinSvg,
  FireSvg,
  StarSvg,
} from "../../../components/ui/CustomIcons";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
import { useNgajiProgress } from "../pages/games/_shared/progression";
import { useEconomyStore } from "../hooks/useEconomyStore";

interface ThemedHeaderProps {
  title: string;
  onBack: () => void;
  themeColorClass: string;
  textColorClass: string;
  /** Bentuk badge statistik sesuai tema halaman */
  statVariant?: "capsule" | "stamp" | "wood" | "postit";
  /** Override warna badge statistik (opsional) */
  statBgClass?: string;
  statTextClass?: string;
  /** Override tampilan tombol back (opsional) */
  backClass?: string;
  /** Ornamen dekoratif khusus (bintang, awan, dsb) */
  children?: ReactNode;
}

const STAT_SHAPE: Record<NonNullable<ThemedHeaderProps["statVariant"]>, string> = {
  capsule: "rounded-full border-[3px] border-white/70",
  stamp: "rounded-[4px] border-[3px] border-dashed border-[#B91C1C]/60",
  wood: "rounded-md border-[3px] border-[#134E4A]",
  postit: "rounded-[4px] border-2 border-[#134E4A] rotate-[-1.5deg]",
};

const STAT_STYLE_DEFAULT: Record<NonNullable<ThemedHeaderProps["statVariant"]>, string> = {
  capsule: "bg-[#134E4A]",
  stamp: "bg-white/[0.85]",
  wood: "bg-[#92400E]",
  postit: "bg-[#FEF3C7]",
};

export function ThemedHeader({
  title,
  onBack,
  themeColorClass,
  textColorClass,
  statVariant = "capsule",
  statBgClass,
  statTextClass,
  backClass,
  children,
}: ThemedHeaderProps) {
  const { currentStreak } = useNgajiCeriaStreak();
  const progress = useNgajiProgress();
  const hearts = useEconomyStore((s) => s.hearts);

  const shape = STAT_SHAPE[statVariant];
  const style = statBgClass ?? STAT_STYLE_DEFAULT[statVariant];
  const text = statTextClass ?? textColorClass;

  return (
    <header className="sticky top-0 z-40 pt-safe">
      <div
        className={`relative overflow-hidden border-b-[3px] border-[#134E4A] px-3 py-3 ${themeColorClass}`}
      >
        {/* Ornamen khusus halaman (diletakkan di belakang tombol) */}
        {children}

        <div className="relative z-10 flex items-center gap-2">
          {/* Tombol Back gaya sticker — padding luas agar mudah diklik anak */}
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center gap-0.5 rounded-2xl border-[3px] border-[#134E4A] px-3 py-2.5 shadow-[2px_2px_0px_#134E4A] transition-all active:translate-y-[2px] active:shadow-none ${
              backClass ?? "bg-white text-[#134E4A]"
            }`}
          >
            <ChevronLeftSvg />
          </button>

          <h1
            className={`flex-1 truncate py-1 font-display text-base font-black leading-tight ${textColorClass}`}
          >
            {title}
          </h1>

          {/* Statistik ringkas: Hati, Koin, Streak, XP */}
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-1 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] ${shape} ${style} ${text}`}
            >
              <HeartSvg size={12} /> {hearts}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-1 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] ${shape} ${style} ${text}`}
            >
              <CoinSvg size={12} /> {progress.coins || 0}
            </span>
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-1 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] ${shape} ${style} ${text}`}
            >
              <FireSvg size={12} /> {currentStreak}
            </span>
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-1 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] ${shape} ${style} ${text}`}
            >
              <StarSvg size={12} /> {progress.xp}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
