import assert from 'node:assert/strict';
import {
  isUnlimitedUser,
  useEconomyStore,
} from '../src/features/ngaji-ceria/hooks/useEconomyStore.ts';

export const tests = {
  'useEconomyStore applyVipSuccess: mengaktifkan status VIP dan kuota unlimited': () => {
    // Reset state ke free
    useEconomyStore.setState({
      isVip: false,
      subscriptionType: 'free',
      hearts: 5,
      tickets: 3,
    });

    assert.equal(useEconomyStore.getState().isVip, false);
    assert.equal(useEconomyStore.getState().subscriptionType, 'free');

    // Terapkan penukaran voucher VIP berhasil
    useEconomyStore.getState().applyVipSuccess(30, '2026-11-24T00:00:00Z');

    const state = useEconomyStore.getState();
    assert.equal(state.isVip, true);
    assert.equal(state.subscriptionType, 'vip');

    // Pastikan isUnlimitedUser langsung membaca status VIP
    const isUnlimited = isUnlimitedUser(null, state.isVip, null, state.subscriptionType);
    assert.equal(isUnlimited, true);
  },

  'isUnlimitedUser mengenali VIP dari store atau group_id': () => {
    // Member biasa tanpa VIP -> false
    assert.equal(isUnlimitedUser({ role: 'member' }, false, null, 'free'), false);

    // Member biasa dengan isVip = true -> true (Unlimited)
    assert.equal(isUnlimitedUser({ role: 'member' }, true, null, 'free'), true);

    // Member dengan group_id = 'vip' -> true (Unlimited)
    assert.equal(isUnlimitedUser({ role: 'member' }, false, 'vip', 'free'), true);

    // Member dengan subscriptionType = 'vip' -> true (Unlimited)
    assert.equal(isUnlimitedUser({ role: 'member' }, false, null, 'vip'), true);
  },
};
