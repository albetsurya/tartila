import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HijaiyahRushCoverSvg } from "@/components/ui/Illustrations";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { ComboBadge } from "../_shared/ComboBadge";
import { TargetBanner } from "../_shared/TargetBanner";
import { playLetterAudio } from "../_shared/gameAudio";
import { RunnerField } from "./components/RunnerField";
import { useHijaiyahRush } from "./hooks/useHijaiyahRush";

function Game() {
  const game = useHijaiyahRush();
  const navigate = useNavigate();

  useEffect(() => {
    if (game.phase === "playing" && game.target)
      playLetterAudio(game.target);
  }, [game.target, game.phase]);

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
        <div className="space-y-3">
          <HUD
            score={game.score}
            lives={game.lives}
            progressLabel={`${Math.floor(game.distance)} m`}
          />
          <TargetBanner
            target={game.target}
            name={game.targetName}
            actionLabel="Tangkap"
          />
          <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-2 text-[10px] font-black uppercase tracking-widest text-[#134E4A] shadow-[3px_3px_0px_#134E4A]">
            Platformer Stage · {Math.floor(game.distance)}m · checkpoint{" "}
            {Math.floor(game.distance / 30) + 1}
          </div>
          <RunnerField
            items={game.items}
            lane={game.lane}
            jumpTime={game.jumpTime}
            shake={game.shakeLeft > 0}
            onLane={game.moveLane}
            onJump={game.jump}
          />
          <div className="flex gap-2">
            {[0, 1, 2].map((lane) => (
              <button
                type="button"
                key={lane}
                aria-pressed={game.lane === lane}
                onClick={() => game.moveLane(lane)}
                className={`game-button flex-1 border-[3px] border-[#134E4A] ${
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
        description={`Jarak ${Math.floor(game.distance)} meter · kombo tertinggi ${game.maxCombo}`}
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
