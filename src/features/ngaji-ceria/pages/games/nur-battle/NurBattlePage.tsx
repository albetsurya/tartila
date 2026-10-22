import { useEffect } from "react";
import { NurBattleCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { TimerBar } from "../_shared/TimerBar";
import { QuestionCard } from "../juz-amma-speedrun/components/QuestionCard";
import { RoyalePanel } from "../quran-quiz-royale/components/RoyalePanel";
import { useNurBattle } from "./hooks/useNurBattle";
import { useNurBattleSocket } from "./hooks/useNurBattleSocket";
import { RoyaleStage } from "../_shared/variant/RoyaleStage";
import { LanternTower } from "../_shared/variant/LanternTower";
import { useGameExit } from "../_shared/hooks";
import { playVerseAudio } from "../_shared/gameAudio";

function Game() {
  const game = useNurBattle();
  const multiplayer = useNurBattleSocket();
  const exit = useGameExit();
  // Lantunkan ayat soal aktif setiap ronde baru dimulai.
  useEffect(() => {
    const question = game.currentQuestion;
    if (game.phase === "playing" && question) {
      playVerseAudio(Number(question.id.split("-")[0]), question.ayahNumber);
    }
    // Dependensi memakai index soal + phase agar audio tak diputar ulang tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.currentIndex, game.phase]);
  return (
    <GameShell
      title="Nur Battle"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="violet"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Nur Battle"
          tagline="Panjat menara lentera"
          description="Nyalakan tiga lantai menara lewat pilihan ganda, isian, dan susun ayat. Jawaban salah memadamkan satu sumbu."
          coverImage={<NurBattleCoverSvg size={112} />}
          best={game.best}
          onStart={() => {
            game.start();
            multiplayer.ready();
          }}
          onExit={exit}
          accent="violet"
        >
          <div className="w-full max-w-xs rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] p-3 text-left shadow-[3px_3px_0px_#134E4A]">
            <p className="text-xs font-black text-[#134E4A]">
              Mode multiplayer opsional
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#134E4A]/70">
              Practice tetap offline. Jika server Colyseus aktif, cari room
              untuk mengirim jawaban secara realtime.
            </p>
            <button
              type="button"
              onClick={() => multiplayer.join("nur-battle-lobby")}
              className="game-button mt-2 w-full border-[3px] border-[#134E4A] bg-[#0D9488] shadow-[2px_2px_0px_#134E4A]"
            >
              {multiplayer.connected ? "Terhubung ke room" : "Cari room online"}
            </button>
            {multiplayer.error && (
              <p className="mt-2 text-[10px] text-[#B45309]">
                Offline fallback aktif.
              </p>
            )}
          </div>
        </StartScreen>
      ) : (
        game.currentQuestion && (
          <div className="flex flex-col flex-1 gap-3 min-h-0 justify-between">
            <HUD
              score={game.score}
              lives={game.lives}
              progressLabel={`Ronde ${game.round} · ${game.currentIndex + 1}/10`}
              timeLeft={game.timeLeft}
            />
            <TimerBar
              progress={game.timeLeft / 10}
              secondsLeft={game.timeLeft}
            />
            {/* Indikator Energi & Hero Maskot yang muncul saat energi penuh */}
            {(() => {
              const energy = Math.min(100, Math.floor((((game.currentIndex % 3) + 1) / 3) * 100));
              return (
                <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-2.5 shadow-[3px_3px_0px_#134E4A]">
                  <div className="flex items-center justify-between text-xs font-black text-[#134E4A] mb-1">
                    <span>Nur Hero Energy</span>
                    <span>{energy}%</span>
                  </div>
                  <div className="h-3 w-full bg-[#CCFBF1] rounded-full border border-[#134E4A]/30 overflow-hidden">
                    <div
                      className="h-full bg-[#0D9488] transition-all duration-300"
                      style={{ width: `${energy}%` }}
                    />
                  </div>
                  {energy >= 100 && (
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <TilaMascot
                        size={72}
                        mood="excited"
                        animation="bounce"
                        direction="front"
                        speech="HERO NUR AKTIF!"
                      />
                    </div>
                  )}
                </div>
              );
            })()}
            <LanternTower
              round={game.round}
              lives={game.lives}
              score={game.score}
            />
            <RoyaleStage players={game.players} round={game.round} />
            <RoyalePanel players={game.players} />
            <QuestionCard
              question={game.currentQuestion}
              selectedIndex={game.selected}
              answerState={game.status}
              onSelect={(index) => {
                game.answer(index);
                multiplayer.answer(
                  game.currentQuestion?.id ?? "",
                  String(index),
                );
              }}
            />
            <p aria-live="polite" className="text-center text-xs text-[#134E4A]/70">
              {game.status === "correct"
                ? "Benar, kamu bertahan."
                : game.status === "wrong"
                  ? "Jawaban salah, satu nyawa berkurang."
                  : game.status === "timeout"
                    ? "Waktu habis, satu nyawa berkurang."
                    : "Pilih jawaban sebelum waktu habis."}
            </p>
          </div>
        )
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        victory={game.lives > 0}
        title={game.lives > 0 ? "Menara Terang" : "Tereliminasi"}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="violet"
        description={`Peringkat ${game.rank} · ${game.alivePlayers} pemain tersisa`}
        onRetry={game.start}
        onExit={exit}
        secondChance={
          game.canSecondChance
            ? {
                onSuccess: game.revive,
                question: "Apa yang dibaca sebelum memulai belajar?",
                options: ["Bismillah", "Selamat malam", "Terima kasih"],
                correctIndex: 0,
              }
            : undefined
        }
      />
    </GameShell>
  );
}

export default function NurBattlePage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
