/**
 * Konfigurasi Level & Time Attack untuk Tilawati Memory Match
 * Berlaku sama untuk semua Jilid 1 - 6
 */

export interface MemoryLevelConfig {
  level: number;
  pairsCount: number;
  cardsCount: number;
  timeLimitSeconds: number;
  title: string;
  subtitle: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
  gridColsClass: string;
}

export const MEMORY_LEVELS_CONFIG: MemoryLevelConfig[] = [
  {
    level: 1,
    pairsCount: 4,
    cardsCount: 8,
    timeLimitSeconds: 60,
    title: 'Level 1: Pemula',
    subtitle: '4 Pasang Kartu (8 Kartu)',
    desc: 'Latihan dasar mencocokkan 4 pasang kartu dengan batas waktu 60 detik.',
    badgeBg: 'bg-[#10B981]',
    badgeText: 'text-white',
    gridColsClass: 'grid-cols-2 sm:grid-cols-4',
  },
  {
    level: 2,
    pairsCount: 6,
    cardsCount: 12,
    timeLimitSeconds: 90,
    title: 'Level 2: Terampil',
    subtitle: '6 Pasang Kartu (12 Kartu)',
    desc: 'Tantangan menengah mencocokkan 6 pasang kartu dengan batas waktu 90 detik.',
    badgeBg: 'bg-[#0D9488]',
    badgeText: 'text-white',
    gridColsClass: 'grid-cols-3 sm:grid-cols-4',
  },
  {
    level: 3,
    pairsCount: 8,
    cardsCount: 16,
    timeLimitSeconds: 120,
    title: 'Level 3: Mahir',
    subtitle: '8 Pasang Kartu (16 Kartu)',
    desc: 'Asah fokus dengan 8 pasang kartu acak dalam tempo 120 detik.',
    badgeBg: 'bg-[#F59E0B]',
    badgeText: 'text-[#78350F]',
    gridColsClass: 'grid-cols-4',
  },
  {
    level: 4,
    pairsCount: 10,
    cardsCount: 20,
    timeLimitSeconds: 150,
    title: 'Level 4: Master',
    subtitle: '10 Pasang Kartu (20 Kartu)',
    desc: 'Ujian ketelitian puncak dengan 10 pasang kartu dalam waktu 150 detik.',
    badgeBg: 'bg-[#E11D48]',
    badgeText: 'text-white',
    gridColsClass: 'grid-cols-4 sm:grid-cols-5',
  },
];

export function getMemoryLevelConfig(level: number): MemoryLevelConfig {
  const normalized = Number(level);
  return (
    MEMORY_LEVELS_CONFIG.find((l) => l.level === normalized) ||
    MEMORY_LEVELS_CONFIG[0]
  );
}

/**
 * Menghitung perolehan bintang (1-3 bintang) berdasarkan sisa waktu
 */
export function calculateMemoryStars(
  timeLeftSeconds: number,
  timeLimitSeconds: number
): number {
  if (timeLimitSeconds <= 0) return 1;
  const ratio = timeLeftSeconds / timeLimitSeconds;
  if (ratio >= 0.5) return 3; // Sisa waktu >= 50%
  if (ratio >= 0.2) return 2; // Sisa waktu >= 20%
  return 1;
}
