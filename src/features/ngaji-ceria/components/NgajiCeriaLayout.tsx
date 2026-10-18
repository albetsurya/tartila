import React, { ReactNode, useEffect, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "../../../components/ui/FontAwesomeIcons";
import { NgajiCeriaBottomNav } from "./NgajiCeriaBottomNav";
import { EconomyHUD } from "./EconomyHUD";
import { RewardChestModal } from "./RewardChestModal";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { getRank, useNgajiProgress } from "../pages/games/_shared/progression";
import { ProgressionNotice } from "./ProgressionNotice";
import { soundManager } from "../services/soundManager";
import {
  BibiCompanion,
  type PageTipConfig,
} from "../../../components/ui/BibiCompanion";

export type { PageTipConfig };

interface NgajiCeriaLayoutProps {
  children: ReactNode;
  title: ReactNode;
  hideNav?: boolean;
  hideHeader?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  pageTip?: PageTipConfig;
}

function PageContentFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#F0FDF4]">
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
  const { currentStreak } = useNgajiCeriaStreak();
  const progress = useNgajiProgress();
  const rank = getRank(progress.xp);

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
        <header className="sticky top-0 z-40 shrink-0 pt-safe bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
          <div
            className="absolute inset-0 pointer-events-none opacity-20 bg-repeat-x bg-top"
            style={{
              backgroundImage: `url(${NGAJI_CERIA_ASSETS.topBarLatar})`,
              backgroundSize: "auto 100%",
            }}
          />
          <div className="relative z-10 max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  aria-label="Kembali ke halaman sebelumnya"
                  title="Kembali"
                  className="p-2 rounded-2xl bg-white border border-gray-100 text-deep-teal flex items-center justify-center hover:bg-mint-cloud transition-all active:scale-95 shadow-sm"
                >
                  <ChevronLeft size={16} className="text-deep-teal/60" />
                </button>
              )}
              <span className="font-display font-bold text-sm sm:text-base text-deep-teal tracking-tight truncate max-w-[120px] sm:max-w-none">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <EconomyHUD />
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-coral-soft text-deep-teal border border-coral-glow/20 font-bold text-xs shadow-sm">
                <img
                  src={NGAJI_CERIA_ASSETS.apiStreak}
                  alt="Streak"
                  className="w-4 h-4 object-contain"
                />
                <span>{currentStreak}d</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-emerald/10 text-teal-emerald border border-teal-emerald/20 font-bold text-xs shadow-sm">
                <span title={rank.title}>{progress.xp} XP</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-mint-soft text-deep-teal border border-teal-emerald/15 font-bold text-xs shadow-sm">
                <img
                  src={NGAJI_CERIA_ASSETS.koinHijaiyah}
                  alt="Koin"
                  className="w-4 h-4 object-contain"
                />
                <span>{progress.coins || 0}</span>
              </div>
              {rightAction}
            </div>
          </div>
        </header>
      )}

      <main
        className={`flex-1 min-h-0 w-full relative ${hideNav ? "max-w-none h-full overflow-hidden pb-0" : "max-w-md mx-auto pb-28"}`}
      >
        <Suspense fallback={<PageContentFallback />}>{children}</Suspense>
      </main>

      {!hideNav && <NgajiCeriaBottomNav />}
      {!hideNav && <RewardChestModal />}
      <ProgressionNotice />

      <div data-bibi-companion>
        <BibiCompanion size={110} autoRoam reactiveSpeech pageTip={pageTip} />
      </div>
    </div>
  );
}
