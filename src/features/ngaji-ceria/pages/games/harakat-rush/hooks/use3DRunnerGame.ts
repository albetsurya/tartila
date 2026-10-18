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

export type HitFeedback = { type: "correct" | "wrong"; id: number };

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
};

const START_LIVES = 3;
const FIRST_TARGET = HARAKAT_LIST[0].id;

function freshLevel(
  levelId: number,
  carry?: { lane: 0 | 1 | 2; score: number; maxCombo: number },
): RunnerState {
  const config = getLevelConfig(levelId);
  return {
    lane: carry?.lane ?? 1,
    score: carry?.score ?? 0,
    combo: 0,
    maxCombo: carry?.maxCombo ?? 0,
    distance: 0,
    speed: config.speed,
    spawnAccum: 0,
    nextTargetAt: 30,
    currentTarget: FIRST_TARGET,
    targets: [],
    nextId: 0,
    hitFlash: 0,
    lives: START_LIVES,
    progress: 0,
    levelId,
  };
}

export function use3DRunnerGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lane, setLane] = useState<0 | 1 | 2>(1);
  const [lives, setLives] = useState(START_LIVES);
  const [progress, setProgress] = useState(0);
  const [levelId, setLevelId] = useState(1);
  const [best, setBest] = useState(() =>
    Number(localStorage.getItem("harakat-rush-best") || "0"),
  );
  const [target, setTarget] = useState<HarakatId>(FIRST_TARGET);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [feedback, setFeedback] = useState<HitFeedback | null>(null);

  const stateRef = useRef<RunnerState>(freshLevel(1));
  const feedbackCounter = useRef(0);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(
      () => setFeedback(null),
      feedback.type === "correct" ? 450 : 650,
    );
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const sync = useCallback(() => {
    const s = stateRef.current;
    setScore(s.score);
    setCombo(s.combo);
    setMaxCombo(s.maxCombo);
    setLane(s.lane);
    setLives(s.lives);
    setProgress(s.progress);
    setLevelId(s.levelId);
  }, []);

  const finish = useCallback(
    (outcome: "gameover" | "victory" | "levelcomplete") => {
      const finalScore = stateRef.current.score;
      if (outcome !== "levelcomplete" && finalScore > best) {
        setBest(finalScore);
        localStorage.setItem("harakat-rush-best", String(finalScore));
        setIsNewRecord(true);
      }
      setPhase(outcome);
    },
    [best],
  );

  const applyHits = useCallback(() => {
    const s = stateRef.current;
    for (const t of s.targets) {
      if (t.hit) continue;

      // SOLUSI PERSPEKTIF:
      // Menangkap objek saat z berada di antara 2.5 dan 4.5.
      // Objek tertangkap lebih awal sebelum perspektif 3D menyebarkannya keluar layar.
      if (t.z > 2.5 && t.z < 4.5) {
        t.hit = true;
        const playerCaught = t.lane === s.lane;
        if (playerCaught && t.isCorrect) {
          setFeedback({ type: "correct", id: ++feedbackCounter.current });
          s.score += 100 + s.combo * 10;
          s.combo += 1;
          if (s.combo > s.maxCombo) s.maxCombo = s.combo;
          s.progress += 1;
        } else if (playerCaught) {
          setFeedback({ type: "wrong", id: ++feedbackCounter.current });
          s.score = Math.max(0, s.score - 50);
          s.combo = 0;
          s.hitFlash = 0.25;
          s.lives = Math.max(0, s.lives - 1);
        } else if (t.isCorrect) {
          s.combo = 0;
        }
      }
    }
    // Filter sedikit lebih mundur agar objek tidak hilang secara tiba-tiba di depan mata
    s.targets = s.targets.filter((t) => t.z < 5);
  }, []);

  const spawnTargets = useCallback(() => {
    const s = stateRef.current;
    if (s.distance < s.nextTargetAt) return;
    s.nextTargetAt = s.distance + 9 + Math.random() * 5;

    const activeLane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    const wrongLane1 = ((activeLane + 1) % 3) as 0 | 1 | 2;
    const wrongLane2 = ((activeLane + 2) % 3) as 0 | 1 | 2;

    const correctItem = HARAKAT_LIST.find((h) => h.id === s.currentTarget);
    if (!correctItem) return;

    const wrongPool = HARAKAT_LIST.filter((h) => h.id !== s.currentTarget);
    const wrong1 = wrongPool[Math.floor(Math.random() * wrongPool.length)];
    const wrong2 = wrongPool[Math.floor(Math.random() * wrongPool.length)];

    s.targets.push(
      {
        id: s.nextId++,
        lane: activeLane,
        z: -60,
        symbol: correctItem.symbol,
        isCorrect: true,
        hit: false,
      },
      {
        id: s.nextId++,
        lane: wrongLane1,
        z: -60,
        symbol: wrong1?.symbol ?? "",
        isCorrect: false,
        hit: false,
      },
      {
        id: s.nextId++,
        lane: wrongLane2,
        z: -60,
        symbol: wrong2?.symbol ?? "",
        isCorrect: false,
        hit: false,
      },
    );

    if (Math.random() < 0.5) {
      const nextItem =
        HARAKAT_LIST[Math.floor(Math.random() * HARAKAT_LIST.length)];
      s.currentTarget = nextItem.id;
      setTarget(nextItem.id);
    }
  }, []);

  const tick = useCallback(
    (delta: number) => {
      if (phase !== "playing") return;
      const s = stateRef.current;

      const dz = s.speed * delta;
      s.distance += dz;
      for (const t of s.targets) t.z += dz;

      applyHits();
      spawnTargets();

      if (s.hitFlash > 0) s.hitFlash = Math.max(0, s.hitFlash - delta);
      sync();

      if (s.lives <= 0) finish("gameover");
      else if (s.progress >= getLevelConfig(s.levelId).targetCount)
        finish(s.levelId >= LEVELS.length ? "victory" : "levelcomplete");
    },
    [phase, applyHits, spawnTargets, sync, finish],
  );

  const start = useCallback(() => {
    stateRef.current = freshLevel(1);
    setTarget(FIRST_TARGET);
    setFeedback(null);
    feedbackCounter.current = 0;
    sync();
    setIsNewRecord(false);
    setPhase("playing");
  }, [sync]);

  const nextLevel = useCallback(() => {
    const s = stateRef.current;
    const next = Math.min(s.levelId + 1, LEVELS.length);
    stateRef.current = freshLevel(next, {
      lane: s.lane,
      score: s.score,
      maxCombo: s.maxCombo,
    });
    setTarget(FIRST_TARGET);
    setFeedback(null);
    sync();
    setPhase("playing");
  }, [sync]);

  const moveLane = useCallback((l: 0 | 1 | 2) => {
    stateRef.current.lane = l;
    setLane(l);
  }, []);

  const pause = useCallback(() => setPhase("paused"), []);
  const resume = useCallback(() => setPhase("playing"), []);

  const level = getLevelConfig(levelId);

  return {
    phase,
    score,
    combo,
    maxCombo,
    lane,
    lives,
    progress,
    best,
    target,
    isNewRecord,
    feedback,
    stateRef,
    tick,
    start,
    nextLevel,
    moveLane,
    pause,
    resume,
    level: level.id,
    levelName: level.name,
    targetCount: level.targetCount,
    themeColor: level.themeColor,
  };
}
