// Admin material (Tilawati) service.
//
// The backend has no `materials`/`books` master table yet: Jilid 1–6 are
// hardcoded system constants (44 pages each) and the DB only stores per-page
// timeline data. So we call the existing editor list endpoint and *aggregate*
// the per-page rows into 6 jilid summaries on the client.

import { callREST } from "@/services/api";

export type MaterialStatus = "published" | "draft";

export interface AdminMaterial {
  id: string;
  jilid: number;
  title: string;
  pageCount: number;
  status: MaterialStatus;
  lastUpdated: string;
  coverUrl?: string;
}

/** Jilid is a hardcoded system constant covering 1..6. */
const JILID_RANGE = [1, 2, 3, 4, 5, 6];
const DEFAULT_PAGE_COUNT = 44;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isPublishedStatus(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return ["published", "publish", "active", "done", "complete", "completed"]
    .includes(value.trim().toLowerCase());
}

function toTimestamp(value: unknown): number {
  if (typeof value !== "string" && typeof value !== "number") return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDate(timestamp: number): string {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Tolerates `[...]`, `{ pages: [...] }`, `{ items: [...] }`, etc. */
function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    if (Array.isArray(payload.pages)) return payload.pages;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.rows)) return payload.rows;
    if (Array.isArray(payload.list)) return payload.list;
    if (Array.isArray(payload.data)) return payload.data;
  }
  return [];
}

interface JilidBucket {
  total: number;
  published: number;
  lastUpdated: number;
}

/**
 * Groups per-page rows into one summary per jilid (1..6).
 * A jilid is `published` when at least half of its pages are published,
 * otherwise `draft`. `pageCount` is the number of filled pages, or the
 * system default (44) when the jilid has no rows.
 *
 * Returns `[]` when no usable rows were found, so the caller can fall back
 * to local mock data.
 */
export function aggregateMaterials(payload: unknown): AdminMaterial[] {
  const buckets = new Map<number, JilidBucket>();

  for (const raw of extractList(payload)) {
    const row = isRecord(raw) ? raw : {};
    const jilid = asNumber(row.jilid ?? row.jilid_id ?? row.book_id ?? row.level);
    if (jilid === null || jilid < 1 || jilid > 6) continue;

    const bucket = buckets.get(jilid) ?? {
      total: 0,
      published: 0,
      lastUpdated: 0,
    };
    bucket.total += 1;
    if (isPublishedStatus(row.status ?? row.page_status ?? row.state)) {
      bucket.published += 1;
    }
    const timestamp = toTimestamp(
      row.updated_at ??
        row.updatedAt ??
        row.published_at ??
        row.publishedAt ??
        row.created_at,
    );
    if (timestamp > bucket.lastUpdated) bucket.lastUpdated = timestamp;
    buckets.set(jilid, bucket);
  }

  if (buckets.size === 0) return [];

  return JILID_RANGE.map((jilid) => {
    const bucket = buckets.get(jilid);
    const total = bucket?.total ?? 0;
    const published = bucket?.published ?? 0;
    const status: MaterialStatus =
      total > 0 && published >= total / 2 ? "published" : "draft";

    return {
      id: `tilawati-jilid-${jilid}`,
      jilid,
      title: `Tilawati Jilid ${jilid}`,
      pageCount: total > 0 ? total : DEFAULT_PAGE_COUNT,
      status,
      lastUpdated: formatDate(bucket?.lastUpdated ?? 0),
    };
  });
}

export async function fetchMaterials(): Promise<AdminMaterial[]> {
  const payload = await callREST<unknown>(
    "GET",
    "/api/v1/tilawati-editor/list",
  );
  return aggregateMaterials(payload);
}

export async function deleteMaterial(id: string): Promise<void> {
  // TODO: Wire to an API once a `materials`/`books` master table exists.
  void id;
  await new Promise((resolve) => setTimeout(resolve, 500));
}
