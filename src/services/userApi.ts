import { callREST } from "./api";
import { voucherApi, type RedeemVoucherResponse } from "./voucherApi";

export type { RedeemVoucherResponse };

export interface UserProfileResponse {
  user?: any;
  profile?: any;
  mascot_gender?: "boy" | "girl" | string;
  coins?: number;
  current_streak?: number;
  login_streak?: number;
  daily_claimed?: boolean;
  last_daily_claim_date?: string | null;
  last_claim_date?: string | null;
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
  coins?: number;
  streak: number;
  loginStreak?: number;
  date: string;
  lastClaimDate?: string;
  message?: string;
}

export interface DailyRewardStatusResponse {
  claimedToday: boolean;
  lastDailyClaimDate?: string;
  lastClaimDate?: string;
  todayDate: string;
  currentStreak: number;
  loginStreak?: number;
  coins: number;
}

export const userApi = {
  async getUserProfile(): Promise<UserProfileResponse> {
    return await callREST<UserProfileResponse>("GET", "/api/v1/user/profile");
  },

  async updateUserMascot(gender: "boy" | "girl" | string): Promise<MascotUpdateResponse> {
    const norm = gender === "girl" ? "girl" : "boy";
    return await callREST<MascotUpdateResponse>("PATCH", "/api/v1/user/mascot", {
      gender: norm,
    });
  },

  async claimDailyReward(day?: number, coins?: number): Promise<ClaimDailyRewardResponse> {
    return await callREST<ClaimDailyRewardResponse>("POST", "/api/v1/user/claim-daily", {
      day,
      coins,
    });
  },

  async getDailyRewardStatus(): Promise<DailyRewardStatusResponse> {
    return await callREST<DailyRewardStatusResponse>("GET", "/api/v1/user/daily-status");
  },

  async redeemVoucher(code: string) {
    return await voucherApi.redeemVoucher(code);
  },
};
