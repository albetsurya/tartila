import React, { ReactNode, useEffect, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaBottomNav } from "./NgajiCeriaBottomNav";
import { RewardChestModal } from "./RewardChestModal";
import { useEconomyStore, isUnlimitedUser } from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeRole, isUstadzUser } from "@/lib/roles";
import { getRank, useNgajiProgress } from "../pages/games/_shared/progression";
import { ProgressionNotice } from "./ProgressionNotice";
import { soundManager } from "../services/soundManager";
import {
  TilaCompanion,
  type PageTipConfig,
} from "../../../components/ui/TilaCompanion";
import { TartilaFaviconSvg } from "../../../components/ui/TartilaLogo";
import {
  TicketSvg,
  ChevronLeftSvg,
} from "../../../components/ui/CustomIcons";
import {
  JuicyHeart,
  JuicyStar,
  JuicyCoin,
} from "../../../components/ui/JuicyIcons";
import { NotificationBell } from "../../../components/ui/NotificationBell";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { pageVariants } from "@/lib/animationVariants";
import type { NotificationRole } from "@/services/notificationService";

export type { PageTipConfig };

export type ImmersiveRealm =
  | 'juz-amma'
  | 'tajwid'
  | 'doa'
  | 'tahfidz'
  | 'tilawati'
  | 'arena-kartu'
  | 'jurnal-ibadah'
  | 'lab-irama';

export type ThemeScope =
  | 'global'
  | 'immersive'
  | ImmersiveRealm;

const REALM_BG_CLASSES: Record<ImmersiveRealm, string> = {
  'juz-amma': 'bg-[#1E1B4B]',
  'tajwid': 'bg-[#FEF9C3]',
  'doa': 'bg-[#FFFBEB]',
  'tahfidz': 'bg-[#042F2E]',
  'arena-kartu': 'bg-[#065F46]',
  'tilawati': 'bg-[#E0F2FE]',
  'jurnal-ibadah': 'bg-[#D1FAE5]',
  'lab-irama': 'bg-[#111827]',
};

const MAIN_TABS = [
  "/member/ngaji-ceria",
  "/member/ngaji-ceria/map",
  "/member/ngaji-ceria/games",
  "/member/ngaji-ceria/profile",
];

interface NgajiCeriaLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  hideNav?: boolean;
  hideHeader?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  parentPath?: string;
  rightAction?: ReactNode;
  pageTip?: PageTipConfig;
  themeScope?: ThemeScope;
  immersiveRealm?: ImmersiveRealm;
}

function PageContentFallback() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#F0FDF4]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0D9488]/30 border-t-[#0D9488]" />
    </div>
  );
}

