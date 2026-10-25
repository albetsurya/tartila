import assert from 'node:assert/strict';
import React from 'react';
import {
  ExploreHeader,
  ExploreStatBadge,
} from '../src/features/ngaji-ceria/components/ExploreHeader';

export const tests = {
  'ExploreHeader dan ExploreStatBadge terdefinisi sebagai fungsi komponen React': () => {
    assert.equal(typeof ExploreHeader, 'function');
    assert.equal(typeof ExploreStatBadge, 'function');
  },

  'ExploreStatBadge merender struktur badge Neo-Brutalism dengan CSS variables scoped theme': () => {
    const badge = ExploreStatBadge({
      icon: '⭐',
      value: '42/93',
      title: 'Total Bintang',
    });

    assert.ok(React.isValidElement(badge));
    const props = badge.props as any;
    assert.equal(props.title, 'Total Bintang');
    assert.ok(props.className.includes('var(--border-color'));
    assert.ok(props.className.includes('var(--bg-card'));
    assert.ok(props.className.includes('var(--text-main'));
    assert.ok(props.className.includes('var(--shadow-color'));
  },

  'ExploreHeader menerima props standar Scoped Theme (tilawati, lab-irama, juz-amma, dll)': () => {
    // Uji struktur props untuk Peta Tilawati [Hati] [Koin] [Bintang]
    const tilawatiHeader = React.createElement(ExploreHeader, {
      title: 'Peta Tilawati',
      subtitle: 'Petualangan Mengaji',
      themeScope: 'tilawati',
      extraBadge: React.createElement(ExploreStatBadge, {
        icon: '⭐',
        value: '10/93',
      }),
    });

    assert.ok(React.isValidElement(tilawatiHeader));
    assert.equal(tilawatiHeader.props.themeScope, 'tilawati');
    assert.equal(tilawatiHeader.props.title, 'Peta Tilawati');
    assert.ok(React.isValidElement(tilawatiHeader.props.extraBadge));

    // Uji struktur props untuk Lab Irama
    const labIramaHeader = React.createElement(ExploreHeader, {
      title: 'Lab Irama',
      themeScope: 'lab-irama',
      extraBadge: React.createElement(ExploreStatBadge, {
        icon: '🏆',
        value: '100',
      }),
    });

    assert.ok(React.isValidElement(labIramaHeader));
    assert.equal(labIramaHeader.props.themeScope, 'lab-irama');
  },
};
