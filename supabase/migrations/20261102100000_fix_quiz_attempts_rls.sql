-- Migration: Fix RLS quiz_attempts (upsert butuh INSERT + UPDATE + SELECT untuk authenticated)
-- Gejala: POST /rest/v1/quiz_attempts?on_conflict=user_id,game_id gagal 42501
-- (new row violates row-level security policy).
-- Catatan penting: kolom user_id bertipe TEXT (bukan uuid), sehingga perbandingan
-- wajib memakai cast auth.uid()::text (pola sama dengan migrasi 20261031000000).

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Bersihkan policy lama agar tidak ada yang menimpa / konflik.
DROP POLICY IF EXISTS "Public can view quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can manage quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_upsert_policy" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_select_policy" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_insert_policy" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_update_policy" ON public.quiz_attempts;

-- SELECT: hanya baris milik sendiri.
CREATE POLICY "quiz_attempts_select_policy" ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING ((select auth.uid())::text = user_id);

-- INSERT: baris baru harus milik sendiri.
CREATE POLICY "quiz_attempts_insert_policy" ON public.quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid())::text = user_id);

-- UPDATE (terjadi saat upsert menabrak on_conflict=user_id,game_id):
-- baris yang diupdate harus milik sendiri, hasil update juga milik sendiri.
CREATE POLICY "quiz_attempts_update_policy" ON public.quiz_attempts
  FOR UPDATE TO authenticated
  USING ((select auth.uid())::text = user_id)
  WITH CHECK ((select auth.uid())::text = user_id);
