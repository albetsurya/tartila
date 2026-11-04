// Admin event service with full CRUD & localStorage sync
import { ApiError, callREST } from "@/services/api";

export interface AdminEventMission {
  id: string;
  event_id?: string;
  title: string;
  action_type: string;
  target_amount: number;
  reward_coins: number;
  reward_tickets: number;
  reward_hearts: number;
}

export interface AdminEvent {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  missions: AdminEventMission[];
  created_at?: string;
}

export interface EventMissionPayload {
  title: string;
  action_type?: string;
  target_amount: number;
  reward_coins: number;
  reward_tickets: number;
  reward_hearts?: number;
}

export interface CreateEventPayload {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  missions: EventMissionPayload[];
}

export type EventStatus = "active" | "upcoming" | "completed";

export function getEventStatus(
  startDate: string,
  endDate: string,
  isActive = true,
): EventStatus {
  if (!isActive) return "completed";
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "active";
}

const STORAGE_KEY = "tartila_admin_events";

function getSeedEvents(): AdminEvent[] {
  const now = new Date();
  const startActive = new Date(now.getTime() - 3 * 86400000).toISOString().split("T")[0];
  const endActive = new Date(now.getTime() + 10 * 86400000).toISOString().split("T")[0];

  const startUpcoming = new Date(now.getTime() + 14 * 86400000).toISOString().split("T")[0];
  const endUpcoming = new Date(now.getTime() + 21 * 86400000).toISOString().split("T")[0];

  const startPast = new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0];
  const endPast = new Date(now.getTime() - 10 * 86400000).toISOString().split("T")[0];

  return [
    {
      id: "evt-ramadhan-1",
      name: "Semarak Ramadhan Mengaji",
      description: "Tingkatkan ibadah dan capaian mengaji di bulan suci bersama Tartila.",
      start_date: startActive,
      end_date: endActive,
      is_active: true,
      created_at: new Date(now.getTime() - 4 * 86400000).toISOString(),
      missions: [
        {
          id: "m-1",
          title: "Mainkan 5 Game Ceria",
          action_type: "PLAY_GAME",
          target_amount: 5,
          reward_coins: 50,
          reward_tickets: 2,
          reward_hearts: 1,
        },
        {
          id: "m-2",
          title: "Selesaikan 3 Kuis Tilawati",
          action_type: "FINISH_QUIZ",
          target_amount: 3,
          reward_coins: 30,
          reward_tickets: 1,
          reward_hearts: 0,
        },
      ],
    },
    {
      id: "evt-weekend-2",
      name: "Tantangan Akhir Pekan Ceria",
      description: "Kumpulkan skor tertinggi dan raih hadiah koin ekstra.",
      start_date: startUpcoming,
      end_date: endUpcoming,
      is_active: true,
      created_at: new Date(now.getTime() - 1 * 86400000).toISOString(),
      missions: [
        {
          id: "m-3",
          title: "Taklukkan Arena Harakat Slasher",
          action_type: "PLAY_GAME",
          target_amount: 3,
          reward_coins: 35,
          reward_tickets: 1,
          reward_hearts: 1,
        },
      ],
    },
    {
      id: "evt-perdana-3",
      name: "Pekan Tilawati Perdana",
      description: "Event pembukaan santri baru tahun ajaran Tartila.",
      start_date: startPast,
      end_date: endPast,
      is_active: false,
      created_at: new Date(now.getTime() - 35 * 86400000).toISOString(),
      missions: [
        {
          id: "m-4",
          title: "Selesaikan Latihan Huruf Hijaiyah",
          action_type: "PLAY_GAME",
          target_amount: 2,
          reward_coins: 20,
          reward_tickets: 0,
          reward_hearts: 1,
        },
      ],
    },
  ];
}

function readStoredEvents(): AdminEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = getSeedEvents();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return getSeedEvents();
  }
}

