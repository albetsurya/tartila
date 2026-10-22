import { useEffect, useRef, useState } from "react";
import TajwidFPS3DScene from "./components/TajwidFPS3DScene";
import { use3DTajwidFPS } from "./hooks/use3DTajwidFPS";
import type { GamePhase } from "../_shared/types";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";

function TajwidFPS() {
  const game = use3DTajwidFPS();

  const {
    phase,
    health,
    position,
    rotation,
    camera,
    score,
    levelId,
    currentCard,
    combo,
    maxCombo,
    isJumping,
    jumpProgress,
    setPhase,
    setScore,
    updateInput,
    resetGame,
    handleJump,
    handleSelect,
  } = game;

  useEffect(() => {
    if (phase === "playing") {
      const cleanup = setupInputListeners();
      return cleanup;
    }
  }, [phase]);

  const setupInputListeners = () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      switch (e.key) {
        case "ArrowUp":
        case "W":
          updateInput({ moveForward: true });
          break;
        case "ArrowDown":
        case "S":
          updateInput({ moveBackward: true });
          break;
        case "ArrowLeft":
        case "A":
          updateInput({ moveLeft: true });
          break;
        case "ArrowRight":
        case "D":
          updateInput({ moveRight: true });
          break;
        case " ":
          updateInput({ jump: true });
          break;
        case "Enter":
          updateInput({ select: true });
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "W":
          updateInput({ moveForward: false });
          break;
        case "ArrowDown":
        case "S":
          updateInput({ moveBackward: false });
          break;
        case "ArrowLeft":
        case "A":
          updateInput({ moveLeft: false });
          break;
        case "ArrowRight":
        case "D":
          updateInput({ moveRight: false });
          break;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (phase !== "playing") return;
      updateInput({
        lookHorizontal: e.movementX,
        lookVertical: e.movementY,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  };

  useEffect(() => {
    const handleCardCollected = () => {
      setScore((prev: number) => prev + 5);
    };
    window.addEventListener("tajwid-card-collected" as keyof WindowEventMap, handleCardCollected as EventListener);
    return () => window.removeEventListener("tajwid-card-collected" as keyof WindowEventMap, handleCardCollected as EventListener);
  }, []);

  useEffect(() => {
    if (health <= 0) setPhase("gameover");
  }, [health]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1e] to-[#1a1a2e] text-white">
      <GameShell
        title="Tajwid Arena FPS"
        phase={phase as GamePhase}
        accent="cyan"
        onPause={() => setPhase("paused")}
        onResume={() => setPhase("playing")}
      >
        <GameBoundary>
          {phase === "idle" || phase === "paused" ? (
            <StartScreen
              title="Tajwid Arena FPS"
              tagline="Buruan kartu hukum tajwid"
              description="Masuk arena 3D dan kumpulkan kartu hukum tajwid yang tersebar. Jaga kesehatanmu dan raih skor tertinggi."
              best={score}
              onStart={() => {
                resetGame();
                setPhase("playing");
              }}
              onExit={() => setPhase("idle")}
              accent="cyan"
            />
          ) : (
            <>
              {/* 3D FPS Scene */}
              {phase === "playing" && <TajwidFPS3DScene state={game as any} />}

              {/* Topbar */}
              {phase === "playing" && (
                <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                  <div className="text-white text-sm font-medium">
                    Level: {levelId} | Score: {score}
                  </div>
                </div>
              )}

              {/* Bottom Controls */}
              {phase === "playing" && (
                <div className="absolute bottom-4 left-1/2 right-1/2 flex justify-around w-full max-w-md pointer-events-none">
                  <div onClick={handleJump} className="relative w-12 h-12 rounded-full bg-blue-600/50 border border-blue-300 cursor-pointer transition-colors mb-2">
                    <svg className="w-6 h-6 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M7.41 8.59L12 12.17l4.59 4.58L18 9l-6-6-6 6z" />
                      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <div className="p-2 rounded bg-white/20 hover:bg-white/30 transition-colors cursor-pointer" onClick={() => updateInput({ moveLeft: true })}>
                      <svg className="w-4 h-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M15 19l-5-5 5-5" />
                        <path d="M10 14l5-5 5 5" />
                      </svg>
                    </div>

                    <div className="flex-1 border-l border-white/20"></div>

                    <div className="p-2 rounded bg-white/20 hover:bg-white/30 transition-colors cursor-pointer" onClick={() => updateInput({ moveRight: true })}>
                      <svg className="w-4 h-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 5l5 5-5 5" />
                        <path d="M14 10l-5 5-5-5" />
                      </svg>
                    </div>
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
              best={score}
              isNewRecord={false}
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

export default function TajwidFPSPage() {
  return <div><TajwidFPS /></div>;
}
