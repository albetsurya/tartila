import assert from 'node:assert/strict';
import {
  GAME_CATALOG,
  MATERI_CATALOG,
  QUIZ_CATALOG,
  LEARNING_CATALOG,
  CATALOG_TYPE_LABELS,
  MATERI_LABELS,
  ALL_MATERI_POKOK,
  getGameById,
  getCatalogItemById,
  getLearningCatalog,
  filterCatalogGames,
  filterCatalogItems,
  catalogMatchesFilter,
  recommendGamesForClassroom,
  type GameCatalogEntry,
  type JilidNumber,
} from '../src/data/learningCatalog.ts';
import { isGameOpenForGuest } from '../src/features/ngaji-ceria/data/gameAccess.ts';

function assertEntryShape(entry: GameCatalogEntry): void {
  assert.ok(entry.gameId.length > 0, 'gameId kosong');
  assert.ok(entry.title.length > 0, 'judul kosong');
  assert.ok(entry.materiPokok.length > 0, 'materiPokok kosong');
  for (const materi of entry.materiPokok) {
    assert.ok(
      Object.hasOwn(MATERI_LABELS, materi),
      `${entry.gameId}: materi ${materi} tidak dikenal`,
    );
  }
  for (const jilid of entry.jilidRelevan) {
    assert.ok(
      jilid >= 1 && jilid <= 5,
      `${entry.gameId}: jilidRelevan ${jilid} di luar rentang 1–5`,
    );
  }
  assert.ok(
    entry.learningObjective.trim().length > 0,
    `${entry.gameId}: learningObjective kosong`,
  );
  assert.ok(
    entry.caraMain.trim().length > 0,
    `${entry.gameId}: caraMain kosong`,
  );
  assert.ok(
    entry.tipsUstadz.length >= 1 && entry.tipsUstadz.length <= 3,
    `${entry.gameId}: tipsUstadz harus 1–3 item`,
  );
  assert.ok(
    entry.access === 'guest-open' || entry.access === 'member-only',
    `${entry.gameId}: access tidak valid`,
  );
}

