import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftSvg } from "../../../components/ui/CustomIcons";
import {
  JuicyHeart,
  JuicyCoin,
  JuicyStar,
} from "../../../components/ui/JuicyIcons";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import { useNgajiProgress } from "../pages/games/_shared/progression";
import { useEconomyStore } from "../hooks/useEconomyStore";

interface ThemedHeaderProps {
  title: string;
  onBack?: () => void;
  themeColorClass: string;
  textColorClass: string;
  /** Bentuk badge statistik sesuai tema halaman */
  statVariant?: "capsule" | "stamp" | "wood" | "postit";
  /** Override warna badge statistik (opsional) */
  statBgClass?: string;
  statTextClass?: string;
  /** Override tampilan tombol back (opsional) */
  backClass?: string;
  /** Rute eksplisit induk untuk tombol back jika onBack tidak disediakan */
  parentPath?: string;
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
  parentPath,
  themeColorClass,
  textColorClass,
  statVariant = "capsule",
  statBgClass,
  statTextClass,
  backClass,
  children,
}: ThemedHeaderProps) {
  const navigate = useNavigate();
  const progress = useNgajiProgress();
  const hearts = useEconomyStore((s) => s.hearts);
  const storeCoins = useEconomyStore((s) => s.coins);
  const currentCoins = storeCoins > 0 ? storeCoins : (progress.coins || 0);

  const shape = STAT_SHAPE[statVariant];
  const style = statBgClass ?? STAT_STYLE_DEFAULT[statVariant];
  const text = statTextClass ?? textColorClass;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (parentPath) {
      navigate(parentPath);
    } else {
      navigate("/member/ngaji-ceria");
    }
  };

  return (
    <header className="sticky top-0 z-50 pt-safe">
      <div
        className={`relative overflow-hidden border-b-[3px] border-[var(--border-color,#134E4A)] px-3 py-2.5 sm:py-3 shadow-[0_3px_0px_var(--shadow-color,#134E4A)] backdrop-blur-md ${themeColorClass}`}
      >
        {/* Ornamen khusus halaman (diletakkan di belakang tombol) */}
        {children}

        <div className="relative z-10 flex items-center gap-2">
          {/* Tombol Back gaya sticker: padding luas agar mudah diklik anak */}
          <button
            type="button"
            onClick={handleBack}
            aria-label="Kembali"
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center gap-0.5 rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] px-3 py-2.5 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] transition-all active:translate-y-[2px] active:shadow-none cursor-pointer ${
              backClass ?? "bg-white text-[#134E4A]"
            }`}
          >
            <ChevronLeftSvg size={20} />
          </button>

          <h1
            className={`flex-1 truncate py-1 font-display text-base sm:text-lg font-black leading-tight ${textColorClass}`}
          >
            {title}
          </h1>

          {/* Statistik ringkas: Hati, Koin, XP (Streak dihapus sesuai standarisasi) */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] text-xs sm:text-sm font-black border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] ${shape} ${style} ${text}`}
            >
              <JuicyHeart size={18} value={hearts} stroke="currentColor" />{" "}
              <AnimatedCounter value={hearts} duration={0.4} />
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] text-xs sm:text-sm font-black border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] ${shape} ${style} ${text}`}
            >
              <JuicyCoin size={18} value={currentCoins} stroke="currentColor" />{" "}
              <AnimatedCounter value={currentCoins} />
            </span>
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] text-xs sm:text-sm font-black border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] ${shape} ${style} ${text}`}
            >
              <JuicyStar size={18} stroke="currentColor" />{" "}
              <AnimatedCounter value={progress.xp} />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
