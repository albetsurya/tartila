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
    assert.equal(isUnlimitedUser({ role: 'admin' }), false); // Admin Sambung Ngaji tidak bypass koin/tiket di Tartila
    assert.equal(isUnlimitedUser({ role: 'admin', is_vip: true }), false);
    assert.equal(isUnlimitedUser({ role: 'admin' }, true), false);
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

    // UI Streak & Kalender sinkron instan: hydrateActivity langsung mencatat today & streak
    const { getNgajiActivity } = require('../src/features/ngaji-ceria/hooks/useNgajiCeriaStore.ts');
    const act = getNgajiActivity();
    assert.equal(act.lastPlayedAt, today);
    assert.ok(act.currentStreak >= 1);

    // Klaim kedua pada hari yang sama harus ditolak
    const okSecond = await useEconomyStore.getState().claimDailyReward(1, 10, { userId: testUserId });
    assert.equal(okSecond, false);

    // Klaim tamu (tanpa user) harus ditolak
    store.clear();
    useEconomyStore.setState({ userId: null, lastDailyClaimDate: null });
    const okGuest = await useEconomyStore.getState().claimDailyReward(1, 10);
    assert.equal(okGuest, false);
  },

  'syncDailyRewardFromProfile: sinkronisasi login_streak dan siklus klaim dari database': () => {
    setupMockStorage();
    const today = getTodayDateKey();

    // Kasus 1: User punya streak 2 dan sudah klaim hari ini
    useEconomyStore.getState().syncDailyRewardFromProfile({
      login_streak: 2,
      last_claim_date: today,
      daily_claimed: true,
      coins: 150,
    });
    let state = useEconomyStore.getState();
    assert.equal(state.loginStreak, 2);
    assert.equal(state.dailyClaimed, true);
    assert.equal(state.lastDailyClaimDate, today);
    assert.deepEqual(state.dailyRewardsClaimed, [1, 2]);
    assert.equal(useEconomyStore.getState().isRewardClaimedToday(), true);

    // Kasus 2: User punya streak 3 dan belum klaim hari ini (kemarin klaim)
    useEconomyStore.getState().syncDailyRewardFromProfile({
      login_streak: 3,
      last_claim_date: '2026-10-23',
      daily_claimed: false,
      coins: 200,
    });
    state = useEconomyStore.getState();
    assert.equal(state.loginStreak, 3);
    assert.equal(state.dailyClaimed, false);
    assert.deepEqual(state.dailyRewardsClaimed, [1, 2, 3]);
    assert.equal(useEconomyStore.getState().isRewardClaimedToday(), false);
  },

  'hydrateActivity & streakDays: menghitung barisan streak dan sinkronisasi hari': () => {
    const store = setupMockStorage();
    const { hydrateActivity, getNgajiActivity } = require('../src/features/ngaji-ceria/hooks/useNgajiCeriaStore.ts');
    const { activityDate } = require('../src/features/ngaji-ceria/utils/activityDate.ts');

    const todayStr = activityDate();
    hydrateActivity(todayStr, 3);

    const activity = getNgajiActivity();
    assert.equal(activity.currentStreak, 3);
    assert.equal(activity.lastPlayedAt, todayStr);
    assert.equal(activity.streakDays.filter(Boolean).length, 3);

    // Verifikasi pemetaan hari Senin = 0, Minggu = 6
    const sunday = new Date('2026-10-25T12:00:00Z'); // Hari Minggu (getDay() = 0)
    assert.equal((sunday.getDay() + 6) % 7, 6);

    const monday = new Date('2026-10-26T12:00:00Z'); // Hari Senin (getDay() = 1)
    assert.equal((monday.getDay() + 6) % 7, 0);

    const friday = new Date('2026-10-23T12:00:00Z'); // Hari Jumat (getDay() = 5)
    assert.equal((friday.getDay() + 6) % 7, 4);
  },

  'activityDate & getTimeUntilDailyResetWib: Fixed Reset Time 04:00 Pagi WIB': () => {
    const {
      activityDate,
      yesterdayActivityDate,
      getTimeUntilDailyResetWib,
      DAILY_RESET_HOUR_WIB,
    } = require('../src/features/ngaji-ceria/utils/activityDate.ts');

    assert.equal(DAILY_RESET_HOUR_WIB, 4);

    // 2026-10-25 03:30 WIB adalah 2026-10-24 20:30 UTC -> harus dianggap masih 2026-10-24
    const earlyMorningWIB = new Date('2026-10-24T20:30:00Z');
    assert.equal(activityDate(earlyMorningWIB), '2026-10-24');
    assert.equal(yesterdayActivityDate(earlyMorningWIB), '2026-10-23');

    // 2026-10-25 04:00 WIB adalah 2026-10-24 21:00 UTC -> hari baru 2026-10-25 dimulai
    const resetTimeWIB = new Date('2026-10-24T21:00:00Z');
    assert.equal(activityDate(resetTimeWIB), '2026-10-25');
    assert.equal(yesterdayActivityDate(resetTimeWIB), '2026-10-24');

    // 2026-10-25 23:30 WIB adalah 2026-10-25 16:30 UTC -> hari ini 2026-10-25
    const lateNightWIB = new Date('2026-10-25T16:30:00Z');
    assert.equal(activityDate(lateNightWIB), '2026-10-25');
    assert.equal(yesterdayActivityDate(lateNightWIB), '2026-10-24');

    // Countdown timer menuju jam 04:00 WIB:
    // Pada 03:00 WIB (20:00 UTC), sisa waktu = 1 jam
    const timeAt0300WIB = new Date('2026-10-24T20:00:00Z');
    const timer1 = getTimeUntilDailyResetWib(timeAt0300WIB);
    assert.equal(timer1.hours, 1);
    assert.equal(timer1.minutes, 0);
    assert.equal(timer1.formatted, '01 Jam 00 Menit');

    // Pada 22:45 WIB (15:45 UTC), sisa waktu menuju 04:00 WIB besok = 5 jam 15 menit
    const timeAt2245WIB = new Date('2026-10-25T15:45:00Z');
    const timer2 = getTimeUntilDailyResetWib(timeAt2245WIB);
    assert.equal(timer2.hours, 5);
    assert.equal(timer2.minutes, 15);
    assert.equal(timer2.formatted, '05 Jam 15 Menit');
  },
};
