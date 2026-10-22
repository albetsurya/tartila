import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  closestCenter,
  type DragEndEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { AyatScrambleCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { TimerBar } from "../_shared/TimerBar";
import { ComboBadge } from "../_shared/ComboBadge";
import { ScrambleZone } from "./components/ScrambleZone";
import { AnswerSlot } from "./components/AnswerSlot";
import { HintButton } from "./components/HintButton";
import { useScrambleGame } from "./hooks/useScrambleGame";
import { DetectiveBoard } from "../_shared/variant/DetectiveBoard";
import { useGameExit } from "../_shared/hooks";
import { playVerseAudio } from "../_shared/gameAudio";

const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  // Dahulukan slot/kata daripada container besar yang juga terkena pointer.
  const specific = hits.filter((hit) => hit.id !== "source-zone");
  return specific.length ? specific : hits.length ? hits : closestCenter(args);
};
function Game() {
  const game = useScrambleGame();
  const exit = useGameExit();
  const [dragId, setDragId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const disabled = game.phase !== "playing" || game.status !== "idle";
  const allWords = [
    ...game.shuffledWords,
    ...game.slots.filter((word) => word !== null),
  ];
  const dragWord = allWords.find((word) => word.id === dragId);
  // Lantunkan ayat soal aktif setiap soal baru dimulai.
  useEffect(() => {
    const question = game.currentQuestion;
    if (game.phase === "playing" && question) {
      playVerseAudio(Number(question.id.split("-")[0]), question.ayahNumber);
    }
    // Dependensi memakai index soal + phase agar audio tak diputar ulang tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.currentIndex, game.phase]);
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDragId(null);
    if (!over) return;
    const id = String(active.id);
    const target = String(over.id);
    if (
      target === "source-zone" ||
      game.shuffledWords.some((word) => word.id === target)
    )
      game.moveWord(id, "source");
    else if (target.startsWith("slot-"))
      game.moveWord(id, Number(target.slice(5)));
    else {
      const index = game.slots.findIndex((word) => word?.id === target);
      if (index >= 0) game.moveWord(id, index);
    }
  };
  return (
    <GameShell
      title="Ayat Scramble"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="emerald"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Ayat Scramble"
          tagline="Susun ayat, jaga ritme"
          description="Drag atau tap kata dari kanan ke kiri untuk menyusun ayat. Lima soal, 45 detik per soal, dan dua hint untuk satu sesi."
          coverImage={<AyatScrambleCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
          accent="emerald"
        >
          <div className="flex w-full max-w-xs gap-2">
            {(["normal", "daily"] as const).map((mode) => (
              <button
                key={mode}
                aria-pressed={game.mode === mode}
                onClick={() => game.setMode(mode)}
                className={`game-button flex-1 border-[3px] text-[#134E4A] ${game.mode === mode ? "border-[#134E4A] bg-[#CCFBF1] shadow-[2px_2px_0px_#134E4A]" : "border-[#134E4A]/40 bg-white"}`}
              >
                {mode === "normal" ? "Biasa" : "Harian"}
              </button>
            ))}
          </div>
          {game.mode === "daily" && (
            <p className="text-xs text-[#134E4A]/70">
              Tantangan {game.dateSeed} · soal dan acakan sama sepanjang hari.
            </p>
          )}
        </StartScreen>
      ) : (
        game.currentQuestion && (
          <div className="flex flex-col flex-1 gap-3 min-h-0 justify-between">
            <HUD
              score={game.score}
              progressLabel={`Soal ${game.currentIndex + 1}/5`}
              timeLeft={game.timeLeft}
            />
            <TimerBar
              progress={game.timeLeft / 45}
              secondsLeft={game.timeLeft}
            />
            <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] p-3 shadow-[3px_3px_0px_#134E4A]">
              <p className="text-xs font-bold text-[#134E4A]">
                {game.currentQuestion.surahName} · ayat{" "}
                {game.currentQuestion.ayahNumber}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#134E4A]/70">
                {game.currentQuestion.translation}
              </p>
            </div>
            <DetectiveBoard
              surah={game.currentQuestion.surahName}
              ayah={game.currentQuestion.ayahNumber}
              placed={game.slots.filter(Boolean).length}
              total={game.currentQuestion.words.length}
            />
            <DndContext
              sensors={sensors}
              collisionDetection={collision}
              onDragStart={({ active }) => setDragId(String(active.id))}
              onDragCancel={() => setDragId(null)}
              onDragEnd={onDragEnd}
              accessibility={{
                screenReaderInstructions: {
                  draggable:
                    "Tekan spasi untuk mengambil kata, tombol panah untuk memindahkan, lalu spasi untuk meletakkan. Kamu juga bisa tap kata.",
                },
                announcements: {
                  onDragStart: () => "Kata diambil.",
                  onDragOver: ({ over }) =>
                    over
                      ? "Kata berada di atas posisi jawaban."
                      : "Geser ke posisi jawaban.",
                  onDragEnd: () => "Kata diletakkan.",
                  onDragCancel: () => "Pemindahan dibatalkan.",
                },
              }}
            >
              {/* Maskot menunjuk ke arah potongan puzzle */}
              <div className="flex items-center gap-2">
                <div className="shrink-0 flex flex-col items-center">
                  <TilaMascot
                    size={68}
                    direction="right"
                    mood={
                      game.status === "correct"
                        ? "excited"
                        : game.status === "wrong"
                          ? "sad"
                          : "thinking"
                    }
                    animation={game.status === "correct" ? "bounce" : "float"}
                    speech={game.status === "correct" ? "Tepat!" : undefined}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <ScrambleZone
                    words={game.shuffledWords}
                    disabled={disabled}
                    onTap={(id) => {
                      const index = game.slots.findIndex((word) => !word);
                      if (index >= 0) game.moveWord(id, index);
                    }}
                  />
                </div>
              </div>
              <div className={game.status === "wrong" ? "game-shake" : ""}>
                <p className="mb-2 mt-3 text-xs font-bold text-[#134E4A]/70">
                  Jawaban · urutan dari kanan → kiri
                </p>
                <div
                  dir="rtl"
                  className={`flex gap-2 overflow-x-auto rounded-2xl border p-2 ${game.status === "correct" ? "border-teal-300 bg-teal-500/20" : "border-[#134E4A]/40"}`}
                >
                  <SortableContext
                    items={game.slots
                      .filter((word) => word !== null)
                      .map((word) => word.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {game.slots.map((word, index) => (
                      <AnswerSlot
                        key={index}
                        index={index}
                        word={word}
                        locked={game.lockedPositions.includes(index)}
                        disabled={disabled}
                        onTap={() => word && game.moveWord(word.id, "source")}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
              <DragOverlay>
                {dragWord && (
                  <div
                    dir="rtl"
                    className="game-arabic rounded-xl border-2 border-[#134E4A] bg-[#0F766E] px-3 py-2 text-xl text-white shadow-[2px_2px_0px_#134E4A]"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    {dragWord.text}
                  </div>
                )}
              </DragOverlay>
            </DndContext>
            <div className="flex gap-2">
              <HintButton
                left={game.hintsLeft}
                disabled={
                  disabled ||
                  game.slots.every(
                    (word, i) => word?.text === game.currentQuestion?.words[i],
                  )
                }
                onClick={game.hint}
              />
              <button
                onClick={game.check}
                disabled={disabled || game.slots.some((word) => !word)}
                className="game-button flex-1 bg-teal-500"
              >
                Cek Jawaban
              </button>
            </div>
            <p aria-live="polite" className="text-center text-xs text-[#134E4A]/70">
              {game.status === "correct"
                ? "Tepat! Lanjut ke ayat berikutnya."
                : game.status === "wrong"
                  ? "Urutannya belum tepat. Coba geser lagi."
                  : game.status === "timeout"
                    ? `Waktu habis. Jawaban: ${game.currentQuestion.words.join(" ")}`
                    : "Tap kata di jawaban untuk mengembalikannya."}
            </p>
            <ComboBadge combo={game.streak} />
          </div>
        )
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        score={game.score}
        maxCombo={game.streak}
        victory={game.solved === 5}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="emerald"
        description={`${game.solved}/5 ayat tersusun · ${game.mode === "daily" ? `Harian ${game.dateSeed}` : "Mode biasa"}`}
        onRetry={game.start}
        onExit={exit}
      />
    </GameShell>
  );
}
export default function AyatScramblePage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
