import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftSvg, Pause, Volume2, VolumeX, TrophySvg, XSvg } from "@/components/ui/CustomIcons";
import { PauseOverlay } from "./PauseOverlay";
import { useGameAudio } from "./audio";
import { useGameExit } from "./hooks";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { stopGameAudio } from "./gameAudio";
import { soundManager, type BgmTrack } from "../../../services/soundManager";
import { GameTutorialModal } from "../../../components/GameTutorialModal";
import { canonicalGameId } from "../../../data/gameAccess";
import { LeaderboardList } from "@/components/ui/LeaderboardList";
import "./games.css";
import type { GameAccent, GamePhase } from "./types";

export function GameShell({
  title,
  phase,
  onPause,
  onResume,
  accent,
  tutorialGameId,
  children,
}: {
  title: string;
  phase: GamePhase;
  onPause: () => void;
  onResume: () => void;
  accent: GameAccent;
  tutorialGameId?: string;
  children: ReactNode;
}) {
  const controlBtnStyle =
    "pointer-events-auto flex items-center justify-center gap-1 h-10 w-10 min-h-[40px] min-w-[40px] rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] text-xs font-black text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 cursor-pointer";
  const exit = useGameExit();
  const { muted, toggle } = useGameAudio();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const currentGameId =
    tutorialGameId ||
    canonicalGameId(
      typeof window !== "undefined"
        ? window.location.pathname.split("/").pop() || "game"
        : "game",
    );

  useEffect(() => {
    const track: BgmTrack =
      title.toLowerCase().includes("battle") ||
      title.toLowerCase().includes("dungeon")
        ? "battle"
        : "quiz";
    soundManager.playBgm(track, 0.18);
    return () => soundManager.stopBgm();
  }, [title]);

  useEffect(() => {
    soundManager.preload([
      "tap",
      "correct",
      "wrong",
      "streak",
      "victory",
      "defeat",
    ]);
    const handleTap = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(
          "button:not(:disabled), [role='button']:not([aria-disabled='true'])",
        )
      )
        soundManager.playSfx("tap", 0.55);
    };
    document.addEventListener("pointerdown", handleTap, { passive: true });
    return () => document.removeEventListener("pointerdown", handleTap);
  }, []);

  // Hentikan pelafalan otomatis saat dijeda, non-playing, atau keluar dari game.
  useEffect(() => {
    if (phase !== "playing") stopGameAudio();
  }, [phase]);

  useEffect(() => stopGameAudio, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && phase === "playing") onPause();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (phase === "playing") onPause();
        else if (phase === "paused") onResume();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("keydown", handleKey);
    };
  }, [phase, onPause, onResume]);

  return (
    <div
      className="h-[100dvh] w-full flex flex-col bg-[var(--bg-app,#F0FDF4)] text-[var(--text-main,#134E4A)] overflow-hidden pt-safe pb-safe"
    >
      {/* HEADER GAME (Back, Judul, Pause) */}
      <header
        className="shrink-0 sticky top-0 z-50 flex items-center justify-between gap-2 px-3 pt-2 pb-2 bg-[var(--bg-card,#FFFFFF)] border-b-[3px] border-[var(--border-color,#134E4A)] shadow-[0px_2px_0px_var(--shadow-color,#134E4A)] text-[var(--text-main,#134E4A)]"
      >
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={exit}
            aria-label="Keluar dari game"
            className={controlBtnStyle}
          >
            <ChevronLeftSvg size={18} />
          </button>
          <span className="font-display truncate text-sm font-black text-[var(--text-main,#134E4A)]">
            {title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (phase === "playing") onPause();
              setIsLeaderboardOpen(true);
            }}
            aria-label="Lihat Papan Skor"
            className={controlBtnStyle}
            title="Papan Skor"
          >
            <TrophySvg size={14} className="text-[#D97706]" />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
            className={controlBtnStyle}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          {(phase === "playing" || phase === "paused") && (
            <button
              type="button"
              onClick={onPause}
              aria-label="Jeda permainan"
              className={controlBtnStyle}
            >
              <Pause size={14} />
            </button>
          )}
        </div>
      </header>

      {/* AREA KONTEN: memenuhi sisa layar, game live fullscreen */}
      <main className="flex-1 w-full relative flex flex-col min-h-0">
        {children}
      </main>

      {tutorialGameId && <GameTutorialModal gameId={tutorialGameId} />}

      <PauseOverlay
        visible={phase === "paused"}
        onResume={onResume}
        onExit={exit}
      />

      <AnimatePresence>
        {isLeaderboardOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] p-4 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] sm:rounded-2xl text-[var(--text-main,#134E4A)]"
            >
              <div className="flex items-center justify-between border-b-2 border-[var(--border-color,#134E4A)]/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[#FEF08A] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]">
                    <TrophySvg size={18} className="text-[#B45309]" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-black text-[var(--text-main,#134E4A)]">
                      Papan Skor {title}
                    </h3>
                    <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/60">
                      Peringkat Pemain Terbaik
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeaderboardOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px]"
                  title="Tutup"
                >
                  <XSvg size={16} />
                </button>
              </div>

              <div className="mt-3">
                <LeaderboardList
                  gameId={currentGameId}
                  title={`Papan Skor ${title}`}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsLeaderboardOpen(false)}
                  className="rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-4 py-2 text-xs font-black text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px]"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
