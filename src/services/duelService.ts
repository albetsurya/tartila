/**
 * Duel service — API klien untuk sistem sosial "Teman Kelas" & Tantangan Duel.
 * Safe-mode untuk anak: tanpa chat/DM, hanya duel dalam satu kelas yang sama.
 */

import { callREST } from "./api";

export interface Classmate {
  userId: string;
  name: string;
  username: string;
  level: number;
  photoUrl: string;
}

export interface FriendChallenge {
  id: string;
  challengerId: string;
  opponentId: string;
  roomId: string;
  gameType: string;
  status: "pending" | "accepted" | "completed" | "rejected" | "expired";
  createdAt: string;
}

export interface ChallengeResult {
  challenge: FriendChallenge;
  roomId: string;
}

export interface CreateDuelSessionResult {
  sessionId: string;
  duelCode: string;
}

export interface JoinDuelSessionResult {
  sessionId: string;
  hostName: string;
  questions: unknown[];
}

export interface SubmitDuelScoreResult {
  ok: boolean;
}

export interface DuelSession {
  sessionId: string;
  duelCode: string;
  hostId: string;
  opponentId?: string;
  quizId: string;
  gameType: string;
  status: "waiting" | "playing" | "finished";
  questions: unknown[];
  hostScore: number;
  opponentScore: number;
  winnerId?: string;
}

const DUEL_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateDuelCode(): string {
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += DUEL_CODE_CHARS[Math.floor(Math.random() * DUEL_CODE_CHARS.length)];
  }
  return code;
}

export const duelService = {
  /** Daftar santri lain di kelas yang sama. */
  listClassmates: (roomId: string) =>
    callREST<Classmate[]>("GET", `/api/v1/room/${encodeURIComponent(roomId)}/classmates`),

  /** Buat tantangan duel baru. */
  createChallenge: (roomId: string, opponentId: string, gameType = "kuis") =>
    callREST<FriendChallenge>("POST", "/api/v1/room/challenge", {
      roomId,
      opponentId,
      gameType,
    }),

  /** Terima tantangan → roomId untuk redirect. */
  acceptChallenge: (challengeId: string) =>
    callREST<ChallengeResult>(
      "PATCH",
      `/api/v1/challenge/${encodeURIComponent(challengeId)}/accept`,
    ),

  /** Tolak tantangan. */
  rejectChallenge: (challengeId: string) =>
    callREST<ChallengeResult>(
      "PATCH",
      `/api/v1/challenge/${encodeURIComponent(challengeId)}/reject`,
    ),

  /** Cek pengaturan duel di kelas (kontrol ustadz). */
  getDuelSetting: (roomId: string) =>
    callREST<{ enabled: boolean }>(
      "GET",
      `/api/v1/room/${encodeURIComponent(roomId)}/duel`,
    ),

  /** Ubah pengaturan duel (hanya ustadz pemilik kelas). */
  setDuelSetting: (roomId: string, enabled: boolean) =>
    callREST<{ enabled: boolean }>(
      "PATCH",
      `/api/v1/room/${encodeURIComponent(roomId)}/duel`,
      { enabled },
    ),

  /** Buat sesi duel baru + kode 6 karakter untuk dibagikan. */
  createDuelSession: (quizId = "bahasa-arab", gameType = "kuis", duelCode?: string) =>
    callREST<CreateDuelSessionResult>("POST", "/api/v1/duel/session", {
      quizId,
      gameType,
      duelCode: duelCode || generateDuelCode(),
    }),

  /** Gabung sesi duel lewat kode. Backend ubah status waiting → playing. */
  joinDuelSession: (duelCode: string) =>
    callREST<JoinDuelSessionResult>("POST", "/api/v1/duel/join", {
      duelCode,
    }),

  /** Ambil status sesi duel terkini. */
  getDuelSession: (sessionId: string) =>
    callREST<DuelSession>("GET", `/api/v1/duel/${encodeURIComponent(sessionId)}`),

  /** Simpan skor akhir user ke sesi duel. */
  submitDuelScore: (sessionId: string, score: number) =>
    callREST<SubmitDuelScoreResult>("POST", "/api/v1/duel/score", {
      sessionId,
      score,
    }),
};

export const duelApi = duelService;