export const tests = {
  'setiap game resmi memiliki metadata lengkap': () => {
    const ids = GAME_CATALOG.map((entry) => entry.gameId);
    assert.equal(new Set(ids).size, ids.length, 'ada gameId duplikat');
    for (const entry of GAME_CATALOG) assertEntryShape(entry);
    assert.ok(GAME_CATALOG.length >= 25, 'katalog terlalu sedikit');
  },

  'semua game riil bertagau katalog: guest-open hanya hijaiyah-pop': () => {
    const guest = GAME_CATALOG.filter((e) => e.access === 'guest-open');
    assert.deepEqual(
      guest.map((e) => e.gameId),
      ['hijaiyah-pop'],
    );
    assert.equal(isGameOpenForGuest('hijaiyah-pop'), true);
    assert.equal(isGameOpenForGuest('tajwid-arena'), false);
  },

  'getGameById menemukan game & alias rute': () => {
    assert.equal(getGameById('tajwid-arena')?.title, 'Tajwid Arena');
    assert.equal(getGameById('unknown-game'), undefined);
    const withAlias = GAME_CATALOG.find(
      (e) => (e.routeAliases?.length ?? 0) > 0,
    );
    if (withAlias?.routeAliases) {
      for (const alias of withAlias.routeAliases) {
        assert.equal(
          getGameById(alias),
          undefined,
          'alias bukan kanonik — hanya terdaftar sebagai routeAliases',
        );
      }
    }
  },

  'filter katalog berdasarkan materi': () => {
    const result = filterCatalogGames({ materi: ['hijaiyah'] });
    assert.ok(result.length > 0);
    for (const entry of result) {
      assert.ok(entry.materiPokok.includes('hijaiyah'));
    }
    assert.ok(result.some((e) => e.gameId === 'hijaiyah-pop'));
    assert.ok(!result.some((e) => e.gameId === 'doa-dungeon'));

    const multi = filterCatalogGames({ materi: ['hijaiyah', 'makhraj'] });
    assert.ok(multi.every((e) =>
      e.materiPokok.some((m) => m === 'hijaiyah' || m === 'makhraj'),
    ));
    assert.ok(multi.some((e) => e.gameId === 'makhraj-master'));
  },

  'filter katalog berdasarkan jilid': () => {
    const jilid4 = filterCatalogGames({ jilid: 4 as JilidNumber });
    assert.ok(
      jilid4.every((e) => e.jilidRelevan.includes(4 as JilidNumber)),
    );
    assert.ok(jilid4.some((e) => e.gameId === 'tajwid-tetris'));
    const jilid1 = filterCatalogGames({ jilid: 1 as JilidNumber });
    assert.ok(
      jilid1.every((e) => e.jilidRelevan.includes(1 as JilidNumber)),
    );
  },

  'pencarian katalog cocok judul & label materi': () => {
    assert.ok(
      filterCatalogGames({ query: 'slasher' }).some(
        (e) => e.gameId === 'harakat-rush',
      ),
    );
    assert.ok(
      filterCatalogGames({ query: 'harakat' }).every(
        (e) =>
          e.materiPokok.includes('harakat') ||
          e.title.toLowerCase().includes('harakat'),
      ),
    );
    assert.equal(filterCatalogGames({ query: 'xyz-tidak-ada' }).length, 0);
    assert.equal(
      filterCatalogGames({ query: '  HIJAIYAH POP   ' }).some(
        (e) => e.gameId === 'hijaiyah-pop',
      ),
      true,
    );
  },

  'draf metadata menandai needsContentValidation': () => {
    const validated = GAME_CATALOG.filter(
      (e) => e.needsContentValidation === false,
    );
    assert.ok(validated.length < GAME_CATALOG.length);
    assert.ok(
      validated.every((e) => e.gameId === 'hijaiyah-pop'),
      'hanya hijaiyah-pop yang lolos validasi',
    );
    assert.ok(ALL_MATERI_POKOK.length === Object.keys(MATERI_LABELS).length);
  },

  'rekomendasi kelas: fokus materi hijaiyah + jilid 1 → game hijaiyah di atas': () => {
    const result = recommendGamesForClassroom({
      focusMateri: ['hijaiyah'],
      targetJilid: 1,
    });
    assert.ok(result.length > 0);
    for (const rec of result) {
      assert.ok(
        rec.entry.materiPokok.includes('hijaiyah') ||
          rec.entry.jilidRelevan.includes(1 as JilidNumber),
      );
    }
    assert.ok(result[0].reason.includes('Hijaiyah'));
    assert.ok(result.some((r) => r.entry.gameId === 'hijaiyah-pop'));
    // game tanpa relevansi tidak masuk daftar
    assert.ok(!result.some((r) => r.entry.gameId === 'doa-dungeon'));
  },

  'rekomendasi kelas: fokus tajwid + jilid 4 → game tajwid di atas': () => {
    const result = recommendGamesForClassroom({
      focusMateri: ['tajwid'],
      targetJilid: 4,
    });
    assert.ok(result.length > 0);
    for (const rec of result) {
      assert.ok(
        rec.entry.materiPokok.includes('tajwid') ||
          rec.entry.jilidRelevan.includes(4 as JilidNumber),
      );
    }
  },

  'rekomendasi kelas tanpa fokus materi tetap memakai jilid target': () => {
    const result = recommendGamesForClassroom({
      focusMateri: [],
      targetJilid: 3,
    });
    assert.ok(result.length > 0);
    assert.ok(
      result.every((rec) =>
        rec.entry.jilidRelevan.includes(3 as JilidNumber),
      ),
    );
  },

  'rekomendasi kelas: fokus gharib jilid 1 → hanya game selaras materi/jilid': () => {
    const result = recommendGamesForClassroom({
      focusMateri: ['gharib'],
      targetJilid: 1,
    });
    assert.ok(result.length > 0);
    assert.ok(
      result.every(
        (rec) =>
          rec.entry.materiPokok.includes('gharib') ||
          rec.entry.jilidRelevan.includes(1 as JilidNumber),
      ),
    );
    assert.ok(
      result.some((rec) => rec.entry.materiPokok.includes('gharib')),
    );
    assert.ok(!result.some((r) => r.entry.gameId === 'doa-dungeon'));
  },

  'catalogMatchesFilter tanpa filter cocok semua game': () => {
    const all = filterCatalogGames({});
    assert.equal(all.length, GAME_CATALOG.length);
    for (const entry of GAME_CATALOG) {
      assert.ok(catalogMatchesFilter(entry, {}));
    }
  },

  'katalog gabungan: materi, kuis, dan game tanpa id duplikat': () => {
    const ids = LEARNING_CATALOG.map((entry) => entry.id);
    assert.equal(new Set(ids).size, ids.length, 'ada id duplikat');
    assert.equal(
      LEARNING_CATALOG.length,
      MATERI_CATALOG.length + QUIZ_CATALOG.length + GAME_CATALOG.length,
    );
    assert.deepEqual(
      Object.keys(CATALOG_TYPE_LABELS).sort(),
      ['game', 'materi', 'quiz'],
    );
  },

  'setiap materi punya rute Jelajah dan metadata lengkap': () => {
    assert.ok(MATERI_CATALOG.length >= 8, 'materi terlalu sedikit');
    for (const entry of MATERI_CATALOG) {
      assert.equal(entry.type, 'materi');
      assert.ok(entry.route.startsWith('/member/ngaji-ceria/explore/'));
      assert.ok(entry.title.trim().length > 0);
      assert.ok(entry.materiPokok.length > 0);
      assert.ok(entry.learningObjective.trim().length > 0);
      assert.ok(entry.caraMain.trim().length > 0);
      assert.ok(entry.tipsUstadz.length >= 1 && entry.tipsUstadz.length <= 3);
    }
    assert.ok(
      MATERI_CATALOG.some((entry) => entry.id === 'menara-tilawati'),
      'materi Tilawati harus ada',
    );
  },

  'setiap kuis punya metadata lengkap dan materi valid': () => {
    assert.ok(QUIZ_CATALOG.length >= 1);
    for (const entry of QUIZ_CATALOG) {
      assert.equal(entry.type, 'quiz');
      assert.ok(entry.materiPokok.length > 0);
      for (const materi of entry.materiPokok) {
        assert.ok(Object.hasOwn(MATERI_LABELS, materi));
      }
    }
  },

  'getCatalogItemById & getLearningCatalog menjangkau semua tipe': () => {
    assert.equal(getCatalogItemById('menara-tilawati')?.type, 'materi');
    assert.equal(getCatalogItemById('kuis-praktik-tilawati')?.type, 'quiz');
    assert.equal(getCatalogItemById('hijaiyah-pop')?.type, 'game');
    assert.equal(getCatalogItemById('tidak-ada'), undefined);
    assert.equal(getLearningCatalog().length, LEARNING_CATALOG.length);
  },

  'filter tipe hanya mengembalikan tipe yang diminta': () => {
    const materiOnly = filterCatalogItems({ type: 'materi' });
    assert.equal(materiOnly.length, MATERI_CATALOG.length);
    assert.ok(materiOnly.every((entry) => entry.type === 'materi'));

    const gameOnly = filterCatalogItems({ type: 'game' });
    assert.equal(gameOnly.length, GAME_CATALOG.length);

    const quizOnly = filterCatalogItems({ type: 'quiz' });
    assert.equal(quizOnly.length, QUIZ_CATALOG.length);

    const tanpaFilter = filterCatalogItems({});
    assert.equal(tanpaFilter.length, LEARNING_CATALOG.length);
  },

  'filter materi lintas tipe mencari tag di materi, kuis, dan game': () => {
    const tilawati = filterCatalogItems({ materi: ['tilawati'] });
    assert.ok(tilawati.some((entry) => entry.type === 'materi'));
    assert.ok(tilawati.some((entry) => entry.type === 'quiz'));
    assert.ok(tilawati.every((entry) => entry.materiPokok.includes('tilawati')));

    const juzAmma = filterCatalogItems({ materi: ['juz-amma'] });
    assert.ok(juzAmma.length > 0);
    assert.ok(juzAmma.every((entry) => entry.materiPokok.includes('juz-amma')));
  },
};
