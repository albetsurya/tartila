# TARTILA BACKGROUND & ILLUSTRATION GUIDELINES

**Dokumen:** `docs/TARTILA_BACKGROUND_GUIDELINES.md`  
**Status:** Design System Guideline / SSOT  
**Versi:** 1.0  
**Cakupan:** Seluruh aplikasi Tartila — Panel Santri, Panel Ustadz, halaman eksplorasi, pembelajaran Tilawati, game, arena multiplayer, modal, dan halaman pendukung.

---

## 1. Tujuan Dokumen

Dokumen ini menetapkan standar penggunaan background, pola dekoratif, ilustrasi, ornamen, dan lapisan visual pada aplikasi Tartila.

Tujuan utamanya adalah menjaga agar Tartila terasa sebagai satu produk dengan identitas visual yang konsisten, tetapi tetap menyesuaikan kebutuhan setiap konteks penggunaan.

Background tidak boleh sekadar menjadi hiasan. Background harus membantu membangun suasana, memperjelas struktur halaman, dan mendukung fokus pengguna.

### Prinsip utama

> **Background memberikan suasana. Ilustrasi memberikan karakter. Komponen memberikan informasi. Konten pembelajaran tetap menjadi pusat perhatian.**

### Keputusan desain utama

Tartila menggunakan pendekatan **Hybrid Illustrated Background**:

- Background dasar cenderung polos dan lembut.
- Pola dekoratif digunakan secara tipis dan selektif.
- Ilustrasi digunakan pada area yang memang membutuhkan karakter atau konteks visual.
- Card, form, tabel, teks, dan konten penting harus tetap memiliki bidang yang jelas dan mudah dibaca.
- Ilustrasi tidak boleh bersaing dengan informasi atau interaksi utama.

Hindari dua ekstrem berikut:

1. **Terlalu polos:** seluruh halaman hanya berupa bidang warna tanpa karakter, sehingga terasa generik dan monoton.
2. **Terlalu ramai:** seluruh halaman dipenuhi pemandangan, karakter, ornamen, dan tekstur sehingga informasi sulit dipindai.

---

## 2. Identitas Visual Berdasarkan Peran Pengguna

Tartila memiliki satu identitas merek, tetapi dua pengalaman antarmuka utama.

### 2.1 Panel Santri — Playful Neo-Brutalism

Karakter:

- Ceria, hangat, bersahabat, dan eksploratif.
- Mendorong rasa ingin tahu serta semangat belajar.
- Boleh menggunakan ilustrasi karakter, objek belajar, dan ornamen tematik.
- Warna pastel dan aksen cerah digunakan secara terukur.
- Elemen dekoratif lebih ekspresif, tetapi tidak boleh mengganggu pembelajaran.

Background yang direkomendasikan:

- Mint lembut sebagai dasar.
- Pola titik, bintang, awan, atau bentuk geometris dengan opacity rendah.
- Ilustrasi Bibi/Tila dan objek tematik pada hero, empty state, onboarding, dan area eksplorasi.
- Background tematik yang lebih ekspresif hanya pada halaman permainan atau dunia eksplorasi tertentu.

### 2.2 Panel Ustadz — Professional Neo-Brutalism

Karakter:

- Profesional, tenang, terstruktur, efisien, dan mudah dipindai.
- Mengutamakan keterbacaan serta kepadatan informasi yang sehat.
- Ilustrasi hanya digunakan untuk empty state, onboarding, bantuan kontekstual, dan highlight tertentu.
- Background utama cenderung polos.
- Aksen Neo-Brutalism digunakan pada CTA atau komponen prioritas, bukan semua elemen.

Background yang direkomendasikan:

- Slate sangat muda atau putih hangat.
- Pola dekoratif global biasanya tidak diperlukan.
- Ornamen hanya digunakan bila memberikan konteks dan tidak mengurangi ruang baca.

