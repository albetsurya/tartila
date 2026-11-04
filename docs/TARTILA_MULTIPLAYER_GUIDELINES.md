# TARTILA MULTIPLAYER GUIDELINES

**Dokumen:** Single Source of Truth (SSOT) untuk Tartila Arena, Duel 1v1, dan Ujian Multiplayer  
**Status:** Draft teknis yang direkomendasikan untuk disepakati sebelum implementasi  
**Versi:** 1.0  
**Tanggal:** 4 November 2026  
**Cakupan:** Product behavior, game flow, role & permission, state machine, scoring, WebSocket protocol, routing, lifecycle, UI/UX, security, dan QA.

> Dokumen ini adalah acuan bersama Product, Design, Frontend, Backend, dan QA. Implementasi tidak boleh membuat perilaku sendiri yang bertentangan dengan dokumen ini. Jika sistem yang sudah berjalan berbeda, audit implementasi terlebih dahulu, petakan kompatibilitas, lalu ajukan perubahan SSOT sebelum mengubah kontrak API atau WebSocket.

---

# 0. RINGKASAN KEPUTUSAN UTAMA

1. **Server adalah authoritative source of truth.** Host adalah pengendali room, bukan sumber kebenaran skor, timer, jawaban benar, atau pemenang.
2. **Host ikut bermain pada `casual` dan `duel`.** Host memiliki dua kapabilitas sekaligus: participant/player dan room controller. Pada `exam`, host adalah supervisor/presenter dan bukan peserta yang berkompetisi.
3. **Semua peserta masuk ke Lobi terlebih dahulu.** Tidak ada alur join PIN atau invitation yang langsung memasukkan pemain ke halaman soal.
4. **Jawaban dapat diganti selama soal masih terbuka.** Pemilihan jawaban terakhir yang diterima server menjadi jawaban aktif sampai peserta mengunci atau soal ditutup oleh server.
5. **Player lock berbeda dengan host global reveal.** Player dapat mengunci jawaban sendiri. Host dapat menutup soal untuk semua peserta dan memicu reveal.
6. **Timer yang terlihat di perangkat hanya presentasi.** Deadline dan keputusan menerima/menolak jawaban ditentukan server.
7. **`NEXT_QUESTION` adalah perintah/transisi, bukan fase permainan yang wajib menetap.** State machine menggunakan fase yang eksplisit dan menambahkan `FINISHED`.
8. **Pemenang dan ranking dihitung server.** Client tidak boleh mengirim nilai final yang dipercaya, seperti `hostScore`, `playerScore`, atau `winnerId` hasil hitungan lokal.
9. **Duel, Arena Casual, dan Exam mempunyai presentasi hasil yang berbeda.** Duel dapat seri; Arena menampilkan banyak peserta; Exam tidak wajib menampilkan leaderboard kompetitif publik.
10. **Rematch membuat `matchId` baru di dalam room yang sama.** Peserta yang masih bergabung tetap di Lobi, skor dan jawaban pertandingan sebelumnya dibersihkan, dan PIN/room dapat dipertahankan sesuai kebijakan room.
11. **Keluar pemain tidak sama dengan mengakhiri room.** Konfirmasi, dampak, dan izin keluar harus bergantung pada peran serta status pertandingan.
12. **Semua event harus aman terhadap duplikasi, event basi, reconnect, dan race condition.** Gunakan ID command/event, sequence/version, snapshot, validasi, dan otorisasi server.

---

# 1. TUJUAN, CAKUPAN, DAN ISTILAH

## 1.1 Tujuan

Menyediakan pengalaman multiplayer kuis Tartila yang:

- Sinkron bagi semua perangkat.
- Adil terhadap seluruh peserta.
- Mudah dipahami anak SD–SMA.
- Tidak memberikan keuntungan tidak wajar kepada host.
- Tetap berjalan dengan benar ketika jaringan lambat, perangkat berpindah tab, atau peserta reconnect.
- Memisahkan pengalaman bermain, pengawasan ujian, dan administrasi room.
- Memiliki kontrak event yang dapat diuji serta dipelihara.

## 1.2 Cakupan mode

| Mode | Jumlah peserta kompetitif | Peran host | Penggunaan |
|---|---:|---|---|
| `casual` | 2 atau lebih, sesuai konfigurasi room | Pemain + controller | Bermain bersama dan leaderboard |
| `duel` | Tepat 2 pemain | Salah satu pemain + controller | Pertandingan 1 lawan 1 |
| `exam` | 1 atau lebih santri | Supervisor/presenter | Ujian resmi, bukan kompetisi host vs santri |

**Definisi jumlah peserta:** Pada `casual`, host dihitung sebagai satu peserta kompetitif. Pada `duel`, host adalah pemain pertama dan hanya satu pemain lawan yang dapat bergabung. Pada `exam`, host tidak dihitung sebagai peserta ujian.

## 1.3 Istilah

- **Room:** wadah/ruang yang memiliki PIN, host, konfigurasi, daftar peserta, dan lifecycle room.
- **Match:** satu sesi pertandingan/ujian di dalam room. Satu room dapat digunakan ulang untuk rematch dengan `matchId` baru.
- **Host:** pemilik atau pengendali room yang berwenang menjalankan aksi kontrol sesuai mode.
- **Player/Participant:** pengguna yang ikut menjawab soal dan dapat memperoleh skor.
- **Supervisor:** host pada mode Exam yang mempresentasikan atau mengawasi ujian.
- **Server:** backend yang menyimpan state resmi, memvalidasi command, menghitung skor, dan menerbitkan event.
- **Client:** aplikasi pada perangkat host atau peserta. Client hanya menampilkan state resmi dan mengirim intent/command.
- **Question deadline:** waktu absolut menurut server ketika soal harus ditutup.
- **Snapshot:** representasi state room/match terkini yang dikirim server untuk sinkronisasi atau recovery.

---

# 2. PRINSIP DASAR DAN ATURAN TIDAK BOLEH DILANGGAR

## 2.1 Server-authoritative, bukan client-authoritative

Server adalah satu-satunya sumber kebenaran untuk:

- Status room dan match.
- Fase permainan.
- Urutan soal.
- Waktu mulai dan deadline soal.
- Validitas jawaban.
- Status jawaban terkunci.
- Skor resmi.
- Ranking dan hasil akhir.
- Daftar peserta yang sah.
- Identitas host dan hak akses.

Host boleh **meminta** server melakukan aksi, tetapi tidak dapat memaksakan perubahan state hanya dengan mengubah state lokal atau mengirim data hasil hitungan sendiri.

**Dilarang:**

- Menghitung `winnerId` di client lalu menjadikannya hasil resmi.
- Mempercayai `hostScore` atau `playerScore` dari payload client.
- Mempercayai client mengirim `questionIndex` arbitrer untuk menentukan soal berikutnya.
- Membiarkan client menentukan waktu berakhirnya soal.
- Mengungkap `correctAnswerId` sebelum fase reveal.
- Menganggap tombol host yang berubah di UI berarti server sudah menerima command.

## 2.2 Host-driven control, server-owned state

Istilah yang digunakan adalah **server-authoritative dengan host-controlled actions**.

- Host menentukan kapan memulai room/match jika syarat terpenuhi.
- Host dapat meminta reveal lebih awal.
- Host dapat meminta soal berikutnya.
- Server memvalidasi identitas host, fase saat ini, versi state, dan kelayakan aksi.
- Server melakukan transisi state dan menyiarkan hasil transisi kepada semua client.

Jika backend saat ini menjadikan browser host sebagai otoritas utama, hal tersebut harus dianggap sebagai keterbatasan arsitektur dan tidak boleh disamarkan sebagai server-authoritative. Untuk produksi, pindahkan validasi state dan penentuan hasil ke backend terpercaya.