function writeStoredEvents(events: AdminEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // localStorage full or unavailable
  }
}

export async function fetchAdminEvents(): Promise<AdminEvent[]> {
  try {
    const result = await callREST<AdminEvent[]>("GET", "/api/admin/events");
    if (Array.isArray(result) && result.length > 0) {
      writeStoredEvents(result);
      return result;
    }
  } catch {
    // API not mounted or backend unavailable; fallback to localStorage
  }
  return readStoredEvents();
}

export async function createEvent(
  payload: CreateEventPayload,
): Promise<AdminEvent> {
  const localEvent: AdminEvent = {
    id: `evt-${Date.now()}`,
    name: payload.name.trim(),
    description: payload.description.trim(),
    start_date: payload.start_date,
    end_date: payload.end_date,
    is_active: true,
    created_at: new Date().toISOString(),
    missions: payload.missions.map((m, idx) => ({
      id: `m-${Date.now()}-${idx}`,
      title: m.title.trim(),
      action_type: m.action_type || "PLAY_GAME",
      target_amount: Number(m.target_amount) || 1,
      reward_coins: Number(m.reward_coins) || 0,
      reward_tickets: Number(m.reward_tickets) || 0,
      reward_hearts: Number(m.reward_hearts) || 0,
    })),
  };

  try {
    const serverResult = await callREST<AdminEvent>(
      "POST",
      "/api/admin/events",
      payload,
    );
    if (serverResult && serverResult.id) {
      const current = readStoredEvents();
      writeStoredEvents([serverResult, ...current.filter((e) => e.id !== serverResult.id)]);
      return serverResult;
    }
  } catch {
    // Fallback to local storage persistence
  }

  const current = readStoredEvents();
  const updated = [localEvent, ...current];
  writeStoredEvents(updated);
  return localEvent;
}

export async function updateEvent(
  id: string,
  payload: CreateEventPayload,
): Promise<AdminEvent> {
  const current = readStoredEvents();
  const existing = current.find((e) => e.id === id);

  const updatedItem: AdminEvent = {
    id,
    name: payload.name.trim(),
    description: payload.description.trim(),
    start_date: payload.start_date,
    end_date: payload.end_date,
    is_active: existing ? existing.is_active : true,
    created_at: existing?.created_at || new Date().toISOString(),
    missions: payload.missions.map((m, idx) => ({
      id: `m-${Date.now()}-${idx}`,
      title: m.title.trim(),
      action_type: m.action_type || "PLAY_GAME",
      target_amount: Number(m.target_amount) || 1,
      reward_coins: Number(m.reward_coins) || 0,
      reward_tickets: Number(m.reward_tickets) || 0,
      reward_hearts: Number(m.reward_hearts) || 0,
    })),
  };

  try {
    await callREST<AdminEvent>("PUT", `/api/admin/events/${encodeURIComponent(id)}`, payload);
  } catch {
    // Local fallback
  }

  const updatedList = current.map((e) => (e.id === id ? updatedItem : e));
  writeStoredEvents(updatedList);
  return updatedItem;
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await callREST<void>("DELETE", `/api/admin/events/${encodeURIComponent(id)}`);
  } catch {
    // Local fallback
  }

  const current = readStoredEvents();
  const filtered = current.filter((e) => e.id !== id);
  writeStoredEvents(filtered);
}

export function getEventErrorMessage(
  err: unknown,
  fallback = "Gagal memproses event. Coba lagi.",
): string {
  if (err instanceof ApiError) {
    if (err.statusCode === 401) {
      return "Sesi Anda telah berakhir. Silakan masuk kembali.";
    }
    if (err.statusCode === 403) {
      return "Anda tidak memiliki akses untuk tindakan ini.";
    }
    if (err.cancelled) return "Permintaan ke server timeout. Coba lagi.";
    return err.message || fallback;
  }
  return err instanceof Error ? err.message : fallback;
}