### 2.3 Konsistensi lintas peran

Kedua panel harus mempertahankan:

- Identitas teal Tartila.
- Keluarga tipografi yang sama.
- Bahasa bentuk dan ikon yang konsisten.
- Prinsip kontras, aksesibilitas, dan hierarki informasi yang sama.

Jangan menyalin intensitas ilustrasi Panel Santri ke Panel Ustadz. Jangan pula membuat Panel Santri menjadi dashboard administrasi yang terlalu kaku.

---

## 3. Sistem Warna Background

Gunakan token warna berikut sebagai acuan. Bila proyek telah memiliki CSS variables atau theme tokens, gunakan token pusat tersebut dan hindari hardcode berulang pada banyak komponen.

### 3.1 Warna dasar

| Token | Hex | Penggunaan |
|---|---|---|
| `tartila-bg-primary` | `#F0FDF4` | Background utama Panel Santri |
| `tartila-bg-secondary` | `#ECFDF5` | Area alternatif yang lembut |
| `tartila-bg-surface` | `#FFFFFF` | Card, modal, form, dan area konten |
| `tartila-bg-teal` | `#134E4A` | Hero atau area highlight gelap |
| `tartila-bg-mint` | `#CCFBF1` | Highlight aktif dan panel pendukung |
| `tartila-bg-yellow` | `#FEF9C3` | Area aktivitas atau perayaan ringan |
| `tartila-bg-blue` | `#E0F2FE` | Area eksplorasi atau informasi |
| `tartila-bg-peach` | `#FFF1E6` | Aksen pendukung |
| `tartila-bg-admin` | `#F8FAFC` | Background utama Panel Ustadz |

### 3.2 Warna identitas

| Token | Hex | Penggunaan |
|---|---|---|
| `tartila-primary` | `#134E4A` | Brand, heading, border utama |
| `tartila-primary-action` | `#0D9488` | CTA dan elemen interaktif |
| `tartila-accent-yellow` | `#FEF08A` | Highlight |
| `tartila-accent-coral` | `#FF6B6B` | Peringatan atau aksen penting |

### 3.3 Aturan penggunaan warna

- Jangan memberi warna background berbeda pada setiap section tanpa alasan informasi atau navigasi.
- Gunakan warna pastel untuk membedakan kelompok konten, bukan sebagai dekorasi acak.
- Card utama sebaiknya tetap putih atau surface yang memiliki kontras jelas dari background.
- Warna gelap seperti `#134E4A` digunakan sebagai area fokus, bukan sebagai latar semua halaman.
- Hindari gradasi mencolok atau multi-stop gradient yang membuat tampilan terasa tidak konsisten.

---

## 4. Tiga Jenis Background

Tartila memiliki tiga jenis background dasar dan dua jenis khusus.

### 4.1 `plain` — Background polos

Gunakan ketika pengguna harus fokus pada teks, data, atau tugas tertentu.

Karakter:

- Satu warna dasar atau variasi warna yang sangat lembut.
- Tidak menggunakan ilustrasi latar yang dominan.
- Boleh memiliki pembatas section atau aksen kecil.
- Fokus visual berada pada konten.

Penggunaan:

- Membaca halaman Tilawati.
- Latihan huruf dan harakat.
- Form dan pengaturan.
- Profil.
- Tabel, daftar, dan halaman administrasi.
- Modal yang berisi instruksi atau data penting.

### 4.2 `soft-pattern` — Background bermotif halus

Ini adalah pilihan default untuk sebagian besar halaman umum Panel Santri.

Karakter:

- Warna dasar mint atau pastel.
- Motif geometris sederhana seperti titik, bintang kecil, garis lengkung, atau bentuk abstrak.
- Motif memiliki kontras sangat rendah.
- Motif tidak menutupi area konten utama.

Penggunaan:

