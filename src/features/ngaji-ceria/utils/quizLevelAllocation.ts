export const MAX_QUESTIONS_PER_LEVEL = 5;

export interface QuizLevelConfig {
  level: number;
  title: string;
  startIndex: number;
  questionCount: number;
  durationSeconds: number;
  description: string;
}

/**
 * Logika Alokasi Soal Kuis Adaptif (Smart Distribution):
 * - Jika total < 5 soal: digabung menjadi 1 level saja.
 * - Jika total >= 5 soal: dibagi dinamis per 5 soal (misal 8 soal -> L1: 5 soal, L2: 3 soal, L3 disembunyikan).
 * - Maksimal 3 level.
 */
export function computeQuizLevels(totalQuestions: number): QuizLevelConfig[] {
  if (totalQuestions <= 0) {
    return [
      {
        level: 1,
        title: 'Level 1: Utama',
        startIndex: 0,
        questionCount: 0,
        durationSeconds: 60,
        description: 'Tidak ada soal yang tersedia.',
      },
    ];
  }

  // Kasus data sangat sedikit (< 5 soal): gabungkan menjadi 1 level saja
  if (totalQuestions < MAX_QUESTIONS_PER_LEVEL) {
    return [
      {
        level: 1,
        title: 'Level 1: Utama',
        startIndex: 0,
        questionCount: totalQuestions,
        durationSeconds: Math.max(45, totalQuestions * 15),
        description: `Jawab seluruh ${totalQuestions} soal (minimal 70% benar).`,
      },
    ];
  }

  const levels: QuizLevelConfig[] = [];
  const levelNames = ['Pemula', 'Terampil', 'Mahir'];

  for (let lvl = 1; lvl <= 3; lvl++) {
    const startIndex = (lvl - 1) * MAX_QUESTIONS_PER_LEVEL;
    if (startIndex >= totalQuestions) {
      break; // Level kosong disembunyikan
    }

    const countForThisLevel =
      Math.min(startIndex + MAX_QUESTIONS_PER_LEVEL, totalQuestions) - startIndex;

    if (countForThisLevel <= 0) break;

    levels.push({
      level: lvl,
      title: `Level ${lvl}: ${levelNames[lvl - 1] || `Tantangan ${lvl}`}`,
      startIndex,
      questionCount: countForThisLevel,
      durationSeconds: Math.max(45, countForThisLevel * 12),
      description: `Jawab ${countForThisLevel} soal (minimal 70% benar).`,
    });
  }

  return levels;
}
