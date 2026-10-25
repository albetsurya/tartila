import assert from 'node:assert/strict';
import {
  isPlaytestMode,
  isPlaytestOrAdminSession,
  getGameBackUrl,
  getGamePlaytestUrl,
} from '../src/lib/playtest.ts';
import { isUnlimitedUser, useEconomyStore } from '../src/features/ngaji-ceria/hooks/useEconomyStore.ts';
import {
  awardProgress,
  getLeaderboard,
  getProgress,
  recordLeaderboard,
  saveProgress,
} from '../src/features/ngaji-ceria/pages/games/_shared/progression.ts';

function setupMockBrowser(search = '', userRole: string | null = null) {
  const store = new Map<string, string>();
  if (userRole) {
    store.set(
      'tartila_cached_user',
      JSON.stringify({ id: 'USR_TEST', role: userRole }),
    );
  }
  const mockStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => store.set(key, String(val)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
  (globalThis as any).window = {
    location: {
      search,
      href: `http://localhost:5173/member/ngaji-ceria/games/hijaiyah-pop${search}`,
    },
    localStorage: mockStorage,
    sessionStorage: mockStorage,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  };
  return store;
}

export const tests = {
  'isPlaytestMode: hanya tartila_admin dan superadmin yang diizinkan playtest': () => {
    // 1. tartila_admin & superadmin dengan ?mode=playtest -> TRUE
    assert.equal(isPlaytestMode('?mode=playtest', 'tartila_admin'), true);
    assert.equal(isPlaytestMode('?mode=playtest', 'superadmin'), true);
    assert.equal(isPlaytestMode('?mode=playtest', 'SUPER_ADMIN'), true);

    // 2. admin Sambung Ngaji DILARANG playtest -> FALSE
    assert.equal(isPlaytestMode('?mode=playtest', 'admin'), false);
    assert.equal(isPlaytestMode('?mode=playtest', 'ADMIN'), false);
    assert.equal(isPlaytestMode('?mode=playtest', 'sambung_ngaji_admin'), false);

    // 3. Member, santri, ustadz, dan tamu -> FALSE
    assert.equal(isPlaytestMode('?mode=playtest', 'member'), false);
    assert.equal(isPlaytestMode('?mode=playtest', 'ustadz'), false);
    assert.equal(isPlaytestMode('?mode=playtest', null), false);

    // 4. Tanpa ?mode=playtest, admin Tartila tetap bernilai FALSE (mode member biasa)
    assert.equal(isPlaytestMode('', 'tartila_admin'), false);
    assert.equal(isPlaytestMode('?other=1', 'superadmin'), false);
  },

  'getGameBackUrl: dinamis mengarahkan ke /admin/games saat playtest': () => {
    assert.equal(getGameBackUrl('?mode=playtest'), '/admin/games');
    assert.equal(
      getGameBackUrl('?mode=playtest&cat=doa'),
      '/admin/games',
    );
    assert.equal(getGameBackUrl(''), '/member/ngaji-ceria/games');
    assert.equal(getGameBackUrl('?category=tajwid'), '/member/ngaji-ceria/games');
    assert.equal(
      getGameBackUrl('', '/custom-back'),
      '/custom-back',
    );
  },

  'getGamePlaytestUrl: menghasilkan rute playtest kanonis': () => {
    assert.equal(
      getGamePlaytestUrl('tebak-hijaiyah'),
      '/member/ngaji-ceria/games/tebak-hijaiyah?mode=playtest',
    );
    assert.equal(
      getGamePlaytestUrl('quiz-hub'),
      '/member/ngaji-ceria/quiz-hub?mode=playtest',
    );
    assert.equal(
      getGamePlaytestUrl('memory-match'),
      '/member/ngaji-ceria/games/tilawati-memory?mode=playtest',
    );
  },

  'isUnlimitedUser & isolasi energi: admin Sambung Ngaji bukan unlimited user': async () => {
    // tartila_admin & superadmin adalah unlimited
    assert.equal(isUnlimitedUser({ role: 'tartila_admin' }), true);
    assert.equal(isUnlimitedUser({ role: 'superadmin' }), true);

    // admin Sambung Ngaji BUKAN unlimited
    assert.equal(isUnlimitedUser({ role: 'admin' }), false);
    assert.equal(isUnlimitedUser({ role: 'ADMIN' }), false);
    assert.equal(isUnlimitedUser({ role: 'admin', is_vip: true }), false);

    // Uji konsumsi energi di store
    useEconomyStore.setState({
      hearts: 5,
      tickets: 3,
      isVip: false,
      role: 'admin',
    });

    const heartConsumed = await useEconomyStore.getState().consumeHeart();
    assert.equal(heartConsumed, true);
    assert.equal(useEconomyStore.getState().hearts, 4); // Berkurang, tidak unlimited!

    const ticketConsumed = await useEconomyStore.getState().consumeTicket();
    assert.equal(ticketConsumed, true);
    assert.equal(useEconomyStore.getState().tickets, 2); // Berkurang, tidak unlimited!

    // Sementara untuk tartila_admin: tidak berkurang (unlimited)
    useEconomyStore.setState({
      hearts: 5,
      tickets: 3,
      role: 'tartila_admin',
    });
    await useEconomyStore.getState().consumeHeart();
    assert.equal(useEconomyStore.getState().hearts, 5); // Tetap 5
  },

  'isolasi leaderboard & database: playtest atau admin tidak mengotori rekor santri': () => {
    setupMockBrowser('?mode=playtest', 'tartila_admin');

    const initial = getProgress();
    // awardProgress dipanggil saat mode playtest
    const res = awardProgress('hijaiyah-pop', 1500, 100);
    assert.equal(res.xp, initial.xp); // Tidak ada penambahan XP!
    assert.equal(res.coins, initial.coins); // Tidak ada penambahan koin!

    // recordLeaderboard saat mode playtest
    const lb = recordLeaderboard('hijaiyah-pop', 9999);
    assert.equal(
      lb.some((e) => e.name === 'Kamu' && e.score === 9999),
      false, // Tidak masuk ke leaderboard!
    );
  },
};
