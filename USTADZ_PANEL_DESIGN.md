# MASTER PROMPT: REDESIGN PANEL USTADZ TARTILA

## 1. PERAN DAN KONTEKS PROYEK

Bertindaklah sebagai Senior UI/UX Designer, Product Designer, dan Senior Frontend Engineer yang berpengalaman membangun aplikasi EdTech, Learning Management System (LMS), dan dashboard administrasi pendidikan.

Saya sedang mengembangkan aplikasi bernama **Tartila**, yaitu aplikasi pembelajaran membaca Al-Qur'an menggunakan metode Tilawati untuk anak usia Sekolah Dasar (SD) hingga Sekolah Menengah Pertama (SMP).

Aplikasi Tartila memiliki dua lingkungan pengguna utama:

1. Panel Santri: digunakan anak-anak untuk belajar, mengikuti petualangan Tilawati, bermain, memperoleh XP, mengumpulkan badge, dan meningkatkan kemampuan membaca.
2. Panel Ustadz: digunakan pengajar untuk mengelola kelas, santri, kehadiran, setoran bacaan, penilaian, tugas, materi, dan laporan pembelajaran.

Panel Santri sudah memiliki identitas visual **Playful Neo-Brutalism** dengan karakter ceria, warna teal, kuning, coral, ilustrasi, dan komponen gamifikasi.

Sekarang saya ingin melakukan redesign menyeluruh pada Panel Ustadz dengan pendekatan:

# PROFESSIONAL NEO-BRUTALISM

Panel Ustadz harus tetap menjadi bagian dari ekosistem Tartila. Jangan membuatnya terlihat seperti aplikasi berbeda, tetapi sesuaikan karakter visualnya agar lebih profesional, terstruktur, efisien, informatif, dan nyaman digunakan untuk aktivitas mengajar maupun administrasi.

**Prinsip utama:**

- Panel Santri = Playful Neo-Brutalism.
- Panel Ustadz = Professional Neo-Brutalism.
- Keduanya menggunakan satu identitas merek Tartila.

---

## 2. TUGAS UTAMA

Lakukan audit dan redesign terhadap seluruh halaman dan komponen Panel Ustadz yang sudah tersedia dalam source code proyek.

Jangan hanya mendesain ulang halaman dashboard. Bangun fondasi design system yang dapat diterapkan secara konsisten ke seluruh halaman Panel Ustadz.

Tahapan pekerjaan:

1. Audit struktur proyek dan identifikasi seluruh halaman Panel Ustadz.
2. Identifikasi layout, sidebar, bottom navigation, header, card, button, badge, tabel, form, modal, dropdown, dan komponen lainnya.
3. Identifikasi komponen yang dapat digunakan kembali.
4. Buat design system Professional Neo-Brutalism Tartila.
5. Redesign layout utama Panel Ustadz.
6. Redesign seluruh halaman berdasarkan design system tersebut.
7. Pastikan seluruh halaman konsisten pada desktop, tablet, dan mobile.
8. Verifikasi seluruh fungsi dan interaksi yang sudah ada.

Jangan langsung mengganti komponen sebelum memahami struktur dan dependensi yang sudah digunakan.

---

## 3. DESIGN DIRECTION

Gunakan konsep:

# Professional Neo-Brutalism with Clean Dashboard Experience

Karakteristik visual:

- Clean dan modern.
- Profesional tetapi tidak kaku.
- Mempertahankan identitas teal Tartila.
- Memiliki aksen Neo-Brutalism yang khas.
- Informasi mudah dipindai.
- Komponen tidak terlalu dekoratif.
- Tidak terlalu banyak white space.
- Tidak membuat halaman terasa padat atau sesak.
- Hierarki informasi harus jelas.

Gunakan prinsip komposisi visual:

- 75% tampilan fungsional dan bersih.
- 25% aksen Neo-Brutalism.

Angka ini merupakan pedoman visual, bukan batasan yang harus diterapkan secara matematis.