export function NgajiCeriaLayout({
  children,
  title = "Tartila",
  hideNav = false,
  hideHeader = false,
  showBack = true,
  onBack,
  parentPath,
  rightAction,
  pageTip,
  themeScope = "global",
  immersiveRealm,
}: NgajiCeriaLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainTab = MAIN_TABS.includes(location.pathname.replace(/\/$/, ""));
  const progress = useNgajiProgress();
  const rank = getRank(progress.xp);

  const { user, groupId } = useAuth();
  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const syncTime = useEconomyStore((s) => s.syncTime);
  const equippedAppTheme = useEconomyStore((s) => s.equippedAppTheme) || "default";
  const storeCoins = useEconomyStore((s) => s.coins);
  const currentCoins = storeCoins > 0 ? storeCoins : (progress.coins || 0);

  const isDirectRealmScope =
    themeScope !== "global" && themeScope !== "immersive";

  const resolvedRealm: ImmersiveRealm | undefined =
    (isDirectRealmScope ? (themeScope as ImmersiveRealm) : undefined) ||
    immersiveRealm ||
    (location.pathname.includes("/explore/juz-amma")
      ? "juz-amma"
      : location.pathname.includes("/explore/tajwid")
        ? "tajwid"
        : location.pathname.includes("/explore/doa")
          ? "doa"
          : location.pathname.includes("/explore/tahfidz")
            ? "tahfidz"
            : location.pathname.includes("/explore/tilawati")
              ? "tilawati"
              : location.pathname.includes("/explore/practice")
                ? "arena-kartu"
                : location.pathname.includes("/explore/jurnal")
                  ? "jurnal-ibadah"
                  : location.pathname.includes("/lab-irama")
                    ? "lab-irama"
                    : undefined);

  const isImmersive =
    themeScope === "immersive" ||
    isDirectRealmScope ||
    Boolean(immersiveRealm);

  const activeThemeScopeAttr = isImmersive
    ? (resolvedRealm || (themeScope !== "global" ? themeScope : "immersive"))
    : undefined;

  const containerBgClass =
    isImmersive && resolvedRealm
      ? REALM_BG_CLASSES[resolvedRealm]
      : "bg-[var(--bg-app,#F0FDF4)]";

  useEffect(() => {
    syncTime();
  }, [syncTime]);

  const isDarkTheme = equippedAppTheme === "night" || equippedAppTheme === "neon";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-app-theme", equippedAppTheme);
      document.body.setAttribute("data-app-theme", equippedAppTheme);
      if (isDarkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [equippedAppTheme, isDarkTheme]);

  const isUnlimited = isUnlimitedUser(user, isVip, groupId);
  const isUstadzAccount = user && isUstadzUser(user);

  const tier = (user as { tier?: string } | null)?.tier;
  const userRole: NotificationRole =
    normalizeRole(user?.role) === "superadmin" || tier === "superadmin"
      ? "superadmin"
      : normalizeRole(user?.role) === "tartila_admin"
        ? "tartila_admin"
        : "member";

  useEffect(() => {
    if (hideNav) return;
    soundManager.playBgm("menu", 0.18);
    return () => soundManager.stopBgm();
  }, [hideNav]);

  const isModuleHome =
    location.pathname === "/member/ngaji-ceria" ||
    location.pathname === "/member/ngaji-ceria/";

  const showBackButton =
    showBack && !isModuleHome && (hideNav || Boolean(onBack));

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (parentPath) {
      navigate(parentPath);
      return;
    }
    navigate("/member/ngaji-ceria");
  };

  return (
    <div
      data-theme-scope={activeThemeScopeAttr}
      data-realm={isImmersive ? resolvedRealm : undefined}
      className={`${hideNav ? "h-dvh min-h-dvh overflow-hidden" : "min-h-screen"} ${containerBgClass} ${isImmersive ? "theme-isolated" : ""} text-[var(--text-main,#134E4A)] flex flex-col justify-between selection:bg-teal-emerald/20 relative overflow-x-clip font-sans transition-colors duration-200`}
    >
      {!hideHeader && !hideNav && (
        <header
          className="sticky top-0 z-[60] shrink-0 pt-safe transition-colors duration-200 bg-[var(--bg-card,#FFFFFF)] border-b-2 border-[var(--border-color,#134E4A)] shadow-[0px_2px_0px_var(--shadow-color,#134E4A))] text-[var(--text-main,#134E4A)]"
        >
          {/* Container utama header responsif jika dua baris (Mobile, Tablet, Desktop) */}
          <div className="relative z-10 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-3 sm:px-6">
            {/* BARIS 1: Identitas (logo/judul) + lonceng notifikasi */}
            <div className="flex h-11 items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                {showBackButton && (
                  <button
                    onClick={handleBack}
                    aria-label="Kembali ke halaman sebelumnya"
                    title="Kembali"
                    className="flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border-2 hover:opacity-90 transition-all active:translate-y-0.5 bg-[var(--bg-card,#FFFFFF)] border-[var(--border-color,#134E4A)] text-[var(--text-main,#134E4A)] shadow-[1.5px_1.5px_0px_var(--shadow-color,#134E4A)] shrink-0 cursor-pointer"
                  >
                    <ChevronLeftSvg size={20} />
                  </button>
                )}
                {title === "Tartila" && (
                  <TartilaFaviconSvg variant="sticker" size={44} />
                )}
                <span
                  className={`font-display font-black text-xl md:text-2xl tracking-tight truncate max-w-[160px] sm:max-w-[220px] md:max-w-none text-[var(--text-main,#134E4A)] ${title === "Tartila" ? "max-sm:hidden" : ""}`}
                >
                  {title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {rightAction}
                <NotificationBell
                  userRole={userRole}
                  className="relative z-10 shrink-0"
                />
              </div>
            </div>

            {/* BARIS 2: Deretan badge ringkas (Hati, Tiket, XP, Koin) - Streak dihapus sesuai standarisasi */}
            {!isUstadzAccount && (
              <div className="mt-1 flex w-full flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar pb-1.5">
                <div
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] font-black text-xs sm:text-sm border-2 whitespace-nowrap select-none ${isDarkTheme ? "bg-[#1E2937]" : "bg-[#FFF0F0]"} text-[var(--text-main,#134E4A)] border-[var(--border-color,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]`}
                  title={
                    isUnlimited
                      ? "Hati Tanpa Batas (Superadmin/VIP)"
                      : `Hati: ${hearts}/5`
                  }
                >
                  <JuicyHeart size={18} value={hearts} />
                  <span className="min-w-[1.9rem] text-center tabular-nums">
                    {isUnlimited ? "∞" : <AnimatedCounter value={hearts} duration={0.4} />}
                  </span>
                </div>

                <div
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] font-black text-xs sm:text-sm border-2 whitespace-nowrap select-none ${isDarkTheme ? "bg-[#1E2937]" : "bg-[#FEF3C7]"} text-[var(--text-main,#134E4A)] border-[var(--border-color,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]`}
                  title={
                    isUnlimited
                      ? "Tiket Game Tanpa Batas (Superadmin/VIP)"
                      : `Tiket: ${tickets}/3`
                  }
                >
                  <TicketSvg size={18} />
                  <span className="min-w-[1.9rem] text-center tabular-nums">
                    {isUnlimited ? "∞" : `${tickets}/3`}
                  </span>
                </div>

                <div
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] font-black text-xs sm:text-sm border-2 whitespace-nowrap select-none ${isDarkTheme ? "bg-[#1E2937]" : "bg-[#CCFBF1]"} text-[var(--text-main,#134E4A)] border-[var(--border-color,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]`}
                  title={`Peringkat: ${rank.title} (${progress.xp} XP)`}
                >
                  <JuicyStar size={18} />
                  <span className="min-w-[3rem] text-center tabular-nums">
                    <AnimatedCounter value={progress.xp} /> XP
                  </span>
                </div>

                <div
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] font-black text-xs sm:text-sm border-2 whitespace-nowrap select-none ${isDarkTheme ? "bg-[#1E2937]" : "bg-[#FEF08A]"} text-[var(--text-main,#134E4A)] border-[var(--border-color,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]`}
                  title={`Koin: ${currentCoins}`}
                >
                  <JuicyCoin size={18} value={currentCoins} />
                  <span className="min-w-[2.1rem] text-center tabular-nums">
                    <AnimatedCounter value={currentCoins} />
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      <main
        id="main-scroll-container"
        className={`flex-1 min-h-0 w-full relative ${
          hideNav
            ? "max-w-none h-full overflow-hidden pb-0"
            : hideHeader
              ? "max-w-none h-full w-full pb-0"
              : isMainTab
                ? "max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-6 pb-28 min-h-[50vh]"
                : "max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-6 pb-10 min-h-[50vh]"
        }`}
      >
        {hideNav ? (
          <Suspense fallback={<PageContentFallback />}>{children}</Suspense>
        ) : (
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full relative min-h-[50vh]"
          >
            <Suspense fallback={<PageContentFallback />}>{children}</Suspense>
          </motion.div>
        )}
      </main>

      {!hideNav && isMainTab && <NgajiCeriaBottomNav />}
      {!hideNav && !isUstadzAccount && <RewardChestModal />}
      {!hideNav && !isUstadzAccount && <ProgressionNotice />}

      <div data-tila-companion>
        <TilaCompanion size={110} autoRoam reactiveSpeech pageTip={pageTip} />
      </div>
    </div>
  );
}
