import { useEffect } from "react";
import { MakhrajMasterCoverSvg } from "@/components/ui/Illustrations";
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

const letters = ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر"];
function Game() {
  const game = useRhythmGame({
    gameId: "makhraj-master",
    lanes: 4,
    duration: 90,
    letters,
  });
  const exit = useGameExit();

  useEffect(() => {
    if (game.phase === "playing" && game.recitationNote)
      playLetterAudio(game.recitationNote.letter);
  }, [game.phase, game.recitationNote]);

  return (
    <GameShell
      title="Makhraj Master"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Makhraj Master"
          tagline="Dengar makhraj, tap tepat waktu"
          description="Huruf jatuh di empat lane. Tap saat menyentuh garis bawah untuk Perfect atau Good. Latency bisa dikalibrasi sebelum mulai."
          coverImage={<MakhrajMasterCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
          accent="cyan"
        >
          <label className="flex items-center gap-2 text-xs text-white/70">
            Latency{" "}
            <input
              type="range"
              min={-100}
              max={100}
              step={10}
              value={game.latency}
              onChange={(event) => game.setLatency(Number(event.target.value))}
            />
            <span>{game.latency}ms</span>
          </label>
        </StartScreen>
      ) : (
        <div className="flex flex-col flex-1 gap-3 min-h-0 justify-between">
          <HUD
            score={game.score}
            progressLabel={`${Math.floor(game.elapsed)}/90 detik`}
          />
          <TimerBar
            progress={1 - game.elapsed / 90}
            secondsLeft={90 - game.elapsed}
          />
          {/* Maskot membuka mulut saat timing tepat */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl border-2 border-[#134E4A] bg-teal-900/60 shadow-[2px_2px_0px_#134E4A]">
            <div className="flex items-center gap-3">
              <TilaMascot
                size={64}
                mood={
                  game.judgement === "perfect"
                    ? "excited"
                    : game.judgement === "miss"
                      ? "sad"
                      : "happy"
                }
                animation={game.judgement === "perfect" ? "bounce" : "float"}
                direction="front"
                talking={game.judgement === "perfect" || game.judgement === "good"}
                speech={
                  game.judgement === "perfect"
                    ? "Fasih Sekali!"
                    : game.judgement === "good"
                      ? "Bagus!"
                      : undefined
                }
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 block">
                  Panduan Pelafalan Makhraj
                </span>
                <span className="text-xs font-bold text-white">
                  {game.judgement === "perfect"
                    ? "Sempurna! Artikulasi pas."
                    : game.judgement === "good"
                      ? "Bagus! Terus jaga ritme."
                      : game.judgement === "miss"
                        ? "Kurang tepat waktu."
                        : "Tap tombol saat huruf menyentuh garis."}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-amber-300 block">
                Combo
              </span>
              <span className="text-base font-black text-white">
                x{game.combo}
              </span>
            </div>
          </div>
          <div className="relative grid flex-1 min-h-[300px] grid-cols-4 gap-1 overflow-hidden rounded-3xl border border-teal-300/25 bg-teal-950">
            {game.notes.map((note) => (
              <div
                key={note.id}
                className="game-arabic absolute flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-2xl text-teal-950"
                style={{
                  left: `calc(${(note.lane + 0.5) * 25}% - 24px)`,
                  top: `${note.y}%`,
                }}
              >
                {note.letter}
              </div>
            ))}
            <div className="absolute bottom-[18%] left-0 right-0 h-1 bg-white" />
          </div>
          <div className="grid grid-cols-4 gap-2 shrink-0">
            {[0, 1, 2, 3].map((lane) => (
              <button
                type="button"
                key={lane}
                onClick={() => game.hitLane(lane)}
                className="game-button bg-teal-500"
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
                  : "Tap angka jalur saat huruf tiba di garis."}
          </p>
        </div>
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        score={game.score}
        maxCombo={game.maxCombo}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="cyan"
        description={`Kombo tertinggi: ${game.maxCombo}`}
        onRetry={game.start}
        onExit={exit}
      />
    </GameShell>
  );
}
export default function MakhrajMasterPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