## 2.3 Host ikut bermain

| Mode | Host melihat soal | Host melihat opsi | Host menjawab | Host mendapat skor | Host mengontrol room |
|---|---|---|---|---|---|
| `casual` | Ya | Ya | Ya | Ya | Ya |
| `duel` | Ya | Ya | Ya | Ya | Ya |
| `exam` | Sesuai presenter view | **Tidak** | **Tidak** | **Tidak** | Ya |

Pada `casual` dan `duel`, jawaban host diproses melalui jalur yang sama dengan peserta lain. Hak controller tidak memberikan akses untuk mengubah jawaban, skor, atau hasil.

Pada `exam`, host tidak melihat opsi A/B/C/D, jawaban santri, atau kunci jawaban sebelum waktu yang diizinkan. Area yang biasanya menampilkan opsi diganti indikator, misalnya **“12 dari 18 santri sudah menjawab”**. Host boleh melihat teks soal jika konfigurasi presenter mengizinkannya, tetapi tidak boleh melihat opsi dan kunci jawaban.

## 2.4 Bebas mengganti jawaban

- Peserta dapat memilih A, B, C, atau D.
- Peserta boleh mengganti pilihan selama soal masih `QUESTION_ACTIVE` dan jawaban belum dikunci.
- Pilihan terakhir yang **diterima server** menjadi jawaban aktif.
- Peserta dapat mengunci jawaban sendiri jika UI menyediakan tombol tersebut.
- Setelah jawaban dikunci oleh peserta, peserta tidak dapat mengubahnya.
- Host dapat menutup soal untuk semua peserta; setelah server menerima dan memproses command tersebut, semua jawaban menjadi final.
- Ketika deadline tercapai, server menutup soal secara otomatis.

## 2.5 Semua peserta masuk Lobi terlebih dahulu

- Join melalui PIN, link undangan, atau navigasi internal harus masuk ke Lobi.
- Tidak boleh langsung masuk ke halaman soal hanya karena room sedang aktif.
- Jika room sudah berjalan, kebijakan late-join berlaku: **ditolak sebagai pemain** atau **masuk sebagai spectator** sesuai konfigurasi. Default yang direkomendasikan: late join tidak menjadi peserta kompetitif di match berjalan.
- Host yang membuat room juga masuk ke halaman Lobi sebelum memulai permainan.

---

# 3. TIPE ROOM DAN PERMISSION MATRIX

## 3.1 Casual Arena

Karakteristik:

- Dapat diikuti beberapa peserta.
- Host adalah peserta sekaligus controller.
- Semua pemain, termasuk host, mendapat soal dan opsi yang sama.
- Semua jawaban disimpan oleh server.
- Host memiliki tombol kontrol tambahan yang tidak dimiliki peserta biasa.
- Leaderboard menampilkan peringkat banyak peserta.

Hak host:

- Memilih kategori/tema sebelum match dimulai.
- Memulai match.
- Meminta reveal jawaban.
- Meminta soal berikutnya.
- Mengakhiri match sesuai aturan.
- Kembali ke Lobi/rematch.

Hak player:

- Melihat soal dan opsi.
- Memilih dan mengganti jawaban selama soal aktif.
- Mengunci jawaban sendiri.
- Melihat reveal dan leaderboard sesuai aturan room.
- Keluar dari room tanpa menghentikan pertandingan untuk peserta lain.

## 3.2 Duel 1v1

Karakteristik:

- Tepat dua peserta kompetitif, termasuk host.
- Host adalah pemain pertama dan controller.
- Pemain kedua adalah lawan/challenger.
- Tidak boleh ada peserta ketiga yang masuk sebagai pemain setelah duel dimulai.
- Jika salah satu pemain belum bergabung, host tidak boleh memulai duel.
- Jika satu pemain disconnect, status pertandingan mengikuti aturan reconnect/disconnect pada bagian 10.

Leaderboard:

- Menampilkan dua pemain, skor, jumlah jawaban benar, dan hasil sementara.
- Status hasil akhir dapat `WIN`, `LOSE`, atau `DRAW`.
- Jika skor sama setelah seluruh tie-break yang disepakati, hasilnya **SERI**, bukan dua label “KAMU MENANG”.

## 3.3 Exam / Ujian Resmi

Karakteristik:

- Host berperan sebagai supervisor/presenter, bukan pemain.
- Host tidak melihat pilihan jawaban peserta.
- Host tidak memperoleh skor kompetitif.
- Peserta ujian melihat soal dan opsi sesuai konfigurasi ujian.
- Server mencatat jawaban dan waktu submit.
- Host melihat progres agregat, misalnya `X/Y sudah menjawab`, bukan isi jawaban individual selama ujian.
- Jawaban benar dan analisis hasil hanya dapat ditampilkan setelah ujian ditutup dan sesuai permission.

Rekomendasi tampilan hasil:

- Default Exam tidak menampilkan leaderboard publik antarsantri.
- Tampilkan hasil pribadi kepada santri bila kebijakan ujian mengizinkan.
- Ustadz melihat laporan dan hasil semua santri melalui halaman yang berizin.
- Jika produk memang memerlukan ranking ujian, fitur tersebut harus berupa konfigurasi eksplisit, bukan perilaku default.

## 3.4 Tabel permission

| Aksi | Host casual/duel | Player casual/duel | Host exam | Peserta exam |
|---|---:|---:|---:|---:|
| Memilih kategori sebelum mulai | Ya | Tidak | Ya | Tidak |
| Memulai match | Ya | Tidak | Ya | Tidak |
| Melihat soal | Ya | Ya | Sesuai presenter view | Ya |
| Melihat opsi jawaban | Ya | Ya | **Tidak** | Ya |
| Memilih jawaban | Ya | Ya | Tidak | Ya |
| Mengganti jawaban | Ya | Ya | Tidak | Ya |
| Mengunci jawaban sendiri | Ya | Ya | Tidak | Ya |
| Menutup soal global | Ya | Tidak | Ya | Tidak |
| Melihat jawaban benar sebelum reveal | Tidak | Tidak | Tidak | Tidak |
| Meminta soal berikutnya | Ya | Tidak | Ya | Tidak |
| Mengakhiri match | Ya, sesuai aturan | Tidak | Ya, sesuai aturan | Tidak |
| Melihat leaderboard kompetitif | Ya | Ya | Tidak secara default | Tidak secara default |

Semua permission harus divalidasi server per command, bukan hanya dengan menyembunyikan tombol di UI.

---

# 4. ROOM LIFECYCLE DAN MATCH LIFECYCLE

Room dan match harus dipisahkan secara konseptual.

## 4.1 Room lifecycle

Status room yang direkomendasikan:

```ts
type RoomStatus =
  | "lobby"
  | "in_progress"
  | "finished"
  | "closed";
```

- `lobby`: room dapat menerima peserta dan host dapat mengatur konfigurasi.
- `in_progress`: room sedang menjalankan match.
- `finished`: match terakhir selesai; room dapat menunggu rematch atau ditutup.
- `closed`: room tidak dapat digunakan lagi.

Jika room yang sama dipakai untuk rematch, `roomId` dan PIN dapat dipertahankan, tetapi `matchId` harus berubah.

## 4.2 Match lifecycle

```ts
type MatchPhase =
  | "LOBBY"
  | "COUNTDOWN"
  | "QUESTION_ACTIVE"
  | "REVEAL_ANSWER"
  | "LEADERBOARD"
  | "FINISHED";
```

`LOBBY` adalah fase sebelum sebuah match dimulai. Room tetap berada di Lobi setelah pembuatan dan setelah rematch.

