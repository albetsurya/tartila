import type { TargetAndTransition } from "framer-motion";

export type AnswerFeedbackState = "correct" | "wrong" | "none";

/**
 * Animasi umpan balik jawaban untuk anak:
 * - `correct` → `pop` (membesar lalu kembali) sebagai apresiasi.
 * - `wrong` → `shake` halus agar tidak terasa menghukum.
 * Mengembalikan `undefined` saat idle atau saat pengguna memilih
 * mengurangi gerakan (reduced motion).
 */
export function answerFeedbackAnimation(
  state: AnswerFeedbackState,
  reducedMotion: boolean,
): TargetAndTransition | undefined {
  if (reducedMotion || state === "none") return undefined;
  if (state === "correct") {
    return {
      scale: [1, 1.08, 1],
      transition: { duration: 0.4, ease: "easeOut" },
    };
  }
  return {
    x: [0, -7, 7, -6, 6, -3, 0],
    transition: { duration: 0.42, ease: "easeInOut" },
  };
}
