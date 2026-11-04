-- Setelah J1 memindahkan semua write Arena ke backend Go (service_role),
-- frontend (anon + authenticated) tidak butuh write sama sekali.
-- TRUNCATE/REFERENCES/TRIGGER tidak pernah dibutuhkan frontend dan
-- TRUNCATE melewati RLS — wajib dicabut.

-- rooms
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.rooms FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.rooms FROM anon, authenticated;

-- room_players
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.room_players FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.room_players FROM anon, authenticated;

-- room_questions
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.room_questions FROM anon, authenticated;
