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
import { ComboBadge } from "../_shared/ComboBadge";
import { ScrambleZone } from "./components/ScrambleZone";
import { AnswerSlot } from "./components/AnswerSlot";
import { HintButton } from "./components/HintButton";
import { useScrambleGame } from "./hooks/useScrambleGame";
import { useGameExit } from "../_shared/hooks";
import { playVerseAudio } from "../_shared/gameAudio";
import { StickerButton } from "@/components/ui/StickerButton";

const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  // Dahulukan slot/kata daripada container besar yang juga terkena pointer.
  const specific = hits.filter((hit) => hit.id !== "source-zone");
  return specific.length ? specific : hits.length ? hits : closestCenter(args);
};
function Game() {
  const game = useScrambleGame();
  const exit = useGameExit("/member/ngaji-ceria/explore/training");
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
          <div className="flex w-full max-w-xs gap-3">
            {(["normal", "daily"] as const).map((mode) => {
              const isActive = game.mode === mode;
              return (
                <button
                  key={mode}
                  aria-pressed={isActive}
                  onClick={() => game.setMode(mode)}
                  className={`flex-1 py-2.5 font-black text-sm rounded-xl border-[3px] border-[#134E4A] transition-all 
                    ${
                      isActive
                        ? "bg-[#FDE047] text-[#134E4A] shadow-[3px_3px_0px_#134E4A] -translate-y-[1px]"
                        : "bg-white text-[#134E4A] shadow-[3px_3px_0px_#134E4A] hover:bg-[#FEF3C7]"
                    }
                    active:translate-y-[2px] active:translate-x-[2px] active:shadow-none cursor-pointer
                  `}
                >
                  {mode === "normal" ? "Biasa" : "Harian"}
                </button>
              );
            })}
          </div>
          {game.mode === "daily" && (
            <p className="text-xs font-bold text-[#134E4A]/70 mt-2">
              Tantangan {game.dateSeed} · soal dan acakan sama sepanjang hari.
            </p>
          )}
        </StartScreen>
      ) : (
        game.currentQuestion && (
          <div className="relative flex flex-col flex-1 min-h-0 gap-3 p-4 pt-3 justify-between overflow-hidden">
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
              {/* Panel soal & timer */}
              <div className="mx-auto w-full max-w-md shrink-0 rounded-2xl border-[3px] border-[#0F172A] bg-[#CCFBF1] p-3 shadow-[4px_4px_0_0_#000]">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#0F172A] bg-[#FEF08A] px-2 py-0.5 text-[11px] font-black text-[#0F172A] shadow-[2px_2px_0_#000]">
                    Skor {game.score}
                  </span>
                  <span className="inline-flex items-center rounded-lg border-2 border-[#0F172A] bg-white px-2 py-0.5 text-[11px] font-black text-[#0F172A] shadow-[2px_2px_0_#000]">
                    Soal {game.currentIndex + 1}/5
                  </span>
                  <span
                    className={`ml-auto inline-flex items-center rounded-lg border-2 border-[#0F172A] px-2 py-0.5 font-display text-sm font-black shadow-[2px_2px_0_#000] ${
                      game.timeLeft < 10
                        ? "bg-[#EF4444] text-white animate-pulse"
                        : "bg-white text-[#0F172A]"
                    }`}
                  >
                    {Math.ceil(game.timeLeft)}s
                  </span>
                </div>
                <p className="text-sm font-black text-[#0F172A]">
                  {game.currentQuestion.surahName} · ayat{" "}
                  {game.currentQuestion.ayahNumber}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#0F172A]/70">
                  {game.currentQuestion.translation}
                </p>
              </div>

              {/* Maskot peserta di ruang kosong antara soal dan drop zone */}
              <div className="mx-auto pointer-events-none select-none shrink-0">
                <TilaMascot
                  size={76}
                  direction="front"
                  mood="happy"
                  animation="bounce"
                  className="drop-shadow-[3px_3px_0_#134E4A]"
                />
              </div>

              {/* Drop zone besar putus-putus di tengah layar */}
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <div
                  dir="rtl"
                  className="w-full rounded-2xl border-[3px] border-dashed border-[#134E4A] bg-white/50 p-4 min-h-[160px]"
                >
                  <p className="mb-2 text-sm font-black text-[#134E4A]/80">
                    Jawaban · urutan dari kanan ke kiri
                  </p>
                  <div className="flex flex-wrap gap-2 overflow-x-auto rounded-xl border border-[#134E4A]/30 bg-white/70 p-3 min-h-[120px]">
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
              </div>

              {/* Kartu kata di bawah */}
              <div className="shrink-0 mx-auto w-full max-w-md">
                <ScrambleZone
                  words={game.shuffledWords}
                  disabled={disabled}
                  onTap={(id) => {
                    const index = game.slots.findIndex((word) => !word);
                    if (index >= 0) game.moveWord(id, index);
                  }}
                />
              </div>

              {/* Area aksi */}
            <div className="shrink-0 mx-auto flex w-full max-w-md gap-2">
                <HintButton
                  left={game.hintsLeft}
                  disabled={
                    disabled ||
                    game.slots.every(
                      (word, i) =>
                        word?.text === game.currentQuestion?.words[i],
                    )
                  }
                  onClick={game.hint}
                />
                <StickerButton
                  variant="primary" // Warna Teal Utama
                  size="lg" // Ukuran besar
                  className="flex-1" // Mengisi sisa ruang
                  onClick={game.check}
                  disabled={disabled || game.slots.some((word) => !word)}
                >
                  Cek Jawaban
                </StickerButton>
              </div>

              <DragOverlay>
                {dragWord && (
                  <div
                    dir="rtl"
                    className="game-arabic rounded-xl border-[2.5px] border-[#134E4A] bg-[#0F766E] px-3.5 py-2 text-3xl font-black text-white shadow-[2px_2px_0px_#134E4A]"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    {dragWord.text}
                  </div>
                )}
              </DragOverlay>
            </DndContext>

            <p
              aria-live="polite"
              className="shrink-0 text-center text-xs font-bold text-[#134E4A]/70"
            >
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
