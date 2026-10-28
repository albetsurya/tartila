-- Migration: Kencangkan RLS tabel classroom (ustadz_rooms & ustadz_room_participants).
-- Ganti policy "USING (true)" sebelumnya dengan validasi berbasis pengguna
-- (auth.uid()) sehingga hanya pemilik / anggota yang terautentik yang bisa
-- membaca, memasukkan, mengubah, atau menghapus data.
--
-- Idempoten: policy lama dinonaktifkan (DROP IF EXISTS) lalu diganti dengan
-- policy baru berbasis `auth.uid()::text`, sehingga migrasi ini aman dijalankan
-- berkali-kali tanpa membuat duplikat.

-- ================= TABEL: ustadz_rooms =================
ALTER TABLE ustadz_rooms ENABLE ROW LEVEL SECURITY;

-- Drop policy lama yang membuka akses publik (USING true)
DROP POLICY IF EXISTS "Public can view active ustadz rooms" ON ustadz_rooms;
DROP POLICY IF EXISTS "Users can manage ustadz rooms" ON ustadz_rooms;

-- Drop policy yang sudah di-kembalikan (idempoten)
DROP POLICY IF EXISTS "u_rooms_select_own" ON ustadz_rooms;
DROP POLICY IF EXISTS "u_rooms_insert_own" ON ustadz_rooms;
DROP POLICY IF EXISTS "u_rooms_update_own" ON ustadz_rooms;
DROP POLICY IF EXISTS "u_rooms_delete_own" ON ustadz_rooms;

-- SELECT: hanya pemilik room (ustadz) yang bisa melihat room mereka
CREATE POLICY "u_rooms_select_own" ON ustadz_rooms
  FOR SELECT
  USING (auth.uid()::text = ustadz_id);

-- INSERT: hanya user yang login yang bisa membuat room,
--       dengan ustadz_id otomatis = id pengguna yang login
CREATE POLICY "u_rooms_insert_own" ON ustadz_rooms
  FOR INSERT
  WITH CHECK (auth.uid()::text = ustadz_id);

-- UPDATE: hanya pemilik room yang bisa mengubah data
CREATE POLICY "u_rooms_update_own" ON ustadz_rooms
  FOR UPDATE
  USING (auth.uid()::text = ustadz_id);

-- DELETE: hanya pemilik room yang bisa menghapus room
CREATE POLICY "u_rooms_delete_own" ON ustadz_rooms
  FOR DELETE
  USING (auth.uid()::text = ustadz_id);

-- ================= TABEL: ustadz_room_participants =================
ALTER TABLE ustadz_room_participants ENABLE ROW LEVEL SECURITY;

-- Drop policy lama yang membuka akses publik / semua user
DROP POLICY IF EXISTS "Public can view ustadz room participants" ON ustadz_room_participants;
DROP POLICY IF EXISTS "Users can manage ustadz room participants" ON ustadz_room_participants;

-- Drop policy yang sudah di-kembalikan (idempoten)
DROP POLICY IF EXISTS "u_room_part_select_own" ON ustadz_room_participants;
DROP POLICY IF EXISTS "u_room_part_insert_own" ON ustadz_room_participants;
DROP POLICY IF EXISTS "u_room_part_update_own" ON ustadz_room_participants;
DROP POLICY IF EXISTS "u_room_part_delete_own" ON ustadz_room_participants;

-- SELECT: hanya anggota yang user_id-nya cocok dengan pengguna yang login
CREATE POLICY "u_room_part_select_own" ON ustadz_room_participants
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- INSERT: hanya user yang login yang bisa mendaftar ke room
CREATE POLICY "u_room_part_insert_own" ON ustadz_room_participants
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- UPDATE: hanya anggota yang login yang bisa mengubah role/status
CREATE POLICY "u_room_part_update_own" ON ustadz_room_participants
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- DELETE: hanya anggota yang login yang bisa menghapus diri sendiri
CREATE POLICY "u_room_part_delete_own" ON ustadz_room_participants
  FOR DELETE
  USING (auth.uid()::text = user_id);
