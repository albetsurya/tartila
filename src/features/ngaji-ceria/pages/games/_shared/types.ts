export type GamePhase = "idle" | "playing" | "paused" | "gameover";
export type GameAccent = "cyan" | "violet" | "pink" | "emerald";

export const ACCENTS = {
  cyan: { text: "text-teal-300", button: "bg-teal-500", background: "from-teal-950 to-teal-950", border: "border-teal-400/30" },
  violet: { text: "text-teal-300", button: "bg-teal-500", background: "from-[#134e4a] to-[#134e4a]", border: "border-teal-400/30" },
  pink: { text: "text-rose-300", button: "bg-rose-500", background: "from-[#134e4a] to-[#0d9488]", border: "border-rose-400/30" },
  emerald: { text: "text-teal-300", button: "bg-teal-500", background: "from-[#052E2B] to-[#134e4a]", border: "border-teal-400/30" },
} as const;

import type { ReactNode } from "react";

export interface GameOverModalProps {
  visible: boolean;
  score: number;
  best: number;
  isNewRecord: boolean;
  onRetry: () => void;
  onExit: () => void;
  accent?: GameAccent;
  title?: string;
  description?: string;
  children?: ReactNode;
  maxCombo?: number;
  victory?: boolean;
  achievementIds?: string[];
}
