/**
 * Adapter fitur tambahan panel ustadz: penugasan game, fokus materi kelas,
 * dan aktivitas monitoring.
 *
 * KONTRAK API / BACKEND (belum tersedia di Supabase):
 *
 * 1) Penugasan game ke kelas:
 *    tabel `ustadz_room_game_tasks`
 *      (room_id uuid, game_id text, assigned_by text, assigned_at timestamptz,
 *       UNIQUE(room_id, game_id))
 *    GET    /rest/v1/ustadz_room_game_tasks?room_id=eq.<id>
 *    POST   { room_id, game_id, assigned_by }
 *    DELETE ?room_id=eq.<id>&game_id=eq.<gid>
 *
 * 2) Fokus materi kelas:
 *    kolom `ustadz_rooms.focus_materi` (teks JSON array MateriPokok)
 *    PATCH { focus_materi: ["hijaiyah", "harakat"] }
 *
 * 3) Aktivitas monitoring santri:
 *    tabel `ustadz_room_activity_log`
 *      (room_id uuid, user_id text, game_id text, played_at timestamptz)
 *    GET ?room_id=eq.<id>&order=played_at.desc&limit=20
 *
 * Sampai backend siap: localStorage (1 & 2) dan generator mock deterministik (3).
 */

import type { MateriPokok } from '@/data/learningCatalog';
import type { MateriReadRecord } from '@/data/monitoring';

export interface GameAssignment {
  roomId: string;
  gameId: string;
  assignedBy: string;
  assignedAt: string;
}

export interface ClassroomActivity {
  id: string;
  roomId: string;
  userId: string;
  gameId: string;
  playedAt: string;
}

function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

// ── Penugasan game ──────────────────────────────────────────────

const ASSIGNMENT_KEY = 'tartila_ustadz_game_tasks';

export async function listGameAssignments(
  roomId: string,
): Promise<GameAssignment[]> {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const parsed: unknown = JSON.parse(storage.getItem(ASSIGNMENT_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is GameAssignment =>
        typeof item === 'object' &&
        item !== null &&
        (item as GameAssignment).roomId === roomId &&
        typeof (item as GameAssignment).gameId === 'string',
    );
  } catch {
    return [];
  }
}

export async function assignGameToRoom(
  roomId: string,
  gameId: string,
  ustadzId: string,
): Promise<GameAssignment> {
  const storage = safeStorage();
  const existing = await listGameAssignments(roomId);
  const assignment: GameAssignment = {
    roomId,
    gameId,
    assignedBy: ustadzId,
    assignedAt: new Date().toISOString(),
  };
  if (storage && existing.every((item) => item.gameId !== gameId)) {
    storage.setItem(
      ASSIGNMENT_KEY,
      JSON.stringify([...existing, assignment]),
    );
  }
  return assignment;
}

export async function unassignGameFromRoom(
  roomId: string,
  gameId: string,
): Promise<void> {
  const storage = safeStorage();
  if (!storage) return;
  const existing = await listGameAssignments(roomId);
  storage.setItem(
    ASSIGNMENT_KEY,
    JSON.stringify(existing.filter((item) => item.gameId !== gameId)),
  );
}

// ── Fokus materi kelas ──────────────────────────────────────────

const FOCUS_KEY = 'tartila_ustadz_focus_materi';

export function getRoomFocusMateri(roomId: string): MateriPokok[] {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(`${FOCUS_KEY}:${roomId}`);
    const parsed: unknown = raw === null ? null : JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is MateriPokok => typeof item === 'string',
    );
  } catch {
    return [];
  }
}

export function setRoomFocusMateri(
  roomId: string,
  materi: readonly MateriPokok[],
): void {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(`${FOCUS_KEY}:${roomId}`, JSON.stringify(materi));
}

// ── Aktivitas monitoring (MOCK deterministik) ───────────────────

/** Generator angka pseudo-random deterministik dari seed. */
function seededRandom(seed: string): () => number {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) {
    state = (state * 31 + seed.charCodeAt(i)) >>> 0;
  }
  state = state === 0 ? 88675123 : state;
  return () => {
    state = (state * 1103515245 + 12345) >>> 0;
    return state / 4294967296;
  };
}

/**
 * MOCK: menghasilkan feed aktivitas yang stabil per (roomId, userId).
 * Nanti diganti query `ustadz_room_activity_log` sesuai kontrak di atas.
 */
export async function listClassroomActivities(
  roomId: string,
  userIds: readonly string[],
  limit = 20,
): Promise<ClassroomActivity[]> {
  if (userIds.length === 0) return [];
  const random = seededRandom(`${roomId}:${userIds.join(',')}`);
  const activities: ClassroomActivity[] = [];
  const total = Math.min(limit, 4 + Math.floor(random() * limit));
  for (let i = 0; i < total; i += 1) {
    const playedAt = Date.now() - (i + 1) * 36 * 60 * 60 * 1000 * (0.5 + random());
    activities.push({
      id: `${roomId}-${i}`,
      roomId,
      userId: userIds[Math.floor(random() * userIds.length)],
      gameId: ['hijaiyah-pop', 'tangkap-harakat', 'tajwid-tetris', 'tebak-ayat', 'makhraj-master'][i % 5],
      playedAt: new Date(playedAt).toISOString(),
    });
  }
  return activities;
}

// ── Progres baca materi (MOCK deterministik) ────────────────────

/**
 * MOCK: daftar santri yang sudah membuka tiap materi kurikulum.
 * Nanti diganti query tabel `ustadz_room_materi_reads`
 * (room_id uuid, user_id text, materi_id text, read_at timestamptz).
 */
export async function listMateriReadProgress(
  roomId: string,
  userIds: readonly string[],
  materiIds: readonly string[],
): Promise<MateriReadRecord[]> {
  if (userIds.length === 0 || materiIds.length === 0) return [];
  const random = seededRandom(`${roomId}:reads:${userIds.join(',')}`);
  const records: MateriReadRecord[] = [];
  for (const userId of userIds) {
    for (const materiId of materiIds) {
      if (random() > 0.55) {
        records.push({ userId, materiId });
      }
    }
  }
  return records;
}