`NEXT_QUESTION` bukan fase yang wajib ditampilkan. Itu adalah **host command** atau event transisi yang menyebabkan match berpindah dari `LEADERBOARD` ke `COUNTDOWN` untuk soal selanjutnya, atau ke `FINISHED` jika soal habis.

Jika implementasi membutuhkan animasi pergantian soal, gunakan UI transition lokal yang singkat atau substate `QUESTION_TRANSITION` yang tidak menjadi sumber kebenaran terpisah.

## 4.3 State per peserta

Status jawaban peserta adalah state tersendiri, bukan fase global match.

```ts
type PlayerAnswerStatus =
  | "not_answered"
  | "selected"
  | "locked"
  | "timed_out";
```

Dengan begitu, saat fase global masih `QUESTION_ACTIVE`, seorang pemain bisa berstatus `locked`, pemain lain `selected`, dan pemain lain `not_answered`.

---

# 5. STATE MACHINE DAN TRANSISI

## 5.1 Alur utama

```text
ROOM / MATCH LOBBY
        |
        | host.start_game (server validates)
        v
    COUNTDOWN
        |
        | server starts at startsAt
        v
 QUESTION_ACTIVE
        |
        | deadline reached OR host.reveal_answer
        v
  REVEAL_ANSWER
        |
        | reveal display window completed
        v
   LEADERBOARD
      /      \
     /        \
next question  no questions remain
   |                |
   v                v
COUNTDOWN         FINISHED
   |
   v
QUESTION_ACTIVE
```

## 5.2 Fase `LOBBY`

- Peserta berkumpul.
- Host memilih kategori, paket kuis, jumlah soal, dan durasi sesuai opsi yang tersedia.
- Host melihat daftar peserta.
- Casual/Duel: host terlihat sebagai pemain.
- Exam: host terlihat sebagai supervisor, tidak termasuk jumlah peserta yang dinilai.
- Sistem memvalidasi syarat minimum pemain.
- Tombol Mulai hanya aktif jika konfigurasi dan jumlah peserta memenuhi aturan.

Default:

- Casual: minimum dua pemain kompetitif, termasuk host.
- Duel: tepat dua pemain kompetitif.
- Exam: minimum satu peserta ujian selain host.

Jika produk ingin memperbolehkan Casual solo, jadikan konfigurasi eksplisit dan jangan diam-diam mengubah syarat minimum.

## 5.3 Fase `COUNTDOWN`

- Server menentukan `startsAt`.
- Semua client menampilkan hitung mundur berdasarkan timestamp tersebut.
- Countdown default dapat berupa 3, 2, 1, MULAI.
- Client tidak memulai timer soal hanya berdasarkan animasi lokal.
- Jika peserta reconnect saat countdown, server mengirim snapshot dengan `startsAt` yang sama.

## 5.4 Fase `QUESTION_ACTIVE`

- Server mengirim soal, opsi, `questionId`, `questionIndex`, `startedAt`, dan `deadlineAt`.
- Server tidak mengirim kunci jawaban atau `correctAnswerId`.
- Semua peserta kompetitif melihat soal dan opsi yang sama.
- Host casual/duel juga melihat dan menjawab soal.
- Host exam tidak melihat opsi.
- Client boleh memperbarui highlight pilihan secara optimistis, tetapi harus merekonsiliasi dengan acknowledgment server.
- Setelah deadline, client menonaktifkan input secara visual; server tetap menjadi penentu final.

## 5.5 Fase `REVEAL_ANSWER`

Transisi terjadi ketika:

1. Server mencapai `deadlineAt`; atau
2. Server menerima command `host.reveal_answer` yang sah.

Saat transisi:

- Server menolak jawaban baru atau perubahan jawaban.
- Semua jawaban yang telah diterima menjadi final.
- Timer dihentikan secara resmi oleh server.
- Jawaban benar ditampilkan.
- Pilihan benar dapat diberi border/background hijau.
- Pilihan salah dari peserta dapat ditandai merah jika kebijakan privasi/presentasi mengizinkan.
- Jangan menampilkan jawaban individu peserta lain pada layar publik jika tidak diperlukan.
- Semua Bottom Sheet/overlay yang menghalangi hasil wajib ditutup atau disembunyikan.
- Input jawaban dinonaktifkan.

## 5.6 Fase `LEADERBOARD`

- Server mengirim skor sementara dan ranking resmi untuk soal yang selesai.
- Duel menampilkan dua pemain.
- Casual Arena menampilkan Top N dan posisi pemain saat ini.
- Exam tidak menampilkan leaderboard kompetitif secara default.
- Host dapat meminta soal berikutnya.
- Untuk menghindari room macet, server dapat menjalankan auto-advance setelah `leaderboardDurationMs` yang dikonfigurasi. Host boleh mempercepat dengan tombol Soal Berikutnya.
- Timer leaderboard dan auto-advance tetap ditentukan server.

## 5.7 Fase `FINISHED`

- Server mengirim hasil final.
- Semua client menutup Bottom Sheet, modal sementara, picker, dan overlay game yang menghalangi hasil.
- Semua input permainan dinonaktifkan.
- Hasil tidak dihitung ulang oleh client.
- Tombol Kembali ke Lobi hanya aktif setelah server mengonfirmasi match selesai dan host mempunyai izin rematch.

## 5.8 Race condition transisi

Jika host menekan `reveal_answer` tepat saat deadline tercapai:

- Server hanya boleh memproses satu transisi efektif.
- Transisi pertama yang berhasil secara atomik menentukan hasil.
- Command berikutnya harus mendapatkan respons `already_transitioned` atau `invalid_phase`, bukan membuat reveal/score ganda.

Jika host menekan Next berulang kali:

- Server hanya memajukan satu soal.
- Gunakan `expectedStateVersion` atau `expectedQuestionIndex` untuk menolak command basi.

---

# 6. TIMER DAN SINKRONISASI WAKTU

## 6.1 Server clock adalah otoritas

Timer di setiap HP hanyalah visual. Server membuat dan menyimpan:

```ts
interface QuestionTiming {
  startedAt: string;  // timestamp server, ISO-8601 UTC
  deadlineAt: string; // timestamp server, ISO-8601 UTC
  durationMs: number;
}
```

Client menghitung sisa waktu dari `deadlineAt` dan estimasi waktu server. Client tidak boleh menentukan bahwa jawaban diterima hanya karena countdown lokal masih menunjukkan angka di atas nol.

## 6.2 Aturan menerima jawaban

- Server menerima jawaban hanya jika match masih `QUESTION_ACTIVE` dan deadline belum lewat sesuai aturan server.
- `receivedAt` ditentukan server, bukan timestamp yang dikirim client.
- Jawaban yang tiba setelah deadline ditolak sebagai `answer_too_late`.
- Jika produk membutuhkan toleransi jaringan, `lateSubmissionGraceMs` boleh disediakan sebagai konfigurasi server yang kecil dan konsisten untuk semua peserta. Jangan membuat grace berbeda per client.
- UI harus membedakan `mengirim`, `tersimpan`, dan `terkunci`.

## 6.3 Durasi soal

Jangan menetapkan 20 detik untuk semua soal tanpa mempertimbangkan panjang teks, keterbacaan, audio, dan tingkat peserta.

- Durasi ditentukan konfigurasi kuis/soal atau kebijakan room.
- Semua peserta dalam satu match mendapat deadline yang sama.
- Perubahan durasi tidak boleh dilakukan sepihak oleh client setelah soal dimulai.
- Exam dapat menggunakan durasi yang telah ditetapkan sebelum ujian dimulai.

---

# 7. ATURAN MENJAWAB DAN MENGUNCI JAWABAN

