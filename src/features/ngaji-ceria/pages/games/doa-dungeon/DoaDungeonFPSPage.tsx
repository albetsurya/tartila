import { useEffect, useRef, useState } from "react";
import FPS3DScene from "./components/FPS3DScene";
import { use3DFPSGame } from "./hooks/use3DFPSGame";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import type { GamePhase } from "../_shared/types";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";

function DoaDungeonFPS() {
  const game = use3DFPSGame();

  const {
    phase,
    health,
    position,
    rotation,
    camera,
    score,
    isJumping,
    jumpProgress,
    setPhase,
    setScore,
    updateInput,
    resetGame,
    handleJump,
  } = game;

  useEffect(() => {
    if (phase === "playing") {
      // Memulai input listeners
      const cleanup = setupInputListeners();
      return cleanup;
    }
  }, [phase]);

  // Fungsi helper untuk setup input
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
        case "ShiftLeft":
          updateInput({ shoot: true });
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
        case " ":
          updateInput({ jump: false });
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
    // Listen event dari 3D scene
    const handleTargetCollected = () => {
      setScore((prev: number) => prev + 10);
    };
    window.addEventListener("fps-target-collected" as keyof WindowEventMap, handleTargetCollected as EventListener);
    return () => window.removeEventListener("fps-target-collected" as keyof WindowEventMap, handleTargetCollected as EventListener);
  }, []);

  useEffect(() => {
    if (health <= 0) {
      setPhase("gameover");
    }
  }, [health]);

  // UI Elements
  const laneIndicator = (
    <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
      <div className="text-white text-sm font-medium">Position: {position.x.toFixed(1)}, {position.z.toFixed(1)}</div>
      <div className="text-white text-sm font-medium">Rotation: {rotation.yaw.toFixed(2)} rad (yaw), {rotation.pitch.toFixed(2)} rad (pitch)</div>
      <div className="text-white text-sm font-medium">Health: {health}%</div>
      <div className="text-white text-sm font-medium">Score: {score}</div>
    </div>
  );

  const controlsOverlay = (
    <div className="absolute bottom-4 left-1/2 right-1/2 flex justify-around pointer-events-none w-full max-w-md">
      <div 
        onClick={handleJump} 
        className="relative w-14 h-14 rounded-full bg-blue-600/50 border border-blue-300 cursor-pointer transition-colors"
        style={{ marginBottom: '1rem' }}
      >
        <svg 
          className="w-8 h-8 group-hover:text-blue-300 transition-colors"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M7.41 8.59L12 12.17l4.59 4.58L18 9l-6-6-6 6z" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex items-center justify-between w-full">
        <div 
          onClick={() => updateInput({ moveLeft: true })} 
          className="p-2 rounded bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 19l-5-5 5-5" />
            <path d="M10 14l5-5 5 5" />
          </svg>
        </div>

        <div className="flex-1 border-l border-white/20"></div>

        <div 
          onClick={() => updateInput({ moveRight: true })} 
          className="p-2 rounded bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 5l5 5-5 5" />
            <path d="M14 10l-5 5-5-5" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1e] to-[#1a1a2e] text-white">
      <GameShell
        title="Doa Dungeon FPS"
        phase={phase as GamePhase}
        accent="violet"
        onPause={() => setPhase("paused")}
        onResume={() => setPhase("playing")}
      >
        <GameBoundary>
          {phase === "idle" || phase === "paused" ? (
            <StartScreen
              title="Doa Dungeon FPS"
              tagline="Kunjungi ruang bawah tanah doa"
              description="Temukan kumpulan doa harian yang tersembunyi di dungeon. Arahkan pandangan, kumpulkan target, pelajari doanya."
              best={score}
              onStart={() => {
                resetGame();
                setPhase("playing");
              }}
              onExit={() => setPhase("idle")}
              accent="violet"
            />
          ) : (
            <>
              {/* 3D FPS Scene */}
              {phase === "playing" && (
                <FPS3DScene state={game as any} />
              )}

              {/* Topbar Info */}
              {phase === "playing" && (
                <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                  <div>{laneIndicator}</div>
                </div>
              )}

              {/* Bottom Controls */}
              {phase === "playing" && (
                <div className="absolute bottom-4 left-1/2 right-1/2 flex justify-around w-full pointer-events-none">
                  {controlsOverlay}
                </div>
              )}
            </>
          )}

          {/* Game Over Modal */}
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

// EXPORT UTAMA
export default function DoaDungeonFPSPage() {
  return (
    <div>
      <DoaDungeonFPS />
    </div>
  );
}
