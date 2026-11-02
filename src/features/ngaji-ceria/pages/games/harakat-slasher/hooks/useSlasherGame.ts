import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HARAKAT_LIST,
  getSlasherItems,
  type SlasherMode,
  type SlasherTargetItem,
} from "../data/harakat-list";
import { playLetterAudio } from "../../_shared/gameAudio";
import { playSfx } from "../../_shared/audio";
import { getBest, setBest } from "../../_shared/storage";

export type SlasherPhase = "idle" | "playing" | "paused" | "gameover";

export type SlashResultKind = "correct" | "wrong" | "miss";

export interface SlasherLevelOptions {
  level?: number;
  spawnRate?: number;
  fallSpeed?: number;
  distractorRatio?: number;
  targetLength?: number;
  targetScore?: number;
}

/**
 * Helper untuk membuat target dinamis dengan panjang targetLength.
 * Menggabungkan item dari pool (harakat/huruf/kata/ayat).
 * Contoh Level 2: 'بَ' + 'تَ' = 'بَ تَ'
 */
export function generateSlasherTarget(
  pool: readonly SlasherTargetItem[],
  targetLength: number
): SlasherTargetItem {
  if (!pool || pool.length === 0) {
    return HARAKAT_LIST[0];
  }
  const length = Math.max(1, targetLength);
  if (length === 1) {
    const item = pool[Math.floor(Math.random() * pool.length)] || HARAKAT_LIST[0];
    return { ...item };
  }
  const picked: SlasherTargetItem[] = [];
  for (let i = 0; i < length; i++) {
    picked.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return {
    id: picked.map((p) => p.id).join("_"),
    name: picked.map((p) => p.name).join(" - "),
    symbol: picked.map((p) => p.symbol).join(" "),
    category: pool[0].category,
  };
}

export function useSlasherGame(levelConfig?: SlasherLevelOptions) {
  const [phase, setPhase] = useState<SlasherPhase>("idle");
  const [mode, setMode] = useState<SlasherMode>("harakat");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);

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
    setScore(next);
    setBestState((prevBest) => {
      if (next > prevBest) {
        setBest("harakat-rush", next);
        return next;
      }
      return prevBest;
    });
  }, []);

  const loseLife = useCallback(() => {
    setLives((l) => {
      const nextL = Math.max(0, l - 1);
      if (nextL <= 0) {
        setPhase("gameover");
        playSfx("gameover");
      }
      return nextL;
    });
    setCombo(0);
  }, []);

  // Hasil tebasan / lolos dari SlasherStage:
  // 1. correct: tambah skor (+25) & combo, mainkan audio
  // 2. wrong (menebas pengecoh): penalti nyawa -1 & penalti skor (-15)
  // 3. miss (target jatuh lolos melewati batas bawah): penalti nyawa -1
  const onSliceResult = useCallback(
    (kind: SlashResultKind, symbol?: string) => {
      if (kind === "correct") {
        const next = scoreRef.current + 25;
        bumpScore(next);
        setCombo((c) => c + 1);
        if (symbol) playLetterAudio(symbol);
      } else if (kind === "wrong") {
        loseLife();
        const next = Math.max(0, scoreRef.current - 15);
        bumpScore(next);
      } else if (kind === "miss") {
        loseLife();
      }
    },
    [bumpScore, loseLife]
  );

  // Target berganti berkala (12 detik) saat game berlangsung
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      pickNewTarget();
    }, 12000);
    return () => clearInterval(interval);
  }, [phase, pickNewTarget]);

  const resetRun = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setCombo(0);
    setLives(3);
    const items = getSlasherItems(mode);
    setCurrentTargetItem(generateSlasherTarget(items, targetLength));
    setPhase("idle");
  }, [mode, targetLength]);

  return {
    phase,
    setPhase,
    mode,
    setMode,
    score,
    combo,
    lives,
    currentTarget: currentTargetItem.id,
    currentTargetItem,
    best,
    onSliceResult,
    resetRun,
  };
}
