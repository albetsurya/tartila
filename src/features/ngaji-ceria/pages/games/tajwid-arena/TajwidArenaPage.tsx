import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ZapSvg } from "@/components/ui/CustomIcons";
import { TajwidArenaCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot, type TilaMood, type TilaAnimation } from "@/components/ui/TilaMascot";
import { playLetterAudio } from "../_shared/gameAudio";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { DeckRunMap } from "../_shared/variant/DeckRunMap";
import { MajelisScoreBoard } from "../_shared/variant/MajelisScoreBoard";
import { useTajwidArena } from "./hooks/useTajwidArena";
import { TAJWID_CARDS } from "./data/cards";
import { useGameExit } from "../_shared/hooks";
import { Card } from "./components/Card";
import { LogFeed } from "./components/LogFeed";
import { QuestionModal } from "./components/QuestionModal";

/**
 * Tidak ada nomor surah/ayat di data questions/cards, jadi pelafalan memakai
 * huruf banakar hukum tajwid via playLetterAudio (Web Speech).
 */
const RULE_LETTER: Record<string, string> = {
  idgham: "ن",
  ikhfa: "ن",
  iqlab: "ب",
  izhar: "ء",
  ghunnah: "ن",
};

function Game() {
  const game = useTajwidArena();
  const exit = useGameExit();
  const navigate = useNavigate();

  const [tilaMood, setTilaMood] = useState<TilaMood>("happy");
  const [tilaAnimation, setTilaAnimation] = useState<TilaAnimation>("bounce");
  const [tilaSpeech, setTilaSpeech] = useState<string>("Kartu siap!");

  useEffect(() => {
    if (game.playerHp <= 0) {
      setTilaMood("sad");
      setTilaAnimation("float");
      setTilaSpeech("Jangan menyerah!");
    } else if (game.playerHp < 30) {
      setTilaMood("sad");
      setTilaAnimation("float");
      setTilaSpeech("Jaga fokus!");
    } else if (game.answerStatus === "correct" || game.wins > 0) {
      setTilaMood("excited");
      setTilaAnimation("bounce");
      setTilaSpeech("Luar biasa!");
    } else {
      setTilaMood("happy");
      setTilaAnimation("bounce");
      setTilaSpeech("Kartu siap!");
    }
  }, [game.playerHp, game.answerStatus, game.wins]);

  // Audio pelafalan: huruf dari soal aktif (contoh "ب" pada hukum nun bertemu ب),
  // fallback ke huruf banakar kartu hukum; aktif hanya saat fase playing.
  useEffect(() => {
    if (game.phase !== "playing" || game.turn !== "question") return;
    const arabic = game.currentQuestion.prompt.match(/[\u0621-\u064A]/g);
    const letter =
      arabic && arabic.length > 0
        ? arabic[arabic.length - 1]
        : RULE_LETTER[game.currentQuestion.answerCard];
    if (letter) playLetterAudio(letter);
  }, [game.questionIndex, game.phase, game.turn]);

  return (
    <GameShell
      title="Tajwid Arena"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="violet"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Tajwid Arena"
          tagline="Majelis kartu · tiga sesi"
          description="Susun minimal tiga kartu ilmu. Jawab soal untuk fokus, mainkan kartu di meja majelis, ambil kartu baru, lalu pilih istirahat, khazanah, atau sesi pendalaman sebelum sesi akhir."
          coverImage={<TajwidArenaCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
          accent="violet"
        >
          <div className="mt-2 flex w-full max-w-sm flex-col gap-2 text-left">
            <p className="text-center text-[11px] font-black uppercase tracking-wider text-white/60">
              Kartu bawaanku (min. 3)
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {TAJWID_CARDS.map((card) => (
                <button
                  type="button"
                  key={card.id}
                  aria-pressed={game.deck.some((item) => item.id === card.id)}
                  onClick={() => game.toggleCard(card.id)}
                  className="game-button min-h-[44px] border-2 border-[#134E4A] bg-[#0D9488] shadow-[2px_2px_0px_#134E4A]"
                >
                  {card.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {(["easy", "normal", "hard"] as const).map((difficulty, i) => (
                <button
                  type="button"
                  key={difficulty}
                  aria-pressed={game.difficulty === difficulty}
                  onClick={() => game.setDifficulty(difficulty)}
                  className="game-button min-h-[44px] border-2 border-[#134E4A] bg-[#115E59] shadow-[2px_2px_0px_#134E4A]"
                >
                  {["Santai", "Normal", "Sulit"][i]}
                </button>
              ))}
            </div>
          </div>
        </StartScreen>
      ) : (
        <div className="space-y-3 pb-24 md:pb-32 relative">
          <HUD
            score={game.score}
            progressLabel={`Sesi ${Math.min(3, game.wins + 1)}/3 · ${game.deck.length} kartu`}
          />
          <DeckRunMap
            energy={game.energy}
            handSize={game.hand.length}
            turn={game.turn}
          />
          {/* Maskot sebagai avatar pemain */}
          <div className="pointer-events-none select-none flex items-center justify-between p-2.5 rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] text-[#134E4A]">
            <div className="flex items-center gap-3">
              <TilaMascot
                size={64}
                mood={tilaMood}
                animation={tilaAnimation}
                direction="right"
                speech={tilaSpeech}
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                  Avatar Pemain
                </span>
                <span className="text-sm font-black text-[#134E4A]">
                  Fokus: {game.playerHp}/100
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-teal-700 block">
                Energi Majelis
              </span>
              <span className="text-base font-black text-amber-600 inline-flex items-center justify-end gap-0.5">
                {game.energy}
                <ZapSvg size={14} className="text-amber-500" />
              </span>
            </div>
          </div>
          <MajelisScoreBoard
            playerHp={game.playerHp}
            rivalHp={game.aiHp}
            rivalMaxHp={game.aiMaxHp}
            rivalName={
              game.wins === 2
                ? "Sesi Akhir Majelis"
                : game.elite
                  ? "Sesi Pendalaman"
                  : "Dewan Ustadz"
            }
            roundLabel={`Sesi ${Math.min(3, game.wins + 1)}/3`}
          />
          {game.turn === "question" && (
            <QuestionModal
              question={game.currentQuestion}
              selected={game.selectedAnswer}
              status={game.answerStatus}
              onAnswer={game.answer}
            />
          )}
          {game.turn === "reward" ? (
            <div>
              <h2 className="text-sm font-bold">Pilih kartu ilmu baru</h2>
              <div className="flex flex-wrap gap-2">
                {game.rewards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => game.claimReward(card.id)}
                    className="game-button bg-teal-600"
                  >
                    Ambil {card.name}
                  </button>
                ))}
              </div>
            </div>
          ) : game.turn === "path" ? (
            <div aria-label="Jalur majelis" className="grid gap-2">
              <button
                onClick={() => game.choosePath("rest")}
                className="game-button bg-teal-700"
              >
                Istirahat · pulihkan 30 fokus
              </button>
              <button
                onClick={() => game.choosePath("treasure")}
                className="game-button bg-amber-700"
              >
                Khazanah · kartu tambahan
              </button>
              <button
                onClick={() => game.choosePath("elite")}
                className="game-button bg-rose-700"
              >
                Pendalaman · bahan 130
              </button>
            </div>
          ) : (
            <>
              <p className="rounded-2xl border-[3px] border-[#134E4A] bg-white px-3 py-2 shadow-[3px_3px_0px_#134E4A] text-xs font-bold text-[#134E4A]">
                Hand kamu · {game.hand.length}/7 · shield {game.shield}
                {game.double ? " · serangan berikutnya ×2" : ""}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {game.hand.map((card, index) => (
                  <Card
                    key={`${card.id}:${index}`}
                    card={card}
                    active={game.turn === "card"}
                    disabled={
                      game.phase !== "playing" ||
                      game.turn !== "card" ||
                      game.energy < card.energy
                    }
                    onPlay={() => game.playCard(card.id)}
                  />
                ))}
              </div>
              {game.turn === "card" && (
                <button
                  onClick={game.endTurn}
                  className="game-button w-full bg-teal-700"
                >
                  Akhiri Giliran
                </button>
              )}
            </>
          )}
          <LogFeed entries={game.log} />
        </div>
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        victory={game.playerHp > 0}
        title={game.playerHp > 0 ? "Majelis Tuntas!" : "Majelis Berakhir"}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="violet"
        description={`${game.wins}/3 sesi diselesaikan · ${game.deck.length} kartu`}
        onRetry={game.start}
        onExit={exit}
      />
    </GameShell>
  );
}
export default function TajwidArenaPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
