/**
 * Loader untuk Timeline Editor (DB via Backend Go).
 * Sumber data: GET /api/v1/timeline/all — format {"status":"success","data":{"1:1":...}}.
 * Cache module-level agar hanya di-fetch sekali; API gagal = fallback {}.
 */
import { API_BASE_URL } from "../../../constants";
import type { PublishedTimeline } from "./pageTimeline";
import type { QuizQuestion } from "../data/tilawatiQuizTypes";

export type TimelineEdit = {
  published?: PublishedTimeline;
  audioOrder?: string[];
  textLinks?: Record<string, string>;
  textAdditions?: QuizQuestion[];
  textEdits?: Record<string, Partial<QuizQuestion> & { deleted?: boolean }>;
};
export type TimelineEdits = Record<string, TimelineEdit>;

let cachedData: TimelineEdits | null = null;
let loadingPromise: Promise<TimelineEdits> | null = null;

export async function loadTimelineEdits(): Promise<TimelineEdits> {
  if (cachedData) return cachedData;
  if (!loadingPromise) {
    loadingPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/tilawati/timeline/all`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Gagal memuat timeline edits: ${res.status}`);
        const json = (await res.json()) as { data?: TimelineEdits };
        cachedData = json?.data ?? {};
      } catch {
        // API gagal: pakai baseline statis (override & fallback).
        cachedData = {};
      }
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
