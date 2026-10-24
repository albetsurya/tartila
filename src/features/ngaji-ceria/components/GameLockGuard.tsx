import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { LockSvg, WrenchSvg } from "@/components/ui/CustomIcons";
import { NgajiCeriaLayout } from "./NgajiCeriaLayout";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { isGameOpen, tierForRole, type AccessTier } from "../data/gameAccess";
import { LoginPromptModal } from "./LoginPromptModal";
import { isAdminRole } from "@/lib/roles";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { useActiveGames } from "../hooks/useActiveGames";

export function useGameAccess(routeId: string): { tier: AccessTier; isSuperAdmin: boolean; isLoggedIn: boolean; isOpen: boolean } {
  const { user } = useAuth();
  const tier = tierForRole(user?.role);
  return { tier, isSuperAdmin: tier === "superadmin", isLoggedIn: tier !== "guest", isOpen: isGameOpen(routeId, tier) };
}

export function useJilidAccess(jilidId: number): { tier: AccessTier; isLoggedIn: boolean; isOpen: boolean; isComingSoon: boolean } {
  const { user } = useAuth();
  const tier = tierForRole(user?.role);
  const comingSoon = jilidId >= 6;
  return {
    tier,
    isLoggedIn: tier !== "guest",
    isComingSoon: comingSoon,
    isOpen: !comingSoon && (tier !== "guest" || jilidId <= 2),
  };
}

/**
 * Penjaga akses game: member/superadmin lolos ke semua game,
 * tamu hanya ke game yang terbuka, sisanya melihat layar kunci + ajakan masuk.
 */
export function GameLockGuard({ gameId, title, children }: { gameId: string; title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, isLoggedIn } = useGameAccess(gameId);
  const { isGameActive, hasLoaded } = useActiveGames();
  const [promptOpen, setPromptOpen] = useState(false);

  const isAdmin = isAdminRole(user?.role);
  const active = isGameActive(gameId);

  // Jika game sedang dinonaktifkan oleh Admin (status pemeliharaan)
  if (hasLoaded && !active && !isAdmin) {
    return (
      <NgajiCeriaLayout title={title} showBack onBack={() => navigate("/member/ngaji-ceria/games")}>
        <div data-testid="game-maintenance" className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
          <TilaMascot size={110} mood="idle" animation="bounce" direction="front" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-black text-amber-800 dark:text-amber-200">
            <WrenchSvg size={14} /> Sedang Pemeliharaan
          </span>
          <h2 className="font-display text-xl font-black text-[#134e4a]">
            Game Sedang Istirahat Dulu Ya!
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-[#134e4a]/75">
            Ustadz dan tim sedang merapikan game <strong>{title}</strong> agar makin seru dimainkan. Yuk coba game asyik lainnya!
          </p>
          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria/games")}
            className="game-button mt-4 bg-[#0D9488] text-white shadow-md hover:bg-[#0f766e]"
          >
            Pilih Game Lain
          </button>
        </div>
      </NgajiCeriaLayout>
    );
  }

  // Jika admin mengakses game yang sedang non-aktif, beri banner indikator
  const adminMaintenanceBanner = hasLoaded && !active && isAdmin ? (
    <div className="bg-amber-500 text-white text-xs py-1 px-3 text-center font-bold tracking-wide">
      Mode Admin: Game ini sedang berstatus Non-aktif (Pemeliharaan) untuk santri
    </div>
  ) : null;

  if (isOpen) {
    return (
      <>
        {adminMaintenanceBanner}
        {children}
      </>
    );
  }

  return (
    <NgajiCeriaLayout title={title} showBack onBack={() => navigate("/member/ngaji-ceria/games")}>
      {adminMaintenanceBanner}
      <div data-testid="game-locked" className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <img src={NGAJI_CERIA_ASSETS.iconGames} alt="" aria-hidden="true" draggable={false} className="h-20 w-20 object-contain opacity-60 grayscale" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#134e4a] px-3 py-1 text-xs font-black text-white"><LockSvg size={13} /> Masuk untuk Akses Penuh</span>
        <h2 className="font-display text-xl font-black text-[#134e4a]">{title}</h2>
        <p className="max-w-xs text-sm leading-relaxed text-[#134e4a]/70">
          {isLoggedIn
            ? "Game ini belum tersedia untuk akunmu."
            : "Masuk untuk membuka game ini. Tamu hanya dapat memainkan game Hijaiyah Pop sebagai uji coba."}
        </p>
        {!isLoggedIn && <button type="button" onClick={() => setPromptOpen(true)} className="game-button mt-2 bg-[#0D9488]">Masuk untuk Akses Penuh</button>}
        <button type="button" onClick={() => navigate("/member/ngaji-ceria/games")} className="game-button mt-2 border border-gray-100 bg-white text-[#134e4a]">Pilih Game Lain</button>
      </div>
      <LoginPromptModal open={promptOpen} onClose={() => setPromptOpen(false)} />
    </NgajiCeriaLayout>
  );
}
