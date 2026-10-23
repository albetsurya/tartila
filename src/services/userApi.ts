import { callREST } from "./api";

export interface UserProfileResponse {
  user?: any;
  profile?: any;
  mascot_gender?: "boy" | "girl" | string;
  [key: string]: any;
}

export interface MascotUpdateResponse {
  success?: boolean;
  mascot_gender: "boy" | "girl";
  user?: any;
}

export interface ClaimDailyRewardResponse {
  success: boolean;
  claimed: boolean;
  coinsAwarded: number;
  totalCoins: number;
  streak: number;
  date: string;
  message?: string;
}

export interface DailyRewardStatusResponse {
  claimedToday: boolean;
  lastDailyClaimDate?: string;
  todayDate: string;
  currentStreak: number;
  coins: number;
}

export const userApi = {
  async getUserProfile(): Promise<UserProfileResponse> {
    try {
      return await callREST<UserProfileResponse>("GET", "/api/v1/user/profile");
    } catch {
      // Fallback without /v1 if root-scoped
      return await callREST<UserProfileResponse>("GET", "/api/user/profile");
    }
  },

  async updateUserMascot(gender: "boy" | "girl" | string): Promise<MascotUpdateResponse> {
    const norm = gender === "girl" ? "girl" : "boy";
    try {
      return await callREST<MascotUpdateResponse>("PATCH", "/api/v1/user/mascot", {
        gender: norm,
      });
    } catch {
      // Fallback without /v1
      return await callREST<MascotUpdateResponse>("PATCH", "/api/user/mascot", {
        gender: norm,
      });
    }
  },

  async claimDailyReward(day?: number, coins?: number): Promise<ClaimDailyRewardResponse> {
    try {
      return await callREST<ClaimDailyRewardResponse>("POST", "/api/v1/user/claim-daily", {
        day,
        coins,
      });
    } catch {
      return await callREST<ClaimDailyRewardResponse>("POST", "/api/user/claim-daily", {
        day,
        coins,
      });
    }
  },

  async getDailyRewardStatus(): Promise<DailyRewardStatusResponse> {
    try {
      return await callREST<DailyRewardStatusResponse>("GET", "/api/v1/user/daily-status");
    } catch {
      return await callREST<DailyRewardStatusResponse>("GET", "/api/user/daily-status");
    }
  },
};
