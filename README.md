# Tartila

Aplikasi web edukasi mengaji untuk anak (Tilawati, kuis, dan mini-game islami)
dengan panel admin untuk mengelola pengguna, konten, dan kuis.

- **Stack:** React 19 + TypeScript + Vite 8, React Router 6, Tailwind CSS 4
- **Animasi/3D/Game:** Framer Motion, Three.js (`@react-three/fiber`/`drei`), Phaser, Lottie
- **State:** Zustand + React Context (auth & tema)
- **PWA:** `vite-plugin-pwa` (service worker, auto-update)

---

## Prasyarat

- **Node.js 20+** (disarankan 22 LTS) dan **npm**.
- Backend REST API Tartila (opsional untuk pengembangan UI; lihat
  [Environment Variables](#environment-variables)).

---

## Menjalankan di Lokal

```bash
# 1. Install dependensi
npm install

# 2. Siapkan environment (opsional untuk sekadar mencoba UI)
cp .env.example .env
# lalu isi nilainya, minimal VITE_API_BASE_URL bila ingin terhubung ke backend

# 3. Jalankan dev server (HMR)
npm run dev
# → http://localhost:5173
```

Tanpa `VITE_API_BASE_URL`, aplikasi tetap berjalan: sebagian data (mis. progres
belajar Ngaji Ceria) otomatis memakai penyimpanan lokal/offline, dan request ke
`/api` akan memakai origin yang sama.

### Halaman penting

| Path                              | Keterangan                       |
| --------------------------------- | -------------------------------- |
| `/login`                          | Halaman masuk                    |
| `/admin`                          | Dashboard admin (butuh role admin) |
| `/member/ngaji-ceria`             | Beranda belajar anak             |
| `/member/ngaji-ceria/quiz`        | Daftar & alur kuis               |
| `/member/ngaji-ceria/cek-audio/timeline` | Editor timeline (internal) |

---

## Scripts

| Perintah          | Fungsi                                                    |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Menjalankan Vite dev server (HMR)                         |
| `npm run build`   | Type-check (`tsc -b`) lalu build produksi ke `dist/`      |
| `npm run preview` | Menjalankan hasil build (`dist/`) secara lokal            |
| `npm run lint`    | Menjalankan Oxlint                                        |

### Build & Preview produksi

```bash
npm run build     # menghasilkan folder dist/
npm run preview   # serve dist/ di http://localhost:4173
```

Selalu uji dengan `npm run preview` sebelum deploy untuk memastikan tidak ada
layar kosong (blank screen) di mode produksi.

---

## Environment Variables

Semua variabel harus berawalan `VITE_` agar terekspos ke browser. Nilai
di-bundle saat build, jadi **jangan menyimpan rahasia** di sini. Lihat
`.env.example` untuk daftar lengkap.

| Variabel                         | Wajib | Deskripsi                                                                 |
| -------------------------------- | ----- | ------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`              | Tidak | Base URL REST API (tanpa trailing slash). Kosong = origin yang sama (`/api`). |
| `VITE_GOOGLE_CLIENT_ID`          | Tidak | Client ID Google OAuth untuk tombol "Masuk dengan Google".                 |
| `VITE_COLYSEUS_URL`              | Tidak | Endpoint server multiplayer (Colyseus). Kosong = mode latihan offline.     |
| `VITE_NGAJI_CERIA_PLAYER_MODEL`  | Tidak | URL model 3D pemain (`.glb`). Default `/models/ngaji-ceria/qirra.glb`.     |

> **Rahasia/JWT** tidak disimpan di sini — sesi memakai cookie `tartila_token`
> yang dikelola oleh backend.

---

## Deployment

Hasil build adalah **static site** di `dist/`. Karena aplikasi memakai React
Router dengan *client-side routing*, server harus mengarahkan semua rute tak
dikenal ke `index.html` (SPA fallback), agar refresh di `/admin` atau
`/member/ngaji-ceria/...` tidak menghasilkan 404.

Konfigurasi SPA sudah disediakan untuk dua platform populer:

### Vercel

File `vercel.json` di root sudah berisi rewrite SPA + cache header aset.

```bash
# via dashboard: import repo, framework preset "Vite"
# Build Command : npm run build
# Output Dir    : dist
# Env Vars      : set VITE_* sesuai kebutuhan

# atau via CLI
npm i -g vercel
vercel        # preview
vercel --prod # production
```

- `vercel.json` men-*rewrite* semua path kecuali `/api/*` ke `/index.html`.
- Aset ber-hash di `/assets/*` di-cache `immutable`, `sw.js` selalu
  direvalidasi.

### Netlify

File `public/_redirects` (otomatis tersalin ke `dist/` saat build) sudah berisi:

```
/*    /index.html   200
```

```bash
# via dashboard
# Build Command : npm run build
# Publish Dir   : dist
# Env Vars      : set VITE_* sesuai kebutuhan

# atau via CLI
npm i -g netlify-cli
netlify deploy --build            # draft
netlify deploy --build --prod     # production
```

### Platform statis lain (Nginx, Cloudflare Pages, dsb.)

Set fallback `index.html`:

- **Nginx:** `try_files $uri $uri/ /index.html;`
- **Cloudflare Pages:** sudah SPA-aware; cukup set build command
  `npm run build` dan output `dist`.

---

## PWA & Service Worker

Aplikasi otomatis menghasilkan service worker (`sw.js`) dengan mode
**autoUpdate**. Setelah deploy, pengguna akan mendapat versi terbaru tanpa aksi
manual. Bila perlu memaksa update saat pengembangan:

1. Buka DevTools → **Application → Service Workers** → **Unregister**.
2. Clear site data, lalu hard reload.

---

## Struktur Folder (ringkas)

```
src/
├─ components/ui/         # komponen UI bersama (FontAwesomeIcons, BibiMascot, dll.)
├─ contexts/              # AuthContext, ThemeProvider
├─ features/
│  ├─ admin/              # panel admin (desktop-first) — lihat docs/admin-setup.md
│  ├─ auth/               # login & session
│  └─ ngaji-ceria/        # UI & alur belajar anak (kuis, game, editor timeline)
├─ services/              # api.ts (callREST), service domain
└─ App.tsx                # definisi rute (lazy-loaded per halaman)
```

- `docs/admin-setup.md` — detail modul admin & kontrol akses.
- `vercel.json` / `public/_redirects` — konfigurasi deploy SPA.

---

## Catatan Teknis

- **Code-splitting:** setiap halaman dimuat dengan `React.lazy`. Modul besar
  (Three.js, Phaser, data kuis, editor timeline) hanya terunduh saat rutenya
  dibuka.
- **Mode gelap:** mengikuti preferensi OS / pilihan tersimpan di
  `localStorage["tartila-theme"]`; diterapkan sebelum render pertama agar tidak
  berkedip.
- **Halaman editor timeline** memerlukan plugin dev-server khusus di
  `vite.config.ts` (menulis JSON ke `src/features/ngaji-ceria/data/`) sehingga
  hanya berfungsi penuh saat `npm run dev`, bukan di build statis.

---

## Lisensi

Internal / privat. "Tilawati" adalah merek terdaftar milik Pesantren Al-Qur'an
Nurul Falah Surabaya.
