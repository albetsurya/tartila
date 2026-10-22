import React, { ReactNode, useEffect, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaBottomNav } from "./NgajiCeriaBottomNav";
import { EconomyHUD } from "./EconomyHUD";
import { RewardChestModal } from "./RewardChestModal";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
import { useEconomyStore, isUnlimitedUser } from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { getRank, useNgajiProgress } from "../pages/games/_shared/progression";
import { ProgressionNotice } from "./ProgressionNotice";
import { soundManager } from "../services/soundManager";
import {
  TilaCompanion,
  type PageTipConfig,
} from "../../../components/ui/TilaCompanion";
import { TartilaFaviconSvg } from "../../../components/ui/TartilaLogo";
import {
  HeartSvg,
  TicketSvg,
  FireSvg,
  StarSvg,
  CoinSvg,
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

  const userRole: NotificationRole =
    (user?.role || "").toUpperCase() === "SUPER_ADMIN" ||
    (user as any)?.tier === "superadmin"
      ? "superadmin"
      : (user?.role || "").toUpperCase() === "ADMIN" ||
        (user?.role || "").toLowerCase() === "tartila_admin"
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
        <header className="sticky top-0 z-40 shrink-0 pt-safe bg-white border-b-2 border-[#134E4A] shadow-[0px_2px_0px_#134E4A] transition-all">
          {/* Container utama header responsif (Mobile, Tablet, Desktop) */}
          <div className="relative z-10 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
            {/* KIRI: Tombol Back & Judul */}
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
                <TartilaFaviconSvg variant="sticker" size={38} />
              )}
              <span className="font-display font-black text-sm md:text-base text-[#134E4A] tracking-tight truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                {title}
              </span>
            </div>

            {/* KANAN: Stats (Neo-Brutalism dengan ukuran ikon seragam 16px) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
              {/* Nyawa */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF0F0] text-[#134E4A] border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] font-black text-[11px] whitespace-nowrap select-none"
                title={isUnlimited ? "Hati Tanpa Batas (Superadmin/VIP)" : `Hati: ${hearts}/5`}
              >
                <HeartSvg size={16} />
                <span className={isUnlimited ? "text-xs font-black" : ""}>
                  {isUnlimited ? "∞" : `${hearts}/5`}
                </span>
              </div>

              {/* Ticket / Energy */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#134E4A] border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] font-black text-[11px] whitespace-nowrap select-none"
                title={isUnlimited ? "Tiket Game Tanpa Batas (Superadmin/VIP)" : `Tiket: ${tickets}/3`}
              >
                <TicketSvg size={16} />
                <span className={isUnlimited ? "text-xs font-black" : ""}>
                  {isUnlimited ? "∞" : `${tickets}/3`}
                </span>
              </div>

              {/* Streak */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF0F0] text-[#134E4A] border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] font-black text-[11px] whitespace-nowrap select-none"
                title={`Streak: ${currentStreak} hari`}
              >
                <FireSvg size={16} />
                <span>{currentStreak}d</span>
              </div>

              {/* XP */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#134E4A] border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] font-black text-[11px] whitespace-nowrap select-none"
                title={`Peringkat: ${rank.title} (${progress.xp} XP)`}
              >
                <StarSvg size={16} />
                <span>{progress.xp} XP</span>
              </div>

              {/* Koin */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF08A] text-[#134E4A] border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] font-black text-[11px] whitespace-nowrap select-none"
                title={`Koin: ${progress.coins || 0}`}
              >
                <CoinSvg size={16} />
                <span>{progress.coins || 0}</span>
              </div>

              {rightAction}

              <NotificationBell userRole={userRole} className="ml-0.5 shrink-0" />
            </div>
          </div>
        </header>
      )}

      <main
        className={`flex-1 min-h-0 w-full relative ${hideNav ? "max-w-none h-full overflow-hidden pb-0" : isMainTab ? "max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-6 pb-28 min-h-[50vh]" : "max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-2 sm:px-4 md:px-6 pb-10 min-h-[50vh]"}`}
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
      {!hideNav && <RewardChestModal />}
      <ProgressionNotice />

      <div data-tila-companion>
        <TilaCompanion size={110} autoRoam reactiveSpeech pageTip={pageTip} />
      </div>
    </div>
  );
}
