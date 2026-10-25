import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hijaiyah2048CoverSvg } from "@/components/ui/Illustrations";
import { StarSvg } from "@/components/ui/CustomIcons";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { playLetterAudio } from "../_shared/gameAudio";
import { TileBoard } from "./components/TileBoard";
import { useHijaiyah2048, type Direction } from "./hooks/useHijaiyah2048";
import { useGameExit } from "../_shared/hooks";

function Game() {
  const game = useHijaiyah2048();
  const exit = useGameExit();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [scoreIncreased, setScoreIncreased] = useState(false);
  const prevScore = useRef(game.score);
  const targetLetter = game.letters[game.highest]?.arabic;

  useEffect(() => {
    if (game.phase === "playing" && targetLetter) playLetterAudio(targetLetter);
  }, [game.phase, targetLetter]);

  useEffect(() => {
    if (game.score > prevScore.current) {
      setScoreIncreased(true);
      const timer = setTimeout(() => setScoreIncreased(false), 1200);
      prevScore.current = game.score;
      return () => clearTimeout(timer);
    }
    prevScore.current = game.score;
  }, [game.score]);

  const swipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const dx = event.clientX - touchStart.current.x;
    const dy = event.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    const direction: Direction =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up";
    game.move(direction);
  };
  return (
    <GameShell
      title="Hijaiyah 2048"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
      floatingTopBar
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Hijaiyah 2048"
          tagline="Gabungkan huruf, buka level"
          description="Geser papan seperti 2048. Dua huruf pada level yang sama bergabung menjadi huruf berikutnya. Gunakan tombol arah, keyboard, atau swipe."
          coverImage={<Hijaiyah2048CoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
          accent="cyan"
        />
      ) : (
        <div className="flex flex-col flex-1 gap-3 min-h-0 justify-between relative px-4 pt-16 pb-4">
          <HUD
            score={game.score}
            progressLabel={`Gerakan ${game.moves}`}
          />
          <div className="flex items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-white p-2.5 shadow-[3px_3px_0px_#134E4A] max-w-md mx-auto w-full">
            <div className="flex items-center gap-2">
              <span className="text-[#134E4A]/70 font-bold text-xs">Huruf tertinggi</span>
              {game.letters[game.highest]?.arabic ? (
                <span
                  dir="rtl"
                  className="game-arabic text-2xl font-black text-amber-600"
                >
                  {game.letters[game.highest]?.arabic}
                </span>
              ) : (
                <StarSvg
                  size={24}
                  className="fill-[#FBBF24] text-[#134E4A]"
                />
              )}
            </div>
          </div>
          <div
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              touchStart.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerUp={swipe}
            onPointerCancel={() => {
              touchStart.current = null;
            }}
            className="touch-none select-none flex-1 flex flex-col justify-center items-center w-full"
          >
            <TileBoard
              grid={game.grid}
              moveId={game.moveId}
              mergedIds={game.mergedIds}
              spawnedId={game.spawnedId}
              ghosts={game.ghosts}
            />
          </div>
          <p className="text-center text-[11px] text-[#134E4A]/55">
            Tekan lalu geser papan ke kiri, kanan, atas, atau bawah.
          </p>
        </div>
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        victory={false}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="cyan"
        title="Papan Berhenti"
        description={`Gerakan ${game.moves} · huruf tertinggi ${game.letters[game.highest]?.name ?? "bonus"}`}
        onRetry={game.start}
        onExit={exit}
      />
    </GameShell>
  );
}
export default function Hijaiyah2048Page() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
