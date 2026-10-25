import { judgeBeatHit, HitResult, HIT_WINDOWS } from '../components/lab-irama/timingJudge';
import { getArabicFontSizeClass } from './arenaKartuData';

export { getArabicFontSizeClass, HIT_WINDOWS };

export interface RhythmMemoryItem {
  id: string;
  arabic: string;
  transliteration: string;
  audioUrl: string;
  beatsCount: number; // Jumlah ketukan (2, 3, atau 4 ketukan)
  bpm: number;
  tone?: 'datar' | 'naik' | 'turun';
  durationMs: number; // Durasi fase ketukan dalam ms
}

export interface RhythmMemoryLevel {
  jilid: number;
  title: string;
  subtitle: string;
  desc: string;
  badgeBg: string;
  cardBg: string;
  borderColor: string;
  bpm: number;
  items: RhythmMemoryItem[];
}

export interface RhythmMemoryCardItem {
  id: string; // Misal "pair-0-a"
  pairId: string; // Misal "pair-0"
  item: RhythmMemoryItem;
}

export const RHYTHM_MEMORY_LEVELS: RhythmMemoryLevel[] = [
  {
    jilid: 1,
    title: 'Tilawati Jilid 1',
    subtitle: 'Huruf Dasar & 2 Ketukan Fathah',
    desc: 'Latih ketukan 2 harakat pendek dan asah ingatan huruf tunggal.',
    badgeBg: 'bg-[#0284C7]',
    cardBg: 'bg-[#E0F2FE]',
    borderColor: 'border-[#0284C7]',
    bpm: 65,
    items: [
      {
        id: 'r-j1-01',
        arabic: 'اَ بَ',
        transliteration: 'A - Ba',
        audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_datar.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'datar',
        durationMs: 2400,
      },
      {
        id: 'r-j1-02',
        arabic: 'اَ اَ',
        transliteration: 'A - A',
        audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_01.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'naik',
        durationMs: 2400,
      },
      {
        id: 'r-j1-03',
        arabic: 'بَ بَ',
        transliteration: 'Ba - Ba',
        audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_02.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'turun',
        durationMs: 2400,
      },
      {
        id: 'r-j1-04',
        arabic: 'بَ اَ',
        transliteration: 'Ba - A',
        audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_04.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'naik',
        durationMs: 2400,
      },
      {
        id: 'r-j1-05',
        arabic: 'تَ تَ',
        transliteration: 'Ta - Ta',
        audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_03.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'datar',
        durationMs: 2400,
      },
      {
        id: 'r-j1-06',
        arabic: 'ثَ ثَ',
        transliteration: 'Tsa - Tsa',
        audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_05.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'turun',
        durationMs: 2400,
      },
      {
        id: 'r-j1-07',
        arabic: 'جَ جَ',
        transliteration: 'Ja - Ja',
        audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_06.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'datar',
        durationMs: 2400,
      },
      {
        id: 'r-j1-08',
        arabic: 'حَ حَ',
        transliteration: 'Ha - Ha',
        audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_07.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'naik',
        durationMs: 2400,
      },
    ],
  },
  {
    jilid: 2,
    title: 'Tilawati Jilid 2',
    subtitle: 'Kata 3 Huruf Bersambung & Kasrah',
    desc: 'Latih ketukan 3 nada beruntun pada kata-kata bersambung.',
    badgeBg: 'bg-[#B45309]',
    cardBg: 'bg-[#FEF3C7]',
    borderColor: 'border-[#B45309]',
    bpm: 70,
    items: [
      {
        id: 'r-j2-01',
        arabic: 'دَخَلَ',
        transliteration: 'Dakhala',
        audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_01.ogg',
        beatsCount: 3,
        bpm: 70,
        tone: 'datar',
        durationMs: 2800,
      },
      {
        id: 'r-j2-02',
        arabic: 'ذَهَبَ',
        transliteration: 'Dzahaba',
        audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_02.ogg',
        beatsCount: 3,
        bpm: 70,
        tone: 'naik',
        durationMs: 2800,
      },
      {
        id: 'r-j2-03',
        arabic: 'رَزَقَ',
        transliteration: 'Razaqa',
        audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_03.ogg',
        beatsCount: 3,
        bpm: 70,
        tone: 'turun',
        durationMs: 2800,
      },
      {
        id: 'r-j2-04',
        arabic: 'بَيْتًا',
        transliteration: 'Baytan',
        audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_04.ogg',
        beatsCount: 2,
        bpm: 70,
        tone: 'datar',
        durationMs: 2600,
      },
      {
        id: 'r-j2-05',
        arabic: 'كِتَابًا',
        transliteration: 'Kitaaban',
        audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_05.ogg',
        beatsCount: 3,
        bpm: 70,
        tone: 'naik',
        durationMs: 2800,
      },
      {
        id: 'r-j2-06',
        arabic: 'حَسَنًا',
        transliteration: 'Hasanan',
        audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_06.ogg',
        beatsCount: 3,
        bpm: 70,
        tone: 'turun',
        durationMs: 2800,
      },
      {
        id: 'r-j2-07',
        arabic: 'عَمَلًا',
        transliteration: 'Amalan',
        audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_05.ogg',
        beatsCount: 3,
        bpm: 70,
        tone: 'datar',
        durationMs: 2800,
      },
      {
        id: 'r-j2-08',
        arabic: 'صَبَرَ',
        transliteration: 'Shabara',
        audioUrl: '/audio/tilawati/jilid_2/hal1/hal1_baris_06.ogg',
        beatsCount: 3,
        bpm: 70,
        tone: 'turun',
        durationMs: 2800,
      },
    ],
  },
  {
    jilid: 3,
    title: 'Tilawati Jilid 3',
    subtitle: 'Mad Thobi’i & Alif Lam',
    desc: 'Latih panjang 2 harakat mad thobi’i dan ketukan tegas tasydid.',
    badgeBg: 'bg-[#059669]',
    cardBg: 'bg-[#D1FAE5]',
    borderColor: 'border-[#059669]',
    bpm: 65,
    items: [
      {
        id: 'r-j3-01',
        arabic: 'الْحَمْدُ',
        transliteration: 'Al-Hamdu',
        audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_01.ogg',
        beatsCount: 3,
        bpm: 65,
        tone: 'datar',
        durationMs: 3000,
      },
      {
        id: 'r-j3-02',
        arabic: 'الرَّحْمَنُ',
        transliteration: 'Ar-Rahmanu',
        audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_02.ogg',
        beatsCount: 4,
        bpm: 65,
        tone: 'naik',
        durationMs: 3200,
      },
      {
        id: 'r-j3-03',
        arabic: 'نَارٌ',
        transliteration: 'Naarun',
        audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_03.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'turun',
        durationMs: 2600,
      },
      {
        id: 'r-j3-04',
        arabic: 'قُلْ',
        transliteration: 'Qul',
        audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_04.ogg',
        beatsCount: 1,
        bpm: 65,
        tone: 'datar',
        durationMs: 2200,
      },
      {
        id: 'r-j3-05',
        arabic: 'اَلْكِتَابُ',
        transliteration: 'Al-Kitaabu',
        audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_05.ogg',
        beatsCount: 4,
        bpm: 65,
        tone: 'naik',
        durationMs: 3200,
      },
      {
        id: 'r-j3-06',
        arabic: 'غَفُورٌ',
        transliteration: 'Ghafuurun',
        audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_06.ogg',
        beatsCount: 3,
        bpm: 65,
        tone: 'turun',
        durationMs: 3000,
      },
      {
        id: 'r-j3-07',
        arabic: 'شَكُورٌ',
        transliteration: 'Syakuurun',
        audioUrl: '/audio/tilawati/jilid_3/hal1/hal1_baris_07.ogg',
        beatsCount: 3,
        bpm: 65,
        tone: 'datar',
        durationMs: 3000,
      },
    ],
  },
  {
    jilid: 4,
    title: 'Tilawati Jilid 4',
    subtitle: 'Sukun, Qalqalah & Tanda Berhenti',
    desc: 'Latih ketukan memantul qalqalah dan ketukan tenang waqaf.',
    badgeBg: 'bg-[#2563EB]',
    cardBg: 'bg-[#DBEAFE]',
    borderColor: 'border-[#2563EB]',
    bpm: 65,
    items: [
      {
        id: 'r-j4-01',
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Maaliki yawmid-diin',
        audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_01.ogg',
        beatsCount: 4,
        bpm: 65,
        tone: 'datar',
        durationMs: 3400,
      },
      {
        id: 'r-j4-02',
        arabic: 'قَدْ أَفْلَحَ',
        transliteration: 'Qad aflaha',
        audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_02.ogg',
        beatsCount: 3,
        bpm: 65,
        tone: 'naik',
        durationMs: 3000,
      },
      {
        id: 'r-j4-03',
        arabic: 'مَن زَكَّاهَا',
        transliteration: 'Man zakkaahaa',
        audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_03.ogg',
        beatsCount: 3,
        bpm: 65,
        tone: 'turun',
        durationMs: 3000,
      },
      {
        id: 'r-j4-04',
        arabic: 'وَالْعَصْرِ',
        transliteration: 'Wal-ashr',
        audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_04.ogg',
        beatsCount: 2,
        bpm: 65,
        tone: 'datar',
        durationMs: 2600,
      },
      {
        id: 'r-j4-05',
        arabic: 'فِي جِيدِهَا',
        transliteration: 'Fii jiidihaa',
        audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_05.ogg',
        beatsCount: 3,
        bpm: 65,
        tone: 'naik',
        durationMs: 3000,
      },
      {
        id: 'r-j4-06',
        arabic: 'أَلَمْ نَشْرَحْ',
        transliteration: 'Alam nasyrah',
        audioUrl: '/audio/tilawati/jilid_4/hal1/hal1_baris_06.ogg',
        beatsCount: 3,
        bpm: 65,
        tone: 'turun',
        durationMs: 3000,
      },
    ],
  },
  {
    jilid: 5,
    title: 'Tilawati Jilid 5',
    subtitle: 'Hukum Dengung (Ghunnah & Ikhfa)',
    desc: 'Latih ketukan dengung 2 harakat yang halus dan merdu.',
    badgeBg: 'bg-[#DC2626]',
    cardBg: 'bg-[#FEE2E2]',
    borderColor: 'border-[#DC2626]',
    bpm: 60,
    items: [
      {
        id: 'r-j5-01',
        arabic: 'مِن بَعْدِ',
        transliteration: 'Mim ba’di',
        audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_01.ogg',
        beatsCount: 3,
        bpm: 60,
        tone: 'datar',
        durationMs: 3200,
      },
      {
        id: 'r-j5-02',
        arabic: 'عَن ذِكْرِ',
        transliteration: '‘An dzikri',
        audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_02.ogg',
        beatsCount: 3,
        bpm: 60,
        tone: 'naik',
        durationMs: 3200,
      },
      {
        id: 'r-j5-03',
        arabic: 'مِن مَّاءٍ',
        transliteration: 'Mim maa-in',
        audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_03.ogg',
        beatsCount: 3,
        bpm: 60,
        tone: 'turun',
        durationMs: 3200,
      },
      {
        id: 'r-j5-04',
        arabic: 'قُلْ أَعُوذُ',
        transliteration: 'Qul a’uudzu',
        audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_04.ogg',
        beatsCount: 3,
        bpm: 60,
        tone: 'datar',
        durationMs: 3200,
      },
      {
        id: 'r-j5-05',
        arabic: 'أَن بُورِكَ',
        transliteration: 'Am buurika',
        audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_05.ogg',
        beatsCount: 3,
        bpm: 60,
        tone: 'naik',
        durationMs: 3200,
      },
      {
        id: 'r-j5-06',
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: 'Min syarri maa khalaq',
        audioUrl: '/audio/tilawati/jilid_5/hal1/hal1_baris_06.ogg',
        beatsCount: 4,
        bpm: 60,
        tone: 'turun',
        durationMs: 3600,
      },
    ],
  },
  {
    jilid: 6,
    title: 'Tilawati Jilid 6',
    subtitle: 'Ayat Pilihan & Surat Pendek',
    desc: 'Latih ketukan irama Rost penuh membaca surat-surat Al-Qur’an.',
    badgeBg: 'bg-[#7C3AED]',
    cardBg: 'bg-[#EDE9FE]',
    borderColor: 'border-[#7C3AED]',
    bpm: 60,
    items: [
      {
        id: 'r-j6-01',
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: 'Qul a’uudzu bi rabbin-naas',
        audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_01.ogg',
        beatsCount: 4,
        bpm: 60,
        tone: 'datar',
        durationMs: 3600,
      },
      {
        id: 'r-j6-02',
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'Qul huwallahu ahad',
        audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_02.ogg',
        beatsCount: 3,
        bpm: 60,
        tone: 'naik',
        durationMs: 3400,
      },
      {
        id: 'r-j6-03',
        arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        transliteration: 'Innaa a’thaynaakal-kawtsar',
        audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_03.ogg',
        beatsCount: 4,
        bpm: 60,
        tone: 'turun',
        durationMs: 3800,
      },
      {
        id: 'r-j6-04',
        arabic: 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
        transliteration: 'Wal-’ashr, innal-insaana lafii khusr',
        audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_04.ogg',
        beatsCount: 4,
        bpm: 60,
        tone: 'datar',
        durationMs: 4000,
      },
      {
        id: 'r-j6-05',
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Al-hamdu lillaahi rabbil-’aalamiin',
        audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_05.ogg',
        beatsCount: 4,
        bpm: 60,
        tone: 'naik',
        durationMs: 4000,
      },
      {
        id: 'r-j6-06',
        arabic: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
        transliteration: 'Innaa anzalnaahu fii laylatil-qadr',
        audioUrl: '/audio/tilawati/jilid_6/hal1/hal1_baris_06.ogg',
        beatsCount: 4,
        bpm: 60,
        tone: 'turun',
        durationMs: 4000,
      },
    ],
  },
];

