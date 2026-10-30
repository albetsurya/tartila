import { callREST } from "../../../services/api";
import { API_BASE_URL } from "../../../constants";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

export interface ServerSupabaseLeaderboardEntry {
  id: string;
  name: string;
  score: number;
  game_id: string;
  updated_at: string;
  avatar_url?: string | null;
  user_id?: string | null;
}

export interface ServerSupabaseLeaderboardResponse {
  gameId: string;
  period: "daily" | "weekly";
  entries: ServerSupabaseLeaderboardEntry[];
  total: number;
}

/** REST fallback (Go server, SQLite): superset of Supabase response. */
export interface ServerGoLeaderboardResponse {
  success: boolean;
  entries: ServerSupabaseLeaderboardEntry[];
  total: number;
  gameId: string;
  period: "daily" | "weekly";
}

/** Query pemain skor real dari database. Prefer RPC Supabase (RLS-safe), fallback REST. */
export async function fetchGlobalLeaderboard(
  gameId: string,
  period: "daily" | "weekly",
  limit = 50,
): Promise<ServerSupabaseLeaderboardResponse> {
  if (isNgajiCeriaServerAvailable() && API_BASE_URL) {
    try {
      return await callREST<ServerGoLeaderboardResponse>(
        "GET",
        "/api/v1/ngaji-ceria/leaderboard/global",
        undefined,
        { gameId, period, limit },
      );
    } catch (err) {
      console.warn("[ngajiCeriaApi] REST leaderboard unavailable, trying Supabase RPC:", err);
    }
  }

  if (!isSupabaseConfigured) {
    throw new Error("Global leaderboard belum dikonfigurasi: silakan set SUPABASE_URL / SUPABASE_ANON_KEY.");
  }

  const { data, error } = await supabase.rpc("get_leaderboard_for_game", {
    p_game_id: gameId,
    p_period: period,
    p_limit: limit,
  });

  if (error) {
    throw new Error(`RPC get_leaderboard_for_game gagal: ${error.message}`);
  }

  const entries = (data ?? []).map((e: any) => ({
    id: e.user_id ?? e.userId ?? e.id,
    name: e.nickname ?? e.name ?? e.display_name ?? e.username ?? e.full_name,
    score: Number(e.score ?? 0),
    game_id: e.game_id ?? gameId,
    updated_at: e.updated_at ?? e.updatedAt ?? "",
    avatar_url: e.avatar_url ?? null,
    user_id: e.user_id ?? null,
  }));

  return {
    gameId,
    period,
    entries,
    total: entries.length,
  };
}
