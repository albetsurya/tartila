import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { GameStartSheet } from "../_shared/GameStartSheet";
import { GameHud } from "../_shared/GameHud";
import { GameResultModal } from "../_shared/GameResultModal";
import { HeartSvg } from "@/components/ui/CustomIcons";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  PapanKayuSkorSvg,
  PlakatTargetHarakatSvg,
} from "@/components/ui/Illustrations";
import SlasherStage from "./components/SlasherStage";
import { useSlasherGame } from "./hooks/useSlasherGame";
import {
  SLASHER_MODE_LABELS,
  type SlasherMode,
} from "./data/harakat-list";
import type { GamePhase } from "../_shared/types";
import { useGameStore } from "@/features/ngaji-ceria/hooks/useGameStore";
import { soundManager } from "@/features/ngaji-ceria/services/soundManager";

const MODES: SlasherMode[] = ["harakat", "huruf", "kata", "ayat"];

interface SlasherLevelConfig {
  level: number;
  title: string;
  targetScore: number;
  durationSeconds: number;
  description: string;
}

const SLASHER_LEVELS: SlasherLevelConfig[] = [
  { level: 1, title: "Level 1: Pemula", targetScore: 100, durationSeconds: 60, description: "Capai target 100 poin dalam 60 detik." },
  { level: 2, title: "Level 2: Terampil", targetScore: 250, durationSeconds: 60, description: "Capai target 250 poin dalam 60 detik." },
  { level: 3, title: "Level 3: Mahir", targetScore: 500, durationSeconds: 60, description: "Capai target 500 poin dalam 60 detik." },
  { level: 4, title: "Level 4: Pendekar", targetScore: 800, durationSeconds: 60, description: "Capai target 800 poin dalam 60 detik." },
  { level: 5, title: "Level 5: Master", targetScore: 1200, durationSeconds: 60, description: "Capai target 1200 poin dalam 60 detik." },
];

