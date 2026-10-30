import { useCallback, useEffect, useRef } from "react";
import { useBestScore, useGameState } from "../../_shared/hooks";
import type { GamePhase } from "../../_shared/types";
import { HIJAIYAH_LETTERS } from "../data/hijaiyah-letters";
import { getWordsForLevel } from "../data";

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
}

interface BalloonState {
  phase: GamePhase;
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
}

const initial = (): BalloonState => ({
  phase: "idle",
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
  levelIndex: 0,
  isWord: false,
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

  /** Fallback kata bila dataset Tilawati kosong/gagal dimuat */
  const FALLBACK_WORDS = [["ب", "ا", "ب"], ["ا", "ل", "ل", "ه"]];

  /** Mulai game pada level tertentu (async: muat kata dari Tilawati) */
  const startGame = useCallback(
    async (levelIndex: number) => {
      // Prevent double-start while the game is already running.
      if (state.phase === "playing") return;
      try {
        const words = await getWordsForLevel(levelIndex);
        wordsRef.current = words;
        const activeWord = pickRandomWord(words) || FALLBACK_WORDS[0];
        const isWord = activeWord.length > 1;
        const firstLetter = activeWord[0] || "";
        update(() => ({
          ...initial(),
          phase: "playing",
          levelIndex,
          targetLetters: activeWord,
          target: firstLetter,
          targetName: firstLetter,
          displayLetters: activeWord.map(() => ""),
          isWord,
        }));
      } catch {
        // Dataset gagal dimuat: pakai fallback agar gameplay tetap berjalan
        wordsRef.current = FALLBACK_WORDS;
        update(() => ({
          ...initial(),
          phase: "playing",
          levelIndex,
          targetLetters: FALLBACK_WORDS[0],
          target: FALLBACK_WORDS[0][0] ?? "",
          targetName: FALLBACK_WORDS[0][0] ?? "",
          displayLetters: FALLBACK_WORDS[0].map(() => ""),
          isWord: true,
        }));
      }
    },
    [update, state],
  );

  /** Lanjut ke kata berikutnya pada level yang sama (setelah menang) */
  const continueToNextWord = useCallback(
    (levelIndex: number) => {
      // Anti auto-start: 0 >= 0 pada state idle memenuhi gejala "kata selesai",
      // jadi wajib targetLetters tidak kosong untuk dianggap kata selesai.
      const isWordCompleted =
        state.targetLetters.length > 0 &&
        state.collectedLetters.length >= state.targetLetters.length;
      if (state.phase === "idle" && !isWordCompleted) return;
      const words = wordsRef.current;
      const newWord = pickRandomWord(words) || FALLBACK_WORDS[0];
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

        const expected = currentTargetLetter(s);
        const correct = balloon.letter === expected;
        const combo = correct ? s.combo + 1 : 0;
        const lives = s.lives - (correct ? 0 : 1);

        const balloons = s.balloons.map((item) =>
          item.id === id ? { ...item, popped: true, popAge: 0 } : item,
        );

        const score = s.score + (correct ? Math.round(100 * Math.min(1 + combo * 0.1, 5)) : 0);

        if (correct) {
          const collectedLetters = [...s.collectedLetters, balloon.letter];
          const nextDisplayLetters = [...s.displayLetters];
          nextDisplayLetters[collectedLetters.length - 1] = balloon.letter;

          // Semua huruf terkumpul → lanjut ke kata berikutnya
          if (collectedLetters.length >= s.targetLetters.length) {
            return {
              ...s,
              balloons,
              score,
              combo,
              maxCombo: Math.max(s.maxCombo, combo),
              lives,
              collectedLetters,
              displayLetters: nextDisplayLetters,
              forceTarget: true,
              targetLeft: 5,
              shakeLeft: 0,
            };
          }

          // Huruf masih ada → lanjut ke huruf berikutnya
          const nextLetter = s.targetLetters[collectedLetters.length] || s.target;
          return {
            ...s,
            balloons: balloons.map((b) => ({ ...b, isTarget: b.letter === nextLetter })),
            score,
            combo,
            maxCombo: Math.max(s.maxCombo, combo),
            lives,
            collectedLetters,
            displayLetters: nextDisplayLetters,
            forceTarget: true,
            targetLeft: 5,
            target: nextLetter,
            targetName: nextLetter,
          };
        }

        // Salah klik
        if (lives <= 0) {
          return {
            ...s,
            balloons,
            score,
            combo: 0,
            lives,
            shakeLeft: 0.25,
            missedTargets: s.missedTargets + 1,
            phase: "gameover",
          };
        }

        return {
          ...s,
          balloons,
          score,
          combo: 0,
          lives,
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
        const height = fieldRef.current?.clientHeight ?? 320;
        const width = fieldRef.current?.clientWidth ?? 320;

        let missedTargets = s.missedTargets;
        let combo = s.combo;
        let lives = s.lives;
        const balloons = s.balloons.flatMap((balloon) => {
          if (balloon.popped)
            return balloon.popAge + delta < 0.2
              ? [{ ...balloon, popAge: balloon.popAge + delta }]
              : [];
          // Buah jatuh dari atas ke bawah
          const y = balloon.y + balloon.speed * 60 * delta;
          if (y > height + 60) {
            if (balloon.isTarget) {
              missedTargets++;
              if (missedTargets >= 2) {
                combo = 0;
                missedTargets = 0;
              }
              lives -= 1;
            }
            return [];
          }
          return [{ ...balloon, y }];
        });

        let next: BalloonState = {
          ...s,
          balloons,
          combo,
          missedTargets,
          lives,
          targetLeft: s.targetLeft - delta,
          spawnLeft: s.spawnLeft - delta,
          shakeLeft: Math.max(0, s.shakeLeft - delta),
        };

        // Target otomatis di-reset (memastikan target selalu ter-spawn)
        if (next.targetLeft <= 0) {
          const letter = currentTargetLetter(next) || s.target;
          next = {
            ...next,
            target: letter,
            targetName: letter,
            targetLeft: 5,
            balloons: next.balloons.map((balloon) => ({ ...balloon, isTarget: balloon.letter === letter })),
            forceTarget: true,
          };
        }

        // Game over hanya ketika lives habis
        if (next.lives <= 0) {
          next = { ...next, phase: "gameover", shakeLeft: 0.25 };
        }

        // Spawn balon (mekanik physics tetap: posisi x acak, y dari atas, kecepatan turun)
        if (next.spawnLeft <= 0) {
          const wantTarget = next.forceTarget || next.spawned % 3 === 0 || Math.random() < 0.35;
          const currentLetter = currentTargetLetter(next) || s.target;
          const choices = HIJAIYAH_LETTERS.filter((item) => item.letter !== currentLetter);
          const letter = wantTarget
            ? currentLetter
            : choices.length
              ? choices[Math.floor(Math.random() * choices.length)].letter
              : currentLetter;
          next = {
            ...next,
            spawned: next.spawned + 1,
            spawnLeft: 0.8 - (0.5 * (60 - 0)) / 60,
            forceTarget: false,
            balloons: [
              ...next.balloons,
              {
                id: `balloon-${next.spawned}`,
                letter,
                x: Math.random() * Math.max(0, width - 80),
                y: -100, // Muncul dari atas layar
                speed: 1.3 + Math.floor(next.spawned / 10) * 0.08,
                isTarget: letter === currentLetter,
                popped: false,
                popAge: 0,
                color: next.spawned % 4,
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
    ...record,
    fieldRef,
    startGame,
    continueToNextWord,
    pause,
    resume,
    pop,
    targetLetter,
    targetLetterName: targetLetter,
  };
}
