-- Tutup leak SELECT anon pada tabel Arena.
-- Semua baca lewat RPC SECURITY DEFINER yang butuh pin (satu room saja).
-- Tulis sudah dipindah ke backend Go (service_role).

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
      host_id, kkm, is_randomized, current_question_index,
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
      rp.id, rp.room_id, rp.user_id, rp.nickname,
      rp.score, rp.is_active, rp.is_ready, rp.is_host,
      rp.created_at
    FROM public.room_players rp
    JOIN public.rooms r ON r.id = rp.room_id
    WHERE r.pin = p_pin
  ) p;
$$;

CREATE OR REPLACE FUNCTION public.get_room_questions_by_pin(p_pin text)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', rq.id,
        'room_id', rq.room_id,
        'question_type', rq.question_type,
        'category', rq.category,
        'question_data', rq.question_data,
        'options', rq.options,
        'order_index', rq.order_index
      )
      ORDER BY rq.order_index
    ),
    '[]'::jsonb
  )
  FROM public.room_questions rq
  JOIN public.rooms r ON r.id = rq.room_id
  WHERE r.pin = p_pin;
$$;

REVOKE EXECUTE ON FUNCTION public.get_room_by_pin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_room_players_by_pin(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_room_questions_by_pin(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_room_by_pin(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_room_players_by_pin(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_room_questions_by_pin(text) TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view rooms by pin" ON public.rooms;
DROP POLICY IF EXISTS "Players can view room participants" ON public.room_players;
DROP POLICY IF EXISTS "Players can view participants" ON public.room_players;
DROP POLICY IF EXISTS "Questions can be viewed by participants" ON public.room_questions;
DROP POLICY IF EXISTS "Questions can be viewed" ON public.room_questions;
