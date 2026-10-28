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
import { TicketSvg, ChevronLeftSvg } from "../../../components/ui/CustomIcons";
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
  | "juz-amma"
  | "tajwid"
  | "doa"
  | "tahfidz"
  | "tilawati"
  | "arena-kartu"
  | "jurnal-ibadah"
  | "lab-irama";

export type ThemeScope = "global" | "immersive" | ImmersiveRealm;

const REALM_BG_CLASSES: Record<ImmersiveRealm, string> = {
  "juz-amma": "bg-[#1E1B4B]",
  tajwid: "bg-[#FEF9C3]",
  doa: "bg-[#FFFBEB]",
  tahfidz: "bg-[#042F2E]",
  "arena-kartu": "bg-[#065F46]",
  tilawati: "bg-[#E0F2FE]",
  "jurnal-ibadah": "bg-[#D1FAE5]",
  "lab-irama": "bg-[#F0FDF4]",
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
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#F0FDF4]/95">
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-[#134E4A]/15 bg-white/90 px-6 py-5 shadow-sm">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#0D9488]/20 border-t-[#0D9488]" />
        <span className="text-xs font-bold text-[#134E4A]/70">
          Menyiapkan petualangan...
        </span>
      </div>
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
  const equippedAppTheme =
    useEconomyStore((s) => s.equippedAppTheme) || "default";
  const storeCoins = useEconomyStore((s) => s.coins);
  const currentCoins = storeCoins > 0 ? storeCoins : progress.coins || 0;

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
    themeScope === "immersive" || isDirectRealmScope || Boolean(immersiveRealm);

  const activeThemeScopeAttr = isImmersive
    ? resolvedRealm || (themeScope !== "global" ? themeScope : "immersive")
    : undefined;

  const containerBgClass =
    isImmersive && resolvedRealm
      ? REALM_BG_CLASSES[resolvedRealm]
      : "bg-[var(--bg-app,#F0FDF4)]";

  useEffect(() => {
    syncTime();
  }, [syncTime]);

  const isDarkTheme =
    equippedAppTheme === "night" || equippedAppTheme === "neon";

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
      className={`${hideNav ? "h-dvh min-h-dvh overflow-hidden" : "min-h-screen"} ${containerBgClass} ${isImmersive ? "theme-isolated" : ""} flex relative flex-col justify-between overflow-x-clip font-sans text-[var(--text-main,#134E4A)] selection:bg-teal-emerald/20 transition-colors duration-200`}
    >
      {!hideHeader && !hideNav && (
        <header className="sticky top-0 z-[60] shrink-0 border-b border-[var(--border-color,#134E4A)]/15 bg-[var(--bg-card,#FFFFFF)]/95 pt-safe text-[var(--text-main,#134E4A)] shadow-[0_2px_8px_rgba(19,78,74,0.05)] backdrop-blur-md transition-colors duration-200">
          <div className="relative z-10 mx-auto w-full max-w-md px-3 sm:max-w-3xl sm:px-6 lg:max-w-5xl">
            <div className="flex min-h-12 items-center justify-between gap-2 py-1">
              <div className="flex min-w-0 shrink items-center gap-2">
                {showBackButton && (
                  <button
                    type="button"
                    onClick={handleBack}
                    aria-label="Kembali ke halaman sebelumnya"
                    title="Kembali"
                    className="flex h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] transition-transform hover:opacity-90 active:translate-y-0.5"
                  >
                    <ChevronLeftSvg size={20} />
                  </button>
                )}
                {title === "Tartila" && (
                  <TartilaFaviconSvg variant="sticker" size={40} />
                )}
                <span
                  className={`max-w-[160px] truncate font-display text-lg font-black tracking-tight text-[var(--text-main,#134E4A)] sm:max-w-[220px] sm:text-xl md:max-w-none ${title === "Tartila" ? "max-sm:hidden" : ""}`}
                >
                  {title}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {rightAction}
                <NotificationBell
                  userRole={userRole}
                  className="relative z-10 shrink-0"
                />
              </div>
            </div>

            {!isUstadzAccount && (
              <div className="no-scrollbar -mx-1 flex w-full flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-2 pt-0.5">
                <div
                  className={`flex min-h-[34px] shrink-0 select-none items-center gap-1.5 rounded-full border border-[var(--border-color,#134E4A)]/15 px-3 py-1.5 text-xs font-extrabold whitespace-nowrap ${isDarkTheme ? "bg-[#1E2937]" : "bg-[#FFF0F0]"}`}
                  title={
                    isUnlimited
                      ? "Hati Tanpa Batas (Superadmin/VIP)"
                      : `Hati: ${hearts}/5`
                  }
                >
                  <JuicyHeart size={17} value={hearts} />
                  <span className="min-w-[1.5rem] text-center tabular-nums">
                    {isUnlimited ? (
                      "∞"
                    ) : (
                      <AnimatedCounter value={hearts} duration={0.4} />
                    )}
                  </span>
                </div>

                <div
                  className={`flex min-h-[34px] shrink-0 select-none items-center gap-1.5 rounded-full border border-[var(--border-color,#134E4A)]/15 px-3 py-1.5 text-xs font-extrabold whitespace-nowrap ${isDarkTheme ? "bg-[#1E2937]" : "bg-[#FEF3C7]"}`}
                  title={
                    isUnlimited
                      ? "Tiket Game Tanpa Batas (Superadmin/VIP)"
                      : `Tiket: ${tickets}/3`
                  }
                >
                  <TicketSvg size={17} />
                  <span className="min-w-[1.8rem] text-center tabular-nums">
                    {isUnlimited ? "∞" : `${tickets}/3`}
                  </span>
                </div>

                <div
                  className={`flex min-h-[34px] shrink-0 select-none items-center gap-1.5 rounded-full border border-[var(--border-color,#134E4A)]/15 px-3 py-1.5 text-xs font-extrabold whitespace-nowrap ${isDarkTheme ? "bg-[#1E2937]" : "bg-[#CCFBF1]"}`}
                  title={`Peringkat: ${rank.title} (${progress.xp} XP)`}
                >
                  <JuicyStar size={17} />
                  <span className="min-w-[2.6rem] text-center tabular-nums">
                    <AnimatedCounter value={progress.xp} /> XP
                  </span>
                </div>

                <div
                  className={`flex min-h-[34px] shrink-0 select-none items-center gap-1.5 rounded-full border border-[var(--border-color,#134E4A)]/15 px-3 py-1.5 text-xs font-extrabold whitespace-nowrap ${isDarkTheme ? "bg-[#1E2937]" : "bg-[#FEF08A]"}`}
                  title={`Koin: ${currentCoins}`}
                >
                  <JuicyCoin size={17} value={currentCoins} />
                  <span className="min-w-[1.8rem] text-center tabular-nums">
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
        className={`relative min-h-0 w-full flex-1 ${
          hideNav
            ? "h-full max-w-none overflow-hidden pb-0"
            : hideHeader
              ? "h-full w-full max-w-none pb-0"
              : isMainTab
                ? "mx-auto min-h-[50vh] w-full max-w-md px-2 pb-28 sm:max-w-3xl sm:px-4 md:px-6 lg:max-w-5xl"
                : "mx-auto min-h-[50vh] w-full max-w-md px-2 pb-10 sm:max-w-3xl sm:px-4 md:px-6 lg:max-w-5xl"
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
            className="relative min-h-[50vh] w-full"
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
