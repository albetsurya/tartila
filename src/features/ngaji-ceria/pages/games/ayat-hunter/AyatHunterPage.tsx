import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AyatHunterCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot, type TilaDirection } from "@/components/ui/TilaMascot";
import { preloadBattleModels } from "../_shared/battle/BattleScene";
import { ComboBadge } from "../_shared/ComboBadge";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameOverModal } from "../_shared/GameOverModal";
import { GameShell } from "../_shared/GameShell";
import { HUD } from "../_shared/HUD";
import { StartScreen } from "../_shared/StartScreen";
import { TimerBar } from "../_shared/TimerBar";
import { Hunter3DScene } from "./components/Hunter3DScene";
import { LeaderboardPanel } from "../_shared/LeaderboardPanel";
import { ProgressPanel } from "../_shared/ProgressPanel";
import { HUNTER_ROUNDS, HUNTER_SECONDS } from "./data/hunter-missions";
import { useAyatHunter, type HunterDirection } from "./hooks/useAyatHunter";
import { playVerseAudio } from "../_shared/gameAudio";

const KEY_DIRECTIONS: Record<string, HunterDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

function Game() {
  const game = useAyatHunter();
  const navigate = useNavigate();
  const { phase, status, move, collect } = game;
  const mission = game.currentMission;
  const disabled = phase !== "playing" || status !== "hunting";
  const [tilaDir, setTilaDir] = useState<TilaDirection>("front");

  const handleMove = (direction: HunterDirection) => {
    if (disabled) return;
    if (direction === "up") setTilaDir("back");
    else if (direction === "down") setTilaDir("front");
    else if (direction === "left") setTilaDir("left");
    else if (direction === "right") setTilaDir("right");
    move(direction);
  };

  useEffect(() => {
    if (phase !== "playing" || status !== "hunting") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest(
          "input, textarea, select, [contenteditable='true']",
        )
      )
        return;
      const direction = KEY_DIRECTIONS[event.key];
      if (direction) {
        event.preventDefault();
        handleMove(direction);
      } else if (
        event.code === "Space" &&
        !(event.target instanceof HTMLElement && event.target.closest("button"))
      ) {
        event.preventDefault();
        collect();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, status, handleMove, collect]);

  // Pemanasan cache HTTP selagi di layar mulai agar scene 3D langsung tampil.
  useEffect(() => {
    if (phase !== "idle") return;
    preloadBattleModels(
      "/models/ngaji-ceria/desert-roblox.glb",
      "/models/ngaji-ceria/props/nature-tree.glb",
      "/models/ngaji-ceria/props/nature-rock.glb",
    );
  }, [phase]);

  // Lantunkan lafal ayat misi aktif setiap misi baru dimulai.
  useEffect(() => {
    if (phase === "playing" && mission) {
      playVerseAudio(Number(mission.id.split("-")[0]), mission.ayahNumber);
    }
    // Dependensi memakai index misi + phase agar audio tak diputar ulang tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.missionIndex, phase]);

  const endTitle =
    game.endReason === "complete" ? "Perburuan Selesai!" : "Pencarian Berakhir";
  const endDescription =
    game.endReason === "complete"
      ? `Semua ${HUNTER_ROUNDS} ayat ditemukan · kombo tertinggi ${game.maxCombo}.`
      : `${game.endReason === "timeout" ? "Waktu habis" : "Nyawa habis"} · ${game.solved}/${HUNTER_ROUNDS} ayat ditemukan.`;

  return (
    <GameShell
      title="Ayat Hunter"
      phase={phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="emerald"
    >
      {phase === "idle" ? (
        <StartScreen
          title="Ayat Hunter"
          tagline="Jelajah kebun 3D, temukan ayat"
          description="Bantu Qirra 3D mengumpulkan kata sesuai urutan ayat di kebun tiga dimensi. Ketuk petak di sebelah Qirra atau gunakan panah, lalu tekan Ambil kata. Lima misi, 60 detik per ayat, dan tiga nyawa."
          coverImage={<AyatHunterCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={() => navigate("/member/ngaji-ceria/games")}
          accent="emerald"
        />
      ) : (
        mission && (
          <div className="flex h-full min-h-0 flex-1 flex-col gap-2 overflow-hidden pb-24 md:pb-32 relative">
            <HUD
              score={game.score}
              lives={game.lives}
              progressLabel={`Misi ${game.missionIndex + 1}/${HUNTER_ROUNDS}`}
              timeLeft={game.timeLeft}
            />
            <TimerBar
              progress={game.timeLeft / HUNTER_SECONDS}
              secondsLeft={game.timeLeft}
            />
            <div
              data-testid="hunter-scene"
              className="relative -mx-3 min-h-0 flex-1 border-y border-teal-300/20 sm:-mx-4"
            >
              <div className="absolute inset-0">
                <Hunter3DScene
                  tokens={game.tokens}
                  playerCell={game.playerCell}
                  targetWord={
                    status === "cleared"
                      ? ""
                      : (mission.words[game.collected] ?? "")
                  }
                  collected={game.collected}
                  disabled={disabled}
                  active={phase === "playing"}
                  onMove={game.moveTo}
                />
              </div>
              <div className="pointer-events-none absolute inset-x-3 top-2 text-center">
                <div className="mx-auto max-w-xs rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] px-3 py-2 shadow-[3px_3px_0px_#134E4A]">
                  <p className="text-[11px] font-bold text-[#134E4A]">
                    {mission.surahName} · ayat {mission.ayahNumber} ·{" "}
                    {status === "cleared"
                      ? "ditemukan"
                      : `${game.collected}/${mission.words.length} kata`}
                  </p>
                  <p
                    data-testid="hunter-target"
                    lang="ar"
                    dir="rtl"
                    className="game-arabic mt-0.5 text-3xl leading-relaxed text-[#134E4A]"
                  >
                    {status === "cleared" ? "✓" : mission.words[game.collected]}
                  </p>
                </div>
              </div>
            </div>
            <div
              data-testid="hunter-controls"
              className="relative z-20 shrink-0 space-y-2 rounded-2xl border-[3px] border-[#134E4A] bg-white p-2 shadow-[3px_3px_0px_#134E4A]"
            >
              {/* Maskot berjalan di peta dengan arah dinamis */}
              <div className="flex items-center justify-between gap-3 px-3 py-2 bg-[#0F766E] rounded-xl border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                <div className="pointer-events-none select-none flex items-center gap-2">
                  <TilaMascot
                    size={60}
                    direction={tilaDir}
                    mood={status === "cleared" ? "excited" : "happy"}
                    animation="bounce"
                  />
                  <div className="text-[10px] text-teal-200">
                    <span className="font-bold block">Eksplorasi Kebun</span>
                    <span>Petak #{game.playerCell + 1}</span>
                  </div>
                </div>

                {/* Tombol Arah Grid */}
                <div className="grid grid-cols-3 gap-1 relative z-30">
                  <div />
                  <button
                    type="button"
                    aria-label="Atas"
                    onClick={() => handleMove("up")}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white text-base font-black shadow-[2px_2px_0px_#134E4A] active:scale-95"
                  >
                    ▲
                  </button>
                  <div />
                  <button
                    type="button"
                    aria-label="Kiri"
                    onClick={() => handleMove("left")}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white text-base font-black shadow-[2px_2px_0px_#134E4A] active:scale-95"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    aria-label="Bawah"
                    onClick={() => handleMove("down")}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white text-base font-black shadow-[2px_2px_0px_#134E4A] active:scale-95"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    aria-label="Kanan"
                    onClick={() => handleMove("right")}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white text-base font-black shadow-[2px_2px_0px_#134E4A] active:scale-95"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {status === "hunting" ? (
                <>
                  <button
                    type="button"
                    disabled={disabled || !game.standingToken}
                    onClick={collect}
                    className="game-button min-h-[48px] w-full bg-amber-600 px-2 text-base relative z-30 flex items-center justify-center gap-2"
                  >
                    <span>Ambil kata</span>
                    {game.standingToken && (
                      <span
                        lang="ar"
                        dir="rtl"
                        className="game-arabic text-2xl leading-relaxed"
                      >
                        {game.standingToken.text}
                      </span>
                    )}
                  </button>
                  <div
                    aria-label="Kata yang ditemukan"
                    className="rounded-2xl border-2 border-[#134E4A] bg-[#115E59] px-3 py-1.5 text-center shadow-[1px_1px_0px_#134E4A]"
                  >
                    <p
                      lang="ar"
                      dir="rtl"
                      className="game-arabic min-h-7 text-xl leading-relaxed text-white"
                    >
                      {mission.words.slice(0, game.collected).join(" ") || "…"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="max-h-[24dvh] overflow-y-auto rounded-2xl border-2 border-[#134E4A] bg-[#0F766E] p-3 text-center shadow-[2px_2px_0px_#134E4A]">
                  <p className="text-sm leading-relaxed text-white font-medium">
                    {mission.translation}
                  </p>
                  {phase === "playing" && (
                    <button
                      type="button"
                      onClick={game.nextMission}
                      className="game-button min-h-[44px] mt-3 w-full bg-teal-600 relative z-30 flex items-center justify-center font-black"
                    >
                      Misi Berikutnya
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="shrink-0">
              <p
                aria-live="polite"
                className="text-center text-xs leading-relaxed text-[#134E4A]/70"
              >
                {game.feedback}
              </p>
              <ComboBadge combo={game.combo} />
            </div>
          </div>
        )
      )}
      <GameOverModal
        visible={phase === "gameover"}
        title={endTitle}
        description={endDescription}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="emerald"
        maxCombo={game.maxCombo}
        victory={game.endReason === "complete"}
        onRetry={game.start}
        onExit={() => navigate("/member/ngaji-ceria/games/puzzle-huruf")}
      >
        {mission && (
          <div className="space-y-3">
            <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] p-3">
              <p className="text-xs font-bold text-[#134E4A]">
                {mission.surahName} · ayat {mission.ayahNumber}
              </p>
              <p
                lang="ar"
                dir="rtl"
                className="game-arabic mt-2 text-xl leading-relaxed text-[#134E4A]"
              >
                {mission.arabic}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#134E4A]/70">
                {mission.translation}
              </p>
            </div>
            <ProgressPanel progress={game.progress} />
            <LeaderboardPanel entries={game.leaderboard} />
          </div>
        )}
      </GameOverModal>
    </GameShell>
  );
}

export default function AyatHunterPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
