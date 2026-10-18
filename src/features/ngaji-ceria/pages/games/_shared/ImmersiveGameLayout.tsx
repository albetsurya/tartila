import { useEffect, type ReactNode } from "react";
import { Pause, Volume2, VolumeX, X } from "@/components/ui/FontAwesomeIcons";
import { NgajiCeriaLayout } from "../../../components/NgajiCeriaLayout";
import { PauseOverlay } from "./PauseOverlay";
import { useGameAudio } from "./audio";
import { useGameExit } from "./hooks";
import { ACCENTS, type GameAccent, type GamePhase } from "./types";
import "./games.css";
import { soundManager, type BgmTrack } from "../../../services/soundManager";
import {
  useTilawatiAudio,
  type TilawatiAudioRequest,
} from "../../../services/tilawatiAudio";

export function ImmersiveGameLayout({
  title,
  phase,
  onPause,
  onResume,
  accent,
  children,
  fitViewport = false,
  recitation,
  recitationKey,
}: {
  title: string;
  phase: GamePhase;
  onPause: () => void;
  onResume: () => void;
  accent: GameAccent;
  children: ReactNode;
  fitViewport?: boolean;
  recitation?: TilawatiAudioRequest;
  recitationKey?: string;
}) {
  const exit = useGameExit();
  const { muted, toggle } = useGameAudio();

  const activeAccent = ACCENTS[accent] ||
    ACCENTS["cyan"] || { background: "bg-[#134E4A]" };

  const audio = useTilawatiAudio(
    recitation ?? {
      jilid: 1,
      pageNumber: 1,
      questionIndex: 2,
      audioUrl: "/audio/tilawati/jilid_1/hal1/hal1_isi_01.ogg",
    },
  );

  useEffect(() => {
    if (phase === "playing" && recitation && !muted) void audio.play();
    else audio.stop();
    return () => audio.stop();
  }, [
    phase,
    audio.play,
    audio.stop,
    Boolean(recitation),
    recitationKey,
    muted,
  ]);

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

  const floatingBtnStyle =
    "pointer-events-auto flex items-center justify-center gap-1.5 rounded-xl border-[2px] border-[#134E4A] bg-white/90 backdrop-blur-md px-2.5 py-1.5 text-[11px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50";

  return (
    <NgajiCeriaLayout title={title} showBack hideNav hideHeader onBack={exit}>
      {/* Container Fullscreen 100dvh tanpa flex-col agar tidak bentrok */}
      <section
        data-game-phase={phase}
        aria-label={title}
        className={`ceria-game relative h-[100dvh] w-full overflow-hidden ${activeAccent.background}`}
      >
        {/* LAYER GAME (Mengisi penuh layar) */}
        <div className="relative h-full w-full z-0">{children}</div>

        {/* FLOATING CONTROLS (Tombol Melayang) */}
        {phase !== "idle" && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between p-3 pt-[max(0.75rem,env(safe-area-inset-top))] bg-gradient-to-b from-black/40 to-transparent pb-10">
            {/* Kiri: Keluar & Judul */}
            <div className="flex min-w-0 items-center gap-2">
              <button
                onClick={exit}
                aria-label="Keluar"
                className={floatingBtnStyle}
              >
                <X size={14} />
              </button>
              <span className="truncate text-sm font-black text-white drop-shadow-md">
                {title}
              </span>
            </div>

            {/* Kanan: Audio & Pause */}
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                disabled={muted}
                onClick={() =>
                  audio.isPlaying ? audio.stop() : void audio.play()
                }
                className={floatingBtnStyle}
              >
                <Volume2 size={14} />
              </button>
              <button onClick={toggle} className={floatingBtnStyle}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              {(phase === "playing" || phase === "paused") && (
                <button onClick={onPause} className={floatingBtnStyle}>
                  <Pause size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Notifikasi Error Audio */}
        {audio.error && phase !== "idle" && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <p className="text-center text-xs font-bold text-[#FF6B6B] bg-white px-3 py-1.5 rounded-lg border-2 border-[#FF6B6B] shadow-lg">
              {audio.error}
            </p>
          </div>
        )}
      </section>

      <PauseOverlay
        visible={phase === "paused"}
        onResume={onResume}
        onExit={exit}
      />
    </NgajiCeriaLayout>
  );
}
