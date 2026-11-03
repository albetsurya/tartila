# 🎯 Master Plan: Redesign Pusat Latihan Tilawati (Pola Irama Rost)

## 1. Visi & Tujuan Pembelajaran

**Visi:** Santri tidak hanya menghafal nada tunggal (datar/naik/turun), tetapi menguasai **rangkaian pola irama (Rost)** sesuai kurikulum Tilawati nyata.
**Tujuan:**

1. Santri mengenal pola: 1 Nada (Datar), 2 Nada (Datar-Turun), 3 Nada (Datar-Naik-Turun).
2. Santri bisa menirukan (perform) pola secara ritmis.
3. Santri bisa mengaplikasikan pola pada bacaan Tilawati (Jilid 1-3) secara otomatis (terbiasa).

## 2. Pemetaan Fitur (3 Menu Utama)

Kita akan membagi 3 menu menjadi tahapan pembelajaran:

1. **Lab Irama (Kognitif & Motorik):** Fokus untuk _Mengenal & Menerampilkan_. Santri mendengar pola, melihat visual panah (→, ↗, ↘), dan mengetuk layar mengikuti ritme tersebut.
2. **Rhythm Memory (Memori):** Fokus untuk _Menghafal_. Santri mendengar urutan irama, lalu menebak urutan polanya (misal: Datar -> Naik -> Turun).
3. **Arena Kartu (Aplikasi):** Fokus untuk _Terbiasa_. Santri melihat teks Arab, mendengar audio asli (qari), dan harus memilih pola irama mana yang digunakan (misal: pola 2 nada).

## 3. Arsitektur Data & Audio (Wajib P0)

Sebelum UI diubah, kita **wajib** memperbaiki data sesuai _Audio Guidelines_ (Audit Report).

- **Buat `tilawatiTrainingAudioResolver.ts`**:
  - Fungsi ini akan menjadi jembatan tunggal untuk mencari audio.
  - Hapus semua _hardcode_ URL di `rhythmMemoryData.ts`, `arenaKartuData.ts`, dan `labIramaData.ts`.
  - Urutan pencarian audio: `TimelineEdits (editor_*.ogg)` -> `Baris (halX_baris_Y.ogg)` -> `Full (halX_isi_full.ogg)`.
- **Batasi Jilid 1-3**: Sembunyikan (disable) Jilid 4-6 di ketiga menu sampai audit paritas audio dengan `sambung-ngaji` selesai.
- **Tipe Data Baru**: Tambahkan properti `patternType: "1-datar" | "2-datar-turun" | "3-datar-naik-turun"` di setiap data soal/kartu.

## 4. Eksekusi Bertahap (Phased Execution)

### 🔴 Tahap 1: Perbaikan Fondasi (Audit P0)

- [ ] Buat file `tilawatiTrainingAudioResolver.ts`.
- [ ] Refactor `rhythmMemoryData.ts` & `arenaKartuData.ts` (hapus hardcode, gunakan resolver).
- [ ] Nonaktifkan Jilid 4-6 di UI Hub dan filter datanya di level _state_.

### 🟡 Tahap 2: Redesign Lab Irama (Fokus Pola)

- [ ] **Visual:** Ubah UI Lab Irama agar menampilkan "Peta Pola" (misal: [→] untuk Datar, [→ ↘] untuk Datar-Turun). Gunakan style Neo-Brutalism untuk panah/ikon ini.
- [ ] **Logika Ear Training:** Ubah agar bukan sekadar menebak nada, tapi menebak _rangkaian pola_.
- [ ] **Logika Tap the Beat:** Santri harus mengetuk mengikuti 3 ketukan (Datar-Naik-Turun). Umpan balik (hijau/merah) muncul per ketukan.
- [ ] **Audio:** Gunakan audio qari asli (via resolver) sebagai contoh, bukan sekadar _synth_.

### 🟢 Tahap 3: Redesign Rhythm Memory (Fokus Hafalan)

- [ ] Ubah mekanisme game. Saat audio diputar (misal pola Datar-Naik-Turun), santri harus menyusun kartu panah [→] [↗] [↘] di layar dengan benar.
- [ ] Tambahkan _feedback_ animasi jika urutan benar/salah.

### 🔵 Tahap 4: Redesign Arena Kartu (Fokus Aplikasi)

- [ ] Kartu tidak lagi hanya berisi huruf/teks.
- [ ] Sisi depan kartu: Teks Arab.
- [ ] Saat diklik (flip), audio qari diputar.
- [ ] Di bawahnya, ada kuis mini: "Irama apa yang barusan kamu dengar?" (Pilihan: 1 Nada, 2 Nada, 3 Nada).

## 5. Standar UI/UX (Neo-Brutalism)

- Semua tombol, panah, dan kartu wajib menggunakan border `border-[3px] border-[#134E4A]` dan _hard shadow_ `shadow-[4px_4px_0px_#134E4A]`.
- State aktif harus menggunakan `active:translate-y-[2px] active:shadow-none`.
- Warna panah: Datar (Teal `#0D9488`), Naik (Amber `#F59E0B`), Turun (Coral `#FF6B6B`).
