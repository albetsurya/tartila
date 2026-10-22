import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { playLetterAudio } from "../_shared/gameAudio";
import Harakat3DScene from "./components/Harakat3DScene";
import { use3DRunnerGame } from "./hooks/use3DRunnerGame";
import { HARAKAT_LIST } from "./data/harakat-list";
import type { GamePhase } from "../_shared/types";

function Game() {
  const game = use3DRunnerGame();
  const navigate = useNavigate();

  const {
    phase,
    score,
    combo,
    lane,
    lives,
    levelId,
    best,
    setPhase,
    setLane,
    gameOver,
    hitTarget,
    jump,
    state,
    setState,
    resetRun,
  } = game;

  useEffect(() => {
    if (phase === "playing" && state.currentTarget) {
      const entry = HARAKAT_LIST.find((h) => h.id === state.currentTarget);
      playLetterAudio(entry?.symbol ?? "");
    }
  }, [phase, state.currentTarget]);

  useEffect(() => {
    document.body.classList.toggle("game-active", phase !== "idle");
    return () => document.body.classList.remove("game-active");
  }, [phase]);

  // ✅ INPUT HANDLER - Subway Surfers Style
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "playing") return;

      // Ganti lane
      if (e.key === "ArrowLeft" || e.key === "a") {
        setLane(Math.max(0, lane - 1) as 0 | 1 | 2);
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setLane(Math.min(2, lane + 1) as 0 | 1 | 2);
      }

      // Loncat
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        jump();
      }

      // Teclik harakat
      if (e.key === "ArrowUp" || e.key === "w") {
        const targetInLane = state.targets.find(
          t => t.lane === lane && !t.hit
        );
        if (targetInLane) {
          hitTarget(targetInLane.id, targetInLane.isCorrect);
        }
      }
    };

    const handleKeyUp = () => {};

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [phase, lane, state, setLane, hitTarget, jump]);

  // ✅ LISTEN EVENT dari 3D scene
  useEffect(() => {
    const handleHit = (e: Event) => {
      const { symbol, lane: hitLane } = (e as CustomEvent).detail ?? {};
      const target = state.targets.find(
        (t) => t.symbol === symbol && t.lane === hitLane
      );
      if (target) {
        hitTarget(target.id, target.isCorrect);
      }
    };
    window.addEventListener("harakat-hit" as keyof WindowEventMap, handleHit);
    return () =>
      window.removeEventListener(
        "harakat-hit" as keyof WindowEventMap,
        handleHit
      );
  }, [state, hitTarget]);

  // ✅ GAME OVER CHECK
  useEffect(() => {
    if (lives <= 0) {
      gameOver();
    }
  }, [lives, gameOver]);

  // ✅ RESET GAME
  const resetGame = () => {
    resetRun();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1e] to-[#1a1a2e] text-white">
      <GameShell
        title="Harakat Rush"
        phase={phase as GamePhase}
        accent="emerald"
        onPause={() => setPhase("paused")}
        onResume={() => setPhase("playing")}
      >
        <GameBoundary>
          {phase === "idle" || phase === "paused" ? (
            <StartScreen
              title="Harakat Rush"
              tagline="Lari kejar harakat yang tepat"
              description="Berlari di tiga lajur dan potong tepat harakat yang sesuai target. Jaga nyawa dan naikkan levelmu."
              best={score}
              onStart={() => {
                resetGame();
                setPhase("playing");
              }}
              onExit={() => {
                resetGame();
                navigate("/");
              }}
              accent="emerald"
            />
          ) : (
            <>
              {/* 3D Scene */}
              {phase === "playing" && (
                <Harakat3DScene state={state} />
              )}

              {/* Topbar Info */}
              {phase === "playing" && (
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-medium">Lane: </span>
                <span 
                  className={`px-2 py-1 rounded ${lane === 0 ? 'bg-blue-500' : lane === 1 ? 'bg-green-500' : 'bg-yellow-500'}`}
                >
                  {[ "Kiri", "Tengah", "Kanan"][lane]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-medium">Score: </span>
                <span className="text-2xl font-bold">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-medium">Combo: </span>
                <span className="text-orange-400 font-bold">{combo > 0 ? combo : 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-medium">Lives: </span>
                <span className="text-red-400">{lives > 0 ? "♥".repeat(lives) : "0"}</span>
              </div>
            </div>
          )}

          {/* Bottom Controls - Subway Surfers Style */}
          {phase === "playing" && (
            <div className="absolute bottom-4 left-1/2 right-1/2 flex justify-around pointer-events-none">
              {/* Jump Button */}
              <div onClick={jump} className="relative">
                <svg 
                  className="w-12 h-12 text-white opacity-80 hover:opacity-100 transition-opacity"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.41 8.59L12 12.17l4.59 4.58L18 9l-6-6-6 6z" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <svg 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 text-orange-400 opacity-0 hover:opacity-100 transition-opacity"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.41 15.41L12 19.59l4.59 4.58L18 15l-6-6-6 6z" />
                </svg>
              </div>

              {/* Lane Left */}
              <div 
                onClick={() => setLane(0)} 
                className="relative w-14 h-14 rounded-full bg-blue-600/50 transition-colors cursor-pointer"
              >
                <svg 
                  className="w-8 h-8 group-hover:text-blue-400 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M15 19l-5-5 5-5" />
                  <path d="M10 14l5-5 5 5" />
                </svg>
              </div>

              {/* Lane Right */}
              <div 
                onClick={() => setLane(2)} 
                className="relative w-14 h-14 rounded-full bg-blue-600/50 transition-colors cursor-pointer"
              >
                <svg 
                  className="w-8 h-8 group-hover:text-blue-400 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M9 5l5 5-5 5" />
                  <path d="M14 10l-5 5-5-5" />
                </svg>
              </div>
            </div>
          )}
        </>
      )}

          {/* Game Over */}
          {phase === "gameover" && (
            <GameOverModal
              visible
              title="Game Over"
              score={score}
              best={best}
              isNewRecord={score > 0 && score >= best}
              onRetry={() => {
                resetGame();
                setPhase("playing");
              }}
              onExit={() => setPhase("idle")}
            />
          )}
        </GameBoundary>
      </GameShell>
    </div>
  );
}

// ✅ EXPORT UTAMA
export default function HarakatRushPage() {
  return (
    <div>
      {/* Hubungkan ke GameModeHub jika ada, atau langsung render game */}
      <Game />
    </div>
  );
}
