import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { callREST } from '@/services/api';
import { userApi } from '@/services/userApi';
import { spendCoins, grantCoins, getProgress, saveProgress } from '@/features/ngaji-ceria/pages/games/_shared/progression';
import {
  resolveMascotGender,
  isAccessoryAllowedForGender,
  getDefaultAccessoryForGender,
} from '@/utils/mascotHelper';
import { MASCOT_STORAGE_KEY } from '@/constants/mascot';
import { normalizeRole, isUstadzRole } from '@/lib/roles';
import { activityDate } from '../utils/activityDate';
import { hydrateActivity } from './useNgajiCeriaStore';
import type { MascotSkin } from '../data/shopData';

export type { MascotSkin };

export const HEART_MAX = 5;
export const TICKET_MAX = 3;
export const SHOP_DAILY_LIMIT = 2;
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

// Fungsi bantuan: cek apakah user VIP/unlimited/ustadz
export function isUnlimitedUser(
  user?: { role?: string; group_id?: string | null; tier?: string; is_vip?: boolean; is_ustadz?: boolean; subscription_type?: string } | null,
  isVipStore?: boolean,
  groupId?: string | null,
  subscriptionType?: string | null,
): boolean {
  const normalizedRole = normalizeRole(user?.role);

  // Guard: Role ADMIN (Sambung Ngaji) TIDAK BOLEH menjadi VIP/unlimited di Tartila
  if (normalizedRole === "admin") {
    return false;
  }

  // Superadmin & Tartila Admin memiliki kuota tanpa batas di Tartila (Admin Sambung Ngaji tidak bypass)
  if (normalizedRole === "superadmin" || normalizedRole === "tartila_admin") {
    return true;
  }

  // VIP (dari isVipStore, user.is_vip, group_id, atau subscriptionType)
  if (
    isVipStore ||
    user?.is_vip ||
    groupId === 'vip' ||
    user?.group_id === 'vip' ||
    subscriptionType === 'vip' ||
    subscriptionType === 'premium' ||
    user?.subscription_type === 'vip' ||
    user?.subscription_type === 'premium'
  ) {
    return true;
  }

  // Ustadz/Ustadzah memiliki fitur khusus (room, soal, dll)
  if (isUstadzRole(user?.role) || user?.is_ustadz === true) {
    // Ustadz tetap memiliki batasan berdasarkan subscription
    if (subscriptionType === 'premium') {
      return true; // Premium: unlimited everything
    }
    if (subscriptionType === 'vip') {
      return true; // VIP: unlimited for classroom features
    }
    // Free ustadz masih punya batasan
    return false;
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
  isUstadz: boolean; // flag baru
  subscriptionType: 'free' | 'vip' | 'premium'; // Langganan baru

  // Economy data (disimpan di Supabase)
  hearts: number;
  tickets: number;
  level: number;
  xp: number;
  lastSync: number; // timestamp

  // Boosters
  activeBoosters: Record<string, boolean>;

  // Ustadz features
  ustadzRooms: any[]; // Daftar room yang dibuat ustadz
  currentRoom: any | null; // Room saat ini yang diakses
  roomParticipants: any[]; // Peserta di room current
  roomLimit: number; // Batas room berdasarkan subscription
  participantLimit: number; // Batas peserta per room
  roomsCreated: number; // Jumlah room yang sudah dibuat

  // Legacy compatible: mascots, daily shop & rewards
  lastHeartRegen: number;
  lastTicketRegen: number;
  dailyPurchases: DailyPurchases;
  tilaGender: TilaGender;
  bibiGender: BibiGender;
  equippedAccessory: TilaAccessory;
  ownedAccessories: string[];
  showMascot: boolean;
  setShowMascot: (show: boolean) => void;
  inventory: string[];
  equippedTheme: string;
  setEquippedSkin: (skin: MascotSkin | string) => void;
  setEquippedAccessory: (id: string) => void;
  setEquippedTheme: (id: string) => void;
  ownedRoomThemes: string[];
  equippedRoomTheme: string;
  buyRoomTheme: (id: string, price: number, free?: boolean, autoEquip?: boolean) => boolean;
  equipRoomTheme: (id: string) => void;
  ownedAppThemes: string[];
  equippedAppTheme: string;
  buyAppTheme: (id: string, price: number, free?: boolean, autoEquip?: boolean) => boolean;
  equipAppTheme: (id: string) => void;
  ownedSkins: string[];
  equippedSkin: MascotSkin;
  buySkin: (id: string, price: number, currency?: 'coin' | 'ticket') => boolean;
  equipSkin: (id: string) => void;
  streakMultiplier: number;
  loginStreak: number;
  dailyClaimed: boolean;
  isLoadingProfile: boolean;
  dailyRewardsClaimed: number[];
  lastDailyClaimDate: string | null;
  lastClaimDate: string | null;
  coins: number;
  syncDailyRewardFromProfile: (profileData: any) => void;
  setTilaGender: (gender: TilaGender) => Promise<void> | void;
  setBibiGender: (gender: BibiGender) => void;
  buyAccessory: (id: string, price: number, free?: boolean) => Promise<boolean>;
  equipAccessory: (id: string) => void;
  syncTime: () => void;
  grantEnergy: (kind: EnergyKind) => boolean;
  purchasedToday: (kind: EnergyKind) => number;
  activateVip: () => void;
  applyVipSuccess: (durationDays?: number, expiresAt?: string) => void;
  applyStreakMultiplier: (streakDays: number) => number;
  addCoins: (amount: number, reason?: string) => boolean;
  setUserId: (userId: string | null) => void;
  claimDailyReward: (
    day: number,
    baseCoins: number,
    extra?: { hearts?: number; tickets?: number; userId?: string },
  ) => Promise<boolean>;
  isRewardClaimedToday: () => boolean;
  fetchUstadzRooms: () => Promise<any[]>;

  // Actions
  initialize: () => Promise<void>;
  consumeHeart: () => Promise<boolean>;
  consumeTicket: () => Promise<boolean>;
  restoreHeart: () => Promise<boolean>;
  restoreTicket: () => Promise<boolean>;
  buyBooster: (boosterId: string, price: number, free?: boolean) => Promise<boolean>;
  setVip: (isVip: boolean) => Promise<void>;
  setGroupId: (groupId: string | null) => Promise<void>;
  setSubscription: (subType: 'free' | 'vip' | 'premium') => Promise<void>;
  setUstadzFlag: (isUstadz: boolean) => Promise<void>;

  // Room management actions
  createRoom: (name: string, password?: string, gameType?: string) => Promise<any>;
  joinRoom: (roomId: string, password?: string) => Promise<boolean>;
  leaveRoom: () => Promise<boolean>;
  getRooms: () => Promise<any[]>;
  getParticipantCount: (roomId: string) => Promise<number>;
  canCreateRoom: () => boolean; // Check if user can create room

  // Query helpers
  energyQuota: (user?: { role?: string; group_id?: string; is_ustadz?: boolean; subscription_type?: string } | null, groupId?: string | null, subType?: string | null) => {
    hearts: number;
    tickets: number;
    isUnlimited: boolean;
    heartDisplay: string;
    ticketDisplay: string;
  };

  // Arena Kartu Progress (Papan Progres per Jilid)
  completedArenaCards: Record<number, string[]>;
  markCardAsCompleted: (jilid: number, cardId: string) => void;
}

export const DAILY_CLAIM_STORAGE_KEY = 'tartila_last_daily_claim';
export const DAILY_CLAIMED_DAYS_STORAGE_KEY = 'tartila_daily_rewards_claimed';

export const getTodayDateKey = (): string => {
  return activityDate();
};

export const getInitialUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem("tartila_cached_user") ||
      window.sessionStorage.getItem("tartila_cached_user") ||
      window.sessionStorage.getItem("sambung_ngaji_cached_user");
    if (raw) {
      const parsed = JSON.parse(raw);
      return (
        (typeof parsed?.id === "string" && parsed.id.trim()) ||
        (typeof parsed?.user_id === "string" && parsed.user_id.trim()) ||
        null
      );
    }
  } catch {
    // ignore
  }
  return null;
};

