import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  SessionState,
  LevelState,
  LearningSummary,
  HarakatAccuracyStat,
} from "@/features/ngaji-ceria/types/game";
import {
  HARAKAT_LIST,
  HARAKAT_DEFINITIONS,
  SLASHER_LEVELS,
  getSlasherItems,
  extractHarakat,
  matchesSlasherTarget,
  type HarakatName,
  type HarakatTargetMode,
  type SlasherMode,
  type SlasherTargetItem,
} from "../data/harakat-list";
import { playLetterAudio } from "../../_shared/gameAudio";
import { playSfx } from "../../_shared/audio";
import { getBest, setBest } from "../../_shared/storage";
import {
  computeAdaptiveDifficulty,
  type AdaptiveOutput,
} from "../../_shared/adaptiveDifficulty";

export { matchesSlasherTarget, computeAdaptiveDifficulty };

export type SlasherPhase = "idle" | "playing" | "paused" | "gameover";

export type SlashResultKind = "correct" | "wrong" | "miss" | "bomb";

export interface SlasherLevelOptions {
  level?: number;
  spawnRate?: number;
  fallSpeed?: number;
  distractorRatio?: number;
  targetLength?: number;
  targetScore?: number;
  durationSeconds?: number;
  targetTotal?: number;
}

const INITIAL_HARAKAT_STATS: Record<string, HarakatAccuracyStat> = {
  fathah: { correct: 0, wrong: 0 },
  kasrah: { correct: 0, wrong: 0 },
  dhammah: { correct: 0, wrong: 0 },
};

export function computeSlasherSummary(
  correct: number,
  wrong: number,
  missed: number,
  byHarakat: Partial<Record<string, HarakatAccuracyStat>>,
  won: boolean
): LearningSummary {
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : null;

  const titleMap: Record<string, string> = {
    fathah: "Fathah",
    kasrah: "Kasrah",
    dhammah: "Dhammah",
  };

  let bestHarakat = "";
  let maxCorrect = -1;
  let worstHarakat = "";
  let maxWrong = 0;

  for (const [key, stat] of Object.entries(byHarakat)) {
    if (stat && stat.correct > maxCorrect) {
      maxCorrect = stat.correct;
      bestHarakat = titleMap[key] || key;
    }
    if (stat && stat.wrong > maxWrong) {
      maxWrong = stat.wrong;
      worstHarakat = titleMap[key] || key;
    }
  }

  const appreciation = won
    ? bestHarakat && maxCorrect > 0
      ? `Kamu sudah sangat baik mengenali ${bestHarakat}!`
      : "Alhamdulillah! Akurasi tebasan harakatmu sangat baik."
    : "Usaha yang bagus! Tetap semangat berlatih mengenali harakat.";

  const recommendation = !won
    ? worstHarakat && maxWrong > 0
      ? `Ayo latih lagi membedakan ${worstHarakat} dengan harakat lainnya.`
      : "Ayo lebih teliti memperhatikan posisi baris harakat sebelum menebas!"
    : "Pertahankan ketelitianmu untuk level tantangan berikutnya!";

  return {
    accuracy,
    totalCorrect: correct,
    totalWrong: wrong,
    totalMissed: missed,
    accuracyByHarakat: byHarakat,
    appreciation,
    recommendation,
  };
}

/**
 * Helper untuk membuat target dinamis dengan panjang targetLength.
 * Menggabungkan item dari pool (harakat/huruf/kata/ayat).
 * Contoh Level 2: 'بَ' + 'تَ' = 'بَ تَ' (keduanya Fathah)
 */
/**
 * Helper untuk membuat target pembelajaran Harakat Slasher (Bab 6.2 & 6.3).
 * - Mode "harakat": Target HANYA tanda harakat murni (Fathah, Kasrah, Dhammah, Sukun, dll).
 *   Namanya murni tanda baca ("Fathah") dan simbolnya huruf jelas ('بَ').
 *   DILARANG menghasilkan nama gabungan spesifik seperti "Ra Sukun" di mode ini!
 * - Mode lainnya ("huruf" | "kata" | "ayat"): Menggunakan targetMode "syllable"
 *   dengan pencocokan string teks spesifik.
 */
