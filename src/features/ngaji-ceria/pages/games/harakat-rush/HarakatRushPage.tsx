import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { ComboBadge } from "../_shared/ComboBadge";
import { useGameExit } from "../_shared/hooks";
import { HUD } from "./components/HUD";
import { LevelCompleteModal } from "./components/LevelCompleteModal";
import { Harakat3DScene } from "./components/Harakat3DScene";
import { letterRecitation } from "../_shared/recitation";
import { HARAKAT_LIST } from "./data/harakat-list";
import { BibiMascot, type BibiMood } from "@/components/ui/BibiMascot";
import type { GamePhase } from "../_shared/types";
import { use3DRunnerGame } from "@/features/ngaji-ceria/pages/games/harakat-rush/hooks/use3DRunnerGame";

const BIBI_SIZE = 160;
const BIBI_BOTTOM = "22%";
const LANE_LABELS = ["Kiri", "Tengah", "Kanan"] as const;

function Game() {
  const game = use3DRunnerGame();
  const exit = useGameExit();

  useEffect(() => {
    document.body.classList.toggle("game-active", game.phase !== "idle");
    return () => document.body.classList.remove("game-active");
  }, [game.phase]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (game.phase !== "playing") return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        game.moveLane(Math.max(0, game.lane - 1) as 0 | 1 | 2);
      } else if (e.key === "ArrowRight" || e.key === "d") {
        game.moveLane(Math.min(2, game.lane + 1) as 0 | 1 | 2);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [game]);

  useEffect(() => {
    const el = document.getElementById("r3d-touch");
    if (!el) return;
    let startX = 0;
    const ts = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const te = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0 && game.lane > 0) game.moveLane((game.lane - 1) as 0 | 1 | 2);
      if (dx > 0 && game.lane < 2) game.moveLane((game.lane + 1) as 0 | 1 | 2);
    };
    el.addEventListener("touchstart", ts);
    el.addEventListener("touchend", te);
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchend", te);
    };
  }, [game]);

  const shellPhase: GamePhase =
    game.phase === "playing"
      ? "playing"
      : game.phase === "paused"
        ? "paused"
        : game.phase === "idle"
          ? "idle"
          : "gameover";

  const bibiMood: BibiMood =
    game.feedback?.type === "correct"
      ? "excited"
      : game.feedback?.type === "wrong"
        ? "sad"
        : game.phase === "victory" || game.phase === "levelcomplete"
          ? "excited"
          : game.phase === "paused"
            ? "sleepy"
            : game.phase === "gameover"
              ? "sad"
              : game.phase === "playing"
                ? "excited"
                : "happy";

  const bibiSpeech =
    game.phase === "idle"
      ? "Ayo mulai!"
      : game.phase === "levelcomplete"
        ? "Hebat!"
        : game.phase === "victory"
          ? "Juara!"
          : game.phase === "paused"
            ? "Istirahat…"
            : game.phase === "gameover"
              ? "Coba lagi!"
              : game.combo >= 10
                ? "Keren!"
                : undefined;

  const lanePct = `${((game.lane + 0.5) / 3) * 100}%`;

  return (
    <GameShell
      title="Harakat Rush 3D"
      phase={shellPhase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
      tutorialGameId="harakat-rush"
      fitViewport={true}
      recitation={letterRecitation(
        HARAKAT_LIST.find((i) => i.id === game.target)?.symbol,
      )}
    >
      {game.phase === "idle" && (
        <div className="min-h-full w-full flex flex-col justify-center items-center p-4 py-8">
          <StartScreen
            title="Harakat Rush 3D"
            tagline="Terbang 3D, tangkap harakat"
            description="Geser atau pakai panah kiri/kanan untuk pindah jalur. Kumpulkan harakat target sampai target level penuh, hindari yang salah."
            coverImage={""}
            best={game.best}
            onStart={game.start}
            onExit={exit} // <-- TAMBAHKAN BARIS INI
            accent="cyan"
          />
        </div>
      )}

      {game.phase !== "idle" && (
        <div className="relative w-full h-full" id="r3d-touch">
          <div className="absolute inset-0">
            <Harakat3DScene stateRef={game.stateRef} onFrame={game.tick} />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#134E4A]/90 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#134E4A]/95 to-transparent" />

          <div className="pointer-events-none absolute inset-0 z-20">
            <AnimatePresence>
              {game.feedback && (
                <motion.div
                  key={game.feedback.id}
                  className="absolute rounded-full"
                  style={{
                    width: 90,
                    height: 90,
                    marginLeft: -45,
                    marginBottom: -45,
                    bottom: BIBI_BOTTOM,
                    left: lanePct,
                    border: `4px solid ${
                      game.feedback.type === "correct" ? "#FBBF24" : "#FF6B6B"
                    }`,
                  }}
                  initial={{ opacity: 0.95, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 2.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            <motion.div
              className="absolute"
              style={{
                width: BIBI_SIZE,
                marginLeft: -BIBI_SIZE / 2,
                bottom: BIBI_BOTTOM,
              }}
              animate={{ left: lanePct }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <motion.div
                animate={
                  game.feedback?.type === "correct"
                    ? { y: [0, -20, 0], scale: [1, 1.15, 1] }
                    : game.feedback?.type === "wrong"
                      ? {
                          x: [0, -10, 10, -6, 0],
                          rotate: [0, -6, 6, -3, 0],
                        }
                      : { y: 0, x: 0, scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <BibiMascot
                  size={BIBI_SIZE}
                  mood={bibiMood}
                  direction="back"
                  animation="fly"
                  talking={game.feedback?.type === "wrong"}
                  speech={bibiSpeech}
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-x-3 top-20 z-30">
            <HUD
              score={game.score}
              target={game.target}
              level={game.level}
              progress={game.progress}
              targetCount={game.targetCount}
              lives={game.lives}
              themeColor={game.themeColor}
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-52 z-30 flex justify-center">
            <ComboBadge
              combo={game.combo}
              multiplier={Math.min(1 + game.combo * 0.1, 6)}
            />
          </div>

          <div className="absolute inset-x-3 bottom-3 z-30 flex gap-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {[0, 1, 2].map((l) => {
              const isActive = game.lane === l;
              return (
                <button
                  key={l}
                  onClick={() => game.moveLane(l as 0 | 1 | 2)}
                  disabled={game.phase !== "playing"}
                  aria-pressed={isActive}
                  className={`min-h-[56px] flex-1 rounded-xl border-[3px] border-[#134E4A] text-xs font-black transition-all active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_#134E4A] ${
                    isActive
                      ? "bg-[#0D9488] text-white shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white text-[#134E4A] shadow-[3px_3px_0px_#134E4A]"
                  }`}
                >
                  {LANE_LABELS[l]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <LevelCompleteModal
        visible={game.phase === "levelcomplete"}
        level={game.level}
        score={game.score}
        onNext={game.nextLevel}
        onExit={exit}
      />

      <GameOverModal
        visible={game.phase === "gameover" || game.phase === "victory"}
        victory={game.phase === "victory"}
        score={game.score}
        maxCombo={game.maxCombo}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="cyan"
        title={
          game.phase === "victory" ? "Semua Level Selesai!" : "Sesi Selesai"
        }
        description={
          game.phase === "victory"
            ? "Luar biasa! Kamu menuntaskan seluruh 15 level Harakat Rush."
            : `Nyawa habis di Level ${game.level} · ${game.levelName}. Coba lagi!`
        }
        onRetry={game.start}
        onExit={exit}
      />
    </GameShell>
  );
}

export default function HarakatRushPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
