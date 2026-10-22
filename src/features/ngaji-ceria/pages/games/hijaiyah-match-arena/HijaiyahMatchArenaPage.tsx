import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HijaiyahMatchArenaCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { TimerBar } from "../_shared/TimerBar";
import { ComboBadge } from "../_shared/ComboBadge";
import { playLetterAudio } from "../_shared/gameAudio";
import { Board } from "./components/Board";
import { ModeSelector } from "./components/ModeSelector";
import { ScorePanel } from "./components/ScorePanel";
import { useMatchGame } from "./hooks/useMatchGame";
import { TacticalBoard } from "../_shared/variant/TacticalBoard";
import { MemoryGarden } from "../_shared/variant/MemoryGarden";

function Game() {
  const game = useMatchGame();
  const navigate = useNavigate();
  const announcedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (game.phase === "idle") announcedRef.current.clear();
  }, [game.phase]);

  useEffect(() => {
    if (game.phase !== "playing") return;
    for (const card of game.cards) {
      if (
        !card.isMatched ||
        card.type !== "arabic" ||
        announcedRef.current.has(card.pairId)
      )
        continue;
      announcedRef.current.add(card.pairId);
      playLetterAudio(card.content);
    }
  }, [game.phase, game.cards]);
  const flippedCard = game.cards.find(
    (card) => card.id === game.flippedIds[game.flippedIds.length - 1],
  );
  const arabicCard = game.cards.find(
    (card) => card.pairId === flippedCard?.pairId && card.type === "arabic",
  );
  const won =
    game.mode === "solo"
      ? game.playerPairs === 8
      : game.playerPairs > game.aiPairs;
  return (
    <GameShell
      title="Hijaiyah Match Arena"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="violet"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Hijaiyah Match Arena"
          tagline="Taman memori hijaiyah"
          description="Buka kartu huruf Arab dan nama Latinnya di petak kebun. Mekarkan delapan pasang dalam 90 detik, sendiri atau berkebun bersama AI."
          coverImage={<HijaiyahMatchArenaCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={() => navigate("/member/ngaji-ceria/games")}
          accent="violet"
        >
          <ModeSelector
            mode={game.mode}
            difficulty={game.difficulty}
            onMode={game.setMode}
            onDifficulty={game.setDifficulty}
          />
        </StartScreen>
      ) : (
        <div className="space-y-3">
          <HUD
            score={game.score}
            progressLabel={`${game.playerPairs + game.aiPairs}/8 pasang`}
            timeLeft={game.timeLeft}
          />
          <TimerBar
            progress={game.timeLeft / 90}
            secondsLeft={game.timeLeft}
          />
          <MemoryGarden
            playerPairs={game.playerPairs}
            aiPairs={game.aiPairs}
            turn={game.currentTurn}
            mode={game.mode}
          />
          {game.mode === "battle" && (
            <ScorePanel
              playerScore={game.score}
              aiScore={game.aiScore}
              playerPairs={game.playerPairs}
              aiPairs={game.aiPairs}
              turn={game.currentTurn}
            />
          )}
          <TacticalBoard
            playerPairs={game.playerPairs}
            aiPairs={game.aiPairs}
            turn={game.currentTurn}
          />
          {/* Maskot berjalan di atas papan dan mengeluarkan efek saat kombo */}
          <div className="relative overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-white p-2 shadow-[3px_3px_0px_#134E4A] flex items-center justify-between min-h-[64px]">
            <motion.div
              animate={{
                x: [0, 80, 160, 240, 160, 80, 0],
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="flex items-center gap-2"
            >
              <TilaMascot
                size={52}
                mood={game.streak >= 2 ? "excited" : "happy"}
                animation={game.streak >= 2 ? "bounce" : "float"}
                direction="right"
              />
              <AnimatePresence>
                {game.streak >= 2 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }}
                    exit={{ scale: 0 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#134E4A] border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] text-[11px] font-black"
                  >
                    <span>✨</span>
                    <span>COMBO x{game.streak}!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <span className="text-[11px] font-extrabold text-[#134E4A] pr-2">
              {game.playerPairs}/8 Pasang
            </span>
          </div>
          <Board
            cards={game.cards}
            disabled={
              game.phase !== "playing" ||
              game.currentTurn === "ai" ||
              game.flippedIds.length >= 2
            }
            onFlip={game.flipPlayer}
          />
          <p aria-live="polite" className="text-center text-xs text-[#134E4A]/80">
            {game.message}
          </p>
          <ComboBadge combo={game.streak} />
        </div>
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        victory={won}
        maxCombo={game.maxCombo}
        title={game.resultTitle}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="violet"
        description={
          game.mode === "battle"
            ? `Pasangan kamu ${game.playerPairs} — AI ${game.aiPairs}. Skor AI: ${game.aiScore}.`
            : `${game.playerPairs}/8 pasangan ditemukan.`
        }
        onRetry={game.start}
        onExit={() => navigate("/member/ngaji-ceria/games")}
      />
    </GameShell>
  );
}
export default function HijaiyahMatchArenaPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