## 7.1 Memilih dan mengganti jawaban

Contoh:

1. Pemain memilih A.
2. Server menerima A dan menyimpan revision 1.
3. Pemain memilih B sebelum lock/deadline.
4. Server menerima B dan mengganti pilihan aktif menjadi B, revision 2.
5. B menjadi jawaban final ketika pemain mengunci atau soal ditutup.

Aturan:

- Pemilihan baru menggantikan pemilihan sebelumnya, bukan membuat dua jawaban.
- Server mengembalikan acknowledgment yang mengandung `answerRevision`.
- Client menangani acknowledgment yang datang terlambat dengan membandingkan revision.
- Setelah `locked`, pemilihan baru ditolak.

## 7.2 Player lock

- Tombol dapat diberi label **Kunci Jawaban Saya**.
- Mengunci jawaban sendiri tidak otomatis mengungkap jawaban benar.
- Setelah dikunci, peserta tidak boleh mengubah pilihan.
- Jika peserta belum memilih, perilaku harus eksplisit: tombol dinonaktifkan atau mengunci status `not_answered`. Rekomendasi default: tombol dinonaktifkan sampai satu opsi dipilih.

## 7.3 Host global reveal

Gunakan label yang berbeda dari player lock, misalnya **Tutup Soal & Lihat Jawaban** atau **Kunci Jawaban Semua**.

- Hanya host/controller yang dapat menjalankan.
- Server memvalidasi role dan fase.
- Server menetapkan seluruh jawaban final.
- Server pindah ke `REVEAL_ANSWER`.
- Host tetap dianggap peserta pada Casual/Duel; jawaban host yang terakhir diterima ikut dihitung seperti peserta lain.

## 7.4 Exam

- Santri dapat memilih/mengganti jawaban sesuai aturan ujian.
- Host hanya melihat progres agregat `answeredCount / eligibleCount`.
- Host tidak melihat isi jawaban dan opsi peserta.
- Saat host menutup ujian/soal, server menandai jawaban final.

---

# 8. QUESTION DATA DAN KONSISTENSI SOAL

## 8.1 Pemilihan paket soal

- Host memilih kategori/tema sebelum match dimulai.
- Server memvalidasi kategori dan izin akses.
- Server membuat snapshot urutan soal untuk `matchId`.
- Semua peserta mendapat urutan yang sama.
- Soal tidak boleh berubah di tengah match kecuali ada mekanisme resmi untuk membatalkan soal.

## 8.2 Pilihan jawaban

- Urutan opsi A/B/C/D harus sama bagi semua peserta dalam satu match.
- Jika opsi diacak, pengacakan dilakukan satu kali oleh server saat membuat match/question snapshot.
- Jangan mengacak opsi secara independen pada setiap client.
- Setiap pilihan memiliki `optionId` stabil; jangan menyimpan huruf A/B/C/D sebagai satu-satunya identitas jawaban.

## 8.3 Kunci jawaban

- `correctOptionId` tidak boleh dikirim pada event `question.started`.
- Server menyimpan kunci jawaban dan mengevaluasi pilihan.
- Kunci jawaban baru boleh dikirim pada event reveal yang sah.
- Jangan mengandalkan penyembunyian elemen UI jika kunci jawaban sudah terkirim ke browser.

## 8.4 Konten tidak valid

Jika soal tidak memiliki pilihan yang sah, jawaban benar, atau format yang sesuai:

- Soal harus ditolak sebelum match dimulai; atau
- Server membatalkan soal dengan event khusus dan penjelasan yang jelas.

Jangan diam-diam menganggap semua peserta salah atau memberi skor otomatis.

---

# 9. SCORING, LEADERBOARD, DAN PEMENANG

## 9.1 Server menghitung skor

Server menentukan:

- Jawaban benar/salah.
- Poin per jawaban.
- Bonus waktu jika diaktifkan.
- Total skor.
- Ranking.
- Pemenang/hasil seri.

Client hanya menampilkan data resmi.

Payload client tidak boleh menjadi sumber skor final.

## 9.2 Aturan skor yang direkomendasikan

Gunakan satu konfigurasi scoring yang sama untuk seluruh peserta dalam match.

Baseline sederhana yang direkomendasikan:

- Jawaban benar: poin dasar yang dikonfigurasi.
- Jawaban salah: 0 poin, kecuali mode/aturan secara eksplisit menentukan penalti.
- Tidak menjawab: 0 poin.
- Bonus kecepatan: nonaktif secara default; jika digunakan, kecil, dibatasi, dihitung server dari `receivedAt`, dan tidak boleh mendominasi nilai ketepatan.
- Tidak boleh memberikan poin karena menekan tombol lebih banyak atau mengirim jawaban berulang.

Tartila adalah aplikasi pendidikan anak. Akurasi pemahaman harus lebih penting daripada kecepatan jaringan atau refleks.

## 9.3 Tie-break

Urutan rekomendasi:

1. Total poin.
2. Jumlah jawaban benar.
3. Jika masih sama, hasil **seri**.

Jangan menggunakan latency client sebagai tie-break. Jangan menganggap jawaban yang terkirim lebih cepat karena jaringan lebih baik sebagai ukuran pengetahuan yang lebih tinggi.

Jika kebijakan produk membutuhkan tie-break lain, definisikan sebelum match dimulai dan tampilkan secara transparan.

## 9.4 Arena leaderboard

- Tampilkan Top 3 atau Top 5 sesuai ruang.
- Tampilkan juga posisi peserta yang sedang melihat layar meskipun berada di luar Top N.
- Gunakan ranking yang konsisten untuk skor sama (recommended: competition ranking, misalnya 1, 1, 3).
- Jangan menampilkan daftar panjang pada modal kecil; sediakan tampilan semua peserta jika dibutuhkan.
- Hindari bahasa yang mempermalukan peserta di posisi bawah.

## 9.5 Duel result

- Tepat dua pemain dibandingkan.
- Jika satu skor lebih tinggi dan tie-break selesai, hasil WIN/LOSE.
- Jika sama, hasil DRAW/SERI.
- `winnerId` harus `null` pada hasil seri.
- Tidak boleh kedua pemain menerima `outcome: "win"` pada duel standar.

## 9.6 Exam result

- Tidak ada pemenang host vs peserta.
- Hasil peserta berdasarkan kebijakan ujian.
- Hasil pribadi dapat ditampilkan sesuai konfigurasi.
- Laporan lengkap hanya dapat dilihat role yang berwenang.

## 9.7 Payload hasil akhir

Jangan menggunakan payload dari host seperti:

```ts
// DILARANG sebagai sumber hasil resmi dari client
{ type: "game_over", payload: { hostScore, playerScore, winnerId } }
```

Gunakan hasil final yang diterbitkan server, misalnya:

```ts
interface MatchFinishedEvent {
  type: "match.finished";
  eventId: string;
  roomId: string;
  matchId: string;
  stateVersion: number;
  eventSeq: number;
  occurredAt: string;
  payload: {
    reason: "questions_completed" | "host_ended" | "cancelled";
    standings: Array<{
      userId: string;
      displayName: string;
      rank: number;
      score: number;
      correctCount: number;
      answeredCount: number;
    }>;
    outcome:
      | { type: "win"; winnerId: string }
      | { type: "draw"; winnerId: null }
      | { type: "shared_first"; winnerIds: string[] }
      | { type: "exam_completed"; winnerId: null };
    finishedAt: string;
  };
}
```

Nama field boleh disesuaikan dengan backend yang sudah ada, tetapi prinsipnya harus dipertahankan: **hasil berasal dari server, bukan client**. Untuk Arena, `shared_first` boleh dipakai jika aturan produk memang menerima juara bersama. Untuk Duel, hasil seri memakai `draw`.

