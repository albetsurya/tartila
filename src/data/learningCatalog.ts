/**
 * KATALOG PEMBELAJARAN TARTILA — sumber kebenaran tunggal kurikulum.
 *
 * Urutan kepentingan: MATERI (menu Jelajah — kurikulum utama Tilawati),
 * lalu KUIS (evaluasi), lalu GAME (pendukung, khusus member).
 *
 * Metadata dibuat dari nama & perilaku fitur yang terlihat di kode.
 * Entri `needsContentValidation = true` berarti DRAF: perlu validasi
 * konten oleh tim kurikulum.
 *
 * Jilid Tilawati 1–5; Jilid 6 belum ada ("Segera Hadir").
 * Item pengayaan (doa, ibadah, adab, kisah) tidak terikat satu jilid,
 * sehingga `jilidRelevan` boleh kosong — kontraknya terdokumentasi
 * lewat tipenya.
 */

export type MateriPokok =
  | 'tilawati'
  | 'hijaiyah'
  | 'harakat'
  | 'makhraj'
  | 'tajwid'
  | 'mad'
  | 'waqaf'
  | 'gharib'
  | 'tulisan'
  | 'hafalan'
  | 'juz-amma'
  | 'doa'
  | 'ibadah'
  | 'adab'
  | 'kisah-islami';

/** Label resmi materi — semua teks UI mengambil dari sini. */
export const MATERI_LABELS: Readonly<Record<MateriPokok, string>> = {
  tilawati: 'Tilawati',
  hijaiyah: 'Hijaiyah',
  harakat: 'Harakat',
  makhraj: 'Makhraj',
  tajwid: 'Tajwid',
  mad: 'Mad (Pelan)',
  waqaf: 'Waqaf',
  gharib: 'Gharib (Kata Asing)',
  tulisan: 'Tulisan Arab',
  hafalan: 'Hafalan',
  'juz-amma': "Juz 'Amma",
  doa: 'Doa',
  ibadah: 'Ibadah',
  adab: 'Adab',
  'kisah-islami': 'Kisah Islami',
};

/** Daftar semua nilai materi, mengikuti urutan MATERI_LABELS. */
export const ALL_MATERI_POKOK: readonly MateriPokok[] = (
  Object.keys(MATERI_LABELS) as MateriPokok[]
);

export type JilidNumber = 1 | 2 | 3 | 4 | 5;
export type GameAccessLevel = 'guest-open' | 'member-only';
export type CatalogType = 'materi' | 'quiz' | 'game';

export interface GameCatalogEntry {
  id: string;
  gameId: string;
  title: string;
  type: 'game';
  materiPokok: readonly MateriPokok[];
  jilidRelevan: readonly JilidNumber[];
  learningObjective: string;
  caraMain: string;
  tipsUstadz: readonly string[];
  access: GameAccessLevel;
  needsContentValidation: boolean;
}

interface RawGameCatalogEntry extends GameCatalogEntry {
  /** ID rute alias yang juga menunjuk game ini (GAME_ALIASES). */
  routeAliases?: readonly string[];
}

export interface MateriCatalogEntry {
  id: string;
  title: string;
  type: 'materi';
  materiPokok: readonly MateriPokok[];
  jilidRelevan: readonly JilidNumber[];
  learningObjective: string;
  caraMain: string;
  tipsUstadz: readonly string[];
  /** Rute halaman materi (menu Jelajah). */
  route: string;
  needsContentValidation: boolean;
}

export interface QuizCatalogEntry {
  id: string;
  title: string;
  type: 'quiz';
  materiPokok: readonly MateriPokok[];
  jilidRelevan: readonly JilidNumber[];
  learningObjective: string;
  caraMain: string;
  tipsUstadz: readonly string[];
  /** Rute kuis yang sudah tersedia untuk member. */
  route?: string;
  needsContentValidation: boolean;
}

export type CatalogEntry =
  | RawGameCatalogEntry
  | MateriCatalogEntry
  | QuizCatalogEntry;

/** Label tipe katalog untuk UI. */
export const CATALOG_TYPE_LABELS: Readonly<Record<CatalogType, string>> = {
  materi: 'Materi',
  quiz: 'Kuis',
  game: 'Game',
};

