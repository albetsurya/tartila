import { create } from "zustand";
import { persist } from "zustand/middleware";

export const HEART_MAX = 5;
export const TICKET_MAX = 3;
export const SHOP_DAILY_LIMIT = 2;
export const HEART_REGEN_MS = 4 * 60 * 60 * 1000; // 4 Jam
export const TICKET_REGEN_MS = 6 * 60 * 60 * 1000; // 6 Jam

export type EnergyKind = "heart" | "ticket";

export const ENERGY_PRICES: Record<EnergyKind, number> = {
  heart: 100,
  ticket: 150,
};

interface DailyPurchases {
  hearts: number;
  tickets: number;
  date: string;
}

interface EconomyState {
  hearts: number;
  tickets: number;
  isVip: boolean;
  lastHeartRegen: number;
  lastTicketRegen: number;
  dailyPurchases: DailyPurchases;

  consumeHeart: () => boolean;
  consumeTicket: () => boolean;
  grantEnergy: (kind: EnergyKind) => boolean;
  purchasedToday: (kind: EnergyKind) => number;
  activateVip: () => void;
  syncTime: () => void;
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

      consumeHeart: () => {
        const { hearts, isVip } = get();
        if (isVip) return true;
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
        if (isVip) return true;
        if (tickets <= 0) return false;
        set({
          tickets: tickets - 1,
          lastTicketRegen:
            tickets === TICKET_MAX ? Date.now() : get().lastTicketRegen,
        });
        return true;
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
    }),
    { name: "tartila-economy" },
  ),
);
