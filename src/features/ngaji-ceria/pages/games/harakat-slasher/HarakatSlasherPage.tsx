import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { GameLevelSelectSheet } from "../_shared/GameLevelSelectSheet";
import { HarakatSlasherCoverSvg } from "@/components/ui/Illustrations";
import { GameGuideModal } from "@/components/ui/GameGuideModal";
import { GameHud } from "../_shared/GameHud";
import { GameResultModal } from "../_shared/GameResultModal";
import { ComboBadge } from "../_shared/ComboBadge";
import {
  GameFeedbackToast,
  type GameFeedbackMessage,
} from "../_shared/GameFeedbackToast";
import SlasherStage from "./components/SlasherStage";
import { useSlasherGame } from "./hooks/useSlasherGame";
import {
  SLASHER_MODE_LABELS,
  extractHarakat,
  type SlasherMode,
  type SlasherTargetItem,
} from "./data/harakat-list";
import type { GamePhase } from "../_shared/types";
import { useGameStore } from "@/features/ngaji-ceria/hooks/useGameStore";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { soundManager } from "@/features/ngaji-ceria/services/soundManager";

const HARAKAT_TITLES: Record<string, string> = {
  fathah: "Fathah",
  kasrah: "Kasrah",
  dhammah: "Dhammah",
  sukun: "Sukun",
  fathatain: "Fathatain",
  kasratain: "Kasratain",
  dhammatain: "Dhammatain",
};

const MODES: SlasherMode[] = ["harakat", "huruf", "kata", "ayat"];

export interface SlasherLevelConfig {
  level: number;
  title: string;
  targetScore: number;
  targetTotal: number;
  durationSeconds: number;
  description: string;
  spawnRate: number; // jeda muncul buah dalam ms
  fallSpeed: number; // kecepatan jatuh
  distractorRatio: number; // persentase buah pengecoh (0.0 - 1.0)
  targetLength: number; // jumlah karakter target
}

export const SLASHER_LEVELS: SlasherLevelConfig[] = [
  {
    level: 1,
    title: "Level 1: Pemula",
    targetScore: 100,
    targetTotal: 10,
    durationSeconds: 60,
    description: "Tebas 10 buah berharakat target dalam 60 detik.",
    spawnRate: 1200,
    fallSpeed: 8,
    distractorRatio: 0.2,
    targetLength: 1,
  },
  {
    level: 2,
    title: "Level 2: Terampil",
    targetScore: 200,
    targetTotal: 12,
    durationSeconds: 60,
    description: "Tebas 12 buah berharakat target dalam 60 detik.",
    spawnRate: 1000,
    fallSpeed: 10,
    distractorRatio: 0.35,
    targetLength: 2,
  },
  {
    level: 3,
    title: "Level 3: Mahir",
    targetScore: 350,
    targetTotal: 15,
    durationSeconds: 60,
    description: "Tebas 15 buah berharakat target dalam 60 detik.",
    spawnRate: 800,
    fallSpeed: 12,
    distractorRatio: 0.5,
    targetLength: 3,
  },
  {
    level: 4,
    title: "Level 4: Pendekar",
    targetScore: 500,
    targetTotal: 18,
    durationSeconds: 60,
    description: "Tebas 18 buah berharakat target dalam 60 detik.",
    spawnRate: 600,
    fallSpeed: 15,
    distractorRatio: 0.65,
    targetLength: 4,
  },
  {
    level: 5,
    title: "Level 5: Master",
    targetScore: 750,
    targetTotal: 20,
    durationSeconds: 60,
    description: "Tebas 20 buah berharakat target dalam 60 detik.",
    spawnRate: 450,
    fallSpeed: 18,
    distractorRatio: 0.75,
    targetLength: 5,
  },
];

