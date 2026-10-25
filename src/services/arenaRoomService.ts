import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateJoinCode, normalizeJoinCode } from "@/lib/joinCode";

export type RoomType = "casual" | "exam" | "latihan" | "ujian_resmi";
export type RoomStatus = "waiting" | "playing" | "finished";

export interface ArenaRoom {
  id: string;
  host_id: string;
  pin: string;
  room_code: string;
  room_type: RoomType;
  status: RoomStatus;
  current_question_index?: number;
  kkm?: number;
  is_randomized?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ArenaRoomPlayer {
  id: string;
  room_id: string;
  user_id?: string | null;
  nickname: string;
  score: number;
  is_active: boolean;
  is_host?: boolean;
  created_at?: string;
}

// Memory & LocalStorage Fallback Storage untuk Lingkungan Dev/Offline
const LOCAL_ROOMS_KEY = "tartila_arena_mock_rooms";
const LOCAL_PLAYERS_KEY = "tartila_arena_mock_players";

const getLocalRooms = (): Record<string, ArenaRoom> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_ROOMS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLocalRooms = (rooms: Record<string, ArenaRoom>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_ROOMS_KEY, JSON.stringify(rooms));
  } catch {
    // ignore
  }
};

const getLocalPlayers = (roomId?: string): ArenaRoomPlayer[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_PLAYERS_KEY);
    const all: ArenaRoomPlayer[] = raw ? JSON.parse(raw) : [];
    return roomId ? all.filter((p) => p.room_id === roomId) : all;
  } catch {
    return [];
  }
};

