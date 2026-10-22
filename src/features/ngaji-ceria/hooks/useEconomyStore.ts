import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  spendCoins,
  grantCoins,
} from "../pages/games/_shared/progression";
import {
  resolveMascotGender,
  isAccessoryAllowedForGender,
} from "@/utils/mascotHelper";

export const HEART_MAX = 5;
export const TICKET_MAX = 3;
export const SHOP_DAILY_LIMIT = 2;
export const HEART_REGEN_MS = 4 * 60 * 60 * 1000; // 4 Jam
export const TICKET_REGEN_MS = 6 * 60 * 60 * 1000; // 6 Jam

export type EnergyKind = "heart" | "ticket";
export type TilaGender = "boy" | "girl" | "neutral";
export type TilaAccessory = "none" | "peci" | "hairbow" | "flowercrown" | "glasses" | "crown" | string;

// Aliases
export type BibiGender = TilaGender;
export type BibiAccessory = TilaAccessory;

export const ENERGY_PRICES: Record<EnergyKind, number> = {
  heart: 100,
  ticket: 150,
};

export const COSTUME_PRICES: Record<string, number> = {
  peci: 200,
  hairbow: 200,
  flowercrown: 300,
  glasses: 500,
  crown: 1000,
};

export const BOOSTER_PRICES: Record<string, number> = {
  "double-exp": 100,
  "full-heart": 300,
  "streak-freeze": 150,
};

interface DailyPurchases {
  hearts: number;
  tickets: number;
  date: string;
}

/**
 * Helper untuk mengecek apakah user berhak mendapatkan kuota tanpa batas (unlimited/∞):
 * - Superadmin (role === 'SUPER_ADMIN' / 'superadmin' / 'ADMIN')
 * - VIP (isVip === true atau group_id === 'vip')
 */
export function isUnlimitedUser(
  user?: { role?: string; group_id?: string; tier?: string; is_vip?: boolean } | null,
  isVipStore?: boolean,
  groupId?: string | null,
): boolean {
  if (isVipStore) return true;
  if ((groupId || "").toLowerCase() === "vip") return true;

  let u = user;
  if (!u && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("tartila_cached_user");
      if (raw) {
        u = JSON.parse(raw);
      }
    } catch {
      // ignore
    }
  }

  if (!u) return false;
  const role = (u.role || "").toUpperCase();
  const gid = (u.group_id || "").toLowerCase();
  const tier = (u.tier || "").toLowerCase();
  const isVip = Boolean(u.is_vip);

  return (
    role === "SUPER_ADMIN" ||
    role === "SUPERADMIN" ||
    role === "ADMIN" ||
    role === "VIP" ||
    gid === "vip" ||
    tier === "superadmin" ||
    tier === "vip" ||
    isVip
  );
}

interface EconomyState {
  hearts: number;
  tickets: number;
  isVip: boolean;
  lastHeartRegen: number;
  lastTicketRegen: number;
  dailyPurchases: DailyPurchases;

  // Tila / Bibi Customization
  tilaGender: TilaGender;
  bibiGender: BibiGender; // Backward-compatibility alias
  equippedAccessory: TilaAccessory;
  ownedAccessories: string[];
  showMascot: boolean;
  setShowMascot: (show: boolean) => void;

  // Streak & Retention
  streakMultiplier: number;
  dailyRewardsClaimed: number[];
  lastDailyClaimDate: string | null;

  // Boosters
  activeBoosters: Record<string, boolean>;

  // Actions
  consumeHeart: () => boolean;
  consumeTicket: () => boolean;
  getHearts: () => number;
  getTickets: () => number;
  isUnlimited: () => boolean;
  grantEnergy: (kind: EnergyKind) => boolean;
  purchasedToday: (kind: EnergyKind) => number;
  activateVip: () => void;
  syncTime: () => void;

  setTilaGender: (gender: TilaGender) => void;
  setBibiGender: (gender: BibiGender) => void;
  buyAccessory: (id: string, price: number) => boolean;
  equipAccessory: (id: string) => void;

  applyStreakMultiplier: (streakDays: number) => number;
  claimDailyReward: (
    day: number,
    baseCoins: number,
    extra?: { hearts?: number; tickets?: number },
  ) => boolean;
  isRewardClaimedToday: () => boolean;
  buyBooster: (boosterId: string, price: number) => boolean;
}

const todayKey = () => new Date().toDateString();

