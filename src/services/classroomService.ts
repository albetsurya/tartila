/**
 * Classroom service — lapisan data fitur Ustadz/Ustadzah.
 *
 * Semua tabel: ustadz_rooms, ustadz_room_participants, users.
 * Catatan keamanan: pemeriksaan peran/batas di sini hanya untuk UX; RLS dan
 * validasi otorisasi WAJIB ditegakkan di backend Supabase juga.
 */

import { supabase } from '@/lib/supabase';
import { classroomRoleFor } from '@/lib/roles';
import {
  JOIN_CODE_LENGTH,
  generateJoinCode,
  normalizeJoinCode,
} from '@/lib/joinCode';

export { generateJoinCode, normalizeJoinCode } from '@/lib/joinCode';
export { JOIN_CODE_LENGTH };

export type ClassroomRoomRole = 'ustadz' | 'murid' | 'viewer';

export interface ClassroomRoom {
  id: string;
  ustadzId: string;
  name: string;
  description: string | null;
  targetJilid: number;
  joinCode: string;
  hasPassword: boolean;
  maxParticipants: number;
  isActive: boolean;
  archived: boolean;
  createdAt: string;
  participantCount: number;
  duelEnabled: boolean;
  /** Terisi oleh listJoinedClassrooms (nama pengajar kelas). */
  ustadzName?: string | null;
}

export interface ClassroomParticipant {
  id: string;
  userId: string;
  roleInRoom: ClassroomRoomRole;
  name: string | null;
  username: string | null;
  level: number;
  joinedAt: string;
}

export interface CreateClassroomInput {
  ustadzId: string;
  name: string;
  description?: string | null;
  targetJilid?: number;
  password?: string | null;
  maxParticipants: number;
}

export interface JoinClassroomInput {
  joinCode: string;
  userId: string | null | undefined;
  userRole: string | null | undefined;
  password?: string;
}

export interface UpdateClassroomInput {
  name?: string;
  description?: string | null;
  targetJilid?: number;
  maxParticipants?: number;
}

export type ClassroomErrorCode =
  | 'not-authenticated'
  | 'forbidden'
  | 'limit-reached'
  | 'room-full'
  | 'not-found'
  | 'wrong-password'
  | 'already-member'
  | 'conflict'
  | 'network';

export type ClassroomResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: ClassroomErrorCode; message: string };

function fail<T>(code: ClassroomErrorCode, message: string): ClassroomResult<T> {
  return { ok: false, code, message };
}

function ok<T>(data: T): ClassroomResult<T> {
  return { ok: true, data };
}

/** Password kelas di-hash bcrypt di database, jadi hash tak pernah dibaca
 *  ke browser. Fungsi ini hasilkan hash lewat RPC SECURITY DEFINER. */
export async function setRoomPassword(roomId: string, password: string): Promise<boolean> {
  const { error } = await supabase.rpc('set_room_password', {
    p_room_id: roomId,
    p_password: password,
  });
  return !error;
}

/** Verifikasi password kelas di database. Kelas tanpa password selalu lolos. */
export async function verifyRoomPassword(
  joinCode: string,
  password: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('verify_room_password', {
    p_join_code: joinCode,
    p_password: password,
  });
  if (error) return false;
  return data === true;
}

interface RoomRow {
  id: string;
  ustadz_id: string;
  name: string;
  description: string | null;
  target_jilid: number | null;
  join_code: string;
  has_password: boolean | null;
  max_participants: number | null;
  is_active: boolean | null;
  archived: boolean | null;
  created_at: string | null;
  duel_enabled: boolean | null;
  ustadz_room_participants?: Array<{ count: number }>;
}

