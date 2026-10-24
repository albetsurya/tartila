/**
 * Klien API notifikasi DB (server) — melengkapi notifikasi lokal.
 * Termasuk tipe duel_challenge & duel_result.
 */

import { callREST } from "./api";

export interface ServerNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export const notificationApi = {
  list: () => callREST<ServerNotification[]>("GET", "/api/v1/notifications"),
  unreadCount: () =>
    callREST<{ count: number }>("GET", "/api/v1/notifications/unread-count"),
  markRead: (id: string) =>
    callREST<{ ok: boolean }>(
      "PATCH",
      `/api/v1/notifications/${encodeURIComponent(id)}/read`,
    ),
  markAllRead: () =>
    callREST<{ ok: boolean }>("PATCH", "/api/v1/notifications/read-all"),
};
