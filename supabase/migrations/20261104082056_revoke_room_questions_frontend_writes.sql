-- J1: penulisan room_questions dipindah ke Backend Go (service_role).
-- Frontend tidak lagi INSERT/UPDATE/DELETE langsung.
-- 20261104011414_remote_schema.sql mengembalikan SELECT tabel-level, sehingga
-- correct_answer bocor. Pulihkan SELECT per-kolom dari migrasi keamanan lama.
-- Idempoten: REVOKE/GRANT aman dijalankan berulang.

REVOKE INSERT, UPDATE, DELETE ON public.room_questions FROM anon, authenticated;
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
