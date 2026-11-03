# Pedoman Tipografi Arab dan Konten

Dokumen ini menetapkan standar tampilan teks Arab, normalisasi Unicode, representasi harakat, rendering di game dan SVG, serta validasi audio. Tujuannya mencegah huruf terpotong, harakat hilang, bentuk huruf berubah, dan kesalahan pengucapan materi Tilawati.

## Daftar Isi

1. [Standar Font dan CSS Arab](#1-standar-font-dan-css-arab)
2. [Normalisasi Teks Arab (Unicode)](#2-normalisasi-teks-arab-unicode)
3. [Representasi Target Harakat Murni](#3-representasi-target-harakat-murni)
4. [Rendering Teks di Game dan SVG](#4-rendering-teks-di-game-dan-svg)
5. [Validasi Audio](#5-validasi-audio)
6. [Checklist Konten Arab](#6-checklist-konten-arab)

---

## 1. Standar Font dan CSS Arab

### 1.1 Font Wajib

Font yang wajib tersedia:

- `Amiri`: font utama untuk teks Arab.
- `Scheherazade New`: font cadangan dengan tinggi harakat yang lega.
- `Noto Naskh Arabic`: cadangan terakhir.
- `serif`: fallback sistem.

Kelas `font-arabic` di `src/index.css`:

```css
.font-arabic {
  font-family: "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif;
}
```

Aturan:

- Teks Arab selalu memakai kelas `font-arabic`. Dilarang memakai font Latin untuk teks Arab.
- DILARANG menambahkan `font-weight` di atas `800` pada teks Arab. Bobot terlalu tebal menumpuk harakat.
- DILARANG memakai `letter-spacing` positif besar pada teks Arab karena merusak penyambungan huruf.

### 1.2 Atribut Arah Teks

- Container teks Arab wajib memakai `dir="rtl"`.
- Untuk teks campuran Arab dan Latin, bungkus teks Arab dalam elemen sendiri dengan `dir="rtl"` dan `lang="ar"`.
- DILARANG memaksa `text-align: left` pada teks Arab.
- Untuk input pengguna, gunakan `dir="auto"` agar arah terdeteksi otomatis.

### 1.3 Line Height dan Tinggi Container

Harakat membutuhkan ruang vertikal di atas dan di bawah huruf. Tanpa ruang, tanda baca terpotong.

- `line-height` minimal `1.5` (setara `leading-normal` pada Tailwind).
- Untuk teks berharakat padat, gunakan `leading-relaxed` atau lebih.
- Container wajib memiliki `min-height` yang cukup, minimal `1.6em` dari ukuran font.
- DILARANG memakai `line-height` di bawah `1.2` pada teks Arab.

Contoh aman:

```html
<div
  dir="rtl"
  lang="ar"
  class="font-arabic leading-relaxed"
  style="min-height: 2em; padding: 0.25em 0.5em;"
>
  بِسْمِ اللّٰهِ
</div>
```

### 1.4 Larangan `overflow: hidden`

- DILARANG memakai `overflow: hidden` pada container yang memuat teks Arab berharakat.
- Bila perlu memotong konten, gunakan `overflow: visible` pada sumbu vertikal atau beri padding vertikal yang cukup.
- Untuk elemen dekoratif (balon, buah), gunakan padding internal, bukan pemotongan.
- `text-overflow: ellipsis` juga dilarang pada teks Arab karena memotong harakat dan menyembunyikan makna.

---

## 2. Normalisasi Teks Arab (Unicode)

### 2.1 Tujuan

Input pengguna dan data eksternal sering membawa karakter tak terlihat atau Tatweel yang tidak perlu. Karakter ini membuat perbandingan string gagal dan bentuk huruf melebar.

### 2.2 Fungsi Normalisasi

Gunakan helper yang sudah ada di `src/utils/arabic.ts`:

```ts
export function normalizeArabicText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/\u0640/g, "")
    .replace(/[\u200B-\u200F\uFEFF]/g, "")
    .trim();
}
```

Karakter yang dibersihkan:

| Karakter | Kode | Alasan |
| --- | --- | --- |
| Tatweel (Kashida) | `U+0640` | Melebarkan huruf, bukan bagian dari kata. |
| Zero Width Space | `U+200B` | Tidak terlihat, memutus pencocokan. |
| ZWNJ | `U+200C` | Memutus penyambungan huruf. |
| ZWJ | `U+200D` | Menyambung huruf secara tidak wajar. |
| LTR/RTL Mark | `U+200E`, `U+200F` | Mengacaukan arah teks. |
| BOM | `U+FEFF` | Muncul dari salin tempel. |

Aturan:

- Normalisasi dilakukan saat menerima input pengguna dan saat membandingkan string.
- Normalisasi TIDAK menghapus harakat. Harakat adalah bagian dari materi.
- Untuk perbandingan yang mengabaikan harakat, gunakan fungsi khusus yang mempertahankan huruf dan membuang tanda baca.
- Hasil normalisasi tidak boleh mengubah data sumber di database. Simpan data asli, normalisasi saat runtime.

### 2.3 Pemisahan `baseLetter` dan `harakat`

DILARANG menyimpan teks Arab sebagai satu string utuh bila logika game membutuhkan huruf dan tanda baca secara terpisah.

Struktur data yang benar:

```ts
type ArabicUnit = {
  baseLetter: string; // contoh: "ب"
  harakat: string;    // contoh: "َ"
  display: string;    // contoh: "بَ"
};
```

Aturan:

- `baseLetter` hanya berisi huruf tanpa tanda baca.
- `harakat` hanya berisi tanda baca, tanpa huruf.
- `display` adalah gabungan siap tampil. Nilainya diturunkan, bukan sumber kebenaran.
- Logika permainan membaca `baseLetter` dan `harakat` secara terpisah.
- Perbandingan huruf tidak boleh bergantung pada urutan visual string gabungan.
- Harakat yang tidak boleh dilepas: fathah, kasrah, dhammah, sukun, tasydid, tanwin, dan mad.

Contoh pemisahan:

```ts
const HARAKAT_PATTERN = /[\u064B-\u065F\u0670]/;

function splitArabicUnit(value: string): ArabicUnit {
  const baseLetter = value.replace(/[\u064B-\u065F\u0670]/g, "");
  const harakat = value.match(/[\u064B-\u065F\u0670]+/g)?.join("") ?? "";
  return { baseLetter, harakat, display: value };
}
```

---

## 3. Representasi Target Harakat Murni

### 3.1 Konsep

Mode "Harakat" melatih anak mengenali tanda baca, bukan huruf. Karena itu target ditampilkan sebagai garis datar dengan harakat, bukan huruf sungguhan.

Representasi yang dipakai di `TangkapHarakatGamePage.tsx`:

```ts
{ id: "fathah",  name: "Fathah",  sign: "َ", vowel: "a", symbol: "ــــَ" }
{ id: "kasrah",  name: "Kasrah",  sign: "ِ", vowel: "i", symbol: "ــــِ" }
{ id: "dhammah", name: "Dhammah", sign: "ُ", vowel: "u", symbol: "ــــُ" }
```

Tatweel `U+0640` dipakai sebagai anchor visual. Harakat ditempatkan di atas atau di bawah garis tersebut.

### 3.2 Mengapa Lebih Baik daripada Huruf Sungguhan

- Fokus materi tetap pada tanda baca. Huruf sungguhan mengalihkan perhatian anak.
- Bentuk konsisten antar target. Garis datar tidak berubah bentuk saat harakat berganti.
- Tidak ada ambiguitas bentuk huruf yang mirip, misalnya `ب` dan `ت`.
- Posisi harakat lebih mudah diamati karena tidak tertutup bentuk huruf.
- Penilaian jawaban menjadi sederhana: bandingkan kode harakat, bukan nama huruf.

### 3.3 Aturan Implementasi

- Gunakan jumlah Tatweel yang sama untuk semua target agar lebar seragam.
- Simpan `sign` sebagai kode harakat untuk perbandingan jawaban.
- Simpan `symbol` hanya untuk tampilan.
- DILARANG memakai huruf sungguhan sebagai target pada mode Harakat.
- Bila memakai Tatweel sebagai anchor, pastikan `normalizeArabicText` tidak dipakai pada string `symbol` karena akan menghapus Tatweel tersebut.

---

## 4. Rendering Teks di Game dan SVG

### 4.1 SVG

- Gunakan `dominantBaseline="central"` agar teks berada di tengah bentuk.
- Bila diperlukan, tambahkan `text-anchor="middle"` untuk perataan horizontal.
- DILARANG memakai `dominant-baseline` yang tidak didukung browser target tanpa fallback.
- Ukur ulang `font-size` setelah font Arab dimuat. Teks Arab lebih tinggi dari teks Latin pada ukuran yang sama.
- DILARANG memakai `clip-path` atau mask yang memotong area harakat.

Contoh:

```svg
<text
  x="50%"
  y="50%"
  text-anchor="middle"
  dominant-baseline="central"
  font-family="Amiri, Scheherazade New, serif"
  font-size="48"
  direction="rtl"
>
  بَ
</text>
```

### 4.2 HTML Overlay di Dalam Bentuk

Saat teks Arab ditempatkan di dalam balon, buah, atau kartu:

- Gunakan HTML overlay di atas SVG. Jangan merender teks Arab panjang di dalam path SVG yang sempit.
- Beri padding vertikal minimal `0.2em` di atas dan bawah teks.
- Gunakan `display: flex`, `align-items: center`, `justify-content: center`.
- Jangan memakai `overflow: hidden` pada wrapper teks.
- Untuk animasi pop atau scale, animasikan wrapper, bukan elemen teks, agar harakat tidak terpotong saat transformasi.
- Uji pada ukuran layar kecil dan pada mode zoom browser.

Contoh:

```html
<div class="relative">
  <svg aria-hidden="true" class="h-full w-full">...</svg>
  <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
    <span dir="rtl" lang="ar" class="font-arabic leading-relaxed">بَ</span>
  </div>
</div>
```

### 4.3 Pemeriksaan Visual

- Periksa huruf dengan harakat atas, harakat bawah, tasydid, dan tanwin.
- Periksa kata terpanjang pada setiap level, bukan hanya contoh pendek.
- Periksa pada font fallback. Bila font utama gagal dimuat, harakat tetap harus terlihat.

---

## 5. Validasi Audio

### 5.1 Sumber Tunggal

- Sumber audio Tilawati hanya dari `public/audio/tilawati/`.
- Folder tersebut adalah salinan satu banding satu dari repositori `sambung-ngaji/frontend/public/audio/tilawati/`.
- DILARANG memakai folder `public/audio/tilawati_modified/`. Folder tersebut sudah dihapus dan tidak boleh dibuat ulang.
- Setiap path audio baru wajib diverifikasi keberadaan berkasnya sebelum dipakai.
- DILARANG mengasumsikan jumlah baris per halaman. Jumlah klip bervariasi.

### 5.2 Larangan TTS Otomatis

- DILARANG memakai Text-to-Speech untuk pengucapan harakat atau materi Tilawati.
- TTS tidak menghasilkan makhraj yang benar, sehingga mengajarkan pengucapan yang salah.
- Audio pengganti hanya boleh berasal dari rekaman yang sudah divalidasi.
- Bila audio tidak tersedia, tampilkan materi sebagai latihan baca tanpa audio. Jangan mengisi kekosongan dengan TTS.

### 5.3 Penamaan dan Validasi

- Struktur folder: `jilid_<n>/hal<page>/<nama>.ogg`.
- Format berkas: Ogg Vorbis.
- Validasi path sebelum menyimpan: path harus diawali `/audio/tilawati/` dan tidak boleh keluar dari folder tersebut.
- Untuk pengecekan keberadaan berkas, gunakan `fs.existsSync` pada skrip Node atau editor lokal.

---

## 6. Checklist Konten Arab

Sebelum merge perubahan yang menyentuh teks Arab:

- Teks memakai kelas `font-arabic` dengan urutan font yang benar.
- Container memakai `dir="rtl"` dan `lang="ar"`.
- `line-height` minimal `1.5` dan container memiliki `min-height` cukup.
- Tidak ada `overflow: hidden` atau `text-overflow: ellipsis` pada teks Arab.
- Input pengguna dinormalisasi dengan `normalizeArabicText`.
- Logika game membaca `baseLetter` dan `harakat` terpisah, bukan string gabungan.
- Mode Harakat memakai Tatweel sebagai anchor, bukan huruf sungguhan.
- SVG memakai `dominant-baseline="central"`.
- Audio berasal dari `public/audio/tilawati/` dan berkasnya terverifikasi.
- Tidak ada TTS otomatis untuk materi Tilawati.