function toRoom(row: RoomRow): ClassroomRoom {
  const counts = row.ustadz_room_participants ?? [];
  return {
    id: row.id,
    ustadzId: row.ustadz_id,
    name: row.name,
    description: row.description,
    targetJilid: row.target_jilid ?? 1,
    joinCode: row.join_code,
    hasPassword: row.has_password ?? false,
    maxParticipants: row.max_participants ?? 10,
    isActive: row.is_active ?? true,
    archived: row.archived ?? false,
    createdAt: row.created_at ?? new Date(0).toISOString(),
    participantCount: counts.length > 0 ? (counts[0].count ?? 0) : 0,
    duelEnabled: row.duel_enabled ?? true,
  };
}

const ROOM_COLUMNS =
  'id, ustadz_id, name, description, target_jilid, join_code, has_password, max_participants, is_active, archived, created_at, duel_enabled';

function mapDbError(error: { code?: string; message?: string }): ClassroomErrorCode {
  if (error.code === '23505') return 'conflict';
  if (error.code === '42501') return 'forbidden';
  return 'network';
}

/** Buat kelas baru untuk ustadz. Coba beberapa kode join bila bentrok UNIQUE. */
export async function createClassroom(
  input: CreateClassroomInput,
): Promise<ClassroomResult<ClassroomRoom>> {
  if (!input.ustadzId) return fail('not-authenticated', 'Anda belum masuk.');

  const name = input.name.trim();
  if (name.length === 0) {
    return fail('conflict', 'Nama kelas tidak boleh kosong.');
  }

  const targetJilid = Math.min(Math.max(input.targetJilid ?? 1, 1), 5);

  let lastError = 'Gagal membuat kelas.';
  const wantsPassword = Boolean(input.password && input.password.length > 0);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabase
      .from('ustadz_rooms')
      .insert({
        ustadz_id: input.ustadzId,
        name,
        description: input.description ?? null,
        target_jilid: targetJilid,
        join_code: generateJoinCode(),
        max_participants: input.maxParticipants,
        is_active: true,
        archived: false,
      })
      .select<string, RoomRow>(ROOM_COLUMNS)
      .single();

    if (error) {
      if (error.code === '23505') {
        lastError = 'Kode join bentrok, mencoba lagi…';
        continue;
      }
      return fail(mapDbError(error), error.message || lastError);
    }

    const { error: participantError } = await supabase
      .from('ustadz_room_participants')
      .insert({
        room_id: data.id,
        user_id: input.ustadzId,
        role_in_room: 'ustadz' satisfies ClassroomRoomRole,
        joined_at: new Date().toISOString(),
      });

    if (participantError) {
      return fail(mapDbError(participantError), participantError.message);
    }

    if (wantsPassword) {
      // Hash dibuat di DB. Kegagalan di sini menyisakan kelas tanpa password;
      // pemilik kelas bisa simpan ulang password lewat tombol edit.
      await setRoomPassword(data.id, input.password as string);
    }

    return ok(toRoom(data));
  }

  return fail('conflict', lastError);
}

/** Daftar kelas milik seorang ustadz (termasuk yang diarsip). */
export async function listOwnedClassrooms(
  ustadzId: string | null | undefined,
): Promise<ClassroomResult<ClassroomRoom[]>> {
  if (!ustadzId) return fail('not-authenticated', 'Anda belum masuk.');

  const { data, error } = await supabase
    .from('ustadz_rooms')
    .select<string, RoomRow>(`${ROOM_COLUMNS}, ustadz_room_participants(count)`)
    .eq('ustadz_id', ustadzId)
    .order('created_at', { ascending: false });

  if (error) return fail(mapDbError(error), error.message);
  return ok((data ?? []).map(toRoom));
}

