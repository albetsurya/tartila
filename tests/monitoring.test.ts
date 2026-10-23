import assert from 'node:assert/strict';
import {
  MATERI_LABELS,
  getGameById,
} from '../src/data/learningCatalog.ts';
import {
  materiCoverage,
  coverageSummaryLine,
  coverageRecommendations,
  materiReadCoverage,
  readCoverageSummaryLine,
} from '../src/data/monitoring.ts';
import {
  assignGameToRoom,
  unassignGameFromRoom,
  listGameAssignments,
  listMateriReadProgress,
} from '../src/services/ustadzMonitoringService.ts';

const ACTIVITIES = [
  { gameId: 'hijaiyah-pop' },
  { gameId: 'hijaiyah-pop' },
  { gameId: 'hijaiyah-pop' },
  { gameId: 'tangkap-harakat' },
  { gameId: 'makhraj-master' },
];

export const tests = {
  'getGameById untuk game dari aktivitas monitoring tersedia': () => {
    assert.ok(getGameById('hijaiyah-pop') !== undefined);
  },

  'cakupan materi: hijaiyah 60%, makhraj & harakat 20%': () => {
    const coverage = materiCoverage(ACTIVITIES);
    const hijaiyah = coverage.find((c) => c.materi === 'hijaiyah');
    assert.ok(hijaiyah);
    assert.equal(hijaiyah.percent, 60);
    assert.equal(hijaiyah.label, MATERI_LABELS.hijaiyah);
    const makhraj = coverage.find((c) => c.materi === 'makhraj');
    assert.ok(makhraj && makhraj.percent === 20);
  },

  'cakupan materi dari game multi-materi dihitung per tag materi': () => {
    const items = materiCoverage([{ gameId: 'tajwid-defense' }], []);
    assert.ok(items.find((c) => c.materi === 'tajwid')?.percent === 100);
    assert.ok(items.find((c) => c.materi === 'mad')?.percent === 100);
  },

  'cakupan materi kosong → kosong': () => {
    assert.deepEqual(materiCoverage([]), []);
  },

  'roster fokus materi tampil meski belum ada aktivitas': () => {
    const coverage = materiCoverage(ACTIVITIES, ['adab']);
    const adab = coverage.find((c) => c.materi === 'adab');
    assert.ok(adab && adab.percent === 0);
  },

  'ringkasan cakupan menyebutkan materi dengan persen': () => {
    const coverage = materiCoverage(ACTIVITIES, ['adab']);
    const line = coverageSummaryLine(coverage);
    assert.ok(line.includes('Hijaiyah'));
    assert.ok(line.includes('Adab') === false);
  },

  'rekomendasi: fokus materi yang belum disentuh': () => {
    const recs = coverageRecommendations(ACTIVITIES, ['tajwid', 'hijaiyah']);
    assert.equal(recs.length, 1);
    assert.match(recs[0], /Belum ada aktivitas di materi Tajwid/);
  },

  'rekomendasi: semua fokus telah tersentuh': () => {
    assert.deepEqual(coverageRecommendations(ACTIVITIES, ['hijaiyah']), [
      'Semua fokus materi sudah tersentuh aktivitas minggu ini.',
    ]);
  },

  'rekomendasi: tanpa fokus → tanpa rekomendasi': () => {
    assert.deepEqual(coverageRecommendations(ACTIVITIES, []), []);
  },

  'adapter penugasan: assign → list → unassign': async () => {
    const created = await assignGameToRoom('room-1', 'tajwid-arena', 'u-1');
    assert.equal(created.gameId, 'tajwid-arena');
    assert.equal(created.assignedBy, 'u-1');
    await unassignGameFromRoom('room-1', 'tajwid-arena');
    assert.deepEqual(await listGameAssignments('room-1'), []);
    assert.deepEqual(await listGameAssignments('room-2'), []);
  },

  'progress baca: persentase santri per materi': () => {
    const reads = [
      { userId: 's1', materiId: 'hijaiyah' },
      { userId: 's2', materiId: 'hijaiyah' },
      { userId: 's1', materiId: 'harakat' },
    ];
    const userIds = ['s1', 's2', 's3', 's4'];
    const coverage = materiReadCoverage(reads, userIds, ['hijaiyah', 'harakat']);
    const hijaiyah = coverage.find((c) => c.materiId === 'hijaiyah');
    assert.ok(hijaiyah);
    assert.equal(hijaiyah.readers, 2);
    assert.equal(hijaiyah.totalSantri, 4);
    assert.equal(hijaiyah.percent, 50);
    const harakat = coverage.find((c) => c.materiId === 'harakat');
    assert.ok(harakat);
    assert.equal(harakat.percent, 25);
    assert.equal(harakat.label, MATERI_LABELS.harakat);
  },

  'progress baca: tidak ada santri target → 0%': () => {
    const coverage = materiReadCoverage([], [], ['hijaiyah']);
    assert.equal(coverage[0].percent, 0);
  },

  'ringkasan progres baca menyebutkan persen': () => {
    const coverage = materiReadCoverage(
      [{ userId: 's1', materiId: 'hijaiyah' }],
      ['s1', 's2'],
      ['hijaiyah'],
    );
    const line = readCoverageSummaryLine(coverage[0]);
    assert.match(line, /50%/);
    assert.match(line, /Hijaiyah/);
  },

  'mock progres baca kelas menghasilkan rekoman': async () => {
    const reads = await listMateriReadProgress(
      'room-test',
      ['s1', 's2', 's3', 's4', 's5'],
      ['hijaiyah', 'harakat', 'tajwid'],
    );
    assert.ok(Array.isArray(reads));
    for (const record of reads) {
      assert.ok(record.userId.startsWith('s'));
      assert.ok(['hijaiyah', 'harakat', 'tajwid'].includes(record.materiId));
    }
  },
};
