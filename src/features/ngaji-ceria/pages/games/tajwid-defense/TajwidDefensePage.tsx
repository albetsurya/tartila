import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TajwidDefenseCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { playLetterAudio } from "../_shared/gameAudio";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { TOWER_DEFINITIONS } from "./data/towers";
import { useTajwidDefense } from "./hooks/useTajwidDefense";
import { useGameExit } from "../_shared/hooks";

/**
 * Data towers tidak memuat nomor surah/ayat, jadi pelafalan memakai huruf
 * banakar per hukum tajwid via playLetterAudio (Web Speech).
 */
const RULE_LETTER: Record<string, string> = {
  idgham: "ن",
  ikhfa: "ن",
  iqlab: "ب",
  izhar: "ء",
  ghunnah: "ن",
};

function Game() {
  const game = useTajwidDefense();
  const exit = useGameExit();
  const navigate = useNavigate();

  // Audio pelafalan: huruf banakar menara yang dipilih, hanya saat fase playing.
  useEffect(() => {
    if (game.phase !== "playing" || !game.selectedTower) return;
    const letter = RULE_LETTER[game.selectedTower];
    if (letter) playLetterAudio(letter);
  }, [game.selectedTower, game.phase]);

  return (
    <GameShell
      title="Tajwid Defense"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="emerald"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Tajwid Defense"
          tagline="Pasang hukum, jaga base"
          description="Musuh dengan tajwid yang salah berjalan menuju base. Pasang menara hukum bacaan yang tepat untuk mengalahkan sepuluh wave."
          coverImage={<TajwidDefenseCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={exit}
          accent="emerald"
        />
      ) : (
        <div className="space-y-3">
          <HUD
            score={game.score}
            progressLabel={`Wave ${Math.min(game.wave, 10)}/10`}
            lives={Math.min(3, Math.ceil(game.hp / 7))}
          />
          {/* Maskot sebagai komandan di belakang pasukan */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] text-[#134E4A]">
            <div className="flex items-center gap-2">
              <TilaMascot
                size={64}
                mood={game.hp < 10 ? "sad" : "excited"}
                animation="bounce"
                direction="right"
                speech={game.hp < 10 ? "Pertahankan!" : "Siap bertahan!"}
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                  Komandan Tajwid
                </span>
                <span className="text-xs font-bold text-[#134E4A]">
                  Base HP: {game.hp}/20
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-teal-700 block">
                Khazanah
              </span>
              <span className="text-base font-black text-amber-600">
                {game.gold}g
              </span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {TOWER_DEFINITIONS.map((tower) => (
              <button
                type="button"
                key={tower.id}
                onClick={() => game.selectTower(tower.id)}
                className={`rounded-xl border-[3px] p-2 text-center ${game.selectedTower === tower.id ? "border-[#134E4A] bg-[#CCFBF1] shadow-[2px_2px_0px_#134E4A]" : "border-[#134E4A] bg-white"}`}
              >
                <span className="game-arabic text-2xl text-[#134E4A]">
                  {tower.icon}
                </span>
                <span className="block text-[9px] font-bold text-[#134E4A]">
                  {tower.cost}g
                </span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 rounded-3xl border border-teal-300/20 bg-teal-950 p-3">
            {Array.from({ length: 20 }, (_, slot) => {
              const tower = game.towers.find((item) => item.slot === slot);
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => game.placeTower(slot)}
                  className={`flex aspect-square items-center justify-center rounded-xl border text-xl ${tower ? "border-teal-300 bg-teal-500/30" : "border-white/10 bg-white/5 text-white/20"}`}
                >
                  {tower?.definition.icon ?? "+"}
                </button>
              );
            })}
          </div>
          <div className="space-y-1">
            {game.enemies.map((enemy) => (
              <div key={enemy.id} className="flex items-center gap-2 text-xs">
                <span className="text-red-300">Musuh {enemy.weakness}</span>
                <div className="h-2 flex-1 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{ width: `${Math.max(0, enemy.hp)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        victory={game.hp > 0}
        title={game.hp > 0 ? "Base Selamat!" : "Base Jebol"}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="emerald"
        description={`Bertahan ${Math.min(game.wave, 10)}/10 wave`}
        onRetry={game.start}
        onExit={exit}
      />
    </GameShell>
  );
}
export default function TajwidDefensePage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
