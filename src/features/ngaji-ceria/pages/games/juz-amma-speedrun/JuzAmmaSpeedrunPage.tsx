import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { JuzAmmaSpeedrunCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot, type TilaMood, type TilaAnimation } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { TimerBar } from "../_shared/TimerBar";
import { ComboBadge } from "../_shared/ComboBadge";
import { QuestionCard } from "./components/QuestionCard";
import { useQuizGame } from "./hooks/useQuizGame";
import { TimeAttackTrack } from "../_shared/variant/TimeAttackTrack";
import { useGameExit } from "../_shared/hooks";
import { playVerseAudio } from "../_shared/gameAudio";

function Game() {
  const game = useQuizGame();
  const exit = useGameExit();

  const [tilaMood, setTilaMood] = useState<TilaMood>("happy");
  const [tilaAnimation, setTilaAnimation] = useState<TilaAnimation>("float");
  const [tilaSpeech, setTilaSpeech] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (game.answerState === "correct") {
      setTilaMood("excited");
      setTilaAnimation("bounce");
      setTilaSpeech("Cepat & Tepat!");
    } else if (game.answerState === "wrong" || game.answerState === "timeout") {
      setTilaMood("sad");
      setTilaAnimation("float");
      setTilaSpeech(undefined);
    } else {
      setTilaMood("happy");
      setTilaAnimation("float");
      setTilaSpeech(undefined);
    }
  }, [game.answerState]);

  // Lantunkan ayat soal aktif setiap soal baru dimulai.
  useEffect(() => {
    const question = game.currentQuestion;
    if (game.phase === "playing" && question) {
      playVerseAudio(Number(question.id.split("-")[0]), question.ayahNumber);
    }
    // Dependen memakai index soal, bukan objek soal, agar audio tak diputar ulang tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.currentIndex, game.phase]);

  return (
    <GameShell
      title="Juz Amma Speedrun"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="pink"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Juz Amma Speedrun"
          tagline="Cepat, tepat, naikkan kombo"
          description="Sepuluh soal Juz Amma: lanjutan ayat, nama surah, dan arti. Lima detik per soal, tiga nyawa. Jawab di bawah dua detik untuk bonus!"
          coverImage={<JuzAmmaSpeedrunCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
        />
      ) : (
        game.currentQuestion && (
          <div className="flex flex-col flex-1 gap-3 min-h-0 justify-between pb-24 md:pb-32 relative">
            <HUD
              score={game.score}
              lives={game.lives}
              progressLabel={`Soal ${game.currentIndex + 1}/10`}
              timeLeft={game.timeLeft}
            />
            <TimerBar
              progress={game.timeLeft / 5}
              secondsLeft={game.timeLeft}
            />
            <TimeAttackTrack
              current={game.currentIndex}
              total={10}
              label="Rute Time Attack Juz Amma"
            />
            {/* Maskot berlari di trek saat jawaban benar */}
            <div className="pointer-events-none select-none relative overflow-hidden rounded-2xl border-2 border-[#134E4A] bg-[#881337] p-2 shadow-[2px_2px_0px_#134E4A] flex items-center justify-between min-h-[64px]">
              <motion.div
                animate={
                  game.answerState === "correct"
                    ? { x: [0, 80, 0], scale: [1, 1.15, 1] }
                    : { x: [0, 15, 0] }
                }
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <TilaMascot
                  size={56}
                  mood={tilaMood}
                  animation={tilaAnimation}
                  direction="right"
                  speech={tilaSpeech}
                />
              </motion.div>
              <span className="text-[11px] font-extrabold text-rose-200 pr-2">
                Checkpoint {game.currentIndex + 1}/10
              </span>
            </div>
            <ComboBadge combo={game.combo} multiplier={game.comboMultiplier} />
            <QuestionCard
              question={game.currentQuestion}
              selectedIndex={game.selectedIndex}
              answerState={game.answerState}
              onSelect={game.answer}
            />
            <p
              aria-live="polite"
              className="min-h-5 text-center text-xs font-bold text-[#134E4A]/70"
            >
              {game.answerState === "correct"
                ? game.perfect
                  ? "Tepat & cepat! Bonus +50."
                  : "Tepat! Kombo naik."
                : game.answerState === "wrong"
                  ? "Belum tepat. Jawaban benar ditandai hijau."
                  : game.answerState === "timeout"
                    ? "Waktu habis. Lihat jawaban yang hijau."
                    : ""}
            </p>
          </div>
        )
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        score={game.score}
        maxCombo={game.maxCombo}
        victory={game.lives > 0}
        best={game.best}
        isNewRecord={game.isNewRecord}
        onRetry={game.start}
        onExit={exit}
        description={`Kombo tertinggi: ${game.maxCombo} · ${game.currentIndex + 1} soal dimainkan`}
      />
    </GameShell>
  );
}
export default function JuzAmmaSpeedrunPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
