import type { RostTone } from '../components/lab-irama/timingJudge';

export type TilawatiTone = 'Datar' | 'Naik' | 'Turun';
export type EarTrainingCategory = 'siklus-3' | 'siklus-2' | 'tunggal';

export interface GuideLesson {
  id: string;
  category: 'pendek' | 'mad' | 'siklus';
  title: string;
  subtitle: string;
  arabic: string;
  transliteration: string;
  tone: RostTone;
  rostTone?: TilawatiTone;
  siklusNada?: TilawatiTone[];
  harakatType: '1-harakat' | '2-harakat';
  audioUrl: string;
  tips: string;
  beatsPattern: number[];
}

export interface EarTrainingItem {
  id: string;
  jilid: number;
  hal: number;
  baris?: number;
  arabic: string;
  arabicText: string;
  transliteration: string;
  siklusNada: TilawatiTone[];
  category: EarTrainingCategory;
  tone: RostTone;
  rostTone: TilawatiTone;
  audioUrl: string;
  explanation: string;
  isFullRow?: boolean;
}

export interface RhythmTrack {
  id: string;
  title: string;
  subtitle: string;
  defaultBpm: number;
  totalBeats: number;
  audioUrl: string;
  beats: {
    beatNumber: number;
    tone: RostTone;
    type: '1-harakat' | '2-harakat';
    arabic?: string;
  }[];
}

/* ============================================================================
 * DATA MODUL 1: PANDUAN METRONOM (Bouncing Ball Guide)
 * Sinkron 100% antara Audio Qari, Teks Arab, dan Nada Rost
 * ============================================================================ */
export const LAB_IRAMA_GUIDE_LESSONS: GuideLesson[] = [
  {
    id: 'jilid1-datar',
    category: 'pendek',
    title: 'Nada Datar (1 Ketukan Pendek)',
    subtitle: 'Jilid 1 Hal 1 Header Datar',
    arabic: 'اَ بَ',
    transliteration: 'A - Ba',
    tone: 'datar',
    rostTone: 'Datar',
    siklusNada: ['Datar'],
    harakatType: '1-harakat',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_datar.ogg',
    tips: 'Suara datar, tegas, dan lepas 1 ketukan tanpa dipanjangkan.',
    beatsPattern: [1, 1],
  },
  {
    id: 'jilid1-naik',
    category: 'pendek',
    title: 'Nada Naik (1 Ketukan Pendek)',
    subtitle: 'Jilid 1 Hal 1 Baris 1',
    arabic: 'اَ اَ',
    transliteration: 'A - A',
    tone: 'naik',
    rostTone: 'Naik',
    siklusNada: ['Naik'],
    harakatType: '1-harakat',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_01.ogg',
    tips: 'Intonasi suara terangkat ke atas di akhir bacaan (Rost Naik).',
    beatsPattern: [1, 1],
  },
  {
    id: 'jilid1-turun',
    category: 'pendek',
    title: 'Nada Turun (1 Ketukan Pendek)',
    subtitle: 'Jilid 1 Hal 1 Baris 2',
    arabic: 'بَ بَ',
    transliteration: 'Ba - Ba',
    tone: 'turun',
    rostTone: 'Turun',
    siklusNada: ['Turun'],
    harakatType: '1-harakat',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_02.ogg',
    tips: 'Intonasi melandai turun ke bawah menutup bait 3 baris (Rost Turun).',
    beatsPattern: [1, 1],
  },
  {
    id: 'jilid1-siklus',
    category: 'siklus',
    title: 'Bait Pembuka 3x Nada Lengkap',
    subtitle: 'Jilid 1 Hal 1 Header 3x',
    arabic: 'اَ بَ · اَ بَ · اَ بَ',
    transliteration: 'A Ba (Datar) — A Ba (Naik) — A Ba (Turun)',
    tone: 'datar',
    rostTone: 'Datar',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    harakatType: '1-harakat',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_full.ogg',
    tips: 'Dengarkan perpindahan 3 nada: Datar (baris 1), Naik (baris 2), Turun (baris 3).',
    beatsPattern: [1, 1, 1, 1, 1, 1],
  },
  {
    id: 'jilid2-baris-datar',
    category: 'mad',
    title: 'Kalimat Utuh Nada Rost (1 Baris Penuh)',
    subtitle: 'Jilid 2 Hal 2 Baris 1',
    arabic: 'دَخَلَ دَخَلَ دَخِلِ',
    transliteration: 'Dakhala Dakhala Dakhili',
    tone: 'datar',
    rostTone: 'Datar',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    harakatType: '1-harakat',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_01.ogg',
    tips: '1 baris penuh dibaca mengalir dalam siklus 3 nada: Datar, Naik, dan Turun.',
    beatsPattern: [1, 1, 1, 1, 1, 1],
  },
  {
    id: 'jilid2-baris-naik',
    category: 'mad',
    title: 'Kalimat Utuh Baris 2 (1 Baris Penuh)',
    subtitle: 'Jilid 2 Hal 2 Baris 2',
    arabic: 'ذَحَبَ ذَحَبِ ذَحِبِ',
    transliteration: 'Dzahaba Dzahabi Dzahibi',
    tone: 'naik',
    rostTone: 'Naik',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    harakatType: '1-harakat',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_02.ogg',
    tips: 'Baris kedua juga dibaca berirama Rost: Datar, Naik, dan Turun.',
    beatsPattern: [1, 1, 1, 1, 1, 1],
  },
  {
    id: 'jilid2-baris-turun',
    category: 'mad',
    title: 'Kalimat Utuh Baris 3 (1 Baris Penuh)',
    subtitle: 'Jilid 2 Hal 2 Baris 3',
    arabic: 'رَزَقَ رَزَقِ رَزِقِ',
    transliteration: 'Razaqa Razaqi Raziqi',
    tone: 'turun',
    rostTone: 'Turun',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    harakatType: '1-harakat',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_03.ogg',
    tips: 'Baris ketiga menutup bait dengan siklus nada lengkap Rost Tilawati.',
    beatsPattern: [1, 1, 1, 1, 1, 1],
  },
];

