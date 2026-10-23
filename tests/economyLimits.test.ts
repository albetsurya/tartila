import assert from 'node:assert/strict';
import { isUnlimitedUser } from '../src/features/ngaji-ceria/hooks/useEconomyStore.ts';

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
};
