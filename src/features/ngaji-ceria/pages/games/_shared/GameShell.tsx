import { useEffect, type ReactNode } from "react";
import { ChevronLeftSvg, Pause, Volume2, VolumeX } from "@/components/ui/CustomIcons";
import { PauseOverlay } from "./PauseOverlay";
import { useGameAudio } from "./audio";
import { useGameExit } from "./hooks";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { stopGameAudio } from "./gameAudio";
import { soundManager, type BgmTrack } from "../../../services/soundManager";
import { GameTutorialModal } from "../../../components/GameTutorialModal";
import "./games.css";
import type { GameAccent, GamePhase } from "./types";

export type GameShellTheme = "default" | "neon" | "retro" | "pastel";

const THEME_STYLE: Record<
  GameShellTheme,
  {
    root: string;
    header: string;
    title: string;
    controlBtn: string;
  }
> = {
  default: {
    root: "bg-[#F0FDF4]",
    header: "bg-white border-b-[3px] border-[#134E4A] shadow-[0px_2px_0px_#134E4A]",
    title: "text-[#134E4A]",
    controlBtn:
      "pointer-events-auto flex items-center justify-center gap-1 h-9 w-9 rounded-xl border-2 border-[#134E4A] bg-white px-2 text-[11px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50",
  },
  neon: {
    root: "bg-[#0F172A] text-white",
    header: "bg-[#1E293B] border-b-[3px] border-[#38BDF8] shadow-[0px_2px_0px_#38BDF8]",
    title: "text-[#38BDF8]",
    controlBtn:
      "pointer-events-auto flex items-center justify-center gap-1 h-9 w-9 rounded-xl border-2 border-[#38BDF8] bg-[#0F172A] px-2 text-[11px] font-black text-[#38BDF8] shadow-[2px_2px_0px_#0EA5E9] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50",
  },
  retro: {
    root: "bg-[#FFFBEB]",
    header: "bg-[#FEF3C7] border-b-[4px] border-[#B45309]",
    title: "text-[#92400E]",
    controlBtn:
      "pointer-events-auto flex items-center justify-center gap-1 h-9 w-9 rounded-md border-[3px] border-[#B45309] bg-[#FFFBEB] px-2 text-[11px] font-black text-[#92400E] shadow-[2px_2px_0px_#B45309] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50",
  },
  pastel: {
    root: "bg-[#FDF2F8]",
    header: "bg-white border-b-[3px] border-[#EC4899] shadow-[0px_2px_0px_#F9A8D4]",
    title: "text-[#9D174D]",
    controlBtn:
      "pointer-events-auto flex items-center justify-center gap-1 h-9 w-9 rounded-full border-2 border-[#EC4899] bg-white px-2 text-[11px] font-black text-[#9D174D] shadow-[2px_2px_0px_#F9A8D4] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50",
  },
};

/**
 * Cangkang game — layout fullscreen 100dvh: header (Back/Judul/Pause) shrink-0,
 * dan <main> flex-1 memenuhi sisa layar sehingga HUD tidak menutupi arena.
 */
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
  const rawTheme = useEconomyStore((s) => s.equippedGameTheme);
  const equippedGameTheme = (rawTheme && THEME_STYLE[rawTheme as GameShellTheme]
    ? rawTheme
    : "default") as GameShellTheme;
  const styles = THEME_STYLE[equippedGameTheme] ?? THEME_STYLE["default"];
  const controlBtnStyle = styles.controlBtn;
  const exit = useGameExit();
  const { muted, toggle } = useGameAudio();

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
      className={`h-[100dvh] w-full flex flex-col ${styles.root} overflow-hidden pt-safe pb-safe`}
    >
      {/* HEADER GAME (Back, Judul, Pause) */}
      <header
        className={`shrink-0 z-40 flex items-center justify-between gap-2 px-3 pt-2 pb-2 ${styles.header}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={exit}
            aria-label="Keluar dari game"
            className={controlBtnStyle}
          >
            <ChevronLeftSvg size={14} />
          </button>
          <span className={`font-display truncate text-sm font-black ${styles.title}`}>
            {title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
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

      {/* AREA KONTEN — memenuhi sisa layar, game live fullscreen */}
      <main className="flex-1 w-full relative flex flex-col min-h-0">
        {children}
      </main>

      {tutorialGameId && <GameTutorialModal gameId={tutorialGameId} />}

      <PauseOverlay
        visible={phase === "paused"}
        onResume={onResume}
        onExit={exit}
      />
    </div>
  );
}
