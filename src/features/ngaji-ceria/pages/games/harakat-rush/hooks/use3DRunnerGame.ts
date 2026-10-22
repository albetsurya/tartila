import {
  HARAKAT_LIST,
  type HarakatId,
} from "@/features/ngaji-ceria/pages/games/harakat-rush/data/harakat-list";
import {
  LEVELS,
  getLevelConfig,
} from "@/features/ngaji-ceria/pages/games/harakat-rush/data/levels";
import { useCallback, useEffect, useRef, useState } from "react";

export type Target = {
  id: number;
  lane: 0 | 1 | 2;
  z: number;
  symbol: string;
  isCorrect: boolean;
  hit: boolean;
};

export type Phase =
  | "idle"
  | "playing"
  | "paused"
  | "levelcomplete"
  | "gameover"
  | "victory";

export type HitFeedback = {
  type: "correct" | "wrong";
  id: number;
};

export type RunnerState = {
  lane: 0 | 1 | 2;
  score: number;
  combo: number;
  maxCombo: number;
  distance: number;
  speed: number;
  spawnAccum: number;
  nextTargetAt: number;
  currentTarget: HarakatId;
  targets: Target[];
  nextId: number;
  hitFlash: number;
  lives: number;
  progress: number;
  levelId: number;
  autoForward: boolean;
  forwardSpeed: number;
  gameOver: boolean;
  isJumping: boolean;
  jumpProgress: number;
  jumpDuration: number;
};

const FORWARD_SPEED = 0.15;
const SPAWN_INTERVAL = 1.5;
const MIN_LANE = 0;
const MAX_LANE = 2;
const GRAVITY = 0.05;
const JUMP_STRENGTH = 0.8;
const GROUND_LEVEL = 0;

function freshLevel(
  levelId: number,
  carry?: {
    lane: 0 | 1 | 2;
    score: number;
    maxCombo: number;
    distance: number;
  },
): RunnerState {
  const config = getLevelConfig(levelId);
  return {
    lane: carry?.lane ?? 1,
    score: carry?.score ?? 0,
    combo: 0,
    maxCombo: carry?.maxCombo ?? 0,
    distance: carry?.distance ?? 0,
    speed: config.speed,
    spawnAccum: 0,
    nextTargetAt: SPAWN_INTERVAL,
    currentTarget: HARAKAT_LIST[0].id,
    targets: [],
    nextId: 0,
    hitFlash: 0,
    lives: 3,
    progress: 0,
    levelId,
    autoForward: true,
    forwardSpeed: FORWARD_SPEED,
    gameOver: false,
    isJumping: false,
    jumpProgress: 0,
    jumpDuration: 0,
  };
}