- Beranda Ngaji Ceria.
- Halaman profil atau menu umum yang tetap membutuhkan suasana ramah.
- Halaman hub atau daftar fitur.
- Halaman informasi yang tidak memerlukan fokus membaca intensif.

### 4.3 `illustrated` — Background dengan ilustrasi selektif

Gunakan ketika ilustrasi membantu anak memahami konteks atau membangun suasana halaman.

Karakter:

- Ilustrasi berada di sudut, area hero, bagian bawah, atau area kosong yang tidak berisi informasi.
- Ilustrasi tidak menjadi wallpaper penuh di belakang semua teks.
- Gunakan aset ilustrasi Tartila yang konsisten.
- Card informasi tetap memakai surface solid.

Penggunaan:

- Jelajah dan peta fitur.
- Onboarding.
- Empty state.
- Halaman tema tertentu.
- Hero event atau promosi edukatif.

### 4.4 `immersive` — Background tematik untuk pengalaman bermain

Gunakan pada game atau dunia eksplorasi yang memang membutuhkan suasana khusus.

Karakter:

- Tema visual dapat lebih kuat daripada halaman umum.
- Background boleh menggambarkan dunia, lokasi, atau atmosfer permainan.
- HUD, target, kontrol, dan teks harus tetap memiliki lapisan kontras yang jelas.
- Background tidak boleh mengurangi keterbacaan huruf Arab dan harakat.

Penggunaan:

- Gameplay.
- Arena multiplayer.
- Dunia permainan.
- Lab atau pengalaman interaktif.

### 4.5 `celebration` — Background perayaan

Gunakan hanya pada momen pencapaian.

Karakter:

- Aksen warna hangat, bintang, konfeti, cahaya, atau ilustrasi reward.
- Durasi dan jumlah animasi dibatasi.
- Tombol tindakan tetap menjadi fokus.
- Jangan menjadikan layar perayaan sebagai halaman yang harus ditunggu lama.

Penggunaan:

- Achievement.
- Penyelesaian jilid.
- Hasil tantangan.
- Reward atau misi selesai.

---

## 5. Matriks Penggunaan Background per Halaman

| Halaman / Fitur | Background utama | Ilustrasi | Catatan |
|---|---|---|---|
| Beranda Santri | `soft-pattern` | Maskot pada hero | Dasar mint; card solid |
| Jelajah | `illustrated` | Ilustrasi tema fitur | Ilustrasi membantu orientasi |
| Petualangan Tilawati | `plain` atau `soft-pattern` | Ilustrasi jilid secara selektif | Jangan mengganggu progres |
| Membaca Tilawati | `plain` | Minimal atau tanpa ilustrasi | Fokus pada teks Arab dan harakat |
| Latihan huruf/harakat | `plain` | Objek latihan saja | Area latihan harus kontras |
| Games Hub | `soft-pattern` | Cover game | Ilustrasi berada di kartu |
| Gameplay | `immersive` | Objek game | HUD harus tetap terbaca |
| Peta Rank | `plain` atau `soft-pattern` | Badge rank | Badge adalah fokus |
| Profil Santri | `plain` atau `soft-pattern` | Avatar dan aksesoris | Jangan membuat latar terlalu ramai |
| Warung Santri | `soft-pattern` | Ilustrasi barang | Item dan harga lebih penting |
| Doa | `plain` | Ornamen geometris minimal | Hormati fokus dan teks Arab |
| Arena Lobby | `soft-pattern` atau `immersive` ringan | Ilustrasi mode | PIN dan daftar pemain harus jelas |
| Arena Gameplay | `immersive` | Tema game | Informasi soal dan jawaban paling dominan |
| Modal umum | `plain` | Ikon atau ilustrasi kecil | Hindari wallpaper di modal |
| Empty state | `plain` atau `illustrated` | Satu ilustrasi kontekstual | Sertakan langkah berikutnya |
| Panel Ustadz | `plain` | Selektif | Prioritaskan data dan produktivitas |

