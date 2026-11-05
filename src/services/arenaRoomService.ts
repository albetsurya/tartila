import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateJoinCode } from "@/lib/joinCode";
import { callREST } from "./api";

export type RoomType = "casual" | "exam" | "latihan" | "ujian_resmi";
export type RoomStatus = "waiting" | "playing" | "finished";

export interface ArenaRoom {
  id: string;
  host_id: string;
  pin: string;
  room_code: string;
  room_type: RoomType;
  title?: string;
  theme?: string;
  status: RoomStatus;
  current_question_index?: number;
  kkm?: number;
  is_randomized?: boolean;
  questions?: any[];
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
  is_ready?: boolean;
  is_bot?: boolean;
  avatarId?: string;
  created_at?: string;
}

// Memory & LocalStorage Fallback Storage untuk Lingkungan Dev/Offline
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LOCAL_ROOMS_KEY = "tartila_arena_mock_rooms";
const LOCAL_PLAYERS_KEY = "tartila_arena_mock_players";

/**
 * Samakan bentuk soal frontend dengan `ArenaQuestionInput` backend Go:
 * `correctAnswer` string, `options` array of `{id,text,arabic?}`, dan
 * `question_type` yang dikenal backend (text|audio|fill_blank|image|multiple_choice).
 */
function normalizeArenaQuestion(question: any, index: number) {
  const rawAnswer =
    question?.correctAnswer ??
    question?.correct_answer ??
    question?.correctAnswerId ??
    "";
  const correctAnswer = Array.isArray(rawAnswer)
    ? String(rawAnswer[0] ?? "")
    : String(rawAnswer ?? "");

  const rawOptions = Array.isArray(question?.options) ? question.options : [];
  const options = rawOptions.map((opt: any, optIndex: number) => {
    const fallbackId = String.fromCharCode(65 + optIndex);
    if (typeof opt === "string") return { id: fallbackId, text: opt };
    const id = opt?.id ? String(opt.id) : fallbackId;
    const text = String(opt?.text ?? opt?.label ?? "");
    const arabic = opt?.arabic ? String(opt.arabic) : "";
    return arabic ? { id, text, arabic } : { id, text };
  });

  const rawType = String(question?.type ?? "").toLowerCase();
  const knownTypes = ["text", "audio", "fill_blank", "image", "multiple_choice"];
  const type = knownTypes.includes(rawType)
    ? rawType
    : options.length > 0
      ? "multiple_choice"
      : "text";

  const rawCategory = String(question?.category ?? "").toLowerCase();
  const category = ["tilawati", "tajwid", "nabi"].includes(rawCategory)
    ? rawCategory
    : "tilawati";

  return {
    type,
    category,
    title: String(question?.title ?? `Soal ${index + 1}`),
    prompt: String(question?.prompt ?? question?.question ?? ""),
    arabicPrompt: String(
      question?.arabicPrompt ??
        question?.arabicText ??
        question?.arabicTemplate ??
        "",
    ),
    audioUrl: String(question?.audioUrl ?? ""),
    options,
    correctAnswer,
    timeLimitSeconds: Number(question?.timeLimitSeconds) || 20,
    points: Number(question?.points) || 1000,
  };
}

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
  }): Promise<{ ok: true; data: ArenaRoom } | { ok: false; message: string }> {
    const kkm = params.roomType === "exam" ? (params.kkm ?? 75) : 0;

    try {
      const res = await callREST<{ pin: string; roomId: string }>(
        "POST",
        "/api/v1/arena/room",
        {
          title: params.title ?? "Arena",
          hostName: params.hostName ?? "Host",
          roomType: params.roomType,
          kkm,
          questions: params.questions ?? [],
        },
      );
      if (!res?.roomId || !res?.pin) {
        return { ok: false, message: "Server tidak mengembalikan room." };
      }

      const newRoom: ArenaRoom = {
        id: res.roomId,
        host_id: params.hostId,
        pin: res.pin,
        room_code: res.pin,
        room_type: params.roomType,
        title: params.title,
        status: "waiting",
        current_question_index: 0,
        kkm,
        is_randomized: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const localRooms = getLocalRooms();
      localRooms[res.pin] = newRoom;
      localRooms[res.roomId] = newRoom;
      saveLocalRooms(localRooms);

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("arena_player_id");
        window.sessionStorage.setItem("arena_player_name", params.hostName || "Host");
      }

      return { ok: true, data: newRoom };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Gagal membuat room.",
      };
    }
  },

  /**
   * Cari Room Berdasarkan PIN.
   */
  async getRoom(pinOrId: string): Promise<ArenaRoom | null> {
    const key = pinOrId.trim();
    if (!key) return null;

    if (UUID_RE.test(key)) {
      throw new Error("getRoom by id belum didukung; gunakan pin.");
    }

    if (!isSupabaseConfigured) {
      return getLocalRooms()[key] || null;
    }

    const { data, error } = await supabase.rpc("get_room_by_pin", {
      p_pin: key,
    });
    if (error) throw error;
    return (data as ArenaRoom) ?? null;
  },

  /**
   * Ambil daftar pemain yang sudah join ke Room by PIN.
   */
  async getRoomPlayers(pinOrId: string): Promise<ArenaRoomPlayer[]> {
    const key = pinOrId.trim();
    if (!key) return [];

    if (UUID_RE.test(key)) {
      throw new Error("getRoomPlayers by id belum didukung; gunakan pin.");
    }

    if (!isSupabaseConfigured) {
      const localRoom = getLocalRooms()[key];
      return localRoom ? getLocalPlayers(localRoom.id) : [];
    }

    const { data, error } = await supabase.rpc("get_room_players_by_pin", {
      p_pin: key,
    });
    if (error) throw error;
    return (data as ArenaRoomPlayer[]) ?? [];
  },

  /**
   * Gabung ke Room dengan PIN (Dipanggil saat user lain klik "Gabung PIN")
   */
  async joinRoom(params: {
    roomId: string;
    userId: string;
    nickname: string;
  }): Promise<
    | { ok: true; data: { playerId: string; roomId: string; nickname: string } }
    | { ok: false; message: string }
  > {
    try {
      const res = await callREST<{
        playerId: string;
        roomId: string;
        nickname: string;
      }>("POST", `/api/v1/arena/room/${encodeURIComponent(params.roomId)}/join`, {
        nickname: params.nickname,
      });
      return { ok: true, data: res };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Gagal bergabung ke room.",
      };
    }
  },

  /**
   * Mulai Game (Hanya dipanggil oleh Host).
   *
   * Endpoint backend hanya menerima roomId UUID; teks lain langsung ditolak
   * 400 sehingga divalidasi di sini agar pesannya jelas. Pesan asli dari
   * backend diteruskan supaya penyebab penolakan (bukan host / room sudah
   * berjalan / room tidak ditemukan) terlihat oleh pengguna.
   */
  async startGame(
    roomId: string,
    code?: string,
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    const id = (roomId || "").trim();
    if (!UUID_RE.test(id)) {
      return {
        ok: false,
        message:
          "ID room tidak valid (bukan UUID). Muat ulang halaman lobi lalu coba mulai lagi.",
      };
    }

    try {
      await callREST(
        "POST",
        `/api/v1/arena/room/${encodeURIComponent(id)}/start`,
        code ? { pin: code } : {},
      );
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Gagal memulai permainan.",
      };
    }
  },

  /**
   * Simpan pertanyaan kuis ke tabel room_questions (dipanggil setelah room dibuat).
   *
   * Payload dinormalisasi ke bentuk `ArenaQuestionInput` backend Go
   * (`correctAnswer` wajib string). Soal kuis hub bisa memiliki
   * `correctAnswer` berupa array (fill-in-the-blank) dan `options` berupa
   * string; bentuk itu membuat BodyParser backend gagal dan membalas 400.
   */
  async saveRoomQuestions(
    roomId: string,
    questions: any[],
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    if (!questions || questions.length === 0) return { ok: true };

    const id = (roomId || "").trim();
    if (!UUID_RE.test(id)) {
      return {
        ok: false,
        message:
          "ID room tidak valid (bukan UUID). Muat ulang halaman lobi lalu coba lagi.",
      };
    }

    try {
      await callREST(
        "POST",
        `/api/v1/arena/room/${encodeURIComponent(id)}/questions`,
        { questions: questions.map(normalizeArenaQuestion) },
      );
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Gagal menyimpan pertanyaan.",
      };
    }
  },

  /**
   * Ambil pertanyaan dari RPC by PIN (tanpa correct_answer).
   */
  async getRoomQuestions(pinOrId: string): Promise<any[]> {
    const key = pinOrId.trim();
    if (!key) return [];

    if (UUID_RE.test(key)) {
      throw new Error("getRoomQuestions by id belum didukung; gunakan pin.");
    }

    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase.rpc("get_room_questions_by_pin", {
      p_pin: key,
    });
    if (error) throw error;

    const rows = (data as any[]) ?? [];
    return rows.map((row: any) => ({
      id: row.id,
      type: row.question_type,
      category: row.category,
      prompt: row.question_data?.prompt,
      arabicPrompt: row.question_data?.arabicPrompt,
      audioUrl: row.question_data?.audioUrl,
      title: row.question_data?.title,
      options: row.options ?? [],
      timeLimitSeconds: row.question_data?.timeLimitSeconds || 20,
      points: row.question_data?.points || 1000,
    }));
  },

  async setPlayerReady(
    roomId: string,
    playerId: string,
    ready: boolean,
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    try {
      await callREST("POST", `/api/v1/arena/room/${encodeURIComponent(roomId)}/ready`, {
        playerId,
        ready,
      });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Gagal mengubah status siap.",
      };
    }
  },

  /**
   * Update Tema Room di Lobi
   */
  async updateRoomTheme(pinOrId: string, theme: string): Promise<boolean> {
    const key = pinOrId.trim();
    if (!key) return false;

    const localRooms = getLocalRooms();
    if (localRooms[key]) {
      localRooms[key].theme = theme;
      if (localRooms[key].pin) localRooms[localRooms[key].pin].theme = theme;
      if (localRooms[key].id) localRooms[localRooms[key].id].theme = theme;
      saveLocalRooms(localRooms);
    }
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(`arena_theme_${key}`, theme);
    }

    if (isSupabaseConfigured) {
      try {
        // Filter dipisah: `id` bertipe UUID dan `pin` teks. Memakai
        // `or=(pin.eq.X,id.eq.Y)` membuat PostgREST gagal parse Y sebagai UUID
        // ketika dikalikan dengan penambahan UUID (400 Bad Request).
        await supabase
          .from("rooms")
          .update({ title: theme })
          .eq(UUID_RE.test(key) ? "id" : "pin", key);
      } catch (err) {
        console.warn("Update room theme Supabase warning:", err);
      }
    }
    return true;
  },

  /**
   * Reset Status Room ke Waiting & Skor Pemain ke 0 (Loop Permainan)
   */
  async resetRoomToLobby(pinOrId: string): Promise<boolean> {
    const key = pinOrId.trim();
    if (!key) return false;

    const localRooms = getLocalRooms();
    if (localRooms[key]) {
      localRooms[key].status = "waiting";
      localRooms[key].current_question_index = 0;
      saveLocalRooms(localRooms);
    }

    const localPlayers = getLocalPlayers();
    localPlayers.forEach((p) => {
      if (p.room_id === key || p.room_id === localRooms[key]?.id) {
        p.score = 0;
        p.is_ready = false;
      }
    });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(localPlayers));
    }

    if (isSupabaseConfigured) {
      try {
        // Alasan `.eq` terpisah sama seperti updateRoomTheme di atas.
        await supabase
          .from("rooms")
          .update({ status: "waiting", current_question_index: 0 })
          .eq(UUID_RE.test(key) ? "id" : "pin", key);
        await supabase
          .from("room_players")
          .update({ score: 0, is_ready: false })
          .eq("room_id", localRooms[key]?.id || key);
      } catch (err) {
        console.warn("Reset room Supabase warning:", err);
      }
    }
    return true;
  },
};
