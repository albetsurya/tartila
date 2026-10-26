import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { GameStartSheet } from "../_shared/GameStartSheet";
import { GameHud } from "../_shared/GameHud";
import { GameResultModal } from "../_shared/GameResultModal";
import { ComboBadge } from "../_shared/ComboBadge";
import SlasherStage from "./components/SlasherStage";
import { useSlasherGame } from "./hooks/useSlasherGame";
import { SLASHER_MODE_LABELS, type SlasherMode } from "./data/harakat-list";
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
  {
    level: 1,
    title: "Level 1: Pemula",
    targetScore: 100,
    durationSeconds: 60,
    description: "Capai target 100 poin dalam 60 detik.",
  },
  {
    level: 2,
    title: "Level 2: Terampil",
    targetScore: 250,
    durationSeconds: 60,
    description: "Capai target 250 poin dalam 60 detik.",
  },
  {
    level: 3,
    title: "Level 3: Mahir",
    targetScore: 500,
    durationSeconds: 60,
    description: "Capai target 500 poin dalam 60 detik.",
  },
  {
    level: 4,
    title: "Level 4: Pendekar",
    targetScore: 800,
    durationSeconds: 60,
    description: "Capai target 800 poin dalam 60 detik.",
  },
  {
    level: 5,
    title: "Level 5: Master",
    targetScore: 1200,
    durationSeconds: 60,
    description: "Capai target 1200 poin dalam 60 detik.",
  },
];

function Game() {
  const game = useSlasherGame();
  const navigate = useNavigate();
  const [celebrate, setCelebrate] = useState(false);
  const celebrateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unlockedLevel = useGameStore((s) => s.getUnlockedLevel("harakat-rush"));
  const unlockNextLevel = useGameStore((s) => s.unlockNextLevel);

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const currentLevelConfig =
    SLASHER_LEVELS[selectedLevel - 1] || SLASHER_LEVELS[0];
  const [timeLeft, setTimeLeft] = useState<number>(
    currentLevelConfig.durationSeconds,
  );
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
    if (
      phase === "gameover" &&
      !isResultOpen &&
      score < currentLevelConfig.targetScore
    ) {
      setIsWin(false);
      setIsResultOpen(true);
    }
  }, [phase, isResultOpen, score, currentLevelConfig.targetScore]);

  const handleResult = (
    kind: "correct" | "wrong" | "miss",
    symbol?: string,
  ) => {
    if (kind === "correct") {
      setCelebrate(true);
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
      celebrateTimeout.current = setTimeout(() => setCelebrate(false), 600);
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

  const comboMultiplier =
    combo >= 10 ? 2.0 : combo >= 5 ? 1.5 : combo >= 2 ? 1.2 : undefined;

  return (
    <div className="relative h-[100dvh] w-full select-none overflow-hidden">
      <GameShell
        title="Harakat Slasher"
        phase={phase as GamePhase}
        accent="cyan"
        tutorialGameId="harakat-rush"
        floatingTopBar
        onPause={() => setPhase("paused")}
        onResume={() => setPhase("playing")}
      >
        <GameBoundary>
          {phase === "idle" || phase === "paused" ? (
            <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#1E1B4B] via-[#312E81] to-[#4C1D95] p-4">
              {/* PILIHAN MODE LATIHAN */}
              <div className="z-20 mb-3 w-full max-w-md rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFDF0] p-3 text-center shadow-[0_5px_0px_#134E4A]">
                <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-[#134E4A]">
                  Pilih Materi Tebasan:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MODES.map((m) => {
                    const isSelected = mode === m;
                    const meta = SLASHER_MODE_LABELS[m];
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex flex-col items-center justify-center rounded-xl border-2 border-[#134E4A] px-2 py-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FEF08A] shadow-[0_3px_0px_#134E4A] -translate-y-0.5"
                            : "bg-white hover:bg-[#F0FDF4] opacity-85"
                        }`}
                      >
                        <span className="text-xs font-black text-[#134E4A] leading-tight">
                          {meta.title}
                        </span>
                        <span className="mt-0.5 text-[9px] font-bold text-[#134E4A]/70 line-clamp-1">
                          {meta.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <GameStartSheet
                isOpen={phase === "idle"}
                gameTitle="Harakat Slasher"
                gameSubtitle={`Mode: ${SLASHER_MODE_LABELS[mode].title}`}
                ruleDescription="Tebas buah berisi huruf, kata, atau potongan ayat sesuai target di tengah atas layar sebelum waktu habis!"
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
            </div>
          ) : (
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#FEF9C3]">
              {/* ============================================================
                  1. TOP HUD CLUSTER
                 ============================================================ */}
              <div className="pointer-events-none relative z-30 mx-auto flex w-full max-w-xl flex-col items-center px-3 pt-14 sm:px-4 sm:pt-3">
                {/* Baris 1: Universal Game HUD */}
                <div className="pointer-events-auto w-full">
                  <GameHud
                    level={selectedLevel}
                    timeLeft={timeLeft}
                    score={score}
                    targetScore={currentLevelConfig.targetScore}
                    lives={lives}
                    onPause={() => setPhase("paused")}
                  />
                </div>

                {/* Baris 2: Plakat Target Tebasan & Combo Badge */}
                <div className="mt-2.5 flex flex-col items-center">
                  <motion.div
                    key={currentTargetItem.symbol}
                    initial={{ scale: 0.92, y: -4 }}
                    animate={{
                      scale: celebrate ? [1, 1.08, 1] : 1,
                      y: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 360,
                      damping: 22,
                    }}
                    className={`relative flex flex-col items-center rounded-2xl border-[3px] border-[#134E4A] px-5 py-2 shadow-[0_4px_0px_#134E4A] min-w-[155px] sm:min-w-[180px] transition-colors ${
                      celebrate ? "bg-[#A7F3D0]" : "bg-[#FEF08A]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full border-2 border-[#134E4A] bg-[#0D9488] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-[1px_1px_0px_#134E4A]">
                        TARGET TEBAS
                      </span>
                      <span className="rounded-full border-2 border-[#134E4A] bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#134E4A]">
                        {SLASHER_MODE_LABELS[mode].title}
                      </span>
                    </div>

                    <div
                      dir="rtl"
                      className="my-1 flex min-h-[38px] items-center justify-center px-2"
                    >
                      <span
                        className={`font-arabic font-black leading-normal text-[#451A03] text-center max-w-[220px] truncate drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] ${
                          currentTargetItem.symbol.length > 8
                            ? "text-lg sm:text-xl"
                            : currentTargetItem.symbol.length > 5
                              ? "text-xl sm:text-2xl"
                              : currentTargetItem.symbol.length > 2
                                ? "text-2xl sm:text-3xl"
                                : "text-3xl sm:text-4xl"
                        }`}
                      >
                        {currentTargetItem.symbol}
                      </span>
                    </div>

                    <span className="rounded-md bg-[#78350F]/10 px-2.5 py-0.5 font-display text-[11px] font-black leading-tight text-[#7C2D12] text-center max-w-[200px] truncate">
                      “{currentTargetItem.name}”
                    </span>
                  </motion.div>

                  {/* Baris 3: Combo Badge */}
                  <ComboBadge
                    combo={combo}
                    multiplier={comboMultiplier}
                    className="-mt-2 z-10"
                  />
                </div>
              </div>

              {/* ============================================================
                  2. ARENA SLASHER
                 ============================================================ */}
              <div className="absolute inset-0 z-10">
                <SlasherStage
                  isPlaying={phase === "playing"}
                  currentTarget={currentTarget}
                  mode={mode}
                  onResult={handleResult}
                />
              </div>
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