export function use3DRunnerGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lane, setLane] = useState<0 | 1 | 2>(1);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);
  const [levelId, setLevelId] = useState(1);
  const [best, setBest] = useState(() =>
    Number(localStorage.getItem("harakat-rush-best")) || 0
  );

  const [state, setState] = useState<RunnerState>(() =>
    freshLevel(levelId)
  );

  const jumpRef = useRef<number>(0);

  // ✅ SET LANE (dengan clamp berdasarkan batas lane)
  const clampLane = (newLane: 0 | 1 | 2) => {
    setLane(Math.max(MIN_LANE, Math.min(MAX_LANE, newLane)) as 0 | 1 | 2);
  };

  // ✅ INCREASE SCORE
  const increaseScore = (points: number) => {
    setScore(prev => prev + points);
    setCombo(prev => {
      const newCombo = Math.min(prev + 1, 10);
      setMaxCombo(Math.max(maxCombo, newCombo));
      return newCombo;
    });
  };

  // ✅ DECREASE LIVES
  const decreaseLives = () => {
    setLives(prev => Math.max(0, prev - 1));
    setCombo(0);
  };

  // ✅ GAME OVER
  const gameOver = () => {
    setPhase("gameover");
    setLives(0);
    if (score > best) {
      setBest(score);
      localStorage.setItem("harakat-rush-best", String(score));
    }
  };

  // ✅ SPAWN TARGET
  const spawnTarget = useCallback(() => {
    const config = getLevelConfig(levelId);
    const lane = state.lane;
    void config;
    const symbol =
      HARAKAT_LIST[Math.floor(Math.random() * HARAKAT_LIST.length)].symbol;

    const newTarget: Target = {
      id: state.nextId++,
      lane,
      z: state.distance + 20,
      symbol,
      isCorrect: false,
      hit: false,
    };

    return newTarget;
  }, [state.distance, state.nextId, levelId, state.lane]);

  // ✅ HIT TARGET
  const hitTarget = useCallback((targetId: number, isCorrect: boolean) => {
    setState(prev => {
      const target = prev.targets.find(t => t.id === targetId);
      if (!target) return prev;

      if (isCorrect) {
        increaseScore(10);
        setCombo(prev => Math.min(prev + 1, 10));
      } else {
        decreaseLives();
        if (lives <= 0) gameOver();
      }

      setTimeout(() => {
        setState(prev => ({
          ...prev,
          targets: prev.targets.filter(t => t.id !== targetId),
        }));
      }, 1000);

      return {
        ...prev,
        hitFlash: Date.now(),
        targets: prev.targets.map(t =>
          t.id === targetId ? { ...t, hit: true, isCorrect } : t
        ),
      };
    });
  }, [increaseScore, decreaseLives, gameOver, lives]);

  // ✅ JUMP MECHANIC
  const jump = useCallback(() => {
    if (state.isJumping) return;
    setState(prev => ({
      ...prev,
      isJumping: true,
      jumpProgress: 0,
      jumpDuration: 0,
    }));
  }, []);

  useEffect(() => {
    if (state.isJumping && jumpRef.current < 100) {
      jumpRef.current += 1;
      setState(prev => ({
        ...prev,
        jumpProgress: prev.jumpProgress + 0.1,
      }));
    }

    if (state.isJumping && jumpRef.current >= 100) {
      setState(prev => ({
        ...prev,
        isJumping: false,
        jumpProgress: 0,
        lane: prev.lane,
      }));
      jumpRef.current = 0;
    }
  }, [state.isJumping]);

  // ✅ SPAWN INTERVAL TIMER
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (phase === "playing") {
      interval = setInterval(() => {
        setState(prev => {
          const newAccum = prev.spawnAccum + 1;
          return {
            ...prev,
            spawnAccum: newAccum,
            targets: newAccum >= (SPAWN_INTERVAL * 60) / 1000
              ? [...prev.targets, spawnTarget()]
              : prev.targets,
          };
        });
      }, 1000 / 60);
    }

    return () => clearInterval(interval);
  }, [phase, spawnTarget]);

  // ✅ LEVEL PROGRESSION
  useEffect(() => {
    if (progress > 500 && levelId < LEVELS.length) {
      setLevelId(prev => prev + 1);
      setState(freshLevel(levelId, {
        lane: state.lane,
        score: state.score,
        maxCombo: state.maxCombo,
        distance: state.distance,
      }));
    }
  }, [progress, levelId, state.lane, state.score, state.maxCombo, state.distance]);

  return {
    phase,
    score,
    combo,
    maxCombo,
    lane,
    lives,
    progress,
    levelId,
    best,
    setPhase,
    setLane,
    increaseScore,
    decreaseLives,
    gameOver,
    hitTarget,
    jump,
    state,
    setState,
    resetRun: () => {
      setPhase('idle');
      setState(freshLevel(1));
      setLane(1);
      setLevelId(1);
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setLives(3);
      setProgress(0);
    },
    FORWARD_SPEED,
    SPAWN_INTERVAL,
  };
}

export const FIRST_TARGET = HARAKAT_LIST[0].id;
