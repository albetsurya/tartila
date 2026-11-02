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

export function useSlasherGame() {
  const [phase, setPhase] = useState<SlasherPhase>("idle");
  const [mode, setMode] = useState<SlasherMode>("harakat");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);

  const activePool = useMemo(() => getSlasherItems(mode), [mode]);

  const [currentTarget, setCurrentTarget] = useState<string>(() => activePool[0]?.id || "fathah");
  const [best, setBestState] = useState(() => getBest("harakat-rush"));

  const scoreRef = useRef(0);

  // Saat mode berganti, reset target ke item pertama dari mode tersebut
  useEffect(() => {
    const items = getSlasherItems(mode);
    if (items.length > 0) {
      setCurrentTarget(items[0].id);
    }
  }, [mode]);

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
      } else {
        /* silence: correct/wrong SFX delegated to feedback layer */
      }
      return nextL;
    });
    setCombo(0);
  }, []);

  // Hasil tebasan dari SlasherStage: tebasan benar / pengecoh / target lolos
  const onSliceResult = useCallback(
    (kind: SlashResultKind, symbol?: string) => {
      if (kind === "correct") {
        const next = scoreRef.current + 25;
        bumpScore(next);
        setCombo((c) => c + 1);
        if (symbol) playLetterAudio(symbol);
        /* silence: correct SFX delegated to feedback layer */
      } else {
        loseLife();
      }
    },
    [bumpScore, loseLife]
  );

  // Target berganti berkala agar variasi sesuai mode yang dipilih
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      const items = getSlasherItems(mode);
      if (items.length > 0) {
        const nextTarget = items[Math.floor(Math.random() * items.length)];
        setCurrentTarget(nextTarget.id);
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [phase, mode]);

  const resetRun = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setCombo(0);
    setLives(3);
    const items = getSlasherItems(mode);
    setCurrentTarget(items[0]?.id || HARAKAT_LIST[0].id);
    setPhase("idle");
  }, [mode]);

  const currentTargetItem: SlasherTargetItem = useMemo(() => {
    return (
      activePool.find((item) => item.id === currentTarget) ??
      activePool[0] ??
      HARAKAT_LIST[0]
    );
  }, [activePool, currentTarget]);

  return {
    phase,
    setPhase,
    mode,
    setMode,
    score,
    combo,
    lives,
    currentTarget,
    currentTargetItem,
    best,
    onSliceResult,
    resetRun,
  };
}