### Karakter Neo-Brutalism yang digunakan

Gunakan secara selektif:

- Border tegas.
- Hard shadow pada CTA dan elemen penting.
- Warna solid.
- Bentuk geometris sederhana.
- Kontras yang jelas.
- Tipografi tebal untuk heading.
- Interaksi hover dan active yang responsif.

HINDARI:

- Semua card memiliki border 3px.
- Semua komponen memiliki hard shadow.
- Warna mencolok di seluruh halaman.
- Terlalu banyak ilustrasi dekoratif.
- Terlalu banyak rounded pill.
- Animasi berlebihan.
- Tampilan seperti dashboard game anak.
- Ruang kosong terlalu besar.
- Komponen yang terlalu besar tanpa alasan fungsional.

---

## 4. DESIGN TOKENS DAN COLOR SYSTEM

Pertahankan warna utama identitas Tartila.

### Primary Colors

| Token          | Hex     | Kegunaan                               |
| -------------- | ------- | -------------------------------------- |
| Primary        | #134E4A | Identitas utama, heading, teks penting |
| Primary Action | #0D9488 | Tombol utama, navigasi aktif           |
| Primary Light  | #CCFBF1 | Background aktif dan highlight lembut  |
| Accent Yellow  | #FEF08A | Highlight dan perhatian                |
| Accent Coral   | #FF6B6B | Aksi penting dan peringatan            |

### Neutral Colors

| Token             | Hex     | Kegunaan                         |
| ----------------- | ------- | -------------------------------- |
| App Background    | #F8FAFC | Latar utama                      |
| Surface           | #FFFFFF | Card dan panel                   |
| Surface Secondary | #F1F5F9 | Header tabel dan area sekunder   |
| Border            | #DCE5E3 | Border standar                   |
| Text Primary      | #183B38 | Teks utama                       |
| Text Secondary    | #64748B | Deskripsi dan informasi tambahan |
| Disabled          | #94A3B8 | Elemen nonaktif                  |

### Semantic Colors

| Status    | Background | Text    |
| --------- | ---------- | ------- |
| Success   | #DCFCE7    | #166534 |
| Warning   | #FEF3C7    | #92400E |
| Danger    | #FEE2E2    | #B91C1C |
| Info      | #DBEAFE    | #1D4ED8 |
| Completed | #CCFBF1    | #0F766E |
| Neutral   | #F1F5F9    | #475569 |

Gunakan warna status secara konsisten di seluruh halaman.

Jangan menggunakan warna hanya untuk dekorasi. Setiap warna harus memiliki fungsi dan makna yang jelas.

---

## 5. TYPOGRAPHY

Pertahankan font utama Tartila:

**Plus Jakarta Sans**

Gunakan hierarki:

| Komponen        | Ukuran  |
| --------------- | ------- |
| Page Heading    | 24–28px |
| Section Heading | 18–20px |
| Card Heading    | 15–16px |
| Body Text       | 14–15px |
| Form Label      | 13–14px |
| Supporting Text | 12–13px |

Ketentuan:

- Heading menggunakan weight 700–800.
- Body menggunakan weight 400–500.
- Label menggunakan weight 600.
- Angka statistik dapat menggunakan weight 800.
- Hindari ukuran teks terlalu kecil.
- Pastikan kontras teks dapat dibaca.

Hindari penggunaan font dekoratif yang tidak diperlukan.

---

## 6. COMPONENT DESIGN SYSTEM

Bangun komponen reusable agar seluruh halaman memiliki tampilan konsisten.

### A. Card

Buat empat tipe card:

**1. Summary Card**

- Background putih.
- Border 1px.
- Radius 16px.
- Shadow minimal.
- Ikon dalam container kecil berwarna pastel.
- Angka statistik 26–30px.
- Label 13–14px.

**2. Action Card**

- Digunakan untuk tindakan yang sering dilakukan.
- Ikon mudah dikenali.
- Judul singkat.
- Deskripsi maksimal satu baris.
- Hover state yang jelas.
- Border 1–2px sesuai tingkat kepentingan.

