# Pedoman Database dan Keamanan

Dokumen ini menetapkan aturan skema, Row Level Security (RLS), proteksi ekonomi, normalisasi role, serta tata kelola migrasi dan storage. Tujuan utamanya mencegah kebocoran data, manipulasi skor, dan pemberian saldo ekonomi dari sisi client.

## Daftar Isi

1. [Peta Skema Database](#1-peta-skema-database)
2. [Row Level Security (RLS) Standar](#2-row-level-security-rls-standar)
3. [Proteksi Ekonomi](#3-proteksi-ekonomi)
4. [Normalisasi Role](#4-normalisasi-role)
5. [Aturan Migrasi dan Storage](#5-aturan-migrasi-dan-storage)
6. [Checklist Keamanan](#6-checklist-keamanan)

---

## 1. Peta Skema Database

Proyek memakai dua database dengan kepemilikan berbeda. Frontend hanya boleh mengakses database Supabase milik frontend. Backend Go memiliki database sendiri.

### 1.1 Kepemilikan Tabel

| Tabel | Pemilik | Akses Frontend | Keterangan |
| --- | --- | --- | --- |
| `users` | Backend Go | DILARANG | Identitas, role, saldo ekonomi. Hanya lewat REST backend. |
| `quiz_attempts` | Supabase Frontend | Diizinkan (RLS) | Skor permainan per pengguna. |
| `leaderboard` (view/RPC) | Supabase Frontend | Diizinkan (RPC) | Dibaca lewat `get_leaderboard_for_game`. |
| `room_questions` | Supabase Frontend | Terbatas | Kolom `correct_answer` tidak boleh dibaca client. |
| `rooms` | Supabase Frontend | Diizinkan (RLS) | Room permainan multiplayer. |
| `notifications` | Supabase Frontend | Diizinkan (RLS) | Notifikasi per pengguna. |
| `game_display_configurations` | Supabase Frontend | Diizinkan (RLS) | Konfigurasi tampilan game. |
| `tilawati_timeline_edits` | Supabase Frontend | Terbatas | Data editor audio Tilawati. |

### 1.2 Larangan Query `users`

- Frontend DILARANG melakukan `select`, `insert`, `update`, atau `delete` pada tabel `users`.
- Frontend DILARANG membuat RPC atau view yang membaca `users`.
- Frontend DILARANG menambahkan migrasi yang membuat, mengubah, atau mem-policy tabel `users`. Tabel tersebut tidak ada di database frontend, sehingga migrasi akan gagal dengan `SQLSTATE 42P01`.
- Data profil pengguna diambil dari endpoint backend, misalnya `GET /api/v1/user/profile`.
- Bila migrasi frontend membutuhkan data pengguna, simpan salinan minimum (misalnya `user_id` dan `nickname`) pada tabel milik frontend, bukan join ke `users`.

### 1.3 Aturan Umum

- Setiap tabel baru wajib mengaktifkan RLS sebelum dipakai.
- Nama tabel dan kolom memakai `snake_case`.
- Kolom kepemilikan memakai `user_id` bertipe `text` agar konsisten dengan `auth.uid()::text`.
- Migrasi yang menyentuh tabel milik backend wajib dijaga dengan `IF to_regclass('public.<tabel>') IS NULL THEN RETURN; END IF;` di dalam blok `DO`.

---

## 2. Row Level Security (RLS) Standar

### 2.1 Prinsip

- RLS aktif pada semua tabel yang diekspos ke Data API.
- Policy dibatasi ke role yang benar. Gunakan `TO authenticated` untuk data pengguna, `TO anon` hanya untuk data publik.
- DILARANG memakai `USING (true)` untuk data sensitif, termasuk skor, notifikasi, room privat, dan data ekonomi.
- Operasi `INSERT` dan `UPDATE` selalu memakai `WITH CHECK`, bukan hanya `USING`.
- Selalu `DROP POLICY IF EXISTS` sebelum `CREATE POLICY` agar migrasi idempoten.

### 2.2 Template Policy

Tabel dengan kolom `user_id` bertipe `text`:

```sql
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_attempts_select_policy" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_select_policy" ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "quiz_attempts_insert_policy" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_insert_policy" ON public.quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid())::text = user_id);

DROP POLICY IF EXISTS "quiz_attempts_update_policy" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_update_policy" ON public.quiz_attempts
  FOR UPDATE TO authenticated
  USING ((select auth.uid())::text = user_id)
  WITH CHECK ((select auth.uid())::text = user_id);
```

Catatan teknis:

- Gunakan `(select auth.uid())` agar fungsi dievaluasi sekali per query, bukan per baris.
- Untuk kolom `uuid`, bandingkan langsung `auth.uid() = user_id`.
- Policy `DELETE` hanya ditambahkan bila fitur memang membutuhkan penghapusan.
- Akses baca publik (misalnya daftar room terbuka) harus dibatasi ke kolom tidak sensitif. Bila perlu, gunakan `REVOKE SELECT` lalu `GRANT SELECT (kolom_aman)`.

### 2.3 RPC `SECURITY DEFINER` untuk Leaderboard

Leaderboard memerlukan data lintas pengguna. Jangan melonggarkan RLS `quiz_attempts` hanya untuk itu. Gunakan RPC dengan `SECURITY DEFINER` yang mengembalikan kolom terbatas.

```sql
CREATE OR REPLACE FUNCTION get_leaderboard_for_game(
  p_game_id text,
  p_period text DEFAULT 'all',
  p_limit integer DEFAULT 50
)
RETURNS TABLE (
  user_id text,
  nickname text,
  score integer,
  game_id text,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.user_id, a.nickname, a.score, a.game_id, a.updated_at
  FROM quiz_attempts a
  WHERE a.game_id = p_game_id
    AND (
      (p_period = 'daily' AND a.created_at >= now() - interval '1 day')
      OR (p_period = 'weekly' AND a.created_at >= now() - interval '7 days')
      OR p_period = 'all'
    )
  ORDER BY a.score DESC
  LIMIT p_limit;
$$;
```

Aturan RPC:

- Wajib `SET search_path = public` untuk mencegah serangan search path.
- Hanya mengembalikan kolom publik. Dilarang mengembalikan email, token, atau data ekonomi.
- DILARANG membuat policy `USING (true)` pada tabel sumber sebagai pengganti RPC.
- Parameter `p_limit` wajib dibatasi di dalam fungsi agar client tidak meminta seluruh tabel.
- Fungsi yang menulis data (bukan hanya membaca) wajib memvalidasi pemanggil.

---

## 3. Proteksi Ekonomi

### 3.1 Aturan Utama

- Kalkulasi XP, koin, tiket, nyawa, dan status VIP hanya boleh dilakukan di Backend Go.
- Frontend hanya mengirim aksi (misalnya menyelesaikan level) dan menerima saldo baru dari backend.
- Frontend DILARANG menghitung saldo akhir lalu menulisnya langsung ke database.
- Semua penulisan saldo memakai `service_role` dari backend. `service_role` melewati RLS dan trigger proteksi.

### 3.2 Trigger Penolakan Update Saldo

Trigger berikut menolak perubahan kolom ekonomi dari client. Fungsi dijalankan dengan `SECURITY INVOKER` agar tidak membuka jalur bypass.

```sql
CREATE OR REPLACE FUNCTION public.protect_users_economy_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF (NEW.coins IS DISTINCT FROM OLD.coins)
     OR (NEW.hearts IS DISTINCT FROM OLD.hearts)
     OR (NEW.tickets IS DISTINCT FROM OLD.tickets)
     OR (NEW.xp IS DISTINCT FROM OLD.xp)
     OR (NEW.is_vip IS DISTINCT FROM OLD.is_vip) THEN
    RAISE EXCEPTION 'DIRECT UPDATE TO ECONOMY COLUMNS IS FORBIDDEN. USE THE GO BACKEND API.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_economy ON public.users;
CREATE TRIGGER trg_protect_economy
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_users_economy_columns();
```

Catatan:

- Trigger di atas hanya dapat dipasang pada database yang benar-benar memiliki tabel `users`, yaitu database backend Go.
- Bila tabel tidak ada, bungkus pembuatan trigger dengan pemeriksaan `to_regclass`.
- Trigger bukan pengganti validasi di backend. Backend tetap wajib memvalidasi aturan bisnis sebelum menulis.

### 3.3 Validasi Skor

- Skor dikirim ke tabel frontend hanya untuk leaderboard, bukan untuk menentukan saldo.
- Backend wajib memvalidasi rentang skor, durasi permainan, dan kepemilikan sesi sebelum menulis.
- Client DILARANG menentukan `user_id` final tanpa verifikasi sesi. Nilai diambil dari `auth.uid()` atau token backend.
- Update skor hanya boleh menaikkan nilai atau mengikuti aturan backend, bukan menimpa skor pengguna lain.

---

## 4. Normalisasi Role

### 4.1 Sumber dan Nilai

Role berasal dari Backend Go. Frontend menormalisasi nilai sebelum dipakai.

| Nilai dari Backend | Nilai di Frontend | Akses |
| --- | --- | --- |
| `SUPER_ADMIN` / `superadmin` | `superadmin` | Penuh, termasuk panel admin. |
| `TARTILA_ADMIN` / `tartila_admin` | `tartila_admin` | Panel admin terbatas. |
| `ADMIN` / `admin` | `member` | Diturunkan. Tidak mendapat akses admin Tartila. |
| `USTADZ` / `ustadz` | `ustadz` | Fitur kelas dan materi. |
| `USTADZAH` / `ustadzah` | `ustadzah` | Fitur kelas dan materi. |
| `MEMBER` / `member` | `member` | Pengguna biasa. |
| kosong atau tidak dikenal | `member` | Pengguna biasa. |

### 4.2 Aturan Downgrade

- Role `ADMIN` dari sistem Sambung Ngaji diturunkan menjadi `member` di Tartila. Admin sistem lain tidak otomatis menjadi admin Tartila.
- Hanya `superadmin` dan `tartila_admin` yang dianggap admin di aplikasi frontend.
- Penurunan role tidak boleh dilakukan dari client. Keputusan akhir tetap berasal dari backend.
- Frontend wajib memperlakukan role tak dikenal sebagai `member`, bukan sebagai error.

### 4.3 Implementasi

```ts
function toTartilaRole(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  if (!normalized || normalized === 'admin') return 'member';
  return normalized;
}
```

- Normalisasi dilakukan di satu tempat, yaitu `AuthContext`, lalu dipakai ulang.
- Pemeriksaan akses UI tidak boleh menggantikan otorisasi backend. Endpoint backend tetap wajib memeriksa role.
- Data role tidak boleh dipercaya dari `localStorage` saja. Verifikasi ulang lewat endpoint profil.

---

## 5. Aturan Migrasi dan Storage

### 5.1 Migrasi

- Semua perubahan skema ditulis sebagai file SQL di `supabase/migrations/`.
- Format nama: `YYYYMMDDHHMMSS_deskripsi_singkat.sql`.
- Migrasi harus idempoten: gunakan `IF NOT EXISTS`, `DROP POLICY IF EXISTS`, dan `CREATE OR REPLACE`.
- Migrasi yang sudah diterapkan ke production tidak boleh diubah. Buat migrasi baru untuk koreksi.
- Migrasi yang menyentuh objek di luar database frontend wajib dijaga dengan pemeriksaan keberadaan objek.
- Verifikasi lokal dengan `npx supabase db reset` sebelum push.
- Migrasi diterapkan otomatis oleh `.github/workflows/supabase-migrate.yml` saat push ke `main`.

### 5.2 Storage

Bucket audio Tilawati bernama `audio-tilawati`.

Standar policy:

```sql
DROP POLICY IF EXISTS "audio_tilawati_public_read" ON storage.objects;
CREATE POLICY "audio_tilawati_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'audio-tilawati');

DROP POLICY IF EXISTS "audio_tilawati_auth_upload" ON storage.objects;
CREATE POLICY "audio_tilawati_auth_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'audio-tilawati');

DROP POLICY IF EXISTS "audio_tilawati_auth_replace" ON storage.objects;
CREATE POLICY "audio_tilawati_auth_replace" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'audio-tilawati');

DROP POLICY IF EXISTS "audio_tilawati_auth_delete" ON storage.objects;
CREATE POLICY "audio_tilawati_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'audio-tilawati');
```

Aturan:

- `anon` hanya boleh membaca.
- Penulisan, penggantian, dan penghapusan hanya untuk `authenticated`.
- Migrasi `20261101130000_tilawati_timeline_edits.sql` saat ini masih memberi hak tulis kepada `anon`. Policy tersebut harus dirapatkan mengikuti standar di atas pada migrasi berikutnya.
- Nama file audio mengikuti struktur `jilid_<n>/hal<page>/<nama>.ogg`.
- Sumber audio adalah aset statis di `public/audio/tilawati/`. Storage hanya dipakai bila aset perlu diunggah dari aplikasi.

---

## 6. Checklist Keamanan

Sebelum merge perubahan database:

- Tabel baru sudah mengaktifkan RLS.
- Tidak ada policy `USING (true)` pada data sensitif.
- Policy `INSERT` dan `UPDATE` memakai `WITH CHECK` dengan `auth.uid()`.
- Tidak ada migrasi yang membuat atau mengubah tabel `users`.
- Migrasi idempoten dan lulus `npx supabase db reset`.
- RPC baru memakai `SECURITY DEFINER` dengan `SET search_path = public` dan kolom terbatas.
- Kalkulasi ekonomi tetap berada di Backend Go.
- Policy storage tidak memberi hak tulis kepada `anon`.
- Role tak dikenal diperlakukan sebagai `member`.
