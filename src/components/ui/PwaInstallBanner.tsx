import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DownloadSvg } from "./CustomIcons";
import { StickerButton } from "./StickerButton";
import {
  dismissBanner,
  subscribePwaInstall,
  triggerInstall,
} from "@/lib/pwaInstall";

const BOTTOM_NAV_ROUTES = [
  "/member/ngaji-ceria",
  "/member/ngaji-ceria/map",
  "/member/ngaji-ceria/games",
  "/member/ngaji-ceria/profile",
];

function hasBottomNav(pathname: string): boolean {
  return BOTTOM_NAV_ROUTES.includes(pathname);
}

export function PwaInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    return subscribePwaInstall(setIsVisible);
  }, []);

  const handleInstall = () => {
    triggerInstall();
  };

  const handleClose = () => {
    setIsVisible(false);
    dismissBanner();
  };

  if (!isVisible) return null;

  const hasNav = hasBottomNav(location.pathname);

  return (
    <div
      className={`fixed z-[100] md:hidden transition-all duration-300 ${
        hasNav
          ? "bottom-[95px] left-1/2 -translate-x-1/2 w-[85%] max-w-[320px]"
          : "bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[320px]"
      }`}
    >
      <div className="relative flex w-full items-center gap-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-3 shadow-[4px_4px_0px_#134E4A]">
        <button
          type="button"
          aria-label="Tutup banner pemasangan"
          onClick={handleClose}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#134E4A] bg-[#FF6B6B] text-[10px] font-black leading-none text-white shadow-[2px_2px_0px_#134E4A]"
        >
          ×
        </button>

        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#F0FDF4]">
          <img
            src="/icon.svg"
            alt="Logo Tartila"
            className="h-6 w-6 object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap text-sm font-black leading-snug text-[#134E4A]">
            Pasang Tartila
          </p>
          <p className="mt-0.5 whitespace-nowrap text-xs font-bold leading-snug text-[#134E4A] opacity-70">
            Akses cepat &amp; ringan
          </p>
        </div>

        <StickerButton variant="primary" size="sm" onClick={handleInstall}>
          <span className="flex items-center gap-1">
            <DownloadSvg size={12} />
            Pasang
          </span>
        </StickerButton>
      </div>
    </div>
  );
}