const getStoredDailyClaimDate = (userId?: string | null): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const id = userId || getInitialUserId();
    if (id) {
      const userClaim = window.localStorage.getItem(`${DAILY_CLAIM_STORAGE_KEY}:${id}`);
      if (userClaim) return userClaim;
    }
    return window.localStorage.getItem(DAILY_CLAIM_STORAGE_KEY);
  } catch {
    return null;
  }
};

const getStoredDailyClaimedDays = (userId?: string | null): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const id = userId || getInitialUserId();
    if (id) {
      const rawUser = window.localStorage.getItem(`${DAILY_CLAIMED_DAYS_STORAGE_KEY}:${id}`);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (Array.isArray(parsed)) return parsed;
      }
    }
    const raw = window.localStorage.getItem(DAILY_CLAIMED_DAYS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const todayKey = getTodayDateKey;

const getInitialMascotGender = (): TilaGender => {
  if (typeof window === "undefined") return "boy";
  try {
    const saved = window.localStorage.getItem(MASCOT_STORAGE_KEY);
    if (saved) return resolveMascotGender(saved);
  } catch {
    // ignore
  }
  return "boy";
};

const initialMascotGender = getInitialMascotGender();

export const useEconomyStore = create<EconomyState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: getInitialUserId(),
      setUserId: (userId: string | null) => set({ userId }),
      username: null,
      role: null,
      groupId: null,
      isVip: false,
      isUstadz: false,
      subscriptionType: 'free', // Default free
      hearts: HEART_MAX,
      tickets: TICKET_MAX,
      level: 1,
      xp: 0,
      lastSync: Date.now(),
      activeBoosters: {},
      ustadzRooms: [],
      currentRoom: null,
      roomParticipants: [],
      roomLimit: 1, // Default free: 1 room
      participantLimit: 5, // Default free: 5 peserta
      roomsCreated: 0,

      // Legacy compatible: mascots, daily shop & rewards
      lastHeartRegen: Date.now(),
      lastTicketRegen: Date.now(),
      dailyPurchases: { hearts: 0, tickets: 0, date: todayKey() },
      tilaGender: initialMascotGender,
      bibiGender: initialMascotGender,
      equippedAccessory: initialMascotGender === 'girl' ? 'hairbow' : 'peci',
      ownedAccessories: ['none', 'peci', 'hairbow'],
      ownedRoomThemes: ['default'],
      equippedRoomTheme: 'default',
      equippedTheme: 'default',
      inventory: ['default', 'skin_default', 'none', 'peci', 'hairbow', 'theme_default'],
      setEquippedSkin: (id: MascotSkin | string) => {
        const skinKey = (typeof id === 'string' ? id.replace(/^skin_/, '') : id) as MascotSkin;
        set({ equippedSkin: skinKey });
      },
      setEquippedAccessory: (id: string) => {
        get().equipAccessory(id);
      },
      setEquippedTheme: (id: string) => {
        get().equipRoomTheme(id);
      },
      ownedAppThemes: ['default'],
      equippedAppTheme: 'default',
      ownedSkins: ['default', 'skin_default'],
      equippedSkin: 'default' as MascotSkin,
  // Sumber kebenaran: rehidrasi persist ("tartila_economy_store"). Kunci
  // legacy HANYA mirror agar util lama (isMascotVisible) tetap sinkron.
  showMascot: true,
  setShowMascot: (show: boolean) => {
    set({ showMascot: show });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("tila-companion-hidden", show ? "0" : "1");
        window.localStorage.setItem(
          "bibi-companion-hidden",
          show ? "0" : "1"
        );
        window.dispatchEvent(
          new CustomEvent("tila:toggle-visibility", { detail: { hidden: !show } })
        );
      } catch {
        // ignore
      }
    }
  },
  streakMultiplier: 1,
  loginStreak: 0,
  dailyClaimed: false,
  isLoadingProfile: false,
  dailyRewardsClaimed: getStoredDailyClaimedDays(),
  lastDailyClaimDate: getStoredDailyClaimDate(),
  lastClaimDate: getStoredDailyClaimDate(),
  coins: typeof window !== 'undefined' ? (getProgress().coins || 0) : 0,

  // Arena Kartu Progress (Papan Progres per Jilid)
  completedArenaCards: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  markCardAsCompleted: (jilid: number, cardId: string) => {
    const current = get().completedArenaCards || { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    const jilidCards = current[jilid] || [];
    if (!jilidCards.includes(cardId)) {
      const updated = {
        ...current,
        [jilid]: [...jilidCards, cardId],
      };
      set({ completedArenaCards: updated });
    }
  },

  syncDailyRewardFromProfile: (profileData: any) => {
    if (!profileData) return;
    const u = profileData.user || profileData.profile || profileData;
    const rawStreak = Number(
      profileData.login_streak ??
      profileData.current_streak ??
      u?.login_streak ??
      0
    );
    const streak = Math.max(0, isNaN(rawStreak) ? 0 : rawStreak);
    const claimDate =
      profileData.last_claim_date ||
      profileData.last_daily_claim_date ||
      u?.last_claim_date ||
      u?.last_daily_claim_date ||
      null;
    const today = getTodayDateKey();
    const isClaimedToday = Boolean(
      profileData.daily_claimed === true ||
      u?.daily_claimed === true ||
      (claimDate && claimDate.slice(0, 10) === today)
    );

    let claimedDays: number[] = [];
    if (isClaimedToday && streak > 0) {
      const dayInCycle = ((streak - 1) % 7) + 1;
      claimedDays = Array.from({ length: dayInCycle }, (_, i) => i + 1);
    } else if (streak > 0) {
      const dayInCycle = streak % 7;
      if (dayInCycle > 0) {
        claimedDays = Array.from({ length: dayInCycle }, (_, i) => i + 1);
      }
    }

    if (typeof profileData.coins === 'number' && typeof window !== 'undefined') {
      try {
        const cur = getProgress();
        saveProgress({ ...cur, coins: profileData.coins });
      } catch {
        // ignore
      }
    }

    const currentProgressCoins = typeof window !== 'undefined' ? (getProgress().coins || 0) : 0;
    const finalCoins = typeof profileData.coins === 'number' ? profileData.coins : currentProgressCoins;
    const finalClaimDate = isClaimedToday ? today : (claimDate ? claimDate.slice(0, 10) : null);

    set({
      loginStreak: streak,
      dailyClaimed: isClaimedToday,
      isLoadingProfile: false,
      lastDailyClaimDate: finalClaimDate,
      lastClaimDate: finalClaimDate,
      coins: finalCoins,
      dailyRewardsClaimed: claimedDays,
    });

    if (streak > 0) {
      hydrateActivity(finalClaimDate, streak);
    }
  },

  // Initialize: ambil data profil & maskot dari Backend Go (Single Source of Truth)
  initialize: async () => {
    set({ isLoadingProfile: true });
    try {
      // 1. Ambil data profil & maskot dari Backend Go
      let backendSuccess = false;
      try {
        const profileRes = await userApi.getUserProfile();
        if (profileRes) {
          backendSuccess = true;
          get().syncDailyRewardFromProfile(profileRes);
          const u = profileRes.user || profileRes.profile;
          const rawMascot = profileRes.mascot_gender || u?.mascot_gender || u?.gender;
          if (rawMascot) {
            const resolvedDbGender = resolveMascotGender(rawMascot);
            const currentAccessory = get().equippedAccessory;
            const nextAccessory = isAccessoryAllowedForGender(currentAccessory, resolvedDbGender)
              ? currentAccessory
              : getDefaultAccessoryForGender(resolvedDbGender);

            set({
              tilaGender: resolvedDbGender,
              bibiGender: resolvedDbGender,
              equippedAccessory: nextAccessory,
            });

            if (typeof window !== "undefined") {
              try {
                window.localStorage.setItem(MASCOT_STORAGE_KEY, resolvedDbGender);
              } catch {
                // ignore
              }
            }
          }
          if (u) {
            const isVipUser = Boolean(profileRes.is_vip ?? u.is_vip ?? (u.role === 'SUPER_ADMIN'));
            const subTier = (profileRes.subscription_tier || u.subscription_tier || (isVipUser ? 'vip' : 'free')) as 'free' | 'vip' | 'premium';
            set({
              userId: u.user_id || u.id || get().userId,
              username: u.username || get().username,
              role: u.role || get().role || 'member',
              groupId: u.group_id || get().groupId,
              isVip: isVipUser,
              subscriptionType: subTier === 'vip' ? 'vip' : subTier === 'premium' ? 'premium' : isVipUser ? 'vip' : 'free',
            });
          }
        }
      } catch (err) {
        console.warn('[useEconomyStore] Backend profile fetch offline/fallback:', err);
      }

      // 2. Fallback jika offline atau belum login via backend: gunakan Supabase auth metadata atau cache
      if (!backendSuccess) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            set({ userId: user.id, username: user.email?.split('@')[0] || get().username });
            const rawMetaGender = user.user_metadata?.mascot_gender || user.user_metadata?.gender;
            if (rawMetaGender) {
              const resolvedMeta = resolveMascotGender(rawMetaGender);
              const currentAccessory = get().equippedAccessory;
              const nextAccessory = isAccessoryAllowedForGender(currentAccessory, resolvedMeta)
                ? currentAccessory
                : getDefaultAccessoryForGender(resolvedMeta);
              set({
                tilaGender: resolvedMeta,
                bibiGender: resolvedMeta,
                equippedAccessory: nextAccessory,
              });
            }
          }
        } catch {
          // ignore
        }

        if (typeof window !== "undefined") {
          try {
            const cachedUserStr = window.localStorage.getItem("tartila_cached_user");
            if (cachedUserStr) {
              const cachedUser = JSON.parse(cachedUserStr);
              if (cachedUser?.gender) {
                const resolvedGender = resolveMascotGender(cachedUser.gender);
                const currentAccessory = get().equippedAccessory;
                const nextAccessory = isAccessoryAllowedForGender(currentAccessory, resolvedGender)
                  ? currentAccessory
                  : getDefaultAccessoryForGender(resolvedGender);

                set({
                  tilaGender: resolvedGender,
                  bibiGender: resolvedGender,
                  equippedAccessory: nextAccessory,
                });
              }
            }
          } catch {
            // ignore
          }
        }
      }
      if (typeof window !== "undefined") {
        try {
          const savedTheme = window.localStorage.getItem("tartila_app_theme") || get().equippedAppTheme || "default";
          document.documentElement.setAttribute("data-app-theme", savedTheme);
        } catch {
          // ignore
        }
      }
    } catch (error) {
      console.error('EconomyStore initialize error:', error);
      set({
        hearts: HEART_MAX,
        tickets: TICKET_MAX,
        level: 1,
        xp: 0,
        subscriptionType: 'free',
        roomLimit: 1,
        participantLimit: 5,
      });
    } finally {
      set({ isLoadingProfile: false });
    }
  },

  // Set subscription type (dari UI pembayaran)
  setSubscription: async (subType: 'free' | 'vip' | 'premium') => {
    const { userId } = get();
    if (!userId) return;

    set({ subscriptionType: subType });

    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && userId) {
        // Update di database
        const column = subType === 'premium' ? 'premium_features' : 'subscription_type';
        await supabase
          .from('users')
          .update({ subscription_type: subType })
          .eq('id', userId);
          
        // Update room limits berdasarkan subscription
        let roomLimit = 1;
        let participantLimit = 5;
        
        if (subType === 'vip') {
          roomLimit = 5;
          participantLimit = 10;
        } else if (subType === 'premium') {
          roomLimit = -1; // Unlimited
          participantLimit = 50;
        }

        // Update rooms_created count if upgrading
        if (subType !== 'free' && get().roomsCreated === 0) {
          // User pertama kalinya upgrade, reset rooms if needed
        }

        set({
          roomLimit: roomLimit,
          participantLimit: participantLimit,
          lastSync: Date.now(),
        });
      }
    } catch (err) {
      console.error('Failed to sync subscription to Supabase:', err);
      // Revert state jika gagal sync
      set({ subscriptionType: 'free' });
    }
  },

  // Set ustadz flag
  setUstadzFlag: async (isUstadz: boolean) => {
    const { userId } = get();
    set({ isUstadz });

    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && userId) {
        await supabase
          .from('users')
          .update({ is_vip: isUstadz })
          .eq('id', userId);
        set({ lastSync: Date.now() });
      }
    } catch (err) {
      console.error('Failed to sync ustadz flag to Supabase:', err);
    }
  },

  // Fungsi: Cek apakah bisa membuat room
  canCreateRoom: () => {
    const { isUstadz, subscriptionType, roomsCreated, roomLimit } = get();
    
    // Bisa create room jika:
    // 1. User adalah ustadz/ustadzah
    // 2. Belum mencapai batas room berdasarkan subscription
    if (!isUstadz) return false;
    
    // Premium users unlimited rooms
    if (roomLimit === -1) return true;
    
    // Hitung sisa room yang bisa dibuat
    const maxRooms = roomLimit === -1 ? Infinity : roomLimit;
    const canCreate = roomsCreated < maxRooms;
    
    return canCreate;
  },

  // Fungsi: Buat ruang kelas baru
  createRoom: async (name: string, password?: string, gameType: string = 'tilawati') => {
    const { userId, isUstadz, subscriptionType, roomsCreated, roomLimit } = get();
    
    // Cek batasan sebelum buat room
    if (!isUstadz) return null;
    if (roomLimit !== -1 && roomsCreated >= roomLimit) {
      // Sudah mencapai batas room
      console.log(`Sudah mencapai batas room: ${roomsCreated}/${roomLimit}`);
      return null;
    }

    try {
      // Buat room di database
      const { data: room, error } = await supabase
        .from('ustadz_rooms')
        .insert({
          ustadz_id: userId,
          name: name,
          password_hash: password ? await hashPassword(password) : null,
          max_participants: get().participantLimit,
          is_active: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Tambahkan ustadz sebagai peserta pertama
      await supabase.from('ustadz_room_participants').insert({
        room_id: room.id,
        user_id: userId,
        role_in_room: 'ustadz',
        joined_at: new Date().toISOString(),
      });

      // Update counter rooms_created di users
      await supabase
        .from('users')
        .update({ rooms_created: roomsCreated + 1 })
        .eq('id', userId);

      // Update state lokal
      const updatedRooms = [room, ...get().ustadzRooms].filter(
        (r, i) => i === 0 || r.id !== room.id
      ).slice(0, 100);

      set({
        ustadzRooms: updatedRooms,
        currentRoom: room,
        roomsCreated: roomsCreated + 1,
      });

      return room;
    } catch (err) {
      console.error('Failed to create ustadz room:', err);
      return null;
    }
  },

  // Fungsi: Gabungkan ke ruang
  joinRoom: async (roomId: string, password?: string) => {
    const { userId } = get();
    if (!userId) return false;

    try {
      // Cek apakah room ada dan aktif
      const { data: room, error: roomError } = await supabase
        .from('ustadz_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      if (!room || !room.is_active) return false;

      // Cek password jika room terproteksi
      if (room.password_hash && password) {
        const isValid = await verifyPassword(password, room.password_hash);
        if (!isValid) return false; // Password salah
      } else if (room.password_hash && !password) {
        return false; // Room protected tapi no password provided
      }

      // Cek participant limit
      const { count: participantCount } = await supabase
        .from('ustadz_room_participants')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomId);

      // Check against participantLimit dari user subscription
      const userLimit = get().participantLimit;
      if ((participantCount || 0) >= userLimit) return false;

      // Tambahkan participant
      await supabase.from('ustadz_room_participants').insert({
        room_id: roomId,
        user_id: userId,
        role_in_room: 'murid',
        joined_at: new Date().toISOString(),
      });

      // Update state lokal
      set({
        currentRoom: room,
        roomParticipants: [...get().roomParticipants, { userId, role: 'murid', joinedAt: new Date() }],
      });

      return room;
    } catch (err) {
      console.error('Failed to join ustadz room:', err);
      return false;
    }
  },

  // Fungsi: Keluar dari room
  leaveRoom: async () => {
    const { userId, currentRoom } = get();
    if (!userId || !currentRoom) return false;

    try {
      await supabase
        .from('ustadz_room_participants')
        .delete()
        .eq('room_id', currentRoom.id)
        .eq('user_id', userId);

      // Update state lokal
      set({
        currentRoom: null,
        roomParticipants: get().roomParticipants.filter(
          (p: any) => p.userId !== userId
        ),
      });

      return true;
    } catch (err) {
      console.error('Failed to leave ustadz room:', err);
      return false;
    }
  },

  // Fungsi: Dapatkan daftar room
  getRooms: async () => {
    const { userId, isUstadz, subscriptionType } = get();
    try {
      let query = supabase.from('ustadz_rooms').select(`
        *,
        ustadz_room_participants!inner(count)
      `).eq('is_active', true);

      // Jika ustadz, tampilkan semua room, kalau murid tampilkan hanya room aktif
      if (userId && isUstadz) {
        // Ustadz lihat semua room boleh diakses
      } else {
        query = query.eq('is_active', true);
      }

      const { data: rooms, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process rooms with participant counts and subscription checks
      const processedRooms = await Promise.all(
        (rooms || []).map(async (room: any) => {
          const { count: participantCount } = await supabase
            .from('ustadz_room_participants')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);
          
          // Check if user can join this room based on their subscription
          const canJoin = (participantCount || 0) < get().participantLimit;
          
          return {
            ...room,
            participantCount: participantCount || 0,
            canJoin,
            isFull: (participantCount || 0) >= get().participantLimit,
          };
        })
      );

      set({ ustadzRooms: processedRooms });
      return processedRooms;
    } catch (err) {
      console.error('Failed to get ustadz rooms:', err);
      set({ ustadzRooms: [] });
      return [];
    }
  },

  // Fungsi: Dapatkan count peserta
  getParticipantCount: async (roomId: string) => {
    try {
      const { count: participantCount } = await supabase
        .from('ustadz_room_participants')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomId);
      return participantCount || 0;
    } catch (err) {
      console.error('Failed to get participant count:', err);
      return 0;
    }
  },

  // Helper: Energy quota dengan subscription check
  energyQuota: (user?, groupId?, subType?) => {
    const hearts = get().hearts;
    const tickets = get().tickets;
    const isUnlimited = isUnlimitedUser(user, get().isVip, groupId, get().subscriptionType);

    return {
      hearts: isUnlimited ? Infinity : hearts,
      tickets: isUnlimited ? Infinity : tickets,
      isUnlimited,
      heartDisplay: isUnlimited ? '∞' : `${hearts}/${HEART_MAX}`,
      ticketDisplay: isUnlimited ? '∞' : `${tickets}/${TICKET_MAX}`,
    };
  },
  // ── Legacy compatible actions (mascot, daily shop, rewards) ──
  syncTime: () => {
    const state = get();
    if (state.isVip || isUnlimitedUser(null, state.isVip)) return;
    const now = Date.now();

    let hearts = state.hearts;
    let lastHeartRegen = state.lastHeartRegen;
    if (hearts < HEART_MAX) {
      const passed = now - lastHeartRegen;
      if (passed >= HEART_REGEN_MS) {
        const gained = Math.floor(passed / HEART_REGEN_MS);
        hearts = Math.min(HEART_MAX, hearts + gained);
        lastHeartRegen =
          hearts === HEART_MAX ? now : lastHeartRegen + gained * HEART_REGEN_MS;
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

    set({ hearts, tickets, lastHeartRegen, lastTicketRegen });
  },

  purchasedToday: (kind: EnergyKind) => {
    const purchases = get().dailyPurchases;
    if (purchases.date !== todayKey()) return 0;
    return kind === 'heart' ? purchases.hearts : purchases.tickets;
  },

  grantEnergy: (kind: EnergyKind) => {
    const state = get();
    let purchases = state.dailyPurchases;
    if (purchases.date !== todayKey()) {
      purchases = { hearts: 0, tickets: 0, date: todayKey() };
    }

    if (kind === 'heart') {
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

  activateVip: () => set({ isVip: true, subscriptionType: 'vip' }),
  applyVipSuccess: (_durationDays?: number, _expiresAt?: string) => {
    set({
      isVip: true,
      subscriptionType: 'vip',
      hearts: Infinity,
      tickets: Infinity,
    });
  },

  setTilaGender: async (gender: TilaGender) => {
    const resolved = resolveMascotGender(gender);
    const currentEquipped = get().equippedAccessory;
    let nextAccessory = currentEquipped;
    const owned = get().ownedAccessories;

    if (resolved === 'boy') {
      if (currentEquipped === 'hairbow' || currentEquipped === 'flowercrown') {
        nextAccessory = owned.includes('peci') ? 'peci' : 'none';
      } else if (currentEquipped === 'none' && owned.includes('peci')) {
        nextAccessory = 'peci';
      }
    } else if (resolved === 'girl') {
      if (currentEquipped === 'peci') {
        nextAccessory = owned.includes('hairbow') ? 'hairbow' : 'none';
      } else if (currentEquipped === 'none' && owned.includes('hairbow')) {
        nextAccessory = 'hairbow';
      }
    }

    set({
      tilaGender: resolved,
      bibiGender: resolved,
      equippedAccessory: nextAccessory,
    });

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(MASCOT_STORAGE_KEY, resolved);
      } catch {
        // ignore
      }
    }

    // 1. Sync ke Backend Go (Single Source of Truth)
    try {
      await userApi.updateUserMascot(resolved);
    } catch (err) {
      console.warn('[useEconomyStore] Backend mascot update failed:', err);
      throw err;
    }

    // 2. Sync metadata ke Supabase Auth jika session aktif
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: {
            mascot_gender: resolved,
            gender: resolved === "girl" ? "P" : "L",
          },
        }).catch(() => null);
      }
    } catch {
      // ignore
    }
  },

  setBibiGender: (gender: BibiGender) => {
    void get().setTilaGender(gender);
  },

  buyAccessory: async (id: string, price: number, free = false) => {
    const { ownedAccessories, tilaGender, inventory } = get();
    const currentGender = resolveMascotGender(tilaGender);

    if (ownedAccessories.includes(id) || inventory?.includes(id)) {
      if (isAccessoryAllowedForGender(id, currentGender)) {
        set({ equippedAccessory: id });
      }
      return true;
    }

    if (!free && !spendCoins(price)) {
      return false;
    }

    const nextOwned = [...ownedAccessories, id];
    const nextInventory = Array.from(new Set([...(inventory || []), id]));
    const nextEquipped = isAccessoryAllowedForGender(id, currentGender)
      ? id
      : get().equippedAccessory;

    set({
      ownedAccessories: nextOwned,
      equippedAccessory: nextEquipped,
      inventory: nextInventory,
    });
    return true;
  },

  equipAccessory: (id: string) => {
    const { ownedAccessories, tilaGender, inventory } = get();
    const currentGender = resolveMascotGender(tilaGender);
    if (id !== 'none' && !isAccessoryAllowedForGender(id, currentGender)) {
      return;
    }
    if (id === 'none' || ownedAccessories.includes(id) || inventory?.includes(id)) {
      set({ equippedAccessory: id });
    }
  },

  buyRoomTheme: (id: string, price: number, free = false, autoEquip = true) => {
    const normalized = (id === 'theme_space' || id === 'space') ? 'galaksi'
      : (id === 'theme_default' || id === 'classic' || id === 'theme_classic') ? 'default'
      : (id === 'theme_forest') ? 'hutan'
      : (id === 'theme_castle') ? 'istana'
      : id;

    if (get().ownedRoomThemes.includes(normalized) || get().inventory?.includes(normalized) || get().inventory?.includes(id)) {
      if (autoEquip) set({ equippedRoomTheme: normalized, equippedTheme: normalized });
      return true;
    }
    if (!free && !spendCoins(price)) return false;

    const nextOwned = Array.from(new Set([...get().ownedRoomThemes, normalized]));
    const nextInventory = Array.from(new Set([...(get().inventory || []), id, normalized]));
    set({
      ownedRoomThemes: nextOwned,
      ...(autoEquip ? { equippedRoomTheme: normalized, equippedTheme: normalized } : {}),
      inventory: nextInventory,
    });
    return true;
  },

  equipRoomTheme: (id: string) => {
    const normalized = (id === 'theme_space' || id === 'space') ? 'galaksi'
      : (id === 'theme_default' || id === 'classic' || id === 'theme_classic') ? 'default'
      : (id === 'theme_forest') ? 'hutan'
      : (id === 'theme_castle') ? 'istana'
      : id;

    if (
      normalized === 'default' ||
      get().ownedRoomThemes.includes(normalized) ||
      get().ownedRoomThemes.includes(id) ||
      get().inventory?.includes(normalized) ||
      get().inventory?.includes(id)
    ) {
      set({ equippedRoomTheme: normalized, equippedTheme: normalized });
    }
  },

  buyAppTheme: (id: string, price: number, free = false, autoEquip = true) => {
    const isUnlimited = isUnlimitedUser(
      { role: get().role ?? undefined },
      get().isVip,
      get().groupId,
      get().subscriptionType,
    );
    if (get().ownedAppThemes.includes(id) || get().inventory?.includes(id)) {
      if (autoEquip) get().equipAppTheme(id);
      return true;
    }
    if (!free && !isUnlimited && !spendCoins(price)) {
      return false;
    }
    const nextOwned = Array.from(new Set([...get().ownedAppThemes, id]));
    const nextInventory = Array.from(new Set([...(get().inventory || []), id]));
    set({
      ownedAppThemes: nextOwned,
      ...(autoEquip ? { equippedAppTheme: id } : {}),
      inventory: nextInventory,
    });
    if (autoEquip) {
      get().equipAppTheme(id);
    }
    return true;
  },

  equipAppTheme: (id: string) => {
    if (id === 'default' || get().ownedAppThemes.includes(id) || get().inventory?.includes(id)) {
      set({ equippedAppTheme: id });
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem('tartila_app_theme', id);
          document.documentElement.setAttribute('data-app-theme', id);
        } catch {
          // ignore
        }
      }
    }
  },

  buySkin: (id: string, price: number, currency: 'coin' | 'ticket' = 'coin') => {
    const skinKey = (id.replace(/^skin_/, '') || 'default') as MascotSkin;
    if (
      get().ownedSkins.includes(id) ||
      get().ownedSkins.includes(skinKey) ||
      get().inventory?.includes(id) ||
      get().inventory?.includes(skinKey)
    ) {
      get().equipSkin(id);
      return true;
    }

    const state = get();
    const isUnlimited = isUnlimitedUser(
      {
        role: state.role ?? undefined,
        group_id: state.groupId,
        is_vip: state.isVip,
        is_ustadz: state.isUstadz,
      },
      state.isVip,
      state.groupId,
    );

    if (!isUnlimited) {
      if (currency === 'ticket') {
        if (state.tickets < price) {
          return false;
        }
        set({ tickets: state.tickets - price });
      } else {
        if (!spendCoins(price)) {
          return false;
        }
      }
    }

    const nextOwned = Array.from(new Set([...get().ownedSkins, id, skinKey]));
    const nextInventory = Array.from(new Set([...(get().inventory || []), id, skinKey]));
    set({
      ownedSkins: nextOwned,
      equippedSkin: skinKey,
      inventory: nextInventory,
    });
    return true;
  },

  equipSkin: (id: string) => {
    const skinKey = (id.replace(/^skin_/, '') || 'default') as MascotSkin;
    const state = get();
    const isUnlimited = isUnlimitedUser(
      {
        role: state.role ?? undefined,
        group_id: state.groupId,
        is_vip: state.isVip,
        is_ustadz: state.isUstadz,
        subscription_type: state.subscriptionType ?? undefined,
      },
      state.isVip,
      state.groupId,
    );
    if (
      skinKey === 'default' ||
      isUnlimited ||
      state.ownedSkins.includes(id) ||
      state.ownedSkins.includes(skinKey) ||
      state.inventory?.includes(id) ||
      state.inventory?.includes(skinKey)
    ) {
      set({ equippedSkin: skinKey });
    }
  },

  applyStreakMultiplier: (streakDays: number) => {    let mult = 1;
    if (streakDays >= 7) {
      mult = 2;
    } else if (streakDays >= 3) {
      mult = 1.5;
    }
    set({ streakMultiplier: mult });
    return mult;
  },

  addCoins: (amount: number, reason?: string) => {
    const state = get();
    const activeUserId = state.userId || getInitialUserId();
    if (!activeUserId) {
      return false; // Ditolak jika pengguna adalah tamu (guest)
    }
    if (!state.userId && activeUserId) {
      set({ userId: activeUserId });
    }
    grantCoins(amount, reason || 'Tambah Koin');
    return true;
  },

  claimDailyReward: async (
    day: number,
    baseCoins: number,
    extra?: { hearts?: number; tickets?: number; userId?: string },
  ) => {
    const state = get();
    const activeUserId = extra?.userId || state.userId || getInitialUserId();
    if (!activeUserId) {
      return false; // Ditolak jika pengguna adalah tamu (guest)
    }
    if (!state.userId && activeUserId) {
      set({ userId: activeUserId });
    }

    const mult = state.streakMultiplier || 1;
    const totalCoins = Math.round(baseCoins * mult);
    const optimisticDate = getTodayDateKey();
    const optimisticStreak = state.loginStreak > 0 ? state.loginStreak + 1 : 1;
    const currentCoins = state.coins || (typeof window !== 'undefined' ? (getProgress().coins || 0) : 0);
    const optimisticCoins = currentCoins + totalCoins;

    // Hubungi Backend Go (Single Source of Truth untuk Koin & Hadiah)
    let serverDate = optimisticDate;
    let serverCoinsAwarded = totalCoins;
    let serverStreak = optimisticStreak;
    let serverTotalCoins = optimisticCoins;
    try {
      const res = await userApi.claimDailyReward(day, totalCoins);
      if (res) {
        if (res.lastClaimDate || res.date) serverDate = res.lastClaimDate || res.date;
        if (res.coinsAwarded) serverCoinsAwarded = res.coinsAwarded;
        if (typeof res.coins === 'number') {
          serverTotalCoins = res.coins;
        } else if (typeof res.totalCoins === 'number') {
          serverTotalCoins = res.totalCoins;
        }
        if (typeof res.streak === 'number' && res.streak > 0) {
          serverStreak = res.streak;
        } else if (typeof res.loginStreak === 'number' && res.loginStreak > 0) {
          serverStreak = res.loginStreak;
        }
      }
    } catch (err: any) {
      const msg = String(err?.message || "").toLowerCase();
      // Jika server menyatakan sudah klaim hari ini, sinkronkan dan tolak
      if (msg.includes("sudah diklaim") || msg.includes("already claimed") || msg.includes("sudah klaim")) {
        const today = getTodayDateKey();
        set({ dailyClaimed: true, lastDailyClaimDate: today, lastClaimDate: today });
        return false;
      }
      if (msg.includes("unauthorized") || err?.status === 401) {
        return false;
      }
    }

    const today = serverDate || getTodayDateKey();
    const userClaimKey = `${DAILY_CLAIM_STORAGE_KEY}:${activeUserId}`;
    if (
      state.dailyClaimed ||
      state.lastDailyClaimDate === today ||
      (typeof window !== 'undefined' &&
        (window.localStorage.getItem(DAILY_CLAIM_STORAGE_KEY) === today ||
         window.localStorage.getItem(userClaimKey) === today))
    ) {
      return false;
    }

    grantCoins(serverCoinsAwarded, `Hadiah Login Hari ke-${day}`);
    const finalCoins = serverTotalCoins || (typeof window !== 'undefined' ? (getProgress().coins || 0) : 0);

    const dayInCycle = Math.max(1, ((serverStreak - 1) % 7) + 1);
    const nextClaimedDays = Array.from({ length: dayInCycle }, (_, i) => i + 1);

    // Sinkronkan ke store aktivitas agar streak dan kalender di seluruh aplikasi langsung aktif instan
    hydrateActivity(today, serverStreak);

    const updates: Partial<EconomyState> = {
      dailyClaimed: true,
      loginStreak: serverStreak,
      lastDailyClaimDate: today,
      lastClaimDate: today,
      coins: finalCoins,
      dailyRewardsClaimed: nextClaimedDays,
    };

    if (extra?.hearts) {
      updates.hearts = Math.min(HEART_MAX, state.hearts + extra.hearts);
    }
    if (extra?.tickets) {
      updates.tickets = Math.min(TICKET_MAX, state.tickets + extra.tickets);
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(DAILY_CLAIM_STORAGE_KEY, today);
        window.localStorage.setItem(userClaimKey, today);
        window.localStorage.setItem(
          DAILY_CLAIMED_DAYS_STORAGE_KEY,
          JSON.stringify(nextClaimedDays),
        );
        window.localStorage.setItem(
          `${DAILY_CLAIMED_DAYS_STORAGE_KEY}:${activeUserId}`,
          JSON.stringify(nextClaimedDays),
        );
      } catch {
        // ignore
      }
    }

    set(updates as EconomyState);
    return true;
  },

  isRewardClaimedToday: () => {
    const today = getTodayDateKey();
    const state = get();
    if (state.dailyClaimed) return true;
    if (state.lastDailyClaimDate === today) return true;
    return false;
  },

  fetchUstadzRooms: async () => {
    return get().getRooms();
  },

  // ── Energy actions (Supabase-backed, fallback lokal) ──
  consumeHeart: async () => {
    const state = get();
    if (state.isVip || isUnlimitedUser(null, state.isVip)) return true;
    if (state.hearts <= 0) return false;
    set({
      hearts: state.hearts - 1,
      lastHeartRegen: state.hearts === HEART_MAX ? Date.now() : state.lastHeartRegen,
    });
    try {
      await supabase.from('users').update({ hearts: get().hearts }).eq('id', state.userId ?? '');
    } catch {
      // offline / belum login: state lokal tetap berlaku
    }
    return true;
  },

  consumeTicket: async () => {
    const state = get();
    if (state.isVip || isUnlimitedUser(null, state.isVip)) return true;
    if (state.tickets <= 0) return false;
    set({
      tickets: state.tickets - 1,
      lastTicketRegen: state.tickets === TICKET_MAX ? Date.now() : state.lastTicketRegen,
    });
    try {
      await supabase.from('users').update({ tickets: get().tickets }).eq('id', state.userId ?? '');
    } catch {
      // offline / belum login: state lokal tetap berlaku
    }
    return true;
  },

  restoreHeart: async () => {
    const state = get();
    if (state.hearts >= HEART_MAX) return false;
    set({ hearts: Math.min(HEART_MAX, state.hearts + 1) });
    return true;
  },

  restoreTicket: async () => {
    const state = get();
    if (state.tickets >= TICKET_MAX) return false;
    set({ tickets: Math.min(TICKET_MAX, state.tickets + 1) });
    return true;
  },

  buyBooster: async (boosterId: string, price: number, free = false) => {
    if (!free && !spendCoins(price)) return false;
    set({ activeBoosters: { ...get().activeBoosters, [boosterId]: true } });
    return true;
  },

  setVip: async (isVip: boolean) => {
    set({ isVip, lastSync: Date.now() });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('users').update({ is_vip: isVip }).eq('id', user.id);
      }
    } catch {
      // ignore
    }
  },

  setGroupId: async (groupId: string | null) => {
    set({ groupId });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('users').update({ group_id: groupId }).eq('id', user.id);
      }
    } catch {
      // ignore
    }
  },
    }),
    {
      name: "tartila_economy_store",
      // Sinkronkan kunci legacy setelah rehidrasi agar tidak ada dua
      // "kebenaran" yang saling bertabrakan saat halaman berpindah.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const baseDefaults = ['default', 'skin_default', 'none', 'peci', 'hairbow', 'theme_default'];
        const mergedInventory = Array.from(
          new Set([
            ...baseDefaults,
            ...(state.inventory || []),
            ...(state.ownedAccessories || []),
            ...(state.ownedRoomThemes || []),
            ...((state as any).ownedGameThemes || []),
            ...(state.ownedAppThemes || []),
            ...(state.ownedSkins || []),
          ])
        );
        state.inventory = mergedInventory;
        if (!state.equippedTheme && state.equippedRoomTheme) {
          state.equippedTheme = state.equippedRoomTheme;
        }

        // Migrasi single-theme: jika ada tema game lama yang terpasang/dimiliki, pindahkan ke tema aplikasi
        const legacyGameTheme = (state as any).equippedGameTheme;
        if (legacyGameTheme && legacyGameTheme !== 'default' && (!state.equippedAppTheme || state.equippedAppTheme === 'default')) {
          state.equippedAppTheme = legacyGameTheme;
        }
        const legacyOwnedGameThemes = (state as any).ownedGameThemes;
        if (Array.isArray(legacyOwnedGameThemes) && legacyOwnedGameThemes.length > 0) {
          state.ownedAppThemes = Array.from(new Set([...(state.ownedAppThemes || ['default']), ...legacyOwnedGameThemes]));
        }

        if (typeof state.showMascot !== "boolean") return;
        if (typeof window === "undefined") return;
        try {
          window.localStorage.setItem(
            "tila-companion-hidden",
            state.showMascot ? "0" : "1",
          );
          window.localStorage.setItem(
            "bibi-companion-hidden",
            state.showMascot ? "0" : "1",
          );
        } catch {
          // ignore
        }
      },
      partialize: (state) => ({
        inventory: state.inventory,
        equippedTheme: state.equippedTheme,
        tilaGender: state.tilaGender,
        bibiGender: state.bibiGender,
        equippedAccessory: state.equippedAccessory,
        ownedAccessories: state.ownedAccessories,
        ownedRoomThemes: state.ownedRoomThemes,
        equippedRoomTheme: state.equippedRoomTheme,
        ownedAppThemes: state.ownedAppThemes,
        equippedAppTheme: state.equippedAppTheme,
        ownedSkins: state.ownedSkins,
        equippedSkin: state.equippedSkin,
        showMascot: state.showMascot,
        dailyRewardsClaimed: state.dailyRewardsClaimed,
        lastDailyClaimDate: state.lastDailyClaimDate,
        lastClaimDate: state.lastClaimDate,
        loginStreak: state.loginStreak,
        dailyClaimed: state.dailyClaimed,
        coins: state.coins,
      }),
    }
  )
);

// Helper functions for password hashing (client-side simplified)
const hashPassword = async (password: string): Promise<string> => {
  // Di production, gunakan proper password hashing
  // Di sini hanya mock untuk development
  return btoa(password); // Base64 simple untuk development
};

const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
  return (await hashPassword(password)) === hashed;
};