Jika sebuah halaman memiliki beberapa bagian dengan kebutuhan berbeda, gunakan background per-section, bukan memaksakan satu ilustrasi global.

---

## 6. Aturan Penempatan Ilustrasi

### 6.1 Area yang disarankan

Ilustrasi sebaiknya ditempatkan pada:

- Hero section.
- Sudut kanan atau kiri section sebagai ornamen.
- Empty state.
- Onboarding dan tutorial.
- Cover kartu fitur atau game.
- Kartu pencapaian.
- Area dekoratif yang tidak mengandung teks atau kontrol.

### 6.2 Area yang harus dihindari

Jangan menempatkan ilustrasi dekoratif:

- Di belakang teks panjang.
- Di belakang angka penting atau statistik.
- Di belakang tombol utama.
- Di belakang form input.
- Di belakang tabel atau daftar padat.
- Di belakang target huruf Arab atau harakat.
- Pada area yang memiliki banyak kontrol sentuh.

### 6.3 Hierarki ilustrasi

Gunakan satu ilustrasi utama per section. Ornamen tambahan hanya berfungsi sebagai pendukung.

Hindari menampilkan banyak karakter besar dalam satu viewport karena dapat membuat fokus visual terpecah.

### 6.4 Aset ilustrasi

Prioritaskan aset resmi Tartila seperti Bibi, Tila, karakter, objek Tilawati, badge, dan ilustrasi permainan.

Jangan mencampurkan secara sembarangan:

- Ilustrasi 3D realistis.
- Stock illustration.
- Ikon outline tipis.
- Karakter kartun dengan gaya yang sangat berbeda.
- Emoji sebagai pengganti ikon utama.

Ilustrasi baru harus mengikuti bahasa visual Tartila: bentuk sederhana, ramah, warna solid, outline yang konsisten, dan detail yang tidak berlebihan.

---

## 7. Intensitas Visual dan Opacity

Angka berikut adalah titik awal desain yang perlu diuji pada perangkat sebenarnya, bukan aturan matematis mutlak.

| Elemen | Intensitas awal | Ketentuan |
|---|---:|---|
| Pola background global | 2–4% opacity | Sangat subtle |
| Watermark ilustrasi | 5–12% opacity | Hanya ornamen |
| Ilustrasi pada hero | 100% opacity | Boleh dominan tetapi tidak menutupi CTA |
| Ilustrasi empty state | 100% opacity | Harus mendukung pesan |
| Ornamen kecil | 20–50% opacity | Sesuai kontras dan konteks |
| Overlay dekoratif di belakang card | Maksimal seperlunya | Tidak boleh mengurangi kontras card |

Ketentuan tambahan:

- Jika pola masih sangat terlihat saat pengguna membaca teks, kurangi opacity atau hilangkan.
- Jangan mengandalkan opacity untuk memperbaiki ilustrasi yang salah penempatan. Pindahkan ilustrasinya.
- Jangan mengurangi opacity konten interaktif, teks utama, atau informasi status.
- Pastikan ilustrasi latar tidak membuat warna teks kehilangan kontras.

---

## 8. Aturan Background untuk Konten Arab dan Pembelajaran

Bagian ini bersifat prioritas tinggi karena Tartila mengajarkan membaca huruf Arab dan Tilawati.

### 8.1 Area membaca

- Gunakan bidang polos atau hampir polos.
- Utamakan putih atau mint yang sangat lembut.
- Jangan gunakan motif di belakang teks Arab.
- Jangan menempatkan ilustrasi yang berdekatan dengan tanda harakat.
- Berikan ruang yang cukup untuk tinggi baris dan tanda di atas/bawah huruf.
- Pastikan font Arab dan rendering harakat sudah tervalidasi.

### 8.2 Area latihan

