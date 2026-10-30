-- Migration: Fix Audit Issues (CRITICAL + MEDIUM)
-- Fixes: C1, C2, C3, C5, C6, M5, M8, M9
-- Generated: 20261031000000

-- 1. C1 & M9: Tambah is_ready dan is_host ke room_players
--    Kolom ini wajib sebelum app call UPDATE room_players SET is_ready
ALTER TABLE public.room_players
  ADD COLUMN IF NOT EXISTS is_ready BOOLEAN DEFAULT false;

ALTER TABLE public.room_players
  ADD COLUMN IF NOT EXISTS is_host BOOLEAN DEFAULT false;

-- 2. C2: RLS ustadz_rooms — murid (participants) bisa lihat kelas yang mereka ikuti
--    (Policy lama dihapus, policy baru pakai EXISTS di ustadz_room_participants)
DROP POLICY IF EXISTS "u_rooms_select_member" ON public.ustadz_rooms;
CREATE POLICY "u_rooms_select_member" ON public.ustadz_rooms
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.ustadz_room_participants
      WHERE room_id = ustadz_rooms.id
        AND user_id = auth.uid()::text
    )
  );

-- 3. C3: Cabut akses anon ke quiz_attempts
--    Hanya authenticated yang boleh INSERT/UPDATE
DROP POLICY IF EXISTS "quiz_attempts_upsert_policy" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_upsert_policy" ON public.quiz_attempts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. C5: Bot simulator cleanup on beforeunload (sampingan: sessionStorage check)
--    (Kode JS tetap ditangani di useBotSimulator.ts)
--    (Kode JS tetap ditangani di RoomLobbyPage.tsx)

-- 5. C6 & M5: Perluas constraint question_type di room_questions
--   cek dulu, drop bila ada, buat baru
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'room_questions_question_type_check'
      AND conrelid = 'public.room_questions'::regclass
  ) THEN
    ALTER TABLE public.room_questions
      DROP CONSTRAINT room_questions_question_type_check;
  END IF;
END $$;

ALTER TABLE public.room_questions
  ADD CONSTRAINT room_questions_question_type_check
  CHECK (question_type IN ('text', 'audio', 'fill_blank', 'image', 'multiple_choice'));