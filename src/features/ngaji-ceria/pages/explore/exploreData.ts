import {
  BookOpen,
  Heart,
  Mosque,
  Settings,
  type LucideIcon,
} from "../../../../components/ui/FontAwesomeIcons";

/* ------------------------------ Audio helpers ---------------------------- */

/** EveryAyah CDN — {SURAH}{AYAH} dalam 3 digit, mis. 002006 untuk Al-Baqarah:6. */
export const everyAyahAudio = (surah: number, ayah: number): string =>
  `https://everyayah.com/data/Alafasy_128kbps/${String(surah).padStart(3, "0")}${String(
    ayah,
  ).padStart(3, "0")}.mp3`;

/** Placeholder audio doa — ganti dengan CDN doa asli nanti. */
export const DOA_AUDIO_PLACEHOLDER =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

/* ---------------------------------- Doa ---------------------------------- */

export interface DoaItem {
  id: string;
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  audioUrl: string;
}

export interface DoaCategory {
  key: string;
  title: string;
  count: string;
  icon: LucideIcon;
}

export const DOA_CATEGORIES: DoaCategory[] = [
  { key: "harian", title: "Doa Harian", count: "8 DOA", icon: Settings },
  { key: "belajar", title: "Doa Belajar", count: "6 DOA", icon: BookOpen },
  { key: "ibadah", title: "Doa Ibadah", count: "12 DOA", icon: Mosque },
  { key: "keluarga", title: "Doa Keluarga", count: "8 DOA", icon: Heart },
];

