import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HijaiyahRushCoverSvg } from "@/components/ui/Illustrations";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { ComboBadge } from "../_shared/ComboBadge";
import { TargetBanner } from "../_shared/TargetBanner";
import { GameHud } from "../_shared/GameHud";
import { playLetterAudio } from "../_shared/gameAudio";
import { RunnerField } from "./components/RunnerField";
import { useHijaiyahRush } from "./hooks/useHijaiyahRush";

function Game() {
  const game = useHijaiyahRush();
  const navigate = useNavigate();

  useEffect(() => {
    if (game.phase === "playing" && game.target) playLetterAudio(game.target);
  }, [game.target, game.phase]);

  const currentLevel = Math.floor(game.distance / 30) + 1;

  return (
    <GameShell
      title="Hijaiyah Rush"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Hijaiyah Rush"
          tagline="Lari, lompat, tangkap target"
          description="Qirra berlari otomatis di tiga jalur. Pindah jalur dan lompat untuk mengambil huruf yang diminta. Kecepatan naik setiap 30 meter, kombo memperbesar skor."
          coverImage={<HijaiyahRushCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={() => navigate("/member/ngaji-ceria/games")}
          accent="cyan"
        />
      ) : (
        <div className="flex flex-col h-full space-y-3 relative">
          {/* ==================================================== */}
          {/* CUSTOM HUD MENGGUNAKAN GAMEHUD */}
          {/* ==================================================== */}
          <div className="absolute top-2 inset-x-0 z-30 flex flex-col items-center px-2 pointer-events-none">
            <GameHud
              level={currentLevel}
              score={game.score}
              lives={game.lives}
              combo={game.combo}
            />
            <div className="mt-2 flex justify-center w-full">
              <TargetBanner
                targetLetters={[game.target]}
                collectedLetters={[]}
                className="shadow-[4px_4px_0px_#134E4A] scale-90 origin-top"
              />
            </div>
          </div>

          {/* Area Permainan (Runner) */}
          <div className="flex-1 relative mt-24">
            <RunnerField
              items={game.items}
              lane={game.lane}
              jumpTime={game.jumpTime}
              shake={game.shakeLeft > 0}
              onLane={game.moveLane}
              onJump={game.jump}
            />
          </div>

          {/* Kontrol Bawah */}
          <div className="flex gap-2 px-2 pb-2 z-20">
            {[0, 1, 2].map((lane) => (
              <button
                type="button"
                key={lane}
                aria-pressed={game.lane === lane}
                onClick={() => game.moveLane(lane)}
                className={`game-button flex-1 border-[3px] border-[#134E4A] py-3 text-sm font-black ${
                  game.lane === lane
                    ? "bg-[#0D9488] text-white shadow-[3px_3px_0px_#134E4A]"
                    : "bg-white text-[#134E4A] shadow-[3px_3px_0px_#134E4A]"
                }`}
              >
                {["Kiri", "Tengah", "Kanan"][lane]}
              </button>
            ))}
          </div>

          <ComboBadge
            combo={game.combo}
            multiplier={Math.min(1 + game.combo * 0.12, 5)}
          />
        </div>
      )}

      <GameOverModal
        visible={game.phase === "gameover"}
        victory={false}
        score={game.score}
        maxCombo={game.maxCombo}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="cyan"
        description={`Mencapai Level ${currentLevel} · kombo tertinggi ${game.maxCombo}`}
        onRetry={game.start}
        onExit={() => navigate("/member/ngaji-ceria/games")}
      />
    </GameShell>
  );
}

export default function HijaiyahRushPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
