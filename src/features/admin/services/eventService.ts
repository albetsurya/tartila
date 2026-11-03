// Admin event service.
//
// Semua penulisan event lewat Backend Go (`POST /api/admin/events`).
// `callREST` sudah melampirkan JWT dan membuka envelope
// `{ success, data, message }`.

import { ApiError, callREST } from "@/services/api";

export interface EventMissionPayload {
  title: string;
  target_amount: number;
  reward_coins: number;
  reward_tickets: number;
}

export interface CreateEventPayload {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  missions: EventMissionPayload[];
}

export interface AdminEventMission extends EventMissionPayload {
  id: string;
  event_id: string;
  action_type: string;
  reward_hearts: number;
  progress: number;
  is_claimed: boolean;
  is_completed: boolean;
}

export interface AdminEvent {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  missions: AdminEventMission[];
}

export async function createEvent(
  payload: CreateEventPayload,
): Promise<AdminEvent> {
  return callREST<AdminEvent>("POST", "/api/admin/events", payload);
}

export function getEventErrorMessage(
  err: unknown,
  fallback = "Gagal membuat event. Coba lagi.",
): string {
  if (err instanceof ApiError) {
    if (err.statusCode === 401) {
      return "Sesi Anda telah berakhir. Silakan masuk kembali.";
    }
    if (err.statusCode === 403) {
      return "Anda tidak memiliki akses untuk membuat event.";
    }
    if (err.cancelled) return "Permintaan ke server timeout. Coba lagi.";
    return err.message || fallback;
  }
  return err instanceof Error ? err.message : fallback;
}
