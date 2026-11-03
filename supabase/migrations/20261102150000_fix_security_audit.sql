-- Fix temuan audit keamanan 2026-11-02 (temuan #5, #7-#9).
-- Catatan: Temuan #6 (tabel users) berada di database Go backend (Sambung Ngaji).
-- Semua policy di-DROP IF EXISTS lebih dahulu agar idempoten.
-- Perubahan skema HANYA lewat file migrasi ini (GUIDELINES Bab 10.2).

-- ============================================================================
-- #5 quiz_attempts: cabut policy permissif sisa migrasi leaderboard.
-- get_leaderboard_for_game tetap berfungsi karena SECURITY DEFINER.
-- ============================================================================
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leaderboard_read_policy ON public.quiz_attempts;
DROP POLICY IF EXISTS quiz_attempts_upsert_update_policy ON public.quiz_attempts;
DROP POLICY IF EXISTS quiz_attempts_upsert_policy ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_select_policy" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_insert_policy" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_update_policy" ON public.quiz_attempts;

CREATE POLICY "quiz_attempts_select_policy" ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING ((select auth.uid())::text = user_id);

CREATE POLICY "quiz_attempts_insert_policy" ON public.quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid())::text = user_id);

CREATE POLICY "quiz_attempts_update_policy" ON public.quiz_attempts
  FOR UPDATE TO authenticated
  USING ((select auth.uid())::text = user_id)
  WITH CHECK ((select auth.uid())::text = user_id);

-- ============================================================================
-- #7 room_questions: correct_answer tidak lagi dapat dibaca anon/authenticated.
-- Grant tabel-level SELECT harus dicabut; REVOKE per-kolom tidak cukup.
-- Jawaban hanya untuk host lewat RPC ber-guard.
-- ============================================================================
REVOKE SELECT ON public.room_questions FROM anon, authenticated;

GRANT SELECT (
  id,
  room_id,
  question_type,
  category,
  question_data,
  options,
  order_index,
  created_at
) ON public.room_questions TO anon, authenticated;

-- Opsi lama menyimpan kunci jawaban di options[].isCorrect; bersihkan.
UPDATE public.room_questions
SET options = (
  SELECT COALESCE(jsonb_agg(elem - 'isCorrect'), '[]'::jsonb)
  FROM jsonb_array_elements(options) AS elem
)
WHERE jsonb_typeof(options) = 'array'
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(options) AS elem
    WHERE elem ? 'isCorrect'
  );

CREATE OR REPLACE FUNCTION public.get_room_answers(p_room_id uuid)
RETURNS TABLE (question_id uuid, correct_answer text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT q.id, q.correct_answer
  FROM public.room_questions q
  JOIN public.rooms r ON r.id = q.room_id
  WHERE q.room_id = p_room_id
    AND r.host_id = auth.uid()::text
  ORDER BY q.order_index;
$$;

REVOKE ALL ON FUNCTION public.get_room_answers(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_room_answers(uuid) TO authenticated;

-- ============================================================================
-- #8 notifications dan friend_challenges: ganti FOR ALL USING (true)
-- dengan policy kepemilikan.
-- ============================================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;

CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "notifications_insert_own" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE TO authenticated
  USING (user_id = auth.uid()::text);

ALTER TABLE public.friend_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view friend challenges" ON public.friend_challenges;
DROP POLICY IF EXISTS "Users can manage friend challenges" ON public.friend_challenges;
DROP POLICY IF EXISTS "friend_challenges_select_participant" ON public.friend_challenges;
DROP POLICY IF EXISTS "friend_challenges_insert_challenger" ON public.friend_challenges;
DROP POLICY IF EXISTS "friend_challenges_update_participant" ON public.friend_challenges;
DROP POLICY IF EXISTS "friend_challenges_delete_challenger" ON public.friend_challenges;

CREATE POLICY "friend_challenges_select_participant" ON public.friend_challenges
  FOR SELECT TO authenticated
  USING (
    challenger_id = auth.uid()::text
    OR opponent_id = auth.uid()::text
  );

CREATE POLICY "friend_challenges_insert_challenger" ON public.friend_challenges
  FOR INSERT TO authenticated
  WITH CHECK (challenger_id = auth.uid()::text);

CREATE POLICY "friend_challenges_update_participant" ON public.friend_challenges
  FOR UPDATE TO authenticated
  USING (
    challenger_id = auth.uid()::text
    OR opponent_id = auth.uid()::text
  )
  WITH CHECK (
    challenger_id = auth.uid()::text
    OR opponent_id = auth.uid()::text
  );

CREATE POLICY "friend_challenges_delete_challenger" ON public.friend_challenges
  FOR DELETE TO authenticated
  USING (challenger_id = auth.uid()::text);

-- ============================================================================
-- #9 Storage audio-tilawati: anon hanya boleh membaca.
-- Upload/replace/delete tetap tersedia untuk authenticated (editor).
-- ============================================================================
DROP POLICY IF EXISTS "audio_tilawati_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "audio_tilawati_public_replace" ON storage.objects;
DROP POLICY IF EXISTS "audio_tilawati_public_delete" ON storage.objects;

DROP POLICY IF EXISTS "audio_tilawati_authenticated_upload" ON storage.objects;
CREATE POLICY "audio_tilawati_authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'audio-tilawati');

DROP POLICY IF EXISTS "audio_tilawati_authenticated_replace" ON storage.objects;
CREATE POLICY "audio_tilawati_authenticated_replace" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'audio-tilawati')
  WITH CHECK (bucket_id = 'audio-tilawati');

DROP POLICY IF EXISTS "audio_tilawati_authenticated_delete" ON storage.objects;
CREATE POLICY "audio_tilawati_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'audio-tilawati');
