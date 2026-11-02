import { useCallback, useEffect, useRef } from "react";
import type { SessionState, LevelState } from "@/features/ngaji-ceria/types/game";
import { useBestScore, useGameState } from "../../_shared/hooks";
import type { GamePhase } from "../../_shared/types";
import { HIJAIYAH_LETTERS } from "../data/hijaiyah-letters";
import { getWordsForLevel, getFallbackWords, LEVELS } from "../data";
import { playSfx } from "../../_shared/audio";
import { normalizeArabicText } from "@/utils/arabic";

export interface BalloonData {
  id: string;
  letter: string;
  x: number;
  y: number;
  speed: number;
  isTarget: boolean;
  popped: boolean;
  popAge: number;
  color: number;
  /** Offset menuju pusat keranjang (untuk animasi suck-in buah benar). */
  suckX: number;
  suckY: number;
}

/** Durasi efek pop (salah) & suck-in (benar) sebelum buah di-unmount. */
const POP_LIFETIME = 0.5;

interface BalloonState {
  phase: GamePhase;
  session: SessionState;
  level: LevelState;
  score: number;
  combo: number;
  maxCombo: number;
  lives: number;
  target: string;
  targetName: string;
  balloons: BalloonData[];
  targetLeft: number;
  missedTargets: number;
  spawnLeft: number;
  spawned: number;
  forceTarget: boolean;
  shakeLeft: number;
  targetLetters: string[];
  collectedLetters: string[];
  displayLetters: string[];
  levelIndex: number;
  isWord: boolean;
  timeLeft: number;
  targetScore: number;
  loseReason: "lives" | "time" | null;
  isWin: boolean;
}