/** Daftar kelas tempat murid tergabung. */
export async function listJoinedClassrooms(
  userId: string | null | undefined,
): Promise<ClassroomResult<ClassroomRoom[]>> {
  if (!userId) return fail('not-authenticated', 'Anda belum masuk.');

  const { data: memberRows, error: memberError } = await supabase
    .from('ustadz_room_participants')
    .select('room_id')
    .eq('user_id', userId);

  if (memberError) return fail(mapDbError(memberError), memberError.message);

  const roomIds = [...new Set((memberRows ?? []).map((row) => row.room_id))];
  if (roomIds.length === 0) return ok([]);

  const { data: roomRows, error: roomError } = await supabase
    .from('ustadz_rooms')
    .select<string, RoomRow>(`${ROOM_COLUMNS}, ustadz_room_participants(count)`)
    .in('id', roomIds)
    .eq('archived', false)
    .order('created_at', { ascending: false });

  if (roomError) return fail(mapDbError(roomError), roomError.message);

  const rooms = (roomRows ?? []).map(toRoom);

  const ustadzIds = [...new Set(rooms.map((room) => room.ustadzId))];
  const ustadzNames = new Map<string, string>();
  if (ustadzIds.length > 0) {
    const { data: ustadzRows, error: ustadzError } = await supabase
      .from('users')
      .select('id, name, username')
      .in('id', ustadzIds);
    if (!ustadzError) {
      for (const row of ustadzRows ?? []) {
        ustadzNames.set(row.id, row.name || row.username || row.id);
      }
    }
  }

  return ok(
    rooms.map((room) => ({ ...room, ustadzName: ustadzNames.get(room.ustadzId) ?? null })),
  );
}

interface ParticipantRow {
  id: string;
  user_id: string;
  role_in_room: string;
  joined_at: string | null;
}

/** Detail kelas + anggota beserta nama/level dari tabel users. */
export async function getClassroomDetail(
  roomId: string,
): Promise<
  ClassroomResult<{ room: ClassroomRoom; participants: ClassroomParticipant[] }>
> {
  const { data: roomRow, error: roomError } = await supabase
    .from('ustadz_rooms')
    .select<string, RoomRow>(`${ROOM_COLUMNS}, ustadz_room_participants(count)`)
    .eq('id', roomId)
    .single();

  if (roomError || !roomRow) {
    return fail('not-found', 'Kelas tidak ditemukan.');
  }

  const { data: participantRows, error: participantError } = await supabase
    .from('ustadz_room_participants')
    .select('id, user_id, role_in_room, joined_at')
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true });

  if (participantError) {
    return fail(mapDbError(participantError), participantError.message);
  }

  const rows = participantRows ?? [];
  const userIds = [...new Set(rows.map((row: ParticipantRow) => row.user_id))];

  type UserRow = { id: string; name: string | null; username: string | null; level: number | null };
  const profiles = new Map<string, UserRow>();
  if (userIds.length > 0) {
    const { data: userRows, error: userError } = await supabase
      .from('users')
      .select('id, name, username, level')
      .in('id', userIds);
    if (!userError) {
      for (const row of userRows ?? []) {
        profiles.set(row.id, row);
      }
    }
  }

  const participants: ClassroomParticipant[] = rows.map(
    (row: ParticipantRow) => {
      const profile = profiles.get(row.user_id);
      return {
        id: row.id,
        userId: row.user_id,
        roleInRoom:
          row.role_in_room === 'ustadz' ? ('ustadz' satisfies ClassroomRoomRole) : ('murid' satisfies ClassroomRoomRole),
        name: profile?.name ?? null,
        username: profile?.username ?? null,
        level: profile?.level ?? 1,
        joinedAt: row.joined_at ?? new Date(0).toISOString(),
      };
    },
  );

  return ok({ room: toRoom(roomRow), participants });
}