export const DOA_LIST: DoaItem[] = [
  {
    id: "sebelum-tidur",
    title: "Doa Sebelum Tidur",
    category: "Doa Harian",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismikallahumma amuutu wa ahyaa",
    translation: "Dengan nama-Mu ya Allah aku mati dan aku hidup.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "bangun-tidur",
    title: "Doa Bangun Tidur",
    category: "Doa Harian",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin:
      "Alhamdulillahi alladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur",
    translation:
      "Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya kami kembali.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "sebelum-makan",
    title: "Doa Sebelum Makan",
    category: "Doa Harian",
    arabic:
      "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    latin: "Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban naar",
    translation:
      "Ya Allah, berkahilah bagi kami pada apa yang Engkau rezekikan dan lindungilah kami dari siksa api neraka.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "sebelum-belajar",
    title: "Doa Sebelum Belajar",
    category: "Doa Belajar",
    arabic: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا",
    latin: "Rabbi zidnii 'ilman warzuqnii fahman",
    translation:
      "Ya Tuhanku, tambahkanlah ilmu kepadaku dan rezekikanlah aku pemahaman.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "masuk-masjid",
    title: "Doa Masuk Masjid",
    category: "Doa Ibadah",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allahummaftah lii abwaaba rahmatik",
    translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "untuk-orang-tua",
    title: "Doa untuk Orang Tua",
    category: "Doa Keluarga",
    arabic:
      "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمْ كَمَا رَبَّوْنِي صَغِيرًا",
    latin:
      "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbaunii shaghiiraa",
    translation:
      "Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan kasihanilah mereka sebagaimana mereka mengasihiku di waktu kecil.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
];

/* -------------------------------- Tajwid --------------------------------- */

export interface TajwidExample {
  number: string;
  arabic: string;
  highlight: string;
  audioUrl: string;
}

export interface TajwidRule {
  id: string;
  kaidah: string;
  title: string;
  subtitle: string;
  caraBaca: string;
  note: string;
  huruf: string;
  examples: TajwidExample[];
}

export const TAJWID_RULES: TajwidRule[] = [
  {
    id: "idzhar",
    kaidah: "KAIDAH 1",
    title: "Idzhar",
    subtitle: "Hukum Nun Mati, Tanwin & Ghunnah",
    caraBaca: "Jelas dan tenang tanpa dengung",
    note: "Idzhar adalah membaca huruf nun mati dan tanwin dengan jelas dan tenang (tanpa dengung) apabila bertemu dengan huruf-huruf idzhar.",
    huruf: "(ء ه ع ح غ خ)",
    examples: [
      { number: "01", arabic: "اَنْعَمْتَ", highlight: "نْ", audioUrl: everyAyahAudio(1, 7) },
      { number: "02", arabic: "يَنْهَى", highlight: "نْ", audioUrl: everyAyahAudio(16, 90) },
      { number: "03", arabic: "اَلْاَنْهَارُ", highlight: "نْ", audioUrl: everyAyahAudio(2, 25) },
      { number: "04", arabic: "يَنْهَوْنَ", highlight: "نْ", audioUrl: everyAyahAudio(6, 26) },
      { number: "05", arabic: "وَالْمُنْخَنِقَةُ", highlight: "نْ", audioUrl: everyAyahAudio(5, 3) },
    ],
  },
  {
    id: "idgham-bighunnah",
    kaidah: "KAIDAH 2",
    title: "Idgham Bighunnah",
    subtitle: "Hukum Nun Mati, Tanwin & Ghunnah",
    caraBaca: "Melebur disertai dengung (2 harakat)",
    note: "Gunnah artinya dengung, Idgham bighunnah adalah meleburkan bacaan nun mati atau tanwin disertai dengung.",
    huruf: "(ي ن م و)",
    examples: [
      { number: "01", arabic: "وَمَنْ يَفْعَلْ", highlight: "نْ يَ", audioUrl: everyAyahAudio(25, 68) },
      { number: "02", arabic: "وَمَنْ يُضْلِلِ", highlight: "نْ يُ", audioUrl: everyAyahAudio(39, 23) },
      { number: "03", arabic: "مَنْ يَقُولُ", highlight: "نْ يَ", audioUrl: everyAyahAudio(2, 8) },
      { number: "04", arabic: "وَمَنْ تَعْمَلُ", highlight: "نْ تَ", audioUrl: everyAyahAudio(4, 124) },
    ],
  },
  {
    id: "idgham-bilaghunnah",
    kaidah: "KAIDAH 3",
    title: "Idgham Bilaghunnah",
    subtitle: "Hukum Nun Mati, Tanwin & Ghunnah",
    caraBaca: "Melebur tanpa dengung",
    note: "Idgham Bilaghunnah adalah meleburkan huruf nun mati atau tanwin ke dalam huruf lam atau ra tanpa disertai dengung.",
    huruf: "(ل ر)",
    examples: [
      { number: "01", arabic: "مِنْ رَبِّهِمْ", highlight: "نْ رَ", audioUrl: everyAyahAudio(2, 5) },
      { number: "02", arabic: "وَقُلْ رَبِّ", highlight: "لْ رَ", audioUrl: everyAyahAudio(17, 24) },
      { number: "03", arabic: "مِنْ لَدُنْهُ", highlight: "نْ لَ", audioUrl: everyAyahAudio(18, 2) },
      { number: "04", arabic: "فَإِنْ لَمْ", highlight: "نْ لَ", audioUrl: everyAyahAudio(2, 24) },
    ],
  },
  {
    id: "iqlab",
    kaidah: "KAIDAH 4",
    title: "Iqlab",
    subtitle: "Hukum Nun Mati, Tanwin & Ghunnah",
    caraBaca: "Mengubah bunyi menjadi Mim (م)",
    note: "Iqlab adalah mengubah bunyi nun mati atau tanwin menjadi mim (م) apabila bertemu dengan huruf ba (ب), disertai dengung.",
    huruf: "(ب)",
    examples: [
      { number: "01", arabic: "مِنْ بَعْدِ", highlight: "نْ بَ", audioUrl: everyAyahAudio(2, 27) },
      { number: "02", arabic: "اَنْ بُورِكَ", highlight: "نْ بُ", audioUrl: everyAyahAudio(27, 8) },
      { number: "03", arabic: "سَمِيعٌ بَصِيرٌ", highlight: "ٌ بَ", audioUrl: everyAyahAudio(4, 134) },
      { number: "04", arabic: "عَلِيمٌ بِذَاتِ", highlight: "ٌ بِ", audioUrl: everyAyahAudio(3, 119) },
    ],
  },
  {
    id: "ikhfa",
    kaidah: "KAIDAH 5",
    title: "Ikhfa'",
    subtitle: "Hukum Nun Mati, Tanwin & Ghunnah",
    caraBaca: "Samar-samar disertai dengung",
    note: "Ikhfa' adalah menyamarkan bunyi nun mati atau tanwin apabila bertemu dengan salah satu dari 15 huruf ikhfa', disertai dengung.",
    huruf: "(ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك)",
    examples: [
      { number: "01", arabic: "مِنْ قَبْلِ", highlight: "نْ قَ", audioUrl: everyAyahAudio(2, 4) },
      { number: "02", arabic: "اَنْزَلَ", highlight: "نْ زَ", audioUrl: everyAyahAudio(2, 23) },
      { number: "03", arabic: "مَنْ صَبَرَ", highlight: "نْ صَ", audioUrl: everyAyahAudio(42, 43) },
      { number: "04", arabic: "اَنْفُسَهُمْ", highlight: "نْ فُ", audioUrl: everyAyahAudio(2, 9) },
    ],
  },
];

/* ------------------------------- Juz 'Amma ------------------------------- */

export interface SurahItem {
  number: number;
  name: string;
  ayah: number;
  audioUrl: string;
}

const JUZ_AMMA_META: Array<{ number: number; name: string; ayah: number }> = [
  { number: 78, name: "An-Naba'", ayah: 40 },
  { number: 79, name: "An-Nazi'at", ayah: 46 },
  { number: 80, name: "'Abasa", ayah: 42 },
  { number: 81, name: "At-Takwir", ayah: 29 },
  { number: 82, name: "Al-Infitar", ayah: 19 },
  { number: 83, name: "Al-Mutaffifin", ayah: 36 },
  { number: 84, name: "Al-Insyiqaq", ayah: 25 },
  { number: 85, name: "Al-Buruj", ayah: 22 },
  { number: 86, name: "At-Tariq", ayah: 17 },
  { number: 87, name: "Al-A'la", ayah: 19 },
  { number: 88, name: "Al-Gasyiyah", ayah: 26 },
  { number: 89, name: "Al-Fajr", ayah: 30 },
  { number: 90, name: "Al-Balad", ayah: 20 },
  { number: 91, name: "Asy-Syams", ayah: 15 },
  { number: 92, name: "Al-Lail", ayah: 21 },
  { number: 93, name: "Ad-Duha", ayah: 11 },
  { number: 94, name: "Asy-Syarh", ayah: 8 },
  { number: 95, name: "At-Tin", ayah: 8 },
  { number: 96, name: "Al-'Alaq", ayah: 19 },
  { number: 97, name: "Al-Qadr", ayah: 5 },
  { number: 98, name: "Al-Bayyinah", ayah: 8 },
  { number: 99, name: "Az-Zalzalah", ayah: 8 },
  { number: 100, name: "Al-'Adiyat", ayah: 11 },
  { number: 101, name: "Al-Qari'ah", ayah: 11 },
  { number: 102, name: "At-Takasur", ayah: 8 },
  { number: 103, name: "Al-'Asr", ayah: 3 },
  { number: 104, name: "Al-Humazah", ayah: 9 },
  { number: 105, name: "Al-Fil", ayah: 5 },
  { number: 106, name: "Quraisy", ayah: 4 },
  { number: 107, name: "Al-Ma'un", ayah: 7 },
  { number: 108, name: "Al-Kausar", ayah: 3 },
  { number: 109, name: "Al-Kafirun", ayah: 6 },
  { number: 110, name: "An-Nasr", ayah: 3 },
  { number: 111, name: "Al-Lahab", ayah: 5 },
  { number: 112, name: "Al-Ikhlas", ayah: 4 },
  { number: 113, name: "Al-Falaq", ayah: 5 },
  { number: 114, name: "An-Nas", ayah: 6 },
];

export const JUZ_AMMA_SURAHS: SurahItem[] = JUZ_AMMA_META.map((surah) => ({
  ...surah,
  audioUrl: everyAyahAudio(surah.number, 1),
}));

/* ------------------------------ Tilawati sesi ---------------------------- */

export interface TilawatiSession {
  jilid: number;
  title: string;
  desc: string;
  unlocked: boolean;
}

export const TILAWATI_SESSIONS: TilawatiSession[] = [
  { jilid: 1, title: "Tilawati 1", desc: "Pengenalan Makhraj", unlocked: true },
  { jilid: 2, title: "Tilawati 2", desc: "Huruf Bersambung", unlocked: false },
  { jilid: 3, title: "Tilawati 3", desc: "Panjang Pendek", unlocked: false },
  { jilid: 4, title: "Tilawati 4", desc: "Hukum Bacaan", unlocked: false },
  { jilid: 5, title: "Tilawati 5", desc: "Waqaf & Ibtida", unlocked: false },
];
