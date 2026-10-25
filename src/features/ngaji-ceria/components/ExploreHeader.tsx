import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftSvg } from "../../../components/ui/CustomIcons";
import { JuicyHeart, JuicyCoin } from "../../../components/ui/JuicyIcons";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import { useEconomyStore, isUnlimitedUser } from "../hooks/useEconomyStore";
import { useNgajiProgress } from "../pages/games/_shared/progression";
import { useAuth } from "@/contexts/AuthContext";

export interface ExploreStatBadgeProps {
  icon: ReactNode;
  value: ReactNode;
  title?: string;
  className?: string;
}

/** Badge statistik Neo-Brutalism yang otomatis mewarisi warna Scoped Theme */
export function ExploreStatBadge({
  icon,
  value,
  title,
  className = "",
}: ExploreStatBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 sm:px-3.5 py-1.5 min-h-[38px] sm:min-h-[40px] text-xs sm:text-sm font-black text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] select-none shrink-0 ${className}`}
      title={title}
    >
      {icon}
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export interface ExploreHeaderProps {
  /** Judul Halaman */
  title: ReactNode;
  /** Subjudul Halaman (opsional) */
  subtitle?: ReactNode;
  /** Callback saat tombol back ditekan */
  onBack?: () => void;
  /** Rute eksplisit induk untuk tombol back jika onBack tidak disediakan */
  parentPath?: string;
  /** Label aksesibilitas tombol back */
  backAriaLabel?: string;
  /** Kustomisasi styling tombol back */
  backClass?: string;
  /** Konten kustom di dalam tombol back */
  backContent?: ReactNode;
  /** Scope Tema CSS (misal: 'tilawati', 'lab-irama', 'juz-amma', 'tajwid', 'doa') */
  themeScope?: string;
  /** Kelas kontainer utama header */
  className?: string;
  /** Override kelas background bar header (default: 'bg-[var(--bg-app)]') */
  themeColorClass?: string;
  /** Override kelas border bawah header (default: 'border-[var(--border-color)]') */
  borderColorClass?: string;
  /** Override kelas shadow bawah header (default: 'shadow-[0_3px_0px_var(--shadow-color)]') */
  shadowClass?: string;
  /** Override kelas teks header (default: 'text-[var(--text-main)]') */
  textColorClass?: string;
  /** Override kelas badge statistik */
  badgeClassName?: string;
  /** Sembunyikan badge Hati */
  hideHearts?: boolean;
  /** Sembunyikan badge Koin */
  hideCoins?: boolean;
  /** Nilai manual untuk Hati (opsional, default dari store) */
  heartsCount?: number;
  /** Nilai manual untuk Koin (opsional, default dari store) */
  coinsCount?: number;
  /** Flag manual untuk Hati unlimited */
  isUnlimitedHearts?: boolean;
  /** Badge ekstra di sebelah Koin (misal: Bintang, Tiket, atau Skor Tertinggi) */
  extraBadge?: ReactNode;
  /** Aksi tombol tambahan di sebelah kanan (misal: Panduan, Mode Latihan) */
  rightAction?: ReactNode;
  /** Elemen dekoratif background (SVG ornamen diletakkan di latar belakang) */
  children?: ReactNode;
}

export function ExploreHeader({
  title,
  subtitle,
  onBack,
  backAriaLabel = "Kembali",
  backClass,
  backContent,
  themeScope,
  className = "",
  themeColorClass,
  borderColorClass,
  shadowClass,
  textColorClass,
  badgeClassName,
  hideHearts = false,
  hideCoins = false,
  heartsCount,
  coinsCount,
  isUnlimitedHearts,
  extraBadge,
  parentPath,
  rightAction,
  children,
}: ExploreHeaderProps) {
  const navigate = useNavigate();
  const { user, groupId } = useAuth();
  const storeHearts = useEconomyStore((s) => s.hearts);
  const storeCoins = useEconomyStore((s) => s.coins);
  const isVip = useEconomyStore((s) => s.isVip);
  const progress = useNgajiProgress();

  const isUnlimited =
    isUnlimitedHearts !== undefined
      ? isUnlimitedHearts
      : isUnlimitedUser(user as any, isVip, groupId as any);

  const displayHearts = heartsCount !== undefined ? heartsCount : storeHearts;
  const displayCoins =
    coinsCount !== undefined ? coinsCount : (storeCoins > 0 ? storeCoins : (progress.coins || 0));

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (parentPath) {
      navigate(parentPath);
    } else {
      navigate("/member/ngaji-ceria/map");
    }
  };

  const defaultBadgeClass =
    "inline-flex items-center gap-1.5 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 sm:px-3.5 py-1.5 min-h-[38px] sm:min-h-[40px] text-xs sm:text-sm font-black text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] select-none shrink-0";

  return (
    <header
      data-theme-scope={themeScope}
      className={`sticky top-0 z-50 pt-safe ${className}`}
    >
      <div
        className={`relative overflow-hidden border-b-[3px] border-[var(--border-color,#134E4A)] px-3 sm:px-4 py-2.5 sm:py-3 shadow-[0_3px_0px_var(--shadow-color,#134E4A)] backdrop-blur-md ${
          themeColorClass || "bg-[var(--bg-app)]"
        } ${borderColorClass || ""} ${shadowClass || ""}`}
      >
        {/* Elemen ornamen/dekorasi latar belakang */}
        {children}

        <div className="relative z-10 mx-auto flex max-w-md md:max-w-4xl items-center justify-between gap-2 sm:gap-3">
          {/* Sisi Kiri: Tombol Back + Judul & Subjudul */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleBack}
              aria-label={backAriaLabel}
              className={`flex h-10 w-10 min-h-[40px] min-w-[40px] sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none hover:opacity-90 transition-all cursor-pointer ${
                backClass || ""
              }`}
            >
              {backContent || (
                <ChevronLeftSvg
                  size={20}
                  stroke="currentColor"
                  className="shrink-0"
                />
              )}
            </button>

            <div className="min-w-0 flex-1">
              {typeof title === "string" ? (
                <h1
                  className={`font-display font-black text-sm sm:text-base md:text-lg leading-tight truncate ${
                    textColorClass || "text-[var(--text-main,#134E4A)]"
                  }`}
                >
                  {title}
                </h1>
              ) : (
                title
              )}
              {subtitle &&
                (typeof subtitle === "string" ? (
                  <p
                    className={`text-[10px] sm:text-xs font-bold leading-tight truncate opacity-85 mt-0.5 ${
                      textColorClass || "text-[var(--text-main,#134E4A)]"
                    }`}
                  >
                    {subtitle}
                  </p>
                ) : (
                  subtitle
                ))}
            </div>
          </div>

          {/* Sisi Kanan: Urutan Terstandarisasi [Hati] [Koin] [ExtraBadge] [RightAction] */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {!hideHearts && (
              <div
                className={badgeClassName || defaultBadgeClass}
                title={
                  isUnlimited ? "Hati Tanpa Batas" : `Hati: ${displayHearts}/5`
                }
              >
                <JuicyHeart
                  size={18}
                  value={displayHearts}
                  stroke="currentColor"
                />
                <span className="tabular-nums">
                  {isUnlimited ? "∞" : <AnimatedCounter value={displayHearts} duration={0.4} />}
                </span>
              </div>
            )}

            {!hideCoins && (
              <div
                className={badgeClassName || defaultBadgeClass}
                title={`Koin: ${displayCoins}`}
              >
                <JuicyCoin
                  size={18}
                  value={displayCoins}
                  stroke="currentColor"
                />
                <span className="tabular-nums">
                  <AnimatedCounter value={displayCoins} />
                </span>
              </div>
            )}

            {extraBadge}

            {rightAction}
          </div>
        </div>
      </div>
    </header>
  );
}