/* ============================================================================
 * DATA MODUL 2: POOL SUSUN POLA NADA ROST (Ear Training)
 * Terverifikasi 100%: Single Source of Truth
 * id, arabicText, audioUrl, dan siklusNada terikat 100% pada audio aslinya.
 * ============================================================================ */
export const LAB_IRAMA_EAR_TRAINING_POOL: EarTrainingItem[] = [
  // ==========================================================================
  // KELOMPOK 1: SIKLUS PENUH (3 NADA): Datar -> Naik -> Turun
  // 1 Baris Penuh Tilawati (3 Segmen Kata / Frasa)
  // ==========================================================================
  {
    id: 'ear-j1-h1-full',
    jilid: 1,
    hal: 1,
    arabic: 'اَ بَ · اَ بَ · اَ بَ',
    arabicText: 'اَ بَ · اَ بَ · اَ بَ',
    transliteration: 'A Ba (Datar) — A Ba (Naik) — A Ba (Turun)',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_full.ogg',
    explanation: 'Siklus Penuh 3 Nada: Bait pembuka dibaca lengkap Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h2-b1',
    jilid: 2,
    hal: 2,
    baris: 1,
    arabic: 'دَخَلَ دَخَلَ دَخِلِ',
    arabicText: 'دَخَلَ دَخَلَ دَخِلِ',
    transliteration: 'Dakhala Dakhala Dakhili',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_01.ogg',
    explanation: 'Siklus Penuh 3 Nada: Kata ke-1 Datar, kata ke-2 Naik, kata ke-3 Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h2-b2',
    jilid: 2,
    hal: 2,
    baris: 2,
    arabic: 'ذَحَبَ ذَحَبِ ذَحِبِ',
    arabicText: 'ذَحَبَ ذَحَبِ ذَحِبِ',
    transliteration: 'Dzahaba Dzahabi Dzahibi',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_02.ogg',
    explanation: 'Siklus Penuh 3 Nada: 1 baris utuh mengalir Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h2-b3',
    jilid: 2,
    hal: 2,
    baris: 3,
    arabic: 'رَزَقَ رَزَقِ رَزِقِ',
    arabicText: 'رَزَقَ رَزَقِ رَزِقِ',
    transliteration: 'Razaqa Razaqi Raziqi',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_03.ogg',
    explanation: 'Siklus Penuh 3 Nada: Rangkaian 3 kata berirama Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h2-b4',
    jilid: 2,
    hal: 2,
    baris: 4,
    arabic: 'زَحَدَ زَحَدِ زَحِدِ',
    arabicText: 'زَحَدَ زَحَدِ زَحِدِ',
    transliteration: 'Zahada Zahadi Zahidi',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_04.ogg',
    explanation: 'Siklus Penuh 3 Nada: Alunan irama Rost Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h2-b5',
    jilid: 2,
    hal: 2,
    baris: 5,
    arabic: 'سَجَدَ سَجَدِ سَجِدِ',
    arabicText: 'سَجَدَ سَجَدِ سَجِدِ',
    transliteration: 'Sajada Sajadi Sajidi',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_05.ogg',
    explanation: 'Siklus Penuh 3 Nada: Pola nada Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h2-b6',
    jilid: 2,
    hal: 2,
    baris: 6,
    arabic: 'شَكَرَ شَكَرِ شَكِرِ',
    arabicText: 'شَكَرَ شَكَرِ شَكِرِ',
    transliteration: 'Syakara Syakari Syakiri',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_2/hal2/hal2_baris_06.ogg',
    explanation: 'Siklus Penuh 3 Nada: Urutan nada Rost berirama Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h3-b1',
    jilid: 2,
    hal: 3,
    baris: 1,
    arabic: 'عَلِمَ   سَلِمَ   رَسِدَ',
    arabicText: 'عَلِمَ   سَلِمَ   رَسِدَ',
    transliteration: '\'Alima Salima Rasida',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_2/hal3/hal3_baris_01.ogg',
    explanation: 'Siklus Penuh 3 Nada: 3 kata latihan kasrah dibaca Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h3-b2',
    jilid: 2,
    hal: 3,
    baris: 2,
    arabic: 'جَلِسَ   رَحِمَ   شَهِدَ',
    arabicText: 'جَلِسَ   رَحِمَ   شَهِدَ',
    transliteration: 'Jalisa Rahima Syahida',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_2/hal3/hal3_baris_02.ogg',
    explanation: 'Siklus Penuh 3 Nada: Nada Rost mengalir Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h3-b3',
    jilid: 2,
    hal: 3,
    baris: 3,
    arabic: 'قَدِرَ   مَرِضَ   غَفِرَ',
    arabicText: 'قَدِرَ   مَرِضَ   غَفِرَ',
    transliteration: 'Qadira Maridha Ghafira',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_2/hal3/hal3_baris_03.ogg',
    explanation: 'Siklus Penuh 3 Nada: Pola 3 kata Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h3-b4',
    jilid: 2,
    hal: 3,
    baris: 4,
    arabic: 'دَخِلَ   خَشِعَ   نَظِرَ',
    arabicText: 'دَخِلَ   خَشِعَ   نَظِرَ',
    transliteration: 'Dakhila Khasyi\'a Nazhira',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_2/hal3/hal3_baris_04.ogg',
    explanation: 'Siklus Penuh 3 Nada: Urutan Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h3-b5',
    jilid: 2,
    hal: 3,
    baris: 5,
    arabic: 'صَبِرَ   شَكِرَ   صَدِقَ',
    arabicText: 'صَبِرَ   شَكِرَ   صَدِقَ',
    transliteration: 'Shabira Syakira Shadiqa',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_2/hal3/hal3_baris_05.ogg',
    explanation: 'Siklus Penuh 3 Nada: Alunan 3 kata Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j2-h3-b6',
    jilid: 2,
    hal: 3,
    baris: 6,
    arabic: 'زَهِدَ   سَجِدَ   رَزِقَ',
    arabicText: 'زَهِدَ   سَجِدَ   رَزِقَ',
    transliteration: 'Zahida Sajida Raziqa',
    siklusNada: ['Datar', 'Naik', 'Turun'],
    category: 'siklus-3',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_2/hal3/hal3_baris_06.ogg',
    explanation: 'Siklus Penuh 3 Nada: Penutup halaman dengan siklus Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },

  // ==========================================================================
  // KELOMPOK 2: SIKLUS PENDEK (2 NADA): Datar -> Turun
  // Kalimat Tilawati 2 Segmen / Frasa
  // ==========================================================================
  {
    id: 'ear-j3-h2-b2',
    jilid: 3,
    hal: 2,
    baris: 2,
    arabic: 'وَالْعَاقِبَةُ = وَلْعَاقِبَةُ',
    arabicText: 'وَالْعَاقِبَةُ = وَلْعَاقِبَةُ',
    transliteration: 'Wal\'aaqibatu',
    siklusNada: ['Datar', 'Turun'],
    category: 'siklus-2',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_3/hal2/hal2_baris_02.ogg',
    explanation: 'Siklus Pendek 2 Nada: Alunan nada Datar diawal, lalu melandai Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j3-h2-b3',
    jilid: 3,
    hal: 2,
    baris: 3,
    arabic: 'هٰذَا الْكِتَابُ = هٰذَلْكِتَابُ',
    arabicText: 'هٰذَا الْكِتَابُ = هٰذَلْكِتَابُ',
    transliteration: 'Haadzal Kitaabu',
    siklusNada: ['Datar', 'Turun'],
    category: 'siklus-2',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_3/hal2/hal2_baris_03.ogg',
    explanation: 'Siklus Pendek 2 Nada: Pola 2 frasa Tilawati Datar ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j3-h2-b4',
    jilid: 3,
    hal: 2,
    baris: 4,
    arabic: 'لِصَالِ الْجَحِيْمِ = لِصَالِلْجَحِيْمِ',
    arabicText: 'لِصَالِ الْجَحِيْمِ = لِصَالِلْجَحِيْمِ',
    transliteration: 'Lishaalil Jahiymi',
    siklusNada: ['Datar', 'Turun'],
    category: 'siklus-2',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_3/hal2/hal2_baris_04.ogg',
    explanation: 'Siklus Pendek 2 Nada: Alunan 2 bagian Datar ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j3-h2-b5',
    jilid: 3,
    hal: 2,
    baris: 5,
    arabic: 'عَلَى الْاٰخِرَةِ = عَلَلْاٰخِرَةِ',
    arabicText: 'عَلَى الْاٰخِرَةِ = عَلَلْاٰخِرَةِ',
    transliteration: '\'Alal Aakhirati',
    siklusNada: ['Datar', 'Turun'],
    category: 'siklus-2',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_3/hal2/hal2_baris_05.ogg',
    explanation: 'Siklus Pendek 2 Nada: Pola 2 frasa berirama Datar ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j3-h2-b6',
    jilid: 3,
    hal: 2,
    baris: 6,
    arabic: 'اِلَى الْمَدِيْنَةِ = اِلَلْمَدِيْنَةِ',
    arabicText: 'اِلَى الْمَدِيْنَةِ = اِلَلْمَدِيْنَةِ',
    transliteration: 'Ilal Madiynati',
    siklusNada: ['Datar', 'Turun'],
    category: 'siklus-2',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_3/hal2/hal2_baris_06.ogg',
    explanation: 'Siklus Pendek 2 Nada: Ditutup dengan nada melandai Turun.',
    isFullRow: true,
  },

  // ==========================================================================
  // KELOMPOK 3: NADA TUNGGAL (1 NADA): Datar, Naik, atau Turun
  // Potongan Ayat / Kotak Tunggal Tilawati
  // ==========================================================================
  // --- Tunggal Nada Datar ---
  {
    id: 'ear-j1-h1-d1',
    jilid: 1,
    hal: 1,
    arabic: 'اَ بَ',
    arabicText: 'اَ بَ',
    transliteration: 'A - Ba',
    siklusNada: ['Datar'],
    category: 'tunggal',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_datar.ogg',
    explanation: 'Nada Tunggal (Datar): Alunan suara datar, tegas, dan lurus tanpa intonasi meninggi.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-d2',
    jilid: 1,
    hal: 1,
    baris: 3,
    arabic: 'اَ بَ',
    arabicText: 'اَ بَ',
    transliteration: 'A - Ba',
    siklusNada: ['Datar'],
    category: 'tunggal',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_03.ogg',
    explanation: 'Nada Tunggal (Datar): Suara lurus dan stabil membuka bait.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-d3',
    jilid: 1,
    hal: 1,
    baris: 6,
    arabic: 'بَ اَ',
    arabicText: 'بَ اَ',
    transliteration: 'Ba - A',
    siklusNada: ['Datar'],
    category: 'tunggal',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_06.ogg',
    explanation: 'Nada Tunggal (Datar): Alunan tenang dan datar.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-d4',
    jilid: 1,
    hal: 1,
    baris: 9,
    arabic: 'بَ بَ اَ',
    arabicText: 'بَ بَ اَ',
    transliteration: 'Ba - Ba - A',
    siklusNada: ['Datar'],
    category: 'tunggal',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_09.ogg',
    explanation: 'Nada Tunggal (Datar): Alunan datar yang tegas dan berirama.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-d5',
    jilid: 1,
    hal: 1,
    baris: 12,
    arabic: 'بَ اَ بَ',
    arabicText: 'بَ اَ بَ',
    transliteration: 'Ba - A - Ba',
    siklusNada: ['Datar'],
    category: 'tunggal',
    tone: 'datar',
    rostTone: 'Datar',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_12.ogg',
    explanation: 'Nada Tunggal (Datar): Penutup baris dengan nada Datar.',
    isFullRow: false,
  },

  // --- Tunggal Nada Naik ---
  {
    id: 'ear-j1-h1-n1',
    jilid: 1,
    hal: 1,
    baris: 1,
    arabic: 'اَ اَ',
    arabicText: 'اَ اَ',
    transliteration: 'A - A',
    siklusNada: ['Naik'],
    category: 'tunggal',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_01.ogg',
    explanation: 'Nada Tunggal (Naik): Intonasi suara terangkat ke atas di akhir bacaan (Rost Naik).',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-n2',
    jilid: 1,
    hal: 1,
    baris: 4,
    arabic: 'بَ اَ',
    arabicText: 'بَ اَ',
    transliteration: 'Ba - A',
    siklusNada: ['Naik'],
    category: 'tunggal',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_04.ogg',
    explanation: 'Nada Tunggal (Naik): Intonasi terangkat naik dengan jelas.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-n3',
    jilid: 1,
    hal: 1,
    baris: 7,
    arabic: 'اَ اَ اَ',
    arabicText: 'اَ اَ اَ',
    transliteration: 'A - A - A',
    siklusNada: ['Naik'],
    category: 'tunggal',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_07.ogg',
    explanation: 'Nada Tunggal (Naik): Alunan meninggi di huruf terakhir.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-n4',
    jilid: 1,
    hal: 1,
    baris: 10,
    arabic: 'اَ بَ اَ',
    arabicText: 'اَ بَ اَ',
    transliteration: 'A - Ba - A',
    siklusNada: ['Naik'],
    category: 'tunggal',
    tone: 'naik',
    rostTone: 'Naik',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_10.ogg',
    explanation: 'Nada Tunggal (Naik): Nada terangkat naik di akhir bacaan.',
    isFullRow: false,
  },

  // --- Tunggal Nada Turun ---
  {
    id: 'ear-j1-h1-t1',
    jilid: 1,
    hal: 1,
    baris: 2,
    arabic: 'بَ بَ',
    arabicText: 'بَ بَ',
    transliteration: 'Ba - Ba',
    siklusNada: ['Turun'],
    category: 'tunggal',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_02.ogg',
    explanation: 'Nada Tunggal (Turun): Alunan suara melandai turun ke bawah menutup bait.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-t2',
    jilid: 1,
    hal: 1,
    baris: 5,
    arabic: 'اَ بَ',
    arabicText: 'اَ بَ',
    transliteration: 'A - Ba',
    siklusNada: ['Turun'],
    category: 'tunggal',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_05.ogg',
    explanation: 'Nada Tunggal (Turun): Alunan suara melandai turun ke bawah.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-t3',
    jilid: 1,
    hal: 1,
    baris: 8,
    arabic: 'بَ بَ بَ',
    arabicText: 'بَ بَ بَ',
    transliteration: 'Ba - Ba - Ba',
    siklusNada: ['Turun'],
    category: 'tunggal',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_08.ogg',
    explanation: 'Nada Tunggal (Turun): Ditutup dengan alunan melandai ke bawah.',
    isFullRow: false,
  },
  {
    id: 'ear-j1-h1-t4',
    jilid: 1,
    hal: 1,
    baris: 11,
    arabic: 'اَ بَ بَ',
    arabicText: 'اَ بَ بَ',
    transliteration: 'A - Ba - Ba',
    siklusNada: ['Turun'],
    category: 'tunggal',
    tone: 'turun',
    rostTone: 'Turun',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_11.ogg',
    explanation: 'Nada Tunggal (Turun): Nada melandai turun menutup siklus.',
    isFullRow: false,
  },
];

/**
 * Generator sesi 5 soal Susun Pola Nada yang seimbang dan mendidik:
 * - Menampilkan siklus 3 nada (siklus penuh), siklus 2 nada (pendek), dan nada tunggal.
 * - Memastikan ada keterwakilan nada Datar, Naik, dan Turun dalam setiap sesi.
 * - Kunci jawaban, teks Arab, dan audio selalu terikat 100% pada objek aslinya.
 */
export function generateEarTrainingSession(count: number = 5): EarTrainingItem[] {
  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const siklus3Pool = LAB_IRAMA_EAR_TRAINING_POOL.filter((i) => i.category === 'siklus-3');
  const siklus2Pool = LAB_IRAMA_EAR_TRAINING_POOL.filter((i) => i.category === 'siklus-2');
  const tunggalPool = LAB_IRAMA_EAR_TRAINING_POOL.filter((i) => i.category === 'tunggal');

  const selected: EarTrainingItem[] = [];

  // 1. Ambil 2 soal siklus penuh (3 nada)
  const shuffled3 = shuffle(siklus3Pool);
  if (shuffled3[0]) selected.push(shuffled3[0]);
  if (shuffled3[1]) selected.push(shuffled3[1]);

  // 2. Ambil 1 soal siklus pendek (2 nada)
  const shuffled2 = shuffle(siklus2Pool);
  if (shuffled2[0]) selected.push(shuffled2[0]);

  // 3. Ambil 1 soal nada tunggal
  const shuffledTunggal = shuffle(tunggalPool);
  if (shuffledTunggal[0]) selected.push(shuffledTunggal[0]);

  // 4. Pastikan ada representasi nada datar, naik, turun untuk integritas test
  const neededTones: RostTone[] = ['datar', 'naik', 'turun'];
  for (const tone of neededTones) {
    if (!selected.some((s) => s.tone === tone)) {
      const match = LAB_IRAMA_EAR_TRAINING_POOL.find(
        (i) => i.tone === tone && !selected.some((s) => s.id === i.id)
      );
      if (match) selected.push(match);
    }
  }

  // 5. Isi sisa slot jika kurang dari count
  const remainingPool = shuffle(
    LAB_IRAMA_EAR_TRAINING_POOL.filter((i) => !selected.some((s) => s.id === i.id))
  );

  while (selected.length < count && remainingPool.length > 0) {
    const next = remainingPool.pop();
    if (next) selected.push(next);
  }

  return shuffle(selected.slice(0, count));
}

/* ============================================================================
 * DATA MODUL 3: RHYTHM TRACK (Tap The Beat)
 * Menggunakan file audio asli hal1_header_full.ogg (Bait Pembuka 3x Nada Lengkap)
 * ============================================================================ */
export const DEFAULT_RHYTHM_TRACK: RhythmTrack = {
  id: 'rost-dasar-1',
  title: 'Irama Rost Santai (Tempo 75 BPM)',
  subtitle: 'Latihan Ketukan Pendek & Mad',
  defaultBpm: 75,
  totalBeats: 24,
  audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_full.ogg',
  beats: [
    { beatNumber: 1, tone: 'datar', type: '1-harakat', arabic: 'اَ' },
    { beatNumber: 2, tone: 'datar', type: '1-harakat', arabic: 'بَ' },
    { beatNumber: 3, tone: 'datar', type: '1-harakat', arabic: '•' },
    { beatNumber: 4, tone: 'naik', type: '1-harakat', arabic: 'اَ' },
    { beatNumber: 5, tone: 'naik', type: '1-harakat', arabic: 'اَ' },
    { beatNumber: 6, tone: 'naik', type: '1-harakat', arabic: '•' },
    { beatNumber: 7, tone: 'turun', type: '1-harakat', arabic: 'بَ' },
    { beatNumber: 8, tone: 'turun', type: '1-harakat', arabic: 'بَ' },
    { beatNumber: 9, tone: 'turun', type: '1-harakat', arabic: '•' },
    { beatNumber: 10, tone: 'datar', type: '2-harakat', arabic: 'بَا' },
    { beatNumber: 12, tone: 'datar', type: '2-harakat', arabic: 'بِيْ' },
    { beatNumber: 14, tone: 'datar', type: '2-harakat', arabic: 'بُوْ' },
    { beatNumber: 16, tone: 'naik', type: '1-harakat', arabic: 'تَ' },
    { beatNumber: 17, tone: 'naik', type: '1-harakat', arabic: 'ثَ' },
    { beatNumber: 18, tone: 'naik', type: '1-harakat', arabic: '•' },
    { beatNumber: 19, tone: 'turun', type: '1-harakat', arabic: 'جَ' },
    { beatNumber: 20, tone: 'turun', type: '1-harakat', arabic: 'حَ' },
    { beatNumber: 21, tone: 'turun', type: '1-harakat', arabic: 'خَ' },
    { beatNumber: 22, tone: 'turun', type: '2-harakat', arabic: 'مَا' },
    { beatNumber: 24, tone: 'turun', type: '1-harakat', arabic: '★' },
  ],
};
