import { useCallback, useEffect, useRef, useState } from "react";
import { HARAKAT_LIST, type HarakatId } from "../data/harakat-list";
import { playLetterAudio } from "../../_shared/gameAudio";
import { playSfx } from "../../_shared/audio";
import { getBest, setBest } from "../../_shared/storage";

export type SlasherPhase = "idle" | "playing" | "paused" | "gameover";

export type SlashResultKind = "correct" | "wrong" | "miss";

export function useSlasherGame() {
  const [phase, setPhase] = useState<SlasherPhase>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentTarget, setCurrentTarget] = useState<HarakatId>(
    HARAKAT_LIST[0].id
  );
  const [best, setBestState] = useState(() => getBest("harakat-rush"));

  const scoreRef = useRef(0);

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
        playSfx("wrong");
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
        playSfx("correct");
      } else {
        loseLife();
      }
    },
    [bumpScore, loseLife]
  );

  // Target harakat berganti berkala agar variasi
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setCurrentTarget(
        HARAKAT_LIST[Math.floor(Math.random() * HARAKAT_LIST.length)].id
      );
    }, 12000);
    return () => clearInterval(interval);
  }, [phase]);

  const resetRun = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setCombo(0);
    setLives(3);
    setCurrentTarget(HARAKAT_LIST[0].id);
    setPhase("idle");
  }, []);

  return {
    phase,
    setPhase,
    score,
    combo,
    lives,
    currentTarget,
    best,
    onSliceResult,
    resetRun,
  };
}
