-- Global leaderboard: get_leaderboard_for_game RPC
-- dipanggil dari frontend via fetchGlobalLeaderboard() (ngajiCeriaApi.ts)
-- SECURITY DEFINER: dijalankan sebagai superuser sehingga anon key tetap
-- bisa membaca data (pastikan RLS sesuai kebijakan tabel).
CREATE OR REPLACE FUNCTION get_leaderboard_for_game(
  p_game_id text,
  p_period text,
  p_limit int
)
RETURNS TABLE (
  user_id   text,
  nickname  text,
  score     integer,
  game_id   text,
  updated_at text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.user_id,
    COALESCE(u.display_name, u.username, a.user_id) AS nickname,
    a.score,
    a.game_id,
    a.updated_at
  FROM quiz_attempts a
  LEFT JOIN users u ON u.id = a.user_id
  WHERE a.game_id = p_game_id
    AND (
      p_period = 'daily'
      AND a.created_at >= (now() - interval '1 day')
      OR p_period = 'weekly'
      AND a.created_at >= (now() - interval '7 days')
      OR p_period = 'all'
    )
  ORDER BY a.score DESC
  LIMIT COALESCE(p_limit, 50);
$$;
