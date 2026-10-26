import { callREST } from "./api";

export interface ArenaRoom {
  pin: string;
  hostId: string;
  name: string;
  status: string;
  maxParticipants: number;
}

export interface CreateRoomRequest {
  name: string;
  maxParticipants?: number;
}

export interface JoinRoomResult {
  success: boolean;
  pin?: string;
  name?: string;
}

export interface ReadyResult {
  success: boolean;
}

const BASE = "/api/v1/arena/room";

export const arenaApi = {
  createRoom: (req: CreateRoomRequest) =>
    callREST<ArenaRoom>("POST", `${BASE}`, req),

  joinRoom: (pin: string) =>
    callREST<JoinRoomResult>(
      "POST",
      `${BASE}/${encodeURIComponent(pin)}/join`,
      {},
    ),

  ready: (pin: string) =>
    callREST<ReadyResult>(
      "POST",
      `${BASE}/${encodeURIComponent(pin)}/ready`,
      {},
    ),
};