const saveLocalPlayer = (player: ArenaRoomPlayer) => {
  if (typeof window === "undefined") return;
  try {
    const all = getLocalPlayers();
    const filtered = all.filter((p) => p.id !== player.id);
    filtered.push(player);
    window.localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
};

export const arenaRoomService = {
  /**
   * Generate 6-karakter unik PIN / Room Code (Huruf Besar & Angka)
   */
  generateRoomCode(): string {
    return generateJoinCode();
  },

  /**
   * Buat Room Baru (Member = 'casual', Ustadz = 'exam')
   */
  async createRoom(params: {
    hostId: string;
    hostName?: string;
    roomType: "casual" | "exam";
    title?: string;
    kkm?: number;
    questions?: any[];
  }): Promise<ArenaRoom> {
    const code = this.generateRoomCode();
    const fallbackId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const newRoom: ArenaRoom = {
      id: fallbackId,
      host_id: params.hostId,
      pin: code,
      room_code: code,
      room_type: params.roomType,
      status: "waiting",
      current_question_index: 0,
      kkm: params.roomType === "exam" ? (params.kkm ?? 75) : 0,
      is_randomized: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Simpan ke Supabase jika tersedia
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .insert({
            host_id: params.hostId,
            pin: code,
            room_code: code,
            room_type: params.roomType,
            status: "waiting",
            current_question_index: 0,
            kkm: newRoom.kkm,
            is_randomized: true,
          })
          .select()
          .maybeSingle();

        if (error) {
          // Jika constraint room_type lama menolak 'casual'/'exam', mapping ke fallback
          const fallbackType = params.roomType === "exam" ? "ujian_resmi" : "latihan";
          const retry = await supabase
            .from("rooms")
            .insert({
              host_id: params.hostId,
              pin: code,
              room_code: code,
              room_type: fallbackType,
              status: "waiting",
              current_question_index: 0,
              kkm: newRoom.kkm,
              is_randomized: true,
            })
            .select()
            .maybeSingle();

          if (!retry.error && retry.data) {
            newRoom.id = retry.data.id;
          }
        } else if (data) {
          newRoom.id = data.id;
        }
      } catch (err) {
        console.warn("[arenaRoomService] Supabase insert room fallback:", err);
      }
    }

    // 2. Simpan host sebagai player pertama di room_players
    const hostPlayer: ArenaRoomPlayer = {
      id: `player-host-${newRoom.id}`,
      room_id: newRoom.id,
      user_id: params.hostId,
      nickname: params.hostName || "Host",
      score: 0,
      is_active: true,
      is_host: true,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data: pData } = await supabase
          .from("room_players")
          .insert({
            room_id: newRoom.id,
            user_id: params.hostId,
            nickname: hostPlayer.nickname,
            score: 0,
            is_active: true,
          })
          .select()
          .maybeSingle();

        if (pData) {
          hostPlayer.id = pData.id;
        }
      } catch {
        // ignore
      }
    }

    // 3. Simpan di Local Mock Storage untuk reliabilitas
    const localRooms = getLocalRooms();
    localRooms[code] = newRoom;
    localRooms[newRoom.id] = newRoom;
    saveLocalRooms(localRooms);
    saveLocalPlayer(hostPlayer);

    return newRoom;
  },

  /**
   * Cari Room Berdasarkan PIN atau room_code
   */
  async getRoom(codeOrPin: string): Promise<ArenaRoom | null> {
    const cleanCode = normalizeJoinCode(codeOrPin);
    if (!cleanCode) return null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .or(`pin.eq.${cleanCode},room_code.eq.${cleanCode}`)
          .maybeSingle();

        if (!error && data) {
          return {
            ...data,
            pin: data.pin || cleanCode,
            room_code: data.room_code || data.pin || cleanCode,
          };
        }
      } catch {
        // fallback
      }
    }

    // Cek Local Mock Storage
    const localRooms = getLocalRooms();
    return localRooms[cleanCode] || null;
  },

  /**
   * Ambil daftar pemain yang sudah join ke Room
   */
  async getRoomPlayers(roomId: string): Promise<ArenaRoomPlayer[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("room_players")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((d: any, idx: number) => ({
            ...d,
            is_host: idx === 0,
          }));
        }
      } catch {
        // fallback
      }
    }

    return getLocalPlayers(roomId);
  },

  /**
   * Gabung ke Room dengan PIN (Dipanggil saat user lain klik "Gabung PIN")
   */
  async joinRoom(
    codeOrPin: string,
    nickname: string,
    userId?: string
  ): Promise<{ success: boolean; room: ArenaRoom; player: ArenaRoomPlayer }> {
    const cleanCode = normalizeJoinCode(codeOrPin);
    if (!cleanCode) {
      throw new Error("PIN harus berupa 6 karakter.");
    }

    const room = await this.getRoom(cleanCode);
    if (!room) {
      throw new Error(`Room dengan PIN "${cleanCode}" tidak ditemukan.`);
    }

    if (room.status !== "waiting") {
      throw new Error("Room ini sudah memulai permainan atau sudah selesai.");
    }

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      throw new Error("Nama panggilan wajib diisi.");
    }

    const newPlayer: ArenaRoomPlayer = {
      id: `player-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      room_id: room.id,
      user_id: userId || null,
      nickname: trimmedNickname,
      score: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("room_players")
          .insert({
            room_id: room.id,
            user_id: userId || null,
            nickname: trimmedNickname,
            score: 0,
            is_active: true,
          })
          .select()
          .maybeSingle();

        if (error) {
          console.warn("[arenaRoomService] Supabase insert player fallback:", error);
        } else if (data) {
          newPlayer.id = data.id;
        }
      } catch (err) {
        console.warn("[arenaRoomService] joinRoom error:", err);
      }
    }

    // Simpan ke local mock
    saveLocalPlayer(newPlayer);

    return {
      success: true,
      room,
      player: newPlayer,
    };
  },

  /**
   * Mulai Game (Hanya dipanggil oleh Host)
   */
  async startGame(roomId: string, code?: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("rooms")
          .update({ status: "playing", updated_at: new Date().toISOString() })
          .eq("id", roomId);
      } catch {
        // ignore
      }
    }

    // Update Local Mock
    const localRooms = getLocalRooms();
    if (code && localRooms[code]) {
      localRooms[code].status = "playing";
    }
    if (localRooms[roomId]) {
      localRooms[roomId].status = "playing";
    }
    saveLocalRooms(localRooms);

    return true;
  },

  /**
   * Langganan Real-Time Lobi (Mendengarkan room_players dan status rooms)
   */
  subscribeToLobby(
    roomId: string,
    callbacks: {
      onPlayersChange: (players: ArenaRoomPlayer[]) => void;
      onGameStart: () => void;
    }
  ): () => void {
    let isActive = true;

    // 1. Supabase Realtime Channel
    let channel: any = null;
    if (isSupabaseConfigured) {
      try {
        channel = supabase
          .channel(`arena_lobby_${roomId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "room_players",
              filter: `room_id=eq.${roomId}`,
            },
            async () => {
              if (!isActive) return;
              const players = await this.getRoomPlayers(roomId);
              callbacks.onPlayersChange(players);
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "rooms",
              filter: `id=eq.${roomId}`,
            },
            (payload) => {
              if (!isActive) return;
              if (payload.new && payload.new.status === "playing") {
                callbacks.onGameStart();
              }
            }
          )
          .subscribe();
      } catch {
        // fallback
      }
    }

    // 2. Polling interval (setiap 2 detik) sebagai jaminan fallback jika Realtime terputus
    const interval = window.setInterval(async () => {
      if (!isActive) return;
      try {
        const players = await this.getRoomPlayers(roomId);
        callbacks.onPlayersChange(players);

        // Cek status room
        const room = await this.getRoom(roomId);
        if (room && room.status === "playing") {
          callbacks.onGameStart();
        }
      } catch {
        // ignore
      }
    }, 2000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
      if (channel && isSupabaseConfigured) {
        supabase.removeChannel(channel);
      }
    };
  },
};
