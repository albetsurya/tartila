-- Kolom lobi baru + RPC yang mengembalikan tema & avatar.
-- Penulisan state lobi (tema, avatar) kini lewat WebSocket ke backend Go
-- (service_role), bukan dari frontend. RPC hanya membaca.

ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE public.room_players ADD COLUMN IF NOT EXISTS avatar_id TEXT;

CREATE OR REPLACE FUNCTION public.get_room_by_pin(p_pin text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(r) - 'created_at' - 'updated_at'
  FROM (
    SELECT
      id, pin, room_code, room_type, status,
      host_id, kkm, is_randomized, current_question_index, theme,
      created_at, updated_at
    FROM public.rooms
    WHERE pin = p_pin
    LIMIT 1
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_room_players_by_pin(p_pin text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(p ORDER BY p.created_at), '[]'::jsonb)
  FROM (
    SELECT
      rp.id, rp.room_id, rp.user_id, rp.nickname, rp.avatar_id,
      rp.score, rp.is_active, rp.is_ready, rp.is_host,
      rp.created_at
    FROM public.room_players rp
    JOIN public.rooms r ON r.id = rp.room_id
    WHERE r.pin = p_pin
  ) p;
$$;

REVOKE EXECUTE ON FUNCTION public.get_room_by_pin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_room_players_by_pin(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_room_by_pin(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_room_players_by_pin(text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
