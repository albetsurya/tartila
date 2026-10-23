// src/features/ngaji-ceria/data/bibiPageTips.ts

export interface TitoTip {
  mood: "thinking" | "happy" | "excited" | "sad";
  text: string;
}

export type BibiTip = TitoTip;

/**
 * Kumpulan tips kontekstual dari Tito.
 * Format key: "jilid:halaman"
 */
export const TITO_PAGE_TIPS: Record<string, TitoTip[]> = {
  // ==========================================
  // JILID 1: Pengenalan Makhraj & Huruf Hijaiyah
  // ==========================================
  "1:1": [
    {
      mood: "happy",
      text: "Halaman pertama nih! Kita kenalan sama Alif dan Ba dulu ya ✨",
    },
    {
      mood: "thinking",
      text: "Ingat ya, Alif dibaca 'A' pendek, bukan 'Aa'. Ba dibaca 'Ba', bukan 'Baa'.",
    },
  ],
  "1:2": [
    {
      mood: "happy",
      text: "Sekarang belajar Ta dan Tsa! Ta itu lidahnya nempel di gigi atas.",
    },
    {
      mood: "thinking",
      text: "Kalau Tsa, lidahnya keluar sedikit dan ada desisnya. Coba bedain ya!",
    },
  ],
  "1:3": [
    {
      mood: "thinking",
      text: "Jim, Ha, dan Kho. Ha dibaca dari tengah tenggorokan, suaranya bersih.",
    },
    { mood: "excited", text: "Ayo tirukan suaraku! Jim.. Ha.. Kho.." },
  ],
  "1:4": [
    {
      mood: "happy",
      text: "Dal dan Dzal. Keduanya hampir sama, bedanya Dzal ada titiknya.",
    },
  ],
  "1:5": [
    {
      mood: "thinking",
      text: "Ra dan Zai. Ra itu lidahnya agak bergetar sedikit lho.",
    },
  ],
  "1:6": [
    {
      mood: "excited",
      text: "Halaman latihan! Ini kelipatan 6, biasanya ada soal ya.",
    },
    { mood: "thinking", text: "Baca pelan-pelan, tidak usah buru-buru." },
  ],
  "1:10": [
    {
      mood: "thinking",
      text: "Ain dan Ghain. Keduanya dari tengah tenggorokan, tapi Ghain lebih berat.",
    },
    {
      mood: "sad",
      text: "Jangan dipaksa kalau masih susah, pelan-pelan aja ya.",
    },
  ],
  "1:15": [
    {
      mood: "excited",
      text: "Horee! Ini huruf terakhir di Jilid 1! Kamu hebat sudah sampai sini.",
    },
  ],

  // ==========================================
  // JILID 2: Huruf Sambung & Panjang Pendek
  // ==========================================
  "2:1": [
    {
      mood: "happy",
      text: "Selamat datang di Jilid 2! Sekarang kita belajar huruf sambung.",
    },
    {
      mood: "thinking",
      text: "Perhatikan gantungan hurufnya, jangan sampai putus ya.",
    },
  ],
  "2:10": [
    {
      mood: "thinking",
      text: "Sekarang belajar Kasrah (bunyi 'i'). Bibirnya jangan ditarik lebar.",
    },
  ],
  "2:20": [
    {
      mood: "thinking",
      text: "Ini Dhammah (bunyi 'u'). Bibirnya dibulatkan seperti mau meniup lilin.",
    },
    { mood: "happy", text: "Coba tiup lilinnya! Uuuuu..." },
  ],
  "2:30": [
    {
      mood: "excited",
      text: "Masuk bab panjang pendek! Hitung 2 ketukan untuk bacaan panjang.",
    },
    {
      mood: "thinking",
      text: "Kalau pendek 1 ketukan, kalau panjang 2 ketukan. Jangan lebih ya!",
    },
  ],

  // ==========================================
  // JILID 3: Mad, Tasydid & Ghunnah
  // ==========================================
  "3:1": [
    {
      mood: "happy",
      text: "Jilid 3! Ini level yang lebih seru. Kita mulai dengan Mad Thobi'i.",
    },
  ],
  "3:15": [
    {
      mood: "thinking",
      text: "Ada Tasydid! Hurufnya ditekan dan ditahan sebentar ya.",
    },
    { mood: "excited", text: "Coba rasakan getarannya saat menekan huruf!" },
  ],
  "3:25": [
    {
      mood: "thinking",
      text: "Ghunnah artinya dengung. Suaranya masuk ke hidung, bukan ke mulut.",
    },
    {
      mood: "happy",
      text: "Coba tutup hidungmu, kalau dengungnya hilang berarti benar!",
    },
  ],

  // ==========================================
  // JILID 4: Waqaf & Ibtida (Tajwid Dasar)
  // ==========================================
  "4:1": [
    {
      mood: "excited",
      text: "Selamat datang di dunia Tajwid! Kita belajar Idzhar dulu.",
    },
    {
      mood: "thinking",
      text: "Idzhar itu dibaca JELAS. Tidak boleh didengungkan ya.",
    },
  ],
  "4:10": [
    {
      mood: "thinking",
      text: "Ini Idgham. Hurufnya dilebur atau dimasukkan ke huruf berikutnya.",
    },
    {
      mood: "happy",
      text: "Bayangkan seperti mencampur madu ke dalam air, menyatu gitu!",
    },
  ],
  "4:20": [
    {
      mood: "thinking",
      text: "Iqlab. Kalau ada Nun mati ketemu Ba, bacaannya berubah jadi Mim.",
    },
  ],
  "4:35": [
    {
      mood: "excited",
      text: "Hampir selesai Jilid 4! Kamu sudah paham hukum-hukum tajwid dasar. Hebat!",
    },
  ],

  // ==========================================
  // JILID 5: Tajwid Lanjutan & Kelancaran
  // ==========================================
  "5:1": [
    {
      mood: "excited",
      text: "Jilid terakhir! Ini level lanjutan. Kami bangga sama kamu!",
    },
    {
      mood: "thinking",
      text: "Sekarang kita fokus ke kelancaran dan ketepatan bacaan ya.",
    },
  ],
  "5:10": [
    {
      mood: "thinking",
      text: "Qalqalah artinya memantul. Hurufnya dibaca memantul saat sukun.",
    },
    { mood: "happy", text: "Coba bayangkan bola memantul di lantai!" },
  ],
  "5:20": [
    {
      mood: "thinking",
      text: "Mim Mati punya hukum Ikhfa Syafawi, Idgham Mimi, dan Izhar Syafawi.",
    },
    {
      mood: "excited",
      text: "Jangan bingung, kita temani terus sampai kamu bisa!",
    },
  ],
};

