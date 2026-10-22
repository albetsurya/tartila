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

// Fungsi bantuan: cek apakah user VIP/unlimited/ustadz
export function isUnlimitedUser(
  user?: { role?: string; group_id?: string; tier?: string; is_vip?: boolean; is_ustadz?: boolean; subscription_type?: string } | null,
  isVipStore?: boolean,
  groupId?: string | null,
  subscriptionType?: string | null,
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

  // Ustadz/Ustadzah memiliki fitus khusus (room, soal, dll)
  if (user?.is_ustadz === true || roleClean === 'USTADZ' || roleClean === 'USTADZAH') {
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

  // Actions
  initialize: () => Promise<void>;
  consumeHeart: () => Promise<boolean>;
  consumeTicket: () => Promise<boolean>;
  restoreHeart: () => Promise<boolean>;
  restoreTicket: () => Promise<boolean>;
  buyBooster: (boosterId: string, price: number) => Promise<boolean>;
  setVip: (isVip: boolean) => Promise<void>;
  setGroupId: (groupId: string | null) => Promise<void];
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
}

export const useEconomyStore = create<EconomyState>((set, get) => ({
  // Initial state
  userId: null,
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

  // Initialize: ambil data dari Supabase dan cek subscription
  initialize: async () => {
    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user) {
        set({ userId: user.id, username: user.email?.split('@')[0] || null });

        // Ambil data user dari Supabase termasuk subscription
        const { data: userData, error } = await supabase
          .from('users')
          .select('hearts, tickets, level, xp, group_id, is_vip, role, role_ustadz, subscription_type, rooms_created, max_rooms, max_participants')
          .eq('id', user.id)
          .single();

        if (userData && !error) {
          const role = userData.role || 'member';
          const subscription = userData.subscription_type || 'free';
          
          // Derived values dari database
          const roomsCreated = userData.rooms_created || 0;
          const maxRooms = userData.max_rooms ?? (subscription === 'premium' ? -1 : (subscription === 'vip' ? 5 : 1));
          const maxParticipants = userData.max_participants ?? (subscription === 'premium' ? 50 : (subscription === 'vip' ? 10 : 5));

          set({
            role: role,
            groupId: userData.group_id || null,
            isVip: userData.is_vip || false,
            isUstadz: 
              userData.role_ustadz === 1 ||
              role === 'ustadz' ||
              role === 'ustadzah' ||
              userData.is_vip,
            subscriptionType: subscription,
            hearts: userData.hearts ?? HEART_MAX,
            tickets: userData.tickets ?? TICKET_MAX,
            level: userData.level ?? 1,
            xp: userData.xp ?? 0,
            lastSync: Date.now(),
            roomLimit: maxRooms,
            participantLimit: maxParticipants,
          });

          // Jika ustadz, ambil daftar room yang dibuat
          if (get().isUstadz) {
            await get().fetchUstadzRooms();
          }
        } else {
          // User baru - default free
          await supabase.from('users').insert({
            id: user.id,
            hearts: HEART_MAX,
            tickets: TICKET_MAX,
            level: 1,
            xp: 0,
            group_id: null,
            is_vip: false,
            role: 'member',
            role_ustadz: 0,
            subscription_type: 'free',
            rooms_created: 0,
            max_rooms: 1,
            max_participants: 5,
          });
          set({
            role: 'member',
            groupId: null,
            isVip: false,
            isUstadz: false,
            subscriptionType: 'free',
            roomLimit: 1,
            participantLimit: 5,
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
      set({
        hearts: HEART_MAX,
        tickets: TICKET_MAX,
        level: 1,
        xp: 0,
        subscriptionType: 'free',
        roomLimit: 1,
        participantLimit: 5,
      });
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
    if (roomLimit === -1 || roomLimit === 'unlimited') return true;
    
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
      await supabase.from('ustadz_room_participants').delete({
        eq: 'room_id_user_id',
        sourceKey: 'user_id',
        sourceKeyValue: userId,
        table: 'ustadz_room_participants',
        foreignKey: 'room_id',
        foreignKeyValue: currentRoom.id,
      }).on('error', (err) => {
        console.error('Error leaving room:', err);
      });

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
      ).eq('is_active', true);

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
});

// Helper functions for password hashing (client-side simplified)
const hashPassword = async (password: string): Promise<string> => {
  // Di production, gunakan proper password hashing
  // Di sini hanya mock untuk development
  return btoa(password); // Base64 simple untuk development
};

const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
  return hashPassword(password) === hashed;
};
