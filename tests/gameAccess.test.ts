import assert from 'node:assert/strict';
import {
  generateJoinCode,
  normalizeJoinCode,
  JOIN_CODE_LENGTH,
} from '../src/lib/joinCode.ts';
import {
  tierForRole,
  isGameOpen,
  isJilidOpen,
} from '../src/features/ngaji-ceria/data/gameAccess.ts';

export const tests = {
  'generateJoinCode: 6 karakter dari alfabet aman': () => {
    const code = generateJoinCode();
    assert.equal(code.length, JOIN_CODE_LENGTH);
    for (const char of code) {
      assert.ok('ABCDEFGHJKMNPQRSTUVWXYZ23456789'.includes(char));
    }
  },

  'generateJoinCode: deterministik dengan random terkontrol': () => {
    let call = 0;
    const sequence = [0, 0.49, 0.999, 0.02, 0.77, 0.135];
    const code = generateJoinCode(() => sequence[call++ % sequence.length]);
    assert.equal(code, 'AS9A2E');
  },

  'normalizeJoinCode membuang pemisah dan mengkapitalkan': () => {
    assert.equal(normalizeJoinCode(' ab c12 '), 'ABC12');
    assert.equal(normalizeJoinCode('a-b!Z9#'), 'ABZ9');
    assert.equal(normalizeJoinCode('xyz123'), 'XYZ123');
  },

  'tierForRole: superadmin & alias ternormalisasi, tamu tetap guest': () => {
    assert.equal(tierForRole('SUPER_ADMIN'), 'superadmin');
    assert.equal(tierForRole('superadmin'), 'superadmin');
    assert.equal(tierForRole('tartila_admin'), 'superadmin');
    assert.equal(tierForRole('ustadz'), 'member');
    assert.equal(tierForRole('member'), 'member');
    assert.equal(tierForRole(undefined), 'guest');
    assert.equal(tierForRole(null), 'guest');
  },

  'akses game: tamu terbatas, member semua terbuka': () => {
    assert.equal(isGameOpen('hijaiyah-pop', 'guest'), true);
    assert.equal(isGameOpen('hijaiyah-pop', 'member'), true);
    assert.equal(isGameOpen('sholat-hero', 'guest'), false);
    assert.equal(isGameOpen('sholat-hero', 'member'), true);
    assert.equal(isGameOpen('hijaiyah-burst', 'guest'), true);
  },

  'akses jilid: tamu hanya 1-2, member 1-5, jilid 6 tertutup': () => {
    assert.equal(isJilidOpen(1, 'guest'), true);
    assert.equal(isJilidOpen(2, 'guest'), true);
    assert.equal(isJilidOpen(3, 'guest'), false);
    assert.equal(isJilidOpen(5, 'member'), true);
    assert.equal(isJilidOpen(6, 'member'), false);
  },
};

