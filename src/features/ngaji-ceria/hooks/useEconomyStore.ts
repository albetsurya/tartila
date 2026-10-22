import create from 'zustand';
import { supabase } from '@/lib/supabase';
import { spendCoins, grantCoins } from '@/pages/games/_shared/progression';
import { resolveMascotGender, isAccessoryAllowedForGender } from '@/utils/mascotHelper';

export const HEART_REGEN_MS = 4 * 60 * 60 * 1000; // 4 Jam
export const TICKET_REGEN_MS = 6 * 60 * 60 * 1000; // 6 Jam

export type EnergyKind = 'heart' | 'ticket';
export type TilaGender = 'boy' | 'girl' | 'neutral';
export type TilaAccessory = 'none' | 'peci' | 'hairbow' | 'flowercrown' | 'glasses' | 'crown' | string;

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
  'double-exp': 100,
  'full-heart': 300,
  'streak-freeze': 150,
};

interface DailyPurchases {
  hearts: number;
  tickets: number;
  date: string;
}

// Fungsi bantuan: cek apakah user VIP/unlimited
export function isUnlimitedUser(
  user?: { role?: string; group_id?: string; tier?: string; is_vip?: boolean } | null,
  isVipStore?: boolean,
  groupId?: string | null,
): boolean {
  if (isVipStore) return true;

  const roleClean = (user?.role || '').toUpperCase();

  // Superadmin memiliki kuota tanpa batas
  if (
    roleClean === 'SUPER_ADMIN' ||
    roleClean === 'SUPERADMIN' ||
    roleClean === 'ADMIN'
  ) {
    return true;
  }

  // VIP (dari isVipStore atau group_id)
  if (isVipStore || groupId === 'vip') {
    return true;
  }

  // Member/tidak punya limit (bisa di-set sesuai kebutuhan)
  return false;
}

interface EconomyState {
  // User identification
  userId: string | null;
  username: string | null;
  role: string | null;
  groupId: string | null;
  isVip: boolean;

  // Economy data (disimpan di Supabase, not localStorage)
  hearts: number;
  tickets: number;
  level: number;
  xp: number;
  lastSync: number; // timestamp

  // Boosters
  activeBoosters: Record<string, boolean>;

  // Actions
  initialize: () => Promise<void>;
  consumeHeart: () => Promise<boolean>;
  consumeTicket: () => Promise<boolean>;
  restoreHeart: () => Promise<boolean>;
  restoreTicket: () => Promise<boolean>;
  buyBooster: (boosterId: string, price: number) => Promise<boolean>;
  setVip: (isVip: boolean) => Promise<void>;
  setGroupId: (groupId: string | null) => Promise<void>;

  // Query helpers
  energyQuota: (user?: { role?: string; group_id?: string } | null, groupId?: string | null) => {
    hearts: number;
    tickets: number;
    isUnlimited: boolean;
    heartDisplay: string;
    ticketDisplay: string;
  };
}

