-- Global leaderboard: get_leaderboard_for_game RPC
-- HANYA query quiz_attempts. TIDAK ada JOIN ke users.
-- Tabel quiz_attempts SUDAH ADA di migrasi sebelumnya.
-- Tambahkan kolom yang butuhkan untuk leaderboard fitur baru.

-- 1. Tambah kolom game_id, nickname, created_at, updated_at jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'game_id'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN game_id TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'nickname'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN nickname TEXT NOT NULL DEFAULT 'Santri';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- 2. Index performa
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id    ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_game_id    ON quiz_attempts(game_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at ON quiz_attempts(created_at);

-- 3. Constraint unik: 1 user hanya 1 baris skor per game
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_user_game'
      AND conrelid = 'quiz_attempts'::regclass
  ) THEN
    ALTER TABLE quiz_attempts
    ADD CONSTRAINT unique_user_game UNIQUE (user_id, game_id);
  END IF;
END $$;

-- 4. RPC leaderboard (tanpa JOIN users)
CREATE OR REPLACE FUNCTION get_leaderboard_for_game(
  p_game_id text,
  p_period text DEFAULT 'weekly',
  p_limit int DEFAULT 50
)
RETURNS TABLE (
  user_id   text,
  nickname  text,
  score     integer,
  game_id   text,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.user_id,
    a.nickname,
    a.score,
    a.game_id,
    a.updated_at
  FROM quiz_attempts a
  WHERE a.game_id = p_game_id
    AND (
      p_period = 'daily' AND a.created_at >= (now() - interval '1 day')
      OR p_period = 'weekly' AND a.created_at >= (now() - interval '7 days')
      OR p_period = 'all'
    )
  ORDER BY a.score DESC
  LIMIT p_limit;
$$;

-- 5. RLS: everyone bisa baca leaderboard
-- NOTE: get_leaderboard_for_game dijalankan dengan SECURITY DEFINER,
--       jadi RLS policy tidak akan diblokir. Policy read ini hanyalah
--       fallback jika RPC dipanggil tanpa definer.
DROP POLICY IF EXISTS leaderboard_read_policy_old ON quiz_attempts;
CREATE POLICY leaderboard_read_policy
  ON quiz_attempts
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- 6. RLS: authenticated + anonymous bisa insert/upsert skor
-- NOTE: Untuk prod, sebaiknya pakai authenticated role, bukan anonymous.
--       anonymous hanya untuk testing dev lokal.
DROP POLICY IF EXISTS quiz_attempts_upsert_policy_old ON quiz_attempts;
CREATE POLICY quiz_attempts_upsert_policy
  ON quiz_attempts
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (game_id IS NOT NULL AND score IS NOT NULL AND nickname IS NOT NULL);

DROP POLICY IF EXISTS quiz_attempts_upsert_update_policy_old ON quiz_attempts;
CREATE POLICY quiz_attempts_upsert_update_policy
  ON quiz_attempts
  FOR UPDATE
  TO authenticated, anon
  USING (user_id IS NOT NULL);