**3. Data Card**

- Digunakan untuk kelas, santri, tugas, dan informasi pembelajaran.
- Layout compact.
- Informasi tersusun secara hierarkis.
- Aksi utama mudah ditemukan.

**4. Attention Card**

- Digunakan untuk informasi yang membutuhkan perhatian.
- Contoh: setoran menunggu penilaian, santri belum hadir, atau tugas belum selesai.
- Gunakan aksen warna kuning atau coral secara terukur.
- Sediakan CTA yang relevan.

### B. Button

Buat sistem button yang konsisten.

**Primary Button**

- Background #0D9488.
- Text putih.
- Border tegas.
- Radius 10–12px.
- Tinggi 44–48px.
- Hard shadow kecil hanya jika sesuai konteks.

**Secondary Button**

- Background putih.
- Border 1–2px.
- Text teal.
- Digunakan untuk tindakan sekunder.

**Outline Button**

- Background transparan.
- Border standar.
- Digunakan untuk filter dan pilihan.

**Danger Button**

- Background coral atau merah.
- Digunakan untuk tindakan destruktif.

Ketentuan:

- Ikon berukuran 18px.
- Padding horizontal konsisten.
- Hover, active, disabled, dan loading state harus tersedia.
- Jangan menggunakan banyak variasi radius dan tinggi tombol tanpa alasan.

### C. Badge

Gunakan badge sebagai indikator status, bukan dekorasi.

Contoh:

- Aktif.
- Menunggu.
- Selesai.
- Perlu Revisi.
- Nonaktif.
- Terlambat.

Spesifikasi:

- Bentuk pill.
- Tinggi 24–28px.
- Font 11–12px.
- Padding horizontal sekitar 10px.
- Background pastel.
- Warna teks kontras.
- Dot indikator opsional.

### D. Input dan Form

Standarkan seluruh input:

- Tinggi 44–48px.
- Label berada di atas input.
- Border 1px.
- Radius 10–12px.
- Focus ring teal.
- Helper text 12px.
- Error text merah.
- Jarak antar-field sekitar 16px.

Pastikan form tidak terlalu lebar pada desktop dan tetap nyaman digunakan pada mobile.

### E. Table

Gunakan:

- Header background #F1F5F9.
- Font header 12–13px semibold.
- Tinggi baris 52–60px.
- Border horizontal tipis.
- Hover background teal sangat lembut.
- Aksi berada di sisi kanan.
- Status menggunakan badge.

Pada mobile, tabel yang lebar harus menggunakan pendekatan card list atau layout responsif yang sesuai.

Jangan sekadar mengecilkan teks dan kolom hingga sulit dibaca.

### F. Modal dan Bottom Sheet

- Modal konfirmasi sederhana harus compact.
- Form panjang sebaiknya menggunakan halaman tersendiri atau bottom sheet dengan area scroll yang jelas.
- Gunakan overlay yang konsisten.
- CTA utama dan sekunder harus memiliki hierarki jelas.
- Modal harus responsif terhadap tinggi viewport.
- Pertahankan aksesibilitas keyboard dan focus management.

---

## 7. LAYOUT UTAMA

Redesign layout Panel Ustadz sebagai berikut.

### A. Desktop Layout

Gunakan sidebar permanen di sebelah kiri.

Spesifikasi:

- Lebar 240–256px.
- Background putih.
- Border kanan 1px.
- Logo Tartila di bagian atas.
- Menu dikelompokkan berdasarkan kategori.
- Menu aktif memiliki background teal pastel.
- Indikator aktif berupa garis teal di sisi kiri.
- Ikon konsisten.
- Label 13–14px.
- Area profil dan pengaturan di bagian bawah.

Contoh pengelompokan navigasi:

**UTAMA**

- Dashboard

**PENGAJARAN**

- Kelas
- Santri
- Penilaian
- Kehadiran
- Materi

