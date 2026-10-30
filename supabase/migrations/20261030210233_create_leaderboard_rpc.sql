-- Global leaderboard: get_leaderboard_for_game RPC
-- HANYA query quiz_attempts. TIDAK ada JOIN ke users.
-- nickname disimpan langsung di quiz_attempts.
-- Fitur: UPSERT per (user_id, game_id) dan UNIQUE constraint.

-- 1. Buat tabel quiz_attempts jika belum ada
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT,
  game_id     TEXT NOT NULL,
  score       INTEGER NOT NULL DEFAULT 0,
  nickname    TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- 5. RLS Policies
CREATE POLICY IF NOT EXISTS leaderboard_read_policy
  ON quiz_attempts
  FOR SELECT
  TO anonymous
  USING (true);

CREATE POLICY IF NOT EXISTS quiz_attempts_upsert_policy
  ON quiz_attempts
  FOR INSERT
  TO anonymous
  WITH CHECK (game_id IS NOT NULL AND score IS NOT NULL AND nickname IS NOT NULL);

CREATE POLICY IF NOT EXISTS quiz_attempts_upsert_update_policy
  ON quiz_attempts
  FOR UPDATE
  TO anonymous
  USING (user_id IS NOT NULL);