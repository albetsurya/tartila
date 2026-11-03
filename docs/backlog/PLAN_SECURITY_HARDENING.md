# 🛡️ Security Hardening Plan (Tartila & Backend)

Berdasarkan hasil audit keamanan tertanggal 2026-10-28, terdapat beberapa 
celah kritis yang WAJIB diperbaiki sebelum aplikasi dirilis ke Production.

## 🚨 Tahap 1: Critical (Harus Segera)
- [ ] **Supabase RLS (Row Level Security)**: Ganti semua policy `USING (true)` menjadi validasi berbasis `auth.uid()` di seluruh tabel (`rooms`, `quiz_attempts`, `users`, dll).
- [ ] **Hapus Base64 Password**: Ganti fungsi `hashPassword` di `classroomService.ts` yang menggunakan `window.btoa()` dengan enkripsi server-side (bcrypt/argon2) via API Go.
- [ ] **Revoke Hardcoded TTS Token**: Hapus token Microsoft TTS di `scripts/generate_playful_tts.cjs` dan rotasi token di dashboard Azure.
- [ ] **Backend Go Auth**: Tambahkan middleware JWT/Auth di semua endpoint `/api/v1/*` dan WebSocket. Jangan biarkan PIN room menjadi satu-satunya "kunci" identitas.

## ⚠️ Tahap 2: High (Segera Setelah Tahap 1)
- [ ] **Duel Score Validation**: Batasi skor maksimal di `message_handler.go` (misal `min(score, 1000)`). Jangan biarkan client mengirim skor 99999999.
- [ ] **CORS & WebSocket Origin**: Ganti `Access-Control-Allow-Origin: *` dengan domain spesifik. Ubah `CheckOrigin: true` menjadi validasi origin yang ketat.
- [ ] **Migrasi Token Storage**: Pindahkan penyimpanan JWT dari `localStorage` ke `HttpOnly, Secure, SameSite=Cookie` untuk mencegah XSS.
- [ ] **Rate Limiting**: Tambahkan rate limiter (misal via middleware Go) pada endpoint login, pembuatan room, dan koneksi WebSocket.

## 🟡 Tahap 3: Medium & Low (Bereskan Nanti)
- [ ] **Vite PWA Config**: Nonaktifkan `skipWaiting: true` untuk mencegah risiko *stale-code* (cache versi lama).
- [ ] **Reveal Answer Leak**: Ubah `reveal_answer` agar hanya mengirim jawaban ke Host, bukan ke semua client.
- [ ] **Race Condition PIN**: Perbaiki logika locking di `api.go` agar pengecekan PIN unik dan insert room berjalan atomik.
- [ ] **API v1 Paths 404**: Koordinasikan dengan tim Backend Go (Sambung Ngaji) karena frontend memanggil `/api/v1/*` tapi backend belum menyediakannya.

Dokumen ini di-generate dari Security Audit Report. Eksekusi hanya boleh 
dilakukan setelah mendapat persetujuan tim Backend.