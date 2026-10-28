import assert from 'node:assert/strict';
import { APP_THEMES_LIST } from '../src/features/ngaji-ceria/hooks/useAppTheme.ts';
import { useEconomyStore } from '../src/features/ngaji-ceria/hooks/useEconomyStore.ts';

export const tests = {
  'APP_THEMES_LIST memuat varian tema aplikasi lengkap termasuk bekas tema game': () => {
    const ids = APP_THEMES_LIST.map((t) => t.id);
    assert.deepEqual(ids, ['default', 'sky', 'rose', 'night', 'gold', 'neon', 'retro', 'pastel']);
    assert.equal(APP_THEMES_LIST.find((t) => t.id === 'default')?.price, 0);
  },

  'useEconomyStore: manajemen kepemilikan dan penggantian tema aplikasi': async () => {
    // Reset state tema aplikasi
    useEconomyStore.setState({
      ownedAppThemes: ['default'],
      equippedAppTheme: 'default',
    });

    const store = useEconomyStore.getState();
    assert.deepEqual(store.ownedAppThemes, ['default']);
    assert.equal(store.equippedAppTheme, 'default');

    // Equip unowned theme seharusnya diabaikan
    store.equipAppTheme('night');
    assert.equal(useEconomyStore.getState().equippedAppTheme, 'default');

    // Beli tema 'night' (free mode = true)
    const success = await store.buyAppTheme('night', 300, false);
    assert.equal(success, true);
    assert.ok(useEconomyStore.getState().ownedAppThemes.includes('night'));
    // Karena autoEquip = false, equippedAppTheme masih 'default'
    assert.equal(useEconomyStore.getState().equippedAppTheme, 'default');

    // Pakaikan tema 'night'
    store.equipAppTheme('night');
    assert.equal(useEconomyStore.getState().equippedAppTheme, 'night');

    // Kembalikan ke default
    store.equipAppTheme('default');
    assert.equal(useEconomyStore.getState().equippedAppTheme, 'default');
  },
};
