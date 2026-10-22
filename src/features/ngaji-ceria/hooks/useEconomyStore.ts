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
  user?: { role?: string; group_id?: string; tier?: string; is_vip?: boolean; is_ustadz?: boolean } | null,
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

  // Ustadz/Ustadzah memiliki fitur khusus (room, soal, dll)
  // Ustadz tidak memiliki limit hati/tiket untuk fitur "belajar bareng"
  if (user?.is_ustadz === true || roleClean === 'USTADZ' || roleClean === 'USTADZAH') {
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
  isUstadz: boolean; // flag baru

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

  // Actions
  initialize: () => Promise<void>;
  consumeHeart: () => Promise<boolean>;
  consumeTicket: () => Promise<boolean>;
  restoreHeart: () => Promise<boolean>;
  restoreTicket: () => Promise<boolean>;
  buyBooster: (boosterId: string, price: number) => Promise<boolean>;
  setVip: (isVip: boolean) => Promise<void>;
  setGroupId: (groupId: string | null) => Promise<void>;
  setUstadzFlag: (isUstadz: boolean) => Promise<void>;

  // Room management actions
  createRoom: (name: string, password?: string, gameType?: string) => Promise<any>;
  joinRoom: (roomId: string, password?: string) => Promise<boolean>;
  leaveRoom: () => Promise<boolean>;
  getRooms: () => Promise<any[]>;
  getParticipantCount: (roomId: string) => Promise<number>;

  // Query helpers
  energyQuota: (user?: { role?: string; group_id?: string; is_ustadz?: boolean } | null, groupId?: string | null) => {
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
  hearts: HEART_MAX,
  tickets: TICKET_MAX,
  level: 1,
  xp: 0,
  lastSync: Date.now(),
  activeBoosters: {},
  ustadzRooms: [],
  currentRoom: null,
  roomParticipants: [],

  // Initialize: ambil data dari Supabase dan cek ustadz status
  initialize: async () => {
    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user) {
        set({ userId: user.id, username: user.email?.split('@')[0] || null });

        // Ambil data user dari Supabase termasuk role_ustadz
        const { data: userData, error } = await supabase
          .from('users')
          .select('hearts, tickets, level, xp, group_id, is_vip, role, role_ustadz')
          .eq('id', user.id)
          .single();

        if (userData && !error) {
          const role = userData.role || 'member';
          const isUstadz = 
            userData.role_ustadz === 1 ||
            role === 'ustadz' ||
            role === 'ustadzah' ||
            userData.is_vip;

          set({
            role: role,
            groupId: userData.group_id || null,
            isVip: userData.is_vip || false,
            isUstadz: isUstadz,
            hearts: userData.hearts ?? HEART_MAX,
            tickets: userData.tickets ?? TICKET_MAX,
            level: userData.level ?? 1,
            xp: userData.xp ?? 0,
            lastSync: Date.now(),
          });

          // Jika ustadz, ambil daftar room yang dibuat
          if (isUstadz) {
            await get().fetchUstadzRooms();
          }
        } else {
          // User baru
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
          });
          set({
            role: 'member',
            groupId: null,
            isVip: false,
            isUstadz: false,
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
      });
    }
  },

  // ... (sisa action yang sama seperti sebelumnya, hanya menambahkan fitur ustadz)

  // Set ustadz flag
  setUstadzFlag: async (isUstadz: boolean) => {
    const { userId } = get();
    set({ isUstadz });

    try {
      const { data: { user} } = await supabase.auth.getUser();
      if (user && userId) {
        await supabase
          .from('users')
          .update({ is_vip: isUstadz }) // Menggunakan is_vip field untuk kemudahan
          .eq('id', userId);
        set({ lastSync: Date.now() });
      }
    } catch (err) {
      console.error('Failed to sync ustadz flag to Supabase:', err);
    }
  },

  // Fungsi: Buat ruang kelas baru
  createRoom: async (name: string, password?: string, gameType: string = 'tilawati') => {
    const { userId } = get();
    if (!userId || !get().isUstadz) return null;

    try {
      // Buat room di database
      const { data: room, error } = await supabase
        .from('ustadz_rooms')
        .insert({
          ustadz_id: userId,
          name: name,
          password_hash: password ? await hashPassword(password) : null,
          max_participants: 50,
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

      // Update state lokal
      const updatedRooms = [room, ...get().ustadzRooms].filter(
        (r, i) => i === 0 || r.id !== room.id
      ).slice(0, 50); // Limit 50 rooms

      set({
        ustadzRooms: updatedRooms,
        currentRoom: room,
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

      if ((participantCount || 0) >= (room.max_participants || 50)) return false;

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
        schema: 'public',
        table: 'ustadz_room_participants',
        foreignKey: 'room_id',
        foreignKeyValue: currentRoom.id,
        sourceKey: 'user_id',
        sourceKeyValue: userId,
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
    const { userId } = get();
    try {
      let query = supabase.from('ustadz_rooms').select('*').eq('is_active', true);

      // Jika user adalah ustadz, tampilkan semua room, kalau murid tampilkan hanya room aktif
      if (userId && get().isUstadz) {
        // Ustadz lihat semua room
      } else {
        query = query.eq('is_active', true);
      }

      const { data: rooms, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ambil count peserta untuk setiap room
      const roomsWithCount = await Promise.all(
        (rooms || []).map(async (room: any) => {
          const { count: participantCount } = await supabase
            .from('ustadz_room_participants')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id);
          
          return {
            ...room,
            participantCount: participantCount || 0,
          };
        })
      );

      set({ ustadzRooms: roomsWithCount });
      return roomsWithCount;
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

  // Helper: Energy quota dengan ustadz check
  energyQuota: (user?, groupId?) => {
    const hearts = get().hearts;
    const tickets = get().tickets;
    const isUnlimited = isUnlimitedUser(user, get().isVip, groupId, get().isUstadz);

    return {
      hearts: isUnlimited ? Infinity : hearts,
      tickets: isUnlimited ? Infinity : tickets,
      isUnlimited,
      heartDisplay: isUnlimited ? '∞' : `${hearts}/${HEART_MAX}`,
      ticketDisplay: isUnlimited ? '∞' : `${tickets}/${TICKET_MAX}`,
    };
  },
}));
