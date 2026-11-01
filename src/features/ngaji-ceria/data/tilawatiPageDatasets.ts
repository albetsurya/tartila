import { getTilawatiJilidPages, applyTimelineEdits } from "./tilawatiQuizData";
import type { PageQuizData, QuizQuestion } from "./tilawatiQuizTypes";
export type { PageQuizData } from "./tilawatiQuizTypes";
import { loadTimelineEdits, type TimelineEdits } from "../utils/timelineEditsLoader";
import { TILAWATI_JILID_1_PAGES } from "./tilawatiQuizJilid1";
import { getQuestionAudioUrl } from "./tilawatiAudioQuestionMap";

// Cache per-jilid: Jilid 1 statik, 2-6 lazy-loaded
const JILID_DATASET_CACHE: Record<number, Record<number, PageQuizData>> = {
  1: TILAWATI_JILID_1_PAGES,
};

/**
 * Async loader untuk dataset jilid. Jilid 1 selalu sync (cached statik).
 * Jilid 2-6 dimuat lewat dynamic import pertama kali.
 */
export async function loadTilawatiDataset(jilid: number): Promise<Record<number, PageQuizData>> {
  // Jilid 1: lazy apply timeline edits (populated TIMELINE_EDITS) like jilid 2-6.
  if (jilid === 1) {
    const processed = await getTilawatiJilidPages(1);
    JILID_DATASET_CACHE[1] = processed;
    return processed;
  }

  // Jilid 2-6: lazy load
  if (!JILID_DATASET_CACHE[jilid]) {
    const rawPages = await getTilawatiJilidPages(jilid);
    JILID_DATASET_CACHE[jilid] = rawPages;
  }
  return JILID_DATASET_CACHE[jilid]!;
}

/**
 * Sinkron getter untuk dataset yang sudah dimuat.
 * Hanya aman untuk dipanggil setelah `loadTilawatiDataset(jilid)` selesai,
 * atau untuk Jilid 1 (selalu tersedia).
 */
export function getTilawatiDataset(jilid: number): Record<number, PageQuizData> {
  return JILID_DATASET_CACHE[jilid] ?? {};
}

/** Memuat semua timeline edits sekaligus. Berguna untuk pre-fetching di level layar. */
export async function loadTilawatiDatasets(): Promise<TimelineEdits> {
  return loadTimelineEdits();
}

/**
 * Ambil pertanyaan halaman dengan audio URL ter-resolve, untuk editor timeline.
 * Jilid 1 sinkron (statically cached); Jilid 2–6 dimuat lewat lazy loader.
 */
export async function getTilawatiPageQuestions(jilid: number, hal: number): Promise<QuizQuestion[]> {
  const pages = await loadTilawatiDataset(jilid);
  const page = pages[hal];
  if (!page) return [];
  return page.questions.map((question, index) => ({
    ...question,
    audioUrl: getQuestionAudioUrl(question, jilid, hal, index, Boolean(page.questions[0]?.isOpening)),
  }));
}