function Game() {
  const [celebrate, setCelebrate] = useState(false);
  const celebrateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [feedback, setFeedback] = useState<GameFeedbackMessage | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const triggerFeedback = useCallback(
    (msg: { text: string; type: "correct" | "wrong"; arabicText?: string }) => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
      setFeedback({ id: Date.now(), ...msg });
      feedbackTimeout.current = setTimeout(() => setFeedback(null), 1800);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    };
  }, []);

  const unlockedLevel = useGameStore((s) => s.getUnlockedLevel("harakat-rush"));
  const unlockNextLevel = useGameStore((s) => s.unlockNextLevel);
  const recordLearningResult = useGameStore((s) => s.recordLearningResult);
  const consumeTicket = useEconomyStore((s) => s.consumeTicket);

  const game = useSlasherGame();

  const {
    phase,
    mode,
    setMode,
    session,
    level,
    score,
    combo,
    lives,
    currentTarget,
    currentTargetItem,
    onSliceResult,
    setPhase,
    isWin,
    loseReason,
    handleTimeout,
  } = game;

  const selectedLevel = session.currentLevel;
  const currentLevelConfig =
    SLASHER_LEVELS[selectedLevel - 1] || SLASHER_LEVELS[0];

  const [timeLeft, setTimeLeft] = useState<number | undefined>(
    session.mode === "practice" ? undefined : currentLevelConfig.durationSeconds,
  );

  useEffect(() => {
    return () => {
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
    };
  }, []);

  const handleSelectLevel = async (
    idx: number,
    gameMode: "practice" | "challenge"
  ) => {
    if (gameMode === "challenge") {
      const ok = await consumeTicket();
      if (!ok) return;
    }
    const cfg = SLASHER_LEVELS[idx] || SLASHER_LEVELS[0];
    setTimeLeft(gameMode === "practice" ? undefined : cfg.durationSeconds);
    game.handleStartLevel(idx + 1, cfg.targetTotal, gameMode);
  };

  const handleStartLevel = (lvl: number, mode?: "practice" | "challenge") => {
    const activeMode = mode ?? session.mode;
    const cfg = SLASHER_LEVELS[lvl - 1] || SLASHER_LEVELS[0];
    setTimeLeft(activeMode === "practice" ? undefined : cfg.durationSeconds);
    game.handleStartLevel(lvl, cfg.targetTotal, activeMode);
  };

  const handleNextLevel = () => {
    if (selectedLevel < SLASHER_LEVELS.length) {
      const nextLvl = selectedLevel + 1;
      const nextCfg = SLASHER_LEVELS[nextLvl - 1] || SLASHER_LEVELS[0];
      setTimeLeft(session.mode === "practice" ? undefined : nextCfg.durationSeconds);
      game.handleNextLevel(nextCfg.targetTotal);
    } else {
      navigate("/member/ngaji-ceria/games");
    }
  };

  useEffect(() => {
    if (phase !== "playing" || session.mode === "practice") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === undefined) return undefined;
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, session.mode, handleTimeout]);

  useEffect(() => {
    if (phase === "gameover") {
      if (isWin) {
        unlockNextLevel("harakat-rush", selectedLevel);
      }
      if (level.accuracy !== undefined && level.accuracy !== null) {
        recordLearningResult(
          "harakat-rush",
          level.accuracy,
          level.learningSummary?.recommendation ? [level.learningSummary.recommendation] : []
        );
      }
    }
  }, [
    phase,
    isWin,
    selectedLevel,
    unlockNextLevel,
    level.accuracy,
    level.learningSummary,
    recordLearningResult,
  ]);

  const handleResult = (
    kind: "correct" | "wrong" | "miss" | "bomb",
    symbol?: string,
    item?: SlasherTargetItem,
  ) => {
    if (kind === "correct") {
      setCelebrate(true);
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
      celebrateTimeout.current = setTimeout(() => setCelebrate(false), 600);

      const targetHarakat =
        currentTargetItem.harakatName ??
        extractHarakat(currentTargetItem.symbol);
      const harakatName = targetHarakat
        ? HARAKAT_TITLES[targetHarakat] || targetHarakat
        : "";
      const text =
        mode === "harakat" && harakatName
          ? `Hebat! Itu ${harakatName}.`
          : "Hebat! Tebasan tepat.";
      triggerFeedback({ text, type: "correct", arabicText: symbol });
    } else if (kind === "wrong") {
      const slicedHarakat = item?.harakatName ?? extractHarakat(symbol);
      const harakatName = slicedHarakat
        ? HARAKAT_TITLES[slicedHarakat] || slicedHarakat
        : "";
      const text =
        mode === "harakat" && harakatName
          ? `Hampir benar! Itu ${harakatName}.`
          : `Bukan itu. Cari ${currentTargetItem.symbol} ya!`;
      triggerFeedback({ text, type: "wrong", arabicText: symbol });
    } else if (kind === "miss") {
      triggerFeedback({
        text: "Target terlewat! Tetap fokus ya.",
        type: "wrong",
      });
    } else if (kind === "bomb") {
      triggerFeedback({
        text: "Awas bom! Jangan tebas yang bertanda bahaya.",
        type: "wrong",
      });
    }
    onSliceResult(kind, symbol, item);
  };

  const calculatedStars = isWin
    ? lives === 3 || score >= currentLevelConfig.targetScore * 1.2
      ? 3
      : lives === 2 || score >= currentLevelConfig.targetScore * 0.7
        ? 2
        : 1
    : 0;

  const comboMultiplier =
    combo >= 10 ? 2.0 : combo >= 5 ? 1.5 : combo >= 2 ? 1.2 : undefined;

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="relative h-[100dvh] w-full select-none overflow-hidden">
      <GameShell
        title="Harakat Slasher"
        phase={phase as GamePhase}
        accent="cyan"
        tutorialGameId="harakat-rush"
        guideGameId="harakat-slasher"
        floatingTopBar
        onPause={() => setPhase("paused")}
        onResume={() => setPhase("playing")}
      >
        <GameBoundary>
          {phase === "idle" ? (
            <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#1E1B4B] via-[#312E81] to-[#4C1D95] p-4">
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

              <GameLevelSelectSheet
                isOpen={phase === "idle"}
                onClose={() => navigate("/member/ngaji-ceria/games")}
                gameTitle="Harakat Slasher"
                gameIcon={<HarakatSlasherCoverSvg size={22} />}
                levels={SLASHER_LEVELS.map((l) => ({
                  id: l.level,
                  title: l.title,
                  description: l.description,
                }))}
                unlockedCount={unlockedLevel}
                onSelectLevel={handleSelectLevel}
                onOpenGuide={() => setIsGuideOpen(true)}
              />
              <GameGuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                gameId="harakat-slasher"
              />
            </div>
          ) : (
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#FEF9C3]">
              <div className="pointer-events-none relative z-30 mx-auto flex w-full max-w-xl flex-col items-center px-3 pt-14 sm:px-4 sm:pt-3">
                <div className="pointer-events-auto w-full">
                  <GameHud
                    level={selectedLevel}
                    mode={session.mode}
                    timeLeft={session.mode === "practice" ? undefined : timeLeft}
                    score={score}
                    targetScore={currentLevelConfig.targetScore}
                    lives={session.mode === "practice" ? undefined : lives}
                  />
                </div>

                <GameFeedbackToast
                  feedback={feedback}
                  className="top-48 sm:top-44"
                />

                <div className="mt-2.5 flex flex-col items-center">
                  <motion.div
                    key={currentTargetItem.id + currentTargetItem.symbol}
                    initial={{ scale: 0.92, y: -4 }}
                    animate={{ scale: celebrate ? [1, 1.08, 1] : 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 360, damping: 22 }}
                    className={`relative flex flex-col items-center rounded-2xl border-[3px] border-[#134E4A] px-6 py-2.5 shadow-[0_4px_0px_#134E4A] min-w-[170px] sm:min-w-[210px] transition-colors ${
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
                      className="my-1 flex min-h-[56px] items-center justify-center px-4 py-1 flex-shrink-0"
                    >
                      <span
                        className={`font-arabic font-black leading-relaxed text-[#134E4A] text-center drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] select-none ${
                          mode === "harakat" || currentTargetItem.symbol.length <= 3
                            ? "text-4xl sm:text-5xl"
                            : currentTargetItem.symbol.length > 12
                              ? "text-lg sm:text-xl"
                              : currentTargetItem.symbol.length > 6
                                ? "text-xl sm:text-2xl"
                                : "text-2xl sm:text-3xl"
                        }`}
                      >
                        {currentTargetItem.symbol}
                      </span>
                    </div>

                    <div className="rounded-lg border-2 border-[#134E4A] bg-[#FFFBEB] px-3 py-0.5 shadow-[1px_1px_0px_#134E4A]">
                      <span className="font-display text-xs sm:text-sm font-black text-[#7C2D12] text-center max-w-[240px] truncate block">
                        {mode === "harakat"
                          ? `Tebas Harakat: ${currentTargetItem.name}`
                          : `“${currentTargetItem.name}”`}
                      </span>
                    </div>
                  </motion.div>

                  <ComboBadge
                    combo={combo}
                    multiplier={comboMultiplier}
                    className="-mt-2 z-10"
                  />
                </div>
              </div>

              <div className="absolute inset-0 z-10">
                <SlasherStage
                  isPlaying={phase === "playing"}
                  isPaused={phase === "paused"}
                  currentTarget={currentTarget}
                  currentTargetItem={currentTargetItem}
                  mode={mode}
                  gameMode={session.mode}
                  levelConfig={currentLevelConfig}
                  onResult={handleResult}
                />
              </div>
            </div>
          )}

          <GameResultModal
            isOpen={phase === "gameover"}
            isWin={isWin}
            loseReason={loseReason}
            score={score}
            targetScore={currentLevelConfig.targetScore}
            stars={calculatedStars}
            level={selectedLevel}
            hasNextLevel={selectedLevel < SLASHER_LEVELS.length}
            learningSummary={level.learningSummary}
            onRetry={() => handleStartLevel(selectedLevel)}
            onNextLevel={handleNextLevel}
            onBackToHub={() => navigate("/member/ngaji-ceria/games")}
          />
        </GameBoundary>
      </GameShell>
    </div>
  );
}

export default function HarakatSlasherPage() {
  return <Game />;
}
