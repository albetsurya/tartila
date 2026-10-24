import { callREST } from "./api";

export interface ReferralItem {
  id: string;
  referee_id: string;
  referee_name: string;
  status: "pending" | "success" | "rewarded";
  created_at: string;
  updated_at: string;
}

export interface ReferredByInfo {
  referrer_id: string;
  referrer_name: string;
  referral_code: string;
}

export interface ReferralInfoResponse {
  referral_code: string;
  total_referrals: number;
  pending_count: number;
  success_count: number;
  referrals: ReferralItem[];
  referred_by?: ReferredByInfo;
}

export interface ApplyReferralResponse {
  referral_id: string;
  referrer_id: string;
  referrer_name: string;
  status: string;
  message: string;
}

export interface QualifyReferralResponse {
  qualified: boolean;
  message: string;
}

export const referralApi = {
  async getReferralInfo(): Promise<ReferralInfoResponse> {
    try {
      return await callREST<ReferralInfoResponse>("GET", "/api/v1/referral/info");
    } catch {
      return await callREST<ReferralInfoResponse>("GET", "/api/referral/info");
    }
  },

  async applyReferral(code: string): Promise<ApplyReferralResponse> {
    const cleanCode = code.trim().toUpperCase();
    try {
      return await callREST<ApplyReferralResponse>("POST", "/api/v1/referral/apply", {
        referral_code: cleanCode,
      });
    } catch (err: any) {
      if (err?.statusCode === 404 || err?.statusCode === 400) {
        throw err;
      }
      return await callREST<ApplyReferralResponse>("POST", "/api/referral/apply", {
        referral_code: cleanCode,
      });
    }
  },

  async qualifyReferral(): Promise<QualifyReferralResponse> {
    try {
      return await callREST<QualifyReferralResponse>("POST", "/api/v1/referral/qualify");
    } catch {
      return await callREST<QualifyReferralResponse>("POST", "/api/referral/qualify");
    }
  },
};
