import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DoaDungeonCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot, type TilaMood, type TilaAnimation } from "@/components/ui/TilaMascot";
import { getMascotName } from "@/utils/mascotHelper";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameOverModal } from "../_shared/GameOverModal";
import { GameShell } from "../_shared/GameShell";
import { HUD } from "../_shared/HUD";
import { StartScreen } from "../_shared/StartScreen";
import { ComboBadge } from "../_shared/ComboBadge";
import { LeaderboardPanel } from "../_shared/LeaderboardPanel";
import { ProgressPanel } from "../_shared/ProgressPanel";
import { DungeonMap } from "./components/DungeonMap";
import { useDoaDungeon } from "./hooks/useDoaDungeon";
import { QuizBattleArena } from "../_shared/battle/QuizBattleArena";
import { BattleSetupFlow } from "../_shared/battle/BattleSetupFlow";
import { useBattleSetup } from "../_shared/battle/useBattleSetup";
import { NGAJI_CERIA_ASSETS } from "../../../data/assets";

// KONSEP EKSKLUSIF: Doa Dungeon adalah satu-satunya game yang memakai
// konsep 3D fight (QuizBattleArena + BattleSetupFlow). Game quiz lain
// memakai konsep tematik masing-masing (majelis, pos langit, lentera,
// podium, taman): jangan pakai komponen battle di luar file ini.

