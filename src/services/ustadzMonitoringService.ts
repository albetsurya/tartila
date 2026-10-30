/**
 * Adapter fitur tambahan panel ustadz: penugasan game, fokus materi kelas,
 * dan aktivitas monitoring.
 *
 * Mode penyimpanan:
 * - Backend Supabase (tabel `ustadz_room_game_tasks`, `ustadz_room_focus`,
 *   `activity_logs`, `materi_reads` — lihat migrasi
 *   20261024120000_create_ustadz_panel_tables.sql) dipakai saat env
 *   VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY terpasang.
 * - Fallback localStorage + generator mock deterministik dipakai saat
 *   Supabase belum dikonfigurasi (dev baru / unit test / offline).
 */

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  getGameById,
  MATERI_LABELS,
  type MateriPokok,
} from '@/data/learningCatalog';
import { getClassroomDetail } from '@/services/classroomService';
import { listQuizzesForRoom } from '@/services/quizBankService';
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

interface GameTaskRow {
  room_id: string;
  game_id: string;
  assigned_by: string;
  assigned_at: string;
}

function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function toAssignment(row: GameTaskRow): GameAssignment {
  return {
    roomId: row.room_id,
    gameId: row.game_id,
    assignedBy: row.assigned_by,
    assignedAt: row.assigned_at,
  };
}

// ── Penugasan game ──────────────────────────────────────────────

const ASSIGNMENT_KEY = 'tartila_ustadz_game_tasks';

export async function listGameAssignments(
  roomId: string,
): Promise<GameAssignment[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('ustadz_room_game_tasks')
      .select('room_id, game_id, assigned_by, assigned_at')
      .eq('room_id', roomId)
      .order('assigned_at', { ascending: true });
    if (error || !data) return [];
    return (data as GameTaskRow[]).map(toAssignment);
  }
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
  const assignment: GameAssignment = {
    roomId,
    gameId,
    assignedBy: ustadzId,
    assignedAt: new Date().toISOString(),
  };
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('ustadz_room_game_tasks')
      .insert({ room_id: roomId, game_id: gameId, assigned_by: ustadzId });
    if (!error) return assignment;
    // Konflik unik (room_id, game_id): kelas sudah punya penugasan ini.
    if ((error as { code?: string }).code === '23505') return assignment;
  }
  const storage = safeStorage();
  const existing = await listGameAssignmentsFallback(roomId);
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
  if (isSupabaseConfigured) {
    await supabase
      .from('ustadz_room_game_tasks')
      .delete()
      .eq('room_id', roomId)
      .eq('game_id', gameId);
    return;
  }
  const storage = safeStorage();
  if (!storage) return;
  const existing = await listGameAssignmentsFallback(roomId);
  storage.setItem(
    ASSIGNMENT_KEY,
    JSON.stringify(existing.filter((item) => item.gameId !== gameId)),
  );
}

/** Sumber data fallback untuk mode localStorage. */
async function listGameAssignmentsFallback(
  roomId: string,
): Promise<GameAssignment[]> {
  if (isSupabaseConfigured) return [];
  return listGameAssignments(roomId);
}

// ── Fokus materi kelas ──────────────────────────────────────────

const FOCUS_KEY = 'tartila_ustadz_focus_materi';

export async function getRoomFocusMateri(
  roomId: string,
): Promise<MateriPokok[]> {
  if (isSupabaseConfigured) {
    const { data } = await supabase
      .from('ustadz_room_focus')
      .select('materi')
      .eq('room_id', roomId)
      .maybeSingle<{ materi: unknown }>();
    const parsed: unknown = data?.materi ?? null;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is MateriPokok => typeof item === 'string',
    );
  }
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

export async function setRoomFocusMateri(
  roomId: string,
  materi: readonly MateriPokok[],
): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase
      .from('ustadz_room_focus')
      .upsert(
        { room_id: roomId, materi: [...materi], updated_at: new Date().toISOString() },
        { onConflict: 'room_id' },
      );
    return;
  }
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(`${FOCUS_KEY}:${roomId}`, JSON.stringify(materi));
}

