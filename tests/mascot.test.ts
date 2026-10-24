import assert from 'node:assert/strict';
import {
  resolveMascotGender,
  getMascotName,
  getMascotFullLabel,
  isAccessoryAllowedForGender,
  getDefaultAccessoryForGender,
  resolveAccessoryForGender,
} from '../src/utils/mascotHelper.ts';
import {
  MASCOT_BOY_NAME,
  MASCOT_GIRL_NAME,
  MASCOT_NAME,
} from '../src/constants/mascot.ts';
import { SKIN_ITEMS } from '../src/features/ngaji-ceria/data/shopData.ts';

export const tests = {
  'konstanta nama maskot resmi': () => {
    assert.equal(MASCOT_BOY_NAME, 'Tito');
    assert.equal(MASCOT_GIRL_NAME, 'Tila');
    assert.equal(MASCOT_NAME, 'Tito');
  },

  'resolusi gender maskot': () => {
    assert.equal(resolveMascotGender('boy'), 'boy');
    assert.equal(resolveMascotGender('girl'), 'girl');
    assert.equal(resolveMascotGender('female'), 'girl');
    assert.equal(resolveMascotGender('P'), 'girl');
    assert.equal(resolveMascotGender('perempuan'), 'girl');
    assert.equal(resolveMascotGender('wanita'), 'girl');
    assert.equal(resolveMascotGender('tila'), 'girl');
    assert.equal(resolveMascotGender('betina'), 'girl');
    assert.equal(resolveMascotGender('male'), 'boy');
    assert.equal(resolveMascotGender('L'), 'boy');
    assert.equal(resolveMascotGender('jantan'), 'boy');
    assert.equal(resolveMascotGender(undefined), 'boy');
    assert.equal(resolveMascotGender(null), 'boy');
    assert.equal(resolveMascotGender(''), 'boy');
  },

  'getMascotName dinamis sesuai gender': () => {
    assert.equal(getMascotName('boy'), 'Tito');
    assert.equal(getMascotName('girl'), 'Tila');
    assert.equal(getMascotName('betina'), 'Tila');
    assert.equal(getMascotName('jantan'), 'Tito');
    assert.equal(getMascotName('P'), 'Tila');
    assert.equal(getMascotName('L'), 'Tito');
    assert.equal(getMascotName(undefined), 'Tito');
    assert.equal(getMascotName(null), 'Tito');
  },

  'getMascotFullLabel menampilkan nama dan karakter': () => {
    assert.equal(getMascotFullLabel('boy'), 'Tito (Putra)');
    assert.equal(getMascotFullLabel('girl'), 'Tila (Putri)');
    assert.equal(getMascotFullLabel('jantan'), 'Tito (Putra)');
    assert.equal(getMascotFullLabel('betina'), 'Tila (Putri)');
  },

  'validasi izin aksesoris per gender': () => {
    // Boy (Tito Santri)
    assert.equal(isAccessoryAllowedForGender('peci', 'boy'), true);
    assert.equal(isAccessoryAllowedForGender('glasses', 'boy'), true);
    assert.equal(isAccessoryAllowedForGender('crown', 'boy'), true);
    assert.equal(isAccessoryAllowedForGender('none', 'boy'), true);
    assert.equal(isAccessoryAllowedForGender('hairbow', 'boy'), false);
    assert.equal(isAccessoryAllowedForGender('flowercrown', 'boy'), false);

    // Girl (Tila Santri Putri)
    assert.equal(isAccessoryAllowedForGender('hairbow', 'girl'), true);
    assert.equal(isAccessoryAllowedForGender('flowercrown', 'girl'), true);
    assert.equal(isAccessoryAllowedForGender('glasses', 'girl'), true);
    assert.equal(isAccessoryAllowedForGender('crown', 'girl'), true);
    assert.equal(isAccessoryAllowedForGender('none', 'girl'), true);
    assert.equal(isAccessoryAllowedForGender('peci', 'girl'), false);
  },

  'aksesoris default per gender': () => {
    assert.equal(getDefaultAccessoryForGender('boy'), 'peci');
    assert.equal(getDefaultAccessoryForGender('girl'), 'hairbow');
  },

  'penyesuaian otomatis aksesoris jika tidak diizinkan': () => {
    // Peci pada girl dialihkan ke hairbow
    assert.equal(resolveAccessoryForGender('peci', 'girl'), 'hairbow');
    // Hairbow pada boy dialihkan ke peci
    assert.equal(resolveAccessoryForGender('hairbow', 'boy'), 'peci');
    // Aksesoris netral tetap utuh
    assert.equal(resolveAccessoryForGender('glasses', 'boy'), 'glasses');
    assert.equal(resolveAccessoryForGender('glasses', 'girl'), 'glasses');
  },

  'katalog skin maskot memuat skin default, naga, robot, dan 3 varian phoenix': () => {
    assert.equal(SKIN_ITEMS.length, 6);
    const naga = SKIN_ITEMS.find((s) => s.skinKey === 'naga');
    const robot = SKIN_ITEMS.find((s) => s.skinKey === 'robot');
    const def = SKIN_ITEMS.find((s) => s.skinKey === 'default');
    const phoenixIce = SKIN_ITEMS.find((s) => s.skinKey === 'phoenix_ice');
    const phoenixGold = SKIN_ITEMS.find((s) => s.skinKey === 'phoenix_gold');
    const phoenixDark = SKIN_ITEMS.find((s) => s.skinKey === 'phoenix_dark');

    assert.ok(naga, 'skin naga harus terdefinisi');
    assert.equal(naga.price, 800);
    assert.equal(naga.previewColors.body, '#059669');
    assert.equal(naga.previewColors.accent, '#FBBF24');
    assert.equal(naga.previewColors.belly, '#FDE68A');

    assert.ok(robot, 'skin robot harus terdefinisi');
    assert.equal(robot.price, 800);
    assert.equal(robot.previewColors.body, '#94A3B8');
    assert.equal(robot.previewColors.accent, '#06B6D4');
    assert.equal(robot.previewColors.belly, '#CBD5E1');

    assert.ok(def, 'skin default harus terdefinisi');
    assert.equal(def.price, 0);

    assert.ok(phoenixIce, 'skin phoenix ice harus terdefinisi');
    assert.equal(phoenixIce.price, 1500);
    assert.equal(phoenixIce.currency, 'coin');
    assert.equal(phoenixIce.rarity, 'Legendary');
    assert.equal(phoenixIce.previewColors.body, '#38BDF8');
    assert.equal(phoenixIce.previewColors.accent, '#F8FAFC');

    assert.ok(phoenixGold, 'skin phoenix gold harus terdefinisi');
    assert.equal(phoenixGold.price, 50);
    assert.equal(phoenixGold.currency, 'ticket');
    assert.equal(phoenixGold.rarity, 'Mythic');
    assert.equal(phoenixGold.previewColors.body, '#FBBF24');
    assert.equal(phoenixGold.previewColors.accent, '#D97706');

    assert.ok(phoenixDark, 'skin phoenix dark harus terdefinisi');
    assert.equal(phoenixDark.price, 2000);
    assert.equal(phoenixDark.currency, 'coin');
    assert.equal(phoenixDark.rarity, 'Legendary');
    assert.equal(phoenixDark.previewColors.body, '#4C1D95');
    assert.equal(phoenixDark.previewColors.accent, '#111827');
  },
};
