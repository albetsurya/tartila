import assert from 'node:assert/strict';
import {
  normalizeRole,
  isUstadzRole,
  isAdminRole,
  isTartilaAdmin,
  isSambungNgajiAdmin,
  isUstadzUser,
  classroomRoleFor,
} from '../src/lib/roles.ts';

export const tests = {
  'normalizeRole memisahkan admin vs tartila_admin vs superadmin': () => {
    assert.equal(normalizeRole('tartila_admin'), 'tartila_admin');
    assert.equal(normalizeRole('Tartila Admin'), 'tartila_admin');
    assert.equal(normalizeRole('admin'), 'admin');
    assert.equal(normalizeRole('Admin'), 'admin');
    assert.equal(normalizeRole('sambung_ngaji_admin'), 'admin');
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
    assert.equal(isUstadzRole('tartila_admin'), false);
    assert.equal(isUstadzRole('superadmin'), false);
    assert.equal(isUstadzRole('member'), false);
    assert.equal(isUstadzRole(null), false);
  },

  'isAdminRole & isTartilaAdmin HANYA menerima tartila_admin & superadmin (menolak admin Sambung Ngaji)': () => {
    // Admin Sambung Ngaji TIDAK BERHAK masuk ke Tartila Admin
    assert.equal(isAdminRole('admin'), false);
    assert.equal(isTartilaAdmin('admin'), false);

    // Tartila Admin & Superadmin berhak
    assert.equal(isAdminRole('tartila_admin'), true);
    assert.equal(isTartilaAdmin('tartila_admin'), true);
    assert.equal(isAdminRole('SUPER_ADMIN'), true);
    assert.equal(isAdminRole('SUPER ADMIN'), true);
    assert.equal(isTartilaAdmin('SUPER ADMIN'), true);
    assert.equal(isAdminRole('superadmin'), true);
    assert.equal(isTartilaAdmin('superadmin'), true);
    assert.equal(isTartilaAdmin('super_admin'), true);
    assert.equal(isTartilaAdmin('superadmin1'), true);
    assert.equal(isTartilaAdmin('SUPERADMIN1'), true);

    // Lainnya ditolak
    assert.equal(isAdminRole('ustadz'), false);
    assert.equal(isAdminRole('member'), false);
    assert.equal(isAdminRole(undefined), false);
  },

  'isSambungNgajiAdmin menerima admin & superadmin': () => {
    assert.equal(isSambungNgajiAdmin('admin'), true);
    assert.equal(isSambungNgajiAdmin('superadmin'), true);
    assert.equal(isSambungNgajiAdmin('SUPER_ADMIN'), true);
    assert.equal(isSambungNgajiAdmin('tartila_admin'), false);
    assert.equal(isSambungNgajiAdmin('member'), false);
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
    // Admin Sambung Ngaji diperlakukan sebagai murid biasa di kelas Tartila
    assert.equal(classroomRoleFor('admin'), 'murid');
    assert.equal(classroomRoleFor('member'), 'murid');
    assert.equal(classroomRoleFor(null), null);
    assert.equal(classroomRoleFor('hacker'), null);
  },
};