- Latar target dan pilihan jawaban harus solid.
- State benar/salah tidak boleh dibedakan melalui warna saja; tambahkan ikon, label, atau bentuk.
- Efek visual benar/salah harus singkat dan tidak menutupi karakter.
- Animasi tidak boleh mengaburkan teks saat anak sedang mengenali huruf.

### 8.3 Doa dan materi keislaman

- Gunakan background yang tenang.
- Ornamen geometris atau islami boleh digunakan di pinggir konten.
- Hindari dekorasi yang terlalu dekat dengan teks Arab.
- Pastikan kontras dan penghormatan terhadap materi tetap terjaga.

---

## 9. Batasan Neo-Brutalism pada Background

Neo-Brutalism Tartila bukan berarti semua layer harus memiliki border tebal, shadow keras, atau warna kontras tinggi.

### Gunakan Neo-Brutalism pada:

- Card interaktif yang menjadi fokus.
- Tombol CTA.
- Badge pencapaian.
- Highlight section.
- Hero dan kartu fitur tertentu.
- Elemen permainan yang membutuhkan feedback kuat.

### Jangan gunakan secara berlebihan pada:

- Background global.
- Motif dekoratif.
- Semua section sekaligus.
- Form panjang.
- Tabel padat.
- Konten membaca.
- Setiap lapisan di dalam modal.

Background harus menjadi panggung yang tenang. Neo-Brutalism lebih banyak diekspresikan melalui komponen dan interaksi, bukan dengan membuat seluruh canvas penuh kontras.

---

## 10. Spacing, Layering, dan Keterbacaan

### 10.1 Layering yang disarankan

Urutan visual umum:

1. Background dasar.
2. Pola dekoratif atau ilustrasi latar dengan `pointer-events: none`.
3. Section dan surface utama.
4. Konten, teks, dan kontrol.
5. Overlay modal atau dialog ketika dibutuhkan.

Dekorasi latar tidak boleh menangkap input pointer atau menutupi elemen interaktif.

### 10.2 Spacing awal

| Konteks | Rekomendasi |
|---|---:|
| Page padding mobile | 12–16px |
| Page padding tablet | 20–24px |
| Page padding desktop | 24–32px |
| Jarak section umum | 16–24px |
| Jarak antar-card | 12–16px |
| Card padding | 12–20px |

Jangan menambah tinggi halaman hanya untuk memberi ruang pada ilustrasi. Ilustrasi harus menyesuaikan komposisi konten, bukan sebaliknya.

### 10.3 Kepadatan konten

- Hindari white space berlebihan yang tidak mempunyai tujuan.
- Hindari juga menumpuk ilustrasi dan kartu tanpa jeda.
- Gunakan ukuran ilustrasi sesuai kebutuhan informasi.
- Pastikan konten penting tetap terlihat pada viewport awal bila memungkinkan.

---

## 11. Responsivitas

Background dan ilustrasi harus dirancang untuk mobile terlebih dahulu karena aplikasi Tartila banyak digunakan pada perangkat seluler.

### Mobile

- Kurangi atau hilangkan ilustrasi besar yang memakan area konten.
- Pindahkan ornamen ke sudut yang tidak mengganggu.
- Jangan memaksakan ilustrasi horizontal yang menyebabkan overflow.
- Gunakan `object-contain` untuk ilustrasi yang harus terlihat utuh.
- Pertahankan ukuran target sentuh dan keterbacaan.

### Tablet

- Boleh menampilkan ilustrasi hero yang lebih besar.
- Pastikan ilustrasi tidak mengambil ruang berlebihan dari grid konten.
- Sesuaikan posisi ornamen terhadap perubahan layout.

### Desktop

- Ilustrasi dapat digunakan lebih leluasa di sisi hero atau area kosong.
- Hindari background dekoratif yang terlalu besar sehingga konten tampak kecil.
- Pertahankan batas lebar konten agar komposisi tidak melebar tanpa kendali.

