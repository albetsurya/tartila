-- Bagian dari Tahap 1 Security Hardening: password kelas tidak lagi di-hash di browser.
--
-- Aturan:
--   * `window.btoa()` bisa dibalik oleh siapa saja. Hash bcrypt (pgcrypto) dibuat di DB.
--   * Frontend TIDAK lagi membaca/menulis kolom password_hash. Cukup panggil RPC
--     `verify_room_password(join_code, password)` lalu `set_room_password(room_id, password)`.
--   * Kamar tanpa password (password_hash NULL) tetap boleh dimasuki.
--
-- Kamar yang dibuat sebelum migrasi ini masih menyimpan hash base64. Password
-- kamar tersebut akan ditolak sampai pemilik kelas menyimpan ulang password-nya.
--
-- BELUM DITUTUP DI SINI. Kolom password_hash masih terbaca siapa saja yang
-- memegang anon key, karena anon dan authenticated memegang grant tabel-level
-- (relacl `anon=arwdDxtm`) sehingga REVOKE per kolom tidak berpengaruh. Menutup
-- baca butuh policy RLS sebagai ganti `USING (true)` di
-- 20261023100000_create_classroom_tables.sql (item RLS Tahap 1 yang terpisah).
-- Otorisasi `set_room_password` juga masih terbuka; menambah guard
-- `ustadz_id = auth.uid()::text` akan memutus login legacy REST, yang id-nya
-- datang dari backend Go, bukan Supabase Auth.
--
-- Idempoten.

-- bcrypt (crypt/gen_salt).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ada tidaknya password kelas, tanpa membocorkan hash-nya.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ustadz_rooms'
      AND column_name = 'has_password'
  ) THEN
    ALTER TABLE public.ustadz_rooms
      ADD COLUMN has_password BOOLEAN
      GENERATED ALWAYS AS (password_hash IS NOT NULL) STORED;
  END IF;
END $$;

-- Verifikasi password kelas. Kamar tanpa password atau kode join tak dikenal
-- mengembalikan false; pemanggil memetakan keduanya ke pesan salah password.
CREATE OR REPLACE FUNCTION public.verify_room_password(p_join_code text, p_password text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
  SELECT COALESCE((
    SELECT CASE
      WHEN r.password_hash IS NULL THEN true
      ELSE crypt(coalesce(p_password, ''), r.password_hash) = r.password_hash
    END
    FROM public.ustadz_rooms r
    WHERE r.join_code ILIKE p_join_code
      AND r.is_active
      AND NOT r.archived
    LIMIT 1
  ), false);
$$;

-- Simpan password kelas sebagai bcrypt. Dipanggil pemilik kelas setelah baris dibuat.
CREATE OR REPLACE FUNCTION public.set_room_password(p_room_id uuid, p_password text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
  UPDATE public.ustadz_rooms
  SET password_hash = crypt(p_password, gen_salt('bf', 8)),
      updated_at = now()
  WHERE id = p_room_id;
$$;

-- Anon sudah bisa UPDATE password_hash lewat policy `FOR ALL USING (true)`,
-- jadi RPC di atas tidak menambah hak baru. Penambahan hak tetap ditunda ke
-- item Backend Go Auth / RLS Tahap 1 supaya tidak memutus jalur login legacy.
