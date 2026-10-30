/**
 * Bot Simulator — fitur QA eksklusif superadmin.
 * Setiap bot memiliki: id, nama, id avatar, skor, dan status ready (selalu siap).
 * State disimpan di localStorage (`tartila-bot-simulator`) agar survive
 * translasi Lobi -> Gameplay; penggunaan terbatas pada superadmin.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export interface Bot {
  id: string;
  name: string;
  avatarId: string;
  /** Gender & variant avatar bot, dipilih secara acak di addBot(). */
  gender?: "boy" | "girl";
  variant?: 1 | 2 | 3;
  score: number;
  /** Bot otomatis ready saat ditambahkan. */
  isReady: true;
}

export interface BotAnswerResult {
  botId: string;
  answer: string;
  timeTakenMs: number;
  isCorrect: boolean;
  scoreAwarded: number;
}

const BOT_STATE_KEY = "tartila-bot-simulator";

const BOT_NAMES: readonly string[] = [
  "Amira Bot",
  "Bariq Bot",
  "Dian Bot",
  "Fajar Bot",
  "Hana Bot",
  "Irfan Bot",
];

/** Avatar bot dipilih acak berdasarkan gender + variant.
 *  Format avatarId: `boy-1`, `boy-2`, `boy-3`, `girl-1`, `girl-2`, `girl-3`
 */
export const BOT_GENDERS = ["boy", "girl"] as const;
export const BOT_VARIANTS = [1, 2, 3] as const;

export const BOT_AVATAR_IDS = [
  "boy-1",
  "boy-2",
  "boy-3",
  "girl-1",
  "girl-2",
  "girl-3",
] as const;

/** Pilih gender & variant secara acak, kembalikan { avatarId, gender, variant }. */
export function pickBotAvatar(): { avatarId: string; gender: "boy" | "girl"; variant: 1 | 2 | 3 } {
  const gender: "boy" | "girl" = BOT_GENDERS[Math.floor(Math.random() * BOT_GENDERS.length)];
  const variant: 1 | 2 | 3 = BOT_VARIANTS[Math.floor(Math.random() * BOT_VARIANTS.length)];
  return { avatarId: `${gender}-${variant}`, gender, variant };
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function loadBotState(): Bot[] {
  try {
    const raw = localStorage.getItem(BOT_STATE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Bot[];
    return Array.isArray(parsed)
      ? parsed.filter((bot) => bot.id && bot.avatarId)
      : [];
  } catch {
    return [];
  }
}

function saveBotState(bots: Bot[]): void {
  try {
    localStorage.setItem(BOT_STATE_KEY, JSON.stringify(bots));
  } catch {
    // localStorage tidak tersedia; bot tetap berfungsi selama sesi halaman.
  }
}

/**
 * Hook simulator bot.
 * - addBot: tambah bot acak (otomatis ready).
 * - removeBot: hapus bot.
 * - reset: hapus semua bot dan timer.
 * - scheduleAnswers: pada QUESTION_ACTIVE, program timer 2-4s tiap bot,
 *   memilih satu opsi jawaban acak (A/B/C/D).
 * - resolveAnswers: pada REVEAL_ANSWER, nilai tiap bot pakai rumus
 *   `Math.round((sisaWaktu / totalWaktu) * 1000)` bila benar, 0 bila salah.
 */
export function useBotSimulator() {
  const [bots, setBots] = useState<Bot[]>(() => loadBotState());

  // Mirror terbaru dari bots tanpa harus masuk dependensi tiap callback.
  const botsRef = useRef<Bot[]>(bots);
  useEffect(() => {
    botsRef.current = bots;
    saveBotState(bots);
  }, [bots]);

  // Jawaban yang sudah diprogramkan tapi belum dinilai sampai fase reveal.
  const pendingRef = useRef<Map<string, { answer: string; timeTakenMs: number }>>(
    new Map(),
  );
  // Timer aktif, untuk dibatalkan bila soal ganti sebelum reveal.
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    pendingRef.current.clear();
  }, []);

  const addBot = useCallback((name?: string): Bot => {
    const { avatarId, gender, variant } = pickBotAvatar();
    const created: Bot = {
      id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name && name.trim().length > 0 ? name.trim().slice(0, 12) : BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
      avatarId,
      gender,
      variant,
      score: 0,
      isReady: true,
    };
    setBots((prev) => [...prev, created]);
    return created;
  }, []);

  const removeBot = useCallback((id: string) => {
    setBots((prev) => prev.filter((bot) => bot.id !== id));
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setBots([]);
  }, [clearTimers]);

  /** Program bot menjawab 2-4s setelah QUESTION_ACTIVE, memilih opsi acak. */
  const scheduleAnswers = useCallback(
    (timeLimitSeconds: number, onBotAnswer?: (result: BotAnswerResult) => void) => {
      clearTimers();
      const totalMs = (timeLimitSeconds ?? 20) * 1000;
      void totalMs;
      const nowBots = botsRef.current;

      nowBots.forEach((bot) => {
        const delayMs = 2000 + Math.floor(Math.random() * 2000); // 2-4 detik
        const answer = OPTION_LETTERS[Math.floor(Math.random() * OPTION_LETTERS.length)];
        pendingRef.current.set(bot.id, { answer, timeTakenMs: delayMs });

        const timer = setTimeout(() => {
          timersRef.current.delete(bot.id);
          // Jawaban bot "terkirim" ke peladen pada simulasi lokal;
          // koreksi benar/salah baru diketahui pada REVEAL_ANSWER.
        }, delayMs);
        timersRef.current.set(bot.id, timer);
      });
      void onBotAnswer; // callback simulasi dini hanya untuk notifikasi luar
    },
    [clearTimers],
  );

  /** Dinilai pada REVEAL_ANSWER: koreksi skor pakai rumus kecepatan. */
  const resolveAnswers = useCallback(
    (
      correctAnswer: string,
      totalTimeMs = 20000,
      onBotAnswer?: (result: BotAnswerResult) => void,
    ) => {
      setBots((prev) =>
        prev.map((bot) => {
          const recorded = pendingRef.current.get(bot.id);
          if (!recorded) return bot;
          const isCorrect = recorded.answer === correctAnswer;
          const sisaWaktu = totalTimeMs - recorded.timeTakenMs;
          const scoreAwarded = isCorrect
            ? Math.max(0, Math.round((sisaWaktu / totalTimeMs) * 1000))
            : 0;
          const result: BotAnswerResult = {
            botId: bot.id,
            answer: recorded.answer,
            timeTakenMs: recorded.timeTakenMs,
            isCorrect,
            scoreAwarded,
          };
          onBotAnswer?.(result);
          return { ...bot, score: bot.score + scoreAwarded };
        }),
      );
      pendingRef.current.clear();
    },
    [],
  );

  return {
    bots,
    addBot,
    removeBot,
    reset,
    scheduleAnswers,
    resolveAnswers,
    clearTimers,
  };
}

/** Hapus seluruh state bot + timer (dipanggil saat keluar halaman gameplay). */
export function clearBotSimulatorState(): void {
  try {
    localStorage.removeItem(BOT_STATE_KEY);
  } catch {
    // noop
  }
}