export function generateSlasherTarget(
  pool: readonly SlasherTargetItem[],
  targetLength: number = 1,
  modeOverride?: SlasherMode
): SlasherTargetItem {
  const currentMode = modeOverride ?? pool[0]?.category ?? "harakat";

  if (currentMode === "harakat") {
    const def =
      HARAKAT_DEFINITIONS[
        Math.floor(Math.random() * HARAKAT_DEFINITIONS.length)
      ];
    return {
      id: `harakat_${def.harakatName}`,
      name: def.name,
      symbol: def.exampleLetter,
      category: "harakat",
      targetMode: "harakat",
      harakatName: def.harakatName,
      sound: def.sound,
    };
  }

  if (!pool || pool.length === 0) {
    return {
      id: "alif",
      name: "Alif",
      symbol: "ا",
      category: "huruf",
      targetMode: "syllable",
    };
  }

  const length = Math.max(1, targetLength);
  if (length === 1) {
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
      ...item,
      targetMode: "syllable",
    };
  }

  const picked: SlasherTargetItem[] = [];
  for (let i = 0; i < length; i++) {
    picked.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  return {
    id: picked.map((p) => p.id).join("_"),
    name: picked.map((p) => p.name).join(" - "),
    symbol: picked.map((p) => p.symbol).join(" "),
    category: currentMode,
    targetMode: "syllable",
  };
}