/** Bergabung ke kelas lewat kode join (murid atau co-ustadz). */
export async function joinClassroomByCode(
  input: JoinClassroomInput,
): Promise<ClassroomResult<ClassroomRoom>> {
  if (!input.userId) return fail('not-authenticated', 'Anda belum masuk.');

  const joinCode = normalizeJoinCode(input.joinCode);
  if (joinCode.length !== JOIN_CODE_LENGTH) {
    return fail('not-found', 'Kode join harus 6 karakter huruf/angka.');
  }

  const classroomRole = classroomRoleFor(input.userRole);
  if (classroomRole === null) {
    return fail('forbidden', 'Tamu tidak bisa bergabung ke kelas. Silakan masuk dulu.');
  }

  const { data: roomRow, error: roomError } = await supabase
    .from('ustadz_rooms')
    .select<string, RoomRow>(`${ROOM_COLUMNS}, ustadz_room_participants(count)`)
    .ilike('join_code', joinCode)
    .eq('is_active', true)
    .eq('archived', false)
    .maybeSingle();

  if (roomError) return fail(mapDbError(roomError), roomError.message);
  if (!roomRow) return fail('not-found', 'Kode join tidak ditemukan.');

  if (!(await verifyRoomPassword(joinCode, input.password ?? ''))) {
    return fail('wrong-password', 'Password kelas salah.');
  }

  const room = toRoom(roomRow);
  const isMonitor = classroomRole === 'monitor';
  const alreadyFull = room.participantCount >= room.maxParticipants;
  if (!isMonitor && alreadyFull) {
    return fail('room-full', 'Kelas sudah penuh.');
  }

  const roleInRoom: ClassroomRoomRole = isMonitor ? 'viewer' : 'murid';

  const { error: insertError } = await supabase
    .from('ustadz_room_participants')
    .insert({
      room_id: room.id,
      user_id: input.userId,
      role_in_room: roleInRoom satisfies ClassroomRoomRole,
      joined_at: new Date().toISOString(),
    });

  if (insertError) {
    if (insertError.code === '23505') {
      return ok(room);
    }
    return fail(mapDbError(insertError), insertError.message);
  }

  return ok(room);
}

/** Keluar dari kelas. */
export async function leaveClassroom(
  roomId: string,
  userId: string | null | undefined,
): Promise<ClassroomResult<{ left: boolean }>> {
  if (!userId) return fail('not-authenticated', 'Anda belum masuk.');

  const { error } = await supabase
    .from('ustadz_room_participants')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);

  if (error) return fail(mapDbError(error), error.message);
  return ok({ left: true });
}

/** Arsipkan kelas (milik ustadz itu sendiri). */
export async function archiveClassroom(
  roomId: string,
  ustadzId: string | null | undefined,
): Promise<ClassroomResult<{ archived: boolean }>> {
  if (!ustadzId) return fail('not-authenticated', 'Anda belum masuk.');

  const { error } = await supabase
    .from('ustadz_rooms')
    .update({ archived: true, is_active: false, updated_at: new Date().toISOString() })
    .eq('id', roomId)
    .eq('ustadz_id', ustadzId);

  if (error) return fail(mapDbError(error), error.message);
  return ok({ archived: true });
}

/** Perbarui detail kelas (nama, deskripsi, jilid target, batas peserta). */
export async function updateClassroom(
  roomId: string,
  ustadzId: string | null | undefined,
  patch: UpdateClassroomInput,
): Promise<ClassroomResult<ClassroomRoom>> {
  if (!ustadzId) return fail('not-authenticated', 'Anda belum masuk.');

  const update: Record<string, string | number | null> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.name !== undefined && patch.name.trim().length > 0) {
    update.name = patch.name.trim();
  }
  if (patch.description !== undefined) {
    update.description = patch.description;
  }
  if (patch.targetJilid !== undefined) {
    update.target_jilid = Math.min(Math.max(patch.targetJilid, 1), 5);
  }
  if (patch.maxParticipants !== undefined) {
    update.max_participants = Math.max(patch.maxParticipants, 1);
  }

  const { data, error } = await supabase
    .from('ustadz_rooms')
    .update(update)
    .eq('id', roomId)
    .eq('ustadz_id', ustadzId)
    .select<string, RoomRow>(`${ROOM_COLUMNS}, ustadz_room_participants(count)`)
    .single();

  if (error) return fail(mapDbError(error), error.message);
  if (!data) return fail('not-found', 'Kelas tidak ditemukan.');
  return ok(toRoom(data));
}
