-- Migration: Kencangkan RLS tabel panel ustadz.
-- Ganti policy "USING (true)" (buka ke publik) sebelumnya dengan
-- validasi berbasis pengguna (auth.uid()::text) sehingga hanya pemilik
-- / anggota yang terautentik yang bisa membaca, memasukkan, mengubah,
-- atau menghapus data.
--
-- Idempotent: policy lama dinonaktifkan (DROP IF EXISTS) lalu diganti
-- dengan policy baru, sehingga migrasi ini aman dijalankan berkali-kali
-- tanpa membuat duplikat.
--
-- Tabel yang dikamprai:
--   quizzes            (created_by)
--   quiz_questions     (akses via quizzes.created_by)
--   quiz_attempts      (user_id = auth.uid() untuk write; semua yang terautentik boleh read)
--   ustadz_room_game_tasks (assigned_by = auth.uid() untuk write; semua yang terautentik boleh read)
--   ustadz_rooms       (ustadz_id = auth.uid() — sudah ditegakkan oleh migrasi 20261028200000;
--                       bagian ini berlapis/tambahan pasti konsisten)

-- ===================== TABEL: quizzes =====================
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Lepas policy publik lama
DROP POLICY IF EXISTS "Public can view quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can manage quizzes" ON quizzes;

-- SELECT: semua pengguna terautentik boleh melihat kuis
CREATE POLICY "q_select_authenticated" ON quizzes
  FOR SELECT TO authenticated USING (true);

-- INSERT: hanya pemilik yang bisa membuat kuis
CREATE POLICY "q_insert_own" ON quizzes
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid()::text);

-- UPDATE: hanya pemilik yang bisa mengubah
CREATE POLICY "q_update_own" ON quizzes
  FOR UPDATE TO authenticated USING (created_by = auth.uid()::text);

-- DELETE: hanya pemilik yang bisa menghapus
CREATE POLICY "q_delete_own" ON quizzes
  FOR DELETE TO authenticated USING (created_by = auth.uid()::text);

-- ===================== TABEL: quiz_questions ====================
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Users can manage quiz questions" ON quiz_questions;

-- SELECT: semua terautentik boleh lihat soal
CREATE POLICY "qq_select_authenticated" ON quiz_questions
  FOR SELECT TO authenticated USING (true);

-- INSERT/UPDATE/DELETE: hanya pemilik quiz (quizzes.created_by) yang boleh
CREATE POLICY "qq_insert_own" ON quiz_questions
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
        AND quizzes.created_by = auth.uid()::text
    )
  );

CREATE POLICY "qq_update_own" ON quiz_questions
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
        AND quizzes.created_by = auth.uid()::text
    )
  );

CREATE POLICY "qq_delete_own" ON quiz_questions
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
        AND quizzes.created_by = auth.uid()::text
    )
  );

-- ================= TABEL: quiz_attempts ====================
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can manage quiz attempts" ON quiz_attempts;

-- SELECT: semua terautentik boleh lihat hasil kuis
CREATE POLICY "qa_select_authenticated" ON quiz_attempts
  FOR SELECT TO authenticated USING (true);

-- INSERT: hanya user yang bersangkutan yang boleh mencatat hasilnya
CREATE POLICY "qa_insert_own" ON quiz_attempts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);

-- UPDATE/DELETE: hanya pemilik attempt yang boleh
CREATE POLICY "qa_update_own" ON quiz_attempts
  FOR UPDATE TO authenticated USING (user_id = auth.uid()::text);

CREATE POLICY "qa_delete_own" ON quiz_attempts
  FOR DELETE TO authenticated USING (user_id = auth.uid()::text);

-- ============== TABEL: ustadz_room_game_tasks ==============
ALTER TABLE ustadz_room_game_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view ustadz room game tasks" ON ustadz_room_game_tasks;
DROP POLICY IF EXISTS "Users can manage ustadz room game tasks" ON ustadz_room_game_tasks;

-- SELECT: semua terautentik boleh lihat penugasan game
CREATE POLICY "urt_insert_authenticated" ON ustadz_room_game_tasks
  FOR SELECT TO authenticated USING (true);

-- INSERT/UPDATE/DELETE: hanya yang assigned_by (ustadz) yang boleh
CREATE POLICY "urt_insert_own" ON ustadz_room_game_tasks
  FOR INSERT TO authenticated WITH CHECK (assigned_by = auth.uid()::text);

CREATE POLICY "urt_update_own" ON ustadz_room_game_tasks
  FOR UPDATE TO authenticated USING (assigned_by = auth.uid()::text);

CREATE POLICY "urt_delete_own" ON ustadz_room_game_tasks
  FOR DELETE TO authenticated USING (assigned_by = auth.uid()::text);

-- ============== TABEL: ustadz_rooms (konsistensi) ==============
-- Policy di ustadz_rooms sudah ditegakkan oleh 20261028200000.
-- Bagian ini memastikan RLS tetap ENABLE dan tidak ada policy publik
-- yang tersisa selepas migrasi ini dijalankan berulang.

ALTER TABLE ustadz_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active ustadz rooms" ON ustadz_rooms;
DROP POLICY IF EXISTS "Users can manage ustadz rooms" ON ustadz_rooms;
DROP POLICY IF EXISTS "u_rooms_select_own" ON ustadz_rooms;
DROP POLICY IF EXISTS "u_rooms_insert_own" ON ustadz_rooms;
DROP POLICY IF EXISTS "u_rooms_update_own" ON ustadz_rooms;
DROP POLICY IF EXISTS "u_rooms_delete_own" ON ustadz_rooms;

CREATE POLICY "u_rooms_select_own" ON ustadz_rooms
  FOR SELECT TO authenticated USING (auth.uid()::text = ustadz_id);

CREATE POLICY "u_rooms_insert_own" ON ustadz_rooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = ustadz_id);

CREATE POLICY "u_rooms_update_own" ON ustadz_rooms
  FOR UPDATE TO authenticated USING (auth.uid()::text = ustadz_id);

CREATE POLICY "u_rooms_delete_own" ON ustadz_rooms
  FOR DELETE TO authenticated USING (auth.uid()::text = ustadz_id);
