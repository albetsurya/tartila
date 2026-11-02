import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SessionState, LevelState } from "@/features/ngaji-ceria/types/game";
import {
  HARAKAT_LIST,
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

export { matchesSlasherTarget };

export type SlasherPhase = "idle" | "playing" | "paused" | "gameover";

export type SlashResultKind = "correct" | "wrong" | "miss";

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

/**
 * Helper untuk membuat target dinamis dengan panjang targetLength.
 * Menggabungkan item dari pool (harakat/huruf/kata/ayat).
 * Contoh Level 2: 'بَ' + 'تَ' = 'بَ تَ' (keduanya Fathah)
 */
export function generateSlasherTarget(
  pool: readonly SlasherTargetItem[],
  targetLength: number
): SlasherTargetItem {
  if (!pool || pool.length === 0) {
    return HARAKAT_LIST[0];
  }
  const length = Math.max(1, targetLength);
  const first = pool[0];
  const isHarakatCategory = first.category === "harakat";

  if (length === 1) {
    const item = pool[Math.floor(Math.random() * pool.length)] || HARAKAT_LIST[0];
    const harakat = item.harakatName ?? extractHarakat(item.symbol) ?? undefined;
    return {
      ...item,
      targetMode: item.targetMode ?? (isHarakatCategory ? "harakat" : "syllable"),
      harakatName: harakat,
    };
  }

  // Jika kategori harakat dan targetLength > 1, pilih huruf-huruf dengan harakat yang sama
  let candidatePool = pool;
  let targetHarakat: HarakatName | undefined = undefined;
  if (isHarakatCategory) {
    const randomBase = pool[Math.floor(Math.random() * pool.length)];
    targetHarakat = randomBase.harakatName ?? extractHarakat(randomBase.symbol) ?? undefined;
    if (targetHarakat) {
      const filtered = pool.filter(
        (p) => (p.harakatName ?? extractHarakat(p.symbol)) === targetHarakat
      );
      if (filtered.length > 0) {
        candidatePool = filtered;
      }
    }
  }

  const picked: SlasherTargetItem[] = [];
  for (let i = 0; i < length; i++) {
    picked.push(candidatePool[Math.floor(Math.random() * candidatePool.length)]);
  }

  return {
    id: picked.map((p) => p.id).join("_"),
    name: picked.map((p) => p.name).join(" - "),
    symbol: picked.map((p) => p.symbol).join(" "),
    category: first.category,
    targetMode: isHarakatCategory ? "harakat" : "syllable",
    harakatName: targetHarakat ?? picked[0].harakatName ?? extractHarakat(picked[0].symbol) ?? undefined,
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
  const [level, setLevel] = useState<LevelState>(() => ({
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
  }));

  const activePool = useMemo(() => getSlasherItems(mode), [mode]);
  const targetLength = Math.max(1, levelConfig?.targetLength ?? 1);

  const [currentTargetItem, setCurrentTargetItem] = useState<SlasherTargetItem>(() =>
    generateSlasherTarget(activePool, targetLength)
  );
  const [best, setBestState] = useState(() => getBest("harakat-rush"));

  const scoreRef = useRef(0);

  const pickNewTarget = useCallback(() => {
    const items = getSlasherItems(mode);
    setCurrentTargetItem(generateSlasherTarget(items, targetLength));
  }, [mode, targetLength]);

  // Saat mode atau targetLength berganti, perbarui target aktif
  useEffect(() => {
    pickNewTarget();
  }, [pickNewTarget]);

  const bumpScore = useCallback((next: number) => {
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
      return {
        ...prev,
        score: next,
        combo: prev.combo + 1,
        maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
        correctCount: prev.correctCount + 1,
        targetProgress: nextProgress,
        isCompleted: won,
      };
    });
    setBestState((prevBest) => {
      if (next > prevBest) {
        setBest("harakat-rush", next);
        return next;
      }
      return prevBest;
    });
  }, []);

  const loseLife = useCallback((kind: "wrong" | "miss") => {
    // Di Mode Practice: Tidak ada penalti pengurangan nyawa
    if (session.mode === "practice") {
      setLevel((prev) => ({
        ...prev,
        wrongCount: kind === "wrong" ? prev.wrongCount + 1 : prev.wrongCount,
        missedCount: kind === "miss" ? prev.missedCount + 1 : prev.missedCount,
      }));
      return;
    }

    setLevel((prev) => {
      const nextL = Math.max(0, prev.lives - 1);
      if (nextL <= 0) {
        setIsWin(false);
        setLoseReason("lives");
        setPhase("gameover");
        playSfx("gameover");
      }
      return {
        ...prev,
        lives: nextL,
        combo: 0,
        wrongCount: kind === "wrong" ? prev.wrongCount + 1 : prev.wrongCount,
        missedCount: kind === "miss" ? prev.missedCount + 1 : prev.missedCount,
        isFailed: nextL <= 0,
      };
    });
  }, [session.mode]);

  const handleTimeout = useCallback(() => {
    setIsWin(false);
    setLoseReason("time");
    setPhase("gameover");
    playSfx("gameover");
    setLevel((prev) => ({
      ...prev,
      isFailed: true,
    }));
  }, []);

  // Hasil tebasan / lolos dari SlasherStage:
  // 1. correct: tambah skor (+25) & combo, mainkan audio
  // 2. wrong (menebas pengecoh): penalti nyawa -1 (challenge) & penalti skor (-15 di challenge)
  // 3. miss (target jatuh lolos melewati batas bawah): penalti nyawa -1 (challenge)
  const onSliceResult = useCallback(
    (kind: SlashResultKind, symbol?: string, _item?: SlasherTargetItem) => {
      if (kind === "correct") {
        const next = scoreRef.current + 25;
        bumpScore(next);
        if (symbol) playLetterAudio(symbol);
      } else if (kind === "wrong") {
        loseLife("wrong");
        if (session.mode === "challenge") {
          const next = Math.max(0, scoreRef.current - 15);
          scoreRef.current = next;
          setLevel((prev) => ({ ...prev, score: next }));
        }
      } else if (kind === "miss") {
        loseLife("miss");
      }
    },
    [bumpScore, loseLife, session.mode]
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
      });
      const items = getSlasherItems(mode);
      setCurrentTargetItem(generateSlasherTarget(items, targetLength));
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
      }));
      const items = getSlasherItems(mode);
      setCurrentTargetItem(generateSlasherTarget(items, targetLength));
      setPhase("playing");
    },
    [mode, targetLength, session.currentLevel, session.mode, levelConfig?.targetTotal, levelConfig?.durationSeconds]
  );

  const resetRun = useCallback(() => {
    scoreRef.current = 0;
    setIsWin(false);
    setLoseReason(null);
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
    }));
    const items = getSlasherItems(mode);
    setCurrentTargetItem(generateSlasherTarget(items, targetLength));
    setPhase("idle");
  }, [mode, targetLength]);

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
    onSliceResult,
    handleStartLevel,
    handleNextLevel,
    handleTimeout,
    resetRun,
  };
}
