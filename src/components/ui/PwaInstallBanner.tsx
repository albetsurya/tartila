import { useEffect, useState } from "react";
import { DownloadSvg } from "./CustomIcons";
import { StickerButton } from "./StickerButton";
import { dismissBanner, subscribePwaInstall, triggerInstall } from "@/lib/pwaInstall";

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

  const hasNav = hasBottomNav(window.location.pathname);

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        hasNav
          ? "bottom-[100px] left-1/2 -translate-x-1/2 max-w-md w-auto"
          : "bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md w-auto"
      }`}
    >
      <div className="bg-white border-[3px] border-[#134E4A] rounded-2xl shadow-[4px_4px_0px_#134E4A] p-3 flex items-center gap-3 relative min-w-[240px]">
        {/* Close button */}
        <button
          type="button"
          aria-label="Tutup banner pemasangan"
          onClick={handleClose}
          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-[#FF6B6B] text-white rounded-full border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] leading-none font-black text-[10px]"
        >
          ×
        </button>

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border-[3px] border-[#134E4A] flex items-center justify-center flex-shrink-0">
          <img src="/icon.svg" alt="Logo Tartila" className="w-6 h-6 object-contain" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-black text-[#134E4A] text-sm leading-snug whitespace-nowrap">
            Pasang Tartila
          </p>
          <p className="text-xs text-[#134E4A]/70 leading-snug mt-0.5 whitespace-nowrap">
            Offline &amp; cepat
          </p>
        </div>

        {/* Install button */}
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
