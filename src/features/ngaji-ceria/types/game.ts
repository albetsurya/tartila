/**
 * Game Session, Level, and UI State Definitions
 * Sesuai docs/GAME_DESIGN_GUIDELINES.md Bab 10.2, 10.3, & 10.4
 */

export type GameId = "harakat-slasher" | "hijaiyah-harvest";
export type GameMode = "practice" | "challenge";
export type GameSessionStatus =
  | "active"
  | "paused"
  | "completed"
  | "abandoned";

export interface SessionState {
  sessionId: string;
  userId: string;
  gameId: GameId;
  mode: GameMode;
  currentLevel: number;
  totalScore: number;
  completedLevels: number[];
  status: GameSessionStatus;
  ticketConsumed: boolean;
  ticketTransactionId?: string;
  rewardClaimedLevelIds: string[];
  startedAt: string;
  updatedAt: string;
}

export interface LevelState {
  levelId: string;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  missedCount: number;
  targetProgress: number;
  targetTotal: number;
  remainingTime?: number;
  isCompleted: boolean;
  isFailed?: boolean;
  startedAt: number;
}

export interface GameUIState {
  screen:
    | "lobby"
    | "tutorial"
    | "level-intro"
    | "playing"
    | "paused"
    | "level-result"
    | "session-result";
  isHelpOpen: boolean;
  isExitConfirmOpen: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
}
