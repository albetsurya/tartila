import assert from 'node:assert/strict';
import {
  isUnlimitedUser,
  useEconomyStore,
  getInitialUserId,
  getTodayDateKey,
} from '../src/features/ngaji-ceria/hooks/useEconomyStore.ts';
import { getNgajiCeriaScope } from '../src/features/ngaji-ceria/hooks/useNgajiCeriaStore.ts';

function setupMockStorage() {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => store.set(key, String(val)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
  (globalThis as any).window = {
    localStorage: mockStorage,
    sessionStorage: mockStorage,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  };
  return store;
}

export const tests = {
  'isUnlimitedUser: superadmin tak terbatas, ustadz ikut langganan': () => {
    assert.equal(isUnlimitedUser({ role: 'superadmin' }), true);
    assert.equal(isUnlimitedUser({ role: 'tartila_admin' }), true);
    assert.equal(isUnlimitedUser({ role: 'ustadz' }), false);
    assert.equal(
      isUnlimitedUser({ role: 'ustadz' }, false, null, 'premium'),
      true,
    );
    assert.equal(
      isUnlimitedUser({ role: 'ustadz' }, false, null, 'free'),
      false,
    );
    assert.equal(isUnlimitedUser({ role: 'member' }), false);
    assert.equal(isUnlimitedUser(null, true), true);
  },

  'userScope & initialUserId: mendeteksi akun tartila_cached_user': () => {
    const store = setupMockStorage();
    store.set(
      'tartila_cached_user',
      JSON.stringify({ id: 'USR_TEST_123', name: 'Santri Ceria' }),
    );

    assert.equal(getInitialUserId(), 'USR_TEST_123');
    assert.equal(getNgajiCeriaScope(), 'USR_TEST_123');

    // Kosongkan -> kembali guest
    store.clear();
    assert.equal(getInitialUserId(), null);
    assert.equal(getNgajiCeriaScope(), 'guest');
  },

  'claimDailyReward: berhasil untuk pengguna terdaftar dan menolak klaim ganda': async () => {
    const store = setupMockStorage();
    const today = getTodayDateKey();
    const testUserId = 'USR_DAILY_TEST';

    store.set(
      'tartila_cached_user',
      JSON.stringify({ id: testUserId, name: 'Santri Ceria' }),
    );

    // Reset state ekonomi untuk testing
    useEconomyStore.setState({
      userId: testUserId,
      lastDailyClaimDate: null,
      dailyRewardsClaimed: [],
      streakMultiplier: 1,
    });

    // Klaim pertama hari ini harus berhasil
    const okFirst = await useEconomyStore.getState().claimDailyReward(1, 10, { userId: testUserId });
    assert.equal(okFirst, true);
    assert.equal(useEconomyStore.getState().lastDailyClaimDate, today);
    assert.deepEqual(useEconomyStore.getState().dailyRewardsClaimed, [1]);

    // Klaim kedua pada hari yang sama harus ditolak
    const okSecond = await useEconomyStore.getState().claimDailyReward(1, 10, { userId: testUserId });
    assert.equal(okSecond, false);

    // Klaim tamu (tanpa user) harus ditolak
    store.clear();
    useEconomyStore.setState({ userId: null, lastDailyClaimDate: null });
    const okGuest = await useEconomyStore.getState().claimDailyReward(1, 10);
    assert.equal(okGuest, false);
  },
};
