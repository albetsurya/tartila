import {
  API_BASE_URL,
  FEEDBACK_PROMPT_PLAYED_KEY,
  FEEDBACK_PROMPT_SESSION_START_KEY,
} from "../constants";
import { getToken } from "./api";

export type MissionEventType =
  | "login"
  | "logout"
  | "quiz_completed"
  | "game_started"
  | "game_completed"
  | "mission_completed"
  | "mission_failed"
  | "admin_action"
  | "user_registered"
  | "user_suspended"
  | "user_activated";

export interface MissionEvent {
  id: string;
  type: MissionEventType;
  userId: string;
  username: string;
  timestamp: number;
  missionId?: string;
  missionName?: string;
  completed?: boolean;
  details?: Record<string, unknown>;
}

export interface CreateEventInput {
  type: MissionEventType;
  userId?: string;
  username?: string;
  missionId?: string;
  missionName?: string;
  completed?: boolean;
  details?: Record<string, unknown>;
}

const STORAGE_KEY = "tartila_events";
const MAX_LOCAL_EVENTS = 200;
export const hasPlayedSessionStorageKey = FEEDBACK_PROMPT_PLAYED_KEY;

// Inisialisasi awal timestamp sesi jika belum ada
if (typeof window !== "undefined") {
  try {
    if (!sessionStorage.getItem(FEEDBACK_PROMPT_SESSION_START_KEY)) {
      sessionStorage.setItem(
        FEEDBACK_PROMPT_SESSION_START_KEY,
        String(Date.now()),
      );
    }
  } catch {
    // Abaikan jika browser memblokir sessionStorage
  }
}

export const MISSION_EVENT_LABELS: Record<MissionEventType, string> = {
  login: "Login",
  logout: "Logout",
  quiz_completed: "Kuis Selesai",
  game_started: "Game Dimulai",
  game_completed: "Game Selesai",
  mission_completed: "Misi Selesai",
  mission_failed: "Misi Gagal",
  admin_action: "Aksi Admin",
  user_registered: "User Terdaftar",
  user_suspended: "User Ditangguhkan",
  user_activated: "User Diaktifkan",
};

export const MISSION_EVENT_COLORS: Record<MissionEventType, string> = {
  login: "#0D9488", // Teal
  logout: "#6B7280", // Gray
  quiz_completed: "#10B981", // Green
  game_started: "#38BDF8", // Sky blue
  game_completed: "#F59E0B", // Amber
  mission_completed: "#10B981", // Green
  mission_failed: "#EF4444", // Red
  admin_action: "#8B5CF6", // Purple
  user_registered: "#0D9488", // Teal
  user_suspended: "#EF4444", // Red
  user_activated: "#10B981", // Green
};

/** Ambil data user aktif saat ini dari localStorage atau session */
function getCurrentUserInfo(): { userId: string; username: string } {
  if (typeof window === "undefined") {
    return { userId: "guest", username: "Tamu" };
  }
  try {
    const rawUser = localStorage.getItem("tartila_user");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      return {
        userId: parsed.id || parsed.userId || "user",
        username: parsed.name || parsed.username || "Santri",
      };
    }
  } catch {
    // ignore json error
  }
  return { userId: "guest", username: "Tamu" };
}

/** Tandai user sudah melakukan aktivitas di sesi ini (mis. kuis, game, materi). */
export function markHasPlayedSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(hasPlayedSessionStorageKey, "true");
    window.dispatchEvent(new CustomEvent("tartila:activity_played"));
  } catch (err) {
    console.warn("Gagal menandai aktivitas session:", err);
  }
}

/** Reset flag aktivitas saat tab ditutup. sessionStorage akan otomatis
 *  dibersihkan saat tab ditutup, tapi ini sebagai backup tambahan. */
export function resetHasPlayedSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(hasPlayedSessionStorageKey, "false");
    sessionStorage.removeItem(hasPlayedSessionStorageKey);
  } catch (err) {
    console.warn("Gagal mereset aktivitas session:", err);
  }
}

