import { getTilawatiJilidPages, applyTimelineEdits } from "./tilawatiQuizData";
import type { PageQuizData } from "./tilawatiQuizTypes";
import { loadTimelineEdits, type TimelineEdits } from "../utils/timelineEditsLoader";
import { TILAWATI_JILID_1_PAGES } from "./tilawatiQuizJilid1";

// Cache per-jilid: Jilid 1 statik, 2-6 lazy-loaded
const JILID_DATASET_CACHE: Record<number, Record<number, PageQuizData>> = {
  1: TILAWATI_JILID_1_PAGES,
};

/**
 * Async loader untuk dataset jilid. Jilid 1 selalu sync (cached statik).
 * Jilid 2-6 dimuat lewat dynamic import pertama kali.
 */
export async function loadTilawatiDataset(jilid: number): Promise<Record<number, PageQuizData>> {
  // Jilid 1 sudah di cache
  if (jilid === 1) {
    const base = applyTimelineEdits(1, JILID_DATASET_CACHE[1]!, {});
    return base;
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