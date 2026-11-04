# Pedoman Environment dan Deployment

Dokumen ini menjadi acuan tunggal (single source of truth) untuk konfigurasi environment, integrasi OAuth, proxy Cloudflare, serta proses deployment proyek Tartila/Sambung Ngaji. Tujuannya mencegah kegagalan yang paling sering terjadi: CORS ditolak, cookie tidak terkirim, dan `redirect_uri_mismatch` pada OAuth Google.

## Daftar Isi

1. [Peta Environment](#1-peta-environment)
2. [Environment Variables (SSOT)](#2-environment-variables-ssot)
3. [Konfigurasi OAuth Google](#3-konfigurasi-oauth-google)
4. [Cloudflare Proxy Middleware](#4-cloudflare-proxy-middleware)
5. [Docker Lokal dan CI/CD](#5-docker-lokal-dan-cicd)
6. [Checklist Deployment](#6-checklist-deployment)

---

## 1. Peta Environment

Arsitektur terdiri dari tiga komponen yang selalu berpasangan: frontend statis di Cloudflare Pages, backend Go di Render, dan database Supabase.

| Environment | Frontend (Cloudflare Pages)                          | Backend (Render / Go)                                                           | Database (Supabase)                           |
| ----------- | ---------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| Lokal       | `http://localhost:5173` (Vite dev server)            | `http://127.0.0.1:8080` (native) atau `http://127.0.0.1:29001` (Docker Compose) | `http://127.0.0.1:54321` (Supabase CLI lokal) |
| Staging     | `https://staging.tartila.pages.dev` (preview branch) | Render service staging                                                          | Supabase project staging                      |
| Production  | `https://tartila.pages.dev`                          | `https://ngaji-tartila.onrender.com`                                            | Supabase Cloud project `ukqzxxzdsesdqbamxxfb` |

Aturan penting:

- Frontend tidak pernah memanggil backend lintas domain di production. Semua request menuju path relatif `/api/...` dan diteruskan oleh Cloudflare Pages Function.
- Backend Go selalu memakai prefix `/api` pada route-nya. Proxy Vite maupun proxy Cloudflare tidak melakukan rewrite path.
- Port backend bersifat dinamis di lokal. `vite.config.ts` mendeteksi port aktif (8080 native atau 29001 Docker) secara otomatis.

---

## 2. Environment Variables (SSOT)

### 2.1 Variabel Wajib

| Variabel                 | Dipakai Oleh   | Wajib           | Keterangan                                                                                                |
| ------------------------ | -------------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`      | Frontend       | Ya              | Base URL REST API. Kosongkan (`""`) agar seluruh request memakai URL relatif `/api/...`.                  |
| `VITE_API_PROXY_TARGET`  | Frontend (dev) | Tidak           | Target proxy Vite. Kosongkan agar port 8080/29001 dideteksi otomatis.                                     |
| `VITE_SUPABASE_URL`      | Frontend       | Ya              | URL Supabase (lokal: `http://127.0.0.1:54321`).                                                           |
| `VITE_SUPABASE_ANON_KEY` | Frontend       | Ya              | Anon key Supabase. Aman diekspos ke browser.                                                              |
| `VITE_GOOGLE_CLIENT_ID`  | Frontend       | Opsional        | Client ID OAuth. Kosongkan bila tombol Google tidak dipakai.                                              |
| `APP_ENV`                | Backend        | Ya              | `development` atau `production`. Menentukan atribut cookie (`SameSite=None; Secure` hanya di production). |
| `FRONTEND_URL`           | Backend        | Ya              | Origin frontend untuk redirect setelah OAuth dan untuk daftar origin CORS.                                |
| `GOOGLE_CLIENT_ID`       | Backend        | Opsional        | Client ID Google. Backend juga menerima fallback `VITE_GOOGLE_CLIENT_ID`.                                 |
| `GOOGLE_CLIENT_SECRET`   | Backend        | Opsional        | Rahasia OAuth. Tidak boleh ada di repo maupun di frontend.                                                |
| `GOOGLE_CALLBACK_URL`    | Backend        | Opsional        | URL callback OAuth absolut. Harus sama persis dengan yang didaftarkan di Google Cloud Console.            |
| `ALLOWED_ORIGINS`        | Backend        | Ya (production) | Daftar origin dipisah koma, misal `https://tartila.pages.dev,http://localhost:5173`.                      |
| `JWT_SECRET`             | Backend        | Ya (production) | Kunci tanda tangan JWT. Jangan gunakan nilai default.                                                     |
| `PORT`                   | Backend        | Tidak           | Default `8080`. Render mengisi otomatis.                                                                  |

### 2.2 Perbedaan `.env.development` dan `.env.production`

`.env.development`:

- `VITE_API_BASE_URL` kosong, sehingga request memakai URL relatif dan ditangani proxy Vite ke backend lokal.
- `VITE_SUPABASE_URL` menunjuk ke Supabase CLI lokal (`http://127.0.0.1:54321`).
- `VITE_API_PROXY_TARGET` kosong, port backend dideteksi otomatis.
- Nilai di file ini tidak pernah dipakai saat build produksi.

`.env.production`:

- `VITE_API_BASE_URL` wajib kosong. Nilai absolut akan mematikan mekanisme proxy Cloudflare dan mengembalikan masalah cookie third-party.
- `VITE_SUPABASE_URL` menunjuk ke Supabase Cloud.
- Semua nilai `VITE_*` di-bundle saat build. Jangan pernah menyimpan rahasia di sini.

Catatan Vite:

- Hanya variabel berawalan `VITE_` yang tersedia di browser.
- Variabel tanpa awalan `VITE_` hanya dibaca oleh server, skrip Node, atau backend.
- Variabel environment yang di-set di dashboard Cloudflare Pages menimpa nilai dari file `.env.production` saat build.

---

## 3. Konfigurasi OAuth Google

### 3.1 Sinkronisasi Tiga Titik

OAuth Google hanya berhasil bila tiga titik berikut berisi nilai yang identik:

1. Google Cloud Console, menu Credentials, Authorized redirect URIs.
2. Backend Render, variabel `GOOGLE_CALLBACK_URL`.
3. Backend Render, variabel `FRONTEND_URL` (untuk redirect balik ke aplikasi).

Nilai production yang benar:

```text
GOOGLE_CALLBACK_URL=https://tartila.pages.dev/api/auth/google/callback
FRONTEND_URL=https://tartila.pages.dev
```

Redirect URI yang didaftarkan di Google Cloud Console:

```text
https://tartila.pages.dev/api/auth/google/callback
http://localhost:8080/api/auth/google/callback
```

### 3.2 Aturan Callback URL

- Callback harus berada pada origin yang sama dengan halaman login, yaitu `tartila.pages.dev`, agar cookie sesi menjadi same-origin.
- Backend Go menerbitkan cookie lewat `hub.SetAuthCookie` dengan atribut `HttpOnly`, `SameSite=None`, dan `Secure=true` di production.
- Jangan mencampur port atau host. Mendaftarkan `http://localhost:5173/api/auth/google/callback` sementara backend memakai port 8080 akan menghasilkan `redirect_uri_mismatch`.
- Variabel `GOOGLE_CLIENT_SECRET` wajib diisi di Render. Bila kosong, provider Goth gagal diinisialisasi dan login Google dinonaktifkan tanpa mematikan server.
- Backend menerima fallback `VITE_GOOGLE_CLIENT_ID` dan `VITE_GOOGLE_CLIENT_SECRET` bila variabel tanpa awalan kosong.

### 3.3 Alur Produksi

1. Pengguna membuka `https://tartila.pages.dev/login` dan menekan tombol Google.
2. Browser menuju `https://tartila.pages.dev/api/auth/google`.
3. Cloudflare Pages Function meneruskan request ke `https://ngaji-tartila.onrender.com/api/auth/google`.
4. Backend melakukan redirect ke Google dengan callback `https://tartila.pages.dev/api/auth/google/callback`.
5. Google mengembalikan pengguna ke origin `tartila.pages.dev`. Proxy meneruskan ke backend.
6. Backend menerbitkan cookie pada respons yang tampak berasal dari `tartila.pages.dev`, lalu redirect ke `FRONTEND_URL`.

---

## 4. Cloudflare Proxy Middleware

### 4.1 Lokasi dan Tanggung Jawab

File `functions/_middleware.ts` adalah Cloudflare Pages Function yang meneruskan seluruh request `/api/*` ke backend Render.

```ts
const BACKEND_ORIGIN = "https://ngaji-tartila.onrender.com";

export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  if (!url.pathname.startsWith("/api/")) {
    return context.next();
  }

  const target = `${BACKEND_ORIGIN}${url.pathname}${url.search}`;
  return fetch(new Request(target, context.request));
};
```

### 4.2 Mengapa File Ini Ada

Browser modern memblokir cookie lintas situs (third-party cookie). Tanpa proxy, respons login berasal dari `ngaji-tartila.onrender.com` sehingga cookie tersimpan pada domain backend. Request berikutnya dari `tartila.pages.dev` ke backend membawa cookie pihak ketiga yang ditolak browser. Akibatnya endpoint profil mengembalikan `401 Unauthorized` tepat setelah login berhasil, dan antarmuka kembali menampilkan nama default.

Dengan proxy, seluruh request dan respons terlihat berasal dari `tartila.pages.dev`. Cookie menjadi same-origin dan selalu dikirim.

### 4.3 Larangan

- Jangan menghapus `functions/_middleware.ts`.
- Jangan mengisi `VITE_API_BASE_URL` dengan URL absolut di production. Kedua hal ini saling meniadakan.
- Jangan menambahkan rewrite path. Backend sudah memakai prefix `/api`.
- Jangan menyalin header `Set-Cookie` secara manual. `new Request(target, request)` sudah meneruskan method, body, dan header, termasuk `Cookie` dan `Authorization`.

---

## 5. Docker Lokal dan CI/CD

### 5.1 Menjalankan Backend Go

Backend dapat dijalankan dengan dua cara:

Native:

```bash
cd server
go run .
```

Docker Compose (dari repo backend):

```bash
docker compose up -d --build
```

Port yang dipakai:

- `8080` untuk native `go run`.
- `29001` untuk Docker Compose.

Vite mendeteksi port aktif secara otomatis. Bila backend berpindah port saat dev server berjalan, proxy akan beralih sendiri dan menulis peringatan di terminal.

### 5.2 Menjalankan Supabase Lokal

```bash
npx supabase start
npx supabase db reset
npx supabase status
```

Aturan:

- Semua perubahan skema harus berupa file migrasi di `supabase/migrations/` dengan format `YYYYMMDDHHMMSS_nama_perubahan.sql`.
- Dilarang mengubah skema langsung lewat dashboard Supabase untuk perubahan yang perlu masuk repositori.
- `npx supabase db reset` menjalankan ulang seluruh migrasi dari nol. Migrasi yang gagal karena tabel tidak ada menandakan objek tersebut bukan milik database frontend.
- Tabel milik backend Go, seperti `users`, tidak boleh dimigrasikan atau di-query dari repositori frontend.

### 5.3 CI/CD GitHub Actions

Workflow `.github/workflows/supabase-migrate.yml` berjalan pada setiap push ke branch `main` dan pada dispatch manual.

Langkah workflow:

1. Checkout repositori.
2. Memasang Supabase CLI versi terbaru.
3. `supabase link` ke project menggunakan secret `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`, dan `SUPABASE_ACCESS_TOKEN`.
4. `supabase db push` menerapkan migrasi yang belum tercatat.

Aturan:

- Migrasi yang sudah terlanjur di-push ke production tidak boleh diubah isinya. Buat migrasi baru untuk koreksi.
- Rahasia hanya disimpan sebagai GitHub Actions secret, bukan di file `.env` yang di-commit.
- Deployment frontend berjalan otomatis dari Cloudflare Pages pada push ke `main`. Pastikan build lokal lulus lebih dulu.

---

## 6. Checklist Deployment

Sebelum deploy ke production:

- `npm run build` lulus tanpa error.
- `VITE_API_BASE_URL` kosong di `.env.production` dan di environment Cloudflare Pages.
- `functions/_middleware.ts` ada dan menunjuk ke origin backend yang benar.
- `GOOGLE_CLIENT_SECRET` terisi di Render.
- `GOOGLE_CALLBACK_URL` di Render sama persis dengan Authorized redirect URI di Google Cloud Console.
- `ALLOWED_ORIGINS` di Render memuat `https://tartila.pages.dev`.
- `APP_ENV=production` di Render agar cookie memakai `SameSite=None; Secure`.
- `JWT_SECRET` production berbeda dari nilai default.
- Uji login Google dari `https://tartila.pages.dev/login`, lalu pastikan `/api/v1/user/profile` mengembalikan `200` dan nama pengguna tampil.
