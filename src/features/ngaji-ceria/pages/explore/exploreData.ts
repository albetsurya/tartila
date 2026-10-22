import {
  BookOpen,
  Heart,
  Mosque,
  Settings,
  type LucideIcon,
} from "../../../../components/ui/CustomIcons";

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

export type { DoaEntry } from "../../../doa-dzikir/data/doa";

export interface DoaItem {
  id: string;
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  audioUrl?: string;
}

export interface DoaCategory {
  key: string;
  title: string;
  count: string;
  icon: LucideIcon;
}

export const DOA_CATEGORIES: DoaCategory[] = [
  { key: "harian", title: "Doa Harian", count: "12 DOA", icon: Settings },
  { key: "belajar", title: "Doa Belajar", count: "4 DOA", icon: BookOpen },
  { key: "ibadah", title: "Doa Ibadah", count: "12 DOA", icon: Mosque },
  { key: "keluarga", title: "Doa Keluarga", count: "6 DOA", icon: Heart },
];

export const DOA_LIST: DoaItem[] = [
  // --- Doa Harian ---
  {
    id: "sebelum-makan",
    title: "Doa Sebelum Makan",
    category: "Doa Harian",
    arabic: "بِسْمِ اللَّهِ",
    latin: "Bismillah",
    translation: "Dengan menyebut nama Allah.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "setelah-makan",
    title: "Doa Setelah Makan",
    category: "Doa Harian",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    latin:
      "Alhamdulillaahilladzii ath'amanaa wa saqaanaa wa ja'alanaa muslimiin",
    translation:
      "Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami kaum muslimin.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
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
    id: "keluar-rumah",
    title: "Doa Keluar Rumah",
    category: "Doa Harian",
    arabic:
      "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin:
      "Bismillaahi tawakkaltu 'alallaahi, wa laa haula wa laa quwwata illaa billaah",
    translation:
      "Dengan nama Allah, aku bertawakal kepada Allah, tidak ada daya dan kekuatan kecuali dengan pertolongan Allah.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "masuk-rumah",
    title: "Doa Masuk Rumah",
    category: "Doa Harian",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    latin:
      "Allahumma inni as'aluka khairal maulaji wa khairal makhraji, bismillaahi walajnaa, wa bismillaahi kharajnaa, wa 'alallaahi rabbinaa tawakkalnaa",
    translation:
      "Ya Allah, aku memohon kepada-Mu kebaikan tempat masuk dan kebaikan tempat keluar. Dengan nama Allah kami masuk dan dengan nama Allah kami keluar, dan kepada Allah Tuhan kami, kami bertawakal.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "masuk-wc",
    title: "Doa Masuk WC",
    category: "Doa Harian",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    latin: "Allahumma inni a'uudzu bika minal khubutsi wal khabaa'its",
    translation:
      "Ya Allah, aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "keluar-wc",
    title: "Doa Keluar WC",
    category: "Doa Harian",
    arabic:
      "غُفْرَانَكَ الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي",
    latin:
      "Ghufraanak, alhamdulillaahil ladzii adzhaba 'annil adzaa wa 'aafaanii",
    translation:
      "Aku memohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kotoran dariku dan menyehatkanku.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "naik-kendaraan",
    title: "Doa Naik Kendaraan",
    category: "Doa Harian",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    latin:
      "Subhaanal ladzii sakhkhara lanaa haadzaa wa maa kunnaa lahu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun",
    translation:
      "Maha Suci Allah yang telah menundukkan kendaraan ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "doa-safar",
    title: "Doa Safar (Perjalanan)",
    category: "Doa Harian",
    arabic:
      "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى",
    latin:
      "Allahumma innaa nas'aluka fii safarinaa haadzal birra wat taqwaa, wa minal 'amali maa tardhaa",
    translation:
      "Ya Allah, kami memohon kepada-Mu dalam perjalanan ini kebaikan dan ketakwaan, serta amal yang Engkau ridhai.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "memakai-pakaian",
    title: "Doa Memakai Pakaian",
    category: "Doa Harian",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    latin:
      "Alhamdulillaahil ladzii kasaanii haadzats tsauba wa razaqaniihi min ghairi haulin minnii wa laa quwwah",
    translation:
      "Segala puji bagi Allah yang telah memakaikanku pakaian ini dan mengaruniakannya kepadaku tanpa daya dan kekuatan dariku.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "saat-hujan",
    title: "Doa Saat Hujan Turun",
    category: "Doa Harian",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    latin: "Allahumma shayyiban naafi'an",
    translation: "Ya Allah, turunkanlah hujan yang bermanfaat.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },

  // --- Doa Belajar ---
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
    id: "sesudah-belajar",
    title: "Doa Sesudah Belajar",
    category: "Doa Belajar",
    arabic:
      "اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ، وَأَرِنَا الْبَاطِلَ بَاطِلًا وَارْزُقْنَا اجْتِنَابَهُ",
    latin:
      "Allahumma arinal haqqa haqqan warzuqnat tibaa'ah, wa arinal baathila baathilan warzuqnaj tinaabah",
    translation:
      "Ya Allah, tunjukkanlah kepada kami yang benar itu benar dan berikanlah kami rezeki untuk mengikutinya, dan tunjukkanlah kepada kami yang batil itu batil dan berikanlah kami rezeki untuk menjauhinya.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "kemudahan-urusan",
    title: "Doa Kelancaran Bicara & Belajar",
    category: "Doa Belajar",
    arabic:
      "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
    latin:
      "Rabbisyrah lii shadrii wa yassir lii amrii wahlul 'uqdatan min lisaanii yafqahuu qaulii",
    translation:
      "Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah untukku urusanku, dan lepaskanlah kekakuan dari lidahku, agar mereka mengerti perkataanku.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "diberi-kecerdasan",
    title: "Doa Memohon Hikmah & Kecerdasan",
    category: "Doa Belajar",
    arabic: "اللَّهُمَّ فَقِّهْنَا فِي الدِّينِ وَعَلِّمْنَا التَّأْوِيلَ",
    latin: "Allahumma faqqihnaa fid diin wa 'allimnat ta'wiil",
    translation:
      "Ya Allah, berikanlah kami pemahaman mendalam dalam agama dan ajarkanlah kami ilmu tafsir.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },

  // --- Doa Ibadah ---
  {
    id: "al-ikhlas",
    title: "Surat Al-Ikhlas",
    category: "Doa Ibadah",
    arabic:
      "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    latin:
      "Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yụlad. Wa lam yakun lahụ kufuwan aḥad.",
    translation:
      "Katakanlah (Muhammad): Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Dia tidak beranak dan tidak pula diperanakkan, dan tidak ada sesuatu yang setara dengan Dia.",
    audioUrl: everyAyahAudio(112, 1),
  },
  {
    id: "al-falaq",
    title: "Surat Al-Falaq",
    category: "Doa Ibadah",
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    latin:
      "Qul a'uudzu birabbil falaq. Min syarri maa khalaq. Wa min syarri ghaasiqin idzaa waqab. Wa min syarrin naffaatsaati fil 'uqad. Wa min syarri haasidin idzaa hasad.",
    translation:
      "Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk yang Dia ciptakan, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki bila ia dengki.",
    audioUrl: everyAyahAudio(113, 1),
  },
  {
    id: "an-nas",
    title: "Surat An-Nas",
    category: "Doa Ibadah",
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    latin:
      "Qul a'uudzu birabbin naas. Malikin naas. Ilaahin naas. Min syarril waswaasil khannaas. Alladzii yuwaswisu fii shuduurin naas. Minal jinnati wan naas.",
    translation:
      "Katakanlah: Aku berlindung kepada Tuhan manusia, Raja manusia, Sembahan manusia, dari kejahatan (bisikan) setan yang bersembunyi, yang membisikkan kejahatan ke dalam dada manusia, dari golongan jin dan manusia.",
    audioUrl: everyAyahAudio(114, 1),
  },
  {
    id: "ayat-kursi",
    title: "Ayat Kursi",
    category: "Doa Ibadah",
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    latin:
      "Allahu laa ilaaha illaa huwal hayyul qayyuum, laa ta'khudzuhu sinatuw wa laa naum, lahu maa fis samaawaati wa maa fil ardh...",
    translation:
      "Allah, tidak ada Tuhan selain Dia Yang Hidup kekal lagi terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur...",
    audioUrl: everyAyahAudio(2, 255),
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
    id: "keluar-masjid",
    title: "Doa Keluar Masjid",
    category: "Doa Ibadah",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    latin: "Allahumma inni as'aluka min fadhlik",
    translation: "Ya Allah, aku memohon kepada-Mu dari karunia-Mu.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "setelah-adzan",
    title: "Doa Setelah Mendengar Adzan",
    category: "Doa Ibadah",
    arabic:
      "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
    latin:
      "Allahumma rabba haadzihid da'watit taammati wash shalaatil qaa'imah, aati muhammadanil wasiilata wal fadhiilah, wab'atshu maqaamam mahmuudanil ladzii wa'adtah",
    translation:
      "Ya Allah, Tuhan pemilik seruan yang sempurna ini dan sholat yang akan didirikan, berikanlah kepada Nabi Muhammad wasilah dan keutamaan, dan bangkitkanlah beliau di tempat terpuji yang telah Engkau janjikan.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "setelah-wudhu",
    title: "Doa Setelah Berwudhu",
    category: "Doa Ibadah",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    latin:
      "Asyhadu allaa ilaaha illallaah wahdahu laa syariika lah, wa asyhadu anna muhammadan 'abduhu wa rasuuluh. Allahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin",
    translation:
      "Aku bersaksi tiada Tuhan selain Allah semata tidak ada sekutu bagi-Nya, dan aku bersaksi Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang yang bertaubat dan menyucikan diri.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "berbuka-puasa",
    title: "Doa Berbuka Puasa",
    category: "Doa Ibadah",
    arabic:
      "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
    latin:
      "Dzahabazh zhama'u wabtallatil 'uruuqu wa tsabatal ajru in syaa'allaah",
    translation:
      "Telah hilang rasa haus, dan telah basah urat-urat, serta telah tetap pahala insya Allah.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "sayyidul-istighfar",
    title: "Sayyidul Istighfar",
    category: "Doa Ibadah",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    latin:
      "Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa 'abduka, wa anaa 'alaa 'ahdika wa wa'dika mastatha'tu...",
    translation:
      "Ya Allah, Engkaulah Tuhanku, tiada Tuhan selain Engkau. Engkau menciptakanku dan aku adalah hamba-Mu...",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "ketetapan-iman",
    title: "Doa Ketetapan Iman",
    category: "Doa Ibadah",
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    latin: "Yaa muqallibal quluub tsabbit qalbii 'alaa diinik",
    translation:
      "Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "kebaikan-dunia-akhirat",
    title: "Doa Kebaikan Dunia & Akhirat",
    category: "Doa Ibadah",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin:
      "Rabbanaa aatinaa fid dunyaa hasanatan wa fil aakhirati hasanatan wa qinaa 'adzaaban naar",
    translation:
      "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka.",
    audioUrl: everyAyahAudio(2, 201),
  },

  // --- Doa Keluarga & Akhlak ---
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
  {
    id: "ketika-bercermin",
    title: "Doa Ketika Bercermin",
    category: "Doa Keluarga",
    arabic: "اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
    latin: "Allahumma kamaa hassanta khalqii fahassin khuluqii",
    translation:
      "Ya Allah, sebagaimana Engkau telah memperbagus rupa fisikku, maka perbaguslah pula budi pekertiku.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "menjenguk-orang-sakit",
    title: "Doa Menjenguk Orang Sakit",
    category: "Doa Keluarga",
    arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
    latin: "Laa ba'sa thahuurun in syaa'allaah",
    translation:
      "Tidak mengapa, semoga sakitmu ini menjadi pembersih dosa insya Allah.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "ketika-marah",
    title: "Doa Meredakan Marah",
    category: "Doa Keluarga",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    latin: "A'uudzu billaahi minasy syaithaanir rajiim",
    translation: "Aku berlindung kepada Allah dari godaan setan yang terkutuk.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
  {
    id: "kebaikan-keluarga",
    title: "Doa Keharmonisan Keluarga",
    category: "Doa Keluarga",
    arabic:
      "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    latin:
      "Rabbanaa hab lanaa min azwaajinaa wa dzurriyyatinaa qurrata a'yunin waj'alnaa lil muttaqiina imaamaa",
    translation:
      "Ya Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan kami sebagai penyejuk hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.",
    audioUrl: everyAyahAudio(25, 74),
  },
  {
    id: "ketika-bersin",
    title: "Doa Saat Bersin & Menjawabnya",
    category: "Doa Keluarga",
    arabic:
      "الْحَمْدُ لِلَّهِ — يَرْحَمُكَ اللَّهُ — يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ",
    latin:
      "Alhamdulillaah — Yarhamukallaah — Yahdiikumullaahu wa yushlihu baalakum",
    translation:
      "Segala puji bagi Allah — Semoga Allah merahmatimu — Semoga Allah memberimu petunjuk dan memperbaiki keadaanmu.",
    audioUrl: DOA_AUDIO_PLACEHOLDER,
  },
];

/* -------------------------------- Tajwid --------------------------------- */

export interface TajwidExample {
  number: string;
  arabic: string;
  highlight: string;
  audioUrl: string;
  fullAyah?: string;
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
      {
        number: "01",
        arabic: "اَنْعَمْتَ",
        highlight: "نْ",
        audioUrl: everyAyahAudio(1, 7),
        fullAyah:
          "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      },
      {
        number: "02",
        arabic: "يَنْهَى",
        highlight: "نْ",
        audioUrl: everyAyahAudio(16, 90),
        fullAyah:
          "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ وَالْبَغْيِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ",
      },
      {
        number: "03",
        arabic: "اَلْاَنْهَارُ",
        highlight: "نْ",
        audioUrl: everyAyahAudio(2, 25),
        fullAyah:
          "وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ",
      },
      {
        number: "04",
        arabic: "يَنْهَوْنَ",
        highlight: "نْ",
        audioUrl: everyAyahAudio(6, 26),
        fullAyah:
          "وَهُمْ يَنْهَوْنَ عَنْهُ وَيَنْأَوْنَ عَنْهُ ۖ وَإِنْ يُهْلِكُونَ إِلَّا أَنْفُسَهُمْ وَمَا يَشْعُرُونَ",
      },
      {
        number: "05",
        arabic: "وَالْمُنْخَنِقَةُ",
        highlight: "نْ",
        audioUrl: everyAyahAudio(5, 3),
        fullAyah:
          "حُرِّمَتْ عَلَيْكُمُ الْمَيْتَةُ وَالدَّمُ وَلَحْمُ الْخِنْزِيرِ وَمَا أُهِلَّ لِغَيْرِ اللَّهِ بِهِ وَالْمُنْخَنِقَةُ وَالْمَوْقُوذَةُ",
      },
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
      {
        number: "01",
        arabic: "وَمَنْ يَفْعَلْ",
        highlight: "نْ يَ",
        audioUrl: everyAyahAudio(25, 68),
        fullAyah:
          "وَالَّذِينَ لَا يَدْعُونَ مَعَ اللَّهِ إِلَٰهًا آخَرَ وَلَا يَقْتُلُونَ النَّفْسَ الَّتِي حَرَّمَ اللَّهُ إِلَّا بِالْحَقِّ وَلَا يَزْنُونَ ۚ وَمَنْ يَفْعَلْ ذَٰلِكَ يَلْقَ أَثَامًا",
      },
      {
        number: "02",
        arabic: "وَمَنْ يُضْلِلِ",
        highlight: "نْ يُ",
        audioUrl: everyAyahAudio(39, 23),
        fullAyah:
          "اللَّهُ نَزَّلَ أَحْسَنَ الْحَدِيثِ كِتَابًا مُتَشَابِهًا مَثَانِيَ تَقْشَعِرُّ مِنْهُ جُلُودُ الَّذِينَ يَخْشَوْنَ رَبَّهُمْ ۚ وَمَنْ يُضْلِلِ اللَّهُ فَمَا لَهُ مِنْ هَادٍ",
      },
      {
        number: "03",
        arabic: "مَنْ يَقُولُ",
        highlight: "نْ يَ",
        audioUrl: everyAyahAudio(2, 8),
        fullAyah:
          "وَمِنَ النَّاسِ مَنْ يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُمْ بِمُؤْمِنِينَ",
      },
      {
        number: "04",
        arabic: "وَمَنْ يَعْمَلْ",
        highlight: "نْ يـَ",
        audioUrl: everyAyahAudio(4, 124),
        fullAyah:
          "وَمَنْ يَعْمَلْ مِنَ الصَّالِحَاتِ مِنْ ذَكَرٍ أَوْ أُنْثَىٰ وَهُوَ مُؤْمِنٌ فَأُولَٰئِكَ يَدْخُلُونَ الْجَنَّةَ وَلَا يُظْلَمُونَ نَقِيرًا",
      },
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
      {
        number: "01",
        arabic: "مِنْ رَبِّهِمْ",
        highlight: "نْ رَ",
        audioUrl: everyAyahAudio(2, 5),
        fullAyah:
          "أُولَٰئِكَ عَلَىٰ هُدًى مِنْ رَبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
      },
      {
        number: "02",
        arabic: "وَقُلْ رَبِّ",
        highlight: "لْ رَ",
        audioUrl: everyAyahAudio(17, 24),
        fullAyah:
          "وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ مِنَ الرَّحْمَةِ وَقُلْ رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      },
      {
        number: "03",
        arabic: "مِنْ لَدُنْهُ",
        highlight: "نْ لَ",
        audioUrl: everyAyahAudio(18, 2),
        fullAyah:
          "قَيِّمًا لِيُنْذِرَ بَأْسًا شَدِيدًا مِنْ لَدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا",
      },
      {
        number: "04",
        arabic: "فَإِنْ لَمْ",
        highlight: "نْ لَ",
        audioUrl: everyAyahAudio(2, 24),
        fullAyah:
          "فَإِنْ لَمْ تَفْعَلُوا وَلَنْ تَفْعَلُوا فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ ۖ أُعِدَّتْ لِلْكَافِرِينَ",
      },
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
      {
        number: "01",
        arabic: "مِنْ بَعْدِ",
        highlight: "نْ بَ",
        audioUrl: everyAyahAudio(2, 27),
        fullAyah:
          "الَّذِينَ يَنْقُضُونَ عَهْدَ اللَّهِ مِنْ بَعْدِ مِيثَاقِهِ وَيَقْطَعُونَ مَا أَمَرَ اللَّهُ بِهِ أَنْ يُوصَلَ وَيُفْسِدُونَ فِي الْأَرْضِ ۚ أُولَٰئِكَ هُمُ الْخَاسِرُونَ",
      },
      {
        number: "02",
        arabic: "اَنْ بُورِكَ",
        highlight: "نْ بُ",
        audioUrl: everyAyahAudio(27, 8),
        fullAyah:
          "فَلَمَّا جَاءَهَا نُودِيَ أَنْ بُورِكَ مَنْ فِي النَّارِ وَمَنْ حَوْلَهَا وَسُبْحَانَ اللَّهِ رَبِّ الْعَالَمِينَ",
      },
      {
        number: "03",
        arabic: "سَمِيعٌ بَصِيرٌ",
        highlight: "ٌ بَ",
        audioUrl: everyAyahAudio(4, 134),
        fullAyah:
          "مَنْ كَانَ يُرِيدُ ثَوَابَ الدُّنْيَا فَعِنْدَ اللَّهِ ثَوَابُ الدُّنْيَا وَالْآخِرَةِ ۚ وَكَانَ اللَّهُ سَمِيعًا بَصِيرًا",
      },
      {
        number: "04",
        arabic: "عَلِيمٌ بِذَاتِ",
        highlight: "ٌ بِ",
        audioUrl: everyAyahAudio(3, 119),
        fullAyah:
          "هَا أَنْتُمْ أُولَاءِ تُحِبُّونَهُمْ وَلَا يُحِبُّونَكُمْ وَتُؤْمِنُونَ بِالْكِتَابِ كُلِّهِ ۖ قُلْ مُوتُوا بِغَيْظِكُمْ ۗ إِنَّ اللَّهَ عَلِيمٌ بِذَاتِ الصُّدُورِ",
      },
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
      {
        number: "01",
        arabic: "مِنْ قَبْلِ",
        highlight: "نْ قَ",
        audioUrl: everyAyahAudio(2, 4),
        fullAyah:
          "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
      },
      {
        number: "02",
        arabic: "اَنْزَلَ",
        highlight: "نْ زَ",
        audioUrl: everyAyahAudio(2, 23),
        fullAyah:
          "وَإِنْ كُنْتُمْ فِي رَيْبٍ مِمَّا نَزَّلْنَا عَلَىٰ عَبْدِنَا فَأْتُوا بِسُورَةٍ مِنْ مِثْلِهِ وَادْعُوا شُهَدَاءَكُمْ مِنْ دُونِ اللَّهِ إِنْ كُنْتُمْ صَادِقِينَ",
      },
      {
        number: "03",
        arabic: "مَنْ صَبَرَ",
        highlight: "نْ صَ",
        audioUrl: everyAyahAudio(42, 43),
        fullAyah:
          "وَلَمَنْ صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ",
      },
      {
        number: "04",
        arabic: "اَنْفُسَهُمْ",
        highlight: "نْ فُ",
        audioUrl: everyAyahAudio(2, 9),
        fullAyah:
          "يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنْفُسَهُمْ وَمَا يَشْعُرُونَ",
      },
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