// ── Laporan santri (data nyata dari Supabase) ───────────────────

/** Status pedagogis santri — bukan status online/offline ala chat. */
export type StudentActivityStatus =
  | "rajin"
  | "hanya-quiz"
  | "butuh-perhatian";

export type StudentActivity = {
  userId: string;
  name: string;
  /** Label manusiawi, mis. "2 jam lalu". */
  lastActive: string;
  /** Jam sejak aktivitas terakhir, untuk perhitungan status. */
  lastActiveHours: number;
  /** Total latihan (baca materi + game). */
  practiceCount: number;
  /** Total kuis yang dikerjakan. */
  quizCount: number;
  status: StudentActivityStatus;
};

/** Aksi kontekstual untuk guru, ditampilkan sebagai kartu alert dashboard. */
export interface TeacherAlert {
  id: string;
  kind: "kuis-belum-dikerjakan" | "kurang-latihan" | "apresiasi";
  title: string;
  actionLabel: "Lihat" | "Beri Tugas" | "Beri Apresiasi";
}

export const STUDENT_STATUS_LABELS: Readonly<
  Record<StudentActivityStatus, string>
> = {
  rajin: "Rajin",
  "hanya-quiz": "Hanya Kuis",
  "butuh-perhatian": "Butuh Perhatian",
};

/** GOLDEN RULE status: >72 jam hening = perlu perhatian; 0–1 latihan = hanya kuis. */
export function studentActivityStatus(input: {
  lastActiveHours: number;
  practiceCount: number;
  quizCount: number;
}): StudentActivityStatus {
  if (input.lastActiveHours > 72) return "butuh-perhatian";
  if (input.practiceCount <= 1) return "hanya-quiz";
  return "rajin";
}

function activityLabel(hours: number): string {
  if (!Number.isFinite(hours)) return "Belum ada";
  if (hours < 1) return "Baru saja";
  if (hours < 24) return `${Math.round(hours)} jam lalu`;
  return `${Math.round(hours / 24)} hari lalu`;
}

interface FactRow {
  user_id: string;
  ts: string;
}

interface ActivityFactRow {
  user_id: string;
  played_at: string;
}

interface ReadFactRow {
  user_id: string;
  read_at: string;
}

interface AttemptFactRow {
  user_id: string;
  submitted_at: string;
}

/** Kumpulkan fakta mentah per santri dari tiga tabel nyata. */
async function fetchStudentFacts(
  roomId: string,
  userIds: readonly string[],
): Promise<{
  activities: FactRow[];
  reads: FactRow[];
  attempts: FactRow[];
}> {
  const [activityRes, readRes, roomQuizzes] = await Promise.all([
    supabase
      .from('activity_logs')
      .select('user_id, played_at')
      .eq('room_id', roomId)
      .in('user_id', [...userIds]),
    supabase
      .from('materi_reads')
      .select('user_id, read_at')
      .eq('room_id', roomId)
      .in('user_id', [...userIds]),
    listQuizzesForRoom(roomId),
  ]);

  const quizIds = roomQuizzes.map((quiz) => quiz.id);
  let attempts: FactRow[] = [];
  if (quizIds.length > 0) {
    const { data } = await supabase
      .from('quiz_attempts')
      .select('user_id, submitted_at')
      .in('quiz_id', quizIds)
      .in('user_id', [...userIds]);
    attempts = ((data ?? []) as AttemptFactRow[]).map((row) => ({
      user_id: row.user_id,
      ts: row.submitted_at,
    }));
  }

  return {
    activities: ((activityRes.data ?? []) as ActivityFactRow[]).map((row) => ({
      user_id: row.user_id,
      ts: row.played_at,
    })),
    reads: ((readRes.data ?? []) as ReadFactRow[]).map((row) => ({
      user_id: row.user_id,
      ts: row.read_at,
    })),
    attempts,
  };
}

/**
 * Profil aktivitas pedagogis tiap santri per kelas dari data nyata:
 * activity_logs (game), materi_reads (baca), quiz_attempts (kuis).
 * Tanpa satu pun data nyata -> array kosong (JANGAN diisi data palsu).
 */
