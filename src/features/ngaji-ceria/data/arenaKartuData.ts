export interface ArenaKartuMateri {
  id: string; // e.g. "j1-c1"
  cardIndex: number; // 1 s.d. 12
  text: string;
  transliteration: string;
  audioUrl?: string;
  tone?: 'datar' | 'naik' | 'turun';
  beatsCount: number;
  bpm: number;
  instruction?: string;
}

export interface ArenaKartuLevel {
  jilid: number;
  title: string;
  subtitle: string;
  desc: string;
  badgeBg: string;
  cardBg: string;
  borderColor: string;
  texts: string[];
  cards: ArenaKartuMateri[];
}

export interface ArenaKartuCardItem {
  id: string;
  pairId: string;
  text: string;
}

export const ARENA_KARTU_DATA: ArenaKartuLevel[] = [
  {
    jilid: 1,
    title: 'Tilawati Jilid 1',
    subtitle: 'Huruf Tunggal & Fathah Pendek',
    desc: 'Latih ketukan tegas dan lafal huruf dasar dari Alif sampai Ya.',
    badgeBg: 'bg-[#0284C7]',
    cardBg: 'bg-[#E0F2FE]',
    borderColor: 'border-[#0284C7]',
    texts: ['اَ', 'بَ', 'تَ', 'ثَ', 'جَ', 'حَ', 'خَ', 'دَ', 'ذَ', 'رَ', 'زَ', 'سَ'],
    cards: [
      { id: 'j1-c1', cardIndex: 1, text: 'اَ', transliteration: 'A', audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_datar.ogg', tone: 'datar', beatsCount: 2, bpm: 65, instruction: 'Lafalkan A dengan jelas, lepas tanpa dipanjangkan.' },
      { id: 'j1-c2', cardIndex: 2, text: 'بَ', transliteration: 'Ba', audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_01.ogg', tone: 'naik', beatsCount: 2, bpm: 65, instruction: 'Lafalkan Ba dengan merapatkan kedua bibir.' },
      { id: 'j1-c3', cardIndex: 3, text: 'تَ', transliteration: 'Ta', audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_02.ogg', tone: 'turun', beatsCount: 2, bpm: 65, instruction: 'Ujung lidah menempel ke pangkal gigi seri atas.' },
      { id: 'j1-c4', cardIndex: 4, text: 'ثَ', transliteration: 'Tsa', audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_03.ogg', tone: 'datar', beatsCount: 2, bpm: 65, instruction: 'Ujung lidah keluar sedikit di antara gigi seri.' },
      { id: 'j1-c5', cardIndex: 5, text: 'اَبَ', transliteration: 'A-Ba', audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_04.ogg', tone: 'naik', beatsCount: 2, bpm: 65, instruction: 'Dua ketukan cepat, jangan diputus berlebihan.' },
      { id: 'j1-c6', cardIndex: 6, text: 'بَتَ', transliteration: 'Ba-Ta', audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_05.ogg', tone: 'turun', beatsCount: 2, bpm: 65, instruction: 'Irama turun menutup baris.' },
      { id: 'j1-c7', cardIndex: 7, text: 'تَاَ', transliteration: 'Ta-A', audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_06.ogg', tone: 'datar', beatsCount: 2, bpm: 65, instruction: 'Mulai bait baru dengan nada datar stabil.' },
      { id: 'j1-c8', cardIndex: 8, text: 'ثَبَ', transliteration: 'Tsa-Ba', audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_07.ogg', tone: 'naik', beatsCount: 2, bpm: 65, instruction: 'Nada terangkat naik di akhir suku kata.' },
      { id: 'j1-c9', cardIndex: 9, text: 'جَ', transliteration: 'Ja', audioUrl: '/audio/tilawati/jilid_1/hal4/hal4_isi_01.ogg', tone: 'turun', beatsCount: 2, bpm: 65, instruction: 'Tengah lidah bertemu langit-langit keras.' },
      { id: 'j1-c10', cardIndex: 10, text: 'حَ', transliteration: 'Ha', audioUrl: '/audio/tilawati/jilid_1/hal4/hal4_isi_02.ogg', tone: 'datar', beatsCount: 2, bpm: 65, instruction: 'Keluarkan dari tengah tenggorokan dengan bersih.' },
      { id: 'j1-c11', cardIndex: 11, text: 'خَ', transliteration: 'Kha', audioUrl: '/audio/tilawati/jilid_1/hal4/hal4_isi_03.ogg', tone: 'naik', beatsCount: 2, bpm: 65, instruction: 'Suara tebal dari ujung tenggorokan.' },
      { id: 'j1-c12', cardIndex: 12, text: 'دَ', transliteration: 'Da', audioUrl: '/audio/tilawati/jilid_1/hal4/hal4_isi_04.ogg', tone: 'turun', beatsCount: 2, bpm: 65, instruction: 'Ujung lidah menekan pangkal gigi atas.' },
    ],
  },
  {
    jilid: 2,
    title: 'Tilawati Jilid 2',
    subtitle: 'Kata 3 Huruf & Harakat Bersambung',
    desc: 'Latih kelancaran membaca kata 3 huruf dengan fathah dan kasrah.',
    badgeBg: 'bg-[#B45309]',
    cardBg: 'bg-[#FEF3C7]',
    borderColor: 'border-[#B45309]',
    texts: ['دَخَلَ', 'ذَهَبَ', 'رَزَقَ', 'بَيْتًا', 'كِتَابًا', 'حَسَنًا', 'عَمَلًا', 'صَبَرَ', 'نَظَرَ', 'خَلَقَ', 'وَجَدَ', 'قَرَأَ'],
    cards: [
      { id: 'j2-c1', cardIndex: 1, text: 'دَخَلَ', transliteration: 'Dakhala', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 3, bpm: 70, instruction: 'Tiga ketukan pendek lurus dan teratur.' },
      { id: 'j2-c2', cardIndex: 2, text: 'ذَهَبَ', transliteration: 'Dzahaba', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 70, instruction: 'Irama naik di kata kedua.' },
      { id: 'j2-c3', cardIndex: 3, text: 'رَزَقَ', transliteration: 'Razaqa', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 3, bpm: 70, instruction: 'Irama melandai turun menutup bait.' },
      { id: 'j2-c4', cardIndex: 4, text: 'بَيْتًا', transliteration: 'Baytan', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 2, bpm: 70, instruction: 'Harakat tanwin dibaca tegas.' },
      { id: 'j2-c5', cardIndex: 5, text: 'كِتَابًا', transliteration: 'Kitaaban', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_05.ogg', tone: 'naik', beatsCount: 3, bpm: 70, instruction: 'Ketukan mad 2 harakat di tengah kata.' },
      { id: 'j2-c6', cardIndex: 6, text: 'حَسَنًا', transliteration: 'Hasanan', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 3, bpm: 70, instruction: 'Alunan turun yang halus dan merdu.' },
      { id: 'j2-c7', cardIndex: 7, text: 'عَمَلًا', transliteration: '‘Amalan', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_05.ogg', tone: 'datar', beatsCount: 3, bpm: 70, instruction: 'Lafalkan ‘Ain dari tengah tenggorokan.' },
      { id: 'j2-c8', cardIndex: 8, text: 'صَبَرَ', transliteration: 'Shabara', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 3, bpm: 70, instruction: 'Huruf Shad tebal, Ba dan Ra tetap teratur.' },
      { id: 'j2-c9', cardIndex: 9, text: 'نَظَرَ', transliteration: 'Nazhara', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 3, bpm: 70, instruction: 'Zha tebal dengan ujung lidah keluar sedikit.' },
      { id: 'j2-c10', cardIndex: 10, text: 'خَلَقَ', transliteration: 'Khalaqa', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 70, instruction: 'Kha dan Qaf tebal mengapit Lam tipis.' },
      { id: 'j2-c11', cardIndex: 11, text: 'وَجَدَ', transliteration: 'Wajada', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 3, bpm: 70, instruction: 'Tiga huruf tipis berketukan rapi.' },
      { id: 'j2-c12', cardIndex: 12, text: 'قَرَأَ', transliteration: 'Qara-a', audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 3, bpm: 70, instruction: 'Akhiri dengan hamzah sukun tajam.' },
    ],
  },
  {
    jilid: 3,
    title: 'Tilawati Jilid 3',
    subtitle: 'Alif Lam, Mad Asli & Tasydid',
    desc: 'Latih bacaan tasydid yang ditekan dan alif lam qamariyah/syamsiyah.',
    badgeBg: 'bg-[#059669]',
    cardBg: 'bg-[#D1FAE5]',
    borderColor: 'border-[#059669]',
    texts: ['الْحَمْدُ', 'الرَّحْمَنُ', 'نَارٌ', 'قُلْ', 'مِنْ', 'اَلْكِتَابُ', 'غَفُورٌ', 'شَكُورٌ', 'عَلِيمٌ', 'حَكِيمٌ', 'سَمِيعٌ', 'بَصِيرٌ'],
    cards: [
      { id: 'j3-c1', cardIndex: 1, text: 'الْحَمْدُ', transliteration: 'Al-Hamdu', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 3, bpm: 65, instruction: 'Lam qamariyah dibaca jelas dan tenang.' },
      { id: 'j3-c2', cardIndex: 2, text: 'الرَّحْمَنُ', transliteration: 'Ar-Rahmanu', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 4, bpm: 65, instruction: 'Tasydid pada Ra ditekan dengan mantap.' },
      { id: 'j3-c3', cardIndex: 3, text: 'نَارٌ', transliteration: 'Naarun', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 2, bpm: 65, instruction: 'Mad asli 2 harakat lalu tanwin.' },
      { id: 'j3-c4', cardIndex: 4, text: 'قُلْ', transliteration: 'Qul', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 1, bpm: 65, instruction: '1 ketukan tegas dengan sukun.' },
      { id: 'j3-c5', cardIndex: 5, text: 'مِنْ', transliteration: 'Min', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_05.ogg', tone: 'naik', beatsCount: 1, bpm: 65, instruction: 'Sukun jelas tanpa pantulan.' },
      { id: 'j3-c6', cardIndex: 6, text: 'اَلْكِتَابُ', transliteration: 'Al-Kitaabu', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 4, bpm: 65, instruction: 'Perhatikan panjang 2 harakat pada Ta.' },
      { id: 'j3-c7', cardIndex: 7, text: 'غَفُورٌ', transliteration: 'Ghafuurun', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_07.ogg', tone: 'datar', beatsCount: 3, bpm: 65, instruction: 'Mad wau 2 harakat berirama datar.' },
      { id: 'j3-c8', cardIndex: 8, text: 'شَكُورٌ', transliteration: 'Syakuurun', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 65, instruction: 'Lafalkan Syin dengan menyebarkan nafas.' },
      { id: 'j3-c9', cardIndex: 9, text: 'عَلِيمٌ', transliteration: '‘Aliimun', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_01.ogg', tone: 'turun', beatsCount: 3, bpm: 65, instruction: 'Mad ya 2 harakat turun melandai.' },
      { id: 'j3-c10', cardIndex: 10, text: 'حَكِيمٌ', transliteration: 'Hakiimun', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_02.ogg', tone: 'datar', beatsCount: 3, bpm: 65, instruction: 'Kaf tipis dan Ha bersih.' },
      { id: 'j3-c11', cardIndex: 11, text: 'سَمِيعٌ', transliteration: 'Samii’un', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_03.ogg', tone: 'naik', beatsCount: 3, bpm: 65, instruction: 'Akhiri dengan ‘Ain berharakat tanwin.' },
      { id: 'j3-c12', cardIndex: 12, text: 'بَصِيرٌ', transliteration: 'Bashiirun', audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_04.ogg', tone: 'turun', beatsCount: 3, bpm: 65, instruction: 'Shad tebal dan Ra tipis berwaqaf.' },
    ],
  },
  {
    jilid: 4,
    title: 'Tilawati Jilid 4',
    subtitle: 'Tanda Baca, Sukun & Waqaf',
    desc: 'Latih pemantulan qalqalah dan ketukan saat berhenti di ujung ayat.',
    badgeBg: 'bg-[#2563EB]',
    cardBg: 'bg-[#DBEAFE]',
    borderColor: 'border-[#2563EB]',
    texts: ['مَالِكِ يَوْمِ الدِّينِ', 'قَدْ أَفْلَحَ', 'مَن زَكَّاهَا', 'وَالْعَصْرِ', 'فِي جِيدِهَا', 'أَلَمْ نَشْرَحْ', 'إِلَّا الَّذِينَ آمَنُوا', 'تَبَّتْ يَدَا', 'فِي دِينِ اللَّهِ', 'فَسَبِّحْ بِحَمْدِ', 'أَرَأَيْتَ الَّذِي', 'فَذَٰلِكَ الَّذِي'],
    cards: [
      { id: 'j4-c1', cardIndex: 1, text: 'مَالِكِ يَوْمِ الدِّينِ', transliteration: 'Maaliki yawmid-diin', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 4, bpm: 65, instruction: 'Empat ketukan Rost datar.' },
      { id: 'j4-c2', cardIndex: 2, text: 'قَدْ أَفْلَحَ', transliteration: 'Qad aflaha', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 65, instruction: 'Pantulan qalqalah Dal sukun yang membal.' },
      { id: 'j4-c3', cardIndex: 3, text: 'مَن زَكَّاهَا', transliteration: 'Man zakkaahaa', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 3, bpm: 65, instruction: 'Samarkan nun mati ikhfa dengan dengung.' },
      { id: 'j4-c4', cardIndex: 4, text: 'وَالْعَصْرِ', transliteration: 'Wal-’ashr', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 2, bpm: 65, instruction: 'Waqaf tenang pada Shad dan Ra.' },
      { id: 'j4-c5', cardIndex: 5, text: 'فِي جِيدِهَا', transliteration: 'Fii jiidihaa', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_05.ogg', tone: 'naik', beatsCount: 3, bpm: 65, instruction: 'Dua mad asli berturut-turut.' },
      { id: 'j4-c6', cardIndex: 6, text: 'أَلَمْ نَشْرَحْ', transliteration: 'Alam nasyrah', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 3, bpm: 65, instruction: 'Mim sukun idzhar syafawi jelas.' },
      { id: 'j4-c7', cardIndex: 7, text: 'إِلَّا الَّذِينَ آمَنُوا', transliteration: 'Illal-ladziina aamanuu', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 4, bpm: 65, instruction: 'Sambungkan mad badal dengan rapi.' },
      { id: 'j4-c8', cardIndex: 8, text: 'تَبَّتْ يَدَا', transliteration: 'Tabbat yadaa', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 65, instruction: 'Hams Ta sukun terdengar tipis.' },
      { id: 'j4-c9', cardIndex: 9, text: 'فِي دِينِ اللَّهِ', transliteration: 'Fii diinillaah', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 3, bpm: 65, instruction: 'Lam jalalah dibaca tipis (tarqiq).' },
      { id: 'j4-c10', cardIndex: 10, text: 'فَسَبِّحْ بِحَمْدِ', transliteration: 'Fasabbih bihamdi', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 3, bpm: 65, instruction: 'Tasydid Ba lalu sukun Ha bersih.' },
      { id: 'j4-c11', cardIndex: 11, text: 'أَرَأَيْتَ الَّذِي', transliteration: 'Ara-aytal-ladzii', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_05.ogg', tone: 'naik', beatsCount: 4, bpm: 65, instruction: 'Hamzah beruntun dibaca jelas.' },
      { id: 'j4-c12', cardIndex: 12, text: 'فَذَٰلِكَ الَّذِي', transliteration: 'Fadzaalikal-ladzii', audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 4, bpm: 65, instruction: 'Mad asli berdiri tegak 2 harakat.' },
    ],
  },
  {
    jilid: 5,
    title: 'Tilawati Jilid 5',
    subtitle: 'Hukum Nun Mati & Dengung Ghunnah',
    desc: 'Latih ketukan dengung 2 harakat pada ikhfa, idgham, dan iqlab.',
    badgeBg: 'bg-[#DC2626]',
    cardBg: 'bg-[#FEE2E2]',
    borderColor: 'border-[#DC2626]',
    texts: ['مِن بَعْدِ', 'عَن ذِكْرِ', 'مِن مَّاءٍ', 'قُلْ أَعُوذُ', 'أَن بُورِكَ', 'مِن شَرِّ مَا خَلَقَ', 'مَن يَقُولُ', 'مِن وَالٍ', 'كِرَامًا كَاتِبِينَ', 'أَنَّ لَهُمْ', 'إِنَّ الإِنسَانَ', 'مِّن نِّعْمَةٍ'],
    cards: [
      { id: 'j5-c1', cardIndex: 1, text: 'مِن بَعْدِ', transliteration: 'Mim ba’di', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 3, bpm: 60, instruction: 'Iqlab: ubah nun mati menjadi mim berbibir renggang sedikit.' },
      { id: 'j5-c2', cardIndex: 2, text: 'عَن ذِكْرِ', transliteration: '‘An dzikri', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 60, instruction: 'Ikhfa: dengungkan di pangkal hidung 2 harakat.' },
      { id: 'j5-c3', cardIndex: 3, text: 'مِن مَّاءٍ', transliteration: 'Mim maa-in', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 3, bpm: 60, instruction: 'Idgham bighunnah: lebur ke mim dengan dengung.' },
      { id: 'j5-c4', cardIndex: 4, text: 'قُلْ أَعُوذُ', transliteration: 'Qul a’uudzu', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 3, bpm: 60, instruction: 'Idzhar halqi: baca jelas tanpa dengung.' },
      { id: 'j5-c5', cardIndex: 5, text: 'أَن بُورِكَ', transliteration: 'Am buurika', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_05.ogg', tone: 'naik', beatsCount: 3, bpm: 60, instruction: 'Iqlab lembut sebelum Ba.' },
      { id: 'j5-c6', cardIndex: 6, text: 'مِن شَرِّ مَا خَلَقَ', transliteration: 'Min syarri maa khalaq', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 4, bpm: 60, instruction: 'Dengung ikhfa lalu qalqalah Qaf waqaf.' },
      { id: 'j5-c7', cardIndex: 7, text: 'مَن يَقُولُ', transliteration: 'May yaquulu', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 3, bpm: 60, instruction: 'Masuk ke Ya dengan dengung halus.' },
      { id: 'j5-c8', cardIndex: 8, text: 'مِن وَالٍ', transliteration: 'Miw waalin', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 60, instruction: 'Masuk ke Wau dengan dengung 2 ketukan.' },
      { id: 'j5-c9', cardIndex: 9, text: 'كِرَامًا كَاتِبِينَ', transliteration: 'Kiraaman kaatibiin', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 4, bpm: 60, instruction: 'Tanwin bertemu Kaf dibaca ikhfa tipis.' },
      { id: 'j5-c10', cardIndex: 10, text: 'أَنَّ لَهُمْ', transliteration: 'Anna lahum', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 3, bpm: 60, instruction: 'Ghunnah musyaddadah ditahan 2 ketukan.' },
      { id: 'j5-c11', cardIndex: 11, text: 'إِنَّ الإِنسَانَ', transliteration: 'Innal-insaana', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_05.ogg', tone: 'naik', beatsCount: 4, bpm: 60, instruction: 'Ghunnah lalu ikhfa Sin.' },
      { id: 'j5-c12', cardIndex: 12, text: 'مِّن نِّعْمَةٍ', transliteration: 'Min ni’matin', audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 3, bpm: 60, instruction: 'Idgham mitslain nun dengan dengung.' },
    ],
  },
  {
    jilid: 6,
    title: 'Tilawati Jilid 6',
    subtitle: 'Ayat Pilihan & Surat Pendek',
    desc: 'Tantangan melantunkan ayat-ayat surat pilihan dengan irama Rost sempurna.',
    badgeBg: 'bg-[#7C3AED]',
    cardBg: 'bg-[#EDE9FE]',
    borderColor: 'border-[#7C3AED]',
    texts: [
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      'قُلْ هُوَ اللَّهُ أَحَدٌ',
      'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
      'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
      'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      'مَلِكِ النَّاسِ',
      'إِلَٰهِ النَّاسِ',
      'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    ],
    cards: [
      { id: 'j6-c1', cardIndex: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', transliteration: 'Qul a’uudzu bi rabbin-naas', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 4, bpm: 60, instruction: 'Bait 1 Surat An-Naas bernada Rost datar.' },
      { id: 'j6-c2', cardIndex: 2, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteration: 'Qul huwallahu ahad', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 60, instruction: 'Bait 1 Surat Al-Ikhlas bernada Rost naik.' },
      { id: 'j6-c3', cardIndex: 3, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', transliteration: 'Innaa a’thaynaakal-kawtsar', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 4, bpm: 60, instruction: 'Bait 1 Surat Al-Kautsar bernada Rost turun.' },
      { id: 'j6-c4', cardIndex: 4, text: 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', transliteration: 'Wal-’ashr, innal-insaana lafii khusr', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 4, bpm: 60, instruction: 'Lantunkan dengan tenang dan tartil.' },
      { id: 'j6-c5', cardIndex: 5, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: 'Al-hamdu lillaahi rabbil-’aalamiin', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_05.ogg', tone: 'naik', beatsCount: 4, bpm: 60, instruction: 'Ummul Kitab diawali dengan nada naik agung.' },
      { id: 'j6-c6', cardIndex: 6, text: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', transliteration: 'Innaa anzalnaahu fii laylatil-qadr', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 4, bpm: 60, instruction: 'Irama turun menutup ayat kemuliaan Al-Qadr.' },
      { id: 'j6-c7', cardIndex: 7, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteration: 'Lam yalid wa lam yuulad', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_01.ogg', tone: 'datar', beatsCount: 4, bpm: 60, instruction: 'Dua qalqalah Dal sukun berirama simetris.' },
      { id: 'j6-c8', cardIndex: 8, text: 'مَلِكِ النَّاسِ', transliteration: 'Malikin-naas', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_02.ogg', tone: 'naik', beatsCount: 3, bpm: 60, instruction: 'Ghunnah musyaddadah pada Nun ditahan.' },
      { id: 'j6-c9', cardIndex: 9, text: 'إِلَٰهِ النَّاسِ', transliteration: 'Ilaahin-naas', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_03.ogg', tone: 'turun', beatsCount: 3, bpm: 60, instruction: 'Mad thobi’i berdiri 2 harakat melandai.' },
      { id: 'j6-c10', cardIndex: 10, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', transliteration: 'Min syarril-waswaasil-khannaas', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_04.ogg', tone: 'datar', beatsCount: 4, bpm: 60, instruction: 'Rangkaian ikhfa dan alif lam syamsiyah.' },
      { id: 'j6-c11', cardIndex: 11, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', transliteration: 'Fa shalli li rabbika wanhar', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_05.ogg', tone: 'naik', beatsCount: 4, bpm: 60, instruction: 'Idzhar nun mati sebelum Ha.' },
      { id: 'j6-c12', cardIndex: 12, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', transliteration: 'Inna syaani-aka huwal-abtar', audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_06.ogg', tone: 'turun', beatsCount: 4, bpm: 60, instruction: 'Qalqalah Ba lalu waqaf Ra tebal.' },
    ],
  },
];

/**
 * Mengambil daftar 12 kartu materi untuk jilid tertentu
 */
export function getArenaKartuMateri(jilid: number): ArenaKartuMateri[] {
  const level =
    ARENA_KARTU_DATA.find((l) => l.jilid === Number(jilid)) ||
    ARENA_KARTU_DATA[0];
  return level.cards;
}

/**
 * Mencari 1 kartu spesifik berdasarkan jilid dan cardId
 */
export function getArenaKartuCardById(
  jilid: number,
  cardId: string
): ArenaKartuMateri | undefined {
  const cards = getArenaKartuMateri(jilid);
  return cards.find((c) => c.id === cardId);
}

/**
 * Helper pasangan kartu lama untuk backward compatibility jika ada komponen legacy yang memanggil
 */
export function getArenaKartuPairs(
  jilid: number,
  count: number = 6
): ArenaKartuCardItem[] {
  const level =
    ARENA_KARTU_DATA.find((l) => l.jilid === Number(jilid)) ||
    ARENA_KARTU_DATA[0];

  const pool = [...level.texts];
  const selectedTexts: string[] = [];

  let poolCopy = [...pool].sort(() => Math.random() - 0.5);
  while (selectedTexts.length < count) {
    if (poolCopy.length === 0) {
      poolCopy = [...pool].sort(() => Math.random() - 0.5);
    }
    const nextText = poolCopy.pop();
    if (nextText) {
      selectedTexts.push(nextText);
    }
  }

  const cards: ArenaKartuCardItem[] = [];
  selectedTexts.forEach((text, idx) => {
    const pairId = `pair-${idx}`;
    cards.push({
      id: `${pairId}-a`,
      pairId,
      text,
    });
    cards.push({
      id: `${pairId}-b`,
      pairId,
      text,
    });
  });

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

/**
 * Logika ukuran font dinamis sesuai panjang teks Arab
 */
export function getArabicFontSizeClass(text: string): string {
  const len = text.length;
  if (len <= 5) return 'text-3xl sm:text-4xl';
  if (len <= 15) return 'text-xl sm:text-2xl';
  if (len <= 25) return 'text-lg sm:text-xl';
  return 'text-sm sm:text-base';
}
