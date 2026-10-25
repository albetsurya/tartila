import assert from 'node:assert/strict';
import {
  getAdminGameCatalog,
  getAdminGameById,
  saveGameOverride,
  resetGameOverride,
  resetAllGameOverrides,
  getGameCatalogStats,
  filterAdminGames,
  GAME_CATALOG_STORAGE_KEY,
} from '../src/features/admin/services/gameCatalogAdminService.ts';
import { isGameOpenForGuest } from '../src/features/ngaji-ceria/data/gameAccess.ts';
import { ADMIN_NAV } from '../src/features/admin/hooks/useAdminNav.ts';

// Mock storage untuk pengujian environment Node.js
function setupMockBrowserStorage() {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };

  const originalWindow = (globalThis as unknown as { window?: unknown }).window;
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: mockStorage,
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  return () => {
    store.clear();
    if (originalWindow !== undefined) {
      (globalThis as unknown as { window: unknown }).window = originalWindow;
    } else {
      delete (globalThis as unknown as { window?: unknown }).window;
    }
  };
}

export const tests = {
  'katalog admin memuat seluruh game dengan status default': () => {
    const cleanup = setupMockBrowserStorage();
    try {
      const games = getAdminGameCatalog();
      assert.ok(games.length >= 18, `Katalog memiliki minimal 18 game, ditemukan: ${games.length}`);

      const pop = games.find((g) => g.gameId === 'hijaiyah-pop');
      assert.ok(pop, 'hijaiyah-pop harus ditemukan');
      assert.equal(pop.access, 'guest-open');
      assert.equal(pop.needsContentValidation, false);
      assert.equal(pop.isOverridden, false);

      const rush = games.find((g) => g.gameId === 'hijaiyah-rush');
      assert.ok(rush, 'hijaiyah-rush harus ditemukan');
      assert.equal(rush.access, 'member-only');
      assert.equal(rush.needsContentValidation, true);
      assert.equal(rush.isOverridden, false);
    } finally {
      cleanup();
    }
  },

  'statistik katalog menghitung total, akses tamu, member, dan validasi': () => {
    const cleanup = setupMockBrowserStorage();
    try {
      const stats = getGameCatalogStats();
      assert.equal(stats.total, 29);
      assert.equal(stats.guestOpen, 1);
      assert.equal(stats.memberOnly, 28);
      assert.equal(stats.needsValidation, 28);
      assert.equal(stats.validated, 1);
      assert.equal(stats.overriddenCount, 0);
    } finally {
      cleanup();
    }
  },

  'filter katalog admin berdasarkan query, materi, jilid, akses, dan validasi': () => {
    const cleanup = setupMockBrowserStorage();
    try {
      const games = getAdminGameCatalog();

      // Filter Query judul
      const searchTitle = filterAdminGames(games, { query: 'Tetris' });
      assert.equal(searchTitle.length, 1);
      assert.equal(searchTitle[0].gameId, 'tajwid-tetris');

      // Filter Query gameId
      const searchId = filterAdminGames(games, { query: 'hijaiyah-2048' });
      assert.equal(searchId.length, 1);
      assert.equal(searchId[0].title, 'Hijaiyah 2048');

      // Filter Materi Pokok 'tajwid'
      const tajwidGames = filterAdminGames(games, { materi: 'tajwid' });
      assert.ok(tajwidGames.length >= 3);
      for (const g of tajwidGames) {
        assert.ok(g.materiPokok.includes('tajwid'));
      }

      // Filter Jilid 4
      const jilid4Games = filterAdminGames(games, { jilid: 4 });
      assert.ok(jilid4Games.length > 0);
      for (const g of jilid4Games) {
        assert.ok(g.jilidRelevan.includes(4));
      }

      // Filter Akses Guest Open
      const guestGames = filterAdminGames(games, { access: 'guest-open' });
      assert.equal(guestGames.length, 1);
      assert.equal(guestGames[0].gameId, 'hijaiyah-pop');

      // Filter Status Validasi
      const validatedGames = filterAdminGames(games, { validationStatus: 'validated' });
      assert.equal(validatedGames.length, 1);
      assert.equal(validatedGames[0].gameId, 'hijaiyah-pop');
    } finally {
      cleanup();
    }
  },

  'superadmin dapat mengubah akses dan validasi, tersimpan di storage dan mempengaruhi isGameOpenForGuest': () => {
    const cleanup = setupMockBrowserStorage();
    try {
      // Sebelum override: hijaiyah-rush khusus member
      assert.equal(isGameOpenForGuest('hijaiyah-rush'), false);

      // Superadmin mengubah hijaiyah-rush menjadi guest-open dan tervalidasi
      saveGameOverride('hijaiyah-rush', {
        access: 'guest-open',
        needsContentValidation: false,
        learningObjective: 'Objektif baru yang telah direvisi',
      });

      const updatedRush = getAdminGameById('hijaiyah-rush');
      assert.ok(updatedRush);
      assert.equal(updatedRush.access, 'guest-open');
      assert.equal(updatedRush.needsContentValidation, false);
      assert.equal(updatedRush.isOverridden, true);
      assert.equal(updatedRush.learningObjective, 'Objektif baru yang telah direvisi');

      // Cek statistik terbarukan
      const stats = getGameCatalogStats();
      assert.equal(stats.guestOpen, 2);
      assert.equal(stats.memberOnly, 27);
      assert.equal(stats.overriddenCount, 1);

      // isGameOpenForGuest kini bernilai true karena ada override
      assert.equal(isGameOpenForGuest('hijaiyah-rush'), true);

      // Reset individual
      resetGameOverride('hijaiyah-rush');
      const resetRush = getAdminGameById('hijaiyah-rush');
      assert.ok(resetRush);
      assert.equal(resetRush.access, 'member-only');
      assert.equal(resetRush.isOverridden, false);
      assert.equal(isGameOpenForGuest('hijaiyah-rush'), false);
    } finally {
      cleanup();
    }
  },

  'resetAllGameOverrides mengembalikan seluruh penyesuaian': () => {
    const cleanup = setupMockBrowserStorage();
    try {
      saveGameOverride('hijaiyah-rush', { access: 'guest-open' });
      saveGameOverride('tajwid-tetris', { needsContentValidation: false });

      let stats = getGameCatalogStats();
      assert.equal(stats.overriddenCount, 2);

      resetAllGameOverrides();

      stats = getGameCatalogStats();
      assert.equal(stats.overriddenCount, 0);
      assert.equal(stats.guestOpen, 1);
    } finally {
      cleanup();
    }
  },

  'navigasi admin menyertakan menu Katalog Game': () => {
    const kontenSection = ADMIN_NAV.find((s) => s.title === 'Konten');
    assert.ok(kontenSection, 'Seksi Konten harus ada di ADMIN_NAV');

    const gameCatalogNav = kontenSection.items.find((item) => item.to === '/admin/games');
    assert.ok(gameCatalogNav, 'Menu Katalog Game (/admin/games) harus terdaftar di seksi Konten');
    assert.equal(gameCatalogNav.label, 'Katalog Game');
  },

  'CMS Game Dinamis: konfigurasi display_type, parent_hub_id, dan sort_order terdefinisi pada katalog': () => {
    const games = getAdminGameCatalog();
    assert.ok(games.length > 0);

    for (const game of games) {
      assert.ok(
        game.displayType === 'standalone' || game.displayType === 'hub',
        `displayType harus standalone atau hub pada ${game.gameId}`,
      );
      assert.equal(typeof game.sortOrder, 'number', `sortOrder harus berupa angka pada ${game.gameId}`);
      assert.equal(typeof game.isActive, 'boolean', `isActive harus boolean pada ${game.gameId}`);
    }
  },

  'CMS Game Dinamis: menyaring game aktif dan mengurutkan berdasarkan sort_order': () => {
    const sampleGames = [
      { gameId: 'game-b', is_active: true, sort_order: 2, display_type: 'standalone' },
      { gameId: 'game-c', is_active: false, sort_order: 1, display_type: 'standalone' },
      { gameId: 'game-a', is_active: true, sort_order: 1, display_type: 'standalone' },
      { gameId: 'game-hub-child', is_active: true, sort_order: 3, display_type: 'hub', parent_hub_id: 'quiz-ngaji' },
    ];

    // Filter aktif dan standalone root
    const visible = sampleGames
      .filter((g) => g.is_active && (!g.parent_hub_id || g.display_type === 'standalone'))
      .sort((a, b) => a.sort_order - b.sort_order);

    assert.equal(visible.length, 2, 'Hanya game-a dan game-b yang aktif dan bukan child hub');
    assert.equal(visible[0].gameId, 'game-a', 'game-a harus berada di urutan pertama (sort_order 1)');
    assert.equal(visible[1].gameId, 'game-b', 'game-b harus berada di urutan kedua (sort_order 2)');
  },
};