export async function listStudentActivities(
  roomId: string,
): Promise<StudentActivity[]> {
  if (!isSupabaseConfigured) return [];

  const detail = await getClassroomDetail(roomId);
  if (!detail.ok) return [];
  const murid = detail.data.participants.filter(
    (member) => member.roleInRoom === 'murid',
  );
  const muridIds = murid.map((member) => member.userId);
  if (muridIds.length === 0) return [];

  const facts = await fetchStudentFacts(roomId, muridIds);
  if (
    facts.activities.length === 0 &&
    facts.reads.length === 0 &&
    facts.attempts.length === 0
  ) {
    return [];
  }

  const now = Date.now();

  return murid.map((member) => {
    const practiceRows = [
      ...facts.activities.filter((row) => row.user_id === member.userId),
      ...facts.reads.filter((row) => row.user_id === member.userId),
    ];
    const attemptRows = facts.attempts.filter(
      (row) => row.user_id === member.userId,
    );

    const times = [...practiceRows, ...attemptRows]
      .map((row) => Date.parse(row.ts))
      .filter((ts) => !Number.isNaN(ts));
    const lastActiveHours =
      times.length === 0
        ? Number.POSITIVE_INFINITY
        : Math.max(0, (now - Math.max(...times)) / 3_600_000);

    return {
      userId: member.userId,
      name: member.name || member.username || "Santri",
      lastActive: activityLabel(lastActiveHours),
      lastActiveHours,
      practiceCount: practiceRows.length,
      quizCount: attemptRows.length,
      status: studentActivityStatus({
        lastActiveHours,
        practiceCount: practiceRows.length,
        quizCount: attemptRows.length,
      }),
    };
  });
}

/** Riwayat aktivitas minggu ini untuk satu santri (modal detail). */
export interface StudentWeekLog {
  /** Nama hari, mis. "Senin". */
  day: string;
  activity: string;
}

interface GameLogRow {
  played_at: string;
  game_id: string;
}

interface ReadLogRow {
  read_at: string;
  materi_id: string;
}

interface AttemptLogRow {
  quiz_id: string;
  submitted_at: string;
}

export async function listStudentWeekActivity(
  roomId: string,
  userId: string,
): Promise<StudentWeekLog[]> {
  if (!isSupabaseConfigured || !userId) return [];
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const logs: { ts: number; activity: string }[] = [];

  const [activityRes, readRes, roomQuizzes] = await Promise.all([
    supabase
      .from('activity_logs')
      .select('played_at, game_id')
      .eq('room_id', roomId)
      .eq('user_id', userId),
    supabase
      .from('materi_reads')
      .select('read_at, materi_id')
      .eq('room_id', roomId)
      .eq('user_id', userId),
    listQuizzesForRoom(roomId),
  ]);

  const quizzes = new Map(roomQuizzes.map((quiz) => [quiz.id, quiz]));
  let attemptRes: { data: unknown } = { data: null };
  if (quizzes.size > 0) {
    attemptRes = await supabase
      .from('quiz_attempts')
      .select('quiz_id, submitted_at')
      .eq('user_id', userId)
      .in('quiz_id', [...quizzes.keys()]);
  }

  ((activityRes.data ?? []) as GameLogRow[]).forEach((row) => {
    const ts = Date.parse(row.played_at);
    if (Number.isNaN(ts) || ts < weekAgo) return;
    logs.push({
      ts,
      activity: `Latihan · ${getGameById(row.game_id)?.title ?? row.game_id}`,
    });
  });

  ((readRes.data ?? []) as ReadLogRow[]).forEach((row) => {
    const ts = Date.parse(row.read_at);
    if (Number.isNaN(ts) || ts < weekAgo) return;
    logs.push({
      ts,
      activity: `Baca Materi · ${MATERI_LABELS[row.materi_id as MateriPokok] ?? row.materi_id}`,
    });
  });

  ((attemptRes.data ?? []) as AttemptLogRow[]).forEach((row) => {
    const ts = Date.parse(row.submitted_at);
    if (Number.isNaN(ts) || ts < weekAgo) return;
    logs.push({
      ts,
      activity: `Kuis · ${quizzes.get(row.quiz_id)?.title ?? "Kuis"}`,
    });
  });

  return logs
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 20)
    .map((log) => ({
      day: new Date(log.ts).toLocaleDateString("id-ID", { weekday: "long" }),
      activity: log.activity,
    }));
}

