import assert from 'node:assert/strict';
import {
  normalizeRole,
  isUstadzRole,
  isAdminRole,
  isUstadzUser,
  classroomRoleFor,
} from '../src/lib/roles.ts';

export const tests = {
  'normalizeRole memetakan semua format alias lama': () => {
    assert.equal(normalizeRole('tartila_admin'), 'admin');
    assert.equal(normalizeRole('Tartila Admin'), 'admin');
    assert.equal(normalizeRole('SUPER_ADMIN'), 'superadmin');
    assert.equal(normalizeRole('super admin'), 'superadmin');
    assert.equal(normalizeRole('Superadmin'), 'superadmin');
    assert.equal(normalizeRole('USTADZ'), 'ustadz');
    assert.equal(normalizeRole('Ustadzah'), 'ustadzah');
    assert.equal(normalizeRole('member'), 'member');
    assert.equal(normalizeRole('santri'), 'member');
    assert.equal(normalizeRole(''), null);
    assert.equal(normalizeRole(null), null);
    assert.equal(normalizeRole(undefined), null);
    assert.equal(normalizeRole('role-baru-tak-dikenal'), null);
  },

  'isUstadzRole hanya untuk ustadz/ustadzah': () => {
    assert.equal(isUstadzRole('ustadz'), true);
    assert.equal(isUstadzRole('USTAZAH'), true);
    assert.equal(isUstadzRole('admin'), false);
    assert.equal(isUstadzRole('superadmin'), false);
    assert.equal(isUstadzRole('member'), false);
    assert.equal(isUstadzRole(null), false);
  },

  'isAdminRole menerima admin & superadmin termasuk alias': () => {
    assert.equal(isAdminRole('admin'), true);
    assert.equal(isAdminRole('tartila_admin'), true);
    assert.equal(isAdminRole('SUPER_ADMIN'), true);
    assert.equal(isAdminRole('superadmin'), true);
    assert.equal(isAdminRole('ustadz'), false);
    assert.equal(isAdminRole('member'), false);
    assert.equal(isAdminRole(undefined), false);
  },

  'isUstadzUser memakai peran ATAU flag is_ustadz': () => {
    assert.equal(isUstadzUser({ role: 'member', is_ustadz: true }), true);
    assert.equal(isUstadzUser({ role: 'ustadzah' }), true);
    assert.equal(isUstadzUser({ role: 'member', is_ustadz: false }), false);
    assert.equal(isUstadzUser({ role: 'superadmin' }), false);
    assert.equal(isUstadzUser(null), false);
  },

  'classroomRoleFor menetapkan ustadz/murid/monitor': () => {
    assert.equal(classroomRoleFor('ustadz'), 'ustadz');
    assert.equal(classroomRoleFor('ustadzah'), 'ustadz');
    assert.equal(classroomRoleFor('tartila_admin'), 'monitor');
    assert.equal(classroomRoleFor('superadmin'), 'monitor');
    assert.equal(classroomRoleFor('member'), 'murid');
    assert.equal(classroomRoleFor(null), null);
    assert.equal(classroomRoleFor('hacker'), null);
  },
};