Gunakan breakpoint berdasarkan kebutuhan layout proyek, bukan sekadar memperbesar semua aset secara proporsional.

---

## 12. Dark Mode

Jika sebuah halaman mendukung dark mode, background harus memiliki padanan yang dirancang secara sengaja.

Ketentuan:

- Jangan membalik warna semua gambar atau SVG secara otomatis.
- Pola dekoratif harus diturunkan kontrasnya agar tidak menyilaukan.
- Ilustrasi harus diperiksa agar tetap terlihat di atas surface gelap.
- Card dan teks harus memiliki kontras yang memadai.
- Jangan mencampur surface dark dengan elemen white yang terlalu terang tanpa alasan.
- Halaman membaca Arab tetap harus menjaga kejelasan huruf dan harakat.

Jika suatu halaman belum memiliki dark mode yang konsisten, jangan menambahkan background dark parsial yang menyebabkan sebagian komponen tetap menggunakan palet light.

---

## 13. Motion dan Dekorasi Animatif

Animasi dekoratif harus sangat selektif.

Boleh digunakan:

- Gerakan maskot yang ringan pada hero.
- Sparkle sesaat pada achievement.
- Konfeti pendek ketika menyelesaikan tantangan.
- Pergerakan dekorasi yang sangat pelan pada halaman eksplorasi.

Hindari:

- Bintang atau objek yang terus bergerak di belakang teks.
- Animasi loop yang tidak memberikan informasi.
- Parallax berlebihan.
- Background yang berubah-ubah sehingga mengganggu fokus.
- Gerakan yang menyebabkan pengguna kehilangan posisi membaca.

Hormati `prefers-reduced-motion`. Saat preferensi tersebut aktif, hilangkan atau sederhanakan gerakan dekoratif yang tidak esensial.

---

## 14. Aksesibilitas dan Keterbacaan

- Background tidak boleh menjadi satu-satunya pembeda status.
- Informasi penting harus tetap terbaca tanpa ilustrasi.
- Teks dan kontrol harus memiliki kontras memadai.
- Ilustrasi dekoratif harus menggunakan `aria-hidden="true"` atau alt kosong bila memang tidak menyampaikan informasi.
- Ilustrasi informatif harus mempunyai teks alternatif yang relevan.
- Jangan menempatkan ornamen di atas tombol atau target sentuh.
- Pastikan dekorasi memiliki `pointer-events: none`.
- Uji pada layar kecil dan kondisi pencahayaan yang berbeda.

---

## 15. Performa dan Optimasi Aset

Background dekoratif dapat menambah waktu muat dan konsumsi memori, terutama pada perangkat Android kelas bawah.

Aturan:

1. Prioritaskan SVG untuk ornamen vektor sederhana.
2. Gunakan WebP atau AVIF untuk ilustrasi raster yang sesuai.
3. Hindari gambar background beresolusi sangat besar untuk ornamen kecil.
4. Hindari banyak layer gambar besar dalam satu halaman.
5. Lazy-load ilustrasi di bawah fold jika sesuai.
6. Jangan lazy-load elemen visual utama yang dibutuhkan untuk first paint tanpa alasan.
7. Hindari animasi filter blur besar yang terus berjalan.
8. Gunakan CSS gradient sederhana untuk pola ringan jika cukup.
9. Pastikan aset memiliki ukuran intrinsik atau aspect ratio agar layout tidak bergeser.
10. Jangan menambahkan dependency hanya untuk menampilkan dekorasi sederhana.

Target optimasi harus diuji pada perangkat dan jaringan yang merepresentasikan pengguna Tartila.

---

## 16. Arsitektur Komponen Background Reusable

Background sebaiknya disediakan sebagai sistem reusable, bukan dibuat dengan kelas Tailwind yang berbeda-beda di setiap halaman.

Contoh API konseptual:

```tsx
<NgajiCeriaLayout
  title={<TartilaLogo />}
  backgroundVariant="soft-pattern"
>
  {children}
</NgajiCeriaLayout>
```

Varian yang disarankan:

```ts
type BackgroundVariant =
  | "plain"
  | "soft-pattern"
  | "illustrated"
  | "immersive"
  | "celebration";
```

Contoh implementasi konseptual:

```tsx
interface PageBackgroundProps {
  variant?: BackgroundVariant;
  children: React.ReactNode;
  className?: string;
}
```

Ketentuan arsitektur:

- Komponen background hanya mengelola lapisan visual, bukan business logic halaman.
- Background dekoratif tidak boleh mengubah event handler atau struktur navigasi.
- Varian harus mempunyai token warna dan aturan penempatan yang konsisten.
- Ilustrasi spesifik halaman lebih baik ditempatkan di section halaman, bukan dimasukkan ke background global.
- Jangan memaksa `NgajiCeriaLayout` menampilkan ilustrasi yang sama di semua route.
- Pastikan halaman gameplay dapat menggunakan background immersive yang berbeda dari halaman biasa.
- Jika ada `themeScope` atau `immersiveRealm`, integrasikan dengan sistem tema yang sudah ada dan jangan membuat sistem tema paralel.

### Contoh pola titik yang subtle

```tsx
<div className="relative min-h-screen overflow-hidden bg-[#F0FDF4]">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.035]"
    style={{
      backgroundImage:
        "radial-gradient(#134E4A 1.5px, transparent 1.5px)",
      backgroundSize: "24px 24px",
    }}
  />

  <main className="relative z-10">{children}</main>
</div>
```

Contoh di atas hanya referensi. Jangan menambahkan pattern ke semua halaman secara otomatis. Gunakan hanya untuk varian yang sesuai.

---

## 17. Design Review Checklist

Sebelum sebuah background atau ilustrasi dinyatakan selesai, periksa hal-hal berikut.

### Hierarki dan fokus

- [ ] Apakah pengguna langsung mengetahui fokus utama halaman?
- [ ] Apakah background hanya mendukung konten?
- [ ] Apakah ilustrasi mempunyai tujuan yang jelas?
- [ ] Apakah ada lebih dari satu ilustrasi utama yang saling bersaing?
- [ ] Apakah dekorasi membuat halaman terasa terlalu ramai?

### Keterbacaan

- [ ] Apakah teks tetap mudah dibaca?
- [ ] Apakah card dan form mempunyai surface yang jelas?
- [ ] Apakah huruf Arab dan harakat bebas dari gangguan visual?
- [ ] Apakah status tidak hanya dibedakan dengan warna?

### Responsivitas

- [ ] Apakah ilustrasi tetap proporsional pada mobile?
- [ ] Apakah tidak ada overflow horizontal?
- [ ] Apakah ornamen tidak menutupi tombol?
- [ ] Apakah konten penting tetap memiliki ruang yang cukup?

### Performa dan aksesibilitas

- [ ] Apakah aset sudah dioptimalkan?
- [ ] Apakah dekorasi tidak menerima pointer event?
- [ ] Apakah alt text dan `aria-hidden` digunakan dengan benar?
- [ ] Apakah reduced motion diperhatikan?
- [ ] Apakah tampilan diuji pada perangkat mobile?

---

## 18. Aturan Wajib untuk Developer dan AI Agent

Setiap developer atau AI Agent yang mengubah background, layout, atau ilustrasi Tartila WAJIB mengikuti aturan berikut.