/** MOCK: alert aksi guru hari ini, diturunkan dari profil aktivitas santri. */
export async function listTodayAlerts(
  roomId: string,
): Promise<TeacherAlert[]> {
  const students = await listStudentActivities(roomId);
  if (students.length === 0) return [];

  const notDoneQuiz = students.filter((student) => student.quizCount === 0);
  const quizOnly = students.filter(
    (student) => student.status === "hanya-quiz",
  );
  const champion = [...students]
    .filter((student) => student.status === "rajin")
    .sort((a, b) => b.practiceCount - a.practiceCount)[0];

  const alerts: TeacherAlert[] = [];
  if (notDoneQuiz.length > 0) {
    alerts.push({
      id: "quiz-pending",
      kind: "kuis-belum-dikerjakan",
      title: `${notDoneQuiz.length} santri belum mengerjakan kuis kelas ini.`,
      actionLabel: "Lihat",
    });
  }
  if (quizOnly.length > 0) {
    alerts.push({
      id: "quiz-only",
      kind: "kurang-latihan",
      title: `${quizOnly.length} santri hanya kerjakan kuis, belum pernah buka latihan/game.`,
      actionLabel: "Beri Tugas",
    });
  }
  if (champion) {
    alerts.push({
      id: "apresiasi",
      kind: "apresiasi",
      title: `Selamat! ${champion.name} paling sering berlatih minggu ini.`,
      actionLabel: "Beri Apresiasi",
    });
  }
  return alerts;
}

// ── Aktivitas monitoring ────────────────────────────────────────

interface ActivityRow {
  id: string;
  room_id: string;
  user_id: string;
  game_id: string;
  played_at: string;
}

function toActivity(row: ActivityRow): ClassroomActivity {
  return {
    id: row.id,
    roomId: row.room_id,
    userId: row.user_id,
    gameId: row.game_id,
    playedAt: row.played_at,
  };
}

/**
 * Mode Supabase: baca tabel `activity_logs`.
 * Fallback: generator mock deterministik agar feed stabil per (roomId, userId).
 */
export async function listClassroomActivities(
  roomId: string,
  userIds: readonly string[],
  limit = 20,
): Promise<ClassroomActivity[]> {
  if (userIds.length === 0) return [];
  if (isSupabaseConfigured) {
    const { data } = await supabase
      .from('activity_logs')
      .select('id, room_id, user_id, game_id, played_at')
      .eq('room_id', roomId)
      .order('played_at', { ascending: false })
      .limit(limit);
    if (!data) return [];
    return (data as ActivityRow[]).map(toActivity);
  }
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

// ── Progres baca materi ─────────────────────────────────────────

interface MateriReadRow {
  user_id: string;
  materi_id: string;
}

/**
 * Mode Supabase: baca tabel `materi_reads` untuk daftar santri & materi.
 * Fallback: mock deterministik (akses acak stabil dari seed).
 */
export async function listMateriReadProgress(
  roomId: string,
  userIds: readonly string[],
  materiIds: readonly string[],
): Promise<MateriReadRecord[]> {
  if (userIds.length === 0 || materiIds.length === 0) return [];
  if (isSupabaseConfigured) {
    const { data } = await supabase
      .from('materi_reads')
      .select('user_id, materi_id')
      .eq('room_id', roomId)
      .in('user_id', [...userIds])
      .in('materi_id', [...materiIds]);
    if (!data) return [];
    return (data as MateriReadRow[]).map((row) => ({
      userId: row.user_id,
      materiId: row.materi_id,
    }));
  }
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
