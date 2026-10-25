/**
 * Pemetaan nama surah Arab → nama berkas audio Tilawati.
 *
 * Audio Jilawati Jilid 6 disusun per ayat dengan pola
 * `hal{N}-{SurahLatin}-ayat{K}.ogg`. Nama surah pada judul halaman memakai
 * ejaan Arab berharakat, sedangkan nama berkas memakai ejaan Latin, sehingga
 * diperlukan tabel ini.
 */

/** Nama surah Arab (biasanya tanpa harakat) → nama berkas audio. */
export const SURAH_ARABIC_TO_LATIN: Record<string, string> = {
  "الناس": "AnNas",
  "الفلق": "AlFalaq",
  "الاخلاص": "AlIkhlas",
  "اللهب": "AlLahab",
  "النصر": "AnNasr",
  "الكافرون": "AlKafirun",
  "الكوثر": "AlKautsar",
  "الماعون": "AlMaun",
  "قريش": "Quraysh",
  "الفيل": "AlFil",
  "الهمزة": "AlHumazah",
  "العصر": "AlAsr",
  "التكاثر": "AtTakatsur",
  "القارعة": "AlQariah",
  "العاديات": "AlAdiyat",
  "الزلزلة": "AzZalzalah",
  "البينة": "AlBayyinah",
  "القدر": "AlQadr",
  "العلق": "AlAlaq",
  "التين": "AtTin",
  "الانشراح": "AlInsyirah",
  "الضحى": "AdDuha",
  "الفاتحة": "AlFatihah",
  "البقرة": "AlBaqarah",
  "آل عمران": "AliImran",
  "الاسراء": "AlIsra",
  "المؤمنون": "AlMuminun",
  "لقمان": "Luqman",
  "الفتح": "AlFath",
  "الرحمن": "ArRahman",
  "الجمعة": "AlJumah",
  "الحجرات": "AlHujurat",
  "فصلت": "Fussilat",
  "الكهف": "AlKahfi",
  "القيامة": "AlQiyamah",
  "يس": "Yasin",
  "الاحقاف": "AlAhqaf",
  "المطففين": "AlMuthaffifin",
  "الاعراف": "AlAraf",
  "الطور": "AthThur",
  "الغاشية": "AlGhasyiyah",
  "الزخرف": "AzZukhruf",
  "الفرقان": "AlFurqan",
  "الزمر": "AzZumar",
  "يوسف": "Yusuf",
  "الانسان": "Al-Insan",
  "الانعام": "AlAnam",
  "هود": "Hud",
  "الانبياء": "AlAnbiya",
  "الرعد": "ArRad",
  "الروم": "ArRum",
  "محمد": "Muhammad",
  "الاحزاب": "AlAhzab",
  "المرسلات": "AlMursalat",
  "الصف": "AshShaff",
  "يونس": "Yunus",
  "المائدة": "AlMaidah",
  "الحج": "AlHajj",
};

/** Menghapus harakat dan menyeragamkan huruf agar nama surah mudah dicocokkan. */
export function normalizeSurahName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[ً-ْٰۖ-ۭ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Menyelesaikan nama berkas surah dari nama Arab pada judul halaman.
 *
 * @param arabicName Nama surah Arab, mis. "النَّاس".
 * @returns Nama berkas audio, mis. "AnNas", atau `null` bila tidak dikenal.
 */
export function resolveSurahFile(arabicName: string): string | null {
  const normalized = normalizeSurahName(arabicName);
  return SURAH_ARABIC_TO_LATIN[normalized] ?? SURAH_ARABIC_TO_LATIN[arabicName] ?? null;
}