export const useEconomyStore = create<EconomyState>((set, get) => ({
  // Initial state - akan di-update saat initialize()
  userId: null,
  username: null,
  role: null,
  groupId: null,
  isVip: false,
  hearts: HEART_MAX,
  tickets: TICKET_MAX,
  level: 1,
  xp: 0,
  lastSync: Date.now(),
  activeBoosters: {},

  // Initialize: ambil data dari Supabase berdasarkan user yang login
  initialize: async () => {
    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user) {
        set({ userId: user.id, username: user.email?.split('@')[0] || null });

        // Ambil data user dari Supabase
        const { data: userData, error } = await supabase
          .from('users')
          .select('hearts, tickets, level, xp, group_id, is_vip, role')
          .eq('id', user.id)
          .single();

        if (userData && !error) {
          set({
            role: userData.role || 'member',
            groupId: userData.group_id || null,
            isVip: userData.is_vip || false,
            hearts: userData.hearts ?? HEART_MAX,
            tickets: userData.tickets ?? TICKET_MAX,
            level: userData.level ?? 1,
            xp: userData.xp ?? 0,
            lastSync: Date.now(),
          });
        } else {
          // Jika user baru, buat entri di Supabase
          await supabase.from('users').insert({
            id: user.id,
            hearts: HEART_MAX,
            tickets: TICKET_MAX,
            level: 1,
            xp: 0,
            group_id: null,
            is_vip: false,
            role: 'member',
          });
          set({
            role: 'member',
            groupId: null,
            isVip: false,
            hearts: HEART_MAX,
            tickets: TICKET_MAX,
            level: 1,
            xp: 0,
            lastSync: Date.now(),
          });
        }
      }
    } catch (error) {
      console.error('EconomyStore initialize error:', error);
      // Fallback ke nilai default jika Supabase error
      set({
        hearts: HEART_MAX,
        tickets: TICKET_MAX,
        level: 1,
        xp: 0,
      });
    }
  },

  // Konsumsi hati (cek stok, kurangi, update ke Supabase)
  consumeHeart: async () => {
    const { hearts } = get();
    if (hearts <= 0) return false;

    // Update local state dulu (sebelum sync ke server)
    set({ hearts: hearts - 1 });

    // Coba update ke Supabase
    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && get().userId) {
        await supabase
          .from('users')
          .update({ hearts: get().hearts })
          .eq('id', get().userId);
        // Sync sukses - lastSync diupdate
        set({ lastSync: Date.now() });
      }
    } catch (err) {
      console.error('Failed to sync heart to Supabase:', err);
      // Jika gagal sync, local state tetap, akan sync nanti
    }

    return true;
  },

  // Konsumsi tiket
  consumeTicket: async () => {
    const { tickets } = get();
    if (tickets <= 0) return false;

    set({ tickets: tickets - 1 });

    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && get().userId) {
        await supabase
          .from('users')
          .update({ tickets: get().tickets })
          .eq('id', get().userId);
        set({ lastSync: Date.now() });
      }
    } catch (err) {
      console.error('Failed to sync ticket to Supabase:', err);
    }

    return true;
  },

  // Restore hati (full restore)
  restoreHeart: async () => {
    const { hearts, userId } = get();
    if (hearts >= HEART_MAX) return false;

    set({ hearts: HEART_MAX });

    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && userId) {
        await supabase
          .from('users')
          .update({ hearts: HEART_MAX })
          .eq('id', userId);
        set({ lastSync: Date.now() });
      }
    } catch (err) {
      console.error('Failed to restore heart to Supabase:', err);
    }

    return true;
  },

  // Restore tiket
  restoreTicket: async () => {
    const { tickets, userId } = get();
    if (tickets >= TICKET_MAX) return false;

    set({ tickets: TICKET_MAX });

    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && userId) {
        await supabase
          .from('users')
          .update({ tickets: TICKET_MAX })
          .eq('id', userId);
        set({ lastSync: Date.now() });
      }
    } catch (err) {
      console.error('Failed to restore ticket to Supabase:', err);
    }

    return true;
  },

  // Beli booster
  buyBooster: async (boosterId: string, price: number) => {
    // Coba spend coins dulu (fungsionalitas lokal)
    if (!spendCoins(price)) return false;

    // Update state lokal
    if (boosterId === 'full-heart') {
      set({ hearts: HEART_MAX });
      // Sync ke server
      try {
        const { data: { user} } = await supabase.auth.getUser();
        if (data?.user?.id) {
          await supabase.from('users').update({ hearts: HEART_MAX }).eq('id', data.user.id);
          set({ lastSync: Date.now() });
        }
      } catch (err) {
        console.error('Failed to sync booster purchase:', err);
      }
      return true;
    }

    if (boosterId === 'double-exp') {
      set({ activeBoosters: { ...get().activeBoosters, doubleExp: true } });
      // TODO: Simpan booster ke Supabase
      return true;
    }

    if (boosterId === 'streak-freeze') {
      set({ activeBoosters: { ...get().activeBoosters, streakFreeze: true } });
      // TODO: Simpan booster ke Supabase
      return true;
    }

    return true;
  },

  // Set VIP status
  setVip: async (isVip: boolean) => {
    const { userId } = get();
    set({ isVip });

    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && userId) {
        await supabase
          .from('users')
          .update({ is_vip: isVip })
          .eq('id', userId);
        set({ lastSync: Date.now() });
      }
    } catch (err) {
      console.error('Failed to sync VIP status to Supabase:', err);
    }
  },

  // Set group ID
  setGroupId: async (groupId: string | null) => {
    const { userId } = get();
    set({ groupId });

    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && userId) {
        await supabase
          .from('users')
          .update({ group_id: groupId })
          .eq('id', userId);
        set({ lastSync: Date.now() });
      }
    } catch (err) {
      console.error('Failed to sync group_id to Supabase:', err);
    }
  },

  // Helper: ambil energy quota dengan hitungan unlimited untuk VIP
  energyQuota: (user?, groupId?) => {
    const hearts = get().hearts;
    const tickets = get().tickets;
    const isUnlimited = isUnlimitedUser(user, get().isVip, groupId);

    return {
      hearts: isUnlimited ? Infinity : hearts,
      tickets: isUnlimited ? Infinity : tickets,
      isUnlimited,
      heartDisplay: isUnlimited ? '∞' : `${hearts}/${HEART_MAX}`,
      ticketDisplay: isUnlimited ? '∞' : `${tickets}/${TICKET_MAX}`,
    };
  },
})); // <-- Ini menutup create() dan export

// Export fungsi isUnlimitedUser untuk digunakan di seluruh aplikasi
export { isUnlimitedUser };
