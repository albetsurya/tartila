import { useEffect } from "react";
import { SparklesSvg } from "@/components/ui/CustomIcons";
import { TajwidTetrisCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { playLetterAudio } from "../_shared/gameAudio";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameOverModal } from "../_shared/GameOverModal";
import { GameShell } from "../_shared/GameShell";
import { HUD } from "../_shared/HUD";
import { StartScreen } from "../_shared/StartScreen";
import {
  useTajwidTetris,
  TETRIS_HEIGHT,
  TETRIS_WIDTH,
  type ActiveTetromino,
  type TetrisCell,
} from "./hooks/useTajwidTetris";
import { LeaderboardPanel } from "../_shared/LeaderboardPanel";
import { ProgressPanel } from "../_shared/ProgressPanel";
import { useGameExit } from "../_shared/hooks";

/**
 * Data tetrominoes tidak memuat nomor surah/ayat, jadi pelafalan memakai
 * huruf banakar per hukum tajwid via playLetterAudio (Web Speech).
 */
const RULE_LETTER: Record<string, string> = {
  mad: "ا",
  izhar: "ء",
  ikhfa: "ن",
  idgham: "ن",
  iqlab: "ن",
  qalqalah: "ق",
  ghunnah: "ن",
};

function Board({
  board,
  piece,
}: {
  board: (TetrisCell | null)[][];
  piece: ActiveTetromino | null;
}) {
  const cells = board.map((row) => [...row]);
  const active = new Set<string>();
  if (piece) {
    piece.shape.forEach((row, rowIndex) =>
      row.forEach((filled, columnIndex) => {
        const y = piece.y + rowIndex;
        const x = piece.x + columnIndex;
        if (
          filled &&
          y >= 0 &&
          y < TETRIS_HEIGHT &&
          x >= 0 &&
          x < TETRIS_WIDTH
        ) {
          cells[y][x] = { label: piece.label, color: piece.color };
          active.add(`${y}:${x}`);
        }
      }),
    );
  }
  return (
    <div
      aria-label="Papan Tajwid Tetris"
      role="grid"
      className="mx-auto grid w-full max-w-[360px] overflow-hidden rounded-2xl border border-teal-300/25 bg-teal-950 p-1"
      style={{ gridTemplateColumns: `repeat(${TETRIS_WIDTH}, minmax(0, 1fr))` }}
    >
      {cells.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) => (
          <div
            role="gridcell"
            key={`${rowIndex}:${columnIndex}`}
            className={`flex aspect-square min-w-0 items-center justify-center border border-white/[0.035] p-0.5 text-center text-[8px] font-black leading-none sm:text-[10px] ${active.has(`${rowIndex}:${columnIndex}`) ? "tetris-active" : ""}`}
            style={
              cell
                ? {
                    backgroundColor: `${cell.color}cc`,
                    color: "#0b2b28",
                    boxShadow: `inset 0 0 0 1px ${cell.color}`,
                  }
                : undefined
            }
          >
            {cell?.label}
          </div>
        )),
      )}
    </div>
  );
}

function Game() {
  const game = useTajwidTetris();
  const exit = useGameExit();
  const { phase, move, rotate, drop } = game;

  // Audio pelafalan: huruf banakar hukum pada blok aktif, berganti per spawn piece.
  useEffect(() => {
    if (game.phase !== "playing") return;
    const letter = game.piece ? RULE_LETTER[game.piece.id] : undefined;
    if (letter) playLetterAudio(letter);
  }, [game.piece?.id, game.phase]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        rotate();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        drop(false);
      }
      if (event.key === " ") {
        event.preventDefault();
        drop(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drop, move, phase, rotate]);

  return (
    <GameShell
      title="Tajwid Tetris"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Tajwid Tetris"
          tagline="Susun blok, pahami hukum"
          description="Jatuhkan blok hukum tajwid, bersihkan baris, dan baca ringkasan hukum setiap kali blok terkunci. Gunakan tombol atau keyboard untuk bermain."
          coverImage={<TajwidTetrisCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
          accent="cyan"
        />
      ) : (
        <div className="space-y-3 pb-24 md:pb-32 relative">
          <HUD
            score={game.score}
            progressLabel={`Level ${game.level} · ${game.lines} baris`}
          />
          {/* Maskot memberikan jempol saat combo / baris bersih */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] text-[#134E4A]">
            <div className="pointer-events-none select-none flex items-center gap-3">
              <TilaMascot
                size={68}
                mood={game.lines > 0 ? "excited" : "happy"}
                animation={game.lines > 0 ? "bounce" : "float"}
                direction="right"
                speech={game.lines > 0 ? "Mantap Sekali!" : undefined}
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                  Panduan Tajwid Tetris
                </span>
                <span className="text-xs font-bold text-[#134E4A]">
                  {game.lines > 0
                    ? "Susunan rapi, hukum tajwid tepat!"
                    : "Susun blok sesuai hukum bacaan."}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-teal-700 block">
                Baris Bersih
              </span>
              <span className="text-base font-black text-amber-600 inline-flex items-center justify-end gap-1">
                {game.lines}
                <SparklesSvg size={14} className="text-amber-500" />
              </span>
            </div>
          </div>
          <Board board={game.board} piece={game.piece} />
          <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] px-3 py-2 text-center shadow-[3px_3px_0px_#134E4A]">
            <p className="text-[10px] font-black uppercase tracking-wider text-teal-700">
              Pelajaran blok aktif
            </p>
            <p
              aria-live="polite"
              className="mt-1 text-xs leading-relaxed text-[#134E4A] font-semibold"
            >
              {game.feedback}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 relative z-30">
            <button
              type="button"
              aria-label="Geser kiri"
              onClick={() => game.move(-1)}
              className="game-button min-w-[44px] min-h-[44px] flex items-center justify-center bg-teal-600 text-lg font-bold"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Putar blok"
              onClick={game.rotate}
              className="game-button min-w-[44px] min-h-[44px] flex items-center justify-center bg-teal-600 text-lg font-bold"
            >
              ↻
            </button>
            <button
              type="button"
              aria-label="Geser kanan"
              onClick={() => game.move(1)}
              className="game-button min-w-[44px] min-h-[44px] flex items-center justify-center bg-teal-600 text-lg font-bold"
            >
              →
            </button>
            <button
              type="button"
              aria-label="Jatuhkan blok"
              onClick={() => game.drop(true)}
              className="game-button min-w-[44px] min-h-[44px] flex items-center justify-center bg-rose-600 text-lg font-bold"
            >
              ↓
            </button>
          </div>
          <p className="text-center text-[11px] text-[#134E4A]/75 font-bold">
            Keyboard: ← → untuk geser · ↑ untuk putar · ↓ untuk turun · Spasi
            untuk jatuhkan
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
        title="Papan Selesai"
        description={`${game.lines} baris tajwid berhasil dibersihkan.`}
        onRetry={game.start}
        onExit={exit}
      >
        <div className="space-y-3">
          <ProgressPanel progress={game.progress} />
          <LeaderboardPanel entries={game.leaderboard} />
        </div>
      </GameOverModal>
    </GameShell>
  );
}

export default function TajwidTetrisPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
