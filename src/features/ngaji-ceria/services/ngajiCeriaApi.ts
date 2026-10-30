import { callREST } from "../../../services/api";
import { API_BASE_URL } from "../../../constants";

/** Di Vite dev / prod, server selalu diakses via Vite proxy / URL relatif. */
export const isNgajiCeriaServerAvailable = () => true;

export interface ServerNgajiProgress {
  xp: number;
  totalScore: number;
  gamesPlayed: number;
  coins: number;
  currentStreak: number;
  lastActivityDate?: string;
  dailyDate: string;
  dailyGamesPlayed: number;
  dailyTotalScore: number;
  dailyClaimedMissions: string[];
  achievements: string[];
}

export interface ServerProgressEvent {
  eventId: string;
  gameId: string;
  score: number;
  baseXp: number;
  achievementIds: string[];
}

export interface MissionRewardResponse {
  missionId: string;
  claimed: boolean;
  coins: number;
  xp: number;
  progress: ServerNgajiProgress;
}

export interface PendingMissionsResponse {
  hasPendingMissions: boolean;
  pendingMissions: string[];
}

export interface ServerLeaderboardEntry {
  id: string;
  name: string;
  score: number;
  gameId: string;
  updatedAt: string;
}

/** Endpoint Warung Santri (bypass koin untuk role privileged — see handler_shop.go). */
export interface ServerShopUnlockResult {
  granted: boolean;
  already: boolean;
  coins: number;
}

export const shopApi = {
  buyItem: (kind: string, itemId: string, price: number) =>
    callREST<ServerShopUnlockResult>("POST", "/api/v1/shop/buy", {
      kind,
      itemId,
      price,
    }),
};

export interface ServerLeaderboardResponse {
  gameId: string;
  period: "daily" | "weekly";
  entries: ServerLeaderboardEntry[];
}

export const ngajiCeriaApi = {
  getProgress: () =>
    callREST<ServerNgajiProgress>("GET", "/api/v1/ngaji-ceria/progress"),
  awardProgress: (event: ServerProgressEvent) =>
    callREST<ServerNgajiProgress>(
      "POST",
      "/api/v1/ngaji-ceria/progress/events",
      event,
    ),
  claimMission: (missionId: string) =>
    callREST<MissionRewardResponse>(
      "POST",
      `/api/v1/ngaji-ceria/missions/${encodeURIComponent(missionId)}/claim`,
    ),
  getPendingMissions: () =>
    callREST<PendingMissionsResponse>("GET", "/api/v1/ngaji-ceria/missions/pending"),
  getLeaderboard: (gameId: string, period: "daily" | "weekly" = "weekly") =>
    callREST<ServerLeaderboardResponse>(
      "GET",
      "/api/v1/ngaji-ceria/leaderboard",
      undefined,
      { gameId, period },
    ),
  submitLeaderboard: (event: ServerProgressEvent) =>
    callREST<{ progress: ServerNgajiProgress }>(
      "POST",
      "/api/v1/ngaji-ceria/leaderboard",
      event,
    ),
};
