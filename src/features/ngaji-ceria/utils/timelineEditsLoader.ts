/**
 * Async loader for tilawatiTimelineEdits.json (public/data/).
 * File is fetched from the public folder on-demand (not bundled in JS),
 * and cached in module-level memory so it is loaded only once.
 */
import type { PublishedTimeline } from "./pageTimeline";
import type { QuizQuestion } from "../data/tilawatiQuizTypes";

export type TimelineEdit = {
  published?: PublishedTimeline;
  audioOrder?: string[];
  textLinks?: Record<string, string>;
  textAdditions?: QuizQuestion[];
};
export type TimelineEdits = Record<string, TimelineEdit>;

let cachedData: TimelineEdits | null = null;
let loadingPromise: Promise<TimelineEdits> | null = null;

export async function loadTimelineEdits(): Promise<TimelineEdits> {
  if (cachedData) return cachedData;
  if (!loadingPromise) {
    loadingPromise = (async () => {
      const res = await fetch("/data/tilawatiTimelineEdits.json");
      if (!res.ok) throw new Error(`Gagal memuat timeline edits: ${res.status}`);
      cachedData = (await res.json()) as TimelineEdits;
      return cachedData;
    })();
  }
  return loadingPromise;
}

export function getCachedTimelineEdits(): TimelineEdits | null {
  return cachedData;
}

export function invalidateTimelineEditsCache(): void {
  cachedData = null;
  loadingPromise = null;
}

// Otomatis refresh cache ketika ada timeline yang baru di-publish
if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
  window.addEventListener("ngajiceria:timeline-published", () => {
    invalidateTimelineEditsCache();
    void loadTimelineEdits();
  });
}
