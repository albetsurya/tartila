import React, { ReactNode, useEffect, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaBottomNav } from "./NgajiCeriaBottomNav";
import { RewardChestModal } from "./RewardChestModal";
import { OutOfEnergyModal } from "./OutOfEnergyModal";
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
  MedalSvg,
} from "../../../components/ui/CustomIcons"; // <-- Tambah MedalSvg
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

export type HeaderBadgeKind = "heart" | "ticket" | "xp" | "coin";

export function getHeaderBadgesForPath(pathname: string): HeaderBadgeKind[] {
  const path = pathname.replace(/\/$/, "");

  // Halaman Utama Beranda: Sembunyikan XP (ada di hero section)
  if (path === "/member/ngaji-ceria" || path === "/member/ngaji-ceria/") {
    return ["heart", "ticket", "coin"];
  }

  // Warung Santri: Koin -> Hati -> Tiket -> XP
  if (path.includes("/warung-santri") || path.includes("/warung")) {
    return ["coin", "heart", "ticket", "xp"];
  }

  // Kelas Saya (akademik/belajar): Hati
  if (
    path.startsWith("/member/ngaji-ceria/kelas") ||
    path.startsWith("/member/ngaji-ceria/kelas/")
  ) {
    return ["heart", "coin", "xp"];
  }

  // Quiz Hub (tanpa Hati, dengan XP)
  if (path.startsWith("/quiz-hub") || path.includes("/quiz-hub")) {
    return ["ticket", "coin", "xp"];
  }

  // Quiz lain (tanpa Arena, tidak perlu XP)
  if (path.includes("/quiz")) {
    return ["ticket", "coin"];
  }

  // Arena (tanpa Hati, dengan XP)
  if (path.startsWith("/arena") || path.includes("/arena")) {
    return ["ticket", "coin", "xp"];
  }

  // Profile / Kamar: Koin -> XP -> Hati -> Tiket
  if (path.includes("/profile") || path.includes("/kamar")) {
    return ["coin", "xp", "heart", "ticket"];
  }

  // Halaman Games (/games/*): Tiket -> Koin -> XP (sembunyikan Hati untuk fokus bermain)
  if (
    path.startsWith("/games/") ||
    path.startsWith("/member/ngaji-ceria/games/")
  ) {
    return ["ticket", "coin", "xp"];
  }

  // HUB Jelajah (/explore/*): Hati -> Koin (sembunyikan Tiket & XP untuk fokus belajar)
  if (
    path.startsWith("/explore") ||
    path.includes("/explore") ||
    path.includes("/training") ||
    path.includes("/rhythm-memory") ||
    path.includes("/arena-kartu") ||
    path.includes("/path") ||
    path.includes("/lab-irama")
  ) {
    return ["heart", "coin"];
  }

  // Halaman Utama lain (/member/ngaji-ceria, /map, /games): Tampilkan FULL.
  // Urutan: Hati -> Tiket -> XP -> Koin
  return ["heart", "ticket", "xp", "coin"];
}

