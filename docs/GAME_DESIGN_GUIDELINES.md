# Tartila Game Design Guidelines

**Dokumen:** `docs/GAME_DESIGN_GUIDELINES.md`  
**Produk:** Tartila — latihan membaca Tilawati untuk anak SD, SMP, dan SMA  
**Game yang dicakup:** Harakat Slasher dan Hijaiyah Harvest  
**Status:** Pedoman desain produk, pembelajaran, UX, dan implementasi teknis  
**Versi:** 1.0

---

## Daftar Isi

1. [Tujuan dan ruang lingkup](#1-tujuan-dan-ruang-lingkup)
2. [Filosofi dan prinsip desain](#2-filosofi-dan-prinsip-desain)
3. [Profil pemain dan penyesuaian usia](#3-profil-pemain-dan-penyesuaian-usia)
4. [Prinsip pembelajaran](#4-prinsip-pembelajaran)
5. [Mode permainan](#5-mode-permainan)
6. [Harakat Slasher](#6-harakat-slasher)
7. [Hijaiyah Harvest](#7-hijaiyah-harvest)
8. [Progresi dan adaptive difficulty](#8-progresi-dan-adaptive-difficulty)
9. [Aturan menang, kalah, retry, dan hasil](#9-aturan-menang-kalah-retry-dan-hasil)
10. [Session, tiket, dan state management](#10-session-tiket-dan-state-management)
11. [Scoring, combo, XP, dan reward](#11-scoring-combo-xp-dan-reward)
12. [Feedback dan motivasi](#12-feedback-dan-motivasi)
13. [HUD, kontrol, dan interaksi](#13-hud-kontrol-dan-interaksi)
14. [Visual design dan accessibility](#14-visual-design-dan-accessibility)
15. [Konten Arab, harakat, dan audio](#15-konten-arab-harakat-dan-audio)
16. [Arsitektur runtime dan performa](#16-arsitektur-runtime-dan-performa)
17. [Data model dan event analytics](#17-data-model-dan-event-analytics)
18. [Keamanan, privasi, dan kesejahteraan anak](#18-keamanan-privasi-dan-kesejahteraan-anak)
19. [QA, playtest, dan validasi edukasi](#19-qa-playtest-dan-validasi-edukasi)
20. [Acceptance criteria](#20-acceptance-criteria)
21. [Prioritas implementasi](#21-prioritas-implementasi)
22. [Checklist singkat untuk AI coding agent](#22-checklist-singkat-untuk-ai-coding-agent)
23. [Glosarium](#23-glosarium)

---

## 1. Tujuan dan ruang lingkup

Dokumen ini menjadi acuan bersama bagi Product Owner, pengajar Tilawati, UI/UX Designer, Game Designer, Frontend Engineer, Backend Engineer, QA, dan AI coding agent ketika merancang, mengembangkan, menguji, atau mengubah Harakat Slasher dan Hijaiyah Harvest.

Dokumen ini menetapkan:

- Tujuan pembelajaran tiap game.
- Aturan mekanik inti dan kondisi menang/kalah.
- Perbedaan Practice Mode dan Challenge Mode.
- Progresi level dan prinsip penyesuaian kesulitan.
- Pengelolaan sesi, tiket, retry, dan perpindahan level.
- Aturan state frontend dan backend.
- Scoring, combo, reward, feedback, serta HUD.
- Persyaratan konten huruf Arab, harakat, audio, accessibility, performa, analytics, dan privasi.
- Kriteria pengujian dan definisi selesai.

### 1.1 Batas ruang lingkup

Pedoman ini berfokus pada dua game berikut:

| Game | Genre | Kemampuan utama |
|---|---|---|
| Harakat Slasher | Target matching slicer | Mengenali dan membedakan harakat pada huruf Arab |
| Hijaiyah Harvest | Sequence catcher | Mengenali huruf/karakter dan menyusunnya dalam urutan target |

Game bukan pengganti pembelajaran Tilawati yang dipandu ustadz. Game berfungsi sebagai latihan penguatan, pengulangan, dan pemeriksaan pemahaman pada lingkup materi yang telah ditetapkan pengajar.

### 1.2 Kata normatif

Kata-kata berikut memiliki arti yang konsisten di seluruh dokumen:

- **MUST / WAJIB:** ketentuan yang harus dipenuhi.
- **MUST NOT / DILARANG:** perilaku yang tidak boleh dilakukan.
- **SHOULD / DISARANKAN:** pedoman yang sebaiknya diikuti; penyimpangan harus memiliki alasan yang jelas.
- **MAY / OPSIONAL:** pilihan yang dapat diterapkan sesuai kebutuhan dan hasil pengujian.

### 1.3 Sumber keputusan

Urutan otoritas ketika terjadi perbedaan keputusan:

1. Ketepatan materi dan validasi pengajar Tilawati.
2. Keselamatan, kesejahteraan, dan aksesibilitas pemain anak.
3. Aturan produk dan ekonomi yang telah disetujui.
4. Pedoman teknis dalam dokumen ini.
5. Preferensi implementasi visual atau teknis.

AI coding agent MUST NOT mengubah aturan pembelajaran, biaya tiket, atau kondisi menang/kalah hanya demi mempermudah implementasi tanpa menjelaskan dampaknya dan meminta keputusan pemilik produk.

---

## 2. Filosofi dan prinsip desain

### 2.1 Filosofi utama

> **Anak harus merasa tertantang menguasai materi, bukan dihukum karena belum menguasainya.**

Kesalahan adalah bagian dari proses belajar. Game harus membantu pemain memahami kesalahannya, mencoba lagi, dan melihat perkembangan kemampuan secara nyata.

### 2.2 Enam prinsip wajib

1. **Clear — tujuan jelas.** Pemain selalu tahu apa yang harus dicari, ditangkap, disusun, atau diselesaikan.
2. **Fair — tantangan adil.** Sistem tidak boleh menghukum pemain karena target tidak muncul, objek tertutup, input tidak terbaca, lag, atau aturan yang tidak dijelaskan.
3. **Learnable — dapat dipelajari.** Mekanik diperkenalkan bertahap, disertai contoh, latihan, dan feedback yang membantu.
4. **Encouraging — mendukung.** Bahasa dan animasi mendorong usaha tanpa mempermalukan pemain.
5. **Accessible — dapat digunakan.** Kontrol, teks, audio, warna, dan gerakan mempertimbangkan variasi kemampuan pemain.
6. **Purposeful — setiap fitur punya tujuan.** Skor, combo, timer, hazard, dan reward harus mendukung pengalaman belajar, bukan mengalihkan fokus darinya.

### 2.3 Prinsip desain yang dilarang

Game MUST NOT:

- Membuat anak merasa bodoh, lambat, atau gagal sebagai pribadi.
- Mengakhiri permainan secara mendadak akibat satu kesalahan kecil.
- Menggunakan timer sebagai tekanan default pada latihan dasar.
- Mengunci materi pembelajaran inti di balik tiket atau pembelian.
- Menghukum pemain karena koneksi terputus atau aplikasi masuk ke background.
- Menggunakan reward acak atau tekanan streak untuk memaksa anak terus bermain.
- Menggunakan leaderboard yang mempermalukan pemain dengan kemampuan lebih rendah.
- Menampilkan instruksi terlalu banyak sekaligus, terutama pada tahap pemula.

### 2.4 Keberhasilan game

Keberhasilan tidak hanya diukur dari jumlah sesi, durasi bermain, skor tertinggi, atau jumlah tiket yang digunakan.

Indikator yang lebih bermakna:

- Pemain memahami tujuan permainan.
- Pemain mampu mengenali target dengan lebih tepat.
- Kesalahan berulang pada materi tertentu berkurang.
- Pemain dapat menyelesaikan tugas belajar tanpa petunjuk secara bertahap.
- Pemain memahami alasan jawaban benar atau salah.
- Pemain merasa aman untuk mencoba kembali.

---

## 3. Profil pemain dan penyesuaian usia

Tartila melayani rentang usia yang luas. Usia menjadi konteks desain, bukan satu-satunya penentu kemampuan.

### 3.1 Kelompok pengalaman

| Kelompok umum | Pertimbangan UX | Pendekatan game |
|---|---|---|
| SD kelas bawah | Instruksi konkret, objek besar, langkah sedikit, bantuan visual | Satu target per tahap, tempo lambat, contoh langsung, tanpa timer default |
| SD kelas atas | Mulai mampu membandingkan pola dan mengikuti beberapa langkah | Variasi harakat, rangkaian lebih panjang, pengecoh bertahap |
| SMP | Dapat menangani kombinasi dan strategi lebih kompleks | Tantangan campuran, target dinamis, evaluasi mandiri |
| SMA | Membutuhkan tampilan lebih matang dan tantangan yang tidak terasa kekanak-kanakan | Advanced challenge, personal best, statistik penguasaan, pilihan tantangan |

Rentang di atas bukan label kemampuan yang kaku. Anak SD dapat memiliki kemampuan lebih tinggi daripada pemain yang lebih tua, dan sebaliknya.

### 3.2 Kesulitan berdasarkan kemampuan

Sistem SHOULD mempertimbangkan:

- Akurasi pengenalan karakter.
- Akurasi pengenalan harakat.
- Ketepatan urutan.
- Konsistensi menjawab.
- Jumlah petunjuk yang diperlukan.
- Kemampuan mengendalikan input.

Kecepatan respons motorik MUST NOT dianggap sebagai ukuran tunggal kemampuan membaca.

### 3.3 Pilihan tampilan

Jika produk menyediakan pilihan tingkat tampilan, gunakan opsi yang tidak memberi label negatif, misalnya:

- Tampilan sederhana.
- Tampilan standar.
- Tantangan lanjutan.

Hindari label seperti “anak lambat” atau “pemain lemah”.

---

## 4. Prinsip pembelajaran

### 4.1 Satu level, satu fokus utama

Setiap level MUST memiliki satu learning objective utama yang dapat dijelaskan dalam satu kalimat.

Contoh:

- “Pemain dapat mengenali tanda fathah pada berbagai huruf.”
- “Pemain dapat membedakan fathah, kasrah, dan dhammah.”
- “Pemain dapat menyusun karakter sesuai urutan yang diberikan.”

Jangan menaikkan panjang kata, kecepatan objek, jumlah pengecoh, jumlah target, dan tekanan waktu sekaligus.

### 4.2 Pola pembelajaran

Gunakan urutan:

1. **Kenalkan:** jelaskan target dan tampilkan contohnya.
2. **Demonstrasikan:** tunjukkan satu contoh tindakan yang benar.
3. **Latihkan:** pemain mencoba pada situasi sederhana.
4. **Berikan feedback:** jelaskan apa yang benar atau perlu diperbaiki.
5. **Variasikan:** gunakan huruf atau situasi baru untuk menguji transfer pemahaman.
6. **Refleksikan:** tampilkan apa yang sudah dikuasai dan apa yang bisa dilatih lagi.

### 4.3 Feedback korektif

Feedback yang baik terdiri dari:

- Pengakuan terhadap usaha.
- Informasi spesifik tentang jawaban.
- Penjelasan singkat yang relevan.
- Ajakan mencoba kembali.

Contoh benar:

> Hebat! Ini fathah. Tanda berada di atas huruf dan berbunyi “a” pendek.

Contoh salah:

> Hampir benar. Ini kasrah. Perhatikan tanda yang berada di bawah huruf.

Hindari feedback yang hanya berbunyi “Salah”, “Gagal”, atau “Game Over”.

### 4.4 Jangan mengasumsikan skor sama dengan pemahaman

Skor dapat dipengaruhi refleks, keberuntungan spawn, perangkat, dan cara bermain. Karena itu:

- Skor menjadi indikator performa permainan.
- Akurasi per materi menjadi indikator latihan.
- Penyelesaian objective menjadi indikator keberhasilan level.
- Validasi membaca tetap memerlukan metode penilaian yang sesuai dan, bila diperlukan, pengamatan ustadz.

### 4.5 Validasi materi

Semua target huruf, harakat, bentuk karakter, pelafalan, contoh, dan urutan materi MUST divalidasi pengajar yang memahami metode Tilawati.

Game designer atau AI agent MUST NOT mengarang aturan bacaan, menyimpulkan hukum bacaan, atau mengubah urutan kurikulum tanpa persetujuan pengajar.

---

## 5. Mode permainan

Kedua game WAJIB mendukung dua mode dengan aturan yang jelas.

### 5.1 Practice Mode

Tujuan: latihan, eksplorasi, dan penguatan materi.

| Aturan | Ketentuan |
|---|---|
| Tiket | Gratis, tidak memotong tiket |
| Nyawa | Tidak membatasi latihan |
| Timer | Tidak ada secara default |
| Penalti | Tidak ada pengurangan nyawa atau reward |
| Hint | Tersedia |
| Retry | Bebas |
| Pause | Selalu tersedia |
| Feedback | Korektif dan edukatif |
| Level berikutnya | Dapat dibuka sesuai aturan belajar produk |

Practice Mode MUST NOT mengurangi tiket, hati, atau resource ekonomi lain karena kesalahan.

### 5.2 Challenge Mode

Tujuan: menguji penerapan materi dalam tantangan yang lebih terstruktur.

| Aturan | Ketentuan |
|---|---|
| Tiket | 1 tiket untuk 1 sesi Challenge Mode |
| Nyawa | 3 kesempatan per level, kecuali konfigurasi event yang telah disetujui |
| Timer | Opsional dan harus diberitahukan sebelum mulai |
| Penalti | Mengurangi kesempatan hanya untuk kesalahan yang jelas dan adil |
| Retry level | Di dalam sesi yang sama, tanpa tiket tambahan |
| Next level | Di dalam sesi yang sama, tanpa tiket tambahan |
| Pause | Tersedia; timer berhenti saat pause |
| Resume | Melanjutkan sesi aktif tanpa tiket baru |

### 5.3 Perbedaan mode harus terlihat

Sebelum pemain memulai, tampilkan:

- Nama mode.
- Tujuan mode.
- Apakah ada tiket yang digunakan.
- Apakah ada timer.
- Bagaimana nyawa atau kesempatan bekerja.
- Cara menyelesaikan level.

Jangan menyembunyikan biaya tiket atau penalti di dalam gameplay.

### 5.4 Materi inti tidak boleh bergantung pada tiket

Pemain MUST tetap dapat mengakses latihan dasar melalui Practice Mode. Tiket hanya boleh digunakan untuk sesi Challenge Mode, bukan untuk menghalangi pembelajaran inti.

---

## 6. Harakat Slasher

### 6.1 Identitas game

- **Genre:** Target Matching Slicer.
- **Fokus:** pengenalan dan diskriminasi harakat.
- **Aksi utama:** swipe atau tap pada objek yang sesuai dengan target.
- **Sensasi utama:** menemukan target yang tepat, membedakan pengecoh, dan meningkatkan ketepatan.

### 6.2 Learning objective

Objective utama adalah mengenali tanda harakat yang sedang menjadi target pada berbagai huruf Arab.

Secara default, mode “harakat” berarti target berdasarkan tanda harakat, bukan berdasarkan satu gabungan huruf tertentu.

Contoh target Fathah:

| Karakter | Keputusan |
|---|---|
| `بَ` | Target |
| `تَ` | Target |
| `نَ` | Target |
| `بِ` | Pengecoh |
| `تُ` | Pengecoh |

Jika level ingin menguji satu karakter spesifik, misalnya `بَ`, gunakan target mode “syllable” atau “character”, dan jelaskan target tersebut secara eksplisit.

### 6.3 Mode target

```ts
export type HarakatName = "fathah" | "kasrah" | "dhammah";
export type HarakatTargetMode = "harakat" | "syllable";

export interface HarakatTarget {
  mode: HarakatTargetMode;
  harakat?: HarakatName;
  baseLetter?: string;
  displayText: string;
  audioId?: string;
}
```

Aturan:

- `mode: "harakat"` memeriksa tanda harakat terstruktur.
- `mode: "syllable"` memeriksa kombinasi huruf dasar dan harakat.
- Jangan menggunakan perbandingan string tampilan sebagai satu-satunya sumber kebenaran.
- Validasi data target sebelum level dimulai.

### 6.4 Core gameplay

1. HUD menampilkan target, label, karakter contoh, dan audio bila tersedia.
2. Pemain menekan tombol mulai atau menyelesaikan countdown singkat.
3. Objek muncul di area permainan.
4. Pemain melakukan swipe melewati objek atau tap objek.
5. Sistem memeriksa setiap objek yang terkena gesture.
6. Objek target memberi feedback benar dan menambah progres.
7. Objek pengecoh memberi feedback korektif.
8. Level selesai saat objective pembelajaran tercapai atau kondisi challenge berakhir.

### 6.5 Aturan swipe dan tap

- Satu swipe boleh mengenai beberapa objek.
- Setiap objek hanya boleh diproses satu kali per gesture.
- Satu gesture yang mengenai beberapa objek salah MUST NOT mengurangi banyak nyawa sekaligus; penalti maksimal satu kesempatan per gesture.
- Tap harus tersedia sebagai alternatif bagi pengguna yang kesulitan melakukan swipe.
- Objek yang sudah diproses tidak boleh memicu collision ulang.
- Gesture yang dimulai di luar area game tidak boleh tiba-tiba menebas objek di dalam game.

### 6.6 Aturan target dan spawn fairness

Sistem spawn MUST menjamin bahwa:

- Target yang dibutuhkan tersedia sebelum deadline atau batas ronde.
- Target tidak muncul terlalu cepat untuk diproses.
- Target tidak selalu tertutup oleh objek lain.
- Spawn tidak menghasilkan objek yang tidak mungkin dijangkau.
- Pengecoh tidak mendominasi hingga pemain tidak dapat memahami pola.
- Target baru tidak diperkenalkan sebelum target sebelumnya cukup jelas.

Konfigurasi awal yang disarankan:

- Setiap wave atau interval harus menyediakan peluang target yang memadai.
- Jumlah objek aktif dibatasi agar layar tidak penuh.
- Kecepatan jatuh dan rasio pengecoh diuji melalui playtest.
- Randomizer harus menghindari rangkaian spawn yang tidak adil.

Jangan mengandalkan random murni tanpa constraint. Gunakan seeded atau constrained randomizer jika dibutuhkan untuk reproducibility QA.

### 6.7 Penalti

**Practice Mode:**

- Salah menebas tidak mengurangi hati.
- Target terlewat tidak mengurangi resource.
- Berikan informasi tentang perbedaan target dan pengecoh.

**Challenge Mode:**

- Salah menebas objek yang jelas bukan target: kurangi satu kesempatan per gesture.
- Target yang valid melewati failure boundary: kurangi satu kesempatan.
- Pengecoh yang terlewat: tidak ada penalti.
- Objek yang tertutup, spawn terlambat, atau tidak dapat dijangkau: tidak boleh dihitung sebagai kesalahan pemain.

### 6.8 Combo

Combo diperoleh dari jawaban benar berturut-turut, bukan hanya dari jumlah objek yang ditebas dalam satu swipe.

Contoh:

- Benar pertama: combo 1.
- Benar kedua: combo 2.
- Benar ketiga: combo 3 dan bonus kecil.
- Jawaban salah dalam Challenge Mode: combo kembali ke 0.

Practice Mode boleh tetap menampilkan streak benar tanpa penalti.

Combo adalah bonus, bukan syarat menang.

### 6.9 Progresi level Harakat Slasher

| Tahap | Fokus | Aturan gameplay |
|---|---|---|
| Tutorial | Memahami target | Satu target, contoh visual/audio, tanpa penalti |
| Level 1 | Mengenali satu harakat | Satu target utama, objek relatif lambat, sedikit atau tanpa pengecoh |
| Level 2 | Membedakan dua harakat | Target tetap, satu kategori pengecoh diperkenalkan |
| Level 3 | Membedakan tiga harakat | Fathah, kasrah, dan dhammah muncul sebagai target/pengecoh sesuai instruksi |
| Level 4 | Transfer antarhuruf | Harakat target sama pada berbagai huruf dasar |
| Level 5 | Penerapan campuran | Target berubah per ronde; variasi spawn dan tempo meningkat secara terukur |

Multi-target dapat disediakan sebagai **Advanced Challenge**, bukan mekanik wajib untuk level pemula.

### 6.10 Multi-target advanced

Jika dua target aktif sekaligus:

- HUD harus menampilkan keduanya dengan ukuran cukup besar.
- Status setiap target harus jelas.
- Progres masing-masing target ditampilkan.
- Tidak boleh mengubah target tanpa pemberitahuan.
- Pemain harus mendapat contoh sebelum mode dimulai.

### 6.11 Hazard bom

Bom bersifat opsional untuk Challenge Mode atau event khusus.

Aturan:

- Bom harus berbeda secara visual dari buah.
- Berikan tanda bahaya yang dapat dikenali tanpa hanya mengandalkan warna.
- Jangan memunculkan bom tepat di atas target sehingga tidak dapat dihindari.
- Menebas bom mengurangi paling banyak satu kesempatan.
- Bom tidak boleh menyebabkan instant Game Over.
- Bom tidak boleh muncul di Practice Mode secara default.

### 6.12 Win condition Harakat Slasher

Level dianggap selesai ketika objective target level tercapai, misalnya jumlah target benar yang telah ditentukan.

- Skor tidak boleh menjadi satu-satunya syarat menang.
- Akurasi dan jumlah kesalahan menjadi bagian ringkasan hasil.
- Jika nyawa Challenge Mode habis sebelum objective tercapai, level berakhir sebagai “Kesempatan Habis”.
- Jika timer Challenge Mode berakhir sebelum objective tercapai, tampilkan “Waktu Tantangan Selesai” dan berikan opsi retry atau Practice Mode.
- Timer tidak boleh dipakai dalam Practice Mode secara default.

Target count dan ambang akurasi, bila digunakan, harus merupakan konfigurasi level yang ditampilkan sebelum bermain dan telah divalidasi melalui playtest. Jangan menyembunyikan persyaratan kemenangan.

---

## 7. Hijaiyah Harvest

### 7.1 Identitas game

- **Genre:** Sequence Catcher / Word Catcher.
- **Fokus:** pengenalan karakter dan urutan.
- **Aksi utama:** menggerakkan keranjang untuk menangkap karakter yang dibutuhkan.
- **Sensasi utama:** menyelesaikan rangkaian secara bertahap dan melihat slot target terisi.

### 7.2 Learning objective

Pemain dapat mengenali karakter yang dibutuhkan dan menyusunnya ke dalam urutan target.

Target harus selalu terlihat selama bermain. Jangan mengharuskan anak mengingat seluruh kata hanya dari memori ketika tujuan level adalah latihan pengenalan urutan.

### 7.3 HUD urutan

Contoh target:

`بَ → تَ → نَ`

HUD menampilkan:

- Rangkaian target.
- Slot yang telah selesai.
- Slot aktif atau huruf berikutnya.
- Jumlah karakter tersisa.
- Instruksi singkat.

Status slot harus terlihat tanpa bergantung pada warna saja. Gunakan ikon centang, outline, nomor urutan, atau teks pendukung.

### 7.4 Core gameplay

1. Sistem menampilkan kata atau rangkaian target.
2. Pemain melihat huruf pertama yang harus ditangkap.
3. Objek jatuh dari atas.
4. Pemain menggerakkan keranjang ke kiri atau kanan.
5. Sistem mendeteksi objek yang masuk ke area tangkap.
6. Jika objek cocok dengan slot aktif, slot terisi dan target berikutnya aktif.
7. Jika salah, tampilkan feedback yang menjelaskan karakter atau urutan.
8. Level selesai ketika seluruh slot target terisi dengan urutan yang benar.

### 7.5 Aturan objek dan urutan

Misalnya target adalah:

`بَ → تَ → نَ`

- Menangkap `بَ` ketika slot pertama aktif: benar.
- Menangkap `تَ` ketika slot pertama aktif: belum sesuai urutan.
- Menangkap `نَ` ketika slot pertama aktif: belum sesuai urutan.
- Menangkap `بِ` ketika slot pertama aktif: salah harakat jika harakat merupakan bagian target.

Pemain harus melihat karakter yang sedang dibutuhkan.

### 7.6 Aturan objek terlewat

- Objek yang bukan target aktif dan jatuh ke bawah tidak boleh mengurangi kesempatan.
- Objek yang sesuai dengan target aktif dan melewati failure boundary dapat mengurangi satu kesempatan pada Challenge Mode.
- Dalam Practice Mode, objek target yang terlewat hanya mengulang kesempatan dan memberi feedback.
- Jika objek yang sama diperlukan lagi pada tahap berikutnya, sistem harus menangani kemunculannya secara terstruktur dan tidak membuat aturan yang membingungkan.

### 7.7 Kontrol keranjang

- Drag atau swipe horizontal harus didukung.
- Tap kiri/kanan atau tombol keyboard dapat disediakan sebagai alternatif pada perangkat yang sesuai.
- Keranjang tidak boleh bergerak di luar batas area permainan.
- Kecepatan keranjang harus dapat mengikuti input tanpa lag yang mengganggu.
- Collision box harus toleran, tetapi tidak terlalu besar hingga menangkap objek yang tidak benar-benar disentuh.
- Pemain harus dapat mengendalikan keranjang dengan satu tangan pada layar mobile.

### 7.8 Penalti

**Practice Mode:**

- Tangkap karakter yang salah: feedback korektif, tanpa kehilangan nyawa.
- Melewatkan karakter: tidak ada penalti permanen.
- Hint dapat menyorot karakter berikutnya.

**Challenge Mode:**

- Menangkap karakter yang tidak sesuai dengan slot aktif: kurangi satu kesempatan.
- Karakter yang sesuai dengan slot aktif melewati batas bawah: kurangi satu kesempatan.
- Objek pengecoh yang tidak dibutuhkan melewati batas bawah: tidak ada penalti.
- Satu kejadian collision tidak boleh dihitung dua kali.

### 7.9 Progresi level Hijaiyah Harvest

| Tahap | Fokus | Aturan gameplay |
|---|---|---|
| Tutorial | Memahami kontrol dan slot | Dua karakter, contoh tangkapan, tanpa penalti |
| Level 1 | Urutan pendek | Dua karakter, sedikit pengecoh |
| Level 2 | Urutan tiga karakter | Tiga slot, tempo terukur |
| Level 3 | Ketepatan karakter/harakat | Tiga karakter dengan variasi yang telah dipelajari |
| Level 4 | Urutan lebih panjang | Empat karakter, pengecoh terbatas |
| Level 5 | Penguasaan rangkaian | Empat sampai lima karakter, variasi spawn dan tempo |

Dua kata bersamaan tidak disarankan sebagai Level 3 standar. Jadikan **Advanced Multi-Word Challenge** setelah pemain menguasai satu rangkaian.

### 7.10 Advanced Multi-Word Challenge

Jika dua rangkaian ditampilkan bersamaan:

- Tampilkan urutan dan status masing-masing kata.
- Jelaskan apakah pemain boleh memilih urutan kata atau harus menyelesaikan kata A dahulu.
- Jangan memaksa pemain mengingat dua rangkaian tanpa bantuan HUD.
- Gunakan pengenalan visual yang jelas untuk kata aktif.
- Mulai dengan Practice Mode sebelum Challenge Mode.

### 7.11 Buah busuk / hazard

Hazard buah busuk bersifat opsional dan tidak menjadi syarat inti game.

- Harus mudah dikenali secara bentuk atau simbol, bukan hanya warna hitam.
- Tidak boleh mirip dengan huruf target.
- Tidak boleh muncul menutupi target.
- Salah menangkap hazard mengurangi paling banyak satu kesempatan pada Challenge Mode.
- Tidak ada instant Game Over.

### 7.12 Win condition Hijaiyah Harvest

Pemain hanya memenangkan level ketika seluruh slot rangkaian target terisi dalam urutan yang ditetapkan.

- Skor tidak dapat menggantikan slot yang belum selesai.
- Timer bukan syarat Practice Mode.
- Jika waktu Challenge Mode habis sebelum rangkaian selesai, level berakhir sebagai belum selesai dan pemain mendapat opsi retry atau Practice Mode.
- Jika kesempatan habis, level berakhir dengan penjelasan yang ramah dan opsi mencoba kembali.

---

## 8. Progresi dan adaptive difficulty

### 8.1 Progresi harus meningkatkan kemampuan, bukan hanya kecepatan

Kesulitan dapat meningkat melalui dimensi berikut:

- Jumlah kategori harakat.
- Kemiripan pengecoh.
- Variasi huruf dasar.
- Panjang rangkaian.
- Kepadatan objek.
- Kecepatan objek.
- Kompleksitas target.
- Jumlah target simultan.

Jangan meningkatkan semua dimensi sekaligus.

### 8.2 Aturan perubahan kesulitan

1. Perkenalkan satu tantangan baru dalam satu tahap.
2. Berikan contoh sebelum menguji tantangan baru.
3. Pertahankan setidaknya sebagian konteks yang sudah dikenal.
4. Pastikan pemain memiliki waktu untuk memahami target.
5. Jika pemain berulang kali kesulitan, kurangi beban dan berikan latihan spesifik.
6. Jangan menaikkan kecepatan hanya karena akurasi tinggi.
7. Jangan mengubah difficulty di tengah level secara tersembunyi.

### 8.3 Adaptive difficulty

Adaptive difficulty boleh digunakan, tetapi perubahan harus dapat dijelaskan dan tidak terasa seperti sistem yang diam-diam menghukum pemain.

Contoh aturan awal untuk diuji, bukan standar baku:

| Sinyal | Penyesuaian yang dapat dicoba |
|---|---|
| Akurasi sangat rendah dalam beberapa percobaan | Kurangi pengecoh, kurangi kepadatan objek, tampilkan contoh |
| Akurasi sedang | Pertahankan tingkat kesulitan dan berikan latihan tambahan |
| Akurasi stabil tinggi | Tawarkan level atau tantangan berikutnya |
| Kesalahan berulang pada satu harakat | Tawarkan latihan khusus harakat tersebut |
| Banyak input tidak terdeteksi | Periksa kontrol, ukuran objek, performa perangkat; jangan langsung menyimpulkan kurang paham |

Ambang akurasi harus dapat dikonfigurasi dan divalidasi lewat pengujian. Nilai seperti 60%, 80%, atau lainnya hanyalah hipotesis awal.

### 8.4 Pisahkan kemampuan kognitif dan motorik

Data kesulitan harus membedakan:

- Salah mengenali karakter.
- Salah mengenali harakat.
- Salah urutan.
- Salah input karena gerakan.
- Objek terlewat karena spawn atau collision.
- Waktu habis.

Jangan menganggap seluruh kesalahan sebagai kekurangan pengetahuan.

### 8.5 Unlock level

Aturan unlock harus konsisten dengan kurikulum dan keputusan produk.

- Practice Mode dapat menyediakan pengulangan level yang telah terbuka.
- Challenge Mode menggunakan objective yang dijelaskan sejak awal.
- Pemain tidak boleh kehilangan level yang sudah terbuka karena kalah.
- Jangan memaksa pemain mengulang semua level ketika hanya satu level yang belum selesai.

---

## 9. Aturan menang, kalah, retry, dan hasil

### 9.1 Win condition berbasis objective

| Game | Kondisi menang utama |
|---|---|
| Harakat Slasher | Jumlah target benar yang ditetapkan level berhasil dikumpulkan |
| Hijaiyah Harvest | Semua slot karakter tersusun lengkap dan benar |

Skor, combo, atau lama bertahan MUST NOT menjadi pengganti objective pembelajaran.

### 9.2 Lose / incomplete condition

Challenge Mode dapat berakhir sebelum objective selesai karena:

- Kesempatan habis.
- Timer challenge habis, jika timer diaktifkan.
- Pemain memilih keluar dan mengakhiri sesi.

Gunakan label hasil yang spesifik:

- “Kesempatan Habis”.
- “Waktu Tantangan Selesai”.
- “Sesi Diakhiri”.

Hindari menjadikan semua kondisi sebagai pesan generik “Kalah”.

### 9.3 Aturan hasil level

Result screen sebaiknya memuat:

- Status objective.
- Materi yang dilatih.
- Jawaban benar dan salah.
- Akurasi.
- Hint yang digunakan.
- Skor level.
- Catatan materi yang perlu dilatih.
- Pilihan tindakan berikutnya.

Contoh pilihan:

- Ulangi Level.
- Latihan Materi Ini.
- Lanjut Level.
- Kembali ke Menu.

Tombol harus sesuai status sesi dan level.

### 9.4 Star rating

Jika menggunakan bintang:

- Bintang mengukur kualitas performa, bukan nilai diri pemain.
- Kriteria harus dijelaskan atau dapat dipahami.
- Bintang tidak boleh menjadi satu-satunya syarat mengakses latihan dasar.
- Pemain tetap mendapatkan apresiasi atas objective yang selesai.
- Jangan menggunakan animasi atau pesan yang mempermalukan hasil satu bintang.

### 9.5 Retry

Retry level dalam sesi aktif:

- Mereset `LevelState`.
- Mempertahankan `sessionId`.
- Mempertahankan status tiket yang sudah terpakai.
- Tidak mengurangi tiket lagi.
- Mencatat hasil percobaan sebelumnya secara terpisah jika analytics mengharuskannya.
- Mencegah reward level yang sama diklaim ganda.

### 9.6 Next level

Next Level MUST memanggil fungsi internal seperti `handleStartLevel(nextLevel)`.

Next Level MUST NOT:

- Menavigasi keluar ke lobby.
- Membuat sesi baru.
- Memotong tiket lagi.
- Menghapus total skor sesi.
- Menghapus daftar level yang telah selesai.

Level terakhir menampilkan tindakan “Selesaikan Sesi” atau “Kembali ke Menu”, sesuai status produk.

---

## 10. Session, tiket, dan state management

### 10.1 Prinsip pemisahan state

Gunakan pemisahan minimal:

1. **SessionState:** data yang bertahan selama satu sesi game, termasuk tiket, total skor, level aktif, dan progres sesi.
2. **LevelState:** data yang di-reset saat level dimulai ulang atau berpindah level.
3. **UIState:** modal, tooltip, pause dialog, audio toggle, dan state tampilan yang tidak menentukan hasil game.

### 10.2 SessionState

Contoh kontrak frontend:

```ts
export type GameId = "harakat-slasher" | "hijaiyah-harvest";
export type GameMode = "practice" | "challenge";
export type GameSessionStatus =
  | "active"
  | "paused"
  | "completed"
  | "abandoned";

export interface SessionState {
  sessionId: string;
  userId: string;
  gameId: GameId;
  mode: GameMode;
  currentLevel: number;
  totalScore: number;
  completedLevels: number[];
  status: GameSessionStatus;
  ticketConsumed: boolean;
  ticketTransactionId?: string;
  rewardClaimedLevelIds: string[];
  startedAt: string;
  updatedAt: string;
}
```

Catatan:

- `ticketConsumed` di frontend hanya representasi status dari backend.
- Backend menjadi sumber kebenaran untuk transaksi tiket.
- Jangan mempercayai state lokal untuk memvalidasi saldo tiket atau menentukan apakah tiket sudah dipotong.

### 10.3 LevelState

```ts
export interface LevelState {
  levelId: string;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  missedCount: number;
  targetProgress: number;
  remainingTime?: number;
  isCompleted: boolean;
  startedAt: number;
}
```

`lives` dapat diinisialisasi menjadi 3 untuk Challenge Mode. Pada Practice Mode, nyawa tidak digunakan sebagai pembatas.

### 10.4 UIState

Contoh properti UI:

```ts
export interface GameUIState {
  screen:
    | "lobby"
    | "tutorial"
    | "level-intro"
    | "playing"
    | "paused"
    | "level-result"
    | "session-result";
  isHelpOpen: boolean;
  isExitConfirmOpen: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
}
```

UI state tidak boleh menjadi sumber kebenaran untuk tiket, skor tersimpan, atau status sesi backend.

### 10.5 Tabel reset state

| Properti | Next Level | Retry Level | New Session |
|---|---|---|---|
| Session ID | Tetap | Tetap | Baru |
| Tiket | Tetap | Tetap | Dipotong sekali untuk Challenge |
| Total skor sesi | Tetap | Tetap sesuai kebijakan hasil percobaan | Reset |
| Completed levels | Tetap | Tetap | Reset |
| Level aktif | Naik | Tetap | Level awal |
| Skor level | Reset | Reset | Reset |
| Nyawa level | Reset sesuai mode | Reset sesuai mode | Reset |
| Combo level | Reset | Reset | Reset |
| Timer level | Reset | Reset | Reset |
| Target progress | Reset | Reset | Reset |

Kebijakan apakah skor level yang gagal masuk ke total skor sesi harus ditetapkan eksplisit. Jangan menambahkan skor retry berkali-kali untuk satu completion yang sama.

### 10.6 State machine sesi

Transisi yang direkomendasikan:

```text
LOBBY
  ├── Practice ──> TUTORIAL / LEVEL INTRO
  └── Challenge ─> CREATE SESSION + CONSUME TICKET
                         |
                         v
                    LEVEL INTRO
                         |
                         v
                      PLAYING
                     /   |   \
                 PAUSE  WIN  LOSE/INCOMPLETE
                   |     |        |
                 RESUME  v        v
                       LEVEL   RESULT
                       RESULT    |
                         |       ├── RETRY LEVEL
                NEXT LEVEL       ├── PRACTICE
                         |       └── END SESSION
                         v
                    LEVEL INTRO
                         |
                    LAST LEVEL
                         |
                         v
                   SESSION RESULT
```

Transisi harus divalidasi. Contoh: sesi `completed` tidak dapat kembali ke `playing` tanpa membuat sesi baru.

### 10.7 Tiket: 1 sesi = 1 tiket

Aturan wajib:

- Tiket hanya dipotong untuk Challenge Mode.
- Tiket dipotong saat sesi Challenge berhasil dibuat dan mulai dikonfirmasi.
- Practice Mode tidak memotong tiket.
- Next Level tidak memotong tiket.
- Retry Level tidak memotong tiket.
- Resume tidak memotong tiket.
- Refresh halaman tidak memotong tiket.
- Membuka result modal tidak memotong tiket.

### 10.8 Atomic ticket consumption dan idempotency

Backend MUST melakukan validasi saldo, pembuatan sesi, dan pengurangan tiket dalam transaksi yang aman.

Gunakan idempotency key yang terkait dengan pembuatan sesi agar request berulang tidak menyebabkan pemotongan ganda.

Contoh bentuk request konseptual:

```ts
interface CreateChallengeSessionRequest {
  gameId: GameId;
  idempotencyKey: string;
}
```

Backend harus:

1. Memastikan pengguna berhak memainkan game.
2. Memastikan saldo tiket mencukupi.
3. Memeriksa apakah idempotency key pernah diproses.
4. Membuat satu session ID.
5. Memotong satu tiket secara atomik.
6. Menyimpan relasi transaksi tiket dan session ID.
7. Mengembalikan sesi yang sama jika request identik dikirim ulang.

Jika backend gagal sebelum sesi tercipta, tiket tidak boleh terpotong.

Jika respons jaringan hilang setelah backend berhasil membuat sesi, frontend harus melakukan recovery dengan memeriksa idempotency key atau sesi aktif. Jangan langsung membuat request sesi baru.

### 10.9 Retry, resume, dan keluar

- Retry dalam sesi aktif tidak membuat sesi baru.
- Resume sesi aktif tidak memotong tiket.
- Refresh halaman harus memulihkan sesi aktif bila memungkinkan.
- Tab/browser menjadi tidak aktif harus mem-pause atau menyimpan timer sesuai kebijakan mode.
- Keluar harus memberikan konfirmasi jika sesi Challenge sedang aktif.
- Kebijakan expiry atau abandonment harus dikonfigurasi dan dikomunikasikan, bukan disimpulkan dari perilaku frontend.
- Sesi yang sudah berstatus `completed` tidak boleh diberi reward completion kedua.

### 10.10 Reward idempotency

Reward untuk sesi atau level yang sama MUST diberikan paling banyak satu kali.

Gunakan kunci unik yang mengikat reward ke `sessionId` dan `levelId` atau identitas completion yang stabil.

---

## 11. Scoring, combo, XP, dan reward

### 11.1 Skor

Skor menjadi feedback performa permainan, bukan pengganti tujuan pembelajaran.

Skor dapat mempertimbangkan:

- Jawaban benar.
- Rangkaian benar berturut-turut.
- Penyelesaian objective.
- Bonus kecil untuk akurasi atau tantangan lanjutan.

Jangan memberikan skor besar hanya karena pemain bertahan lama tanpa menunjukkan kemampuan.

### 11.2 Akurasi

Akurasi harus memiliki rumus yang disepakati dan konsisten.

Contoh untuk game matching:

```text
accuracy = correct / (correct + wrong) * 100
```

Jika tidak ada jawaban yang diproses, tampilkan “Belum ada data” dan bukan `NaN` atau 0% yang menyesatkan.

Missed target sebaiknya dicatat terpisah dari wrong input agar ustadz dapat membedakan ketepatan pengenalan dan respons.

### 11.3 Combo

- Combo adalah penguat motivasi sekunder.
- Combo tidak boleh mengalahkan fokus membaca.
- Combo harus ter-reset dengan aturan yang konsisten.
- Bonus combo harus dibatasi agar skor tidak didominasi eksploitasi multi-hit.
- Multi-hit dalam satu gesture harus memiliki batas perhitungan yang jelas.

### 11.4 XP dan reward

- Reward diberikan atas usaha dan objective yang selesai.
- Hindari reward acak yang menyerupai gambling/loot box.
- Jangan menjadikan durasi bermain panjang sebagai satu-satunya dasar reward.
- Jangan memberi reward berulang untuk completion yang sama.
- Jangan mengurangi XP yang sudah diperoleh karena anak gagal di level selanjutnya.
- Jelaskan reward sebelum pemain menggunakan tiket jika reward tersebut menjadi alasan utama bermain.

### 11.5 Streak dan tekanan bermain

Streak boleh menjadi indikator konsistensi, tetapi:

- Jangan menggunakan pesan yang menyalahkan anak saat tidak bermain.
- Jangan mengancam kehilangan pencapaian karena mengambil istirahat.
- Jangan membuat anak merasa harus bermain setiap hari.
- Jangan mengirim reminder yang menekan atau memanipulasi.

---

## 12. Feedback dan motivasi

### 12.1 Prinsip bahasa

Gunakan bahasa Indonesia yang sederhana, positif, dan sesuai usia. Teks harus tetap menghormati materi agama dan tidak menggunakan candaan yang merendahkan bacaan.

### 12.2 Contoh feedback

| Situasi | Contoh |
|---|---|
| Benar | “Hebat! Kamu menemukan Fathah.” |
| Salah harakat | “Hampir benar. Perhatikan tanda di bawah huruf, itu Kasrah.” |
| Salah urutan | “Huruf itu nanti. Sekarang cari huruf berikutnya.” |
| Target terlewat | “Tidak apa-apa. Kita coba lagi.” |
| Objective selesai | “Rangkaianmu berhasil disusun!” |
| Kesempatan habis | “Kesempatan latihan kali ini selesai. Mau coba lagi?” |
| Perlu latihan | “Ayo berlatih Kasrah sekali lagi.” |

### 12.3 Feedback tidak boleh mengganggu gameplay

- Feedback benar dapat tampil singkat dan tidak menutup target berikutnya.
- Feedback salah harus cukup lama untuk dibaca, tetapi tidak membuat objek bergerak tanpa kendali.
- Gunakan audio opsional, bukan audio wajib.
- Jangan tampilkan modal besar setiap kali pemain salah.
- Sediakan ringkasan setelah level untuk penjelasan yang lebih lengkap.

### 12.4 Visual feedback

- Benar: highlight, checkmark, partikel ringan.
- Salah: shake pendek atau highlight yang lembut, bukan flash agresif.
- Level complete: animasi positif singkat.
- Kesempatan habis: tampilan tenang dengan pilihan retry.

Animasi tidak boleh menghalangi informasi atau membuat motion sickness.

---

## 13. HUD, kontrol, dan interaksi

### 13.1 Informasi prioritas HUD

Urutan prioritas:

1. Target pembelajaran.
2. Progres objective.
3. Kesempatan/nyawa (Challenge Mode).
4. Timer (hanya jika aktif).
5. Skor dan combo.
6. Tombol pause dan bantuan.

Jangan membuat skor lebih menonjol daripada target belajar.

### 13.2 Harakat Slasher HUD

Contoh struktur:

```text
┌──────────────────────────────────────┐
│ ❤️ ❤️ ❤️       LEVEL 3       ⭐ 120  │
│                                      │
│              TARGET                  │
│             FATHAH (َ)               │
│                بَ                    │
│        Dengarkan contoh bunyi        │
│                                      │
│          PROGRES 6 / 10              │
│                                      │
│             AREA GAME                │
│                                      │
│  [Bantuan]                    [Pause]│
└──────────────────────────────────────┘
```

Timer tidak muncul pada Practice Mode.

### 13.3 Hijaiyah Harvest HUD

```text
┌──────────────────────────────────────┐
│ ❤️ ❤️ ❤️       LEVEL 2        ⭐ 80  │
│                                      │
│              SUSUN HURUF             │
│                                      │
│       [بَ]  →  [تَ]  →  [نَ]         │
│         ✓       AKTIF      ○         │
│                                      │
│          HURUF BERIKUTNYA            │
│                 تَ                   │
│                                      │
│              AREA GAME               │
│                                      │
│              KERANJANG               │
└──────────────────────────────────────┘
```

### 13.4 Pause

Pause harus:

- Menghentikan object spawn.
- Menghentikan simulasi posisi objek.
- Menghentikan timer Challenge Mode.
- Menghentikan input gameplay.
- Menyimpan progres sementara.
- Menampilkan pilihan Lanjutkan dan Keluar.

### 13.5 Tab visibility

Jika tab/browser menjadi tidak aktif:

- Jangan membiarkan timer terus berjalan tanpa sepengetahuan pemain.
- Pause otomatis atau simpan state dan hentikan timer.
- Ketika kembali, tampilkan status pause/resume yang jelas.
- Pastikan event visibility tidak membuat pause/resume berulang secara tidak terkendali.

### 13.6 Touch target dan gesture

- Tombol penting harus memiliki target sentuh minimal sekitar 44×44 CSS px.
- Gesture harus diuji di perangkat low-end dan ukuran layar kecil.
- Jangan membuat seluruh layar menjadi area swipe jika ada tombol HUD yang harus tetap dapat ditekan.
- Sediakan kontrol alternatif yang sesuai.

---

## 14. Visual design dan accessibility

### 14.1 Identitas visual Tartila

Pertahankan gaya Neo-Brutalism Tartila dengan intensitas yang ramah anak:

- Teal sebagai warna identitas.
- Kuning sebagai highlight positif.
- Coral untuk peringatan atau kesalahan.
- Border tegas pada target penting.
- Hard shadow selektif.
- Ilustrasi sederhana yang mudah dibedakan.

Jangan memenuhi area gameplay dengan dekorasi yang mengalihkan perhatian dari huruf.

### 14.2 Kontras dan kode visual

- Jangan membedakan target hanya berdasarkan warna.
- Gunakan label, bentuk, ikon, pola, dan teks.
- Teks harus terbaca pada background.
- Ukuran karakter Arab harus cukup besar.
- Objek target dan pengecoh harus mudah dibedakan tanpa mengandalkan saturasi warna saja.

### 14.3 Typography Arab

- Gunakan font yang mendukung Arabic shaping dan harakat.
- Uji fathah, kasrah, dhammah, sukun, tasydid, tanwin, dan kombinasi yang dipakai dalam materi.
- Jangan memotong tanda di atas atau di bawah huruf.
- Beri jarak line-height yang cukup.
- Gunakan `dir="rtl"` pada area teks Arab yang sesuai.
- Periksa tampilan pada browser dan OS yang berbeda.

### 14.4 Reduced motion

Hormati `prefers-reduced-motion`.

Jika reduced motion aktif:

- Kurangi shake dan partikel.
- Hilangkan animasi berulang.
- Gunakan transisi sederhana.
- Jangan menghilangkan feedback informasi.

### 14.5 Audio

- Sediakan kontrol mute.
- Audio tidak boleh mulai dengan volume mengejutkan.
- Sediakan indikator visual sebagai alternatif audio.
- Audio contoh harus dapat diputar ulang.
- Jangan menganggap anak mendengar audio dengan jelas di semua kondisi.

### 14.6 Perangkat dan orientasi

- Prioritaskan portrait mobile jika desain game memang dibuat untuk portrait.
- Uji landscape bila didukung.
- Pastikan area interaksi tidak tertutup browser safe area.
- Uji layar kecil dan rasio layar yang berbeda.
- Jangan memaksa fullscreen tanpa alasan dan tanpa kontrol keluar.

---

## 15. Konten Arab, harakat, dan audio

### 15.1 Data terstruktur

Jangan menyimpan semua karakter hanya sebagai string visual bila logika membutuhkan huruf dasar dan harakat terpisah.

Contoh:

```ts
export interface ArabicCharacter {
  id: string;
  baseLetter: string;
  harakat?: HarakatName;
  displayText: string;
  audioId?: string;
  lessonId?: string;
}
```

Untuk Hijaiyah Harvest, target dapat berupa daftar `ArabicCharacter` atau ID karakter yang telah divalidasi.

### 15.2 Normalisasi

- Gunakan Unicode normalization dengan hati-hati.
- Jangan menghapus semua combining marks secara global.
- Jangan mengandalkan indeks UTF-16 sebagai jumlah huruf Arab.
- Pisahkan data karakter dari format tampilan.
- Uji kombinasi harakat yang urutannya dapat berbeda dalam data sumber.
- Validasi display text terhadap data huruf dan harakat terstruktur.

### 15.3 RTL dan shaping

- Teks Arab harus dirender dengan shaping yang benar.
- Gunakan `dir="rtl"` pada container teks Arab.
- Jangan menggabungkan teks Arab dengan tanda baca Latin tanpa menguji bidirectional layout.
- Jangan menyusun ulang karakter Arab menggunakan operasi string biasa tanpa memahami grapheme/code point.

### 15.4 Validasi pelafalan

- Audio harus berasal dari rekaman atau sumber yang telah disetujui pengajar.
- Label bacaan harus sesuai materi.
- Jangan membuat audio otomatis yang mengubah makhraj atau sifat bacaan.
- Jika audio belum tersedia, sembunyikan tombol audio atau tampilkan keadaan nonaktif yang jelas.

### 15.5 Konten dan kurikulum

Setiap level harus memiliki metadata:

- Learning objective.
- Materi/lesson ID.
- Kumpulan target yang valid.
- Kumpulan distractor yang valid.
- Contoh dan audio.
- Aturan penyelesaian.
- Parameter kesulitan.
- Pengajar/pihak yang memvalidasi konten.

---

## 16. Arsitektur runtime dan performa

### 16.1 Game loop

Jika game menggunakan animasi real-time:

- Gunakan `requestAnimationFrame` atau engine yang sudah dipakai proyek.
- Hitung pergerakan berdasarkan delta time, bukan asumsi FPS tetap.
- Pause dan cleanup animation frame dengan benar.
- Hindari menyimpan posisi setiap objek ke React state pada setiap frame jika menyebabkan render berlebihan.
- Gunakan state/ref atau engine layer yang sesuai.

### 16.2 Collision dan event processing

- Setiap objek memiliki ID unik.
- Objek hanya dapat diproses satu kali.
- Collision harus memiliki toleransi yang adil.
- Gesture ID dapat digunakan untuk mencegah multi-penalty dari satu swipe.
- Objek harus memiliki status lifecycle yang jelas: spawned, active, hit, missed, expired.
- Hasil collision harus deterministik untuk kasus yang sama.

### 16.3 Spawn scheduler

- Spawn scheduler harus berhenti saat pause.
- Timer harus dibersihkan ketika level unmount atau sesi berakhir.
- Jangan membuat setInterval/requestAnimationFrame ganda saat resume.
- Jangan spawn objek ketika level sudah completed atau game over.
- Gunakan konfigurasi spawn per level, bukan konstanta tersebar di komponen.

### 16.4 React integration

- Pisahkan game rules dari komponen tampilan.
- Pisahkan game loop dari UI render.
- Gunakan reducer atau state machine untuk transisi yang kompleks.
- Gunakan hook untuk orkestrasi, bukan menaruh seluruh business logic di komponen page.
- Bersihkan event listener, timer, audio, dan animation frame pada cleanup.
- Hindari stale closure pada callback game loop.

### 16.5 Offline dan network interruption

Jika game membutuhkan backend:

- Simpan progres sesi penting dengan mekanisme yang aman.
- Jangan menganggap request gagal berarti transaksi tiket gagal.
- Lakukan recovery dengan session ID/idempotency key.
- Jangan membuat sesi baru sebelum status transaksi sebelumnya diketahui.
- Tampilkan status koneksi dan recovery secara jelas.

### 16.6 Performance target

- Gameplay harus terasa responsif pada perangkat target yang didukung.
- Hindari layout shift yang mengubah posisi target secara tiba-tiba.
- Optimalkan aset gambar dan audio.
- Batasi jumlah objek aktif.
- Uji performa pada perangkat low-end yang mewakili pengguna.
- Jika frame rate turun, jangan menghitungnya sebagai kesalahan pemain.

---

## 17. Data model dan event analytics

### 17.1 Prinsip data

Analytics digunakan untuk memahami proses belajar dan memperbaiki game, bukan untuk mengawasi anak secara berlebihan.

Kumpulkan data minimum yang benar-benar diperlukan.

### 17.2 Result model — Harakat Slasher

```ts
export interface HarakatGameResult {
  sessionId: string;
  levelId: string;
  totalCorrect: number;
  totalWrong: number;
  totalMissed: number;
  accuracy: number | null;
  accuracyByHarakat: Partial<Record<HarakatName, number | null>>;
  hintsUsed: number;
  durationMs: number;
  completed: boolean;
  endedReason: "objective-complete" | "lives-exhausted" | "time-expired" | "user-exit";
}
```

### 17.3 Result model — Hijaiyah Harvest

```ts
export interface HijaiyahGameResult {
  sessionId: string;
  levelId: string;
  completedCharacters: number;
  totalCharacters: number;
  correctSequence: number;
  wrongSequence: number;
  missedTarget: number;
  accuracy: number | null;
  hintsUsed: number;
  durationMs: number;
  completed: boolean;
  endedReason: "sequence-complete" | "lives-exhausted" | "time-expired" | "user-exit";
}
```

### 17.4 Event minimum

Event yang dapat dicatat:

- `game_session_created`
- `game_session_resumed`
- `game_session_completed`
- `game_session_abandoned`
- `level_started`
- `level_completed`
- `level_retried`
- `target_correct`
- `target_wrong`
- `target_missed`
- `hint_used`
- `pause_started`
- `pause_ended`
- `ticket_consumed`
- `reward_granted`

Jangan mengirim event berkali-kali dari satu collision atau satu aksi yang sama.

### 17.5 Indikator pembelajaran

Untuk Harakat Slasher, analitik sebaiknya dapat menunjukkan:

- Ketepatan berdasarkan harakat.
- Jumlah kesalahan per kategori.
- Target yang sering terlewat.
- Penggunaan hint.
- Perkembangan antarpercobaan.

Untuk Hijaiyah Harvest:

- Ketepatan karakter.
- Ketepatan urutan.
- Posisi urutan yang sering salah.
- Jumlah target yang terlewat.
- Penggunaan hint.
- Perkembangan antarpercobaan.

### 17.6 Interpretasi data

- Akurasi rendah bukan otomatis berarti anak tidak memahami materi.
- Kecepatan rendah bukan otomatis berarti kemampuan membaca rendah.
- Data harus dilihat bersama kondisi perangkat, kontrol, dan penggunaan hint.
- Tampilkan data kepada ustadz sebagai indikator latihan, bukan diagnosis kemampuan anak.

---

## 18. Keamanan, privasi, dan kesejahteraan anak

### 18.1 Data minimal

- Kumpulkan data yang dibutuhkan untuk gameplay dan pembelajaran saja.
- Hindari menyimpan data pribadi yang tidak diperlukan.
- Jangan merekam suara atau video pemain secara default.
- Jangan menampilkan identitas lengkap anak pada leaderboard publik.
- Batasi akses data sesuai role dan izin aplikasi.

### 18.2 Komunikasi dan kompetisi

- Hindari chat bebas yang tidak dimoderasi pada game anak.
- Kompetisi sebaiknya bersifat sehat dan tidak mempermalukan.
- Gunakan nama tampilan atau avatar yang sesuai kebijakan privasi.
- Jangan menjadikan posisi leaderboard sebagai penilaian harga diri anak.

### 18.3 Reward dan ekonomi

- Tidak boleh ada loot box atau reward acak yang mendorong perilaku seperti berjudi.
- Jangan membuat anak merasa wajib membeli tiket untuk bisa belajar.
- Jelaskan penggunaan tiket sebelum Challenge Mode dimulai.
- Jangan membuat tombol pembelian lebih menonjol daripada tombol latihan.
- Jangan mengirim notifikasi manipulatif seperti ancaman kehilangan streak.

### 18.4 Jeda dan durasi

- Sediakan pause.
- Sediakan jalan keluar yang jelas.
- Jangan menghukum anak karena berhenti bermain.
- Jika sesi memiliki batas waktu, jelaskan sebelum dimulai.
- Jangan menggunakan desain yang memaksa pemain terus bermain demi mempertahankan reward.

---

## 19. QA, playtest, dan validasi edukasi

### 19.1 Uji bersama pengguna

Lakukan playtest dengan peserta yang mewakili variasi usia dan kemampuan. Pastikan ada persetujuan orang tua/wali dan pendampingan yang sesuai.

Kelompok pengujian yang disarankan:

- SD kelas bawah.
- SD kelas atas.
- SMP.
- SMA.
- Variasi kemampuan awal membaca.
- Variasi ukuran layar dan kemampuan motorik.

Jangan menganggap satu atau dua peserta cukup untuk menyimpulkan seluruh kelompok usia.

### 19.2 Pertanyaan observasi

1. Apakah pemain mengerti tujuan tanpa bantuan berulang?
2. Apakah pemain dapat menunjukkan target yang harus dicari?
3. Apakah pemain memahami mengapa jawaban salah?
4. Apakah pemain dapat menggunakan kontrol dengan nyaman?
5. Apakah permainan terlalu cepat atau terlalu lambat?
6. Apakah pemain fokus pada materi atau hanya mengejar skor?
7. Apakah pemain mau mencoba kembali setelah salah?
8. Apakah pemain dapat menjelaskan hal yang dipelajari setelah bermain?
9. Apakah teks Arab dan harakat terbaca jelas?
10. Apakah timer atau penalti menimbulkan tekanan yang tidak perlu?

### 19.3 Unit test game rules

Minimal uji:

- Target matching berdasarkan harakat.
- Target matching berdasarkan syllable.
- Karakter tidak valid.
- Objek terkena satu gesture hanya diproses sekali.
- Penalti maksimal satu kali per gesture.
- Distractor yang lolos tidak mengurangi nyawa.
- Target yang lolos mengurangi nyawa hanya dalam Challenge Mode.
- Hijaiyah Harvest hanya mengisi slot berikutnya jika cocok.
- Urutan yang salah tidak mengisi slot.
- Completion hanya terjadi setelah objective selesai.
- Skor tidak memicu completion sendiri.
- Timer expiry menghasilkan status yang benar.

### 19.4 Integration test session dan tiket

Minimal uji:

1. Practice Mode tidak memotong tiket.
2. Challenge Mode memotong tepat satu tiket.
3. Double click Start tidak memotong dua tiket.
4. Retry tidak memotong tiket.
5. Next Level tidak memotong tiket.
6. Resume tidak memotong tiket.
7. Refresh tidak membuat sesi baru tanpa pemeriksaan.
8. Network timeout setelah server commit tidak membuat debit ganda.
9. Sesi completed tidak dapat menerima reward completion kedua.
10. User tidak dapat mengakses sesi milik user lain.

### 19.5 E2E test

Skenario minimum:

- Mulai Practice Mode dan selesaikan level.
- Mulai Challenge Mode dengan tiket cukup.
- Mulai Challenge Mode tanpa tiket.
- Selesaikan level dan lanjut ke level berikutnya.
- Kalah dan retry level.
- Pause dan resume.
- Refresh dan pulihkan sesi.
- Timer Challenge Mode berakhir.
- Selesaikan level terakhir.
- Navigasi keluar dengan konfirmasi.

### 19.6 QA visual dan perangkat

Uji:

- Mobile kecil.
- Mobile standar.
- Tablet.
- Desktop.
- Portrait dan landscape jika didukung.
- Browser yang didukung proyek.
- Perangkat low-end.
- Font Arab fallback.
- Reduced motion.
- Audio muted.

### 19.7 Validasi pengajar

Pengajar Tilawati harus memeriksa:

- Kebenaran huruf dan harakat.
- Kesesuaian contoh.
- Urutan karakter.
- Kesesuaian materi dengan tahap pembelajaran.
- Ketepatan audio dan label bacaan.
- Apakah feedback tidak bertentangan dengan pembelajaran.

---

## 20. Acceptance criteria

Fitur dianggap siap jika seluruh kriteria yang relevan terpenuhi.

### 20.1 Kriteria umum

- [ ] Tujuan belajar terlihat sebelum permainan dimulai.
- [ ] Practice Mode tersedia dan tidak menggunakan tiket.
- [ ] Challenge Mode menjelaskan tiket, nyawa, dan timer sebelum mulai.
- [ ] Kesalahan menghasilkan feedback edukatif.
- [ ] Pemain dapat pause dan keluar secara jelas.
- [ ] Target dan objek dapat dibedakan tanpa mengandalkan warna saja.
- [ ] Teks Arab dan harakat dirender dengan benar.
- [ ] Gameplay tidak menghukum keterlambatan input akibat performa sistem.
- [ ] Result screen memuat ringkasan pembelajaran.

### 20.2 Harakat Slasher

- [ ] Mode harakat memeriksa tanda harakat terstruktur.
- [ ] Mode syllable memeriksa huruf dasar dan harakat.
- [ ] Target ditampilkan dengan label dan contoh.
- [ ] Swipe dan tap berfungsi.
- [ ] Satu objek hanya diproses satu kali.
- [ ] Satu gesture tidak menimbulkan penalti berulang.
- [ ] Distractor yang terlewat tidak mengurangi nyawa.
- [ ] Objective target menentukan kemenangan.
- [ ] Skor tidak dapat memicu kemenangan sendiri.
- [ ] Hazard tidak menyebabkan instant Game Over.

### 20.3 Hijaiyah Harvest

- [ ] Rangkaian target selalu terlihat.
- [ ] Slot aktif terlihat jelas.
- [ ] Keranjang dapat dikontrol dengan nyaman.
- [ ] Urutan salah tidak mengisi slot.
- [ ] Objek pengecoh yang terlewat tidak mengurangi nyawa.
- [ ] Target aktif yang terlewat ditangani sesuai mode.
- [ ] Objective hanya selesai ketika seluruh urutan lengkap.
- [ ] Skor tidak dapat menggantikan karakter yang belum tersusun.
- [ ] Multi-word hanya tersedia sebagai tantangan lanjutan yang dijelaskan.

### 20.4 Session dan tiket

- [ ] Satu Challenge Session menggunakan tepat satu tiket.
- [ ] Practice Session tidak menggunakan tiket.
- [ ] Next Level tidak membuat sesi baru.
- [ ] Retry Level tidak membuat sesi baru.
- [ ] Resume tidak membuat sesi baru.
- [ ] Refresh tidak menyebabkan debit ganda.
- [ ] Debit tiket memiliki idempotency protection di backend.
- [ ] Reward completion tidak dapat diklaim ganda.
- [ ] SessionState dan LevelState terpisah.

### 20.5 Kualitas teknis

- [ ] Tidak ada timer, event listener, atau animation frame ganda.
- [ ] Cleanup dilakukan ketika game berhenti atau unmount.
- [ ] Tidak ada collision yang diproses berulang.
- [ ] State transition divalidasi.
- [ ] Unit test dan integration test kritis lulus.
- [ ] Build proyek lulus.
- [ ] Tidak ada error runtime yang diketahui pada alur utama.

---

## 21. Prioritas implementasi

Gunakan urutan berikut untuk meminimalkan risiko mengembangkan fitur dekoratif sebelum aturan game benar.

| Prioritas | Pekerjaan | Alasan |
|---|---|---|
| P0 | Learning objective dan definisi target | Memastikan game menguji materi yang benar |
| P0 | Win/lose condition | Mencegah hasil yang tidak adil atau ambigu |
| P0 | Practice dan Challenge Mode | Memisahkan latihan dan tantangan |
| P0 | SessionState dan LevelState | Mencegah reset state yang salah |
| P0 | Ticket transaction dan idempotency | Mencegah tiket terpotong ganda |
| P0 | Next Level, retry, resume | Menjaga alur sesi |
| P1 | Feedback benar/salah | Mendukung proses belajar |
| P1 | Fair spawn dan collision | Mencegah kekalahan akibat sistem |
| P1 | Pause dan accessibility controls | Menjamin kenyamanan penggunaan |
| P1 | Arabic rendering validation | Menjaga akurasi materi |
| P2 | Adaptive difficulty | Menyesuaikan tantangan dengan kemampuan |
| P2 | Learning analytics | Menunjukkan area yang perlu dilatih |
| P3 | Advanced multi-target/multi-word | Menambah variasi untuk pemain mahir |
| P3 | Hazard, visual effects, kosmetik | Penyempurnaan setelah fondasi stabil |

### 21.1 Rekomendasi tahap delivery

**Milestone 1 — Rules & correctness**

Implementasikan data target, reducer/state machine, objective, collision, serta unit test. Belum perlu efek visual kompleks.

**Milestone 2 — Session & economy**

Implementasikan pembuatan sesi, tiket, idempotency, retry, next level, resume, dan reward deduplication.

**Milestone 3 — Practice & feedback**

Implementasikan Practice Mode, hint, feedback edukatif, pause, dan result summary.

**Milestone 4 — Challenge progression**

Implementasikan Challenge Mode dan progresi lima level berdasarkan konfigurasi yang telah disetujui.

**Milestone 5 — Analytics & adaptive difficulty**

Simpan hasil secara terstruktur dan gunakan data untuk penyesuaian yang transparan.

**Milestone 6 — Visual polish & playtest**

Sempurnakan animasi, audio, efek, responsivitas, dan uji bersama anak serta pengajar.

---

## 22. Checklist singkat untuk AI coding agent

Sebelum mengubah kode, AI coding agent WAJIB:

1. Membaca dokumen ini secara utuh.
2. Memeriksa implementasi game yang sudah ada.
3. Memetakan state, route, API, store, dan mekanik ekonomi yang digunakan.
4. Membedakan bug yang sudah ada dari perubahan yang diminta.
5. Memastikan aturan baru tidak bertentangan dengan backend dan progression system.
6. Mempertahankan fitur yang sudah ada kecuali perubahan memang diminta.
7. Mengimplementasikan game rules secara terpisah dari komponen visual.
8. Menambahkan atau memperbarui test untuk setiap perubahan mekanik.
9. Memeriksa bahwa tiket tidak terpotong lagi saat retry, resume, atau Next Level.
10. Menjalankan pemeriksaan TypeScript, test, dan build yang tersedia.
11. Melaporkan apa yang benar-benar diuji dan apa yang belum diuji.

AI coding agent MUST NOT:

- Menghapus fungsi lama demi menyederhanakan UI.
- Mengarang endpoint, field backend, atau saldo tiket.
- Mengubah aturan Tilawati tanpa validasi pengajar.
- Mengubah Practice Mode menjadi mode berbayar.
- Menambahkan timer wajib tanpa keputusan produk.
- Mengubah Next Level menjadi navigasi yang membuat sesi baru.
- Menambahkan debit tiket pada loop game atau per level.
- Menyatakan build berhasil jika build tidak dijalankan.
- Mengganti data asli dengan data dummy untuk menutupi loading/error.

Jika menemukan ketidaksesuaian antara dokumen ini dan implementasi backend, AI agent harus menjelaskan konflik, menunjukkan file atau fungsi terkait, dan mengusulkan migrasi yang aman. Jangan diam-diam membuat asumsi.

---

## 23. Glosarium

| Istilah | Arti |
|---|---|
| Learning objective | Kemampuan spesifik yang dilatih atau diukur pada level |
| Practice Mode | Mode latihan tanpa penalti dan tanpa tiket |
| Challenge Mode | Mode tantangan dengan tiket dan kesempatan terbatas |
| Session | Satu rangkaian permainan yang dapat mencakup beberapa level |
| Level | Satu tahap objective pembelajaran di dalam sesi |
| SessionState | State yang bertahan antar-level dalam satu sesi |
| LevelState | State yang di-reset ketika level diulang atau berganti |
| UIState | State tampilan seperti modal, pause dialog, atau tooltip |
| Target | Karakter, harakat, atau rangkaian yang harus dipenuhi pemain |
| Distractor | Objek pengecoh yang bukan target aktif |
| Hazard | Objek tantangan tambahan seperti bom atau buah busuk |
| Combo | Rangkaian jawaban benar berturut-turut |
| Adaptive difficulty | Penyesuaian tantangan berdasarkan performa dan kebutuhan pemain |
| Idempotency key | Kunci untuk memastikan request berulang tidak memproses transaksi yang sama lebih dari sekali |
| Failure boundary | Batas area tempat objek dianggap terlewat |
| Learning analytics | Data ringkas untuk memahami proses dan perkembangan latihan |

---

## Catatan penutup

Pedoman ini adalah landasan desain dan implementasi. Angka target, timer, kecepatan spawn, rasio pengecoh, ambang adaptasi, serta reward adalah parameter yang perlu diuji—bukan fakta perkembangan anak yang berlaku universal.

Sebelum rilis, seluruh materi huruf, harakat, pelafalan, dan urutan harus divalidasi pengajar Tilawati. Mekanik harus diuji dengan anak dari rentang usia dan kemampuan yang beragam, dengan persetujuan dan pendampingan yang sesuai.

**Prinsip akhir Tartila:** game yang baik bukan game yang membuat anak terus bermain tanpa henti, tetapi game yang membantu anak belajar dengan jelas, merasa aman untuk mencoba, dan melihat bahwa kemampuannya berkembang.
