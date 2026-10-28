import { getTilawatiDataset } from "../data/tilawatiPageDatasets";
import type { QuizQuestion } from "../data/tilawatiQuizTypes";
import type { TimelineEdits } from "./timelineEditsLoader";
import type { TimelineAudioClip } from "./pageTimeline";

export type PatternType =
  | "1-datar"
  | "1-naik"
  | "1-turun"
  | "2-datar-turun"
  | "3-datar-naik-turun"
  | "4-datar-naik-naik-turun";

export interface TrainingItem {
  id: string; // `${jilid}:${hal}:${questionId}`
  jilid: number;
  hal: number;
  arabic: string;
  transliteration: string; // dari transliterationParts.join(" ")
  hintTone: string;
  patternType: PatternType;
  audioUrl: string;
  isOpening: boolean;
  source: "dataset" | "timeline"; // untuk audit
  /** Optional timing params - legacy hardcodes, populate from level config */
  bpm?: number;
  beatsCount?: number;
  durationMs?: number;
}

// Pattern derivation — mapping lengkap
export function derivePatternType(hintTone: string): PatternType {
  const t = hintTone.toLowerCase();
  // Check for 4-pattern: datar, naik twice, then turun
  // Count occurrences of "naik"
  const naikCount = (t.match(/naik/g) || []).length;
  if (t.includes("datar") && naikCount >= 2 && t.includes("turun"))
    return "4-datar-naik-naik-turun";
  if (t.includes("datar") && t.includes("naik") && t.includes("turun"))
    return "3-datar-naik-turun";
  if (t.includes("datar") && t.includes("turun")) return "2-datar-turun";
  if (t.includes("naik")) return "1-naik";
  if (t.includes("turun")) return "1-turun";
  return "1-datar";
}

// Ambil semua item untuk jilid+hal tertentu
// Prefer timeline published data (from Timeline Editor) over raw dataset when present.
export function getTrainingItems(jilid: number, hal: number, timelineData?: TimelineEdits): TrainingItem[] {
  // Prefer published timeline (from Timeline Editor) over raw dataset.
  const published = timelineData?.[`${jilid}:${hal}`]?.published;
  if (published?.timeline) {
    const result: TrainingItem[] = [];
    for (const clip of published.timeline.clips) {
      if (!clip.outputUrl || !clip.outputUrl.startsWith('/audio/tilawati/')) continue;
      const text = published.timeline.texts.find((t) => t.clipId === clip.id);
      if (!text || !text.arabic || text.arabic.trim() === '') continue;
      if (!text.transliterationParts || text.transliterationParts.length === 0) continue;
      result.push({
        id: `${jilid}:${hal}:${clip.id}`,
        jilid,
        hal,
        arabic: text.arabic,
        transliteration: text.transliterationParts.join(' '),
        hintTone: text.hintTone,
        patternType: derivePatternType(text.hintTone),
        audioUrl: clip.outputUrl,
        isOpening: Boolean(text.isOpening),
        source: 'timeline',
        bpm: 65,
        beatsCount: 2,
        durationMs: 2000,
      });
    }
    return result;
  }

  const dataset = getTilawatiDataset(jilid);
  const page = dataset?.[hal];
  if (!page?.questions) return [];
  return page.questions
    .filter((q) => Boolean(q.audioUrl))
    .map((q): TrainingItem => ({
      id: `${jilid}:${hal}:${q.id}`,
      jilid,
      hal,
      arabic: q.arabic,
      transliteration: q.transliterationParts.join(" "),
      hintTone: q.hintTone,
      patternType: derivePatternType(q.hintTone),
      audioUrl: q.audioUrl,
      isOpening: Boolean(q.isOpening),
      source: "dataset",
    }));
}

// Ambil semua item di jilid tertentu (untuk daftar halaman)
export function getAllTrainingItems(jilid: number, timelineData?: TimelineEdits): TrainingItem[] {
  const dataset = getTilawatiDataset(jilid);
  const pages = Object.keys(dataset ?? {}).map(Number).sort((a, b) => a - b);
  return pages.flatMap((hal) => getTrainingItems(jilid, hal, timelineData));
}

