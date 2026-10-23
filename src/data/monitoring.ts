/**
 * Helper murni monitoring cakupan materi kelas.
 * Sumber kebenaran kurikulum: src/data/learningCatalog.ts.
 */

import {
  getLearningCatalog,
  MATERI_LABELS,
  type CatalogEntry,
  type MateriPokok,
} from './learningCatalog';

interface ActivityLike {
  gameId: string;
}

/** Materi yang dilatih sebuah katalog item. */
function materiOfEntry(entry: CatalogEntry | undefined): readonly MateriPokok[] {
  return entry ? entry.materiPokok : [];
}

function entryByGameId(gameId: string): CatalogEntry | undefined {
  return getLearningCatalog().find((entry) => 'gameId' in entry && entry.gameId === gameId);
}

export interface MateriCoverageItem {
  materi: MateriPokok;
  label: string;
  count: number;
  percent: number;
}

/**
 * Cakupan materi dari daftar aktivitas: setiap aktivitas berkontribusi
 * pada setiap materi yang dilatih game-nya. Hasilnya diurut menurun.
 */
export function materiCoverage(
  activities: readonly ActivityLike[],
  roster?: readonly MateriPokok[],
): MateriCoverageItem[] {
  const counts = new Map<MateriPokok, number>();
  for (const activity of activities) {
    const entry = entryByGameId(activity.gameId);
    if (!entry) continue;
    for (const materi of materiOfEntry(entry)) {
      counts.set(materi, (counts.get(materi) ?? 0) + 1);
    }
  }

  const relevant = [...counts.keys(), ...(roster ?? [])];
  const uniqueMateri = [...new Set(relevant)];
  const totalWeight = activities.length === 0 ? 0 : activities.length;

  const items = uniqueMateri.map((materi) => {
    const count = counts.get(materi) ?? 0;
    const percent =
      totalWeight === 0
        ? 0
        : Math.round(
            (activities.filter((activity) =>
              materiOfEntry(entryByGameId(activity.gameId)).includes(materi),
            ).length /
              totalWeight) *
              100,
          );
    return { materi, label: MATERI_LABELS[materi], count, percent };
  });

  return items.sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

/** Kalimat ringkasan cakupan: "70% aktivitas di materi Hijaiyah, 30% Harakat." */
export function coverageSummaryLine(
  coverage: readonly MateriCoverageItem[],
): string {
  const parts = coverage
    .filter((item) => item.percent > 0)
    .map((item) => `${item.percent}% ${item.label}`);
  if (parts.length === 0) return 'Belum ada aktivitas minggu ini.';
  return `${parts.join(', ')}.`;
}

/**
 * Rekomendasi tindakan berbasis fokus materi kelas yang belum disentuh
 * aktivitas, contoh: "Belum ada aktivitas di materi Tajwid minggu ini."
 */
export function coverageRecommendations(
  activities: readonly ActivityLike[],
  focusMateri: readonly MateriPokok[],
): string[] {
  const touched = new Set<MateriPokok>();
  for (const activity of activities) {
    const entry = entryByGameId(activity.gameId);
    if (!entry) continue;
    for (const materi of materiOfEntry(entry)) touched.add(materi);
  }
  const missed = focusMateri.filter((materi) => !touched.has(materi));
  if (missed.length === 0) {
    return focusMateri.length > 0
      ? ['Semua fokus materi sudah tersentuh aktivitas minggu ini.']
      : [];
  }
  return missed.map(
    (materi) =>
      `Belum ada aktivitas di materi ${MATERI_LABELS[materi]} minggu ini.`,
  );
}

// ── Progres baca materi (kurikulum) ─────────────────────────────

export interface MateriReadRecord {
  userId: string;
  materiId: string;
}

export interface MateriReadCoverageItem {
  materiId: string;
  label: string;
  /** Jumlah santri unik yang sudah membuka materi. */
  readers: number;
  totalSantri: number;
  /** Persentase santri yang sudah membaca (0–100). */
  percent: number;
}

function materiLabel(materiId: string): string {
  return Object.prototype.hasOwnProperty.call(MATERI_LABELS, materiId)
    ? MATERI_LABELS[materiId as MateriPokok]
    : materiId;
}

/**
 * Berapa persen santri yang sudah membaca tiap materi kurikulum.
 * `records` hanya berisi santri yang sudah membuka; santri lain
 * dihitung sebagai belum membaca.
 */
export function materiReadCoverage(
  records: readonly MateriReadRecord[],
  userIds: readonly string[],
  materiIds: readonly string[],
): MateriReadCoverageItem[] {
  const totalSantri = userIds.length;
  return materiIds.map((materiId) => {
    const readers = new Set(
      records
        .filter((record) => record.materiId === materiId)
        .map((record) => record.userId)
        .filter((userId) => userIds.includes(userId)),
    );
    const percent =
      totalSantri === 0
        ? 0
        : Math.round((readers.size / totalSantri) * 100);
    return {
      materiId,
      label: materiLabel(materiId),
      readers: readers.size,
      totalSantri,
      percent,
    };
  });
}

/** Ringkasan progres baca: "80% santri sudah membaca Tilawati Jilid 1." */
export function readCoverageSummaryLine(
  item: MateriReadCoverageItem,
): string {
  return `${item.percent}% santri sudah membaca ${item.label}.`;
}