function Game() {
  const game = useSlasherGame();
  const navigate = useNavigate();
  const [celebrate, setCelebrate] = useState(false);
  const celebrateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unlockedLevel = useGameStore((s) => s.getUnlockedLevel("harakat-rush"));
  const unlockNextLevel = useGameStore((s) => s.unlockNextLevel);

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const currentLevelConfig = SLASHER_LEVELS[selectedLevel - 1] || SLASHER_LEVELS[0];
  const [timeLeft, setTimeLeft] = useState<number>(currentLevelConfig.durationSeconds);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);

  const {
    phase,
    mode,
    setMode,
    score,
    combo,
    lives,
    currentTarget,
    currentTargetItem,
    onSliceResult,
    resetRun,
    setPhase,
  } = game;

  // Maskot bereaksi setiap pemain berhasil menebas huruf target
  useEffect(() => {
    return () => {
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
    };
  }, []);

  const handleStartLevel = (lvl: number) => {
    setSelectedLevel(lvl);
    const cfg = SLASHER_LEVELS[lvl - 1] || SLASHER_LEVELS[0];
    setTimeLeft(cfg.durationSeconds);
    setIsWin(false);
    setIsResultOpen(false);
    resetRun();
    setPhase("playing");
  };

  const handleGameOver = (win: boolean) => {
    setIsWin(win);
    setPhase("gameover");
    setIsResultOpen(true);
    if (win) {
      soundManager.playSfx("victory");
      unlockNextLevel("harakat-rush", selectedLevel);
    } else {
      soundManager.playSfx("gameover");
    }
  };

  // Timer hitung mundur saat bermain
  useEffect(() => {
    if (phase !== "playing") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameOver(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, selectedLevel]);

  // Evaluasi win condition saat skor bertambah
  useEffect(() => {
    if (phase !== "playing") return;
    if (score >= currentLevelConfig.targetScore) {
      handleGameOver(true);
    }
  }, [score, phase, currentLevelConfig.targetScore]);

  // Evaluasi game over jika nyawa habis
  useEffect(() => {
    if (phase === "gameover" && !isResultOpen && score < currentLevelConfig.targetScore) {
      setIsWin(false);
      setIsResultOpen(true);
    }
  }, [phase, isResultOpen, score, currentLevelConfig.targetScore]);

  const handleResult = (
    kind: "correct" | "wrong" | "miss",
    symbol?: string
  ) => {
    if (kind === "correct") {
      setCelebrate(true);
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
      celebrateTimeout.current = setTimeout(() => setCelebrate(false), 750);
    }
    onSliceResult(kind, symbol);
  };

  // Hitung perolehan bintang
  const calculatedStars = isWin
    ? score >= currentLevelConfig.targetScore * 1.3 || lives === 3
      ? 3
      : score >= currentLevelConfig.targetScore
        ? 2
        : 1
    : 0;

  return (
    <div className="relative h-[100dvh] w-full select-none overflow-hidden">
      <GameShell
        title="Harakat Slasher"
        phase={phase as GamePhase}
        accent="emerald"
        tutorialGameId="harakat-rush"
        floatingTopBar
        onPause={() => setPhase("paused")}
        onResume={() => setPhase("playing")}
      >
        <GameBoundary>
          {phase === "idle" || phase === "paused" ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#1E1B4B] via-[#312E81] to-[#4C1D95] p-4">
              <GameStartSheet
                isOpen={phase === "idle"}
                gameTitle="Harakat Slasher"
                gameSubtitle="Pedang Harakat & Hijaiyah"
                ruleDescription="Tebas buah berisi huruf, kata, atau potongan ayat target sebelum waktu habis! Capai target skor untuk membuka level berikutnya."
                levels={SLASHER_LEVELS.map((l) => ({
                  level: l.level,
                  title: l.title,
                  description: l.description,
                  target: `${l.targetScore} Poin`,
                  durationSeconds: l.durationSeconds,
                }))}
                unlockedLevels={unlockedLevel}
                selectedLevel={selectedLevel}
                onSelectLevel={(lvl) => setSelectedLevel(lvl)}
                onStart={(lvl) => handleStartLevel(lvl)}
                onClose={() => navigate("/member/ngaji-ceria/games")}
              />

              {/* FASE 3: PILIHAN MODE / LEVEL SLASHER */}
              <div className="mt-4 w-full max-w-sm rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFDF0] p-3 text-center shadow-[4px_4px_0px_#134E4A]">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#134E4A] mb-2">
                  Pilih Mode Latihan:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {MODES.map((m) => {
                    const isSelected = mode === m;
                    const meta = SLASHER_MODE_LABELS[m];
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex flex-col items-center justify-center rounded-xl border-2 border-[#134E4A] p-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A] scale-[1.02]"
                            : "bg-white hover:bg-[#F0FDF4] opacity-80"
                        }`}
                      >
                        <span className="text-xs font-black text-[#134E4A]">
                          {meta.title}
                        </span>
                        <span className="text-[9px] font-bold text-[#134E4A]/70">
                          {meta.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#FEF9C3]">
              {/* UNIVERSAL GAME HUD (Header atas berisi Timer merah < 10s, Skor, Target & Lives) */}
              <GameHud
                level={selectedLevel}
                timeLeft={timeLeft}
                score={score}
                targetScore={currentLevelConfig.targetScore}
                lives={lives}
                combo={combo}
                onPause={() => setPhase("paused")}
              />

              {/* ARENA SLASHER (fisika terpusat + deteksi swipe + dynamic hitbox) */}
              <SlasherStage
                isPlaying={phase === "playing"}
                currentTarget={currentTarget}
                mode={mode}
                onResult={handleResult}
              />

              {/* PAPAN SKOR KAYU (kiri atas) */}
              <div className="pointer-events-none absolute left-3 top-14 z-30 sm:left-4 sm:top-16">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                  <PapanKayuSkorSvg size={130} className="absolute inset-0" />
                  <div className="absolute left-0 right-0 top-[22%] flex flex-col items-center gap-0.5">
                    <span className="rounded-full border-2 border-[#134E4A] bg-[#FEF3C7] px-2 text-[8px] font-black uppercase tracking-widest text-[#7C2D12]">
                      Skor
                    </span>
                    <span className="font-display text-xl font-black leading-none text-[#134E4A] drop-shadow-[1px_1px_0_rgba(255,255,255,0.8)]">
                      {score}
                    </span>
                    {combo > 1 && (
                      <span className="rounded-md border-2 border-[#134E4A] bg-[#FF6B6B] px-1.5 py-0.5 text-[9px] font-black text-white">
                        x{combo}
                      </span>
                    )}
                    <div className="mt-0.5 flex items-center gap-0.5 rounded-lg border-2 border-[#134E4A] bg-white/85 px-1 py-0.5">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <HeartSvg
                          key={i}
                          size={12}
                          className={
                            i < lives
                              ? "text-[#FF6B6B] fill-[#FF6B6B]"
                              : "text-gray-300 fill-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* TARGET INDIKATOR DI TENGAH ATAS - NEO-BRUTALISM */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-14 sm:top-16 z-30">
                <div className="flex flex-col items-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] px-4 py-2 shadow-[4px_4px_0px_#134E4A] min-w-[130px]">
                  <span className="rounded-full border-2 border-[#134E4A] bg-[#0D9488] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-[1.5px_1.5px_0px_#134E4A]">
                    TARGET
                  </span>

                  <span
                    className={`font-arabic font-black leading-tight text-[#7C2D12] text-center max-w-[200px] truncate px-1 mt-0.5 ${
                      currentTargetItem.symbol.length > 8
                        ? "text-base"
                        : currentTargetItem.symbol.length > 5
                          ? "text-lg"
                          : currentTargetItem.symbol.length > 2
                            ? "text-2xl"
                            : "text-3xl"
                    }`}
                  >
                    {currentTargetItem.symbol}
                  </span>

                  <span className="font-display text-[10px] font-black leading-tight text-[#7C2D12] text-center max-w-[180px] truncate">
                    {currentTargetItem.name}
                  </span>
                </div>
              </div>

              {/* MASKOT TILA (pojok kiri bawah di lantai dojo, melompat saat tebasan benar) */}
              <motion.div
                className="pointer-events-none absolute bottom-10 left-4 z-30 flex flex-col items-center"
                animate={{
                  y: celebrate ? [-10, -38, -4] : 0,
                  rotate: celebrate ? [0, -6, 5, 0] : 0,
                }}
                transition={{ duration: celebrate ? 0.7 : 0.3 }}
              >
                <TilaMascot
                  size={92}
                  direction="front"
                  animation="bounce"
                  mood={celebrate ? "excited" : "happy"}
                />
                <span className="mt-1 rounded-lg border-2 border-[#134E4A] bg-white px-2 py-0.5 text-[9px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  {combo > 1 ? `Combo x${combo}!` : "Tebas targetnya!"}
                </span>
              </motion.div>
            </div>
          )}

          {/* UNIVERSAL GAME RESULT MODAL */}
          <GameResultModal
            isOpen={isResultOpen}
            isWin={isWin}
            score={score}
            targetScore={currentLevelConfig.targetScore}
            stars={calculatedStars}
            level={selectedLevel}
            hasNextLevel={selectedLevel < SLASHER_LEVELS.length}
            onRetry={() => handleStartLevel(selectedLevel)}
            onNextLevel={() => handleStartLevel(selectedLevel + 1)}
            onBackToHub={() => navigate("/member/ngaji-ceria/games")}
          />
        </GameBoundary>
      </GameShell>
    </div>
  );
}

export default function HarakatRushPage() {
  return <Game />;
}