**ADMINISTRASI**

- Laporan

**AKUN**

- Profil
- Pengaturan

Sesuaikan daftar menu dengan route dan fitur yang benar-benar tersedia di proyek. Jangan membuat menu palsu atau route baru tanpa kebutuhan.

Area konten harus memiliki lebar fleksibel dan spacing yang efisien.

### B. Tablet Layout

Gunakan sidebar yang dapat diciutkan.

Ketentuan:

- Sidebar dapat berubah menjadi icon-only.
- Konten tetap memiliki ruang yang cukup.
- Grid menyesuaikan lebar layar.
- Hindari overflow horizontal.

### C. Mobile Layout

Gunakan bottom navigation.

Rekomendasi lima menu utama:

1. Beranda.
2. Kelas.
3. Santri.
4. Penilaian.
5. Lainnya.

Menu lainnya dapat memuat:

- Kehadiran.
- Laporan.
- Materi.
- Profil.
- Pengaturan.

Gunakan hanya route yang benar-benar tersedia.

Karakter bottom navigation:

- Background putih.
- Border atas 1px.
- Tinggi sekitar 68–72px ditambah safe area.
- Ikon 21–23px.
- Label 11–12px.
- Item aktif memiliki background #CCFBF1.
- Ikon dan teks aktif menggunakan #134E4A.
- Tidak menggunakan hard shadow besar.
- Memperhatikan safe area perangkat.

Pastikan bottom navigation tidak menutupi konten atau tombol penting.

---

## 8. DASHBOARD USTADZ

Redesign dashboard agar memberikan gambaran aktivitas mengajar dengan cepat.

Saat membuka dashboard, ustadz harus dapat menjawab:

1. Apa yang perlu saya kerjakan hari ini?
2. Bagaimana kondisi kelas saya?
3. Santri mana yang membutuhkan perhatian?
4. Setoran mana yang perlu dinilai?
5. Bagaimana perkembangan pembelajaran santri?

Gunakan susunan berikut sebagai acuan.

### A. Welcome Header

Contoh:

Assalamu'alaikum, Ustadz Ahmad!

Selamat mengajar hari ini.

Tampilkan tanggal, informasi pengguna, dan pilihan kelas apabila fiturnya tersedia.

Header harus compact. Jangan membuat hero section terlalu tinggi.

### B. Summary Statistics

Contoh:

- Total Santri.
- Kelas Aktif.
- Setoran Menunggu Penilaian.
- Kehadiran Hari Ini.

Gunakan grid:

- Mobile: 2 kolom.
- Tablet: 2–3 kolom.
- Desktop: 4 kolom.

Jangan menampilkan angka dummy jika data belum tersedia.

### C. Quick Actions

Contoh:

- Tambah Santri.
- Catat Kehadiran.
- Periksa Setoran.
- Buat Tugas.

Gunakan action card atau button yang jelas.

### D. Attention Section

Prioritaskan data yang membutuhkan tindakan.

Contoh:

- Setoran menunggu penilaian.
- Santri yang belum melakukan setoran.
- Kehadiran bermasalah.
- Tugas yang belum selesai.

Sediakan CTA langsung menuju proses yang bersangkutan.

### E. Kelas Saya

Gunakan card grid yang menampilkan:

- Nama kelas.
- Jilid Tilawati.
- Jumlah santri.
- Jadwal.
- Nama pengajar.
- Status kelas.
- Aksi kelola kelas.

### F. Learning Progress

Tampilkan ringkasan progres pembelajaran kelas.

Gunakan grafik hanya jika memberikan informasi yang berguna.

Jangan memenuhi dashboard dengan grafik dekoratif yang tidak membantu pengambilan keputusan.

---

## 9. SPACING DAN INFORMATION DENSITY

Saya tidak ingin halaman terlalu banyak white space seperti dashboard yang terlalu minimalis.

Gunakan spacing yang terukur:

- Page padding desktop: 24–32px.
- Page padding mobile: 16px.
- Jarak section: 20–24px.
- Jarak antar-card: 12–16px.
- Card padding: 16–20px.
- Form field gap: 16px.

Hindari:

- Hero yang terlalu tinggi.
- Card dengan padding berlebihan.
- Jarak antarsection terlalu lebar.
- Heading yang menghabiskan terlalu banyak tempat.
- Grid dengan kartu terlalu besar tanpa alasan.

Tetapi jangan pula membuat seluruh elemen berhimpitan.

Targetkan **compact, readable, dan well-structured**.

---

## 10. ANIMATION DAN MICRO-INTERACTION

Gunakan Framer Motion apabila sudah digunakan dalam proyek.

Animasi harus mendukung interaksi, bukan sekadar hiasan.

Gunakan:

- Hover transition ringan.
- Active feedback pada tombol.
- Modal transition yang halus.
- Loading skeleton.
- Progress animation seperlunya.
- Toast notification.

Hindari:

- Animasi berulang yang tidak diperlukan.
- Elemen melompat terus-menerus.
- Animasi terlalu lambat.
- Efek parallax.
- Animasi yang mengganggu pembacaan data.

Hormati preferensi reduced motion.

Maskot Bibi/Tila tidak harus selalu muncul di Panel Ustadz. Gunakan pada onboarding, empty state tertentu, atau bantuan kontekstual saja.

---

## 11. RESPONSIVE DAN ACCESSIBILITY

Pastikan semua komponen berfungsi dengan baik di:

- Mobile: <640px.
- Tablet: 640–1024px.
- Desktop: >1024px.

Perhatikan:

- Touch target minimal sekitar 44px.
- Kontras teks.
- Focus state.
- Keyboard navigation.
- Label input.
- Semantic HTML.
- Screen reader.
- Reduced motion.
- Safe area mobile.
- Overflow horizontal.

Jangan hanya memastikan tampilan bagus di desktop.

Uji juga penggunaan nyata pada layar mobile.

---

## 12. ATURAN PENTING: JANGAN MERUSAK FUNGSI APLIKASI

Ini merupakan persyaratan yang wajib dipatuhi.

Redesign harus berfokus pada tampilan dan pengalaman pengguna. Pertahankan seluruh fungsi yang sudah berjalan.

JANGAN:

- Menghapus fungsi yang sudah ada.
- Mengubah business logic.
- Mengganti API endpoint.
- Mengubah struktur request atau response API.
- Mengubah nama field backend.
- Mengubah route tanpa alasan teknis yang kuat.
- Menghilangkan permission dan role guard.
- Menghapus validasi form.
- Mengubah mekanisme autentikasi.
- Mengubah query dan proses pengambilan data.
- Menghilangkan fitur hanya karena desain lama tidak cocok.
- Menggunakan data dummy untuk menggantikan data asli.
- Mengganti library tanpa alasan kuat.

Pertahankan:

- React hooks.
- State management.
- React Query apabila digunakan.
- Routing yang sudah ada.
- Context dan authentication.
- Permission system.
- Form validation.
- API integration.
- Loading, error, empty, dan success state.
- Interaksi dan seluruh aksi pengguna.

Apabila perlu mengubah struktur komponen, pastikan seluruh dependensi dan fungsi lama tetap bekerja.

Jika menemukan bug yang tidak berkaitan dengan redesign, jangan memperbaikinya secara diam-diam. Jelaskan terlebih dahulu temuan tersebut.

---

## 13. IMPLEMENTATION STRATEGY

Jangan melakukan perubahan secara acak.

Ikuti tahapan berikut:

### Tahap 1 — Audit

Periksa:

- Struktur folder.
- Routing.
- Layout Panel Ustadz.
- Semua halaman terkait.
- Reusable components.
- Custom hooks.
- API services.
- Permission.
- State management.
- Responsive behavior.

Buat pemetaan komponen yang akan diperbaiki.

### Tahap 2 — Design System

