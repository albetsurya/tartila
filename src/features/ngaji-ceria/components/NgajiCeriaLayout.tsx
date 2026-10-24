import React, { ReactNode, useEffect, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaBottomNav } from "./NgajiCeriaBottomNav";
import { RewardChestModal } from "./RewardChestModal";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
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
  FireSvg,
  StarSvg,
  CoinSvg,
  HeartSvg,
  TicketSvg,
  ChevronLeftSvg,
} from "../../../components/ui/CustomIcons";
import { NotificationBell } from "../../../components/ui/NotificationBell";
import type { NotificationRole } from "@/services/notificationService";

export type { PageTipConfig };

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
  rightAction?: ReactNode;
  pageTip?: PageTipConfig;
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
  rightAction,
  pageTip,
}: NgajiCeriaLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainTab = MAIN_TABS.includes(location.pathname.replace(/\/$/, ""));
  const { currentStreak } = useNgajiCeriaStreak();
  const progress = useNgajiProgress();
  const rank = getRank(progress.xp);

  const { user, groupId } = useAuth();
  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const syncTime = useEconomyStore((s) => s.syncTime);

  useEffect(() => {
    syncTime();
  }, [syncTime]);

  const isUnlimited = isUnlimitedUser(user, isVip, groupId);
  const isUstadzAccount = user && isUstadzUser(user);

  const tier = (user as { tier?: string } | null)?.tier;
  const userRole: NotificationRole =
    normalizeRole(user?.role) === "superadmin" || tier === "superadmin"
      ? "superadmin"
      : normalizeRole(user?.role) === "admin"
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
    if (window.history.length > 1) navigate(-1);
    else navigate("/member/ngaji-ceria");
  };

  return (
    <div
      className={`${hideNav ? "h-dvh min-h-dvh overflow-hidden" : "min-h-screen"} bg-mint-cloud text-deep-teal flex flex-col justify-between selection:bg-teal-emerald/20 relative overflow-x-clip font-sans`}
    >
      {!hideHeader && !hideNav && (
        <header className="sticky top-0 z-[60] shrink-0 pt-safe bg-white border-b-2 border-[#134E4A] shadow-[0px_2px_0px_#134E4A] transition-all">
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
                    className="p-1.5 rounded-xl bg-white border-2 border-[#134E4A] text-[#134E4A] flex items-center justify-center hover:bg-[#FEF08A] transition-all active:translate-y-0.5 shadow-[1.5px_1.5px_0px_#134E4A]"
                  >
                    <ChevronLeftSvg size={16} />
                  </button>
                )}
                {title === "Tartila" && (
                  <TartilaFaviconSvg variant="sticker" size={44} />
                )}
                <span
                  className={`font-display font-black text-xl md:text-2xl text-[#134E4A] tracking-tight truncate max-w-[160px] sm:max-w-[220px] md:max-w-none ${
                    title === "Tartila" ? "max-sm:hidden" : ""
                  }`}
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

            {/* BARIS 2: Deretan badge ringkas (Hati, Tiket, Streak, XP, Koin) */}
            {!isUstadzAccount && (
              <div className="mt-1 flex w-full flex-nowrap items-center gap-1.5 overflow-x-auto no-scrollbar pb-1.5">
                <div
                  className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFF0F0] px-2 py-1 text-[#134E4A] font-black text-[10px] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] whitespace-nowrap select-none"
                  title={
                    isUnlimited
                      ? "Hati Tanpa Batas (Superadmin/VIP)"
                      : `Hati: ${hearts}/5`
                  }
                >
                  <HeartSvg size={14} />
                  <span className="min-w-[1.9rem] text-center tabular-nums">
                    {isUnlimited ? "∞" : `${hearts}/5`}
                  </span>
                </div>

                <div
                  className="flex shrink-0 items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-1 text-[#134E4A] font-black text-[10px] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] whitespace-nowrap select-none"
                  title={
                    isUnlimited
                      ? "Tiket Game Tanpa Batas (Superadmin/VIP)"
                      : `Tiket: ${tickets}/3`
                  }
                >
                  <TicketSvg size={14} />
                  <span className="min-w-[1.9rem] text-center tabular-nums">
                    {isUnlimited ? "∞" : `${tickets}/3`}
                  </span>
                </div>

                <div
                  className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFF0F0] px-2 py-1 text-[#134E4A] font-black text-[10px] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] whitespace-nowrap select-none"
                  title={`Streak: ${currentStreak} hari`}
                >
                  <FireSvg size={14} />
                  <span className="min-w-[2.1rem] text-center tabular-nums">
                    {currentStreak}d
                  </span>
                </div>

                <div
                  className="flex shrink-0 items-center gap-1 rounded-full bg-[#CCFBF1] px-2 py-1 text-[#134E4A] font-black text-[10px] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] whitespace-nowrap select-none"
                  title={`Peringkat: ${rank.title} (${progress.xp} XP)`}
                >
                  <StarSvg size={14} />
                  <span className="min-w-[3rem] text-center tabular-nums">
                    {progress.xp} XP
                  </span>
                </div>

                <div
                  className="flex shrink-0 items-center gap-1 rounded-full bg-[#FEF08A] px-2 py-1 text-[#134E4A] font-black text-[10px] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] whitespace-nowrap select-none"
                  title={`Koin: ${progress.coins || 0}`}
                >
                  <CoinSvg size={14} />
                  <span className="min-w-[2.1rem] text-center tabular-nums">
                    {progress.coins || 0}
                  </span>
                </div>
              </div>
                        )}
          </div>
        </header>
      )}

      <main
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full relative min-h-[50vh]"
          >
            <Suspense fallback={<PageContentFallback />}>{children}</Suspense>
          </motion.div>
        )}
      </main>

      {!hideNav && isMainTab && <NgajiCeriaBottomNav />}
      {!hideNav && !isUstadzAccount && <RewardChestModal />}
      {!hideNav && !isUstadzAccount && <ProgressionNotice />}

      {!location.pathname.startsWith("/ustadz") && (
        <div data-tila-companion>
          <TilaCompanion size={110} autoRoam reactiveSpeech pageTip={pageTip} />
        </div>
      )}
    </div>
  );
}