/**
 * Mendapatkan tips berdasarkan Jilid dan Halaman.
 * Jika halaman spesifik belum didaftarkan, akan memberikan tips umum (fallback)
 * yang disesuaikan dengan tingkat kesulitan Jilid.
 */
export const BIBI_PAGE_TIPS = TITO_PAGE_TIPS;

export function getTitoTips(jilid: number, hal: number): TitoTip[] {
  const key = `${jilid}:${hal}`;

  // 1. Cek apakah ada tips spesifik untuk halaman ini
  if (BIBI_PAGE_TIPS[key]) {
    return BIBI_PAGE_TIPS[key];
  }

  // 2. Cek apakah ini halaman latihan (kelipatan 6 atau kelipatan 10)
  if (hal % 6 === 0 || hal % 10 === 0) {
    return [
      {
        mood: "excited",
        text: `Halaman ${hal} biasanya halaman latihan. Ayo uji kemampuanmu!`,
      },
      {
        mood: "thinking",
        text: "Ingat, baca pelan-pelan dan teliti. Kualitas lebih penting dari kecepatan.",
      },
    ];
  }

  // 3. Fallback berdasarkan Jilid (agar tips tetap relevan dengan kurikulum)
  switch (jilid) {
    case 1:
      return [
        {
          mood: "happy",
          text: `Selamat datang di halaman ${hal} Jilid 1! Yuk kita mulai belajar.`,
        },
        {
          mood: "thinking",
          text: "Fokus ke makhraj (tempat keluar huruf) dan bunyi pendek ya. Jangan dipanjangkan!",
        },
      ];
    case 2:
      return [
        {
          mood: "happy",
          text: `Halaman ${hal} Jilid 2. Semangat menyambung hurufnya!`,
        },
        {
          mood: "thinking",
          text: "Perhatikan harakatnya. Kasrah (i), Dhammah (u), Fathah (a).",
        },
      ];
    case 3:
      return [
        {
          mood: "happy",
          text: `Halaman ${hal} Jilid 3. Waktunya jago panjang-pendek!`,
        },
        {
          mood: "thinking",
          text: "Hitung madnya 2 ketukan. Jangan terlalu cepat atau lambat.",
        },
      ];
    case 4:
      return [
        {
          mood: "happy",
          text: `Halaman ${hal} Jilid 4. Dunia tajwid menantimu!`,
        },
        {
          mood: "thinking",
          text: "Perhatikan huruf nun dan mim mati. Apakah dibaca jelas, lebur, atau samar?",
        },
      ];
    case 5:
      return [
        {
          mood: "excited",
          text: `Halaman ${hal} Jilid 5. Level terakhir, kamu luar biasa!`,
        },
        {
          mood: "thinking",
          text: "Baca dengan tartil (tenang dan indah). Rasakan iramanya.",
        },
      ];
    default:
      return [
        {
          mood: "happy",
          text: `Halaman ${hal}. Selamat belajar dan berlatih!`,
        },
        {
          mood: "thinking",
          text: "Dengarkan audio dari ustadz, lalu tirukan. Kamu pasti bisa!",
        },
      ];
  }
}

export const getBibiTips = getTitoTips;
