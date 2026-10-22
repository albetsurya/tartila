import { useEffect, useState } from "react";
import { HijaiyahBeatsCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { TimerBar } from "../_shared/TimerBar";
import { ComboBadge } from "../_shared/ComboBadge";
import { playLetterAudio } from "../_shared/gameAudio";
import { useRhythmGame } from "../_shared/hooks/useRhythmGame";
import { useGameExit } from "../_shared/hooks";

const letters = ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د"];
function Game() {
  const [mode, setMode] = useState<"normal" | "endless">("normal");
  const game = useRhythmGame({
    gameId: "hijaiyah-beats",
    lanes: 3,
    duration: 90,
    endless: mode === "endless",
    letters,
  });
  const exit = useGameExit();

  useEffect(() => {
    if (game.phase === "playing" && game.recitationNote)
      playLetterAudio(game.recitationNote.letter);
  }, [game.phase, game.recitationNote]);

  return (
    <GameShell
      title="Hijaiyah Beats"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="pink"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Hijaiyah Beats"
          tagline="Bentuk huruf, ikuti suara"
          description="Tap tiga lane mengikuti huruf dan ketukan. Mode normal berlangsung 90 detik; mode endless berhenti setelah tiga miss."
          coverImage={<HijaiyahBeatsCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
          accent="pink"
        >
          <div className="flex gap-2">
            {(["normal", "endless"] as const).map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={`game-button flex-1 border ${mode === value ? "border-rose-300 bg-rose-500/25" : "border-white/20 bg-white/5"}`}
              >
                {value === "normal" ? "Normal" : "Endless"}
              </button>
            ))}
          </div>
        </StartScreen>
      ) : (
        <div className="flex flex-col flex-1 gap-3 min-h-0 justify-between">
          <HUD
            score={game.score}
            progressLabel={
              game.endless
                ? `${game.misses}/3 miss`
                : `${Math.floor(game.elapsed)}/90 detik`
            }
          />
          <TimerBar
            progress={game.endless ? 1 : 1 - game.elapsed / 90}
            secondsLeft={90 - game.elapsed}
          />
          {/* Maskot menari di atas panggung */}
          <div className="relative flex flex-col items-center justify-center py-2 px-4 rounded-2xl border-2 border-[#134E4A] bg-rose-950/40 shadow-[2px_2px_0px_#134E4A]">
            <div className="absolute top-1 left-3 text-[10px] font-black uppercase tracking-wider text-rose-300">
              Panggung Irama
            </div>
            <TilaMascot
              size={68}
              animation="float"
              mood={game.combo > 5 ? "excited" : "happy"}
              direction="front"
              speech={game.combo >= 8 ? "Irama Pas!" : undefined}
            />
          </div>
          <div className="relative grid flex-1 min-h-[300px] grid-cols-3 gap-1 overflow-hidden rounded-3xl border-2 border-[#134E4A] bg-[#0A2E28] shadow-[3px_3px_0px_#134E4A]">
            {game.notes.map((note) => (
              <div
                key={note.id}
                className="game-arabic absolute flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500 text-2xl text-teal-950"
                style={{
                  left: `calc(${(note.lane + 0.5) * 33.333}% - 24px)`,
                  top: `${note.y}%`,
                }}
              >
                {note.letter}
              </div>
            ))}
            <div className="absolute bottom-[18%] left-0 right-0 h-1 bg-white" />
          </div>
          <div className="grid grid-cols-3 gap-2 shrink-0">
            {[0, 1, 2].map((lane) => (
              <button
                type="button"
                key={lane}
                onClick={() => game.hitLane(lane)}
                className="game-button bg-rose-500"
              >
                {lane + 1}
              </button>
            ))}
          </div>
          <ComboBadge
            combo={game.combo}
            multiplier={Math.min(1 + game.combo * 0.05, 4)}
          />
          <p
            aria-live="polite"
            className="text-center text-xs text-[#134E4A]/75 shrink-0"
          >
            {game.judgement === "perfect"
              ? "Perfect!"
              : game.judgement === "good"
                ? "Good!"
                : game.judgement === "miss"
                  ? "Miss"
                  : "Ikuti irama dan tap tombol lane."}
          </p>
        </div>
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        victory={!game.endless}
        score={game.score}
        maxCombo={game.maxCombo}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="pink"
        description={`Mode ${mode === "endless" ? "Endless" : "Normal"} · kombo ${game.maxCombo}`}
        onRetry={game.start}
        onExit={exit}
      />
    </GameShell>
  );
}
export default function HijaiyahBeatsPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