export function useSlasherGame(levelConfig?: SlasherLevelOptions) {
  const [phase, setPhase] = useState<SlasherPhase>("idle");
  const [mode, setMode] = useState<SlasherMode>("harakat");
  const [isWin, setIsWin] = useState<boolean>(false);
  const [loseReason, setLoseReason] = useState<"lives" | "time" | null>(null);

  const initialTargetTotal =
    levelConfig?.targetTotal ??
    (levelConfig?.level ? 8 + levelConfig.level * 2 : 10);

  // State Session (bertahan selama 1 sesi game, tiket hanya dipotong sekali di lobby)
  const [session, setSession] = useState<SessionState>(() => ({
    sessionId: `slasher-${Date.now()}`,
    userId: "guest",
    gameId: "harakat-slasher",
    mode: "challenge",
    currentLevel: levelConfig?.level ?? 1,
    totalScore: 0,
    completedLevels: [],
    status: "active",
    ticketConsumed: true,
    rewardClaimedLevelIds: [],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // State Level (direset setiap retry atau pindah level)
  const [level, setLevel] = useState<LevelState>(() => {
    const summary = computeSlasherSummary(0, 0, 0, INITIAL_HARAKAT_STATS, false);
    return {
      levelId: `slasher-level-${levelConfig?.level ?? 1}`,
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      wrongCount: 0,
      missedCount: 0,
      targetProgress: 0,
      targetTotal: initialTargetTotal,
      remainingTime: levelConfig?.durationSeconds ?? 60,
      isCompleted: false,
      isFailed: false,
      startedAt: Date.now(),
      accuracy: null,
      accuracyByHarakat: { ...INITIAL_HARAKAT_STATS },
      learningSummary: summary,
    };
  });

  const activePool = useMemo(() => getSlasherItems(mode), [mode]);
  const targetLength = Math.max(1, levelConfig?.targetLength ?? 1);

  const [currentTargetItem, setCurrentTargetItem] = useState<SlasherTargetItem>(() =>
    generateSlasherTarget(activePool, targetLength, mode)
  );
  const [best, setBestState] = useState(() => getBest("harakat-rush"));

  const scoreRef = useRef(0);

  const pickNewTarget = useCallback(() => {
    const items = getSlasherItems(mode);
    setCurrentTargetItem(generateSlasherTarget(items, targetLength, mode));
  }, [mode, targetLength]);

  // Saat mode atau targetLength berganti, perbarui target aktif
  useEffect(() => {
    pickNewTarget();
  }, [pickNewTarget]);

  const handleTimeout = useCallback(() => {
    setIsWin(false);
    setLoseReason("time");
    setPhase("gameover");
    playSfx("gameover");
    setLevel((prev) => {
      const summary = computeSlasherSummary(
        prev.correctCount,
        prev.wrongCount,
        prev.missedCount,
        prev.accuracyByHarakat ?? INITIAL_HARAKAT_STATS,
        false
      );
      return {
        ...prev,
        isFailed: true,
        accuracy: summary.accuracy,
        learningSummary: {
          ...summary,
          recommendation: "Waktu tantangan selesai! Ayo latih kecepatan dan ketelitian mengenali harakat.",
        },
      };
    });
  }, []);

  // Hasil tebasan / lolos dari SlasherStage:
  // 1. correct: tambah skor (+25) & combo, mainkan audio, rekam statistik harakat
  // 2. wrong (menebas pengecoh): penalti nyawa -1 (challenge) & penalti skor (-15 di challenge), rekam statistik salah
  // 3. miss (target jatuh lolos melewati batas bawah): penalti nyawa -1 (challenge)
  const onSliceResult = useCallback(
    (kind: SlashResultKind, symbol?: string, item?: SlasherTargetItem) => {
      const rawTargetHarakat =
        item?.harakatName ??
        extractHarakat(symbol) ??
        currentTargetItem.harakatName ??
        extractHarakat(currentTargetItem.symbol);
      const harakatKey =
        rawTargetHarakat && ["fathah", "kasrah", "dhammah"].includes(rawTargetHarakat)
          ? rawTargetHarakat
          : "fathah";

      if (kind === "correct") {
        const next = scoreRef.current + 25;
        scoreRef.current = next;

        setLevel((prev) => {
          const nextProgress = prev.targetProgress + 1;
          const won = nextProgress >= prev.targetTotal;
          if (won) {
            setIsWin(true);
            setLoseReason(null);
            setPhase("gameover");
            playSfx("level-up");
          }
          const nextCorrect = prev.correctCount + 1;
          const prevHarakat = prev.accuracyByHarakat ?? INITIAL_HARAKAT_STATS;
          const currentStat = prevHarakat[harakatKey] ?? { correct: 0, wrong: 0 };
          const nextByHarakat = {
            ...prevHarakat,
            [harakatKey]: {
              ...currentStat,
              correct: currentStat.correct + 1,
            },
          };
          const summary = computeSlasherSummary(
            nextCorrect,
            prev.wrongCount,
            prev.missedCount,
            nextByHarakat,
            won
          );
          return {
            ...prev,
            score: next,
            combo: prev.combo + 1,
            maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
            correctCount: nextCorrect,
            targetProgress: nextProgress,
            isCompleted: won,
            accuracy: summary.accuracy,
            accuracyByHarakat: nextByHarakat,
            learningSummary: summary,
          };
        });

        setBestState((prevBest) => {
          if (next > prevBest) {
            setBest("harakat-rush", next);
            return next;
          }
          return prevBest;
        });

        if (symbol) playLetterAudio(symbol);
      } else if (kind === "wrong") {
        const slicedHarakat = item?.harakatName ?? extractHarakat(symbol);
        const wrongKey =
          slicedHarakat && ["fathah", "kasrah", "dhammah"].includes(slicedHarakat)
            ? slicedHarakat
            : harakatKey;

        const isPractice = session.mode === "practice";
        if (session.mode === "challenge") {
          const next = Math.max(0, scoreRef.current - 15);
          scoreRef.current = next;
        }

        setLevel((prev) => {
          const nextL = isPractice ? prev.lives : Math.max(0, prev.lives - 1);
          const isFailed = !isPractice && nextL <= 0;
          if (isFailed) {
            setIsWin(false);
            setLoseReason("lives");
            setPhase("gameover");
            playSfx("gameover");
          }
          const nextWrong = prev.wrongCount + 1;
          const prevHarakat = prev.accuracyByHarakat ?? INITIAL_HARAKAT_STATS;
          const currentStat = prevHarakat[wrongKey] ?? { correct: 0, wrong: 0 };
          const nextByHarakat = {
            ...prevHarakat,
            [wrongKey]: {
              ...currentStat,
              wrong: currentStat.wrong + 1,
            },
          };
          const summary = computeSlasherSummary(
            prev.correctCount,
            nextWrong,
            prev.missedCount,
            nextByHarakat,
            false
          );
          return {
            ...prev,
            score: isPractice ? prev.score : scoreRef.current,
            lives: nextL,
            combo: 0,
            wrongCount: nextWrong,
            isFailed,
            accuracy: summary.accuracy,
            accuracyByHarakat: nextByHarakat,
            learningSummary: summary,
          };
        });
      } else if (kind === "miss") {
        const isPractice = session.mode === "practice";
        setLevel((prev) => {
          const nextL = isPractice ? prev.lives : Math.max(0, prev.lives - 1);
          const isFailed = !isPractice && nextL <= 0;
          if (isFailed) {
            setIsWin(false);
            setLoseReason("lives");
            setPhase("gameover");
            playSfx("gameover");
          }
          const nextMissed = prev.missedCount + 1;
          const summary = computeSlasherSummary(
            prev.correctCount,
            prev.wrongCount,
            nextMissed,
            prev.accuracyByHarakat ?? INITIAL_HARAKAT_STATS,
            false
          );
          return {
            ...prev,
            lives: nextL,
            combo: 0,
            missedCount: nextMissed,
            isFailed,
            accuracy: summary.accuracy,
            learningSummary: summary,
          };
        });
      } else if (kind === "bomb") {
        // HAZARD BOM (Bab 6.11): Kurangi 1 nyawa di challenge mode, reset combo, mainkan SFX, TANPA instant game over
        playSfx("wrong");
        const isPractice = session.mode === "practice";
        if (session.mode === "challenge") {
          const next = Math.max(0, scoreRef.current - 20);
          scoreRef.current = next;
        }

        setLevel((prev) => {
          const nextL = isPractice ? prev.lives : Math.max(0, prev.lives - 1);
          const isFailed = !isPractice && nextL <= 0;
          if (isFailed) {
            setIsWin(false);
            setLoseReason("lives");
            setPhase("gameover");
            playSfx("gameover");
          }
          const nextWrong = prev.wrongCount + 1;
          const summary = computeSlasherSummary(
            prev.correctCount,
            nextWrong,
            prev.missedCount,
            prev.accuracyByHarakat ?? INITIAL_HARAKAT_STATS,
            false
          );
          return {
            ...prev,
            score: isPractice ? prev.score : scoreRef.current,
            lives: nextL,
            combo: 0,
            wrongCount: nextWrong,
            isFailed,
            accuracy: summary.accuracy,
            learningSummary: {
              ...summary,
              recommendation: "Awas bom bahaya! Hindari menebas bom di mode tantangan.",
            },
          };
        });
      }
    },
    [session.mode, currentTargetItem]
  );

  // Target berganti berkala (12 detik) saat game berlangsung
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      pickNewTarget();
    }, 12000);
    return () => clearInterval(interval);
  }, [phase, pickNewTarget]);

  // handleStartLevel: inisialisasi level tertentu atau retry
  const handleStartLevel = useCallback(
    (
      lvl: number,
      totalTargets?: number,
      gameMode?: "practice" | "challenge"
    ) => {
      const activeMode = gameMode ?? session.mode;
      const targetTot =
        totalTargets ??
        (levelConfig?.targetTotal ?? (lvl ? 8 + lvl * 2 : 10));
      setSession((s) => ({
        ...s,
        currentLevel: lvl,
        mode: activeMode,
        ticketConsumed: activeMode === "challenge",
        status: "active",
        updatedAt: new Date().toISOString(),
      }));
      scoreRef.current = 0;
      setIsWin(false);
      setLoseReason(null);
      const initialSummary = computeSlasherSummary(0, 0, 0, INITIAL_HARAKAT_STATS, false);
      setLevel({
        levelId: `slasher-level-${lvl}`,
        score: 0,
        lives: activeMode === "practice" ? 99 : 3,
        combo: 0,
        maxCombo: 0,
        correctCount: 0,
        wrongCount: 0,
        missedCount: 0,
        targetProgress: 0,
        targetTotal: targetTot,
        remainingTime:
          activeMode === "practice"
            ? undefined
            : (levelConfig?.durationSeconds ?? 60),
        isCompleted: false,
        isFailed: false,
        startedAt: Date.now(),
        accuracy: null,
        accuracyByHarakat: { ...INITIAL_HARAKAT_STATS },
        learningSummary: initialSummary,
      });
      const items = getSlasherItems(mode);
      setCurrentTargetItem(generateSlasherTarget(items, targetLength, mode));
      setPhase("playing");
    },
    [mode, targetLength, session.mode, levelConfig?.targetTotal, levelConfig?.durationSeconds]
  );

  // handleNextLevel: HANYA menaikkan currentLevel & mereset state level (DILARANG navigate atau potong tiket)
  const handleNextLevel = useCallback(
    (nextLvlTotal?: number) => {
      const nextLvl = session.currentLevel + 1;
      const targetTot =
        nextLvlTotal ??
        (levelConfig?.targetTotal ?? (nextLvl ? 8 + nextLvl * 2 : 10));
      setSession((s) => ({
        ...s,
        currentLevel: nextLvl,
        totalScore: s.totalScore + scoreRef.current,
        completedLevels: Array.from(new Set([...s.completedLevels, s.currentLevel])),
        updatedAt: new Date().toISOString(),
      }));
      scoreRef.current = 0;
      setIsWin(false);
      setLoseReason(null);
      const initialSummary = computeSlasherSummary(0, 0, 0, INITIAL_HARAKAT_STATS, false);
      setLevel((prev) => ({
        ...prev,
        levelId: `slasher-level-${nextLvl}`,
        score: 0,
        lives: session.mode === "practice" ? 99 : 3,
        combo: 0,
        maxCombo: 0,
        correctCount: 0,
        wrongCount: 0,
        missedCount: 0,
        targetProgress: 0,
        targetTotal: targetTot,
        remainingTime:
          session.mode === "practice"
            ? undefined
            : (levelConfig?.durationSeconds ?? 60),
        isCompleted: false,
        isFailed: false,
        startedAt: Date.now(),
        accuracy: null,
        accuracyByHarakat: { ...INITIAL_HARAKAT_STATS },
        learningSummary: initialSummary,
      }));
      const items = getSlasherItems(mode);
      setCurrentTargetItem(generateSlasherTarget(items, targetLength, mode));
      setPhase("playing");
    },
    [mode, targetLength, session.currentLevel, session.mode, levelConfig?.targetTotal, levelConfig?.durationSeconds]
  );

  const resetRun = useCallback(() => {
    scoreRef.current = 0;
    setIsWin(false);
    setLoseReason(null);
    const initialSummary = computeSlasherSummary(0, 0, 0, INITIAL_HARAKAT_STATS, false);
    setLevel((prev) => ({
      ...prev,
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      wrongCount: 0,
      missedCount: 0,
      targetProgress: 0,
      isCompleted: false,
      isFailed: false,
      startedAt: Date.now(),
      accuracy: null,
      accuracyByHarakat: { ...INITIAL_HARAKAT_STATS },
      learningSummary: initialSummary,
    }));
    const items = getSlasherItems(mode);
    setCurrentTargetItem(generateSlasherTarget(items, targetLength, mode));
    setPhase("idle");
  }, [mode, targetLength]);

  // ADAPTIVE DIFFICULTY (Bab 8.3): Menyesuaikan fallSpeed & distractorRatio secara real-time
  const currentLevelCfg =
    levelConfig ?? SLASHER_LEVELS[session.currentLevel - 1] ?? SLASHER_LEVELS[0];
  const baseFallSpeed = currentLevelCfg?.fallSpeed ?? 10;
  const baseDistractorRatio = currentLevelCfg?.distractorRatio ?? 0.35;

  const adaptiveDifficulty = useMemo(() => {
    return computeAdaptiveDifficulty({
      correctCount: level.correctCount,
      wrongCount: level.wrongCount,
      baseFallSpeed,
      baseDistractorRatio,
      mode: session.mode,
      minAttempts: 3,
      minFallSpeed: session.mode === "practice" ? 5 : 7,
      maxFallSpeed: 25,
    });
  }, [
    level.correctCount,
    level.wrongCount,
    baseFallSpeed,
    baseDistractorRatio,
    session.mode,
  ]);

  // HINT OTOMATIS: Muncul jika anak salah >= 3 kali pada harakat target di Practice Mode
  const currentHarakatKey =
    currentTargetItem.harakatName ??
    extractHarakat(currentTargetItem.symbol) ??
    "fathah";
  const wrongOnCurrentTarget =
    level.accuracyByHarakat?.[currentHarakatKey]?.wrong ?? 0;
  const showHint =
    session.mode === "practice" && wrongOnCurrentTarget >= 3;

  return {
    phase,
    setPhase,
    mode,
    setMode,
    session,
    level,
    score: level.score,
    combo: level.combo,
    lives: level.lives,
    targetProgress: level.targetProgress,
    targetTotal: level.targetTotal,
    isWin,
    loseReason,
    currentTarget: currentTargetItem.id,
    currentTargetItem,
    best,
    adaptiveDifficulty,
    showHint,
    onSliceResult,
    handleStartLevel,
    handleNextLevel,
    handleTimeout,
    resetRun,
  };
}
