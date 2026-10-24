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
};