interface NgajiCeriaLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  hideNav?: boolean;
  hideHeader?: boolean;
  hideMascot?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  parentPath?: string;
  rightAction?: ReactNode;
  pageTip?: PageTipConfig;
  themeScope?: ThemeScope;
  immersiveRealm?: ImmersiveRealm;
  hideBadges?: boolean;
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
  hideBadges = false,
  onBack,
  parentPath,
  rightAction,
  pageTip,
  themeScope = "global",
  immersiveRealm,
  hideMascot = false,
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
  const outOfEnergyKind = useEconomyStore((s) => s.outOfEnergyKind);
  const clearOutOfEnergy = useEconomyStore((s) => s.clearOutOfEnergy);
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
        <header className="sticky top-0 z-[60] shrink-0 border-b border-[#134E4A]/15 bg-white/95 dark:bg-[#1E2937]/95 pt-safe text-[#134E4A] dark:text-white shadow-[0_2px_8px_rgba(19,78,74,0.05)] backdrop-blur-md transition-colors duration-200">
          <div className="relative z-10 mx-auto w-full max-w-md px-3 sm:max-w-3xl sm:px-6 lg:max-w-5xl">
            {/* SINGLE ROW: Back, Title, Badges, Notification */}
            <div className="flex min-h-12 items-center justify-between gap-2 py-1.5">
              {/* KIRI: Tombol Back & Judul */}
              <div className="flex min-w-0 shrink items-center gap-2">
                {showBackButton && (
                  <button
                    type="button"
                    onClick={handleBack}
                    aria-label="Kembali ke halaman sebelumnya"
                    title="Kembali"
                    className="flex h-8 w-8 min-h-[32px] min-w-[32px] shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-[#134E4A] bg-white dark:bg-[#1E2937] text-[#134E4A] dark:text-white shadow-[2px_2px_0px_#134E4A] transition-transform hover:opacity-90 active:translate-y-0.5"
                  >
                    <ChevronLeftSvg size={18} />
                  </button>
                )}
                {title === "Tartila" && (
                  <TartilaFaviconSvg variant="sticker" size={32} />
                )}
                <span
                  className={`max-w-[120px] truncate font-display text-base font-black tracking-tight text-[#134E4A] dark:text-white sm:max-w-[200px] sm:text-lg ${title === "Tartila" ? "max-sm:hidden" : ""}`}
                >
                  {title}
                </span>
              </div>

              {/* KANAN: Badges & Notifikasi */}
              <div className="flex shrink-0 items-center gap-1.5">
                {/* Render Badges */}
                {!hideBadges && !isUstadzAccount && (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {getHeaderBadgesForPath(location.pathname).map((badge) => {
                      if (badge === "heart") {
                        return (
                          <div
                            key="badge-heart"
                            className={`inline-flex h-8 select-none items-center gap-1 rounded-full border-2 border-[#134E4A] px-2 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] whitespace-nowrap ${
                              isDarkTheme
                                ? "bg-[#1E2937] text-white"
                                : "bg-[#FFF0F0] text-[#134E4A]"
                            }`}
                            title={
                              isUnlimited
                                ? "Hati Tanpa Batas (Superadmin/VIP)"
                                : `Hati: ${hearts}/5`
                            }
                          >
                            <JuicyHeart size={14} value={hearts} />
                            <span className="min-w-[1rem] text-center tabular-nums">
                              {isUnlimited ? (
                                "∞"
                              ) : (
                                <AnimatedCounter
                                  value={hearts}
                                  duration={0.4}
                                />
                              )}
                            </span>
                          </div>
                        );
                      }

                      if (badge === "ticket") {
                        return (
                          <div
                            key="badge-ticket"
                            className={`inline-flex h-8 select-none items-center gap-1 rounded-full border-2 border-[#134E4A] px-2 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] whitespace-nowrap ${
                              isDarkTheme
                                ? "bg-[#1E2937] text-white"
                                : "bg-[#FEF3C7] text-[#134E4A]"
                            }`}
                            title={
                              isUnlimited
                                ? "Tiket Game Tanpa Batas (Superadmin/VIP)"
                                : `Tiket: ${tickets}/3`
                            }
                          >
                            <TicketSvg size={14} />
                            <span className="min-w-[1.2rem] text-center tabular-nums">
                              {isUnlimited ? "∞" : `${tickets}/3`}
                            </span>
                          </div>
                        );
                      }

                      if (badge === "xp") {
                        return (
                          <div
                            key="badge-xp"
                            className={`inline-flex h-8 select-none items-center gap-1 rounded-full border-2 border-[#134E4A] px-2 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] whitespace-nowrap ${
                              isDarkTheme
                                ? "bg-[#1E2937] text-white"
                                : "bg-[#CCFBF1] text-[#134E4A]"
                            }`}
                            title={`Peringkat: ${rank.title} (${progress.xp} XP)`}
                          >
                            <MedalSvg size={14} className="text-[#0D9488]" />
                            <span className="min-w-[2rem] text-center tabular-nums">
                              <AnimatedCounter value={progress.xp} /> XP
                            </span>
                          </div>
                        );
                      }

                      if (badge === "coin") {
                        return (
                          <div
                            key="badge-coin"
                            className={`inline-flex h-8 select-none items-center gap-1 rounded-full border-2 border-[#134E4A] px-2 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] whitespace-nowrap ${
                              isDarkTheme
                                ? "bg-[#1E2937] text-white"
                                : "bg-[#FEF08A] text-[#134E4A]"
                            }`}
                            title={`Koin: ${currentCoins}`}
                          >
                            <JuicyCoin size={14} value={currentCoins} />
                            <span className="min-w-[1.2rem] text-center tabular-nums">
                              <AnimatedCounter value={currentCoins} />
                            </span>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}

                {isMainTab && (
                  <NotificationBell
                    userRole={userRole}
                    className="relative z-10 shrink-0 ml-0.5"
                  />
                )}
              </div>
            </div>
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
      <OutOfEnergyModal
        visible={Boolean(outOfEnergyKind)}
        type={outOfEnergyKind || "heart"}
        onClose={clearOutOfEnergy}
      />

      {!hideMascot && (
        <div data-tila-companion>
          <TilaCompanion size={110} autoRoam reactiveSpeech pageTip={pageTip} />
        </div>
      )}
    </div>
  );
}
