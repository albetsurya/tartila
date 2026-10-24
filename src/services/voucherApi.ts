import { callREST } from "./api";

export interface RedeemVoucherResponse {
  code: string;
  duration_days: number;
  subscription_tier: string;
  subscription_expires_at: string;
  is_vip: boolean;
  message: string;
}

export interface GenerateVouchersResponse {
  count: number;
  vouchers: Array<{
    id: string;
    code: string;
    duration_days: number;
    is_used: boolean;
    created_at: string;
  }>;
}

export const voucherApi = {
  async redeemVoucher(code: string): Promise<RedeemVoucherResponse> {
    const cleanCode = code.trim().toUpperCase();
    try {
      return await callREST<RedeemVoucherResponse>("POST", "/api/v1/voucher/redeem", {
        code: cleanCode,
      });
    } catch (err: any) {
      // If error is a business logic error (voucher not found or already used), rethrow directly
      if (err?.statusCode === 404 || err?.statusCode === 400) {
        throw err;
      }
      return await callREST<RedeemVoucherResponse>("POST", "/api/voucher/redeem", {
        code: cleanCode,
      });
    }
  },

  async generateVouchers(count: number, durationDays: number, prefix?: string): Promise<GenerateVouchersResponse> {
    try {
      return await callREST<GenerateVouchersResponse>("POST", "/api/v1/admin/voucher/generate", {
        count,
        duration_days: durationDays,
        prefix,
      });
    } catch {
      return await callREST<GenerateVouchersResponse>("POST", "/api/admin/voucher/generate", {
        count,
        duration_days: durationDays,
        prefix,
      });
    }
  },
};