---

# 10. WEBSOCKET COMMAND, EVENT, DAN KETAHANAN JARINGAN

## 10.1 Pisahkan client command dan server event

Client mengirim intent/command. Server memvalidasi lalu menyiarkan event resmi.

Contoh command dari client:

| Command | Pengirim | Makna |
|---|---|---|
| `room.join` | Peserta | Meminta bergabung ke room |
| `room.leave` | Peserta/host | Meminta keluar |
| `host.start_game` | Host | Meminta mulai match |
| `answer.select` | Player | Memilih/mengganti opsi |
| `answer.lock` | Player | Mengunci jawaban sendiri |
| `host.reveal_answer` | Host | Menutup soal global dan reveal |
| `host.next_question` | Host | Meminta transisi ke soal berikutnya |
| `host.finish_match` | Host | Meminta mengakhiri match |
| `host.return_to_lobby` | Host | Meminta rematch/reset ke Lobi |
| `room.request_snapshot` | Client | Meminta sinkronisasi ulang |

Contoh event dari server:

| Event | Isi |
|---|---|
| `room.snapshot` | State room/match terkini |
| `room.participant_joined` | Peserta bergabung |
| `room.participant_left` | Peserta keluar |
| `match.phase_changed` | Fase berubah |
| `match.countdown_started` | Countdown dan `startsAt` |
| `question.started` | Soal, opsi, deadline, tanpa kunci jawaban |
| `answer.acknowledged` | Jawaban diterima/ditolak dan revision |
| `answer.progress_updated` | Jumlah peserta yang sudah menjawab |
| `answer.revealed` | Kunci dan hasil reveal |
| `leaderboard.updated` | Ranking sementara |
| `match.finished` | Hasil final resmi |
| `room.reset_to_lobby` | Room siap rematch |
| `command.rejected` | Command tidak sah atau stale |

Nama event di atas adalah rekomendasi kontrak SSOT. Jika backend sudah menggunakan nama berbeda, buat mapping eksplisit dan jangan mengubah kontrak tanpa audit client/server.

## 10.2 Envelope pesan

Setiap command/event sebaiknya membawa metadata konsisten:

```ts
interface RealtimeEnvelope<T> {
  type: string;
  messageId: string;
  roomId: string;
  matchId?: string;
  stateVersion?: number;
  eventSeq?: number;
  occurredAt?: string;
  payload: T;
}
```

- `messageId`: ID unik untuk idempotency/deduplication.
- `roomId`: identitas room.
- `matchId`: identitas match aktif.
- `stateVersion`: versi state resmi.
- `eventSeq`: nomor urut event yang diterbitkan server dalam scope yang ditentukan.
- `occurredAt`: timestamp server.

Untuk command, gunakan `requestId`/`messageId` yang unik dan pertahankan ID tersebut ketika retry request yang sama.

## 10.3 Contoh command yang direkomendasikan

Pilih jawaban:

```json
{
  "type": "answer.select",
  "messageId": "unique-command-id",
  "roomId": "room-id",
  "matchId": "match-id",
  "stateVersion": 12,
  "payload": {
    "questionId": "question-id",
    "optionId": "option-b"
  }
}
```

Host reveal:

```json
{
  "type": "host.reveal_answer",
  "messageId": "unique-command-id",
  "roomId": "room-id",
  "matchId": "match-id",
  "stateVersion": 12,
  "payload": {
    "questionId": "question-id"
  }
}
```

Host next question:

```json
{
  "type": "host.next_question",
  "messageId": "unique-command-id",
  "roomId": "room-id",
  "matchId": "match-id",
  "stateVersion": 13,
  "payload": {
    "expectedQuestionId": "previous-question-id"
  }
}
```

Client **tidak** menentukan `nextQuestionIndex` bebas. Server menentukan soal berikutnya berdasarkan snapshot urutan kuis dan state match.

## 10.4 Validasi server

Untuk setiap command server wajib memvalidasi:

- Pengguna terautentikasi.
- Pengguna benar-benar anggota room.
- Pengguna memiliki role yang sesuai.
- `roomId` dan `matchId` sesuai.
- Fase saat ini mengizinkan command.
- `stateVersion`/question ID belum stale.
- Payload memiliki bentuk dan nilai yang sah.
- Command belum diproses sebelumnya.
- Rate limit belum terlampaui.

Jangan menganggap koneksi WebSocket yang sudah terautentikasi berarti semua pesan dari koneksi tersebut otomatis berhak melakukan semua aksi.

## 10.5 Idempotency dan duplikasi

- Duplicate `messageId` tidak boleh memproses command dua kali.
- `answer.select` retry dengan ID yang sama tidak boleh menggandakan skor.
- `host.next_question` yang terkirim dua kali hanya boleh memajukan satu soal.
- `match.finished` yang diterima dua kali tidak boleh menampilkan reward atau pencatatan hasil dua kali.
- Simpan hasil pemrosesan command dalam jendela waktu yang sesuai untuk deduplication.

## 10.6 Event ordering dan stale event

- Client menyimpan `eventSeq`/`stateVersion` terakhir yang diproses.
- Event dengan sequence/version lebih kecil atau sama dapat diabaikan sesuai aturan deduplication.
- Jika terdapat gap sequence, client meminta snapshot terbaru.
- Event dari `matchId` lama tidak boleh mengubah UI match baru.
- Event dari room lain tidak boleh diproses.
- Pada reconnect, snapshot menjadi dasar state; jangan mengandalkan replay event lokal yang belum tentu lengkap.

WebSocket berjalan di atas koneksi TCP, tetapi reconnect, retry command, beberapa sumber event, dan pemrosesan asynchronous tetap dapat menimbulkan duplikasi atau state basi pada lapisan aplikasi. Karena itu deduplication dan versioning tetap diperlukan.

## 10.7 Backpressure dan frekuensi event

- Jangan broadcast event posisi mouse/animasi yang tidak dibutuhkan.
- Update progress jawaban boleh di-throttle/coalesce.
- Batasi ukuran payload.
- Tangani pesan masuk secara efisien.
- Jangan membuat client memproses event lebih cepat daripada kemampuannya merender.

---

# 11. RECONNECT, DISCONNECT, DAN RESUME

## 11.1 Peserta disconnect

- Disconnect tidak otomatis menghapus peserta dari daftar match.
- Server menandai koneksi peserta sebagai disconnected.
- Jika peserta reconnect dengan akun yang sama dan masih dalam grace period, server mengirim snapshot dan memulihkan tampilan.
- Jawaban yang sudah diterima server tetap dipertahankan.
- Jawaban yang belum diterima server tidak boleh dianggap tersimpan hanya karena UI sempat menampilkan pilihan.
- Peserta tidak mendapat waktu tambahan pribadi karena reconnect, kecuali kebijakan match secara eksplisit melakukan pause untuk semua peserta.

## 11.2 Host disconnect

Karena host adalah controller, kebijakan disconnect harus eksplisit.

Rekomendasi:

- Backend tetap menguasai timer dan state match.
- Match tidak boleh berpindah fase berdasarkan state lokal host yang sudah terputus.
- Peserta yang masih terhubung tetap menerima event server.
- Host mendapat grace period untuk reconnect.
- Jika host tidak kembali, room mengikuti kebijakan yang telah ditentukan: menunjuk co-host yang sah atau menghentikan match secara resmi oleh server.
- Jangan diam-diam memberikan hak host kepada peserta acak.

Untuk menghindari `LEADERBOARD` macet, auto-advance server setelah durasi leaderboard dapat digunakan. Host yang masih terhubung tetap dapat mempercepat transisi.

