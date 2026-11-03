/**
 * Adaptive Difficulty Engine (Bab 8.3 GAME_DESIGN_GUIDELINES.md)
 *
 * Menyesuaikan parameter kecepatan jatuh (fallSpeed) dan rasio pengecoh (distractorRatio)
 * secara dinamis berdasarkan akurasi berjalan (Rolling Accuracy) pemain.
 */

export interface AdaptiveInput {
  correctCount: number;
  wrongCount: number;
  baseFallSpeed: number;
  baseDistractorRatio: number;
  mode: "practice" | "challenge";
  minAttempts?: number;
  minFallSpeed?: number;
  maxFallSpeed?: number;
}

export interface AdaptiveOutput {
  fallSpeed: number;
  distractorRatio: number;
  rollingAccuracy: number | null;
  tier: "easier" | "normal" | "harder";
  targetSpawnBonus: number; // Tambahan peluang muncul buah target (-0.05 s/d +0.25)
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function roundTo(val: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Menghitung parameter kesulitan adaptif secara real-time.
 * - Akurasi < 60%: Turunkan kecepatan & kurangi pengecoh (mencegah frustrasi).
 * - Akurasi > 85%: Naikkan kecepatan & tambah pengecoh (mencegah kebosanan).
 * - Akurasi 60% - 85%: Pertahankan parameter dasar level.
 */
export function computeAdaptiveDifficulty({
  correctCount,
  wrongCount,
  baseFallSpeed,
  baseDistractorRatio,
  mode,
  minAttempts = 3,
  minFallSpeed,
  maxFallSpeed = 25,
}: AdaptiveInput): AdaptiveOutput {
  const total = correctCount + wrongCount;
  if (total < minAttempts) {
    return {
      fallSpeed: baseFallSpeed,
      distractorRatio: baseDistractorRatio,
      rollingAccuracy: null,
      tier: "normal",
      targetSpawnBonus: 0,
    };
  }

  const rollingAccuracy = Math.round((correctCount / total) * 100);
  const isPractice = mode === "practice";

  // Batas bawah kecepatan: Practice Mode lebih toleran agar anak bisa fokus belajar
  const decimals = baseFallSpeed < 5 ? 2 : 1;
  const defaultFloor = isPractice ? (baseFallSpeed < 5 ? 0.75 : 5) : (baseFallSpeed < 5 ? 1.05 : 7);
  const floorSpeed = minFallSpeed ?? defaultFloor;

  if (rollingAccuracy < 60) {
    // Kesulitan Turun (Mencegah Frustrasi)
    const speedMultiplier = isPractice ? 0.75 : 0.85;
    const distractorMultiplier = isPractice ? 0.6 : 0.7;

    return {
      fallSpeed: clamp(
        roundTo(baseFallSpeed * speedMultiplier, decimals),
        floorSpeed,
        maxFallSpeed
      ),
      distractorRatio: clamp(
        roundTo(baseDistractorRatio * distractorMultiplier, 2),
        isPractice ? 0.1 : 0.2,
        0.85
      ),
      rollingAccuracy,
      tier: "easier",
      targetSpawnBonus: isPractice ? 0.25 : 0.15,
    };
  }

  if (rollingAccuracy > 85) {
    // Kesulitan Naik (Mencegah Kebosanan)
    const speedMultiplier = 1.15;
    const newDistractor = Math.min(0.6, baseDistractorRatio + 0.1);

    return {
      fallSpeed: clamp(
        roundTo(baseFallSpeed * speedMultiplier, decimals),
        floorSpeed,
        maxFallSpeed
      ),
      distractorRatio: clamp(
        roundTo(newDistractor, 2),
        0.1,
        0.85
      ),
      rollingAccuracy,
      tier: "harder",
      targetSpawnBonus: -0.05,
    };
  }

  // 60% - 85%: Parameter normal level
  return {
    fallSpeed: clamp(baseFallSpeed, floorSpeed, maxFallSpeed),
    distractorRatio: clamp(baseDistractorRatio, 0.1, 0.85),
    rollingAccuracy,
    tier: "normal",
    targetSpawnBonus: 0,
  };
}
