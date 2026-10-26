/**
 * Evaluator timing dan nada Rost untuk Lab Irama (Tartila).
 * Disesuaikan khusus untuk anak-anak dengan window toleransi yang lebih ramah:
 * - Perfect: <= 120ms
 * - Good: <= 250ms
 * - Miss: > 250ms
 */

export type RostTone = 'datar' | 'naik' | 'turun';

export type HitJudgment = 'perfect' | 'good' | 'miss';

export type IramaRank = 'mumtaz' | 'jayyid-jiddan' | 'jayyid' | 'maqbul';

export const HIT_WINDOWS = {
  PERFECT: 120, // ms
  GOOD: 250,    // ms
} as const;

export interface HitResult {
  judgment: HitJudgment;
  score: number;
  label: string;
  color: string;
  diffMs: number;
}

export function judgeBeatHit(diffMs: number): HitResult {
  const absDiff = Math.abs(diffMs);

  if (absDiff <= HIT_WINDOWS.PERFECT) {
    return {
      judgment: 'perfect',
      score: 100,
      label: 'Sempurna!',
      color: '#0D9488', // Teal cerah
      diffMs,
    };
  }

  if (absDiff <= HIT_WINDOWS.GOOD) {
    return {
      judgment: 'good',
      score: 60,
      label: 'Bagus!',
      color: '#0284C7', // Biru sky
      diffMs,
    };
  }

  return {
    judgment: 'miss',
    score: 0,
    label: 'Terlewat!',
    color: '#EF4444', // Merah koral
    diffMs,
  };
}

export function classifyRostTone(hintTone?: string | null): RostTone {
  if (!hintTone) return 'datar';
  const lower = hintTone.toLowerCase();
  // Jika pembuka 3x nada (Datar — Naik — Turun), nada pertama adalah datar
  if (lower.includes('datar')) return 'datar';
  if (lower.includes('naik')) return 'naik';
  if (lower.includes('turun')) return 'turun';
  return 'datar';
}

export function calculateIramaRank(accuracyPercent: number): IramaRank {
  if (accuracyPercent >= 90) return 'mumtaz';
  if (accuracyPercent >= 75) return 'jayyid-jiddan';
  if (accuracyPercent >= 60) return 'jayyid';
  return 'maqbul';
}

export const RANK_METADATA: Record<
  IramaRank,
  { label: string; arab: string; stars: number; badgeColor: string; desc: string }
> = {
  mumtaz: {
    label: 'Mumtaz (Istimewa)',
    arab: 'مُمْتَاز',
    stars: 3,
    badgeColor: 'bg-emerald-500 text-white',
    desc: 'Alhamdulillah! Ketukan dan nada Rost-mu sangat pas dan stabil.',
  },
  'jayyid-jiddan': {
    label: 'Jayyid Jiddan (Sangat Baik)',
    arab: 'جَيِّد جِدًّا',
    stars: 2,
    badgeColor: 'bg-teal-500 text-white',
    desc: 'MasyaAllah, pendengaran dan irama ketukanmu sudah sangat terlatih.',
  },
  jayyid: {
    label: 'Jayyid (Baik)',
    arab: 'جَيِّد',
    stars: 2,
    badgeColor: 'bg-amber-500 text-white',
    desc: 'Sudah bagus! Latih terus kestabilan tempo agar makin sempurna.',
  },
  maqbul: {
    label: 'Maqbul (Cukup)',
    arab: 'مَقْبُول',
    stars: 1,
    badgeColor: 'bg-rose-500 text-white',
    desc: 'Tetap semangat! Dengarkan kembali panduan ketukan di Modul 1 ya.',
  },
};
