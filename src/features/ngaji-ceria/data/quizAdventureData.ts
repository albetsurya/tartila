import type { QuestionData } from "../components/quiz-models/types";

// ============================================
// STANDARDIZED LEVEL DEFINITIONS
// ============================================
export const ADVENTURE_LEVEL_DEFINITIONS = [
  {
    level: 1,
    name: "Pemula",
    color: "#EA580C",
    bgColor: "#FFEDD5",
    borderColor: "#C2410C",
  },
  {
    level: 2,
    name: "Dasar",
    color: "#059669",
    bgColor: "#D1FAE5",
    borderColor: "#047857",
  },
  {
    level: 3,
    name: "Menengah",
    color: "#0284C7",
    bgColor: "#E0F2FE",
    borderColor: "#0369A1",
  },
  {
    level: 4,
    name: "Lanjutan",
    color: "#7C3AED",
    bgColor: "#EDE9FE",
    borderColor: "#6D28D9",
  },
  {
    level: 5,
    name: "Mahir",
    color: "#D97706",
    bgColor: "#FEF08A",
    borderColor: "#B45309",
  },
  {
    level: 6,
    name: "Juara",
    color: "#DC2626",
    bgColor: "#FEE2E2",
    borderColor: "#B91C1C",
  },
];

export interface QuizAdventureLevel {
  level: number;
  name?: string;
  questions: QuestionData[];
}

// ============================================
// LOCAL STORAGE UTILITIES
// ============================================
export const QUIZ_PROGRESS_STORAGE_KEY = "tartila_quiz_level_progress";

export function getCategoryUnlockedLevel(category: string): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(QUIZ_PROGRESS_STORAGE_KEY);
    if (!raw) return 1;
    const parsed = JSON.parse(raw);
    const lvl = Number(parsed[category]) || 1;
    return Math.max(1, Math.min(6, lvl));
  } catch {
    return 1;
  }
}