## 11.3 Reconnect flow

1. Client mendeteksi socket close/error.
2. UI menampilkan status “Menghubungkan kembali”.
3. Client mencoba reconnect dengan backoff dan batas retry.
4. Client mengirim autentikasi dan `room.request_snapshot`.
5. Server memvalidasi anggota, room, dan match.
6. Server mengirim snapshot resmi.
7. Client mengganti state lokal dengan snapshot, bukan menambahkan state lama secara membabi buta.
8. Client mengaktifkan input sesuai fase dan status jawaban dari server.

Jika match sudah selesai saat client offline, snapshot harus menunjukkan `FINISHED` dan hasil akhir.

---

# 12. LOBBY, JOIN PIN, DAN LATE JOIN

## 12.1 Join via PIN

Alur wajib:

```text
Input PIN
   |
   v
Validasi PIN dan akses
   |
   v
Resolve room
   |
   v
Masuk LOBBY
   |
   v
Tampilkan host, peserta, mode, dan status room
```

- Jangan redirect langsung ke gameplay.
- PIN dinormalisasi di client dan divalidasi kembali di server.
- PIN tidak menggantikan autentikasi akun.
- Jangan mengekspos UUID internal pada URL undangan.

## 12.2 Link undangan

Format yang disepakati:

```text
/arena/join?pin=XXXXXX
```

- Gunakan PIN yang berlaku.
- Hindari menyertakan access token atau secret di query string.
- PIN harus memiliki kebijakan expiry/rotation bila room ditutup atau host membuat kode baru.
- Endpoint pencarian PIN perlu rate limit dan respons error yang tidak membocorkan detail internal.

## 12.3 Late join

Default:

- Sebelum match dimulai: dapat masuk Lobi jika kapasitas dan izin terpenuhi.
- Setelah match berjalan: tidak dapat masuk sebagai pemain kompetitif.
- Jika diperlukan, late join dapat masuk sebagai spectator dengan permission terbatas.
- Spectator tidak dapat menjawab, mengubah state, atau memengaruhi skor.
- Duel tidak menerima peserta ketiga sebagai player.

## 12.4 Kapasitas dan readiness

- Server menentukan kapasitas maksimal.
- Server memvalidasi jumlah pemain minimum sebelum start.
- Daftar peserta dan status koneksi berasal dari server.
- Host melihat indikator peserta siap/terhubung jika fitur readiness digunakan.
- Jangan mengandalkan jumlah peserta dari state lokal.

---

# 13. REMATCH DAN RESET KE LOBBY

## 13.1 Aturan rematch

Pada layar hasil akhir, host mendapat tombol **Kembali ke Lobi** atau **Main Lagi**.

Saat host memilih:

1. Client mengirim `host.return_to_lobby`.
2. Server memvalidasi bahwa match telah `FINISHED` dan pengguna adalah host.
3. Server membuat `matchId` baru atau menyiapkan match baru di room yang sama.
4. Room berpindah ke `LOBBY`.
5. Peserta yang masih berada di room dipertahankan sebagai peserta Lobi.
6. Host memilih kategori/tema dan konfigurasi baru.
7. Server mengirim `room.reset_to_lobby`/snapshot baru.

## 13.2 Data yang direset

- Skor match sebelumnya.
- Jawaban per soal.
- Question index.
- Timer dan deadline.
- Answer lock state.
- Leaderboard sementara.
- Result/podium sebelumnya.
- Combo/progress per match.
- State overlay/gameplay lokal.

## 13.3 Data yang dipertahankan

- `roomId` jika room dipakai ulang.
- PIN selama masih valid dan kebijakan room tidak meminta rotasi.
- Daftar peserta yang masih tergabung.
- Identitas host dan permission.
- Pengaturan room yang memang ditujukan persisten.

## 13.4 Tiket dan biaya masuk

Dokumen awal belum mendefinisikan apakah multiplayer menggunakan tiket. Karena itu:

- Jangan mengimplementasikan pemotongan tiket baru berdasarkan asumsi.
- Jika multiplayer menggunakan tiket, definisikan secara eksplisit apakah tiket berlaku per room, per match, atau per peserta.
- Default yang direkomendasikan untuk rematch di room yang sama: jangan memotong tiket ulang secara tidak sengaja. Jika setiap match harus berbayar, tampilkan konfirmasi dan lakukan transaksi server secara atomik sebelum match baru dimulai.

---

# 14. KELUAR ROOM DAN KONFIRMASI

Tombol Keluar tersedia di Topbar halaman Lobi, Gameplay, dan Podium/Result.

## 14.1 Player non-host

Saat ditekan:

- Tampilkan dialog konfirmasi.
- Jangan langsung menutup socket atau menghapus state sebelum user mengonfirmasi.
- Copy yang disarankan: **“Yakin ingin keluar dari sesi ini? Kamu tidak akan mengikuti pertandingan ini lagi.”**
- Jika dikonfirmasi, kirim `room.leave`, tunggu acknowledgment bila memungkinkan, bersihkan state lokal, lalu arahkan ke `/member/ngaji-ceria/games`.
- Keluar dari room tidak menghentikan match untuk peserta lain.

## 14.2 Host Casual/Duel

Host memiliki dampak lebih besar. Jangan memakai pesan generik yang sama dengan peserta.

Dialog harus menjelaskan bahwa mengakhiri room akan memengaruhi semua peserta.

Pilihan yang disarankan:

- **Batalkan:** tetap di match.
- **Akhiri untuk Semua:** mengirim command host yang sah; server menutup match/room dengan alasan `host_ended`.

Jika ada mekanisme co-host yang eksplisit, opsi transfer host dapat ditampilkan. Jangan otomatis memindahkan host tanpa persetujuan dan validasi.

## 14.3 Host Exam

Gunakan copy yang menjelaskan bahwa ujian/presentasi akan dihentikan untuk semua peserta. Jika ada pilihan pause atau transfer supervisor, aturan tersebut harus ditetapkan terpisah.

## 14.4 Socket cleanup

Setelah server mengonfirmasi leave/finish:

- Unsubscribe listener room.
- Batalkan timer/interval lokal.
- Hentikan audio/animasi yang berjalan.
- Hapus state match lokal.
- Tutup socket jika tidak digunakan oleh fitur lain.
- Jangan memutus shared socket global sebelum memastikan tidak dipakai halaman/room lain.

---

# 15. UI/UX MULTIPLAYER

## 15.1 Prinsip desain

Tartila tetap menggunakan identitas visualnya, tetapi UI multiplayer harus:

- Memberi instruksi singkat dan jelas.
- Memperlihatkan fase permainan dengan jelas.
- Menunjukkan apakah jawaban belum dipilih, tersimpan, atau terkunci.
- Menghindari overlay saling menutupi.
- Memiliki affordance host yang berbeda tetapi tidak membingungkan peserta.
- Mengutamakan keterbacaan soal dan opsi.
- Tidak mengandalkan warna sebagai satu-satunya pembeda status.

## 15.2 Lobby

Tampilkan:

- Nama mode: Arena Casual / Duel 1v1 / Exam.
- PIN dan tombol salin.
- Host dan daftar peserta.
- Status koneksi.
- Jumlah peserta.
- Tema/kategori yang dipilih.
- Tombol Mulai hanya bagi host.
- Status menunggu peserta untuk Duel jika lawan belum masuk.

Semua peserta harus dapat memahami apakah mereka sudah berada di room yang benar dan siapa yang menjadi host.

## 15.3 Gameplay HUD

Tampilkan secara konsisten:

- Nomor soal (`3/10`).
- Timer visual yang sinkron dengan deadline server.
- Skor pribadi pada Casual/Duel.
- Status jawaban pribadi.
- Soal dan opsi dengan touch target besar.
- Kontrol host tambahan pada area terpisah dari opsi jawaban.