/** Simpan event ke localStorage secara aman */
export function saveEventLocally(event: MissionEvent): void {
  if (typeof window === "undefined") return;
  try {
    const currentList = getRecentEvents(MAX_LOCAL_EVENTS);
    const updated = [event, ...currentList.filter((e) => e.id !== event.id)].slice(
      0,
      MAX_LOCAL_EVENTS,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("tartila:event", { detail: event }));
  } catch (err) {
    console.warn("Gagal menyimpan event ke localStorage:", err);
  }
}

/** Ambil daftar event terbaru dari localStorage */
export function getRecentEvents(limit: number = 50): MissionEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: MissionEvent[] = JSON.parse(raw);
    return Array.isArray(list) ? list.slice(0, limit) : [];
  } catch {
    return [];
  }
}

/** Sinkronisasi satu event ke backend / API server */
export async function syncEventToServer(event: MissionEvent): Promise<boolean> {
  const baseUrl = API_BASE_URL ? API_BASE_URL.replace(/\/api(\/v1)?\/?$/, "").replace(/\/+$/, "") : "";
  const url = `${baseUrl}/api/events`;
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(event),
    });
    if (response.ok) {
      markHasPlayedSession();
    }
    return response.ok;
  } catch (err) {
    // API server mungkin offline/simulasi, fallback aman
    console.info("Event disimpan offline/lokal (server sync mock):", err);
    return false;
  }
}

/**
 * Tambahkan event baru:
 * - Menyimpan langsung ke localStorage (offline resilience)
 * - Memicu sync asynchronous ke server
 */
export function addEvent(input: CreateEventInput): MissionEvent {
  const currentUser = getCurrentUserInfo();
  const event: MissionEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: input.type,
    userId: input.userId || currentUser.userId,
    username: input.username || currentUser.username,
    timestamp: Date.now(),
    missionId: input.missionId,
    missionName: input.missionName,
    completed: input.completed ?? true,
    details: input.details,
  };

  // 1. Simpan ke local
  saveEventLocally(event);

  // Tandai bahwa user aktif bermain/belajar di sesi ini
  if (
    [
      "quiz_completed",
      "game_started",
      "game_completed",
      "mission_completed",
    ].includes(event.type)
  ) {
    markHasPlayedSession();
  }

  // 2. Kirim ke server di latar belakang
  void syncEventToServer(event);

  return event;
}

/** Tarik data riwayat event dari server dengan fallback ke localStorage */
export async function fetchEventsFromServer(): Promise<MissionEvent[]> {
  const baseUrl = API_BASE_URL ? API_BASE_URL.replace(/\/api(\/v1)?\/?$/, "").replace(/\/+$/, "") : "";
  const url = `${baseUrl}/api/events`;
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(url, { headers });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Merge dengan event lokal
        return data;
      }
    }
  } catch {
    // fallback to local
  }
  return getRecentEvents();
}

/** Ekspor riwayat event ke file CSV */
export function exportEventsToCSV(events: MissionEvent[]): void {
  if (!events || events.length === 0) return;

  const headers = ["ID", "Waktu", "Tipe Event", "User ID", "Username", "Nama Misi", "Status", "Detail"];
  const rows = events.map((e) => {
    const timeStr = new Date(e.timestamp).toLocaleString("id-ID");
    const label = MISSION_EVENT_LABELS[e.type] || e.type;
    const detailStr = e.details ? JSON.stringify(e.details).replace(/"/g, '""') : "";
    const statusStr = e.completed === false ? "Gagal" : "Selesai/Berhasil";

    return [
      `"${e.id}"`,
      `"${timeStr}"`,
      `"${label}"`,
      `"${e.userId}"`,
      `"${e.username}"`,
      `"${e.missionName || "-"}"`,
      `"${statusStr}"`,
      `"${detailStr}"`,
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `tartila-riwayat-misi-${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
