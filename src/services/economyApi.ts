import { callREST } from "./api";

/** Kontrak Backend Go (sambung-ngaji/backend/go/internal/api). */

export interface BuyItemRequest {
  kind: string;
  itemId: string;
  price: number;
}

/** Balasan POST /api/v1/shop/buy (ShopUnlockResult). */
export interface BuyItemResult {
  granted: boolean;
  already: boolean;
  coins: number;
}

/** Balasan POST /api/v1/user/claim-daily (ClaimDailyResult). */
export interface ClaimDailyResult {
  success: boolean;
  claimed: boolean;
  coinsAwarded: number;
  totalCoins: number;
  coins: number;
  streak: number;
  loginStreak: number;
  date: string;
  lastClaimDate: string;
}

export interface EconomyUpdateRequest {
  hearts?: number;
  tickets?: number;
}

/** Balasan PATCH /api/v1/user/economy (hanya hearts & tickets). */
export interface EconomySyncResult {
  success: boolean;
  hearts: number;
  tickets: number;
}

export const economyApi = {
  claimDaily: (day: number, coins: number) =>
    callREST<ClaimDailyResult>("POST", "/api/v1/user/claim-daily", {
      day,
      coins,
    }),

  buyItem: (req: BuyItemRequest) =>
    callREST<BuyItemResult>("POST", "/api/v1/shop/buy", req),

  updateEnergy: (req: EconomyUpdateRequest) =>
    callREST<EconomySyncResult>("PATCH", "/api/v1/user/economy", req),
};