1. Baca dokumen ini sebelum mengubah sistem background global atau layout utama.
2. Audit implementasi background yang sudah ada sebelum membuat sistem baru.
3. Pertahankan warna dan identitas visual Tartila.
4. Gunakan `plain` untuk pengalaman membaca dan input yang membutuhkan fokus tinggi.
5. Gunakan `soft-pattern` sebagai opsi default untuk halaman umum Santri, bukan sebagai kewajiban di semua halaman.
6. Gunakan ilustrasi secara selektif dan berdasarkan fungsi.
7. Jangan menempatkan ilustrasi di belakang teks Arab, harakat, tabel, atau form.
8. Jangan membuat seluruh halaman menjadi full illustrated background.
9. Jangan menambahkan hard shadow dan border tebal pada lapisan background.
10. Pertahankan Panel Ustadz dengan karakter Professional Neo-Brutalism yang lebih tenang.
11. Gunakan komponen dan token reusable jika tersedia.
12. Jangan mengubah business logic, route, API, permission, atau state hanya untuk kebutuhan dekorasi.
13. Jangan mengganti atau menghapus aset yang sudah dipakai tanpa memeriksa seluruh referensinya.
14. Optimalkan aset untuk perangkat mobile.
15. Uji visual pada mobile, tablet, dan desktop.
16. Laporkan jika kebutuhan desain bertentangan dengan struktur tema atau layout yang sudah ada; jangan membuat asumsi yang mengubah perilaku aplikasi.

### Larangan

- Dilarang menambahkan ilustrasi hanya karena ada ruang kosong.
- Dilarang menggunakan background penuh detail pada halaman membaca.
- Dilarang menaruh teks penting di atas background yang ramai.
- Dilarang membuat setiap halaman memiliki tema warna dan gaya ilustrasi yang tidak berhubungan.
- Dilarang membuat maskot menjadi elemen permanen yang mengganggu Panel Ustadz.
- Dilarang mengorbankan performa atau aksesibilitas hanya demi dekorasi.

---

## 19. Acceptance Criteria

Implementasi background Tartila dianggap sesuai apabila:

1. Ada sistem background yang konsisten dan dapat digunakan ulang.
2. Background utama Panel Santri tetap ramah, lembut, dan memiliki karakter.
3. Panel Ustadz tetap bersih dan profesional.
4. Ilustrasi digunakan berdasarkan fungsi halaman.
5. Halaman membaca dan latihan mempertahankan fokus visual pada materi.
6. Card dan kontrol tetap memiliki kontras yang baik.
7. Tidak ada dekorasi yang menutupi konten atau interaksi.
8. Layout responsif dan tidak mengalami overflow.
9. Aset visual tidak menyebabkan penurunan performa yang tidak perlu.
10. Semua perubahan tetap mempertahankan fungsi aplikasi yang sudah ada.

---

## 20. Ringkasan Keputusan Final

| Area | Keputusan |
|---|---|
| Filosofi | Hybrid Illustrated Background |
| Background default Santri | Mint lembut dengan pola tipis secara selektif |
| Background default Ustadz | Polos, netral, profesional |
| Ilustrasi global | Tidak digunakan sebagai wallpaper penuh |
| Hero | Boleh memiliki ilustrasi besar |
| Card | Solid white atau pastel |
| Membaca Tilawati | Polos dan minim distraksi |
| Gameplay | Tematik dan immersive secara terukur |
| Empty state | Ilustrasi kontekstual |
| Achievement | Boleh menggunakan celebration background |
| Pola global | Subtle, titik awal opacity 2–4% |
| Watermark | Subtle, titik awal opacity 5–12% |
| Neo-Brutalism | Diekspresikan terutama melalui komponen, bukan background penuh |
| Mobile | Ilustrasi lebih hemat ruang dan tidak mengganggu konten |

**Keputusan akhir:** Tartila tidak menggunakan background polos sepenuhnya dan tidak menggunakan ilustrasi penuh di setiap halaman. Tartila menggunakan background dasar yang bersih dengan pola dan ilustrasi yang hadir secara selektif. Dengan pendekatan ini, aplikasi tetap terasa seperti dunia belajar yang menyenangkan bagi anak SD, tetapi tetap nyaman dan matang untuk pengguna SMP, SMA, serta pengajar.