export const useEconomyStore = create<EconomyState>()(
  persist(
    (set, get) => ({
      hearts: HEART_MAX,
      tickets: TICKET_MAX,
      isVip: false,
      lastHeartRegen: Date.now(),
      lastTicketRegen: Date.now(),
      dailyPurchases: { hearts: 0, tickets: 0, date: todayKey() },

      tilaGender: "girl",
      bibiGender: "girl",
      equippedAccessory: "hairbow",
      ownedAccessories: ["none", "peci", "hairbow"],
      showMascot:
        typeof window !== "undefined"
          ? window.localStorage.getItem("tila-companion-hidden") !== "1" &&
            window.localStorage.getItem("bibi-companion-hidden") !== "1"
          : true,
      setShowMascot: (show: boolean) => {
        set({ showMascot: show });
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem("tila-companion-hidden", show ? "0" : "1");
            window.localStorage.setItem("bibi-companion-hidden", show ? "0" : "1");
            window.dispatchEvent(
              new CustomEvent("tila:toggle-visibility", { detail: { hidden: !show } }),
            );
          } catch {}
        }
      },

      streakMultiplier: 1,
      dailyRewardsClaimed: [],
      lastDailyClaimDate: null,

      activeBoosters: {},

      consumeHeart: () => {
        const { hearts, isVip } = get();
        if (isVip || isUnlimitedUser(null, isVip)) return true;
        if (hearts <= 0) return false;
        set({
          hearts: hearts - 1,
          lastHeartRegen:
            hearts === HEART_MAX ? Date.now() : get().lastHeartRegen,
        });
        return true;
      },

      consumeTicket: () => {
        const { tickets, isVip } = get();
        if (isVip || isUnlimitedUser(null, isVip)) return true;
        if (tickets <= 0) return false;
        set({
          tickets: tickets - 1,
          lastTicketRegen:
            tickets === TICKET_MAX ? Date.now() : get().lastTicketRegen,
        });
        return true;
      },

      getHearts: () => {
        return isUnlimitedUser(null, get().isVip) ? Infinity : get().hearts;
      },

      getTickets: () => {
        return isUnlimitedUser(null, get().isVip) ? Infinity : get().tickets;
      },

      isUnlimited: () => {
        return isUnlimitedUser(null, get().isVip);
      },

      purchasedToday: (kind) => {
        const purchases = get().dailyPurchases;
        if (purchases.date !== todayKey()) return 0;
        return kind === "heart" ? purchases.hearts : purchases.tickets;
      },

      grantEnergy: (kind) => {
        const state = get();
        let purchases = state.dailyPurchases;
        if (purchases.date !== todayKey()) {
          purchases = { hearts: 0, tickets: 0, date: todayKey() };
        }

        if (kind === "heart") {
          if (purchases.hearts >= SHOP_DAILY_LIMIT) return false;
          if (state.hearts >= HEART_MAX) return false;
          set({
            hearts: state.hearts + 1,
            dailyPurchases: { ...purchases, hearts: purchases.hearts + 1 },
          });
          return true;
        }

        if (purchases.tickets >= SHOP_DAILY_LIMIT) return false;
        if (state.tickets >= TICKET_MAX) return false;
        set({
          tickets: state.tickets + 1,
          dailyPurchases: { ...purchases, tickets: purchases.tickets + 1 },
        });
        return true;
      },

      activateVip: () => set({ isVip: true }),

      syncTime: () => {
        const state = get();
        if (state.isVip) return;
        const now = Date.now();

        let hearts = state.hearts;
        let lastHeartRegen = state.lastHeartRegen;
        if (hearts < HEART_MAX) {
          const passed = now - lastHeartRegen;
          if (passed >= HEART_REGEN_MS) {
            const gained = Math.floor(passed / HEART_REGEN_MS);
            hearts = Math.min(HEART_MAX, hearts + gained);
            lastHeartRegen =
              hearts === HEART_MAX
                ? now
                : lastHeartRegen + gained * HEART_REGEN_MS;
          }
        }

        let tickets = state.tickets;
        let lastTicketRegen = state.lastTicketRegen;
        if (tickets < TICKET_MAX) {
          const passed = now - lastTicketRegen;
          if (passed >= TICKET_REGEN_MS) {
            const gained = Math.floor(passed / TICKET_REGEN_MS);
            tickets = Math.min(TICKET_MAX, tickets + gained);
            lastTicketRegen =
              tickets === TICKET_MAX
                ? now
                : lastTicketRegen + gained * TICKET_REGEN_MS;
          }
        }

        set({
          hearts,
          tickets,
          lastHeartRegen,
          lastTicketRegen,
        });
      },

      setTilaGender: (gender: TilaGender) => {
        const currentEquipped = get().equippedAccessory;
        let nextAccessory = currentEquipped;
        const owned = get().ownedAccessories;

        // Auto default atau sesuaikan aksesoris yang terikat gender spesifik
        if (gender === "boy") {
          if (currentEquipped === "hairbow" || currentEquipped === "flowercrown") {
            nextAccessory = owned.includes("peci") ? "peci" : "none";
          } else if (currentEquipped === "none" && owned.includes("peci")) {
            nextAccessory = "peci";
          }
        } else if (gender === "girl") {
          if (currentEquipped === "peci") {
            nextAccessory = owned.includes("hairbow") ? "hairbow" : "none";
          } else if (currentEquipped === "none" && owned.includes("hairbow")) {
            nextAccessory = "hairbow";
          }
        }

        set({
          tilaGender: gender,
          bibiGender: gender,
          equippedAccessory: nextAccessory,
        });
      },

      setBibiGender: (gender: BibiGender) => {
        get().setTilaGender(gender);
      },

      buyAccessory: (id: string, price: number) => {
        const { ownedAccessories, tilaGender } = get();
        const currentGender = resolveMascotGender(tilaGender);

        if (ownedAccessories.includes(id)) {
          if (isAccessoryAllowedForGender(id, currentGender)) {
            set({ equippedAccessory: id });
          }
          return true;
        }

        if (!spendCoins(price)) {
          return false;
        }

        const nextOwned = [...ownedAccessories, id];
        const nextEquipped = isAccessoryAllowedForGender(id, currentGender)
          ? id
          : get().equippedAccessory;

        set({
          ownedAccessories: nextOwned,
          equippedAccessory: nextEquipped,
        });
        return true;
      },

      equipAccessory: (id: string) => {
        const { ownedAccessories, tilaGender } = get();
        const currentGender = resolveMascotGender(tilaGender);
        if (id !== "none" && !isAccessoryAllowedForGender(id, currentGender)) {
          return; // Blokir pemasangan aksesoris yang tidak sesuai gender
        }
        if (id === "none" || ownedAccessories.includes(id)) {
          set({ equippedAccessory: id });
        }
      },

      applyStreakMultiplier: (streakDays: number) => {
        let mult = 1;
        if (streakDays >= 7) {
          mult = 2;
        } else if (streakDays >= 3) {
          mult = 1.5;
        }
        set({ streakMultiplier: mult });
        return mult;
      },

      claimDailyReward: (
        day: number,
        baseCoins: number,
        extra?: { hearts?: number; tickets?: number },
      ) => {
        const today = todayKey();
        const state = get();
        if (state.lastDailyClaimDate === today) {
          return false;
        }

        const mult = state.streakMultiplier || 1;
        const totalCoins = Math.round(baseCoins * mult);
        grantCoins(totalCoins, `Hadiah Login Hari ke-${day}`);

        const updates: Partial<EconomyState> = {
          lastDailyClaimDate: today,
          dailyRewardsClaimed: state.dailyRewardsClaimed.includes(day)
            ? state.dailyRewardsClaimed
            : [...state.dailyRewardsClaimed, day],
        };

        if (extra?.hearts) {
          updates.hearts = Math.min(HEART_MAX, state.hearts + extra.hearts);
        }
        if (extra?.tickets) {
          updates.tickets = Math.min(TICKET_MAX, state.tickets + extra.tickets);
        }

        // If completed 7 days, reset claimed cycle on next day
        if (updates.dailyRewardsClaimed && updates.dailyRewardsClaimed.length >= 7) {
          updates.dailyRewardsClaimed = [day];
        }

        set(updates as EconomyState);
        return true;
      },

      isRewardClaimedToday: () => {
        return get().lastDailyClaimDate === todayKey();
      },

      buyBooster: (boosterId: string, price: number) => {
        if (!spendCoins(price)) return false;

        if (boosterId === "full-heart") {
          set({ hearts: HEART_MAX });
          return true;
        }

        if (boosterId === "double-exp") {
          set({
            activeBoosters: { ...get().activeBoosters, doubleExp: true },
          });
          return true;
        }

        if (boosterId === "streak-freeze") {
          set({
            activeBoosters: { ...get().activeBoosters, streakFreeze: true },
          });
          return true;
        }

        return true;
      },
    }),
    { name: "tartila-economy" },
  ),
);

/**
 * Hook bantuan untuk membaca kuota energi secara reaktif dengan dukungan penuh
 * akun Superadmin / VIP (menghasilkan angka Infinity dan teks display "∞").
 */
export function useEnergyQuota(
  user?: { role?: string; group_id?: string } | null,
  groupId?: string | null,
) {
  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, groupId);

  return {
    hearts: isUnlimited ? Infinity : hearts,
    tickets: isUnlimited ? Infinity : tickets,
    isUnlimited,
    heartDisplay: isUnlimited ? "∞" : `${hearts}/${HEART_MAX}`,
    ticketDisplay: isUnlimited ? "∞" : `${tickets}/${TICKET_MAX}`,
  };
}