Jangan letakkan tombol **Tutup Soal & Lihat Jawaban** terlalu dekat dengan pilihan A/B/C/D agar host tidak salah menekan.

## 15.4 Status jawaban

Gunakan teks dan indikator visual:

- `Belum memilih`.
- `Jawaban tersimpan`.
- `Jawaban terkunci`.
- `Waktu habis`.
- `Mengirim jawaban...`.

Jika server menolak jawaban karena deadline/fase berubah, tampilkan feedback singkat yang tidak menyalahkan pemain.

## 15.5 Reveal

- Hentikan interaksi jawaban.
- Tutup Bottom Sheet/overlay jawaban yang masih terbuka.
- Tampilkan kunci jawaban dan penjelasan jika tersedia.
- Tampilkan status jawaban pribadi.
- Jangan menampilkan detail jawaban peserta lain kecuali kebijakan mode mengizinkan.

## 15.6 Leaderboard

- Gunakan modal/sheet yang tidak menutup informasi penting secara permanen.
- Duel menonjolkan perbandingan dua pemain dan status seri bila terjadi.
- Arena menampilkan Top N dan posisi diri.
- Exam tidak menampilkan ranking publik secara default.
- Tombol Next Question hanya terlihat dan aktif bagi host.

## 15.7 Bottom Sheet dan overlay

Semua overlay harus mengikuti lifecycle fase:

- Pada `REVEAL_ANSWER`, tutup `AnswerFeedbackSheet` dan sheet input yang tidak lagi relevan.
- Pada `FINISHED`, tutup seluruh sheet, modal sementara, dropdown, dan menu yang menutupi hasil akhir.
- Pada reset ke Lobi, bersihkan overlay gameplay.
- Gunakan satu mekanisme overlay coordinator/centralized state jika banyak modal dapat terbuka bersamaan.
- Jangan mengandalkan `useEffect` yang saling berlomba tanpa prioritas state yang jelas.

## 15.8 Responsive

- Mobile portrait: soal, opsi, timer, dan status harus tetap terbaca.
- Mobile landscape: tetap dapat dimainkan; jangan mengunci orientasi tanpa alasan produk.
- Tablet/desktop: optimalkan ruang untuk daftar peserta/leaderboard, tetapi jangan membuat opsi terlalu jauh dari soal.
- Pastikan tombol Keluar dan tombol host tidak menutupi area interaksi.

---

# 16. SECURITY DAN FAIR PLAY

WebSocket tidak otomatis menjamin identitas, izin, atau validitas pesan. Semua data dari client harus dianggap tidak tepercaya.

Wajib:

1. Gunakan koneksi aman `wss://` di production.
2. Autentikasi koneksi dengan mekanisme session/token aplikasi.
3. Validasi `Origin` menggunakan allowlist domain aplikasi.
4. Otorisasi setiap command berdasarkan user, room, role, mode, dan fase.
5. Validasi schema dan tipe data setiap payload.
6. Batasi ukuran pesan dan frekuensi command.
7. Gunakan heartbeat/ping-pong untuk mendeteksi koneksi mati.
8. Hentikan koneksi ketika sesi autentikasi berakhir atau user logout.
9. Jangan menyimpan token, secret, atau data pribadi lengkap di log.
10. Jangan menggunakan PIN sebagai satu-satunya autentikasi.
11. Cegah replay/duplicate command dengan ID unik dan state version.
12. Jangan mengirim kunci jawaban sebelum reveal.

Untuk PIN:

- Rate limit percobaan join.
- Jangan mengungkap informasi internal room melalui pesan error berlebihan.
- Terapkan expiry/rotation sesuai lifecycle room.
- Validasi kapasitas dan mode room di server.

Untuk multiplayer anak:

- Jangan menampilkan informasi pribadi yang tidak dibutuhkan.
- Nama tampilan mengikuti kebijakan privasi produk.
- Hindari chat bebas jika tidak ada moderasi dan kebutuhan pedagogis yang jelas.
- Hindari leaderboard yang mempermalukan peserta.

---

# 17. ERROR HANDLING DAN EMPTY STATES

Setiap fase harus mempunyai perilaku ketika data tidak tersedia atau koneksi bermasalah.

| Kondisi | Perilaku |
|---|---|
| PIN tidak ditemukan | Tampilkan pesan PIN tidak valid/kedaluwarsa |
| Room penuh | Tampilkan room penuh dan jangan join |
| Room sudah berjalan | Tolak late join atau tawarkan spectator jika tersedia |
| Host belum siap | Tombol Mulai nonaktif dengan alasan |
| Duel belum memiliki lawan | Tampilkan menunggu lawan |
| Socket reconnecting | Tampilkan overlay koneksi; jangan menampilkan state palsu |
| Command ditolak | Tampilkan alasan yang dapat dipahami |
| Snapshot gagal | Tawarkan retry; jangan memulai match dari state parsial |
| Soal invalid | Server skip/cancel dengan event resmi dan log |
| Match sudah selesai | Tampilkan hasil final dari snapshot |
| Host keluar | Jalankan kebijakan host disconnect/finish yang ditetapkan |

Jangan menelan error secara diam-diam. Error teknis dicatat secara aman untuk observability, sedangkan user menerima copy yang sederhana.

---

# 18. OBSERVABILITY DAN AUDIT LOG

Catat event penting untuk membantu debugging desinkronisasi:

- Room dibuat/ditutup.
- User join/leave.
- Host start/reveal/next/finish/rematch.
- Match phase transition.
- Question start/reveal.
- Answer accepted/rejected/locked.
- Deadline reached.
- Reconnect dan snapshot.
- Command duplicate/stale/unauthorized.
- Match result published.

Setiap log teknis sebaiknya menyertakan:

- `roomId`.
- `matchId`.
- `eventSeq`/`stateVersion`.
- `messageId`/`requestId` jika ada.
- User ID internal seperlunya.
- Timestamp server.
- Hasil validasi.

Jangan mencatat token autentikasi, PIN lengkap bila tidak diperlukan, isi data sensitif, atau informasi pribadi anak yang tidak relevan.

---

# 19. QA DAN TEST MATRIX WAJIB

## 19.1 Role dan mode

- Host Casual dapat melihat opsi, menjawab, mendapat skor, dan mengontrol room.
- Player Casual dapat menjawab tetapi tidak mengontrol room.
- Host Duel ikut menjadi salah satu dari tepat dua pemain.
- Duel tidak dapat dimulai jika belum ada dua pemain.
- Host Exam tidak melihat opsi atau kunci jawaban.
- Host Exam melihat progres jumlah peserta yang sudah menjawab.
- Peserta Exam dapat menjawab sesuai aturan ujian.

## 19.2 Answer flow

- Pilih A lalu ubah menjadi B; B menjadi pilihan aktif.
- Jawaban terkunci tidak dapat diubah.
- Jawaban yang masuk setelah deadline ditolak.
- Player lock hanya mengunci pemain tersebut.
- Host reveal mengunci semua jawaban.
- Jawaban host pada Casual/Duel dihitung sama seperti pemain lain.
- Pilihan benar tidak bocor sebelum reveal.

## 19.3 State machine

- Room selalu masuk Lobi setelah join.
- Start hanya valid dari Lobi.
- Countdown sinkron.
- Soal aktif dimulai pada `startsAt`.
- Deadline server memicu reveal.
- Host reveal dan deadline yang bersamaan tidak menggandakan transisi.
- Leaderboard menampilkan skor resmi.
- Next hanya memajukan satu soal.
- Soal terakhir berakhir ke `FINISHED`.
- Event dari match lama tidak mengubah match baru.

