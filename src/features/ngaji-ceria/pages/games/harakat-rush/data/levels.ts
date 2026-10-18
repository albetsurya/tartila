export type LevelConfig = {
  id: number;
  name: string;
  targetCount: number;
  speed: number;
  themeColor: string;
};

const TIERS = [
  { name: "Pemula", color: "#22C55E" },
  { name: "Terampil", color: "#F59E0B" },
  { name: "Mahir", color: "#F97316" },
  { name: "Ahli", color: "#EF4444" },
  { name: "Legenda", color: "#7E22CE" },
];

const TARGET_COUNTS = [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45];
const SPEEDS = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
const ROMAN = ["I", "II", "III"];

export const LEVELS: LevelConfig[] = TARGET_COUNTS.map((targetCount, index) => {
  const tier = TIERS[Math.floor(index / 3)];
  return {
    id: index + 1,
    name: `${tier.name} ${ROMAN[index % 3]}`,
    targetCount,
    speed: SPEEDS[index],
    themeColor: tier.color,
  };
});

export const MAX_LEVEL = LEVELS.length;

export function getLevelConfig(levelId: number): LevelConfig {
  const index = Math.min(Math.max(levelId, 1), MAX_LEVEL) - 1;
  return LEVELS[index];
}
