import {
  TILAWATI_JILID_1_PAGES, TILAWATI_JILID_2_PAGES, TILAWATI_JILID_3_PAGES,
  TILAWATI_JILID_4_PAGES, TILAWATI_JILID_5_PAGES, TILAWATI_JILID_6_PAGES,
  applyTimelineEdits,
} from "./tilawatiQuizData";
import type { PageQuizData } from "./tilawatiQuizTypes";
import { loadTimelineEdits, type TimelineEdits, type TimelineEdit } from "../utils/timelineEditsLoader";

export const TILAWATI_PAGE_DATASETS: Record<number, Record<number, PageQuizData>> = {
  1: TILAWATI_JILID_1_PAGES, 2: TILAWATI_JILID_2_PAGES, 3: TILAWATI_JILID_3_PAGES,
  4: TILAWATI_JILID_4_PAGES, 5: TILAWATI_JILID_5_PAGES, 6: TILAWATI_JILID_6_PAGES,
};

export function getTilawatiDataset(jilid: number): Record<number, PageQuizData> {
  return TILAWATI_PAGE_DATASETS[jilid] ?? {};
}

/**
 * Memuat dataset Tilawati untuk satu jilid yang sudah diperkaya dengan
 * timeline edits (audio editor, published questions, dll).
 *
 * Base dataset (quiz edits sudah diterapkan) diproses kembali dengan data
 * timeline yang di-fetch. Jika fetch gagal, kembalikan dataset dasar.
 */
export async function loadTilawatiDataset(jilid: number): Promise<Record<number, PageQuizData>> {
  const base = getTilawatiDataset(jilid) as Record<number, PageQuizData>;
  try {
    const timelineData = await loadTimelineEdits();
    return applyTimelineEdits(jilid, base, timelineData);
  } catch {
    return base;
  }
}

/** Memuat semua timeline edits sekaligus. Berguna untuk pre-fetching di level layar. */
export async function loadTilawatiDatasets(): Promise<TimelineEdits> {
  return loadTimelineEdits();
}