// Ambil header clips (untuk Lab Irama) — soal dengan isOpening atau 
// hintTone "Datar — Naik — Turun (3x)"
export function getHeaderSamples(jilid: number, timelineData?: TimelineEdits): TrainingItem[] {
  const items = getAllTrainingItems(jilid, timelineData);
  const headers = items.filter((it) => it.isOpening || it.hintTone.includes('3x'));
  if (headers.length > 0) return headers;
  // Fallback: 1 item per tone (datar/naik/turun) dari data yang ada.
  // Ini menjamin UI Lab Irama tidak kosong ketika jilid tidak punya header clips.
  const picked = new Map<string, TrainingItem>();
  for (const it of items) {
    if (!it.audioUrl) continue;
    let tone: 'datar' | 'naik' | 'turun' = 'datar';
    if (it.hintTone.includes('naik')) tone = 'naik';
    else if (it.hintTone.includes('turun')) tone = 'turun';
    if (!picked.has(tone)) picked.set(tone, it);
  }
  return Array.from(picked.values());
}

// Extract base tone from pattern type for display purposes
export function getBaseTone(patternType: PatternType): "datar" | "naik" | "turun" {
  if (patternType.includes("naik")) return "naik";
  if (patternType.includes("turun")) return "turun";
  return "datar";
}

// Helper ukuran font Arab berdasarkan panjang teks (dari arenaKartuData.ts)
export function getArabicFontSizeClass(text: string): string {
  const len = text.length;
  if (len <= 5) return "text-3xl sm:text-4xl";
  if (len <= 15) return "text-xl sm:text-2xl";
  if (len <= 25) return "text-lg sm:text-xl";
  return "text-sm sm:text-base";
}

/* ============================================================================
 * LEVEL INFO (static UI styling, not in SSOT):
 * rhythmMemoryData.ts & arenaKartuData.ts legacy data
 * ============================================================================ */
export interface RhythmMemoryLevelInfo {
  jilid: number;
  title: string;
  subtitle: string;
  desc: string;
  badgeBg: string;
  cardBg: string;
  borderColor: string;
  bpm: number;
}

export interface ArenaKartuLevelInfo {
  jilid: number;
  title: string;
  subtitle: string;
  desc: string;
  badgeBg: string;
  cardBg: string;
  borderColor: string;
  bpm: number;
  texts: string[];
}

export const RHYTHM_MEMORY_LEVELS: RhythmMemoryLevelInfo[] = [
  {
    jilid: 1,
    title: "Tilawati Jilid 1",
    subtitle: "Huruf Dasar & 2 Ketukan Fathah",
    desc: "Latih ketukan 2 harakat pendek dan asah ingatan huruf tunggal.",
    badgeBg: "bg-[#0284C7]",
    cardBg: "bg-[#E0F2FE]",
    borderColor: "border-[#0284C7]",
    bpm: 65,
  },
  {
    jilid: 2,
    title: "Tilawati Jilid 2",
    subtitle: "Kata 3 Huruf Bersambung & Kasrah",
    desc: "Latih ketukan 3 nada beruntun pada kata-kata bersambung.",
    badgeBg: "bg-[#B45309]",
    cardBg: "bg-[#FEF3C7]",
    borderColor: "border-[#0284C7]",
    bpm: 70,
  },
  {
    jilid: 3,
    title: "Tilawati Jilid 3",
    subtitle: "Mad Thobi'i & Alif Lam",
    desc: "Latih panjang 2 harakat mad thobi'i dan ketukan tegas tasydid.",
    badgeBg: "bg-[#059669]",
    cardBg: "bg-[#D1FAE5]",
    borderColor: "border-[#059669]",
    bpm: 65,
  },
  {
    jilid: 4,
    title: "Tilawati Jilid 4",
    subtitle: "Sukun, Qalqalah & Tanda Berhenti",
    desc: "Latih ketukan memantul qalqalah dan ketukan tenang waqaf.",
    badgeBg: "bg-[#2563EB]",
    cardBg: "bg-[#DBEAFE]",
    borderColor: "border-[#2563EB]",
    bpm: 65,
  },
  {
    jilid: 5,
    title: "Tilawati Jilid 5",
    subtitle: "Hukum Dengung (Ghunnah & Ikhfa)",
    desc: "Latih ketukan dengung 2 harakat yang halus dan merdu.",
    badgeBg: "bg-[#DC2626]",
    cardBg: "bg-[#FEE2E2]",
    borderColor: "border-[#DC2626]",
    bpm: 60,
  },
  {
    jilid: 6,
    title: "Tilawati Jilid 6",
    subtitle: "Ayat Pilihan & Surat Pendek",
    desc: "Latih ketukan irama Rost penuh membaca surat-surat Al-Qur'an.",
    badgeBg: "bg-[#7C3AED]",
    cardBg: "bg-[#EDE9FE]",
    borderColor: "border-[#7C3AED]",
    bpm: 60,
  },
];