const initial = (levelIndex = 0): BalloonState => ({
  phase: "idle",
  session: {
    sessionId: `harvest-${Date.now()}`,
    userId: "guest",
    gameId: "hijaiyah-harvest",
    mode: "challenge",
    currentLevel: levelIndex + 1,
    totalScore: 0,
    completedLevels: [],
    status: "active",
    ticketConsumed: true,
    rewardClaimedLevelIds: [],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  level: {
    levelId: `harvest-level-${levelIndex + 1}`,
    score: 0,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    missedCount: 0,
    targetProgress: 0,
    targetTotal: 3,
    remainingTime: 60,
    isCompleted: false,
    isFailed: false,
    startedAt: Date.now(),
  },
  score: 0,
  combo: 0,
  maxCombo: 0,
  lives: 3,
  target: "",
  targetName: "",
  balloons: [],
  targetLeft: 5,
  missedTargets: 0,
  spawnLeft: 0.05,
  spawned: 0,
  forceTarget: true,
  shakeLeft: 0,
  targetLetters: [],
  collectedLetters: [],
  displayLetters: [],
  levelIndex,
  isWord: false,
  timeLeft: 60,
  targetScore: 300,
  loseReason: null,
  isWin: false,
});

/** Target letter yang sedang dicari (urutan ke-collectedLetters.length) */
function currentTargetLetter(state: BalloonState): string {
  return state.targetLetters[state.collectedLetters.length] ?? "";
}

/** Pilih kata acak dari daftar */
function pickRandomWord(words: string[][]): string[] {
  if (!words.length) return [];
  return words[Math.floor(Math.random() * words.length)] || [];
}

export function useBalloonGame() {
  const { state, update } = useGameState(initial);
  const fieldRef = useRef<HTMLDivElement>(null);
  const record = useBestScore("hijaiyah-pop", state.phase, state.score);
  const wordsRef = useRef<string[][]>([]);

  /** Mulai game pada level tertentu (async: muat kata dari Tilawati) */
  const handleStartLevel = useCallback(
    async (levelIndex: number, mode?: "practice" | "challenge") => {
      const activeMode = mode ?? "challenge";
      const cfg = LEVELS[levelIndex] ?? LEVELS[0];
      const initialTime = activeMode === "practice" ? undefined : cfg.durationSeconds;
      const targetScore = cfg.targetScore;
      try {
        const words = await getWordsForLevel(levelIndex);
        wordsRef.current = words;
        const rawWord = pickRandomWord(words) || getFallbackWords(0)[0];
        const activeWord = rawWord.map(normalizeArabicText);
        const isWord = activeWord.length > 1;
        const firstLetter = activeWord[0] || "";
        const targetTotal = activeWord.length;
        update((s) => ({
          ...s,
          phase: "playing",
          session: {
            ...s.session,
            currentLevel: levelIndex + 1,
            mode: activeMode,
            ticketConsumed: activeMode === "challenge",
            status: "active",
            updatedAt: new Date().toISOString(),
          },
          level: {
            levelId: `harvest-level-${levelIndex + 1}`,
            score: 0,
            lives: activeMode === "practice" ? 99 : 3,
            combo: 0,
            maxCombo: 0,
            correctCount: 0,
            wrongCount: 0,
            missedCount: 0,
            targetProgress: 0,
            targetTotal,
            remainingTime: initialTime,
            isCompleted: false,
            isFailed: false,
            startedAt: Date.now(),
          },
          score: 0,
          combo: 0,
          maxCombo: 0,
          lives: activeMode === "practice" ? 99 : 3,
          levelIndex,
          targetLetters: activeWord,
          target: firstLetter,
          targetName: firstLetter,
          collectedLetters: [],
          displayLetters: activeWord.map(() => ""),
          isWord,
          timeLeft: initialTime ?? 60,
          targetScore,
          isWin: false,
          loseReason: null,
          balloons: [],
          spawnLeft: 0.05,
          spawned: 0,
          targetLeft: 5,
          missedTargets: 0,
          shakeLeft: 0,
          forceTarget: true,
        }));
      } catch {
        const fallback = getFallbackWords(levelIndex);
        wordsRef.current = fallback;
        const rawWord = fallback[0] ?? ["ب", "ا", "ب"];
        const activeWord = rawWord.map(normalizeArabicText);
        const targetTotal = activeWord.length;
        update((s) => ({
          ...s,
          phase: "playing",
          session: {
            ...s.session,
            currentLevel: levelIndex + 1,
            mode: activeMode,
            ticketConsumed: activeMode === "challenge",
            status: "active",
            updatedAt: new Date().toISOString(),
          },
          level: {
            levelId: `harvest-level-${levelIndex + 1}`,
            score: 0,
            lives: activeMode === "practice" ? 99 : 3,
            combo: 0,
            maxCombo: 0,
            correctCount: 0,
            wrongCount: 0,
            missedCount: 0,
            targetProgress: 0,
            targetTotal,
            remainingTime: initialTime,
            isCompleted: false,
            isFailed: false,
            startedAt: Date.now(),
          },
          score: 0,
          combo: 0,
          maxCombo: 0,
          lives: activeMode === "practice" ? 99 : 3,
          levelIndex,
          targetLetters: activeWord,
          target: activeWord[0] ?? "",
          targetName: activeWord[0] ?? "",
          collectedLetters: [],
          displayLetters: activeWord.map(() => ""),
          isWord: activeWord.length > 1,
          timeLeft: initialTime ?? 60,
          targetScore,
          isWin: false,
          loseReason: null,
          balloons: [],
          spawnLeft: 0.05,
          spawned: 0,
          targetLeft: 5,
          missedTargets: 0,
          shakeLeft: 0,
          forceTarget: true,
        }));
      }
    },
    [update],
  );

  /** Alias untuk startGame lama */
  const startGame = handleStartLevel;

  /** Naik ke level berikutnya: mereset level state & timer, tidak memotong tiket */
  const handleNextLevel = useCallback(async () => {
    const nextLevelIndex = state.session.currentLevel; // next 0-indexed level
    if (nextLevelIndex >= LEVELS.length) return;
    const isPractice = state.session.mode === "practice";
    const cfg = LEVELS[nextLevelIndex] ?? LEVELS[0];
    const initialTime = isPractice ? undefined : cfg.durationSeconds;
    const targetScore = cfg.targetScore;
    try {
      const words = await getWordsForLevel(nextLevelIndex);
      wordsRef.current = words;
      const rawWord = pickRandomWord(words) || getFallbackWords(0)[0];
      const activeWord = rawWord.map(normalizeArabicText);
      const isWord = activeWord.length > 1;
      const firstLetter = activeWord[0] || "";
      const targetTotal = activeWord.length;
      update((s) => ({
        ...s,
        phase: "playing",
        session: {
          ...s.session,
          currentLevel: nextLevelIndex + 1,
          totalScore: s.session.totalScore + s.level.score,
          completedLevels: Array.from(new Set([...s.session.completedLevels, s.session.currentLevel])),
          updatedAt: new Date().toISOString(),
        },
        level: {
          levelId: `harvest-level-${nextLevelIndex + 1}`,
          score: 0,
          lives: isPractice ? 99 : 3,
          combo: 0,
          maxCombo: 0,
          correctCount: 0,
          wrongCount: 0,
          missedCount: 0,
          targetProgress: 0,
          targetTotal,
          remainingTime: initialTime,
          isCompleted: false,
          isFailed: false,
          startedAt: Date.now(),
        },
        score: 0,
        combo: 0,
        maxCombo: 0,
        lives: isPractice ? 99 : 3,
        levelIndex: nextLevelIndex,
        targetLetters: activeWord,
        target: firstLetter,
        targetName: firstLetter,
        collectedLetters: [],
        displayLetters: activeWord.map(() => ""),
        isWord,
        timeLeft: initialTime ?? 60,
        targetScore,
        isWin: false,
        loseReason: null,
        balloons: [],
        spawnLeft: 0.05,
        spawned: 0,
        targetLeft: 5,
        missedTargets: 0,
        shakeLeft: 0,
        forceTarget: true,
      }));
    } catch {
      const fallback = getFallbackWords(nextLevelIndex);
      wordsRef.current = fallback;
      const rawWord = fallback[0] ?? ["ب", "ا", "ب"];
      const activeWord = rawWord.map(normalizeArabicText);
      const targetTotal = activeWord.length;
      update((s) => ({
        ...s,
        phase: "playing",
        session: {
          ...s.session,
          currentLevel: nextLevelIndex + 1,
          totalScore: s.session.totalScore + s.level.score,
          completedLevels: Array.from(new Set([...s.session.completedLevels, s.session.currentLevel])),
          updatedAt: new Date().toISOString(),
        },
        level: {
          levelId: `harvest-level-${nextLevelIndex + 1}`,
          score: 0,
          lives: isPractice ? 99 : 3,
          combo: 0,
          maxCombo: 0,
          correctCount: 0,
          wrongCount: 0,
          missedCount: 0,
          targetProgress: 0,
          targetTotal,
          remainingTime: initialTime,
          isCompleted: false,
          isFailed: false,
          startedAt: Date.now(),
        },
        score: 0,
        combo: 0,
        maxCombo: 0,
        lives: isPractice ? 99 : 3,
        levelIndex: nextLevelIndex,
        targetLetters: activeWord,
        target: activeWord[0] ?? "",
        targetName: activeWord[0] ?? "",
        collectedLetters: [],
        displayLetters: activeWord.map(() => ""),
        isWord: activeWord.length > 1,
        timeLeft: initialTime ?? 60,
        targetScore,
        isWin: false,
        loseReason: null,
        balloons: [],
        spawnLeft: 0.05,
        spawned: 0,
        targetLeft: 5,
        missedTargets: 0,
        shakeLeft: 0,
        forceTarget: true,
      }));
    }
  }, [state.session.currentLevel, state.session.mode, update]);

  /** Lanjut ke kata berikutnya pada level yang sama */
  const continueToNextWord = useCallback(
    (levelIndex: number) => {
      const isWordCompleted =
        state.targetLetters.length > 0 &&
        state.collectedLetters.length >= state.targetLetters.length;
      if (state.phase === "idle" && !isWordCompleted) return;
      const words = wordsRef.current;
      const rawWord = pickRandomWord(words) || getFallbackWords(levelIndex)[0] || ["ب", "ا", "ب"];
      const newWord = rawWord.map(normalizeArabicText);
      const isWord = newWord.length > 1;
      const firstLetter = newWord[0] || "";
      update((s) => ({
        ...s,
        phase: "playing",
        targetLetters: newWord,
        collectedLetters: [],
        displayLetters: newWord.map(() => ""),
        target: firstLetter,
        targetName: firstLetter,
        targetLeft: 5,
        forceTarget: true,
        shakeLeft: 0,
        balloons: [],
        spawned: s.spawned,
        isWord,
      }));
    },
    [update, state],
  );

  const pause = useCallback(() => update((s) => s.phase === "playing" ? { ...s, phase: "paused" } : s), [update]);
  const resume = useCallback(() => update((s) => s.phase === "paused" ? { ...s, phase: "playing" } : s), [update]);

  const pop = useCallback(
    (id: string) =>
      update((s) => {
        if (s.phase !== "playing") return s;
        const balloon = s.balloons.find((item) => item.id === id);
        if (!balloon || balloon.popped) return s;

        const expected = normalizeArabicText(currentTargetLetter(s));
        const cleanBalloonLetter = normalizeArabicText(balloon.letter);
        const correct = cleanBalloonLetter === expected;
        const combo = correct ? s.combo + 1 : 0;
        const isPractice = s.session.mode === "practice";
        const lives = isPractice ? s.lives : s.lives - (correct ? 0 : 1);
        playSfx(correct ? "correct" : "wrong");

        // Target tarikan buah benar: pusat keranjang (bawah tengah arena).
        const rect = fieldRef.current?.getBoundingClientRect();
        const centerX = rect ? rect.width / 2 - 40 : balloon.x;
        const bottomY = rect ? rect.height - 70 : balloon.y;
        const suckX = correct ? centerX - balloon.x : 0;
        const suckY = correct ? bottomY - balloon.y : 0;

        const balloons = s.balloons.map((item) =>
          item.id === id
            ? { ...item, popped: true, popAge: 0, suckX, suckY }
            : item,
        );

        const score = s.score + (correct ? Math.round(100 * Math.min(1 + combo * 0.1, 5)) : 0);
        const maxCombo = Math.max(s.maxCombo, combo);

        const nextLevelState: LevelState = {
          ...s.level,
          score,
          combo,
          maxCombo,
          lives,
          correctCount: correct ? s.level.correctCount + 1 : s.level.correctCount,
          wrongCount: correct ? s.level.wrongCount : s.level.wrongCount + 1,
          targetProgress: correct ? s.level.targetProgress + 1 : s.level.targetProgress,
        };

        if (correct) {
          const collectedLetters = [...s.collectedLetters, balloon.letter];
          const nextDisplayLetters = [...s.displayLetters];
          nextDisplayLetters[collectedLetters.length - 1] = balloon.letter;
          const targetProgress = collectedLetters.length;
          const targetTotal = s.targetLetters.length;
          const isWin = targetProgress >= targetTotal;

          // Semua huruf terkumpul -> susunan kata 100% selesai (WIN CONDITION)
          if (isWin) {
            playSfx("level-up");
            return {
              ...s,
              balloons,
              score,
              combo,
              maxCombo,
              lives,
              phase: "gameover",
              isWin: true,
              loseReason: null,
              level: {
                ...nextLevelState,
                targetProgress,
                targetTotal,
                isCompleted: true,
              },
              collectedLetters,
              displayLetters: nextDisplayLetters,
              forceTarget: false,
              targetLeft: 5,
              shakeLeft: 0,
            };
          }

          // Huruf masih ada -> lanjut ke huruf berikutnya
          const nextLetter = normalizeArabicText(s.targetLetters[collectedLetters.length] || s.target);
          return {
            ...s,
            balloons: balloons.map((b) => ({ ...b, isTarget: normalizeArabicText(b.letter) === nextLetter })),
            score,
            combo,
            maxCombo,
            lives,
            level: {
              ...nextLevelState,
              targetProgress,
              targetTotal,
            },
            collectedLetters,
            displayLetters: nextDisplayLetters,
            forceTarget: true,
            targetLeft: 5,
            target: nextLetter,
            targetName: nextLetter,
          };
        }

        // Salah klik (hanya di Challenge Mode)
        if (!isPractice && lives <= 0) {
          playSfx("gameover");
          return {
            ...s,
            balloons,
            score,
            combo: 0,
            lives: 0,
            level: {
              ...nextLevelState,
              lives: 0,
              isFailed: true,
            },
            shakeLeft: 0.25,
            missedTargets: s.missedTargets + 1,
            phase: "gameover",
            isWin: false,
            loseReason: "lives",
          };
        }

        return {
          ...s,
          balloons,
          score,
          combo: 0,
          lives,
          level: nextLevelState,
          shakeLeft: 0.25,
          missedTargets: s.missedTargets + 1,
        };
      }),
    [update],
  );

  // Helper untuk UI: huruf target aktif (ganti nama target)
  const targetLetter = currentTargetLetter(state);

  useEffect(() => {
    if (state.phase !== "playing") return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = (now - previous) / 1000;
      previous = now;
      update((s) => {
        if (s.phase !== "playing") return s;
        const isPractice = s.session.mode === "practice";
        const height = fieldRef.current?.clientHeight ?? 320;
        const width = fieldRef.current?.clientWidth ?? 320;

        let missedTargets = s.missedTargets;
        let combo = s.combo;
        let lives = s.lives;
        const balloons = s.balloons.flatMap((balloon) => {
          if (balloon.popped)
            return balloon.popAge + delta < POP_LIFETIME
              ? [{ ...balloon, popAge: balloon.popAge + delta }]
              : [];
          const y = balloon.y + balloon.speed * 60 * delta;
          if (y > height - 70) {
            if (balloon.isTarget) {
              missedTargets++;
              combo = 0;
              if (!isPractice) {
                lives -= 1;
              }
              return [];
            }
            // Pengecoh jatuh lolos ke bawah: wajar dan tidak kena penalti (Bab 7.6)
            return [];
          }
          return [{ ...balloon, y }];
        });

        const nextTimeLeft = isPractice ? s.timeLeft : Math.max(0, s.timeLeft - delta);
        if (!isPractice && nextTimeLeft <= 0) {
          playSfx("gameover");
          return {
            ...s,
            timeLeft: 0,
            phase: "gameover",
            isWin: false,
            loseReason: "time",
            level: {
              ...s.level,
              remainingTime: 0,
              isFailed: true,
            },
            shakeLeft: 0.25,
          };
        }

        if (!isPractice && lives <= 0) {
          playSfx("gameover");
          return {
            ...s,
            lives: 0,
            timeLeft: nextTimeLeft,
            phase: "gameover",
            isWin: false,
            loseReason: "lives",
            level: {
              ...s.level,
              lives: 0,
              remainingTime: nextTimeLeft,
              isFailed: true,
            },
            shakeLeft: 0.25,
          };
        }

        let next: BalloonState = {
          ...s,
          balloons,
          combo,
          missedTargets,
          lives,
          timeLeft: nextTimeLeft,
          level: {
            ...s.level,
            lives,
            combo,
            missedCount: missedTargets,
            remainingTime: nextTimeLeft,
          },
          targetLeft: s.targetLeft - delta,
          spawnLeft: s.spawnLeft - delta,
          shakeLeft: Math.max(0, s.shakeLeft - delta),
        };

        if (next.targetLeft <= 0) {
          const letter = normalizeArabicText(currentTargetLetter(next) || s.target);
          next = {
            ...next,
            target: letter,
            targetName: letter,
            targetLeft: 5,
            balloons: next.balloons.map((balloon) => ({ ...balloon, isTarget: normalizeArabicText(balloon.letter) === letter })),
            forceTarget: true,
          };
        }

        if (!isPractice && next.lives <= 0) {
          playSfx("gameover");
          next = {
            ...next,
            phase: "gameover",
            isWin: false,
            loseReason: "lives",
            level: {
              ...next.level,
              lives: 0,
              isFailed: true,
            },
            shakeLeft: 0.25,
          };
        }

        if (next.spawnLeft <= 0) {
          const wantTarget = next.forceTarget || next.spawned % 3 === 0 || Math.random() < 0.35;
          const currentLetter = normalizeArabicText(currentTargetLetter(next) || s.target);
          const distractorPool = Array.from(
            new Set(next.targetLetters.map(normalizeArabicText).filter((l) => l !== currentLetter)),
          );
          const choices = distractorPool.length
            ? distractorPool
            : HIJAIYAH_LETTERS.map((item) => normalizeArabicText(item.letter)).filter((l) => l !== currentLetter);
          const rawLetter = wantTarget
            ? currentLetter
            : choices.length
              ? choices[Math.floor(Math.random() * choices.length)]
              : currentLetter;
          const letter = normalizeArabicText(rawLetter);
          next = {
            ...next,
            spawned: next.spawned + 1,
            spawnLeft: 0.95 + Math.random() * 0.45,
            forceTarget: false,
            balloons: [
              ...next.balloons,
              {
                id: `balloon-${next.spawned}`,
                letter,
                x: Math.random() * Math.max(0, width - 80),
                y: -100,
                speed: 1.3 + Math.floor(next.spawned / 10) * 0.08,
                isTarget: letter === currentLetter,
                popped: false,
                popAge: 0,
                color: next.spawned % 4,
                suckX: 0,
                suckY: 0,
              },
            ],
          };
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state.phase, update]);

  return {
    ...state,
    session: state.session,
    level: state.level,
    score: state.level.score,
    combo: state.level.combo,
    maxCombo: state.level.maxCombo,
    lives: state.level.lives,
    targetProgress: state.level.targetProgress,
    targetTotal: state.level.targetTotal,
    ...record,
    fieldRef,
    startGame,
    handleStartLevel,
    handleNextLevel,
    continueToNextWord,
    pause,
    resume,
    pop,
    targetLetter,
    targetLetterName: targetLetter,
  };
}