/**
 * Menghasilkan pasangan kartu (2 kartu identik per teks & irama)
 * @param jilid Nomor jilid (1 - 6)
 * @param pairCount Jumlah pasangan kartu (default 6 pasang = 12 kartu)
 */
export function getRhythmMemoryPairs(
  jilid: number,
  pairCount: number = 6
): RhythmMemoryCardItem[] {
  const level =
    RHYTHM_MEMORY_LEVELS.find((l) => l.jilid === Number(jilid)) ||
    RHYTHM_MEMORY_LEVELS[0];

  const pool = [...level.items];
  const selectedItems: RhythmMemoryItem[] = [];

  let poolCopy = [...pool].sort(() => Math.random() - 0.5);
  while (selectedItems.length < pairCount) {
    if (poolCopy.length === 0) {
      poolCopy = [...pool].sort(() => Math.random() - 0.5);
    }
    const nextItem = poolCopy.pop();
    if (nextItem) {
      selectedItems.push(nextItem);
    }
  }

  const cards: RhythmMemoryCardItem[] = [];
  selectedItems.forEach((item, idx) => {
    const pairId = `pair-${idx}`;
    cards.push({
      id: `${pairId}-a`,
      pairId,
      item,
    });
    cards.push({
      id: `${pairId}-b`,
      pairId,
      item,
    });
  });

  // Fisher-Yates Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

/**
 * Evaluasi ketukan anak khusus Rhythm Memory
 * Ramah anak: Perfect <= 120ms, Good <= 250ms
 */
export function evaluateRhythmTap(diffMs: number): HitResult {
  return judgeBeatHit(diffMs);
}
