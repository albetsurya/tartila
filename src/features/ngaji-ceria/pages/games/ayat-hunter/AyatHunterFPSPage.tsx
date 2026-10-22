import { useEffect } from "react";
import AyatHunterFPS3DScene from "./components/fps/AyatHunterFPS3DScene";
import { use3DAyatHunterFPS } from "./hooks/use3DAyatHunterFPS";
import type { GamePhase } from "../_shared/types";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";

function AyatHunterFPS() {
  const game = use3DAyatHunterFPS();

  const {
    phase,
    health,
    score,
    foundCount,
    totalTargets,
    combo,
    setPhase,
    setupInputListeners,
    resetGame,
    handleSearch,
  } = game;

  useEffect(() => {
    if (phase === "playing") {
      const cleanup = setupInputListeners();
      return cleanup;
    }
  }, [phase]);

  useEffect(() => {
    if (health <= 0) setPhase("gameover");
  }, [health, setPhase]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1e] to-[#1a1a2e] text-white">
      <GameShell
        title="Ayat Hunter"
        phase={phase as GamePhase}
        accent="violet"
        onPause={() => setPhase("paused")}
        onResume={() => setPhase("playing")}
      >
        <GameBoundary>
          {phase === "idle" || phase === "paused" ? (
            <StartScreen
              title="Ayat Hunter"
              tagline="Berburu ayat di arena 3D"
              description="Jelajahi area pencarian dan kumpulkan target ayat yang tersembunyi sebelum kesehatanmu habis."
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
              {/* 3D Scene */}
              {phase === "playing" && (
                <AyatHunterFPS3DScene state={game as any} />
              )}

              {/* Topbar Info */}
              {phase === "playing" && (
                <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                  <div className="text-white text-sm font-medium">
                    Skor: {score} | Target: {foundCount}/{totalTargets}
                  </div>
                  <div className="text-white text-sm font-medium">
                    Health: {health}%
                  </div>
                </div>
              )}

              {/* Actions */}
              {phase === "playing" && (
                <div className="absolute bottom-4 left-1/2 right-1/2 flex justify-around w-full max-w-md pointer-events-none">
                  <div
                    onClick={handleSearch}
                    className="relative w-24 h-12 rounded-full bg-violet-500/60 border border-violet-300 cursor-pointer transition-colors flex items-center justify-center"
                  >
                    <span className="text-white text-sm font-medium">Cari Ayat</span>
                  </div>
                  <div
                    onClick={() => combo > 0 && combo}
                    className="relative w-24 h-12 rounded-full bg-white/20 border border-white/40 cursor-default flex items-center justify-center"
                  >
                    <span className="text-white text-sm font-medium">
                      {combo > 0 ? `Combo ${combo}` : "Combo"}
                    </span>
                  </div>
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

export default function AyatHunterFPSPage() {
  return (
    <div>
      <AyatHunterFPS />
    </div>
  );
}
