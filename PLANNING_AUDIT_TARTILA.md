# 📋 Rencana Tindak Lanjut (Action Plan) - Audit Tartila

Berdasarkan hasil audit, ditemukan beberapa area yang perlu dioptimalkan, terutama terkait performa _loading_ awal, ukuran _bundle_ data statis, dan keamanan. Dokumen ini disusun sebagai panduan eksekusi bertahap.

## 🏛️ Klarifikasi Arsitektur

1. **Tartila Frontend**: React (Repo ini).
2. **Tartila WS Server**: Go `server/` (Hanya untuk WebSocket Arena & Duel).
3. **Sambung Ngaji Backend**: Go (Terpisah, menangani endpoint `/api/v1/*` seperti Auth, Ekonomi, Profil).

---

## 🚀 Tahap 1: Optimasi Performa (PWA, Routing & Bundling)

**Tujuan:** Mengurangi ukuran _bundle_ awal, mencegah _download_ file yang tidak perlu, dan mempercepat waktu muat halaman (_loading_ pertama).

- [ ] **1.1 Perbaikan Konfigurasi PWA (VitePWA / Workbox)**
  - **Masalah:** Saat ini Service Worker mem-_pre-cache_ terlalu banyak file JS (terlihat dari Network Tab, ada 150+ request di awal termasuk halaman Admin).
  - **Solusi:** Batasi `globPatterns` di `vite.config.ts` agar HANYA mem-_pre-cache_ file inti (`index.html`, `index.js`, CSS utama, font/ikon kecil).
  - Biarkan file JS halaman lain di-_download_ secara _on-demand_ (runtime caching) saat rutenya dibuka.

- [ ] **1.2 Pastikan Lazy Loading di Router (App.tsx)**
  - **Masalah:** Halaman-halaman Admin dan Game ikut ter-_download_ di awal.
  - **Solusi:** Pastikan SEMUA halaman (terutama Admin, Game, Arena, Kuis) di-_import_ menggunakan `React.lazy(() => import('...'))` dan dibungkus `<Suspense>`.
  - Hapus _import_ statis di bagian atas file untuk halaman-halaman tersebut.

- [ ] **1.3 Refactor `tilawatiTimelineEdits.json` (Ukuran ~980KB)**
  - Pindahkan file `tilawatiTimelineEdits.json` dari folder `src/` ke folder `public/data/`.
  - Hapus `import` langsung file JSON tersebut di `tilawatiAudio.ts` dan `tilawatiQuizData.ts`.
  - Ubah fungsi agar melakukan `fetch('/data/tilawatiTimelineEdits.json')` secara asinkron saat halaman terkait dibuka, lalu simpan hasilnya di _state_.

- [ ] **1.4 Refactor `TilawatiDataProvider` (Ukuran ~1.1MB)**
  - Pisahkan data kuis (Jilid 1-6) agar tidak semuanya di-_import_ sekaligus.
  - Gunakan _dynamic_ `import()` atau `fetch()` berdasarkan jilid yang sedang dimainkan.

- [ ] **1.5 Verifikasi Tahap 1**
  - Jalankan `npm run build`.
  - Buka aplikasi di Incognito, pastikan request di Network Tab saat awal buka jauh lebih sedikit (hanya memuat halaman yang sedang dibuka).
  - Cek ukuran _chunk_ JS `TilawatiDataProvider` dan `tilawatiTimelineEdits` (harus turun drastis).

---

## 🔒 Tahap 2: Perbaikan Keamanan Server (CORS)

**Tujuan:** Mengamankan API dari potensi eksploitasi lintas situs (CSRF/XSS) dengan membatasi origin yang diizinkan.

- [ ] **2.1 Perketat Konfigurasi CORS di Server Go (`tartila/server/main.go`)**
  - Ubah `Access-Control-Allow-Origin: *` agar hanya menerima _request_ dari URL frontend yang spesifik (misal: `http://localhost:5173` saat dev, dan domain production Anda).
  - Terapkan ini pada _handler_ `/api/rooms`, `/api/ws/*`, dan endpoint lainnya di repo `server/`.

- [ ] **2.2 Verifikasi Tahap 2**
  - Jalankan ulang _server_ Go. Pastikan frontend lokal masih bisa terhubung ke WebSocket dan API Rooms.

---

## 🛡️ Tahap 3: Hardening Arsitektur Arena & Duel (Opsional)

**Tujuan:** Menutup celah di mana _Host_ (pembuat room) mengirimkan kunci jawaban di dalam _payload_.

- [ ] **3.1 Analisis Kebutuhan Server-Side Questions**
  - Saat ini, `CreateRoomRequest` menerima `Questions[]` lengkap dengan `CorrectAnswer` dari _client_.
  - Rencanakan pemindahan data soal kuis ke _database_ di _server_ agar _host_ hanya mengirim `quizId`, dan _server_ yang mengambil soalnya.
  - _(Catatan: Ini adalah perubahan arsitektur besar dan bisa dikerjakan setelah Tahap 1 & 2 stabil)._

---

## ✅ Tahap 4: Finalisasi & Pengujian Menyeluruh

- [ ] Jalankan `npm run build` dan pastikan tidak ada _error_ TypeScript.
- [ ] Lakukan pengujian manual pada halaman utama: Beranda, Kuis, Arena, Duel, dan Warung Santri.
- [ ] Lakukan _commit_ dan _push_ perubahan ke _branch_ `develop`.

---

_Dokumen ini disusun sebagai panduan eksekusi. Setiap tahap harus diselesaikan dan diverifikasi sebelum melanjutkan ke tahap berikutnya._
