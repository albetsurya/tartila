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
    pairsCount: 3,
    cardsCount: 6,
    timeLimitSeconds: 60,
    title: "Level 1: Pemula",
    subtitle: "3 Pasang (6 Kartu)",
    desc: "Latihan dasar mencocokkan 3 pasang kartu dengan batas waktu 60 detik.",
    badgeBg: "bg-[#10B981]",
    badgeText: "text-white",
    gridColsClass: "grid-cols-3",
  },
  {
    level: 2,
    pairsCount: 4,
    cardsCount: 8,
    timeLimitSeconds: 90,
    title: "Level 2: Terampil",
    subtitle: "4 Pasang (8 Kartu)",
    desc: "Tantangan menengah mencocokkan 4 pasang kartu dengan batas waktu 90 detik.",
    badgeBg: "bg-[#0D9488]",
    badgeText: "text-white",
    gridColsClass: "grid-cols-4",
  },
  {
    level: 3,
    pairsCount: 6,
    cardsCount: 12,
    timeLimitSeconds: 120,
    title: "Level 3: Mahir",
    subtitle: "6 Pasang (12 Kartu)",
    desc: "Asah fokus dengan 6 pasang kartu acak dalam tempo 120 detik.",
    badgeBg: "bg-[#F59E0B]",
    badgeText: "text-[#78350F]",
    gridColsClass: "grid-cols-4",
  },
  {
    level: 4,
    pairsCount: 8,
    cardsCount: 16,
    timeLimitSeconds: 150,
    title: "Level 4: Master",
    subtitle: "8 Pasang (16 Kartu)",
    desc: "Ujian ketelitian puncak dengan 8 pasang kartu dalam waktu 150 detik.",
    badgeBg: "bg-[#E11D48]",
    badgeText: "text-white",
    gridColsClass: "grid-cols-4",
  },
];

export function getMemoryLevelConfig(level: number): MemoryLevelConfig {
  const normalized = Number(level);
  return (
    MEMORY_LEVELS_CONFIG.find((l) => l.level === normalized) ||
    MEMORY_LEVELS_CONFIG[0]
  );
}

export function calculateMemoryStars(
  timeLeftSeconds: number,
  timeLimitSeconds: number,
): number {
  if (timeLimitSeconds <= 0) return 1;
  const ratio = timeLeftSeconds / timeLimitSeconds;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.2) return 2;
  return 1;
}