export const GAME_CATALOG: readonly RawGameCatalogEntry[] = [
  {
    gameId: 'quiz-hub',
    id: 'quiz-hub',
    type: 'game',
    title: 'Pusat Kuis (Quiz Hub)',
    materiPokok: ['tilawati', 'harakat', 'makhraj', 'juz-amma', 'doa'],
    jilidRelevan: [1, 2, 3, 4, 5],
    learningObjective:
      'Pusat kuis komprehensif bergaya Duolingo/AMNA, susun kata Arab, dan tantang teman secara deterministik.',
    caraMain:
      'Santri memilih latihan soal pilihan ganda atau susun kata dalam topik Tilawati, Juz Amma, Doa/Kisah, atau Bahasa Arab.',
    tipsUstadz: [
      'Gunakan mode Tantang Teman untuk mini-turnamen antar santri.',
      'Sangat efektif untuk menguji daya ingat susun kalimat dan mufradat harian.',
    ],
    access: 'member-only',
    needsContentValidation: true,
    routeAliases: ['quiz-hub-page'],
  },
  {
    gameId: 'hijaiyah-pop',
    id: 'hijaiyah-pop',
    type: 'game',
    title: 'Hijaiyah Pop!',
    materiPokok: ['hijaiyah'],
    jilidRelevan: [1],
    learningObjective:
      'Mengenali bentuk dan posisi huruf hijaiyah dengan cepat dan tepat.',
    caraMain:
      'Santri memecahkan gelembung yang berisi huruf hijaiyah sesuai instruksi di layar. Kecepatan dan ketepatan menentukan skor akhir.',
    tipsUstadz: [
      'Cocok untuk pemanasan membaca di awal majelis.',
      'Minta santri menyebut nama huruf setiap kali gelembung pecah.',
    ],
    access: 'guest-open',
    needsContentValidation: false,
    routeAliases: ['hijaiyah-burst'],
  },
  {
    gameId: 'hijaiyah-rush',
    id: 'hijaiyah-rush',
    type: 'game',
    title: 'Hijaiyah Rush',
    materiPokok: ['hijaiyah', 'harakat'],
    jilidRelevan: [1, 2],
    learningObjective:
      'Mempercepat pengenalan huruf hijaiyah dan bacaan dasarnya.',
    caraMain:
      'Santri menjawab tantangan huruf secara beruntun dengan batas waktu. Jawaban cepat dan benar menggerakkan progres level.',
    tipsUstadz: [
      'Gunakan sebagai pengecekan cepat sebelum masuk materi baru.',
      'Catat jenis huruf yang sering keliru untuk dibahas bersama.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'hijaiyah-2048',
    id: 'hijaiyah-2048',
    type: 'game',
    title: 'Hijaiyah 2048',
    materiPokok: ['hijaiyah', 'tulisan'],
    jilidRelevan: [1, 2],
    learningObjective:
      'Membedakan huruf-huruf hijaiyah yang mirip bentuk melalui pencocokan.',
    caraMain:
      'Santri menggeser papan agar dua ubin berhuruf sama bertemu dan bergabung, dengan mekanik mirip 2048. Papan penuh berarti selesai.',
    tipsUstadz: [
      'Bimbing santri menunjuk huruf sama sebelum menggeser papan.',
      'Manfaatkan untuk melatih membedakan pasangan huruf mirip seperti ب-ت-ث.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'balon-hijaiyah',
    id: 'balon-hijaiyah',
    type: 'game',
    title: 'Balon Hijaiyah',
    materiPokok: ['hijaiyah'],
    jilidRelevan: [1],
    learningObjective: 'Mengaitkan bunyi dan bentuk huruf hijaiyah pada konteks teks.',
    caraMain:
      'Santri mengenali huruf yang dibawa balon dan menyebutkannya sebelum balon melayang hilang. Cocok untuk santri fase pengenalan huruf.',
    tipsUstadz: [
      'Gunakan untuk santri yang baru mengenal huruf.',
      'Ucapkan bunyi huruf bersama-sama setiap balon tertangkap.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'pasang-huruf',
    id: 'pasang-huruf',
    type: 'game',
    title: 'Pasang Huruf',
    materiPokok: ['hijaiyah', 'tulisan'],
    jilidRelevan: [1, 2],
    learningObjective:
      'Melengkapi teks yang hurufnya hilang dengan huruf hijaiyah yang tepat.',
    caraMain:
      'Teks menampilkan celah huruf; santri memasang huruf yang tepat ke setiap celah hingga teks utuh.',
    tipsUstadz: [
      'Minta santri membaca ulang teks hasil pemasangan.',
      'Guna sebagai transisi dari pengenalan huruf ke baca teks.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'susun-kata',
    id: 'susun-kata',
    type: 'game',
    title: 'Susun Kata',
    materiPokok: ['tulisan', 'gharib'],
    jilidRelevan: [2, 3],
    learningObjective:
      'Menyusun huruf menjadi kata Arab yang utuh sesuai susunan yang benar.',
    caraMain:
      'Kata dipecah menjadi huruf acak; santri menyusunnya kembali menjadi kata yang benar dalam batas waktu.',
    tipsUstadz: [
      'Minta santri membaca nyaring kata hasil susunan.',
      'Diskusikan arti kata untuk memperkaya kosakata.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'tangkap-harakat',
    id: 'tangkap-harakat',
    type: 'game',
    title: 'Tangkap Harakat',
    materiPokok: ['harakat'],
    jilidRelevan: [1, 2, 3],
    learningObjective:
      'Membedakan bacaan huruf berdasarkan harakat fathah, kasroh, dan dhommah.',
    caraMain:
      'Benda berhuruf berharakat jatuh dari atas layar; santri menangkap sesuai harakat yang diminta. Salah sasaran mengurangi nyawa.',
    tipsUstadz: [
      'Latih dulu pelafalan tiga harakat dasar sebelum bermain.',
      'Uji santri dengan meminta mencontohkan bacaan tiap harakat.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'harakat-rush',
    id: 'harakat-rush',
    type: 'game',
    title: 'Harakat Slasher',
    routeAliases: ['harakat-slasher'],
    materiPokok: ['harakat'],
    jilidRelevan: [1, 2, 3],
    learningObjective:
      'Mengasah refleks pelafalan huruf berharakat melalui sasaran yang bergerak cepat.',
    caraMain:
      'Buah-buahan terjun dengan huruf berharakat; santri menyabit buah berharakat sesuai target yang ditampilkan. Salah sasaran memotong nyawa.',
    tipsUstadz: [
      'Gunakan sebagai penutup majelis agar pelafalan tetap seru.',
      'Hubungkan setiap harakat dengan contoh bacaan pada salah satu jilid',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'makhraj-master',
    id: 'makhraj-master',
    type: 'game',
    title: 'Makhraj Master',
    materiPokok: ['makhraj'],
    jilidRelevan: [3, 4, 5],
    learningObjective:
      'Melatih ketepatan artikulasi huruf sesuai tempat keluarnya (makhraj).',
    caraMain:
      'Santri mengidentifikasi huruf berdasarkan contoh pelafalan makhraj lalu meneladani bacaannya. Tingkat kesulitan naik per progres.',
    tipsUstadz: [
      'Peragakan posisi mulut di depan santri sebelum sesi.',
      'Fokuskan sesi pada huruf tebal-tipis yang paling sering keliru.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'hijaiyah-beats',
    id: 'hijaiyah-beats',
    type: 'game',
    title: 'Hijaiyah Beats',
    materiPokok: ['hijaiyah', 'makhraj'],
    jilidRelevan: [1, 2, 3],
    learningObjective: 'Mengenal bunyi huruf hijaiyah melalui irama dan ketepatan tempo.',
    caraMain:
      'Santri menekan tombol mengikuti irama musik saat huruf melewati garis target. Ketepatan tempo menaikkan kombo.',
    tipsUstadz: [
      'Sediakan earphone untuk grup kecil agar bunyi jelas.',
      'Kaitkan bunyi huruf dengan murottal sebagai bandingan.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'hijaiyah-match-arena',
    id: 'hijaiyah-match-arena',
    type: 'game',
    title: 'Hijaiyah Match Arena',
    materiPokok: ['hijaiyah'],
    jilidRelevan: [1, 2],
    learningObjective: 'Mencocokkan pasangan huruf hijaiyah yang identik di bawah tekanan waktu.',
    caraMain:
      'Santri mencari dan mencocokkan pasangan huruf pada arena hingga waktu habis. Kombinasi cepat menambah skor combo.',
    tipsUstadz: [
      'Sesuaikan durasi arena dengan kemampuan konsentrasi santri.',
      'Diskusikan huruf yang paling susah dibedakan.',
    ],
    access: 'member-only',
    needsContentValidation: true,
    routeAliases: ['hijaiyah-match'],
  },
  {
    gameId: 'tajwid-tetris',
    id: 'tajwid-tetris',
    type: 'game',
    title: 'Tajwid Tetris',
    materiPokok: ['tajwid'],
    jilidRelevan: [4, 5],
    learningObjective:
      'Mengelompokkan bacaan menurut hukum tajwid secara visual.',
    caraMain:
      'Blok berlabel bacaan turun seperti tetris; santri menempatkan blok ke kelompok hukum tajwid yang tepat. Papan selesai mengakhiri ronde.',
    tipsUstadz: [
      'Bahas satu jenis hukum tajwid per sesi agar fokus.',
      'Minta santri menyebut dalilnya sederhana saat menempatkan blok.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'tajwid-defense',
    id: 'tajwid-defense',
    type: 'game',
    title: 'Tajwid Defense',
    materiPokok: ['tajwid', 'mad', 'waqaf'],
    jilidRelevan: [4, 5],
    learningObjective:
      'Menerapkan aturan tajwid, mad, dan waqaf dengan konsisten saat membaca.',
    caraMain:
      'Santri membaca ayat dan menjawab soal hukum bacaan untuk mempertahankan pohon/bangunan dari serangan bergelombang.',
    tipsUstadz: [
      'Jadikan setiap bacaan keliru sebagai bahas bersama terapis.',
      'Gantian peran pembaca agar semua santri ikut teruji.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'tajwid-arena',
    id: 'tajwid-arena',
    type: 'game',
    title: 'Tajwid Arena',
    materiPokok: ['tajwid'],
    jilidRelevan: [4, 5],
    learningObjective:
      'Berlatih menerapkan hukum tajwid dalam suasana kompetitif yang terkendali.',
    caraMain:
      'Santri berhadapan memecahkan soal tajwid di arena; konsisten menjawab menjaga kemampuan nyawa. Sesi tuntas mengakhir majelis.',
    tipsUstadz: [
      'Pairing sesama santri yang setara supaya arena seimbang.',
      'Tekankan pentingnya membetulkan bacaan dibandingkan sekadar menang.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'arabic-wordle',
    id: 'arabic-wordle',
    type: 'game',
    title: 'Arabic Wordle',
    materiPokok: ['tulisan', 'gharib'],
    jilidRelevan: [3, 4, 5],
    learningObjective:
      'Menebak kosakata Arab dari petunjuk visual huruf per tebakan.',
    caraMain:
      'Santri menebak kata Arab lima huruf; setiap tebakan diberi petunjuk warna huruf yang benar sampai kata terpecahkan atau kesempatan habis.',
    tipsUstadz: [
      'Sediakan kamus saku untuk bantuan santri pemula.',
      'Bangun kosakata harian: satu kata baru per majelis.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'ayat-scramble',
    id: 'ayat-scramble',
    type: 'game',
    title: 'Ayat Scramble',
    materiPokok: ['tulisan', 'hafalan'],
    jilidRelevan: [2, 3],
    learningObjective:
      'Menyusun potongan kata ayat ke susunan yang tepat untuk memantapkan hafalan.',
   caraMain:
      'Kata-kata ayat diacak; santri menarik menyusunnya menjadi ayat yang utuh sesuai bacaan yang dipelajari.',
    tipsUstadz: [
      'Kapal yang benar: baca ayat utuh terlebih dahulu sebelum menyusun.',
      'Pilih ayat yang baru dihafal agar hafalan ikut terpijak.',
    ],
    access: 'member-only',
    needsContentValidation: true,
    routeAliases: ['word-builder'],
  },
  {
    gameId: 'ayat-hunter',
    id: 'ayat-hunter',
    type: 'game',
    title: 'Ayat Hunter',
    materiPokok: ['tulisan', 'hafalan'],
    jilidRelevan: [3, 4, 5],
    learningObjective:
      'Menerapkan ketepatan mata membaca ayat di tengah tagihan secepat kilat.',
    caraMain:
      'Santri menelusuri lautan teks dan memburu ayat yang diminta sebelum waktu habis. Keakuratan menentukan skor akhir.',
    tipsUstadz: [
      'Pilih surah yang pelan disekitarmil menjadi hafalan bermakna.',
      'Diskusikan panjang ayat yang tersulit dicari.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'tebak-ayat',
    id: 'tebak-ayat',
    type: 'game',
    title: 'Tebak Ayat',
    materiPokok: ['hafalan', 'tulisan'],
    jilidRelevan: [3, 4, 5],
    learningObjective:
      'Menguji ketepatan ingat hafalan ayat dan urutannya.',
    caraMain:
      'Cuplikan ayat disajikan; santri menebak ayat berikutnya atau surah asalnya segera berdasar pilihan yang tersedia. Skor akhir dihitung dari jumlah benar.',
    tipsUstadz: [
      'Pastikan setoran terlebih dahulu sebelum bermain.',
      'Gunakan surah-surah Juz Amma sebagai lintasan awal.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'juz-amma-speedrun',
    id: 'juz-amma-speedrun',
    type: 'game',
    title: 'Juz Amma Speedrun',
    materiPokok: ['hafalan'],
    jilidRelevan: [3, 4, 5],
    learningObjective:
      'Memantapkan hafalan surah-surah Juz Amma dengan cepat dan tepat.',
    caraMain:
      'Santri menyelesaikan rangkaian surah Juz Amma dalam batas waktu; waktu pribadi terbaik dicatat untuk perbaikan mandiri.',
    tipsUstadz: [
      'Fokus ke kecepatan pribadi, hindari perbandingan antar-santri.',
      'Ganda dengan setoran hafalan lokal agar akurat.',
    ],
    access: 'member-only',
    needsContentValidation: true,
    routeAliases: ['verse-quest'],
  },
  {
    gameId: 'doa-dungeon',
    id: 'doa-dungeon',
    type: 'game',
    title: 'Doa Dungeon',
    materiPokok: ['doa', 'ibadah'],
    jilidRelevan: [],
    learningObjective:
      'Menghafal dan memahami doa harian pada berbagai situasi kehidupan.',
    caraMain:
      'Santri menjelajah ruangan dungeon dan menjawab tantangan doa untuk membuka pintu ruangan berikutnya. Victory dicapai saat seluruh ruangan tuntas.',
    tipsUstadz: [
      'Kaitkan doa dengan amalan nyata: dengarkan santri mengamalkannya.',
      'Bahasa serapan doa harian dikalikan dengan tema pelajaran kitab.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'nabi-chronicles',
    id: 'nabi-chronicles',
    type: 'game',
    title: 'Nabi Chronicles',
    materiPokok: ['kisah-islami', 'adab'],
    jilidRelevan: [],
    learningObjective:
      'Menghayati nilai teladan dari kisah para nabi melalui narasi interaktif.',
    caraMain:
      'Santri menyusuri narasi kisah nabi dengan memilih jalur jawaban; pilihan mengiringi cerita menuju ending yang berbeda.',
    tipsUstadz: [
      'Bahas ending yang tersaji dan nilai yang dapat dipetik.',
      'Sandingkan dengan bacaan sirah sesuai usia santri.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'malaikat-mission',
    id: 'malaikat-mission',
    type: 'game',
    title: 'Malaikat Mission',
    materiPokok: ['kisah-islami'],
    jilidRelevan: [],
    learningObjective: 'Mengenal tugas para malaikat dari soal bertema akidah.',
    caraMain:
      'Mode bertahan: santri menjawab deretan soal tentang tugas malaikat dengan nyawa terbatas. Bertahan sampai akhir nomor menandakan penguasaan.',
    tipsUstadz: [
      'Sertakan penjelasan saat ada nomor yang tertukar.',
      'Remadikan dengan rukun iman sebagai pengait akidah.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'quran-quiz-royale',
    id: 'quran-quiz-royale',
    type: 'game',
    title: 'Quran Quiz Royale',
    materiPokok: ['kisah-islami', 'gharib'],
    jilidRelevan: [4, 5],
    learningObjective:
      'Memantapkan wawasan umum tentang Al-Qur\'an dan kosakata akara.',
    caraMain:
      'Arena kuis pemberangkatan: santri menjawab pertanyaan bertema Al-Qur\'an. Bertahan hingga akhir menjadikan sang juara arena.',
    tipsUstadz: [
      'Pas untuk acara kejuaraan antar-kelas saat khitan gemilang.',
      'Siapkan soal cadangan yang sesuai target santri.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'nur-battle',
    id: 'nur-battle',
    type: 'game',
    title: 'Nur Battle',
    materiPokok: ['kisah-islami', 'ibadah'],
    jilidRelevan: [],
    learningObjective:
      'Memperkuat soal keimanan dan ibadah untuk terus mengisi energi cahaya.',
    caraMain:
      'Perang menara: jawaban benar mengisi energi cahaya dan melindungi menara; salah menjawab mempercepat eliminasi.',
    tipsUstadz: [
      'Jadikan soal keliru sebagai bahan diskusi ide iman.',
      'Sandingkan dengan perlindungan bacaan azan atau adzan terkait.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'wudhu-flow',
    id: 'wudhu-flow',
    type: 'game',
    title: 'Wudhu Flow',
    materiPokok: ['ibadah'],
    jilidRelevan: [],
    learningObjective: 'Mengurutkan langkah wudhu sesuai sunnah secara sistematis.',
    caraMain:
      'Santri menentaskan 10 langkah wudhu berurutan sebelum air di wadah habis. Urutan salah membuat langkah terulang.',
    tipsUstadz: [
      'Peragakan wudhu asli di tempat wudhu setelah sesi.',
      'Perhatikan urutan dan ketepatan setiap langkah.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'sholat-hero',
    id: 'sholat-hero',
    type: 'game',
    title: 'Sholat Hero',
    materiPokok: ['ibadah'],
    jilidRelevan: [],
    learningObjective: 'Menghafal gerakan sholat beserta urutannya secara berkala.',
    caraMain:
      'Santri mengeksekusi rangkaian gerakan sholat mengikuti pola tempo riil per hari; akhir hari mencatat pergerakan yang dilakukan.',
    tipsUstadz: [
      'Padu permainan dengan praktik nyata agar motorik tidak asing.',
      'Melengkapi hafalan bacaan sholat yang diperlukan.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'santri-idle',
    id: 'santri-idle',
    type: 'game',
    title: 'Santri Idle',
    materiPokok: ['adab', 'ibadah'],
    jilidRelevan: [],
    learningObjective:
      'Menanamkan keteraturan kegiatan harian santri melalui simulasi.',
    caraMain:
      'Santri mengelola rutinitas harian pesantren secara idle; perkembangan karakter mengikuti keteraturan ibadah dan belajar.',
    tipsUstadz: [
      'Bahas rutinitas harian santri setelah bermain.',
      'Membentuk kesadaran waktu dan kedisiplinan harian.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
  {
    gameId: 'adab-rpg',
    id: 'adab-rpg',
    type: 'game',
    title: 'Jejak Santri',
    materiPokok: ['adab', 'kisah-islami'],
    jilidRelevan: [],
    learningObjective:
      'Menanamkan adab santri melalui petualangan bercerita dengan ending berbeda.',
    caraMain:
      'Petualangan cerita adab; pilihan narasi santri menentukan ending yang didapat. Setiap ending menyajikan pelajaran adab.',
    tipsUstadz: [
      'Diskusikan ending yang terjadi dan adab yang direpresentasi.',
      'Sandingkan dengan adab harian di majelis pembelajaran.',
    ],
    access: 'member-only',
    needsContentValidation: true,
  },
];

// ── MATERI: menu Jelajah (kurikulum utama) ──────────────────────

export const MATERI_CATALOG: readonly MateriCatalogEntry[] = [
  {
    id: 'menara-tilawati',
    title: 'Menara Tilawati',
    type: 'materi',
    materiPokok: ['tilawati'],
    jilidRelevan: [1, 2, 3, 4, 5],
    learningObjective:
      'Membaca Al-Qur\'an bertahap sesuai kurikulum Tilawati dari Jilid 1 sampai 5.',
    caraMain:
      'Santri menaiki menara jilid per jilid: setiap jilid berisi peta halaman yang dikerjakan berurutan dengan unggah audio setoran.',
    tipsUstadz: [
      'Kalibrasi penempatan jilid setiap santri di awal kelas.',
      'Pantau halaman lambat, lalu arahkan game pendukung yang selaras.',
    ],
    route: '/member/ngaji-ceria/explore/tilawati',
    needsContentValidation: false,
  },
  {
    id: 'tilawati-jilid-1',
    title: 'Tilawati Jilid 1',
    type: 'materi',
    materiPokok: ['tilawati', 'hijaiyah'],
    jilidRelevan: [1],
    learningObjective:
      'Mengenal bentuk, nama, dan bunyi huruf hijaiyah dengan harakat dasar.',
    caraMain:
      'Peta halaman Jilid 1: latihan huruf perhalaman, baca bersama, dan unggah setoran audio untuk dinilai.',
    tipsUstadz: [
      'Jadikan jilid 1 bahan asesmen awal penempatan santri.',
      'Temani unggahan audio dengan kunjungan baca langsung.',
    ],
    route: '/member/ngaji-ceria/explore/tilawati/1',
    needsContentValidation: false,
  },
  {
    id: 'tilawati-jilid-2',
    title: 'Tilawati Jilid 2',
    type: 'materi',
    materiPokok: ['tilawati', 'harakat'],
    jilidRelevan: [2],
    learningObjective:
      'Membaca kata bersambung dengan harakat dan sukun secara mandiri.',
    caraMain:
      'Peta halaman Jilid 2: bacaan kata antar-baris dengan harakat dan sukun, diakhiri latihan evaluatif per halaman.',
    tipsUstadz: [
      'Fokuskan pembinaan pada bacaan bertemu sukun.',
      'Ulang tolak ukur halaman yang belum tuntas sebelum naik jilid.',
    ],
    route: '/member/ngaji-ceria/explore/tilawati/2',
    needsContentValidation: false,
  },
  {
    id: 'tilawati-jilid-3',
    title: 'Tilawati Jilid 3',
    type: 'materi',
    materiPokok: ['tilawati', 'mad'],
    jilidRelevan: [3],
    learningObjective:
      'Membaca pola panjang-pendek bacaan (mad) dengan tempo yang tetap.',
    caraMain:
      'Peta halaman Jilid 3: latihan mad dan panjang bacaan; santri unggah setoran untuk diukur tempo panjangnya.',
    tipsUstadz: [
      'Tekankan tempo bacaan seragam: jangan gegabah dan jangan terlalu panjang.',
      'Panjarkan amal berlatih setiap mad sesuai dosir masing-masing.',
    ],
    route: '/member/ngaji-ceria/explore/tilawati/3',
    needsContentValidation: false,
  },
  {
    id: 'tilawati-jilid-4',
    title: 'Tilawati Jilid 4',
    type: 'materi',
    materiPokok: ['tilawati', 'tajwid', 'waqaf'],
    jilidRelevan: [4],
    learningObjective:
      'Membaca surah dengan aturan tajwid dan tanda waqaf secara benar.',
    caraMain:
      'Peta halaman Jilid 4: hukum bacaan dan tanda-pemutusan (waqaf) dicontohkan pada ayat pilihan Juz Amma.',
    tipsUstadz: [
      'Latih memutus dan meneruskan bacaan (waqaf) dengan telaten.',
      'Kaitkan contoh hukum di jilid dengan mushaf yang dinikmati.',
    ],
    route: '/member/ngaji-ceria/explore/tilawati/4',
    needsContentValidation: false,
  },
  {
    id: 'tilawati-jilid-5',
    title: 'Tilawati Jilid 5',
    type: 'materi',
    materiPokok: ['tilawati', 'tajwid', 'mad', 'waqaf', 'gharib'],
    jilidRelevan: [5],
    learningObjective:
      'Membaca bacaan Al-Qur\'an dengan tajwid serampat dan gharib yang dibedah.',
    caraMain:
      'Peta halaman Jilid 5: ayat-ayat surah dengan kombinasi hukum bacaan berlapis; melatih keakuratan sebelum tahap tahfidz.',
    tipsUstadz: [
      'Jadikan jilid 5 target kenaikan baca sebelum menyusul tahap tahfidz.',
      'Tantang santri mengkoreksi bacaan gharib via menarik makna.',
    ],
    route: '/member/ngaji-ceria/explore/tilawati/5',
    needsContentValidation: false,
  },
  {
    id: 'kunci-rahasia-tajwid',
    title: 'Kunci Rahasia Tajwid',
    type: 'materi',
    materiPokok: ['tajwid', 'mad', 'waqaf'],
    jilidRelevan: [3, 4, 5],
    learningObjective:
      'Memahami dan menerapkan hukum tajwid pada bacaan Al-Qur\'an sehari-hari.',
    caraMain:
      'Membuka kartu rahasia tajwid: tiap kartu menyajikan penjelasan hukum, contoh bacaan, dan latihan pemeriksaan.',
    tipsUstadz: [
      'Gunakan satu kartu per pertemuan sebagai pembuka materi.',
      'Minta santri mencari contoh hukum di juz yang sedang dipelajari.',
    ],
    route: '/member/ngaji-ceria/explore/tajwid',
    needsContentValidation: false,
  },
  {
    id: 'gelanggang-tahfidz',
    title: 'Menara Tahfidz',
    type: 'materi',
    materiPokok: ['hafalan'],
    jilidRelevan: [4, 5],
    learningObjective:
      'Melatih disiplin hafalan surah dengan target harian terukur.',
    caraMain:
      'Menara misi hafalan: santri menyetorkan hafalan bertahap dan memantau kemajuan per surah per pekan.',
    tipsUstadz: [
      'Periksakan setoran hafalan mingguan dan tandai progres di menara.',
      'Gunakan target kecil harian agar hafalan tidak terputus.',
    ],
    route: '/member/ngaji-ceria/explore/tahfidz',
    needsContentValidation: false,
  },
  {
    id: 'galaksi-juz-amma',
    title: "Galaksi Juz 'Amma",
    type: 'materi',
    materiPokok: ['juz-amma', 'hafalan'],
    jilidRelevan: [3, 4, 5],
    learningObjective:
      'Menuntaskan hafalan surah-surah pendek Juz 30 dengan evaluasi per surah.',
    caraMain:
      'Galaksi berisi surah Juz Amma; santri membintangi tiap surah setelah membaca dan mengulang bacaannya.',
    tipsUstadz: [
      'Jalankan kegiatan per-bintang sebagai penilaian hafalan harian.',
      'Jika bacaan surah kacau, kirahkan kembali ke jilid 4.',
    ],
    route: '/member/ngaji-ceria/explore/juz-amma',
    needsContentValidation: false,
  },
  {
    id: 'gudang-doa',
    title: 'Gudang Doa',
    type: 'materi',
    materiPokok: ['doa', 'ibadah'],
    jilidRelevan: [],
    learningObjective: 'Menghafal dan memaknai doa-doa harian beserta adabnya.',
    caraMain:
      'Perpustakaan doa harian dipilah momen: bangun tidur, makan, hendak sholat, dst. Tiap doa menyajikan teks, arti, dan adab.',
    tipsUstadz: [
      'Kepatutan: amalkan satu doa baru setiap pekan secara suara.',
      'Uji ulang doa pekan lalu sebelum memperkenalkan doa baru.',
    ],
    route: '/member/ngaji-ceria/explore/doa',
    needsContentValidation: false,
  },
  {
    id: 'benteng-istiqomah',
    title: 'Benteng Istiqomah (Jurnal Ibadah)',
    type: 'materi',
    materiPokok: ['ibadah', 'adab'],
    jilidRelevan: [],
    learningObjective:
      'Membentuk kebiasaan istiqomah sholat & ibadah harian melalui jurnal.',
    caraMain:
      'Santri mencatat ibadah harian pada jurnal: catatan sholat, dzikir, dan amalan; benteng tumbuh seiring konsistensi.',
    tipsUstadz: [
      'Jadikan jurnal bahan pembahasan pekanan di majelis.',
      'Berikan apresiasi pada konsistensi, bukan nilai satu hari.',
    ],
    route: '/member/ngaji-ceria/explore/jurnal-ibadah',
    needsContentValidation: false,
  },
];

// ── KUIS: evaluasi belajar ──────────────────────────────────────

export const QUIZ_CATALOG: readonly QuizCatalogEntry[] = [
  {
    id: 'kuis-praktik-tilawati',
    title: 'Kuis Praktik Tilawati',
    type: 'quiz',
    materiPokok: ['tilawati', 'tulisan', 'hijaiyah'],
    jilidRelevan: [1, 2, 3, 4, 5],
    learningObjective:
      'Mengukur hasil belajar per halaman Tilawati lewat kuis yang terikat jilid.',
    caraMain:
      'Kuis sepanjang halaman jilid: setiap selesai peta halaman, santri menjawab soal sesuai materi jilid tersebut.',
    tipsUstadz: [
      'Gunakan skor kuis sebagai prasyarat naik jilid.',
      'Review halaman yang kerap salah dijawab bersama-santri.',
    ],
    route: '/member/ngaji-ceria/explore/practice/play/1',
    needsContentValidation: false,
  },
];

/** Seluruh katalog: materi + kuis + game. */
export const LEARNING_CATALOG: readonly CatalogEntry[] = [
  ...MATERI_CATALOG,
  ...QUIZ_CATALOG,
  ...GAME_CATALOG,
];

const GAMES_BY_ID = new Map<string, RawGameCatalogEntry>(
  GAME_CATALOG.map((entry) => [entry.gameId, entry]),
);

const CATALOG_BY_ID = new Map<string, CatalogEntry>(
  LEARNING_CATALOG.map((entry) => [entry.id, entry]),
);

export function getGameById(gameId: string): GameCatalogEntry | undefined {
  return GAMES_BY_ID.get(gameId);
}

export function getGameCatalog(): readonly GameCatalogEntry[] {
  return GAME_CATALOG;
}

export function getCatalogItemById(id: string): CatalogEntry | undefined {
  return CATALOG_BY_ID.get(id);
}

export function getLearningCatalog(): readonly CatalogEntry[] {
  return LEARNING_CATALOG;
}

export interface CatalogFilter {
  /** Hanya item dengan tipe ini bila diisi. */
  type?: CatalogType | null;
  /** Item yang memuat minimal satu dari materi ini. */
  materi?: readonly MateriPokok[];
  /** Item yang menyertakan jilid ini. */
  jilid?: JilidNumber | null;
  /** Cocok judul item, label materi, atau nama mentah materi. */
  query?: string;
}

export function catalogMatchesFilter(
  entry: CatalogEntry,
  filter: CatalogFilter,
): boolean {
  if (filter.type !== null && filter.type !== undefined) {
    if (entry.type !== filter.type) return false;
  }
  const materi = filter.materi ?? [];
  if (materi.length > 0) {
    const hasOverlap = [...entry.materiPokok].some((m) => materi.includes(m));
    if (!hasOverlap) return false;
  }
  if (filter.jilid !== null && filter.jilid !== undefined) {
    if (!entry.jilidRelevan.includes(filter.jilid)) return false;
  }
  const query = filter.query?.trim().toLowerCase();
  if (query) {
    const haystack = [
      entry.title,
      ...entry.materiPokok,
      ...entry.materiPokok.map((m) => MATERI_LABELS[m]),
    ]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

export function filterCatalogItems(filter: CatalogFilter): CatalogEntry[] {
  return LEARNING_CATALOG.filter((entry) => catalogMatchesFilter(entry, filter));
}

export function filterCatalogGames(
  filter: Omit<CatalogFilter, 'type'>,
): GameCatalogEntry[] {
  return GAME_CATALOG.filter((entry) => catalogMatchesFilter(entry, filter));
}

export interface ClassroomFocus {
  focusMateri: readonly MateriPokok[];
  targetJilid: JilidNumber;
}

export interface GameRecommendation {
  entry: GameCatalogEntry;
  /** Alasan rekomendasi, siap ditampilkan. */
  reason: string;
}

/**
 * Rekomendasi game untuk kelas: skor = 2×jumlah materi yang selaras
 * + 1 jika menyertakan jilid target. Game ber-skor 0 disembunyikan
 * bila ada yang cocok; tampil semuanya saat tidak ada yang cocok.
 */
export function recommendGamesForClassroom(
  focus: ClassroomFocus,
): GameRecommendation[] {
  const scored = GAME_CATALOG.map((entry) => {
    const alignedMateri = focus.focusMateri.filter((m) =>
      entry.materiPokok.includes(m),
    );
    const jilidMatch = entry.jilidRelevan.includes(focus.targetJilid);
    const score = alignedMateri.length * 2 + (jilidMatch ? 1 : 0);
    const reasons: string[] = [];
    if (alignedMateri.length > 0) {
      const labels = alignedMateri.map((m) => MATERI_LABELS[m]);
      reasons.push(`Selaras fokus materi: ${labels.join(', ')}.`);
    }
    if (jilidMatch) {
      reasons.push(`Sesuai target Jilid ${focus.targetJilid}.`);
    }
    return { entry, score, reason: reasons.join(' ') || 'Di luar fokus kelas.' };
  });

  const maxScore = Math.max(...scored.map((item) => item.score), 0);
  if (maxScore === 0) {
    return scored
      .slice()
      .sort((a, b) => a.entry.title.localeCompare(b.entry.title))
      .map((item) => ({ entry: item.entry, reason: item.reason }));
  }

  return scored
    .filter((item) => item.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title),
    )
    .map((item) => ({ entry: item.entry, reason: item.reason }));
}
