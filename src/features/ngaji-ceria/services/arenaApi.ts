import type { UniversalQuestion } from "../data/quiz/types";

const SERVER_BASE =
  import.meta.env.VITE_ARENA_SERVER_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8080`
    : "http://localhost:8080");

export interface CreateRoomParams {
  hostId: string;
  roomType: "latihan" | "kuis_harian" | "ujian_resmi";
  kkm: number;
  isRandomized: boolean;
  tier: "free" | "vip" | "premium";
  questions: UniversalQuestion[];
}

export interface RoomInfoResponse {
  pin: string;
  roomType: string;
  status: string;
  kkm: number;
  totalQuestions: number;
  playerCount: number;
  players: Array<{
    id: string;
    nickname: string;
    score: number;
    isActive: boolean;
    violations: number;
  }>;
}

export interface JoinRoomResponse {
  success: boolean;
  playerId: string;
  nickname: string;
  roomPin: string;
}

export interface ExamReportResponse {
  roomPin: string;
  roomType: string;
  kkm: number;
  totalQuestions: number;
  totalPlayers: number;
  players: Array<{
    id: string;
    nickname: string;
    score: number;
    percentage: number;
    passed: boolean;
    violations: number;
    disqualified: boolean;
  }>;
  categoryAverages: Record<string, number>;
  createdAt: string;
}

export interface GlobalLeaderboardResponse {
  success: boolean;
  leaderboard: Array<{
    rank: number;
    nickname: string;
    tpq: string;
    score: number;
    badges: number;
  }>;
  timeframe: string;
}

export const arenaApi = {
  getServerBaseUrl(): string {
    return SERVER_BASE;
  },

  getWsUrl(pin: string, playerId?: string, isHost?: boolean): string {
    const wsProto = SERVER_BASE.startsWith("https") ? "wss" : "ws";
    const host = SERVER_BASE.replace(/^https?:\/\//, "");
    const query = new URLSearchParams();
    if (playerId) query.set("playerId", playerId);
    if (isHost) query.set("isHost", "true");
    return `${wsProto}://${host}/api/ws/room/${pin}?${query.toString()}`;
  },

  async createRoom(params: CreateRoomParams): Promise<{ success: boolean; pin: string; examToken: string; room: any }> {
    const res = await fetch(`${SERVER_BASE}/api/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Gagal membuat room");
    }
    return res.json();
  },

  async getRoomInfo(pin: string): Promise<RoomInfoResponse> {
    const res = await fetch(`${SERVER_BASE}/api/rooms/${pin}`);
    if (!res.ok) {
      throw new Error("Room tidak ditemukan atau PIN salah");
    }
    return res.json();
  },

  async joinRoom(pin: string, nickname: string, userId?: string): Promise<JoinRoomResponse> {
    const res = await fetch(`${SERVER_BASE}/api/rooms/${pin}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, userId }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Gagal bergabung ke room");
    }
    return res.json();
  },

  async recordViolation(roomPin: string, playerId: string, violationType: string = "tab_switch"): Promise<{ success: boolean; violations: number; autoSubmitted: boolean }> {
    const res = await fetch(`${SERVER_BASE}/api/exam/violation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomPin, playerId, violationType }),
    });
    if (!res.ok) {
      throw new Error("Gagal merekam pelanggaran");
    }
    return res.json();
  },

  async getExamReport(pin: string): Promise<ExamReportResponse> {
    const res = await fetch(`${SERVER_BASE}/api/rooms/${pin}/report`);
    if (!res.ok) {
      throw new Error("Gagal mengambil laporan ujian");
    }
    return res.json();
  },

  async getGlobalLeaderboard(): Promise<GlobalLeaderboardResponse> {
    const res = await fetch(`${SERVER_BASE}/api/leaderboard/global`);
    if (!res.ok) {
      throw new Error("Gagal mengambil leaderboard global");
    }
    return res.json();
  },
};