function Game() {
  const game = useDoaDungeon();
  const navigate = useNavigate();
  const battle = useBattleSetup("cave");
  const room = game.room;
  const mascotGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotName = getMascotName(mascotGender);

  const [tilaMood, setTilaMood] = useState<TilaMood>("idle");
  const [tilaAnimation, setTilaAnimation] = useState<TilaAnimation>("float");

  useEffect(() => {
    if (game.status === "cleared" || game.attack?.attacker === "player") {
      setTilaMood("excited");
      setTilaAnimation("bounce");
    } else if (game.attack?.attacker === "monster") {
      setTilaMood("sad");
      setTilaAnimation("float");
    } else {
      setTilaMood("idle");
      setTilaAnimation("float");
    }
  }, [game.status, game.attack]);

  return (
    <GameShell
      title="Doa Dungeon"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="violet"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Doa Dungeon"
          tagline="Doa tepat, buka gerbang"
          description="Pilih karakter dan arena, lalu jelajahi enam lantai dungeon. Pilih doa yang sesuai dengan situasi penjaga, baca teks dan artinya, lalu lanjutkan perjalanan."
          coverImage={<DoaDungeonCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={() => navigate("/member/ngaji-ceria/games")}
          accent="violet"
          hideStartButton
        >
          <BattleSetupFlow
            setup={battle.setup}
            onCharacter={battle.selectCharacter}
            onArena={battle.selectArena}
            onBegin={game.start}
            accent="violet"
          />
        </StartScreen>
      ) : (
        room && (
          <div className="space-y-3 pb-24 md:pb-32 relative">
            <HUD
              score={game.score}
              progressLabel={`Lantai ${room.floor}/${game.rooms.length}`}
            />
            <DungeonMap
              total={game.rooms.length}
              current={game.roomIndex}
              cleared={game.roomIndex + (game.status === "cleared" ? 1 : 0)}
            />
            {/* Arena Petarung Maskot Neo-Brutalism */}
            <div className="rounded-3xl border-2 border-[#134E4A] bg-[#0d332d] p-4 shadow-[3px_3px_0px_#134E4A] relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-black text-teal-200 mb-1">
                    <span>{mascotName} (Hero)</span>
                    <span>{game.playerHp}/100 HP</span>
                  </div>
                  <div className="h-3 w-full bg-black/40 rounded-full border border-teal-400/30 overflow-hidden">
                    <div
                      className="h-full bg-teal-400 transition-all duration-300"
                      style={{ width: `${game.playerHp}%` }}
                    />
                  </div>
                </div>
                <span className="text-amber-300 font-black text-sm">VS</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-black text-rose-300 mb-1">
                    <span>{room.enemy}</span>
                    <span>{game.monsterHp}/{room.monsterMaxHp} HP</span>
                  </div>
                  <div className="h-3 w-full bg-black/40 rounded-full border border-rose-400/30 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-300"
                      style={{ width: `${(game.monsterHp / room.monsterMaxHp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Area duel karakter */}
              <div className="pointer-events-none select-none flex items-center justify-between px-6 py-2 min-h-[110px]">
                <motion.div
                  animate={
                    game.status === "cleared" || game.attack?.attacker === "player"
                      ? { x: [0, 50, 0] }
                      : game.attack?.attacker === "monster"
                        ? { x: [0, -10, 10, -6, 0] }
                        : { x: 0 }
                  }
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <TilaMascot
                    size={84}
                    mood={tilaMood}
                    animation={tilaAnimation}
                    direction="right"
                  />
                </motion.div>

                <motion.div
                  animate={
                    game.status === "cleared" || game.attack?.attacker === "player"
                      ? { x: [0, 10, -5, 0], filter: ["brightness(1)", "brightness(2)", "brightness(1)"] }
                      : game.attack?.attacker === "monster"
                        ? { x: [0, -40, 0] }
                        : { x: 0 }
                  }
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl border-2 border-[#134E4A] bg-rose-900/60 shadow-[2px_2px_0px_#134E4A] flex items-center justify-center p-2">
                    <img
                      src={NGAJI_CERIA_ASSETS.monsterPixel}
                      alt={room.enemy}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className="mt-1 text-[10px] font-black text-rose-200">
                    {room.enemy}
                  </span>
                </motion.div>
              </div>
            </div>
            <div className="rounded-3xl border-2 border-[#134E4A] bg-[#0d332d] p-4 text-center shadow-[2px_2px_0px_#134E4A]">
              <p className="text-xs font-black uppercase tracking-widest text-teal-200">
                Monster · {room.enemy}
              </p>
              <p className="mt-2 text-sm text-white/80">
                Pilih jawaban benar untuk memukul monster.
              </p>
              <div className="mt-3 rounded-2xl border-2 border-[#134E4A] bg-[#115E59] p-3 shadow-[1px_1px_0px_#134E4A]">
                <p className="text-xs text-teal-200/80 font-bold">
                  Situasi yang harus diingat
                </p>
                <p className="mt-1 text-sm font-black text-amber-200">
                  {room.target.judul}
                </p>
              </div>
            </div>
            {game.status === "idle" ? (
              <div className="grid gap-2">
                {room.options.map((entry) => (
                  <button
                    type="button"
                    key={entry.id}
                    data-option-correct={entry.id === room.target.id}
                    onClick={() => game.answer(entry.id)}
                    className="min-h-[48px] rounded-2xl border-2 border-[#134E4A] bg-[#0F766E] p-3 text-left transition active:scale-[.98] shadow-[2px_2px_0px_#134E4A] relative z-30"
                  >
                    <span className="block text-sm font-black text-white">
                      {entry.judul}
                    </span>
                    <span
                      lang="ar"
                      dir="rtl"
                      className="game-arabic mt-1 block text-lg leading-relaxed text-teal-100"
                    >
                      {entry.arab}
                    </span>
                    <span className="mt-1 block text-xs text-white/80">
                      {entry.arti}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              game.status === "cleared" && (
                <div className="rounded-2xl border-2 border-[#134E4A] bg-[#0F766E] p-3 text-center shadow-[2px_2px_0px_#134E4A]">
                  <p
                    lang="ar"
                    dir="rtl"
                    className="game-arabic text-xl leading-relaxed text-white"
                  >
                    {room.target.arab}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white font-medium">
                    {room.target.arti}
                  </p>
                  {game.phase === "playing" && (
                    <button
                      type="button"
                      onClick={game.nextRoom}
                      className="game-button min-h-[44px] flex items-center justify-center mt-3 w-full bg-teal-500 font-black relative z-30"
                    >
                      Turun ke Lantai Berikutnya
                    </button>
                  )}
                </div>
              )
            )}
            <p aria-live="polite" className="text-center text-xs text-white/75">
              {game.feedback}
            </p>
            <ComboBadge combo={game.combo} />
          </div>
        )
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        victory={game.outcome === "victory"}
        maxCombo={game.combo}
        title={game.outcome === "victory" ? "Victory!" : "Defeat"}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="violet"
        description={`${game.outcome === "victory" ? "Semua monster dikalahkan" : "HP pemain habis"} · ${Math.min(game.rooms.length, game.roomIndex + (game.outcome === "victory" ? 1 : 0))}/${game.rooms.length} lantai`}
        onRetry={game.start}
        onExit={() => navigate("/member/ngaji-ceria/games")}
        secondChance={
          game.canSecondChance
            ? {
                onSuccess: game.revive,
                question: "Doa sebelum masuk kamar mandi dimulai dengan…",
                options: ["Bismillah", "Selamat pagi", "Sampai jumpa"],
                correctIndex: 0,
              }
            : undefined
        }
      >
        <div className="space-y-3">
          <ProgressPanel progress={game.progress} />
          <LeaderboardPanel entries={game.leaderboard} />
        </div>
      </GameOverModal>
    </GameShell>
  );
}

export default function DoaDungeonPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