export const ARENA_KARTU_LEVELS: ArenaKartuLevelInfo[] = [
  {
    jilid: 1,
    title: "Tilawati Jilid 1",
    subtitle: "Huruf Tunggal & Fathah Pendek",
    desc: "Latih ketukan tegas dan lafal huruf dasar dari Alif sampai Ya.",
    badgeBg: "bg-[#0284C7]",
    cardBg: "bg-[#E0F2FE]",
    borderColor: "border-[#0284C7]",
    bpm: 65,
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
  },
  {
    jilid: 2,
    title: "Tilawati Jilid 2",
    subtitle: "Kata Pendek & Harakat Bersambung",
    desc: "Latih kelancaran membaca kata dengan fathah, kasrah, dan tanwin.",
    badgeBg: "bg-[#B45309]",
    cardBg: "bg-[#FEF3C7]",
    borderColor: "border-[#B45309]",
    bpm: 70,
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
  },
  {
    jilid: 3,
    title: "Tilawati Jilid 3",
    subtitle: "Alif Lam, Mad Asli & Tasydid",
    desc: "Latih bacaan tasydid yang ditekan dan alif lam qamariyah/syamsiyah.",
    badgeBg: "bg-[#059669]",
    cardBg: "bg-[#D1FAE5]",
    borderColor: "border-[#059669]",
    bpm: 65,
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
  },
  {
    jilid: 4,
    title: "Tilawati Jilid 4",
    subtitle: "Tanda Baca, Sukun & Waqaf",
    desc: "Latih pemantulan qalqalah dan ketukan saat berhenti di ujung ayat.",
    badgeBg: "bg-[#2563EB]",
    cardBg: "bg-[#DBEAFE]",
    borderColor: "border-[#2563EB]",
    bpm: 65,
    texts: [
      "اَخَّرَ قَدَّمَ رَتَّلَ يَسَّرَ",
      "يُعَجِّلُ يُكَذِّبُ يُبَشِّرُ يُضِلُّ",
      "عُطِّلَتْ سُجِّرَتْ ثُوِّبَتْ سُعِّرَتْ",
      "صَفًّا حَقًّا سَحَّارٍ قَهَّارٍ",
      "رُكَّعًا سُجَّدًا قَيِّمًا عِتِيًّا",
      "مَآ أامُرُهُ وَمَا أُمِرُوَ",
      "بِمَآ أَنْتُمْ عَلٰٓى أاثَارِهِمْ",
      "لَآ أَعْبُدُ اِلَّآ اامَانِيَّ",
      "لَا يَعْلَمُوْنَ الْكِتٰبَ اِلَّآ اامَانِيَّ",
      "لَآ اِلٰهَ اِلَّا هُوَ رَبُّ الْعَرْشِ الْعَظِيْمِ",
      "وَمَآ أُمِرُوْا اِلَّا لِيَعْبُدُوْا اِلٰهًا",
      "فَهُمْ عَلٰٓى أاثَارِهِمْ يُهْرَعُوْنَ",
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
    bpm: 60,
    texts: [
      "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
      "لِمَنْ يَّخْشٰى لِقَوْمٍ يَّعْلَمُوْنَ",
      "وَمَنْ يُّبَدِّلْ لِقَوْمٍ يَّتَفَكِّرُوْنَ",
      "اَنْ يَّنْزِلَ لِقَوْمٍ يُّؤْمِنُوْنَ",
      "مَنْ yَّقُوْلُ اِذَنْ yَّسْمَعُوْنَ",
      "لِمَنْ yَّشَآءُ اَرْجُلٌ yَّمْشُوْنَ",
      "وَمِنَ النَّاسِ مَنْ yَّتَّخِذُ مِنْ دُوْنِ اللّٰهِ اَنْدَادًا",
      "وَمَنْ yَّعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا yَّرَهٗ",
      "اَيَحْسَبُ الْاِنْسَانُ اَنْ yُّتْرَكَ سُدًى",
      "عَسَى اللّٰهُ اَنْ yَّأْتِيَنِيْ بِهِمْ جَمِيْعًا",
      "فَذُوْقُوْا فَلَنْ نَّزِيْدَكُمْ اِلَّا عَذَابًا",
      "لَا يُؤْمِنُوْنَ بِالْاٰخِرَةِ حِجَابًا مَّسْتُوْرًا",
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
    bpm: 60,
    texts: [
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "قُلْ هُوَاللَّهُ أَحَدٌ",
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      "وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "مَلِكِ النَّاسِ",
      "إِلَٰهِ النَّاسِ",
      "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
    ],
  },
];

export function getRhythmMemoryLevelInfo(jilid: number): RhythmMemoryLevelInfo {
  return RHYTHM_MEMORY_LEVELS.find((l) => l.jilid === jilid) ?? RHYTHM_MEMORY_LEVELS[0];
}

/**
 * Bagi item Rhythm Memory dalam jilid menjadi level (chunk) berisi
 * 12 kartu per level (sesuai grid 3 kolom x 4 baris).
 * Jilid yang punya lebih dari 12 kartu dihasilkan menjadi beberapa
 * level berurutan, bukan 1 daftar panjang 44 item.
 *
 * @param jilid nomor jilid
 * @param chunkSize jumlah kartu per level (default 12)
 */
export function getRhythmMemoryLevels(jilid: number, chunkSize = 12): TrainingItem[][] {
  const items = getAllTrainingItems(jilid);
  const levels: TrainingItem[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    levels.push(items.slice(i, i + chunkSize));
  }
  return levels;
}

/**
 * Ambil 1 level (chunk) Rhythm Memory untuk jilid tertentu.
 */
export function getRhythmMemoryLevel(jilid: number, levelIndex: number, chunkSize = 12): TrainingItem[] {
  const levels = getRhythmMemoryLevels(jilid, chunkSize);
  return levels[levelIndex] ?? [];
}

export function getArenaKartuLevelInfo(jilid: number): ArenaKartuLevelInfo {
  return ARENA_KARTU_LEVELS.find((l) => l.jilid === jilid) ?? ARENA_KARTU_LEVELS[0];
}

/** ArenaKartuMateri type — card data for arena kartu practice session */
export interface ArenaKartuMateri {
  id: string;
  cardIndex: number;
  text: string;
  transliteration: string;
  audioUrl?: string;
  tone?: "datar" | "naik" | "turun";
  patternType?: PatternType;
  beatsCount: number;
  bpm: number;
  instruction?: string;
}

/** RhythmTrack type — rhythm track for Tap The Beat module */
export interface RhythmTrack {
  id: string;
  title: string;
  subtitle: string;
  defaultBpm: number;
  totalBeats: number;
  audioUrl: string;
  beats: {
    beatNumber: number;
    tone: "datar" | "naik" | "turun";
    type: "1-harakat" | "2-harakat";
    arabic?: string;
  }[];
}

/** ArenaKartuCardItem type — card pair for memory match game */
export interface ArenaKartuCardItem {
  id: string;
  pairId: string;
  text: string;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Re-export Lab Irama data module for compatibility
// (Data moved from labIramaData.ts into this adapter as the new SSOT)

/**
 * Build 12 ArenaKartuMateri cards for a jilid from SSOT.
 * TODO: Replace default instruction/timing with SSOT-derived values
 */
export function getArenaKartuMateri(jilid: number, timelineData?: TimelineEdits): ArenaKartuMateri[] {
  const items = getAllTrainingItems(jilid, timelineData);
  const levelBpm = getArenaKartuLevelInfo(jilid).bpm;
  // Take first 12 items with audio, slice to 12 cards
  const selected = items.slice(0, 12);

  if (selected.some((it) => !it.patternType)) {
    console.warn('[adapter] getArenaKartuMateri: sebagian item tanpa patternType');
  }

  return selected.map((item, idx) => ({
    id: `j${jilid}-c${idx + 1}`,
    patternType: item.patternType,
    cardIndex: idx + 1,
    text: item.arabic,
    transliteration: item.transliteration,
    audioUrl: item.audioUrl,
    tone: getBaseTone(item.patternType),
    beatsCount: 2, // TODO: hardcode legacy, hapus setelah SSOT audio
    bpm: levelBpm,
    instruction: "Ketuk sesuai irama nada Tilawati", // TODO: populate from SSOT tips
  }));
}

/**
 * Get a specific card by id.
 */
export function getArenaKartuCardById(
  jilid: number,
  cardId: string,
  timelineData?: TimelineEdits,
): ArenaKartuMateri | undefined {
  return getArenaKartuMateri(jilid, timelineData).find((c) => c.id === cardId);
}

/**
 * Generate pair cards for arena kartu memory match game.
 * Uses first 6 unique items, duplicated into 12 cards.
 */
export function getArenaKartuPairs(
  jilid: number,
  count: number = 6,
  timelineData?: TimelineEdits,
): ArenaKartuCardItem[] {
  const items = getAllTrainingItems(jilid, timelineData);
  const levelBpm = getArenaKartuLevelInfo(jilid).bpm;
  let pool = items.slice(0, 12);
  let poolCopy = shuffleArray(pool);

  const cards: ArenaKartuCardItem[] = [];
  let pairIdx = 0;

  while (cards.length < count * 2 && poolCopy.length > 0) {
    const item = poolCopy.pop();
    if (!item) break;
    const pairId = `pair-${pairIdx}`;
    cards.push({ id: `${pairId}-a`, pairId, text: item.arabic });
    cards.push({ id: `${pairId}-b`, pairId, text: item.arabic });
    pairIdx++;
  }

  return shuffleArray(cards);
}

/* ============================================================================
 * LAB IRAMA DATA (moved from labIramaData.ts into this SSOT adapter)
 * ============================================================================ */

export type TilawatiTone = 'datar' | 'naik' | 'turun';

export type LabIramaCategory = 'siklus-3' | 'siklus-2' | 'tunggal';

export interface LabIramaLesson {
  id: string;
  title: string;
  subtitle: string;
  arabic: string;
  transliteration: string;
  tone: TilawatiTone;
  rostTone?: TilawatiTone;
  siklusNada?: TilawatiTone[];
  audioUrl: string;
  tips: string;
  beatsPattern: number[];
}

export interface LabIramaEarTrainingItem {
  id: string;
  jilid: number;
  hal: number;
  arabic: string;
  transliteration: string;
  siklusNada: TilawatiTone[];
  category: LabIramaCategory;
  tone: TilawatiTone;
  rostTone: TilawatiTone;
  audioUrl: string;
  explanation: string;
  isFullRow?: boolean;
}

export interface LabIramaRhythmTrack {
  id: string;
  title: string;
  subtitle: string;
  defaultBpm: number;
  totalBeats: number;
  audioUrl: string;
  beats: {
    beatNumber: number;
    tone: TilawatiTone;
    type: '1-harakat' | '2-harakat';
    arabic?: string;
  }[];
}

/** Panduan metronom minimum — setidaknya satu contoh per nada (Datar / Naik / Turun) */
export const LAB_IRAMA_GUIDE_LESSONS: LabIramaLesson[] = [
  {
    id: 'guide-j1-header-3x',
    title: 'Bait Pembuka 3x Nada',
    subtitle: 'Jilid 1 Hal 1 Header 3x',
    arabic: 'اَ بَ · اَ بَ · اَ بَ',
    transliteration: 'A Ba (Datar) — A Ba (Naik) — A Ba (Turun)',
    tone: 'datar',
    rostTone: 'datar',
    siklusNada: ['datar', 'naik', 'turun'],
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_full.ogg',
    tips: 'Dengarkan perpindahan 3 nada: Datar (baris 1), Naik (baris 2), Turun (baris 3).',
    beatsPattern: [1, 1, 1, 1, 1, 1],
  },
  {
    id: 'guide-j1-datar',
    title: 'Nada Datar',
    subtitle: 'Jilid 1 Hal 1',
    arabic: 'اَ بَ',
    transliteration: 'A - Ba',
    tone: 'datar',
    rostTone: 'datar',
    siklusNada: ['datar'],
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_datar.ogg',
    tips: 'Suara datar, tegas, dan lurus tanpa intonasi meninggi.',
    beatsPattern: [1, 1],
  },
  {
    id: 'guide-j1-naik',
    title: 'Nada Naik',
    subtitle: 'Jilid 1 Hal 1',
    arabic: 'اَ اَ',
    transliteration: 'A - A',
    tone: 'naik',
    rostTone: 'naik',
    siklusNada: ['naik'],
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_01.ogg',
    tips: 'Intonasi suara terangkat ke atas di akhir bacaan.',
    beatsPattern: [1, 1],
  },
];

/** Pool pelatihan tebak nada (subset dari data asli) */
export const LAB_IRAMA_EAR_TRAINING_POOL: LabIramaEarTrainingItem[] = [
  {
    id: 'ear-j1-h1-full',
    jilid: 1,
    hal: 1,
    arabic: 'اَ بَ · اَ بَ · اَ بَ',
    transliteration: 'A Ba (Datar) — A Ba (Naik) — A Ba (Turun)',
    siklusNada: ['datar', 'naik', 'turun'],
    category: 'siklus-3',
    tone: 'datar',
    rostTone: 'datar',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_full.ogg',
    explanation: 'Siklus penuh 3 nada: Datar ➔ Naik ➔ Turun.',
    isFullRow: true,
  },
  {
    id: 'ear-j1-datar',
    jilid: 1,
    hal: 1,
    arabic: 'اَ بَ',
    transliteration: 'A - Ba',
    siklusNada: ['datar'],
    category: 'tunggal',
    tone: 'datar',
    rostTone: 'datar',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_header_datar.ogg',
    explanation: 'Nada tunggal Datar.',
  },
  {
    id: 'ear-j1-naik',
    jilid: 1,
    hal: 1,
    arabic: 'اَ اَ',
    transliteration: 'A - A',
    siklusNada: ['naik'],
    category: 'tunggal',
    tone: 'naik',
    rostTone: 'naik',
    audioUrl: '/audio/tilawati/jilid_1/hal1/hal1_isi_01.ogg',
    explanation: 'Nada tunggal Naik.',
  },
];

/**
 * Generate sesi pelatihan tebak nada (subset, tetap seimbang Datar / Naik / Turun).
 */
export function generateEarTrainingSession(count: number = 5): LabIramaEarTrainingItem[] {
  const pool = LAB_IRAMA_EAR_TRAINING_POOL;
  const selected: LabIramaEarTrainingItem[] = [];
  const add = (item: LabIramaEarTrainingItem) => {
    if (!selected.some((s) => s.id === item.id)) {
      selected.push(item);
    }
  };
  const siklus3 = pool.filter((i) => i.category === 'siklus-3');
  const siklus2 = pool.filter((i) => i.category === 'siklus-2');
  const tunggal = pool.filter((i) => i.category === 'tunggal');
  if (siklus3[0]) add(siklus3[0]);
  if (siklus2[0]) add(siklus2[0]);
  if (tunggal[0]) add(tunggal[0]);
  for (const tone of ['datar', 'naik', 'turun'] as const) {
    if (!selected.some((s) => s.tone === tone)) {
      const match = pool.find((i) => i.tone === tone);
      if (match) add(match);
    }
  }
  while (selected.length < count && pool.length > 0) {
    const next = pool.pop();
    if (next) add(next);
  }
  return selected.slice(0, count);
}

/** Rumus Irama Rost bawaan untuk Modul Tap The Beat */
export const DEFAULT_RHYTHM_TRACK: LabIramaRhythmTrack = {
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

// Re-export Lab Irama data, types, and functions (now owned by this adapter)