export function saveCategoryLevelCompleted(
  category: string,
  completedLevel: number,
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(QUIZ_PROGRESS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const currentMax = Number(parsed[category]) || 1;
    if (completedLevel >= currentMax && completedLevel < 6) {
      parsed[category] = completedLevel + 1;
      localStorage.setItem(QUIZ_PROGRESS_STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch {
    // ignore
  }
}

function buildLevels(questions: QuestionData[]): QuizAdventureLevel[] {
  const levels: QuizAdventureLevel[] = ADVENTURE_LEVEL_DEFINITIONS.map((def) => ({
    level: def.level,
    name: def.name,
    questions: [],
  }));
  questions.forEach((q, idx) => {
    levels[idx % 6].questions.push(q);
  });
  return levels;
}

// ============================================
// 1. MISI 5 WAKTU (Sholat)
// ============================================
export const MISI_5_WAKTU_QUESTIONS: QuestionData[] = [
  { id: "sholat-001", type: "multiple-choice-text", prompt: "Jumlah rakaat sholat Maghrib adalah?", options: ["3 Rakaat", "2 Rakaat", "4 Rakaat", "1 Rakaat"], correctAnswer: "3 Rakaat" },
  { id: "sholat-002", type: "multiple-choice-text", prompt: "Sholat fardhu yang dikerjakan sebelum terbit matahari adalah?", options: ["Sholat Subuh", "Sholat Dhuha", "Sholat Zhuhur", "Sholat Asar"], correctAnswer: "Sholat Subuh" },
  { id: "sholat-003", type: "multiple-choice-text", prompt: "Arah kiblat umat Islam saat sholat menghadap ke?", options: ["Ka'bah di Makkah", "Matahari terbit", "Bintang kutub", "Baitul Maqdis"], correctAnswer: "Ka'bah di Makkah" },
  { id: "sholat-004", type: "multiple-choice-text", prompt: "Takbir pembuka saat memulai sholat disebut?", options: ["Takbiratul Ihram", "Takbir Intiqal", "Tasbih", "Tahmid"], correctAnswer: "Takbiratul Ihram" },
  { id: "sholat-005", type: "multiple-choice-text", prompt: "Seruan yang menandakan masuknya waktu sholat adalah?", options: ["Adzan", "Iqamah", "Tarhim", "Zikir"], correctAnswer: "Adzan" },
  { id: "sholat-006", type: "multiple-choice-text", prompt: "Gerakan membungkuk dengan meletakkan tangan di lutut disebut?", options: ["Ruku'", "Sujud", "I'tidal", "Duduk iftirasy"], correctAnswer: "Ruku'" },
  { id: "sholat-007", type: "multiple-choice-text", prompt: "Surat wajib yang harus dibaca pada setiap rakaat sholat adalah?", options: ["Al-Fatihah", "Al-Ikhlas", "An-Naas", "Al-Falaq"], correctAnswer: "Al-Fatihah" },
  { id: "sholat-008", type: "multiple-choice-text", prompt: "Berapa kali kita sujud dalam satu rakaat sholat?", options: ["2 kali", "1 kali", "3 kali", "4 kali"], correctAnswer: "2 kali" },
  { id: "sholat-009", type: "multiple-choice-text", prompt: "Duduk di antara dua sujud disebut duduk?", options: ["Iftirasy", "Tawarruk", "Bersila", "Tawadhu'"], correctAnswer: "Iftirasy" },
  { id: "sholat-010", type: "multiple-choice-text", prompt: "Membaca Surat Al-Fatihah dalam sholat termasuk rukun apa?", options: ["Rukun Qauli (Ucapan)", "Rukun Fi'li (Gerakan)", "Sunnah Ab'adh", "Sunnah Hai'ah"], correctAnswer: "Rukun Qauli (Ucapan)" },
  { id: "sholat-011", type: "multiple-choice-text", prompt: "Pahala sholat berjamaah dilipatgandakan sebanyak berapa derajat?", options: ["27 Derajat", "10 Derajat", "50 Derajat", "70 Derajat"], correctAnswer: "27 Derajat" },
  { id: "sholat-012", type: "multiple-choice-text", prompt: "Makmum yang terlambat datang saat imam sudah memulai sholat disebut makmum?", options: ["Masbuq", "Muwafiq", "Munfarid", "Mukallaf"], correctAnswer: "Masbuq" },
  { id: "sholat-013", type: "multiple-choice-text", prompt: "Sholat Jumat diwajibkan bagi siapa?", options: ["Laki-laki muslim baligh", "Semua muslim tanpa kecuali", "Wanita musafir", "Anak kecil belum baligh"], correctAnswer: "Laki-laki muslim baligh" },
  { id: "sholat-014", type: "multiple-choice-text", prompt: "Mengumpulkan dua sholat fardhu dalam satu waktu disebut sholat?", options: ["Jamak", "Qashar", "Rawatib", "Tahajud"], correctAnswer: "Jamak" },
  { id: "sholat-015", type: "multiple-choice-text", prompt: "Sujud yang dilakukan karena lupa atau ragu bilangan rakaat disebut sujud?", options: ["Sahwi", "Tilawah", "Syukur", "Tahiyyat"], correctAnswer: "Sahwi" },
  { id: "sholat-016", type: "multiple-choice-text", prompt: "Sholat jenazah memiliki berapa kali takbir tanpa ruku' dan sujud?", options: ["4 Takbir", "3 Takbir", "5 Takbir", "2 Takbir"], correctAnswer: "4 Takbir" },
  { id: "sholat-017", type: "multiple-choice-text", prompt: "Ketenangan dan kekhusyukan gerakan dalam sholat disebut?", options: ["Thuma'ninah", "I'tidal", "Istiqamah", "Tadabbur"], correctAnswer: "Thuma'ninah" },
  { id: "sholat-018", type: "multiple-choice-text", prompt: "Sholat sunnah yang menyertai sholat fardhu sebelum atau sesudahnya disebut sholat?", options: ["Rawatib", "Dhuha", "Istikharah", "Hajat"], correctAnswer: "Rawatib" },
  { id: "sholat-019", type: "multiple-choice-text", prompt: "Sholat malam yang khusus dikerjakan di bulan Ramadan disebut sholat?", options: ["Tarawih", "Witir", "Tahajud", "Tasbih"], correctAnswer: "Tarawih" },
  { id: "sholat-020", type: "multiple-choice-text", prompt: "Meringkas rakaat sholat dari 4 menjadi 2 rakaat saat bepergian jauh disebut sholat?", options: ["Qashar", "Jamak", "Khauf", "Ghaib"], correctAnswer: "Qashar" },
  { id: "sholat-021", type: "multiple-choice-text", prompt: "Berapa rakaat sholat fardhu Zhuhur, Asar, dan Isya masing-masing?", options: ["4 Rakaat", "3 Rakaat", "2 Rakaat", "5 Rakaat"], correctAnswer: "4 Rakaat" },
  { id: "sholat-022", type: "multiple-choice-text", prompt: "Gerakan berdiri kembali setelah ruku' sebelum sujud dinamakan?", options: ["I'tidal", "Qiyam", "Tasyahud", "Thuma'ninah"], correctAnswer: "I'tidal" },
  { id: "sholat-023", type: "multiple-choice-text", prompt: "Sholat sunnah penutup rangkaian sholat malam yang berakaat ganjil adalah?", options: ["Witir", "Tarawih", "Hajat", "Istisqa"], correctAnswer: "Witir" },
  { id: "sholat-024", type: "multiple-choice-text", prompt: "Sholat sunnah yang dikerjakan pada pagi hari saat matahari mulai meninggi disebut sholat?", options: ["Dhuha", "Subuh", "Isyraq", "Awwabin"], correctAnswer: "Dhuha" },
];
export const MISI_5_WAKTU_LEVELS = buildLevels(MISI_5_WAKTU_QUESTIONS);

// ============================================
// 2. PETA IMAN (Aqidah & Rukun Iman)
// ============================================
export const PETA_IMAN_QUESTIONS: QuestionData[] = [
  { id: "iman-001", type: "multiple-choice-text", prompt: "Ada berapa jumlah Rukun Iman yang wajib diyakini setiap muslim?", options: ["6 Rukun", "5 Rukun", "4 Rukun", "7 Rukun"], correctAnswer: "6 Rukun" },
  { id: "iman-002", type: "multiple-choice-text", prompt: "Rukun Iman yang pertama adalah beriman kepada?", options: ["Allah SWT", "Malaikat-Nya", "Kitab-Kitab-Nya", "Hari Akhir"], correctAnswer: "Allah SWT" },
  { id: "iman-003", type: "multiple-choice-text", prompt: "Malaikat yang bertugas menyampaikan wahyu kepada para Nabi dan Rasul adalah?", options: ["Malaikat Jibril", "Malaikat Mikail", "Malaikat Israfil", "Malaikat Izrail"], correctAnswer: "Malaikat Jibril" },
  { id: "iman-004", type: "multiple-choice-text", prompt: "Malaikat yang bertugas meniup sangkakala tanda datangnya hari kiamat adalah?", options: ["Malaikat Israfil", "Malaikat Izrail", "Malaikat Malik", "Malaikat Ridwan"], correctAnswer: "Malaikat Israfil" },
  { id: "iman-005", type: "multiple-choice-text", prompt: "Kitab suci Zabur diturunkan Allah kepada Nabi siapa?", options: ["Nabi Daud AS", "Nabi Musa AS", "Nabi Isa AS", "Nabi Ibrahim AS"], correctAnswer: "Nabi Daud AS" },
  { id: "iman-006", type: "multiple-choice-text", prompt: "Kitab suci Taurat diturunkan Allah kepada Nabi siapa?", options: ["Nabi Musa AS", "Nabi Daud AS", "Nabi Isa AS", "Nabi Muhammad SAW"], correctAnswer: "Nabi Musa AS" },
  { id: "iman-007", type: "multiple-choice-text", prompt: "Kitab suci Injil diturunkan Allah kepada Nabi siapa?", options: ["Nabi Isa AS", "Nabi Musa AS", "Nabi Daud AS", "Nabi Nuh AS"], correctAnswer: "Nabi Isa AS" },
  { id: "iman-008", type: "multiple-choice-text", prompt: "Al-Quran adalah kitab suci penyempurna yang diturunkan kepada Nabi?", options: ["Nabi Muhammad SAW", "Nabi Isa AS", "Nabi Musa AS", "Nabi Ibrahim AS"], correctAnswer: "Nabi Muhammad SAW" },
  { id: "iman-009", type: "multiple-choice-text", prompt: "Nabi dan manusia pertama yang diciptakan Allah SWT adalah?", options: ["Nabi Adam AS", "Nabi Nuh AS", "Nabi Ibrahim AS", "Nabi Idris AS"], correctAnswer: "Nabi Adam AS" },
  { id: "iman-010", type: "multiple-choice-text", prompt: "Nabi terakhir penutup para nabi (Khatamun Nabiyyin) adalah Nabi?", options: ["Nabi Muhammad SAW", "Nabi Isa AS", "Nabi Musa AS", "Nabi Yahya AS"], correctAnswer: "Nabi Muhammad SAW" },
  { id: "iman-011", type: "multiple-choice-text", prompt: "Sifat wajib bagi Rasul 'Shiddiq' memiliki arti?", options: ["Jujur dan Benar", "Dapat Dipercaya", "Menyampaikan", "Cerdas"], correctAnswer: "Jujur dan Benar" },
  { id: "iman-012", type: "multiple-choice-text", prompt: "Sifat wajib bagi Rasul 'Amanah' memiliki arti?", options: ["Dapat Dipercaya", "Jujur", "Menyampaikan", "Cerdas"], correctAnswer: "Dapat Dipercaya" },
  { id: "iman-013", type: "multiple-choice-text", prompt: "Sifat wajib bagi Rasul 'Tabligh' memiliki arti?", options: ["Menyampaikan wahyu", "Menyembunyikan rahasia", "Cerdas dan bijak", "Pemberani"], correctAnswer: "Menyampaikan wahyu" },
  { id: "iman-014", type: "multiple-choice-text", prompt: "Sifat wajib bagi Rasul 'Fathonah' memiliki arti?", options: ["Cerdas dan bijaksana", "Dapat dipercaya", "Jujur", "Menyampaikan"], correctAnswer: "Cerdas dan bijaksana" },
  { id: "iman-015", type: "multiple-choice-text", prompt: "Malaikat yang bertugas membagikan rezeki dan mengatur hujan adalah?", options: ["Malaikat Mikail", "Malaikat Jibril", "Malaikat Izrail", "Malaikat Raqib"], correctAnswer: "Malaikat Mikail" },
  { id: "iman-016", type: "multiple-choice-text", prompt: "Malaikat yang bertugas mencabut nyawa seluruh makhluk hidup adalah?", options: ["Malaikat Izrail", "Malaikat Israfil", "Malaikat Munkar", "Malaikat Nakir"], correctAnswer: "Malaikat Izrail" },
  { id: "iman-017", type: "multiple-choice-text", prompt: "Malaikat yang bertugas mencatat amal baik manusia adalah?", options: ["Malaikat Raqib", "Malaikat Atid", "Malaikat Malik", "Malaikat Ridwan"], correctAnswer: "Malaikat Raqib" },
  { id: "iman-018", type: "multiple-choice-text", prompt: "Malaikat yang bertugas mencatat amal buruk manusia adalah?", options: ["Malaikat Atid", "Malaikat Raqib", "Malaikat Munkar", "Malaikat Nakir"], correctAnswer: "Malaikat Atid" },
  { id: "iman-019", type: "multiple-choice-text", prompt: "Malaikat yang bertugas menjaga pintu Surga adalah?", options: ["Malaikat Ridwan", "Malaikat Malik", "Malaikat Jibril", "Malaikat Mikail"], correctAnswer: "Malaikat Ridwan" },
  { id: "iman-020", type: "multiple-choice-text", prompt: "Malaikat yang bertugas menjaga pintu Neraka adalah?", options: ["Malaikat Malik", "Malaikat Ridwan", "Malaikat Munkar", "Malaikat Nakir"], correctAnswer: "Malaikat Malik" },
  { id: "iman-021", type: "multiple-choice-text", prompt: "Rukun Iman yang kelima adalah iman kepada?", options: ["Hari Akhir (Kiamat)", "Kitab-kitab Allah", "Para Rasul", "Qada dan Qadar"], correctAnswer: "Hari Akhir (Kiamat)" },
  { id: "iman-022", type: "multiple-choice-text", prompt: "Rukun Iman yang keenam adalah iman kepada?", options: ["Qada dan Qadar", "Malaikat Allah", "Hari Akhir", "Para Nabi"], correctAnswer: "Qada dan Qadar" },
  { id: "iman-023", type: "multiple-choice-text", prompt: "Malaikat diciptakan oleh Allah SWT dari?", options: ["Cahaya (Nur)", "Api", "Tanah", "Udara"], correctAnswer: "Cahaya (Nur)" },
  { id: "iman-024", type: "multiple-choice-text", prompt: "Nama tempat dikumpulkannya seluruh manusia setelah dibangkitkan dari kubur adalah?", options: ["Padang Mahsyar", "Jabal Rahmah", "Lembah Mina", "Bukit Shafa"], correctAnswer: "Padang Mahsyar" },
];
export const PETA_IMAN_LEVELS = buildLevels(PETA_IMAN_QUESTIONS);

// ============================================
// 3. AIR KEHIDUPAN (Thaharah & Wudu)
// ============================================
export const AIR_KEHIDUPAN_QUESTIONS: QuestionData[] = [
  { id: "wudu-001", type: "multiple-choice-text", prompt: "Thaharah menurut bahasa memiliki arti?", options: ["Bersuci dan bersih", "Beribadah", "Mandi biasa", "Menghafal doa"], correctAnswer: "Bersuci dan bersih" },
  { id: "wudu-002", type: "multiple-choice-text", prompt: "Air yang suci dan dapat mensucikan untuk berwudu disebut air?", options: ["Air Mutlak", "Air Musta'mal", "Air Mutanajis", "Air Musyammas"], correctAnswer: "Air Mutlak" },
  { id: "wudu-003", type: "multiple-choice-text", prompt: "Manakah di bawah ini yang termasuk jenis air mutlak?", options: ["Air hujan dan air sumur", "Air teh manis", "Air kopi hitam", "Air kelapa muda"], correctAnswer: "Air hujan dan air sumur" },
  { id: "wudu-004", type: "multiple-choice-text", prompt: "Membasuh tangan saat wudu harus sampai batas mana?", options: ["Sampai siku", "Sampai pergelangan tangan", "Sampai bahu", "Hanya jari-jari"], correctAnswer: "Sampai siku" },
  { id: "wudu-005", type: "multiple-choice-text", prompt: "Batas membasuh kaki saat wudu adalah sampai?", options: ["Mata kaki", "Betis", "Lutut", "Paha"], correctAnswer: "Mata kaki" },
  { id: "wudu-006", type: "multiple-choice-text", prompt: "Rukun wudu yang pertama kali adalah?", options: ["Niat bersamaan membasuh wajah", "Mencuci telapak tangan", "Berkumur-kumur", "Membasuh telinga"], correctAnswer: "Niat bersamaan membasuh wajah" },
  { id: "wudu-007", type: "multiple-choice-text", prompt: "Membersihkan hidung dengan memasukkan air ke lubang hidung disebut?", options: ["Istinsyaq", "Istinja", "Madhmadhoh", "Ghusl"], correctAnswer: "Istinsyaq" },
  { id: "wudu-008", type: "multiple-choice-text", prompt: "Berkumur-kumur membersihkan sisa makanan dalam wudu disebut?", options: ["Madhmadhoh", "Istinsyaq", "Istinja", "Tayamum"], correctAnswer: "Madhmadhoh" },
  { id: "wudu-009", type: "multiple-choice-text", prompt: "Berapa kali disunnahkan membasuh setiap anggota wudu?", options: ["3 kali", "1 kali", "5 kali", "7 kali"], correctAnswer: "3 kali" },
  { id: "wudu-010", type: "multiple-choice-text", prompt: "Membersihkan kotoran setelah buang air kecil atau besar disebut?", options: ["Istinja", "Istinsyaq", "Tayamum", "Thaharah"], correctAnswer: "Istinja" },
  { id: "wudu-011", type: "multiple-choice-text", prompt: "Bersuci sebagai pengganti wudu ketika tidak ada air atau sakit disebut?", options: ["Tayamum", "Mandi wajib", "Istinja", "Wudhu kering"], correctAnswer: "Tayamum" },
  { id: "wudu-012", type: "multiple-choice-text", prompt: "Media yang digunakan untuk bersuci saat tayamum adalah?", options: ["Debu yang suci", "Batu kapur", "Pasir basah", "Kain katun"], correctAnswer: "Debu yang suci" },
  { id: "wudu-013", type: "multiple-choice-text", prompt: "Anggota tubuh yang diusap saat tayamum hanya ada dua, yaitu?", options: ["Wajah dan kedua tangan", "Kepala dan kaki", "Tangan dan kaki", "Wajah dan telinga"], correctAnswer: "Wajah dan kedua tangan" },
  { id: "wudu-014", type: "multiple-choice-text", prompt: "Salah satu hal yang membatalkan wudu adalah?", options: ["Keluar angin (kentut)", "Makan nasi putih", "Minum segelas air", "Berbicara dengan teman"], correctAnswer: "Keluar angin (kentut)" },
  { id: "wudu-015", type: "multiple-choice-text", prompt: "Apakah tidur nyenyak dalam posisi berbaring membatalkan wudu?", options: ["Ya, membatalkan", "Tidak membatalkan", "Batal jika mimpi buruk", "Tergantung niat"], correctAnswer: "Ya, membatalkan" },
  { id: "wudu-016", type: "multiple-choice-text", prompt: "Membasuh anggota wudu secara berurutan sesuai syariat disebut?", options: ["Tertib", "Muwalat", "Khusyuk", "Thuma'ninah"], correctAnswer: "Tertib" },
  { id: "wudu-017", type: "multiple-choice-text", prompt: "Tidak menunda membasuh anggota berikutnya hingga anggota sebelumnya kering disebut?", options: ["Muwalat (Berkesinambungan)", "Tertib", "Istiqamah", "Qana'ah"], correctAnswer: "Muwalat (Berkesinambungan)" },
  { id: "wudu-018", type: "multiple-choice-text", prompt: "Hadas terbagi menjadi dua macam, yaitu hadas kecil dan hadas?", options: ["Hadas Besar", "Hadas Sedang", "Hadas Berat", "Hadas Ringan"], correctAnswer: "Hadas Besar" },
  { id: "wudu-019", type: "multiple-choice-text", prompt: "Cara mensucikan diri dari hadas besar adalah dengan melakukan?", options: ["Mandi Wajib (Janabah)", "Wudu biasa", "Tayamum", "Cuci muka saja"], correctAnswer: "Mandi Wajib (Janabah)" },
  { id: "wudu-020", type: "multiple-choice-text", prompt: "Najis yang paling ringan cara mensucikannya (Najis Mukhaffafah) contohnya air kencing?", options: ["Bayi laki-laki belum makan selain ASI", "Kucing peliharaan", "Ayam peliharaan", "Kambing dewasa"], correctAnswer: "Bayi laki-laki belum makan selain ASI" },
  { id: "wudu-021", type: "multiple-choice-text", prompt: "Najis berat (Mughallazhah) disucikan dengan mencucinya sebanyak 7 kali, salah satunya dicampur?", options: ["Tanah / Debu suci", "Sabun wangi", "Cuka makan", "Minyak wangi"], correctAnswer: "Tanah / Debu suci" },
  { id: "wudu-022", type: "multiple-choice-text", prompt: "Mendahulukan anggota tubuh sebelah mana saat membasuh tangan dan kaki dalam wudu?", options: ["Sebelah Kanan", "Sebelah Kiri", "Bebas mana saja", "Bersamaan keduanya"], correctAnswer: "Sebelah Kanan" },
  { id: "wudu-023", type: "multiple-choice-text", prompt: "Membasuh telinga bagian luar dan dalam saat berwudu hukumnya adalah?", options: ["Sunnah", "Wajib / Rukun", "Makruh", "Haram"], correctAnswer: "Sunnah" },
  { id: "wudu-024", type: "multiple-choice-text", prompt: "Bacaan doa sesudah wudu diawali dengan membaca dua kalimat?", options: ["Syahadat", "Takbir", "Istighfar", "Tasbih"], correctAnswer: "Syahadat" },
];
export const AIR_KEHIDUPAN_LEVELS = buildLevels(AIR_KEHIDUPAN_QUESTIONS);

// ============================================
// 4. TAMENG RAMADAN (Ibadah Puasa)
// ============================================
export const TAMENG_RAMADAN_QUESTIONS: QuestionData[] = [
  { id: "puasa-001", type: "multiple-choice-text", prompt: "Puasa Ramadan termasuk rukun Islam yang keberapa?", options: ["Rukun Islam ke-4", "Rukun Islam ke-3", "Rukun Islam ke-2", "Rukun Islam ke-5"], correctAnswer: "Rukun Islam ke-4" },
  { id: "puasa-002", type: "multiple-choice-text", prompt: "Puasa secara bahasa (shaum) memiliki arti?", options: ["Menahan diri", "Membersihkan diri", "Berdiam diri", "Makan sedikit"], correctAnswer: "Menahan diri" },
  { id: "puasa-003", type: "multiple-choice-text", prompt: "Waktu mulai berpuasa setiap harinya terhitung sejak?", options: ["Terbit fajar shodiq (Subuh)", "Matahari terbit", "Tengah malam", "Pukul 06.00 pagi"], correctAnswer: "Terbit fajar shodiq (Subuh)" },
  { id: "puasa-004", type: "multiple-choice-text", prompt: "Waktu berbuka puasa tiba saat matahari?", options: ["Terbenam (Waktu Maghrib)", "Tepat di atas kepala", "Mulai menguning", "Waktu Isya"], correctAnswer: "Terbenam (Waktu Maghrib)" },
  { id: "puasa-005", type: "multiple-choice-text", prompt: "Makan pada malam atau dini hari sebelum waktu subuh disebut makan?", options: ["Sahur", "Iftar", "Makan malam", "Takjil"], correctAnswer: "Sahur" },
  { id: "puasa-006", type: "multiple-choice-text", prompt: "Hukum berniat puasa Ramadan pada malam hari sebelum fajar adalah?", options: ["Wajib (Rukun puasa)", "Sunnah biasa", "Mubah", "Boleh ditinggalkan"], correctAnswer: "Wajib (Rukun puasa)" },
  { id: "puasa-007", type: "multiple-choice-text", prompt: "Makanan sunnah yang dianjurkan Nabi SAW saat pertama berbuka puasa adalah?", options: ["Kurma basah (ruthob) / manis", "Gorengan panas", "Air es kelapa", "Nasi padang"], correctAnswer: "Kurma basah (ruthob) / manis" },
  { id: "puasa-008", type: "multiple-choice-text", prompt: "Menyegerakan berbuka puasa saat mendengar adzan Maghrib hukumnya adalah?", options: ["Sunnah", "Wajib", "Makruh", "Haram"], correctAnswer: "Sunnah" },
  { id: "puasa-009", type: "multiple-choice-text", prompt: "Mengakhirkan waktu makan sahur mendekati waktu imsak hukumnya adalah?", options: ["Sunnah", "Makruh", "Wajib", "Haram"], correctAnswer: "Sunnah" },
  { id: "puasa-010", type: "multiple-choice-text", prompt: "Manakah di bawah ini hal yang membatalkan puasa?", options: ["Makan atau minum dengan sengaja", "Lupa lalu makan sepiring nasi", "Mandi di siang hari", "Tidur siang sebentar"], correctAnswer: "Makan atau minum dengan sengaja" },
  { id: "puasa-011", type: "multiple-choice-text", prompt: "Jika seseorang makan karena benar-benar lupa bahwa ia berpuasa, maka puasanya?", options: ["Tetap sah dan diteruskan", "Batal dan harus qadha", "Batal dan bayar fidyah", "Harus diulang dari awal"], correctAnswer: "Tetap sah dan diteruskan" },
  { id: "puasa-012", type: "multiple-choice-text", prompt: "Muntah dengan sengaja saat berpuasa hukumnya?", options: ["Membatalkan puasa", "Tidak membatalkan puasa", "Mengurangi pahala saja", "Sunnah"], correctAnswer: "Membatalkan puasa" },
  { id: "puasa-013", type: "multiple-choice-text", prompt: "Malam mulia di bulan Ramadan yang lebih baik dari seribu bulan adalah malam?", options: ["Lailatul Qadar", "Nuzulul Quran", "Isra Miraj", "Tahun Baru Islam"], correctAnswer: "Lailatul Qadar" },
  { id: "puasa-014", type: "multiple-choice-text", prompt: "Berdiam diri di masjid dengan niat beribadah kepada Allah disebut?", options: ["Iktikaf", "Tadarus", "Qiyamul Lail", "Tawaf"], correctAnswer: "Iktikaf" },
  { id: "puasa-015", type: "multiple-choice-text", prompt: "Membaca Al-Quran bersama-sama di bulan Ramadan disebut kegiatan?", options: ["Tadarus Al-Quran", "Tahsin", "Khataman", "Musabaqah"], correctAnswer: "Tadarus Al-Quran" },
  { id: "puasa-016", type: "multiple-choice-text", prompt: "Hari raya umat Islam setelah selesai menunaikan puasa sebulan penuh adalah?", options: ["Idul Fitri", "Idul Adha", "Tasyrik", "Maulid Nabi"], correctAnswer: "Idul Fitri" },
  { id: "puasa-017", type: "multiple-choice-text", prompt: "Berpuasa pada dua hari raya (Idul Fitri dan Idul Adha) hukumnya?", options: ["Haram", "Makruh", "Sunnah", "Mubah"], correctAnswer: "Haram" },
  { id: "puasa-018", type: "multiple-choice-text", prompt: "Hari Tasyrik (11, 12, 13 Dzulhijjah) berpuasa hukumnya adalah?", options: ["Haram", "Wajib", "Sunnah", "Boleh"], correctAnswer: "Haram" },
  { id: "puasa-019", type: "multiple-choice-text", prompt: "Mengganti puasa Ramadan yang tertinggal di hari lain di luar Ramadan disebut puasa?", options: ["Qadha", "Nazar", "Kifarat", "Tathawwu'"], correctAnswer: "Qadha" },
  { id: "puasa-020", type: "multiple-choice-text", prompt: "Orang tua renta yang tidak sanggup berpuasa menggantinya dengan membayar?", options: ["Fidyah", "Qadha", "Zakat Mal", "Sedekah sunnah"], correctAnswer: "Fidyah" },
  { id: "puasa-021", type: "multiple-choice-text", prompt: "Pintu khusus di Surga yang disediakan bagi orang-orang yang gemar berpuasa bernama pintu?", options: ["Ar-Rayyan", "Al-Firdaus", "Al-Kautsar", "An-Naim"], correctAnswer: "Ar-Rayyan" },
  { id: "puasa-022", type: "multiple-choice-text", prompt: "Puasa sunnah 6 hari yang sangat dianjurkan setelah Idul Fitri adalah puasa di bulan?", options: ["Bulan Syawal", "Bulan Zulqa'dah", "Bulan Muharram", "Bulan Rajab"], correctAnswer: "Bulan Syawal" },
  { id: "puasa-023", type: "multiple-choice-text", prompt: "Puasa sunnah pada hari Senin dan Kamis dinamakan puasa?", options: ["Senin-Kamis", "Daud", "Ayyamul Bidh", "Asyura"], correctAnswer: "Senin-Kamis" },
  { id: "puasa-024", type: "multiple-choice-text", prompt: "Puasa sunnah sehari puasa dan sehari berbuka dinamakan puasa Nabi?", options: ["Nabi Daud AS", "Nabi Musa AS", "Nabi Ibrahim AS", "Nabi Zakariya AS"], correctAnswer: "Nabi Daud AS" },
];
export const TAMENG_RAMADAN_LEVELS = buildLevels(TAMENG_RAMADAN_QUESTIONS);

// ============================================
// 5. MISI BERBAGI (Zakat & Sedekah)
// ============================================
export const MISI_BERBAGI_QUESTIONS: QuestionData[] = [
  { id: "zakat-001", type: "multiple-choice-text", prompt: "Zakat termasuk ke dalam Rukun Islam yang keberapa?", options: ["Rukun Islam ke-3", "Rukun Islam ke-2", "Rukun Islam ke-4", "Rukun Islam ke-5"], correctAnswer: "Rukun Islam ke-3" },
  { id: "zakat-002", type: "multiple-choice-text", prompt: "Kata 'Zakat' secara bahasa memiliki arti?", options: ["Tumbuh, berkembang, dan membersihkan", "Menahan dan menghemat", "Membagi sama rata", "Menabung harta"], correctAnswer: "Tumbuh, berkembang, dan membersihkan" },
  { id: "zakat-003", type: "multiple-choice-text", prompt: "Zakat jiwa yang wajib dikeluarkan setiap muslim di akhir bulan Ramadan disebut zakat?", options: ["Zakat Fitrah", "Zakat Mal", "Zakat Perniagaan", "Zakat Emas"], correctAnswer: "Zakat Fitrah" },
  { id: "zakat-004", type: "multiple-choice-text", prompt: "Batas akhir pembayaran zakat fitrah agar sah sebagai zakat adalah sebelum?", options: ["Sholat Idul Fitri dimulai", "Terbenam matahari Idul Fitri", "Malam takbiran", "Adzan Maghrib akhir Ramadan"], correctAnswer: "Sholat Idul Fitri dimulai" },
  { id: "zakat-005", type: "multiple-choice-text", prompt: "Bahan yang dikeluarkan untuk zakat fitrah di Indonesia umumnya berupa makanan pokok, yaitu?", options: ["Beras / Gandum", "Uang kertas saja", "Pakaian muslim", "Buah kurma"], correctAnswer: "Beras / Gandum" },
  { id: "zakat-006", type: "multiple-choice-text", prompt: "Ukuran standar zakat fitrah per jiwa dalam beras adalah sekitar?", options: ["2,5 kg atau 3,5 liter", "1 kg atau 1 liter", "5 kg atau 7 liter", "10 kg"], correctAnswer: "2,5 kg atau 3,5 liter" },
  { id: "zakat-007", type: "multiple-choice-text", prompt: "Zakat atas harta benda yang telah mencapai batas tertentu disebut zakat?", options: ["Zakat Mal", "Zakat Fitrah", "Zakat Jiwa", "Zakat Badan"], correctAnswer: "Zakat Mal" },
  { id: "zakat-008", type: "multiple-choice-text", prompt: "Batas minimal kepemilikan harta yang terkena kewajiban zakat disebut?", options: ["Nisab", "Haul", "Kadar", "Kifarat"], correctAnswer: "Nisab" },
  { id: "zakat-009", type: "multiple-choice-text", prompt: "Masa kepemilikan harta selama satu tahun penuh dalam zakat disebut?", options: ["Haul", "Nisab", "Rikaz", "Tamlik"], correctAnswer: "Haul" },
  { id: "zakat-010", type: "multiple-choice-text", prompt: "Berapa persentase kadar zakat mal untuk simpanan emas dan uang perak?", options: ["2,5%", "5%", "10%", "20%"], correctAnswer: "2,5%" },
  { id: "zakat-011", type: "multiple-choice-text", prompt: "Ada berapa golongan (asnaf) orang yang berhak menerima zakat menurut Surat At-Taubah?", options: ["8 Golongan", "6 Golongan", "5 Golongan", "10 Golongan"], correctAnswer: "8 Golongan" },
  { id: "zakat-012", type: "multiple-choice-text", prompt: "Orang yang mengurus dan mengumpulkan zakat disebut?", options: ["Amil", "Muzakki", "Mustahik", "Muallaf"], correctAnswer: "Amil" },
  { id: "zakat-013", type: "multiple-choice-text", prompt: "Orang yang baru masuk Islam dan hatinya perlu dieratkan disebut?", options: ["Muallaf", "Gharim", "Ibnu Sabil", "Fakir"], correctAnswer: "Muallaf" },
  { id: "zakat-014", type: "multiple-choice-text", prompt: "Orang yang memiliki banyak hutang untuk kebutuhan halal dan tidak mampu membayar disebut?", options: ["Gharim", "Riqab", "Amil", "Fisabilillah"], correctAnswer: "Gharim" },
  { id: "zakat-015", type: "multiple-choice-text", prompt: "Musafir yang kehabisan bekal dalam perjalanan ketaatan kepada Allah disebut?", options: ["Ibnu Sabil", "Fisabilillah", "Muallaf", "Amil"], correctAnswer: "Ibnu Sabil" },
  { id: "zakat-016", type: "multiple-choice-text", prompt: "Orang yang mengeluarkan zakat dinamakan?", options: ["Muzakki", "Mustahik", "Munfaqir", "Muhsin"], correctAnswer: "Muzakki" },
  { id: "zakat-017", type: "multiple-choice-text", prompt: "Orang yang berhak menerima zakat dinamakan?", options: ["Mustahik", "Muzakki", "Amilin", "Mukallaf"], correctAnswer: "Mustahik" },
  { id: "zakat-018", type: "multiple-choice-text", prompt: "Pemberian sukarela tanpa ada ketentuan nisab dan waktu disebut?", options: ["Sedekah dan Infak", "Zakat Mal", "Zakat Fitrah", "Fidyah"], correctAnswer: "Sedekah dan Infak" },
  { id: "zakat-019", type: "multiple-choice-text", prompt: "Senyum ramah kepada saudaramu bernilai sebagai amalan apa di sisi Allah?", options: ["Sedekah", "Zakat", "Kifarat", "Nazar"], correctAnswer: "Sedekah" },
  { id: "zakat-020", type: "multiple-choice-text", prompt: "Sedekah yang pahalanya terus mengalir meski orangnya sudah meninggal dunia disebut sedekah?", options: ["Jariyah (Wakaf)", "Wajib", "Kifarat", "Sirri"], correctAnswer: "Jariyah (Wakaf)" },
  { id: "zakat-021", type: "multiple-choice-text", prompt: "Menyingkirkan batu atau duri dari jalan termasuk bagian dari sedekah dan cabang dari?", options: ["Iman", "Zakat", "Haji", "Thaharah"], correctAnswer: "Iman" },
  { id: "zakat-022", type: "multiple-choice-text", prompt: "Mengungkit-ungkit sedekah dan menyakiti hati penerimanya dapat berakibat?", options: ["Menghapus pahala sedekah", "Menambah pahala ganda", "Diberi hadiah surga", "Tidak ada pengaruhnya"], correctAnswer: "Menghapus pahala sedekah" },
  { id: "zakat-023", type: "multiple-choice-text", prompt: "Memberikan sedekah secara sembunyi-sembunyi lebih utama untuk menghindari sifat?", options: ["Riya' (Pamer)", "Tawadhu'", "Qana'ah", "Zuhud"], correctAnswer: "Riya' (Pamer)" },
  { id: "zakat-024", type: "multiple-choice-text", prompt: "Tangan di atas lebih baik daripada tangan di bawah, maksudnya orang yang memberi lebih baik dari yang?", options: ["Menerima / Meminta", "Bekerja", "Menabung", "Membeli"], correctAnswer: "Menerima / Meminta" },
];
export const MISI_BERBAGI_LEVELS = buildLevels(MISI_BERBAGI_QUESTIONS);

// ============================================
// 6. PANDUAN KSATRIA (Fikih & Adab Harian)
// ============================================
export const PANDUAN_KSATRIA_QUESTIONS: QuestionData[] = [
  { id: "adab-001", type: "multiple-choice-text", prompt: "Sebelum mulai makan dan minum, kita disunnahkan membaca?", options: ["Bismillah", "Alhamdulillah", "Astaghfirullah", "Allahu Akbar"], correctAnswer: "Bismillah" },
  { id: "adab-002", type: "multiple-choice-text", prompt: "Rasulullah SAW mengajarkan kita untuk makan dan minum menggunakan tangan?", options: ["Tangan Kanan", "Tangan Kiri", "Kedua tangan bersamaan", "Bebas mana saja"], correctAnswer: "Tangan Kanan" },
  { id: "adab-003", type: "multiple-choice-text", prompt: "Setelah selesai makan dan minum, ucapan rasa syukur yang kita panjatkan adalah?", options: ["Alhamdulillah", "Subhanallah", "Laa ilaaha illallah", "Bismillah"], correctAnswer: "Alhamdulillah" },
  { id: "adab-004", type: "multiple-choice-text", prompt: "Bolehkah meniup makanan atau minuman yang masih sangat panas menurut adab Islam?", options: ["Tidak dianjurkan / Makruh", "Boleh sekali", "Wajib ditiup", "Disunnahkan"], correctAnswer: "Tidak dianjurkan / Makruh" },
  { id: "adab-005", type: "multiple-choice-text", prompt: "Saat masuk ke kamar mandi / toilet, kita mendahulukan melangkah dengan kaki?", options: ["Kaki Kiri", "Kaki Kanan", "Kedua kaki melompat", "Kaki mana saja"], correctAnswer: "Kaki Kiri" },
  { id: "adab-006", type: "multiple-choice-text", prompt: "Saat keluar dari kamar mandi / toilet, kita melangkah dengan kaki?", options: ["Kaki Kanan", "Kaki Kiri", "Kaki mana saja", "Berlari"], correctAnswer: "Kaki Kanan" },
  { id: "adab-007", type: "multiple-choice-text", prompt: "Adab saat buang air adalah tidak boleh menghadap atau membelakangi arah?", options: ["Kiblat", "Matahari", "Pintu kamar mandi", "Dinding"], correctAnswer: "Kiblat" },
  { id: "adab-008", type: "multiple-choice-text", prompt: "Sebelum tidur, Rasulullah SAW menganjurkan kita untuk bersuci dengan cara?", options: ["Berwudu", "Mandi keramas", "Mencuci rambut saja", "Tidak perlu bersuci"], correctAnswer: "Berwudu" },
  { id: "adab-009", type: "multiple-choice-text", prompt: "Posisi tidur terbaik yang dicontohkan Rasulullah SAW adalah berbaring miring ke arah?", options: ["Miring ke Kanan", "Miring ke Kiri", "Tengkurap", "Terlentang terus"], correctAnswer: "Miring ke Kanan" },
  { id: "adab-010", type: "multiple-choice-text", prompt: "Tidur dengan posisi tengkurap hukumnya dalam Islam adalah?", options: ["Makruh / Dibenci Allah", "Disunnahkan", "Wajib", "Mendapat pahala"], correctAnswer: "Makruh / Dibenci Allah" },
  { id: "adab-011", type: "multiple-choice-text", prompt: "Salam lengkap yang diucapkan saat bertemu sesama muslim adalah?", options: ["Assalamu'alaikum Warahmatullahi Wabarakatuh", "Selamat pagi kawan", "Halo apa kabar", "Sampai jumpa lagi"], correctAnswer: "Assalamu'alaikum Warahmatullahi Wabarakatuh" },
  { id: "adab-012", type: "multiple-choice-text", prompt: "Menjawab salam sesama muslim hukumnya adalah?", options: ["Wajib", "Sunnah", "Mubah", "Makruh"], correctAnswer: "Wajib" },
  { id: "adab-013", type: "multiple-choice-text", prompt: "Saat masuk ke dalam masjid, kaki manakah yang didahulukan melangkah?", options: ["Kaki Kanan", "Kaki Kiri", "Bebas", "Kaki kiri dulu baru kanan"], correctAnswer: "Kaki Kanan" },
  { id: "adab-014", type: "multiple-choice-text", prompt: "Sholat sunnah 2 rakaat untuk menghormati masjid sebelum duduk disebut sholat?", options: ["Tahiyyatul Masjid", "Rawatib", "Hajat", "Istikharah"], correctAnswer: "Tahiyyatul Masjid" },
  { id: "adab-015", type: "multiple-choice-text", prompt: "Saat keluar dari masjid, kaki yang didahulukan melangkah adalah?", options: ["Kaki Kiri", "Kaki Kanan", "Kaki mana saja", "Mundur pelan-pelan"], correctAnswer: "Kaki Kiri" },
  { id: "adab-016", type: "multiple-choice-text", prompt: "Berbakti kepada kedua orang tua dalam istilah agama Islam dinamakan?", options: ["Birrul Walidain", "Uququl Walidain", "Silaturahim", "Muamalah"], correctAnswer: "Birrul Walidain" },
  { id: "adab-017", type: "multiple-choice-text", prompt: "Apakah kita boleh membentak atau berkata 'Ah/Cis' kepada kedua orang tua?", options: ["Sangat dilarang / Haram", "Boleh jika kesal", "Boleh jika lelah", "Tidak berdosa"], correctAnswer: "Sangat dilarang / Haram" },
  { id: "adab-018", type: "multiple-choice-text", prompt: "Orang yang pertama kali berhak mendapatkan bakti dan penghormatan terbesar kita adalah?", options: ["Ibu", "Ayah", "Paman", "Sahabat"], correctAnswer: "Ibu" },
  { id: "adab-019", type: "multiple-choice-text", prompt: "Ketika bersin, seorang muslim dianjurkan membaca kalimat?", options: ["Alhamdulillah", "Yarhamukallah", "Astaghfirullah", "Bismillah"], correctAnswer: "Alhamdulillah" },
  { id: "adab-020", type: "multiple-choice-text", prompt: "Orang yang mendengar saudaranya bersin dan memuji Allah, mendoakannya dengan membaca?", options: ["Yarhamukallah", "Alhamdulillah", "Yahdikumullah", "Jazakallah"], correctAnswer: "Yarhamukallah" },
  { id: "adab-021", type: "multiple-choice-text", prompt: "Membicarakan aib atau keburukan orang lain di belakangnya disebut perbuatan?", options: ["Ghibah", "Namimah", "Bohong", "Hasad"], correctAnswer: "Ghibah" },
  { id: "adab-022", type: "multiple-choice-text", prompt: "Mengadu domba agar dua orang atau kelompok bermusuhan disebut perbuatan?", options: ["Namimah", "Ghibah", "Riya'", "Ujub"], correctAnswer: "Namimah" },
  { id: "adab-023", type: "multiple-choice-text", prompt: "Rasulullah SAW bersabda: 'Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau...?'", options: ["Diam", "Tidur", "Berlari", "Pergi"], correctAnswer: "Diam" },
  { id: "adab-024", type: "multiple-choice-text", prompt: "Saat bertamu ke rumah orang lain, maksimal mengetuk pintu dan memberi salam sebanyak?", options: ["3 kali", "1 kali", "5 kali", "Bebas sampai dibuka"], correctAnswer: "3 kali" },
];
export const PANDUAN_KSATRIA_LEVELS = buildLevels(PANDUAN_KSATRIA_QUESTIONS);

// ============================================
// 7. LORONG WAKTU (Sejarah & Sirah)
// ============================================
export const LORONG_WAKTU_QUESTIONS: QuestionData[] = [
  { id: "sirah-001", type: "multiple-choice-text", prompt: "Nabi Muhammad SAW dilahirkan di kota suci?", options: ["Kota Makkah", "Kota Madinah", "Kota Yerusalem", "Kota Thaif"], correctAnswer: "Kota Makkah" },
  { id: "sirah-002", type: "multiple-choice-text", prompt: "Nabi Muhammad SAW lahir pada tanggal 12 Rabiul Awwal tahun?", options: ["Tahun Gajah", "Tahun Kuda", "Tahun Unta", "Tahun Hijrah"], correctAnswer: "Tahun Gajah" },
  { id: "sirah-003", type: "multiple-choice-text", prompt: "Nama ayah dari Nabi Muhammad SAW adalah?", options: ["Abdullah", "Abdul Muthalib", "Abu Thalib", "Hamzah"], correctAnswer: "Abdullah" },
  { id: "sirah-004", type: "multiple-choice-text", prompt: "Nama ibunda dari Nabi Muhammad SAW adalah?", options: ["Aminah", "Khadijah", "Fatimah", "Aisyah"], correctAnswer: "Aminah" },
  { id: "sirah-005", type: "multiple-choice-text", prompt: "Kakek Nabi Muhammad SAW yang merawat beliau saat kecil bernama?", options: ["Abdul Muthalib", "Abu Thalib", "Abbas", "Abu Lahab"], correctAnswer: "Abdul Muthalib" },
  { id: "sirah-006", type: "multiple-choice-text", prompt: "Gelar mulia yang diberikan penduduk Makkah kepada Nabi Muhammad SAW karena kejujurannya adalah?", options: ["Al-Amin (Dapat Dipercaya)", "Al-Faruq", "As-Shiddiq", "Dzulnurain"], correctAnswer: "Al-Amin (Dapat Dipercaya)" },
  { id: "sirah-007", type: "multiple-choice-text", prompt: "Di gua manakah Nabi Muhammad SAW pertama kali menerima wahyu Al-Quran?", options: ["Gua Hira", "Gua Tsur", "Gua Uhud", "Gua Kahfi"], correctAnswer: "Gua Hira" },
  { id: "sirah-008", type: "multiple-choice-text", prompt: "Surat dalam Al-Quran yang pertama kali diturunkan kepada Nabi Muhammad SAW adalah surat?", options: ["Al-'Alaq ayat 1-5", "Al-Fatihah", "Al-Baqarah", "Al-Muddassir"], correctAnswer: "Al-'Alaq ayat 1-5" },
  { id: "sirah-009", type: "multiple-choice-text", prompt: "Wanita pertama dan orang pertama yang beriman kepada dakwah Nabi Muhammad SAW adalah?", options: ["Khadijah binti Khuwailid", "Aisyah binti Abu Bakar", "Fatimah Az-Zahra", "Halimah As-Sa'diyah"], correctAnswer: "Khadijah binti Khuwailid" },
  { id: "sirah-010", type: "multiple-choice-text", prompt: "Laki-laki dewasa pertama dari kalangan sahabat yang memeluk Islam adalah?", options: ["Abu Bakar Ash-Shiddiq", "Umar bin Khattab", "Utsman bin Affan", "Ali bin Abi Thalib"], correctAnswer: "Abu Bakar Ash-Shiddiq" },
  { id: "sirah-011", type: "multiple-choice-text", prompt: "Anak-anak pertama dari kalangan kerabat yang memeluk Islam adalah?", options: ["Ali bin Abi Thalib", "Zaid bin Haritsah", "Usamah bin Zaid", "Hasan bin Ali"], correctAnswer: "Ali bin Abi Thalib" },
  { id: "sirah-012", type: "multiple-choice-text", prompt: "Peristiwa perjalanan malam Nabi dari Masjidil Haram ke Masjidil Aqsa lalu ke langit disebut?", options: ["Isra Mi'raj", "Hijrah", "Fathu Makkah", "Baitur Ridhwan"], correctAnswer: "Isra Mi'raj" },
  { id: "sirah-013", type: "multiple-choice-text", prompt: "Perintah ibadah utama yang diterima langsung oleh Nabi Muhammad SAW dalam peristiwa Isra Mi'raj adalah?", options: ["Sholat 5 Waktu", "Puasa Ramadan", "Zakat Mal", "Ibadah Haji"], correctAnswer: "Sholat 5 Waktu" },
  { id: "sirah-014", type: "multiple-choice-text", prompt: "Nama gua tempat Nabi Muhammad SAW dan Abu Bakar bersembunyi saat hijrah ke Madinah adalah?", options: ["Gua Tsur", "Gua Hira", "Gua Uhud", "Gua Salman"], correctAnswer: "Gua Tsur" },
  { id: "sirah-015", type: "multiple-choice-text", prompt: "Masjid pertama yang dibangun oleh Rasulullah SAW saat perjalanan hijrah adalah masjid?", options: ["Masjid Quba", "Masjid Nabawi", "Masjidil Aqsa", "Masjid Qiblatain"], correctAnswer: "Masjid Quba" },
  { id: "sirah-016", type: "multiple-choice-text", prompt: "Sahabat Nabi asal Habasyah yang memiliki suara merdu dan menjadi muadzin pertama Islam adalah?", options: ["Bilal bin Rabah", "Salman Al-Farisi", "Abu Hurairah", "Abdullah bin Mas'ud"], correctAnswer: "Bilal bin Rabah" },
  { id: "sirah-017", type: "multiple-choice-text", prompt: "Perang besar pertama antara kaum muslimin dan kaum kafir Quraisy yang terjadi di bulan Ramadan adalah Perang?", options: ["Perang Badar", "Perang Uhud", "Perang Khandaq", "Perang Hunain"], correctAnswer: "Perang Badar" },
  { id: "sirah-018", type: "multiple-choice-text", prompt: "Sahabat yang mengusulkan pembuatan parit besar dalam Perang Khandaq adalah?", options: ["Salman Al-Farisi", "Khalid bin Walid", "Umar bin Khattab", "Hamzah bin Abdul Muthalib"], correctAnswer: "Salman Al-Farisi" },
  { id: "sirah-019", type: "multiple-choice-text", prompt: "Peristiwa pembebasan kota Makkah secara damai tanpa pertumpahan darah disebut peristiwa?", options: ["Fathu Makkah", "Perjanjian Hudaibiyah", "Haji Wada'", "Piagam Madinah"], correctAnswer: "Fathu Makkah" },
  { id: "sirah-020", type: "multiple-choice-text", prompt: "Haji terakhir yang dilaksanakan oleh Rasulullah SAW bersama para sahabat dinamakan haji?", options: ["Haji Wada' (Perpisahan)", "Haji Ifrad", "Haji Tamattu'", "Haji Qiran"], correctAnswer: "Haji Wada' (Perpisahan)" },
  { id: "sirah-021", type: "multiple-choice-text", prompt: "Khalifah pertama pengganti kepemimpinan umat Islam setelah wafatnya Rasulullah SAW adalah?", options: ["Abu Bakar Ash-Shiddiq", "Umar bin Khattab", "Utsman bin Affan", "Ali bin Abi Thalib"], correctAnswer: "Abu Bakar Ash-Shiddiq" },
  { id: "sirah-022", type: "multiple-choice-text", prompt: "Sahabat yang mendapat julukan 'Al-Faruq' (Pembeda antara yang hak dan batil) adalah?", options: ["Umar bin Khattab", "Abu Bakar Ash-Shiddiq", "Utsman bin Affan", "Ali bin Abi Thalib"], correctAnswer: "Umar bin Khattab" },
  { id: "sirah-023", type: "multiple-choice-text", prompt: "Khalifah yang memprakarsai pembukuan dan standarisasi Mushaf Al-Quran (Mushaf Utsmani) adalah?", options: ["Utsman bin Affan", "Abu Bakar Ash-Shiddiq", "Umar bin Khattab", "Ali bin Abi Thalib"], correctAnswer: "Utsman bin Affan" },
  { id: "sirah-024", type: "multiple-choice-text", prompt: "Sahabat nabi yang bergelar 'Babul Ilmi' (Pintu Gerbang Ilmu) dan menjadi khalifah keempat adalah?", options: ["Ali bin Abi Thalib", "Muawiyah bin Abu Sufyan", "Utsman bin Affan", "Zaid bin Tsabit"], correctAnswer: "Ali bin Abi Thalib" },
];
export const LORONG_WAKTU_LEVELS = buildLevels(LORONG_WAKTU_QUESTIONS);

// ============================================
// 8. PUNCAK ARAFAH (Haji & Umrah)
// ============================================
export const PUNCAK_ARAFAH_QUESTIONS: QuestionData[] = [
  { id: "haji-001", type: "multiple-choice-text", prompt: "Ibadah Haji merupakan rukun Islam yang keberapa?", options: ["Rukun Islam ke-5", "Rukun Islam ke-4", "Rukun Islam ke-3", "Rukun Islam ke-2"], correctAnswer: "Rukun Islam ke-5" },
  { id: "haji-002", type: "multiple-choice-text", prompt: "Ibadah Haji wajib dikerjakan oleh orang yang mampu (istitha'ah) sebanyak berapa kali seumur hidup?", options: ["1 Kali", "2 Kali", "3 Kali", "Setiap tahun"], correctAnswer: "1 Kali" },
  { id: "haji-003", type: "multiple-choice-text", prompt: "Ibadah Haji hanya dapat dilaksanakan pada bulan hijriyah tertentu, yaitu bulan?", options: ["Dzulhijjah", "Ramadan", "Syawal", "Muharram"], correctAnswer: "Dzulhijjah" },
  { id: "haji-004", type: "multiple-choice-text", prompt: "Memulai niat ibadah haji atau umrah dengan mengenakan pakaian khusus disebut?", options: ["Ihram", "Tawaf", "Tahallul", "Sa'i"], correctAnswer: "Ihram" },
  { id: "haji-005", type: "multiple-choice-text", prompt: "Batas tempat dan waktu untuk memulai niat ihram dinamakan?", options: ["Miqat", "Arafah", "Mina", "Muzdalifah"], correctAnswer: "Miqat" },
  { id: "haji-006", type: "multiple-choice-text", prompt: "Pakaian ihram untuk laki-laki terdiri dari berapa helai kain putih tanpa jahitan?", options: ["2 helai kain", "1 helai kain", "3 helai kain", "4 helai kain"], correctAnswer: "2 helai kain" },
  { id: "haji-007", type: "multiple-choice-text", prompt: "Kalimat seruan yang sering dibaca oleh jamaah haji dan umrah dinamakan kalimat?", options: ["Talbiyah (Labbaikallahumma labbaik)", "Tahlil", "Takbiratul Ihram", "Tahmid"], correctAnswer: "Talbiyah (Labbaikallahumma labbaik)" },
  { id: "haji-008", type: "multiple-choice-text", prompt: "Mengelilingi Ka'bah sebanyak 7 kali putaran berlawanan arah jarum jam disebut?", options: ["Tawaf", "Sa'i", "Wukuf", "Mabit"], correctAnswer: "Tawaf" },
  { id: "haji-009", type: "multiple-choice-text", prompt: "Putaran tawaf dimulai dan diakhiri sejajar dengan tanda batu hitam yang bernama?", options: ["Hajar Aswad", "Maqam Ibrahim", "Hijir Ismail", "Rukun Yamani"], correctAnswer: "Hajar Aswad" },
  { id: "haji-010", type: "multiple-choice-text", prompt: "Berlari-lari kecil / berjalan bolak-balik antara bukit Shafa dan bukit Marwah sebanyak 7 kali disebut?", options: ["Sa'i", "Tawaf", "Tahallul", "Wukuf"], correctAnswer: "Sa'i" },
  { id: "haji-011", type: "multiple-choice-text", prompt: "Ibadah sa'i mengenang perjuangan siapa saat mencari air untuk putranya Nabi Ismail AS?", options: ["Siti Hajar", "Siti Sarah", "Siti Maryam", "Siti Khadijah"], correctAnswer: "Siti Hajar" },
  { id: "haji-012", type: "multiple-choice-text", prompt: "Air mukjizat yang memancar di dekat Ka'bah dan tidak pernah kering hingga kini bernama air?", options: ["Air Zamzam", "Air Kautsar", "Air Tasnim", "Air Ma'in"], correctAnswer: "Air Zamzam" },
  { id: "haji-013", type: "multiple-choice-text", prompt: "Puncak ibadah haji adalah berdiam diri dan berdoa di Padang Arafah pada tanggal 9 Dzulhijjah yang disebut?", options: ["Wukuf", "Tawaf", "Mabit", "Melontar Jumrah"], correctAnswer: "Wukuf" },
  { id: "haji-014", type: "multiple-choice-text", prompt: "Rasulullah SAW bersabda: 'Al-Hajju Arafah', yang artinya inti ibadah haji adalah?", options: ["Wukuf di Padang Arafah", "Tawaf di Ka'bah", "Mabit di Mina", "Melontar Jumrah"], correctAnswer: "Wukuf di Padang Arafah" },
  { id: "haji-015", type: "multiple-choice-text", prompt: "Bermalam atau singgah mengumpulkan kerikil di Muzdalifah setelah wukuf disebut?", options: ["Mabit di Muzdalifah", "Sa'i", "Tahallul", "Wukuf kedua"], correctAnswer: "Mabit di Muzdalifah" },
  { id: "haji-016", type: "multiple-choice-text", prompt: "Melemparkan batu kerikil ke tiang tugu di Mina dinamakan melontar?", options: ["Jumrah", "Hajar", "Batu Ka'bah", "Kerikil Shafa"], correctAnswer: "Jumrah" },
  { id: "haji-017", type: "multiple-choice-text", prompt: "Tiga tugu jumrah di Mina bernama Ula, Wustha, dan jumrah?", options: ["Aqabah", "Kubra", "Arafah", "Marwah"], correctAnswer: "Aqabah" },
  { id: "haji-018", type: "multiple-choice-text", prompt: "Mencukur atau memotong sebagian rambut kepala tanda selesainya larangan ihram disebut?", options: ["Tahallul", "Tawaf", "Sa'i", "Tamattu'"], correctAnswer: "Tahallul" },
  { id: "haji-019", type: "multiple-choice-text", prompt: "Apakah perbedaan mendasar antara ibadah Haji dan ibadah Umrah?", options: ["Umrah tidak ada wukuf di Arafah", "Umrah tidak ada tawaf", "Umrah tidak memakai pakaian ihram", "Umrah tidak ada sa'i"], correctAnswer: "Umrah tidak ada wukuf di Arafah" },
  { id: "haji-020", type: "multiple-choice-text", prompt: "Apakah ibadah Umrah terikat oleh waktu bulan tertentu atau bisa dikerjakan kapan saja sepanjang tahun?", options: ["Bisa dikerjakan kapan saja", "Hanya di bulan Dzulhijjah", "Hanya di bulan Ramadan", "Hanya di bulan Rajab"], correctAnswer: "Bisa dikerjakan kapan saja" },
  { id: "haji-021", type: "multiple-choice-text", prompt: "Tawaf perpisahan yang dilakukan sebelum jamaah haji meninggalkan kota Makkah disebut Tawaf?", options: ["Wada'", "Qudum", "Ifadhah", "Sunnah"], correctAnswer: "Wada'" },
  { id: "haji-022", type: "multiple-choice-text", prompt: "Haji yang mabrur dan diterima oleh Allah SWT tidak ada balasan baginya selain?", options: ["Surga", "Kekayaan dunia", "Pujian manusia", "Pangkat tinggi"], correctAnswer: "Surga" },
  { id: "haji-023", type: "multiple-choice-text", prompt: "Tawaf yang termasuk ke dalam rukun utama haji dan wajib dilakukan adalah Tawaf?", options: ["Ifadhah", "Qudum", "Wada'", "Nazar"], correctAnswer: "Ifadhah" },
  { id: "haji-024", type: "multiple-choice-text", prompt: "Tempat makam Nabi Muhammad SAW yang sering diziarahi jamaah haji terletak di kota?", options: ["Kota Madinah (Masjid Nabawi)", "Kota Makkah", "Kota Jeddah", "Kota Thaif"], correctAnswer: "Kota Madinah (Masjid Nabawi)" },
];
export const PUNCAK_ARAFAH_LEVELS = buildLevels(PUNCAK_ARAFAH_QUESTIONS);
