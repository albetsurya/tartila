export interface ArenaKartuMateri {
  id: string;
  cardIndex: number;
  text: string;
  transliteration: string;
  audioUrl?: string;
  tone?: "datar" | "naik" | "turun";
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

// Helper Fisher-Yates Shuffle (Jauh lebih acak dan optimal daripada Math.random - 0.5)
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const ARENA_KARTU_DATA: ArenaKartuLevel[] = [
  {
    jilid: 1,
    title: "Tilawati Jilid 1",
    subtitle: "Huruf Tunggal & Fathah Pendek",
    desc: "Latih ketukan tegas dan lafal huruf dasar dari Alif sampai Ya.",
    badgeBg: "bg-[#0284C7]",
    cardBg: "bg-[#E0F2FE]",
    borderColor: "border-[#0284C7]",
    texts: [
      "اَ اَ اَ",
      "بَ بَ بَ",
      "بَ بَ اَ",
      "اَ بَ اَ",
      "اَ بَ بَ",
      "بَ اَ بَ",
      "تَ بَ تَ",
      "تَ تَ بَ",
      "تَ اَ بَ",
      "بَ اَ تَ",
      "اَ تَ بَ",
      "اَ بَ تَ",
    ],
    cards: [
      {
        id: "j1-c1",
        cardIndex: 1,
        text: "اَ اَ اَ",
        transliteration: "a a a",
        audioUrl: "/audio/tilawati/jilid_1/hal1/hal1_isi_07.ogg",
        tone: "datar",
        beatsCount: 2,
        bpm: 65,
        instruction: "Lafalkan A dengan jelas, lepas tanpa dipanjangkan.",
      },
      {
        id: "j1-c2",
        cardIndex: 2,
        text: "بَ بَ بَ",
        transliteration: "ba ba ba",
        audioUrl: "/audio/tilawati/jilid_1/hal1/hal1_isi_08.ogg",
        tone: "naik",
        beatsCount: 2,
        bpm: 65,
        instruction: "Lafalkan Ba dengan merapatkan kedua bibir.",
      },
      {
        id: "j1-c3",
        cardIndex: 3,
        text: "بَ بَ اَ",
        transliteration: "ba ba a",
        audioUrl: "/audio/tilawati/jilid_1/hal1/hal1_isi_09.ogg",
        tone: "turun",
        beatsCount: 2,
        bpm: 65,
        instruction: "Ujung lidah menempel ke pangkal gigi seri atas.",
      },
      {
        id: "j1-c4",
        cardIndex: 4,
        text: "اَ بَ اَ",
        transliteration: "a ba a",
        audioUrl: "/audio/tilawati/jilid_1/hal1/hal1_isi_10.ogg",
        tone: "datar",
        beatsCount: 2,
        bpm: 65,
        instruction: "Ujung lidah keluar sedikit di antara gigi seri.",
      },
      {
        id: "j1-c5",
        cardIndex: 5,
        text: "اَ بَ بَ",
        transliteration: "a ba ba",
        audioUrl: "/audio/tilawati/jilid_1/hal1/hal1_isi_11.ogg",
        tone: "naik",
        beatsCount: 2,
        bpm: 65,
        instruction: "Tengah lidah bertemu langit-langit keras.",
      },
      {
        id: "j1-c6",
        cardIndex: 6,
        text: "بَ اَ بَ",
        transliteration: "ba a ba",
        audioUrl: "/audio/tilawati/jilid_1/hal1/hal1_isi_12.ogg",
        tone: "turun",
        beatsCount: 2,
        bpm: 65,
        instruction: "Keluarkan dari tengah tenggorokan dengan bersih.",
      },
      {
        id: "j1-c7",
        cardIndex: 7,
        text: "تَ بَ تَ",
        transliteration: "ta ba ta",
        audioUrl: "/audio/tilawati/jilid_1/hal2/hal2_isi_07.ogg",
        tone: "datar",
        beatsCount: 2,
        bpm: 65,
        instruction: "Suara tebal dari ujung tenggorokan.",
      },
      {
        id: "j1-c8",
        cardIndex: 8,
        text: "تَ تَ بَ",
        transliteration: "ta ta ba",
        audioUrl: "/audio/tilawati/jilid_1/hal2/hal2_isi_08.ogg",
        tone: "naik",
        beatsCount: 2,
        bpm: 65,
        instruction: "Ujung lidah menekan pangkal gigi atas.",
      },
      {
        id: "j1-c9",
        cardIndex: 9,
        text: "تَ اَ بَ",
        transliteration: "ta a ba",
        audioUrl: "/audio/tilawati/jilid_1/hal2/hal2_isi_09.ogg",
        tone: "turun",
        beatsCount: 2,
        bpm: 65,
        instruction: "Ujung lidah keluar sedikit, bersuara tebal.",
      },
      {
        id: "j1-c10",
        cardIndex: 10,
        text: "بَ اَ تَ",
        transliteration: "ba a ta",
        audioUrl: "/audio/tilawati/jilid_1/hal2/hal2_isi_10.ogg",
        tone: "datar",
        beatsCount: 2,
        bpm: 65,
        instruction: "Ujung lidah bergetar ringan.",
      },
      {
        id: "j1-c11",
        cardIndex: 11,
        text: "اَ تَ بَ",
        transliteration: "a ta ba",
        audioUrl: "/audio/tilawati/jilid_1/hal2/hal2_isi_11.ogg",
        tone: "naik",
        beatsCount: 2,
        bpm: 65,
        instruction: "Suara berdesir dari gigi seri.",
      },
      {
        id: "j1-c12",
        cardIndex: 12,
        text: "اَ بَ تَ",
        transliteration: "a ba ta",
        audioUrl: "/audio/tilawati/jilid_1/hal2/hal2_isi_12.ogg",
        tone: "turun",
        beatsCount: 2,
        bpm: 65,
        instruction: "Suara berdesir tipis dari ujung lidah.",
      }
    ],
  },
  {
    jilid: 2,
    title: "Tilawati Jilid 2",
    subtitle: "Kata Pendek & Harakat Bersambung",
    desc: "Latih kelancaran membaca kata dengan fathah, kasrah, dan tanwin.",
    badgeBg: "bg-[#B45309]",
    cardBg: "bg-[#FEF3C7]",
    borderColor: "border-[#B45309]",
    texts: [
      "سَلَمَ سَلِمَ",
      "وَلَكَ وَلِكَ",
      "شَهَدَ شَهِدَ",
      "خَرَجَ خَرِجَ",
      "كَتَبَ كَتِبَ",
      "دَخَلَ دَخَلَ دَخِلِ",
      "ذَحَبَ ذَحَبِ ذَحِبِ",
      "رَزَقَ رَزَقِ رَزِقِ",
      "زَحَدَ زَحَدِ زَحِدِ",
      "سَجَدَ سَجَدِ سَجِدِ",
      "شَكَرَ شَكَرِ شَكِرِ",
      "صَدَقَ صَدَقِ صَدِقِ",
    ],
    cards: [
      {
        id: "j2-c1",
        cardIndex: 1,
        text: "سَلَمَ سَلِمَ",
        transliteration: "salama salima",
        audioUrl: "/audio/tilawati/jilid_2/hal1/hal1_baris_01.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 70,
        instruction: "Tiga ketukan pendek lurus dan teratur.",
      },
      {
        id: "j2-c2",
        cardIndex: 2,
        text: "وَلَكَ وَلِكَ",
        transliteration: "walaka walika",
        audioUrl: "/audio/tilawati/jilid_2/hal1/hal1_baris_02.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 70,
        instruction: "Irama naik di kata kedua.",
      },
      {
        id: "j2-c3",
        cardIndex: 3,
        text: "شَهَدَ شَهِدَ",
        transliteration: "syahada syahida",
        audioUrl: "/audio/tilawati/jilid_2/hal1/hal1_baris_03.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 70,
        instruction: "Irama melandai turun menutup bait.",
      },
      {
        id: "j2-c4",
        cardIndex: 4,
        text: "خَرَجَ خَرِجَ",
        transliteration: "kharaja kharija",
        audioUrl: "/audio/tilawati/jilid_2/hal1/hal1_baris_04.ogg",
        tone: "datar",
        beatsCount: 2,
        bpm: 70,
        instruction: "Harakat tanwin dibaca tegas.",
      },
      {
        id: "j2-c5",
        cardIndex: 5,
        text: "كَتَبَ كَتِبَ",
        transliteration: "kataba katiba",
        audioUrl: "/audio/tilawati/jilid_2/hal1/hal1_baris_05.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 70,
        instruction: "Ketukan mad 2 harakat di tengah kata.",
      },
      {
        id: "j2-c6",
        cardIndex: 6,
        text: "دَخَلَ دَخَلَ دَخِلِ",
        transliteration: "dakhala dakhala dakhili",
        audioUrl: "/audio/tilawati/jilid_2/hal2/hal2_baris_01.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 70,
        instruction: "Alunan turun yang halus dan merdu.",
      },
      {
        id: "j2-c7",
        cardIndex: 7,
        text: "ذَحَبَ ذَحَبِ ذَحِبِ",
        transliteration: "dzahaba dzahabi dzahibi",
        audioUrl: "/audio/tilawati/jilid_2/hal2/hal2_baris_02.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 70,
        instruction: "Lafalkan ‘Ain dari tengah tenggorokan.",
      },
      {
        id: "j2-c8",
        cardIndex: 8,
        text: "رَزَقَ رَزَقِ رَزِقِ",
        transliteration: "razaqa razaqi raziqi",
        audioUrl: "/audio/tilawati/jilid_2/hal2/hal2_baris_03.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 70,
        instruction: "Huruf Shad tebal, Ba dan Ra tetap teratur.",
      },
      {
        id: "j2-c9",
        cardIndex: 9,
        text: "زَحَدَ زَحَدِ زَحِدِ",
        transliteration: "zahada zahadi zahidi",
        audioUrl: "/audio/tilawati/jilid_2/hal2/hal2_baris_04.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 70,
        instruction: "Zha tebal dengan ujung lidah keluar sedikit.",
      },
      {
        id: "j2-c10",
        cardIndex: 10,
        text: "سَجَدَ سَجَدِ سَجِدِ",
        transliteration: "sajada sajadi sajidi",
        audioUrl: "/audio/tilawati/jilid_2/hal2/hal2_baris_05.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 70,
        instruction: "Kha dan Qaf tebal mengapit Lam tipis.",
      },
      {
        id: "j2-c11",
        cardIndex: 11,
        text: "شَكَرَ شَكَرِ شَكِرِ",
        transliteration: "syakara syakari syakiri",
        audioUrl: "/audio/tilawati/jilid_2/hal2/hal2_baris_06.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 70,
        instruction: "Tiga huruf tipis berketukan rapi.",
      },
      {
        id: "j2-c12",
        cardIndex: 12,
        text: "صَدَقَ صَدَقِ صَدِقِ",
        transliteration: "shadaqa shadaqi shadiqi",
        audioUrl: "/audio/tilawati/jilid_2/hal2/hal2_baris_07.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 70,
        instruction: "Akhiri dengan hamzah sukun tajam.",
      }
    ],
  },
  {
    jilid: 3,
    title: "Tilawati Jilid 3",
    subtitle: "Alif Lam, Mad Asli & Tasydid",
    desc: "Latih bacaan tasydid yang ditekan dan alif lam qamariyah/syamsiyah.",
    badgeBg: "bg-[#059669]",
    cardBg: "bg-[#D1FAE5]",
    borderColor: "border-[#059669]",
    texts: [
      "جَعَلْنَا ضَلَلْنَا قَتَلْنَا",
      "لِلْعَالَمِيْنَ لِلْكَافِرِيْنَ لِلْكَاذِبِيْنَ",
      "لِلْقِتَالِ لِلْعِبَادِ لِلْبَشَرِ",
      "اَلْفَ سَنَةٍ اَلْسِنَةٌ سُلْطَانًا",
      "اَلْوَانُ اَلْبَابُ اَلْقَابُ",
      "يُلْحِدُ يُلْهِمُ يُلْبِسُ",
      "وَالْعَاقِبَةُ",
      "لِصَالِ الْجَحِيْمِ",
      "عَلَى الْاٰخِرَةِ",
      "اِلَى الْمَدِيْنَةِ",
      "فِي الْاٰيٰتِ",
      "وَلَكُمُ الْبَنُوْنَ وَقَعَتِ الْوَاقِعَةُ",
    ],
    cards: [
      {
        id: "j3-c1",
        cardIndex: 1,
        text: "جَعَلْنَا ضَلَلْنَا قَتَلْنَا",
        transliteration: "ja'alnaa dhalalnaa qatalnaa",
        audioUrl: "/audio/tilawati/jilid_3/hal1/hal1_baris_01.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 65,
        instruction: "Lam qamariyah dibaca jelas dan tenang.",
      },
      {
        id: "j3-c2",
        cardIndex: 2,
        text: "لِلْعَالَمِيْنَ لِلْكَافِرِيْنَ لِلْكَاذِبِيْنَ",
        transliteration: "lil'aalamiyna lilkaafiriyna lilkaadzibiyna",
        audioUrl: "/audio/tilawati/jilid_3/hal1/hal1_baris_02.ogg",
        tone: "naik",
        beatsCount: 4,
        bpm: 65,
        instruction: "Tasydid pada Ra ditekan dengan mantap.",
      },
      {
        id: "j3-c3",
        cardIndex: 3,
        text: "لِلْقِتَالِ لِلْعِبَادِ لِلْبَشَرِ",
        transliteration: "lilqitaali lil'ibaadi lilbasyari",
        audioUrl: "/audio/tilawati/jilid_3/hal1/hal1_baris_04.ogg",
        tone: "turun",
        beatsCount: 2,
        bpm: 65,
        instruction: "Mad asli 2 harakat lalu tanwin.",
      },
      {
        id: "j3-c4",
        cardIndex: 4,
        text: "اَلْفَ سَنَةٍ اَلْسِنَةٌ سُلْطَانًا",
        transliteration: "alfa sanatin alsinatun sulthaanan",
        audioUrl: "/audio/tilawati/jilid_3/hal1/hal1_baris_05.ogg",
        tone: "datar",
        beatsCount: 1,
        bpm: 65,
        instruction: "1 ketukan tegas dengan sukun.",
      },
      {
        id: "j3-c5",
        cardIndex: 5,
        text: "اَلْوَانُ اَلْبَابُ اَلْقَابُ",
        transliteration: "alwaanu albaabu alqaabu",
        audioUrl: "/audio/tilawati/jilid_3/hal1/hal1_baris_06.ogg",
        tone: "naik",
        beatsCount: 1,
        bpm: 65,
        instruction: "Sukun jelas tanpa pantulan.",
      },
      {
        id: "j3-c6",
        cardIndex: 6,
        text: "يُلْحِدُ يُلْهِمُ يُلْبِسُ",
        transliteration: "yulhidu yulhimu yulbisu",
        audioUrl: "/audio/tilawati/jilid_3/hal1/hal1_baris_07.ogg",
        tone: "turun",
        beatsCount: 4,
        bpm: 65,
        instruction: "Perhatikan panjang 2 harakat pada Ta.",
      },
      {
        id: "j3-c7",
        cardIndex: 7,
        text: "وَالْعَاقِبَةُ",
        transliteration: "waal'aaqibatu wal'aaqibatu",
        audioUrl: "/audio/tilawati/jilid_3/hal2/hal2_baris_02.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 65,
        instruction: "Mad wau 2 harakat berirama datar.",
      },
      {
        id: "j3-c8",
        cardIndex: 8,
        text: "لِصَالِ الْجَحِيْمِ",
        transliteration: "lishaali aljahiymi lishaaliljahiymi",
        audioUrl: "/audio/tilawati/jilid_3/hal2/hal2_baris_03.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 65,
        instruction: "Lafalkan Syin dengan menyebarkan nafas.",
      },
      {
        id: "j3-c9",
        cardIndex: 9,
        text: "عَلَى الْاٰخِرَةِ",
        transliteration: "'alaa alaakhirati 'alalaakhirati",
        audioUrl: "/audio/tilawati/jilid_3/hal2/hal2_baris_04.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 65,
        instruction: "Mad ya 2 harakat turun melandai.",
      },
      {
        id: "j3-c10",
        cardIndex: 10,
        text: "اِلَى الْمَدِيْنَةِ",
        transliteration: "ilaa almadiynati ilalmadiynati",
        audioUrl: "/audio/tilawati/jilid_3/hal2/hal2_baris_05.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 65,
        instruction: "Kaf tipis dan Ha bersih.",
      },
      {
        id: "j3-c11",
        cardIndex: 11,
        text: "فِي الْاٰيٰتِ",
        transliteration: "fiy alaayaati filaayaati",
        audioUrl: "/audio/tilawati/jilid_3/hal2/hal2_baris_06.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 65,
        instruction: "Akhiri dengan ‘Ain berharakat tanwin.",
      },
      {
        id: "j3-c12",
        cardIndex: 12,
        text: "وَلَكُمُ الْبَنُوْنَ وَقَعَتِ الْوَاقِعَةُ",
        transliteration: "walakumu albanuwna waqa'ati alwaaqi'atu",
        audioUrl: "/audio/tilawati/jilid_3/hal2/hal2_baris_07.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 65,
        instruction: "Shad tebal dan Ra tipis berwaqaf.",
      }
    ],
  },
  {
    jilid: 4,
    title: "Tilawati Jilid 4",
    subtitle: "Tanda Baca, Sukun & Waqaf",
    desc: "Latih pemantulan qalqalah dan ketukan saat berhenti di ujung ayat.",
    badgeBg: "bg-[#2563EB]",
    cardBg: "bg-[#DBEAFE]",
    borderColor: "border-[#2563EB]",
    texts: [
      "اَخَّرَ قَدَّمَ رَتَّلَ يَسَّرَ",
      "يُعَجِّلُ يُكَذِّبُ يُبَشِّرُ يُضِلُّ",
      "عُطِّلَتْ سُجِّرَتْ ثُوِّبَتْ سُعِّرَتْ",
      "صَفًّا حَقًّا سَحَّارٍ قَهَّارٍ",
      "رُكَّعًا سُجَّدًا قَيِّمًا عِتِيًّا",
      "مَآ اٰمُرُهُ وَمَا اُمِرُوَ",
      "بِمَآ اَنْتُمْ عَلٰٓى اٰثَارِهِمْ",
      "لَآ اَعْبُدُ اِلَّآ اَمَانِيَّ",
      "لَا يَعْلَمُوْنَ الْكِتٰبَ اِلَّآ اَمَانِيَّ",
      "لَآ اِلٰهَ اِلَّا هُوَ رَبُّ الْعَرْشِ الْعَظِيْمِ",
      "وَمَآ اُمِرُوْا اِلَّا لِيَعْبُدُوْا اِلٰهًا",
      "فَهُمْ عَلٰٓى اٰثَارِهِمْ يُهْرَعُوْنَ",
    ],
    cards: [
      {
        id: "j4-c1",
        cardIndex: 1,
        text: "اَخَّرَ قَدَّمَ رَتَّلَ يَسَّرَ",
        transliteration: "akhkhara qaddama rattala yassara",
        audioUrl: "/audio/tilawati/jilid_4/hal1/hal1_baris_01.ogg",
        tone: "datar",
        beatsCount: 4,
        bpm: 65,
        instruction: "Empat ketukan Rost datar.",
      },
      {
        id: "j4-c2",
        cardIndex: 2,
        text: "يُعَجِّلُ يُكَذِّبُ يُبَشِّرُ يُضِلُّ",
        transliteration: "yu'ajjilu yukadzdzibu yubasysyiru yudhillu",
        audioUrl: "/audio/tilawati/jilid_4/hal1/hal1_baris_02.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 65,
        instruction: "Pantulan qalqalah Dal sukun yang membal.",
      },
      {
        id: "j4-c3",
        cardIndex: 3,
        text: "عُطِّلَتْ سُجِّرَتْ ثُوِّبَتْ سُعِّرَتْ",
        transliteration: "'uththilat sujjirat tsuwwibat su''irat",
        audioUrl: "/audio/tilawati/jilid_4/hal1/hal1_baris_03.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 65,
        instruction: "Samarkan nun mati ikhfa dengan dengung.",
      },
      {
        id: "j4-c4",
        cardIndex: 4,
        text: "صَفًّا حَقًّا سَحَّارٍ قَهَّارٍ",
        transliteration: "shaffan haqqan sahhaarin qahhaarin",
        audioUrl: "/audio/tilawati/jilid_4/hal1/hal1_baris_04.ogg",
        tone: "datar",
        beatsCount: 2,
        bpm: 65,
        instruction: "Waqaf tenang pada Shad dan Ra.",
      },
      {
        id: "j4-c5",
        cardIndex: 5,
        text: "رُكَّعًا سُجَّدًا قَيِّمًا عِتِيًّا",
        transliteration: "rukka'an sujjadan qayyiman 'itiyyan",
        audioUrl: "/audio/tilawati/jilid_4/hal1/hal1_baris_05.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 65,
        instruction: "Dua mad asli berturut-turut.",
      },
      {
        id: "j4-c6",
        cardIndex: 6,
        text: "مَآ اٰمُرُهُ وَمَا اُمِرُوَ",
        transliteration: "maa aamuruhu wamaa umiruwa",
        audioUrl: "/audio/tilawati/jilid_4/hal6/hal6_baris_01.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 65,
        instruction: "Mim sukun idzhar syafawi jelas.",
      },
      {
        id: "j4-c7",
        cardIndex: 7,
        text: "بِمَآ اَنْتُمْ عَلٰٓى اٰثَارِهِمْ",
        transliteration: "bimaa antum 'alaaa aatsaarihim",
        audioUrl: "/audio/tilawati/jilid_4/hal6/hal6_baris_02.ogg",
        tone: "datar",
        beatsCount: 4,
        bpm: 65,
        instruction: "Sambungkan mad badal dengan rapi.",
      },
      {
        id: "j4-c8",
        cardIndex: 8,
        text: "لَآ اَعْبُدُ اِلَّآ اَمَانِيَّ",
        transliteration: "laa a'budu illaa amaaniyya",
        audioUrl: "/audio/tilawati/jilid_4/hal6/hal6_baris_03.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 65,
        instruction: "Hams Ta sukun terdengar tipis.",
      },
      {
        id: "j4-c9",
        cardIndex: 9,
        text: "لَا يَعْلَمُوْنَ الْكِتٰبَ اِلَّآ اَمَانِيَّ",
        transliteration: "laa ya'lamuwna alkitaaba illaa amaaniyya",
        audioUrl: "/audio/tilawati/jilid_4/hal6/hal6_baris_04.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 65,
        instruction: "Lam jalalah dibaca tipis (tarqiq).",
      },
      {
        id: "j4-c10",
        cardIndex: 10,
        text: "لَآ اِلٰهَ اِلَّا هُوَ رَبُّ الْعَرْشِ الْعَظِيْمِ",
        transliteration: "laa ilaaha illaa huwa rabbu al'arsyi al'azhiymi",
        audioUrl: "/audio/tilawati/jilid_4/hal6/hal6_baris_05.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 65,
        instruction: "Tasydid Ba lalu sukun Ha bersih.",
      },
      {
        id: "j4-c11",
        cardIndex: 11,
        text: "وَمَآ اُمِرُوْا اِلَّا لِيَعْبُدُوْا اِلٰهًا",
        transliteration: "wamaa umiruwa illaa liya'buduwa ilaahan",
        audioUrl: "/audio/tilawati/jilid_4/hal6/hal6_baris_06.ogg",
        tone: "naik",
        beatsCount: 4,
        bpm: 65,
        instruction: "Hamzah beruntun dibaca jelas.",
      },
      {
        id: "j4-c12",
        cardIndex: 12,
        text: "فَهُمْ عَلٰٓى اٰثَارِهِمْ يُهْرَعُوْنَ",
        transliteration: "fahum 'alaaa aatsaarihim yuhra'uwna",
        audioUrl: "/audio/tilawati/jilid_4/hal6/hal6_baris_07.ogg",
        tone: "turun",
        beatsCount: 4,
        bpm: 65,
        instruction: "Mad asli berdiri tegak 2 harakat.",
      }
    ],
  },
  {
    jilid: 5,
    title: "Tilawati Jilid 5",
    subtitle: "Hukum Nun Mati & Dengung Ghunnah",
    desc: "Latih ketukan dengung 2 harakat pada ikhfa, idgham, dan iqlab.",
    badgeBg: "bg-[#DC2626]",
    cardBg: "bg-[#FEE2E2]",
    borderColor: "border-[#DC2626]",
    texts: [
      "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
      "لِمَنْ يَّخْشٰى لِقَوْمٍ يَّعْلَمُوْنَ",
      "وَمَنْ يُّبَدِّلْ لِقَوْمٍ يَّتَفَكَّرُوْنَ",
      "اَنْ يَّنْزِلَ لِقَوْمٍ يُّؤْمِنُوْنَ",
      "مَنْ يَّقُوْلُ اِذَنْ يَّسْمَعُوْنَ",
      "لِمَنْ يَّشَآءُ اَرْجُلٌ يَّمْشُوْنَ",
      "وَمِنَ النَّاسِ مَنْ يَّتَّخِذُ مِنْ دُوْنِ اللّٰهِ اَنْدَادًا",
      "وَمَنْ يَّعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَّرَهٗ",
      "اَيَحْسَبُ الْاِنْسَانُ اَنْ يُّتْرَكَ سُدًى",
      "عَسَى اللّٰهُ اَنْ يَّأْتِيَنِيْ بِهِمْ جَمِيْعًا",
      "فَذُوْقُوْا فَلَنْ نَّزِيْدَكُمْ اِلَّا عَذَابًا",
      "لَا يُؤْمِنُوْنَ بِالْاٰخِرَةِ حِجَابًا مَّسْتُوْرًا",
    ],
    cards: [
      {
        id: "j5-c1",
        cardIndex: 1,
        text: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
        transliteration: "bismi allaahi alrrahmaani alrrahiymi n y",
        audioUrl: "/audio/tilawati/jilid_5/hal1/hal1_baris_01.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 60,
        instruction: "Iqlab: ubah nun mati menjadi mim berbibir renggang sedikit.",
      },
      {
        id: "j5-c2",
        cardIndex: 2,
        text: "لِمَنْ يَّخْشٰى لِقَوْمٍ يَّعْلَمُوْنَ",
        transliteration: "liman yyakhsyaaa liqawmin yya'lamuwna",
        audioUrl: "/audio/tilawati/jilid_5/hal1/hal1_baris_02.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 60,
        instruction: "Ikhfa: dengungkan di pangkal hidung 2 harakat.",
      },
      {
        id: "j5-c3",
        cardIndex: 3,
        text: "وَمَنْ يُّبَدِّلْ لِقَوْمٍ يَّتَفَكَّرُوْنَ",
        transliteration: "waman yyubaddil liqawmin yyatafakkaruwna",
        audioUrl: "/audio/tilawati/jilid_5/hal1/hal1_baris_03.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 60,
        instruction: "Idgham bighunnah: lebur ke mim dengan dengung.",
      },
      {
        id: "j5-c4",
        cardIndex: 4,
        text: "اَنْ يَّنْزِلَ لِقَوْمٍ يُّؤْمِنُوْنَ",
        transliteration: "an yyanzila liqawmin yyu'minuwna",
        audioUrl: "/audio/tilawati/jilid_5/hal1/hal1_baris_04.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 60,
        instruction: "Idzhar halqi: baca jelas tanpa dengung.",
      },
      {
        id: "j5-c5",
        cardIndex: 5,
        text: "مَنْ يَّقُوْلُ اِذَنْ يَّسْمَعُوْنَ",
        transliteration: "man yyaquwlu idzan yyasma'uwna",
        audioUrl: "/audio/tilawati/jilid_5/hal1/hal1_baris_05.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 60,
        instruction: "Iqlab lembut sebelum Ba.",
      },
      {
        id: "j5-c6",
        cardIndex: 6,
        text: "لِمَنْ يَّشَآءُ اَرْجُلٌ يَّمْشُوْنَ",
        transliteration: "liman yyasyaa'u arjulun yyamsyuwna",
        audioUrl: "/audio/tilawati/jilid_5/hal1/hal1_baris_06.ogg",
        tone: "turun",
        beatsCount: 4,
        bpm: 60,
        instruction: "Dengung ikhfa lalu qalqalah Qaf waqaf.",
      },
      {
        id: "j5-c7",
        cardIndex: 7,
        text: "وَمِنَ النَّاسِ مَنْ يَّتَّخِذُ مِنْ دُوْنِ اللّٰهِ اَنْدَادًا",
        transliteration: "wamina alnnaasi man yyattakhidzu min duwni allaahi andaadan",
        audioUrl: "/audio/tilawati/jilid_5/hal2/hal2_baris_03.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 60,
        instruction: "Masuk ke Ya dengan dengung halus.",
      },
      {
        id: "j5-c8",
        cardIndex: 8,
        text: "وَمَنْ يَّعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَّرَهٗ",
        transliteration: "waman yya'mal mitsqaala dzarratin syarran yyarahu",
        audioUrl: "/audio/tilawati/jilid_5/hal2/hal2_baris_04.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 60,
        instruction: "Masuk ke Wau dengan dengung 2 ketukan.",
      },
      {
        id: "j5-c9",
        cardIndex: 9,
        text: "اَيَحْسَبُ الْاِنْسَانُ اَنْ يُّتْرَكَ سُدًى",
        transliteration: "ayahsabu alinsaanu an yyutraka sudan",
        audioUrl: "/audio/tilawati/jilid_5/hal2/hal2_baris_05.ogg",
        tone: "turun",
        beatsCount: 4,
        bpm: 60,
        instruction: "Tanwin bertemu Kaf dibaca ikhfa tipis.",
      },
      {
        id: "j5-c10",
        cardIndex: 10,
        text: "عَسَى اللّٰهُ اَنْ يَّأْتِيَنِيْ بِهِمْ جَمِيْعًا",
        transliteration: "'asaa allaahu an yya'tiyaniy bihim jamiy'an",
        audioUrl: "/audio/tilawati/jilid_5/hal2/hal2_baris_06.ogg",
        tone: "datar",
        beatsCount: 3,
        bpm: 60,
        instruction: "Ghunnah musyaddadah ditahan 2 ketukan.",
      },
      {
        id: "j5-c11",
        cardIndex: 11,
        text: "فَذُوْقُوْا فَلَنْ نَّزِيْدَكُمْ اِلَّا عَذَابًا",
        transliteration: "fadzuwquwa falan nnaziydakum illaa 'adzaaban",
        audioUrl: "/audio/tilawati/jilid_5/hal2/hal2_baris_07.ogg",
        tone: "naik",
        beatsCount: 4,
        bpm: 60,
        instruction: "Ghunnah lalu ikhfa Sin.",
      },
      {
        id: "j5-c12",
        cardIndex: 12,
        text: "لَا يُؤْمِنُوْنَ بِالْاٰخِرَةِ حِجَابًا مَّسْتُوْرًا",
        transliteration: "laa yu'minuwna bialaakhirati hijaaban mmastuwran",
        audioUrl: "/audio/tilawati/jilid_5/hal2/hal2_baris_08.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 60,
        instruction: "Idgham mitslain nun dengan dengung.",
      }
    ],
  },
  {
    jilid: 6,
    title: "Tilawati Jilid 6",
    subtitle: "Ayat Pilihan & Surat Pendek",
    desc: "Tantangan melantunkan ayat-ayat surat pilihan dengan irama Rost sempurna.",
    badgeBg: "bg-[#7C3AED]",
    cardBg: "bg-[#EDE9FE]",
    borderColor: "border-[#7C3AED]",
    texts: [
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      "وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "مَلِكِ النَّاسِ",
      "إِلَٰهِ النَّاسِ",
      "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    ],
    cards: [
      {
        id: "j6-c1",
        cardIndex: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: "Qul a’uudzu bi rabbin-naas",
        audioUrl: "/audio/tilawati/jilid_6/hal1/hal1-AnNas-ayat1.ogg",
        tone: "datar",
        beatsCount: 4,
        bpm: 60,
        instruction: "Bait 1 Surat An-Naas bernada Rost datar.",
      },
      {
        id: "j6-c2",
        cardIndex: 2,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        transliteration: "Qul huwallahu ahad",
        audioUrl: "/audio/tilawati/jilid_6/hal1/hal1-AlIkhlas-ayat1.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 60,
        instruction: "Bait 1 Surat Al-Ikhlas bernada Rost naik.",
      },
      {
        id: "j6-c3",
        cardIndex: 3,
        text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        transliteration: "Innaa a’thaynaakal-kawtsar",
        audioUrl: "/audio/tilawati/jilid_6/hal3/hal3-AlKautsar-ayat1.ogg",
        tone: "turun",
        beatsCount: 4,
        bpm: 60,
        instruction: "Bait 1 Surat Al-Kautsar bernada Rost turun.",
      },
      {
        id: "j6-c4",
        cardIndex: 4,
        text: "وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
        transliteration: "Wal-’ashr, innal-insaana lafii khusr",
        audioUrl: undefined,
        tone: "datar",
        beatsCount: 4,
        bpm: 60,
        instruction: "Lantunkan dengan tenang dan tartil.",
      },
      {
        id: "j6-c5",
        cardIndex: 5,
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Al-hamdu lillaahi rabbil-’aalamiin",
        audioUrl: undefined,
        tone: "naik",
        beatsCount: 4,
        bpm: 60,
        instruction: "Ummul Kitab diawali dengan nada naik agung.",
      },
      {
        id: "j6-c6",
        cardIndex: 6,
        text: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
        transliteration: "Innaa anzalnaahu fii laylatil-qadr",
        audioUrl: undefined,
        tone: "turun",
        beatsCount: 4,
        bpm: 60,
        instruction: "Irama turun menutup ayat kemuliaan Al-Qadr.",
      },
      {
        id: "j6-c7",
        cardIndex: 7,
        text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam yalid wa lam yuulad",
        audioUrl: "/audio/tilawati/jilid_6/hal1/hal1-AlIkhlas-ayat3.ogg",
        tone: "datar",
        beatsCount: 4,
        bpm: 60,
        instruction: "Dua qalqalah Dal sukun berirama simetris.",
      },
      {
        id: "j6-c8",
        cardIndex: 8,
        text: "مَلِكِ النَّاسِ",
        transliteration: "Malikin-naas",
        audioUrl: "/audio/tilawati/jilid_6/hal1/hal1-AnNas-ayat2.ogg",
        tone: "naik",
        beatsCount: 3,
        bpm: 60,
        instruction: "Ghunnah musyaddadah pada Nun ditahan.",
      },
      {
        id: "j6-c9",
        cardIndex: 9,
        text: "إِلَٰهِ النَّاسِ",
        transliteration: "Ilaahin-naas",
        audioUrl: "/audio/tilawati/jilid_6/hal1/hal1-AnNas-ayat3.ogg",
        tone: "turun",
        beatsCount: 3,
        bpm: 60,
        instruction: "Mad thobi’i berdiri 2 harakat melandai.",
      },
      {
        id: "j6-c10",
        cardIndex: 10,
        text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        transliteration: "Min syarril-waswaasil-khannaas",
        audioUrl: "/audio/tilawati/jilid_6/hal1/hal1-AnNas-ayat4.ogg",
        tone: "datar",
        beatsCount: 4,
        bpm: 60,
        instruction: "Rangkaian ikhfa dan alif lam syamsiyah.",
      },
      {
        id: "j6-c11",
        cardIndex: 11,
        text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
        transliteration: "Fa shalli li rabbika wanhar",
        audioUrl: "/audio/tilawati/jilid_6/hal3/hal3-AlKautsar-ayat2.ogg",
        tone: "naik",
        beatsCount: 4,
        bpm: 60,
        instruction: "Idzhar nun mati sebelum Ha.",
      },
      {
        id: "j6-c12",
        cardIndex: 12,
        text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        transliteration: "Inna syaani-aka huwal-abtar",
        audioUrl: "/audio/tilawati/jilid_6/hal3/hal3-AlKautsar-ayat3.ogg",
        tone: "turun",
        beatsCount: 4,
        bpm: 60,
        instruction: "Qalqalah Ba lalu waqaf Ra tebal.",
      }
    ],
  }
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
  cardId: string,
): ArenaKartuMateri | undefined {
  const cards = getArenaKartuMateri(jilid);
  return cards.find((c) => c.id === cardId);
}

/**
 * Helper pasangan kartu untuk game Memory Match.
 * Menggunakan algoritma Fisher-Yates dan memastikan tidak ada duplikasi teks
 * dalam satu papan permainan (selama pool mencukupi).
 */
export function getArenaKartuPairs(
  jilid: number,
  count: number = 6,
): ArenaKartuCardItem[] {
  const level =
    ARENA_KARTU_DATA.find((l) => l.jilid === Number(jilid)) ||
    ARENA_KARTU_DATA[0];

  const pool = [...level.texts];
  let selectedTexts: string[] = [];

  // Acak pool utama
  let poolCopy = shuffleArray(pool);

  // Ambil teks unik sebanyak yang diminta
  while (selectedTexts.length < count) {
    if (poolCopy.length === 0) {
      // Jika pool habis (misal butuh 12 pasang tapi teks cuma 10), reset pool
      // TAPI saring agar tidak menduplikasi teks yang sudah terpilih di sesi ini
      const remainingNeeded = count - selectedTexts.length;
      const backupPool = shuffleArray(
        pool.filter((t) => !selectedTexts.includes(t)),
      );

      if (backupPool.length > 0) {
        selectedTexts.push(...backupPool.slice(0, remainingNeeded));
      } else {
        // Darurat: jika benar-benar kehabisan teks unik, izinkan duplikat antar pasangan
        poolCopy = shuffleArray(pool);
        selectedTexts.push(poolCopy.pop() as string);
      }
      break;
    }
    const nextText = poolCopy.pop();
    if (nextText && !selectedTexts.includes(nextText)) {
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

  // Kocok ulang posisi kartu di papan
  return shuffleArray(cards);
}

/**
 * Logika ukuran font dinamis sesuai panjang teks Arab
 */
export function getArabicFontSizeClass(text: string): string {
  const len = text.length;
  if (len <= 5) return "text-3xl sm:text-4xl";
  if (len <= 15) return "text-xl sm:text-2xl";
  if (len <= 25) return "text-lg sm:text-xl";
  return "text-sm sm:text-base";
}