Bangun atau perbarui:

- Design tokens.
- Color palette.
- Typography.
- Spacing.
- Border radius.
- Shadow.
- Button.
- Badge.
- Card.
- Input.
- Dropdown.
- Modal.
- Table.
- Sidebar.
- Bottom navigation.

Gunakan reusable components, jangan membuat variasi komponen yang sama di setiap halaman.

### Tahap 3 — Main Layout

Kerjakan:

- Desktop sidebar.
- Tablet sidebar.
- Mobile bottom navigation.
- Header.
- Main content wrapper.
- Page heading.
- Breadcrumb jika diperlukan.

### Tahap 4 — Page Redesign

Terapkan design system pada seluruh halaman Panel Ustadz yang ditemukan di proyek.

Pastikan setiap halaman mempunyai:

- Heading yang jelas.
- Hierarki informasi.
- Layout yang konsisten.
- Action placement yang tepat.
- Responsivitas.
- Loading dan empty state.
- Error state.

### Tahap 5 — Quality Assurance

Periksa:

- Build.
- TypeScript.
- Console error.
- Route.
- Navigasi.
- Form.
- Modal.
- Dropdown.
- Filter.
- Pagination.
- Permission.
- Data rendering.
- Responsive layout.

Jangan mengklaim build berhasil apabila belum benar-benar menjalankannya.

---

## 14. DEFINITION OF DONE

Redesign dianggap selesai jika:

1. Seluruh halaman Panel Ustadz menggunakan design system yang konsisten.
2. Identitas visual Tartila tetap dipertahankan.
3. Panel terlihat profesional, modern, dan tidak terlalu playful.
4. Aksen Neo-Brutalism digunakan secara selektif.
5. White space tidak berlebihan.
6. Informasi mudah dibaca dan dipindai.
7. Desktop menggunakan sidebar.
8. Mobile menggunakan bottom navigation.
9. Tablet mempunyai navigasi yang adaptif.
10. Card, button, badge, table, form, dan modal memiliki standar visual yang konsisten.
11. Semua halaman responsif.
12. Seluruh fungsi lama tetap bekerja.
13. Tidak ada data dummy yang menggantikan API asli.
14. Tidak ada route atau permission yang rusak.
15. Build dan pemeriksaan kode dilakukan sesuai kemampuan proyek.

---

## 15. OUTPUT YANG SAYA HARAPKAN

Saya ingin kamu langsung mengerjakan implementasi di source code proyek.

Bukan hanya memberikan rekomendasi desain atau contoh mockup.

Hasil pekerjaan harus mencakup:

- Reusable design system Panel Ustadz.
- Layout utama yang sudah diperbarui.
- Sidebar desktop.
- Bottom navigation mobile.
- Header.
- Standardized card.
- Button system.
- Badge system.
- Input dan form.
- Table.
- Modal dan dropdown.
- Seluruh halaman Panel Ustadz yang telah ditemukan dan diaudit.

Berikan kode lengkap untuk file yang dibuat atau diubah.

Jika memungkinkan, sertakan ringkasan:

- File yang dibuat.
- File yang dimodifikasi.
- Komponen reusable baru.
- Halaman yang telah selesai.
- Fungsi lama yang dipertahankan.
- Hasil pemeriksaan build.

## FINAL DESIGN PRINCIPLE

Ingat bahwa Tartila merupakan aplikasi pendidikan Islam untuk anak-anak dan pengajarnya.

Panel Santri harus membuat anak merasa senang belajar.

Panel Ustadz harus membuat pengajar merasa mudah, nyaman, dan percaya diri dalam mengelola pembelajaran.

Jangan mengorbankan usability demi estetika.

Jangan mengorbankan identitas Tartila demi tampilan dashboard generik.

**Hasil akhirnya harus terasa seperti satu produk Tartila dengan dua pengalaman pengguna yang berbeda: Playful Neo-Brutalism untuk Santri dan Professional Neo-Brutalism untuk Ustadz.**