## 19.4 Scoring dan result

- Jawaban benar/salah dihitung server.
- Retry command tidak menggandakan poin.
- Skor host dihitung dari jawaban yang diterima server.
- Duel seri menghasilkan `DRAW`, bukan dua pemenang.
- Arena ranking menangani skor sama dengan aturan konsisten.
- Client tidak dapat memalsukan `winnerId` atau total skor.
- Exam tidak menampilkan leaderboard publik secara default.

## 19.5 Lifecycle dan navigation

- Join PIN masuk Lobi.
- Invitation URL menggunakan PIN, bukan UUID.
- Player leave tidak menghentikan room.
- Host exit memerlukan konfirmasi khusus.
- Cancel pada confirm dialog tidak mengubah socket/state.
- Confirm leave membersihkan listener/timer/state.
- Rematch menghasilkan `matchId` baru.
- Rematch membersihkan skor/jawaban/timer lama.
- Rematch tidak memotong tiket secara tidak sengaja.
- Bottom Sheet ditutup pada reveal dan finish.

## 19.6 Network

- Disconnect lalu reconnect saat Lobi.
- Disconnect saat Countdown.
- Disconnect saat Question Active.
- Disconnect setelah jawaban tersimpan.
- Disconnect host dan jalankan kebijakan yang disepakati.
- Event duplikat.
- Event terlambat/stale.
- Sequence gap dan snapshot recovery.
- Server menolak command dari user yang bukan host.
- Server menolak command pada fase yang salah.
- Heartbeat mendeteksi koneksi mati.

## 19.7 UI/UX dan perangkat

- Android/iOS mobile portrait.
- Mobile landscape.
- Tablet.
- Desktop.
- Ukuran teks yang dapat dibaca.
- Touch target yang memadai.
- Modal/sheet tidak saling menutupi.
- Koneksi lambat memiliki status yang jelas.

---

# 20. ACCEPTANCE CRITERIA / DEFINITION OF DONE

Fitur multiplayer tidak dianggap selesai sebelum seluruh poin kritis berikut terpenuhi:

- [ ] Server menjadi otoritas tunggal state, timer, jawaban, skor, dan hasil.
- [ ] Casual dan Duel mengikutsertakan host sebagai pemain.
- [ ] Exam memisahkan supervisor dari peserta.
- [ ] Semua join masuk Lobi terlebih dahulu.
- [ ] State machine memiliki fase dan transisi yang eksplisit.
- [ ] Pemain dapat mengganti jawaban sebelum lock/deadline.
- [ ] Player lock dan host global reveal adalah aksi berbeda.
- [ ] Deadline diputuskan server.
- [ ] Kunci jawaban tidak dikirim sebelum reveal.
- [ ] Next question divalidasi server dan tidak menerima index arbitrer.
- [ ] Duel dapat menghasilkan seri secara eksplisit.
- [ ] Arena mendukung banyak peserta dan ranking yang konsisten.
- [ ] Hasil akhir diterbitkan server dan tidak dihitung ulang client.
- [ ] Event memiliki deduplication/versioning.
- [ ] Reconnect dapat memulihkan snapshot resmi.
- [ ] Kebijakan host/player disconnect ditentukan.
- [ ] Exit dialog dibedakan menurut peran.
- [ ] Rematch membuat match baru di room yang sesuai.
- [ ] Semua overlay ditutup pada reveal dan finish.
- [ ] Permission dan payload divalidasi server.
- [ ] QA test matrix kritis lulus.

---

# 21. HAL YANG HARUS DIKONFIRMASI SEBELUM CODING

Beberapa keputusan produk belum ditentukan oleh guideline awal. Gunakan rekomendasi default di bawah kecuali Product Owner menetapkan aturan lain.

| Topik | Rekomendasi default | Status |
|---|---|---|
| Minimum pemain Casual | 2 termasuk host | Perlu konfirmasi produk |
| Duel | Tepat 2 termasuk host | Aturan baku |
| Late join | Tidak menjadi pemain saat match berjalan; spectator opsional | Rekomendasi |
| Auto-advance leaderboard | Aktif setelah durasi yang dikonfigurasi | Perlu konfirmasi |
| Bonus kecepatan | Nonaktif secara default | Rekomendasi |
| Tie-break | Total poin, jumlah benar, lalu seri | Rekomendasi |
| Exam leaderboard publik | Nonaktif secara default | Rekomendasi |
| Host disconnect | Grace period, lalu co-host sah atau server end | Perlu kebijakan produk |
| Ticket multiplayer | Belum ditentukan; jangan memotong berdasarkan asumsi | Wajib dikonfirmasi |
| Rematch ticket | Tidak dipotong ulang secara tidak sengaja | Aturan default teknis |
| Spectator | Opsional per room | Perlu konfirmasi |

**Larangan:** AI Agent/developer tidak boleh mengisi keputusan yang belum ditentukan dengan asumsi tersembunyi. Jika keputusan memengaruhi ekonomi, permission, hasil ujian, atau lifecycle room, tandai sebagai blocker dan minta persetujuan Product Owner.

---

# 22. ATURAN IMPLEMENTASI UNTUK AI AGENT DAN DEVELOPER

Sebelum mengubah kode Multiplayer:

1. Baca dokumen ini sampai selesai.
2. Audit implementasi frontend, backend, WebSocket events, routes, dan permission yang sudah ada.
3. Buat mapping antara event/state existing dan istilah SSOT.
4. Identifikasi ketidaksesuaian dan kemungkinan breaking changes.
5. Jangan mengubah kontrak event/API secara sepihak.
6. Jangan membuat state lokal sebagai sumber kebenaran hasil pertandingan.
7. Pertahankan fungsi yang sudah berjalan kecuali perubahan disetujui.
8. Tambahkan atau perbarui unit/integration tests untuk setiap perubahan state machine dan permission.
9. Laporkan file yang diubah, event yang terdampak, migration yang diperlukan, dan hasil test.
10. Jangan menyatakan build/test berhasil apabila belum benar-benar dijalankan.

Jika ada konflik antara kode lama dan dokumen ini:

- Jangan langsung menghapus perilaku lama.
- Dokumentasikan konflik.
- Tentukan migration plan.
- Pastikan client dan server diperbarui secara kompatibel.
- Lakukan rollout dengan versioning bila diperlukan.

---

# 23. REFERENSI TEKNIS

Referensi berikut mendukung aspek protokol dan keamanan WebSocket. Referensi ini bukan pengganti keputusan produk Tartila.

1. **OWASP WebSocket Security Cheat Sheet** — autentikasi, validasi Origin, otorisasi per pesan, validasi payload, rate limit, heartbeat, logging, dan pengujian keamanan.  
   https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
2. **IETF RFC 6455 — The WebSocket Protocol** — dasar protokol WebSocket dan model komunikasi dua arah.  
   https://www.rfc-editor.org/rfc/rfc6455.html
3. **MDN WebSocket API** — API WebSocket di browser dan keterbatasan backpressure pada WebSocket API standar.  
   https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

---

# PENUTUP

Pedoman utama multiplayer Tartila adalah:

**Server menentukan kebenaran. Host mengendalikan alur sesuai hak akses. Pemain berinteraksi dengan aturan yang sama dan adil. Semua perangkat menampilkan state resmi yang sama.**

Untuk anak-anak, pengalaman harus jelas dan tidak membingungkan. Untuk ustadz, kontrol harus dapat diprediksi. Untuk developer, state machine dan kontrak event harus eksplisit. Untuk AI Agent, tidak boleh ada asumsi tersembunyi yang mengubah aturan room, hak akses, skor, atau pemenang.
