import { useNavigate } from "react-router-dom";
import { WudhuFlowCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { ComboBadge } from "../_shared/ComboBadge";
import { BeatIndicator } from "./components/BeatIndicator";
import { NodeChip } from "./components/NodeChip";
import { useWudhuFlow } from "./hooks/useWudhuFlow";
import { WaterPipeBoard } from "./components/WaterPipeBoard";

function Game() {
  const game = useWudhuFlow();
  const navigate = useNavigate();
  return (
    <GameShell
      title="Wudhu Flow"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="emerald"
      tutorialGameId="wudhu-flow"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Wudhu Flow"
          tagline="Sambung pipa, jaga urutan"
          description="Putar pipa untuk mengalirkan air melalui sepuluh langkah wudhu. Pilih santai, air terbatas, atau mode ritme."
          coverImage={<WudhuFlowCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={() => navigate("/member/ngaji-ceria/games")}
          accent="emerald"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {(["pipes", "challenge", "rhythm"] as const).map((mode, i) => (
              <button
                key={mode}
                onClick={() => game.setMode(mode)}
                aria-pressed={game.mode === mode}
                className="game-button border border-teal-300/30 bg-teal-500/20"
              >
                {["Pipa Santai", "Air Terbatas", "Ritme"][i]}
              </button>
            ))}
          </div>
        </StartScreen>
      ) : (
        <div className="space-y-3">
          <HUD
            score={game.score}
            progressLabel={`${game.completed}/10 langkah`}
          />
          {game.mode === "rhythm" ? (
            <>
              <BeatIndicator
                progress={game.beatProgress}
                bpm={game.bpm}
                beat={game.beatCount}
              />
              <div className="grid grid-cols-2 gap-2">
                {game.steps.map((step, index) => (
                  <NodeChip
                    key={step.id}
                    step={step}
                    index={index}
                    active={index === game.currentIndex}
                    completed={index < game.completed}
                    disabled={game.phase !== "playing"}
                    onTap={() => game.tapStep(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Maskot berdiri di dekat pancuran air */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl border-2 border-[#134E4A] bg-teal-900/60 shadow-[2px_2px_0px_#134E4A]">
                <div className="flex items-center gap-3">
                  <TilaMascot
                    size={64}
                    mood={game.completed >= 5 ? "excited" : "happy"}
                    animation="float"
                    direction="right"
                    speech={
                      game.completed >= 10
                        ? "Wudhu Sempurna!"
                        : "Alirkan air suci..."
                    }
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 block">
                      Pancuran Air Wudhu
                    </span>
                    <span className="text-xs font-bold text-white">
                      Langkah {game.completed}/10 Selesai
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-xl border-2 border-[#134E4A] bg-[#0284C7] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#38BDF8" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
              </div>

              <p className="text-xs text-teal-100">
                Sumber ke pipa 1 · tujuan setelah pipa 10{" "}
                {game.mode === "challenge" && `· ${game.water} percobaan air`}
              </p>
              <WaterPipeBoard
                steps={game.steps}
                rotations={game.rotations}
                wet={game.completed}
                disabled={game.phase !== "playing"}
                onRotate={game.rotatePipe}
              />
              <button
                disabled={game.phase !== "playing"}
                onClick={game.openWater}
                className="game-button w-full bg-teal-600"
              >
                Alirkan Air
              </button>
              <p className="text-xs text-white/70">
                {game.steps[Math.min(game.completed, 9)].instruction}
              </p>
            </>
          )}
          <ComboBadge combo={game.combo} />
          <p
            aria-live="polite"
            className={`min-h-5 text-center text-xs font-bold ${game.judgement === "wrong" ? "text-red-300" : "text-teal-200"}`}
          >
            {game.message}
          </p>
        </div>
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        score={game.score}
        maxCombo={game.maxCombo}
        victory={game.completed === 10}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="emerald"
        title={game.completed === 10 ? "Wudhu Selesai" : "Air Habis"}
        description={`${game.completed}/10 langkah · ${game.mode === "rhythm" ? `kombo ${game.maxCombo}` : `${game.turns} putaran pipa`}`}
        onRetry={game.start}
        onExit={() => navigate("/member/ngaji-ceria/games")}
      />
    </GameShell>
  );
}
export default function WudhuFlowPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
