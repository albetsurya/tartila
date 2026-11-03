# Pedoman Testing dan QA

Dokumen ini menetapkan standar pengujian untuk mencegah regresi, memastikan logika edukasi benar, dan menjaga kualitas rilis. Cakupan meliputi unit test, integration test, end-to-end test, checklist pra-commit, serta playtest manual bersama anak.

## Daftar Isi

1. [Kondisi Harness Saat Ini](#1-kondisi-harness-saat-ini)
2. [Unit Test](#2-unit-test)
3. [Integration Test](#3-integration-test)
4. [End-to-End Test (Playwright)](#4-end-to-end-test-playwright)
5. [Pre-PR dan Pre-Commit Checklist](#5-pre-pr-dan-pre-commit-checklist)
6. [Panduan Playtest Manual](#6-panduan-playtest-manual)

---

## 1. Kondisi Harness Saat Ini

Proyek memakai harness test kustom, bukan Vitest.

- Perintah: `npm test`.
- Runner: `scripts/run-tests.mjs`.
- Pemuatan modul: `jiti` dengan alias `@/` dan JSX.
- Assertion: `node:assert/strict`.
- Lokasi test: `tests/*.test.ts`.
- Setiap file test mengekspor objek `tests`, berisi nama test dan fungsi.

Contoh struktur:

```ts
import assert from "node:assert/strict";

export const tests = {
  "nama test": () => {
    assert.equal(1 + 1, 2);
  },
};
```

Menjalankan sebagian test:

```bash
npm test -- tests/arabicNormalization.test.ts
```

Aturan:

- Setiap file test wajib mengekspor minimal satu test. File tanpa test dianggap gagal.
- Test harus deterministik. Dilarang bergantung pada jam nyata, jaringan, atau urutan eksekusi file lain.
- Test tidak boleh menulis ke database production atau storage.
- `localStorage` disediakan oleh runner. Jangan membuat mock global sendiri.

Bila proyek beralih ke Vitest, pola `describe`/`it` boleh dipakai, tetapi harness kustom tetap menjadi jalur wajib sampai migrasi selesai.

---

## 2. Unit Test

### 2.1 Cakupan Wajib

Unit test wajib untuk fungsi murni:

- Logika permainan: pencocokan target, perhitungan nyawa, perpindahan level.
- Normalisasi teks Arab: Tatweel, karakter tak terlihat, harakat.
- Kalkulasi akurasi: benar, salah, terlewat, pembagian nol.
- Validasi role: normalisasi dan penurunan role.
- Pemotongan tiket dan saldo: batas minimum, penolakan saldo kurang.
- Pembuatan kode join dan validasi format.

### 2.2 Contoh: Pencocokan Target Harakat dan Suku Kata

```ts
import assert from "node:assert/strict";
import { normalizeArabicText } from "../src/utils/arabic.ts";

const HARAKAT = /[\u064B-\u065F\u0670]/;

function matchesHarakat(answer: string, target: string): boolean {
  return answer === target && HARAKAT.test(target);
}

function matchesSyllable(answer: string, target: string): boolean {
  return normalizeArabicText(answer) === normalizeArabicText(target);
}

export const tests = {
  "harakat: fathah cocok dengan fathah": () => {
    assert.equal(matchesHarakat("َ", "َ"), true);
  },
  "harakat: kasrah tidak cocok dengan fathah": () => {
    assert.equal(matchesHarakat("ِ", "َ"), false);
  },
  "harakat: target wajib mengandung tanda baca": () => {
    assert.equal(matchesHarakat("ب", "ب"), false);
  },
  "suku kata: tatweel diabaikan": () => {
    assert.equal(matchesSyllable("بـَ", "بَ"), true);
  },
  "suku kata: harakat berbeda tidak cocok": () => {
    assert.equal(matchesSyllable("بِ", "بَ"), false);
  },
};
```

Aturan pencocokan:

- Mode Harakat membandingkan kode harakat, bukan nama huruf.
- Mode Suku Kata membandingkan huruf setelah normalisasi.
- Perbandingan tidak boleh memakai `includes` pada string gabungan karena rawan salah cocok.

### 2.3 Contoh: Pemotongan Tiket

```ts
import assert from "node:assert/strict";

type Balance = { tickets: number };

function consumeTicket(balance: Balance): { ok: boolean; balance: Balance } {
  if (balance.tickets <= 0) {
    return { ok: false, balance };
  }
  return { ok: true, balance: { tickets: balance.tickets - 1 } };
}

export const tests = {
  "tiket: saldo cukup berkurang satu": () => {
    const result = consumeTicket({ tickets: 3 });
    assert.equal(result.ok, true);
    assert.equal(result.balance.tickets, 2);
  },
  "tiket: saldo nol ditolak": () => {
    const result = consumeTicket({ tickets: 0 });
    assert.equal(result.ok, false);
    assert.equal(result.balance.tickets, 0);
  },
  "tiket: saldo negatif tidak pernah terjadi": () => {
    const result = consumeTicket({ tickets: -1 });
    assert.equal(result.balance.tickets >= 0, true);
  },
};
```

Aturan:

- Pemotongan tiket harus idempoten terhadap kegagalan jaringan: saldo tidak boleh berkurang bila backend menolak.
- Test wajib mencakup kasus saldo nol, saldo satu, dan kegagalan API.
- Jangan menguji implementasi internal. Uji hasil yang terlihat oleh pengguna.

### 2.4 Contoh yang Sudah Ada

- `tests/arabicNormalization.test.ts`: Tatweel, karakter tak terlihat, harakat dipertahankan.
- `tests/roles.test.ts`: normalisasi role dan penurunan `admin` menjadi `member`.
- `tests/economyLimits.test.ts`: batas ekonomi.
- `tests/hijaiyahHarvestData.test.ts`: data level dan panjang kata.
- `tests/harakatSlasher.test.ts`: logika permainan Harakat Slasher.

---

## 3. Integration Test

### 3.1 Tujuan

Integration test memastikan modul bekerja bersama: pemanggilan API, validasi sesi, dan penolakan akses.

### 3.2 Cakupan Wajib

- Pemotongan tiket lewat `useEconomyStore.consumeTicket` dengan backend menolak.
- Pemuatan profil `GET /api/v1/user/profile` dengan respons sukses dan `401`.
- Validasi RLS Supabase: pengguna tidak dapat membaca atau menulis data pengguna lain.
- Penolakan akses endpoint admin oleh role `member`.
- Fallback ketika backend tidak dapat dijangkau.

### 3.3 Mock Server

Proyek belum memasang MSW. Dua pilihan yang diterima:

1. Mock fungsi tingkat modul. Ganti implementasi `economyApi` atau `fetch` pada test, seperti yang dilakukan `scripts/run-tests.mjs` untuk `economyApi.claimDaily`.
2. Tambahkan MSW hanya bila kebutuhan mock HTTP meningkat. Pasang sebagai dev dependency dan daftarkan handler di runner.

Aturan:

- Dilarang memanggil backend production dari test.
- Respons mock wajib menyerupai bentuk asli, termasuk kode status dan properti `success`.
- Test `401` wajib memastikan state pengguna tidak dihapus secara tidak sengaja. Perilaku ini pernah menjadi sumber bug "Hamba Allah".

Contoh mock sederhana:

```ts
import assert from "node:assert/strict";

async function fetchProfile(fetcher: typeof fetch) {
  const res = await fetcher("/api/v1/user/profile");
  if (!res.ok) return { ok: false, user: null };
  const json = await res.json();
  return { ok: true, user: json.data?.user ?? null };
}

export const tests = {
  "profil: 401 menghasilkan user null tanpa melempar error": async () => {
    const fakeFetch = async () =>
      new Response(JSON.stringify({ success: false }), { status: 401 });
    const result = await fetchProfile(fakeFetch as typeof fetch);
    assert.equal(result.ok, false);
    assert.equal(result.user, null);
  },
  "profil: 200 mengembalikan nama pengguna": async () => {
    const fakeFetch = async () =>
      new Response(
        JSON.stringify({ success: true, data: { user: { name: "Albet" } } }),
        { status: 200 },
      );
    const result = await fetchProfile(fakeFetch as typeof fetch);
    assert.equal(result.user?.name, "Albet");
  },
};
```

### 3.4 Database Test

- Untuk RLS, gunakan Supabase lokal (`npx supabase start`).
- Jalankan `npx supabase db reset` sebelum suite.
- Uji dengan dua pengguna berbeda: pastikan pengguna A tidak dapat membaca baris pengguna B.
- Dilarang menjalankan test RLS pada project Supabase production.

---

## 4. End-to-End Test (Playwright)

### 4.1 Status

Playwright belum menjadi dependency proyek. Playwright hanya tersedia di dalam skill tooling `.agents/skills/video-demo`. Bila E2E diaktifkan, pasang sebagai dev dependency proyek.

```bash
npm install -D @playwright/test
npx playwright install
```

### 4.2 Skenario Kritis

Alur utama:

1. Login username dan password berhasil.
2. Login Google berhasil (bila dikonfigurasi).
3. Masuk ke hub permainan dan memilih game.
4. Menyelesaikan satu level hingga menang.
5. Menekan Next Level dan memastikan level bertambah.
6. Keluar dan memastikan state sesi bersih.

Skenario error:

1. Tiket habis: tombol mulai permainan menampilkan pesan dan tidak memotong tiket.
2. Koneksi terputus: tampil pesan gagal, tidak ada data yang hilang.
3. Tab blur: permainan otomatis pause dan timer berhenti.
4. Sesi kedaluwarsa: pengguna diarahkan ke halaman login, bukan menampilkan nama default.

### 4.3 Aturan

- E2E memakai backend lokal atau mock, bukan production.
- Setiap skenario wajib memiliki assertion yang terlihat pengguna, bukan hanya cek elemen ada.
- Gunakan selector berbasis peran atau teks yang stabil. Hindari selector berbasis kelas CSS.
- Screenshot dan trace disimpan sebagai artefak saat gagal.
- Jalankan E2E sebelum rilis besar, bukan pada setiap commit.

---

## 5. Pre-PR dan Pre-Commit Checklist

Wajib lulus sebelum push:

- `npm run build` lulus. Perintah ini menjalankan `tsc -b` dan build Vite.
- `npm run lint` lulus tanpa error baru.
- `npm test` lulus.
- Untuk perubahan backend: `go vet ./...` dan `go test ./...` lulus dari folder `server`.
- Tidak ada `console.log` sisa debug. Log yang disengaja harus memakai prefix yang jelas, misalnya `[AuthContext]`.
- Tidak ada `any` baru di TypeScript. Bila tidak terhindarkan, beri alasan satu baris.
- Tidak ada `@ts-ignore` atau `eslint-disable` tanpa alasan tertulis.
- Tidak ada secret, token, atau kredensial di diff.
- Tidak ada file besar hasil build (`dist/`) yang ikut di-commit.
- Migrasi database berupa file `.sql` baru, bukan perubahan pada migrasi lama.
- Teks Arab mengikuti pedoman tipografi.

Perintah ringkas:

```bash
npm run build && npm run lint && npm test
```

---

## 6. Panduan Playtest Manual

### 6.1 Tujuan

Playtest mengukur pemahaman materi, bukan hanya skor. Anak yang menang dengan menebak belum tentu paham.

### 6.2 Pertanyaan Observasi

Sebelum bermain:

- Apakah anak memahami instruksi tanpa dibacakan orang dewasa?
- Apakah anak mengenali huruf atau harakat target sebelum menekan?
- Apakah anak ragu lebih dari tiga detik pada target pertama?

Saat bermain:

- Apakah anak membaca target dengan suara, atau hanya menebak?
- Apakah anak memperbaiki jawaban setelah mendapat umpan balik?
- Apakah anak memahami mengapa jawabannya salah?
- Apakah anak melihat animasi atau suara sebagai pengalih perhatian?
- Apakah teks Arab terlihat utuh, tanpa harakat terpotong?

Setelah bermain:

- Apakah anak dapat menyebutkan huruf atau harakat yang dilatih?
- Apakah anak meminta mengulang level yang sama karena ingin memahami?
- Apakah anak menunjukkan frustrasi pada level tertentu?
- Apakah kesulitan berasal dari materi atau dari antarmuka?

Catat:

- Usia anak.
- Level dan game yang dimainkan.
- Waktu per level.
- Jumlah jawaban benar dan salah.
- Kutipan langsung dari anak bila ada.

### 6.3 Formulir Pelaporan Bug

```text
Judul:
Tanggal:
Penguji:
Environment (lokal/staging/production):
Perangkat dan browser:
Akun (role):

Langkah reproduksi:
1.
2.
3.

Expected behavior:
Actual behavior:

Frekuensi (selalu/sering/jarang):
Tingkat keparahan (kritis/tinggi/sedang/rendah):
Bukti (screenshot, rekaman layar, log konsol):
Catatan tambahan:
```

Aturan:

- Laporkan satu bug per formulir.
- Sertakan langkah reproduksi yang dapat dijalankan orang lain.
- Bedakan bug fungsional dan masalah konten edukasi.
- Bug yang menyangkut materi salah ajarkan berstatus kritis.
