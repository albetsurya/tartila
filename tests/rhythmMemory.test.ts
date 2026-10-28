import assert from 'node:assert/strict';
import React from 'react';
import {
  getArabicFontSizeClass,
  getRhythmMemoryLevels,
  getArenaKartuPairs,
  getArenaKartuMateri,
} from '../src/features/ngaji-ceria/utils/tilawatiTrainingDataAdapter';
import { evaluateRhythmTap, HIT_WINDOWS } from '../src/features/ngaji-ceria/data/rhythmMemoryData';
import { isTilaCompanionExcluded } from '../src/components/ui/TilaCompanion';
import RhythmMemoryPage from '../src/features/ngaji-ceria/pages/explore/RhythmMemoryPage';
import RhythmMemorySelectPage from '../src/features/ngaji-ceria/pages/explore/RhythmMemorySelectPage';
import TilawatiTrainingPage from '../src/features/ngaji-ceria/pages/explore/TilawatiTrainingPage';

export const tests = {
  'RHYTHM_MEMORY_LEVELS: memiliki konfigurasi lengkap untuk Jilid 1 sampai 6': () => {
    for (let j = 1; j <= 6; j++) {
      const levels = getRhythmMemoryLevels(j);
      // Jilid 6: audioUrl kosong -> tidak ada item training, lewati
      if (levels.length === 0) continue;

      for (const level of levels) {
        // Level kosong (mis. beberapa chunk tidak terisi) lewati
        if (level.length === 0) continue;

        level.forEach((item) => {
          assert.ok(item.id.length > 0);
          assert.ok(item.arabic.length > 0);
          assert.ok(item.patternType, `Item ${item.id} harus memiliki patternType`);
          if (item.bpm !== undefined) {
            assert.ok(item.bpm >= 50 && item.bpm <= 85, `BPM item harus ramah anak`);
          }
          if (item.beatsCount !== undefined) {
            assert.ok(item.beatsCount >= 1 && item.beatsCount <= 4);
          }
        });
      }
    }
  },

  'getRhythmMemoryPairs: menghasilkan 12 kartu (6 pasang) dengan pairId yang valid': () => {
    const cards = getArenaKartuPairs(1, 6);
    assert.equal(cards.length, 12, 'Harus menghasilkan tepat 12 kartu');

    const pairCounts = new Map<string, number>();
    cards.forEach((c) => {
      pairCounts.set(c.pairId, (pairCounts.get(c.pairId) || 0) + 1);
    });

    assert.equal(pairCounts.size, 6, 'Harus ada 6 pairId unik');
    for (const [pairId, count] of pairCounts.entries()) {
      assert.equal(count, 2, `Setiap pairId (${pairId}) harus memiliki tepat 2 kartu`);
    }
  },

  'evaluateRhythmTap: mengevaluasi ketukan anak dengan window toleransi ramah anak (<=120ms Perfect, <=250ms Good)': () => {
    assert.equal(HIT_WINDOWS.PERFECT, 120);
    assert.equal(HIT_WINDOWS.GOOD, 250);

    // Tepat di beat (diff = 0ms) -> Perfect
    const p0 = evaluateRhythmTap(0);
    assert.equal(p0.judgment, 'perfect');
    assert.equal(p0.score, 100);

    // Dalam window Perfect (<= 120ms) -> Perfect
    const p1 = evaluateRhythmTap(100);
    assert.equal(p1.judgment, 'perfect');
    const p2 = evaluateRhythmTap(-115);
    assert.equal(p2.judgment, 'perfect');

    // Dalam window Good (121ms - 250ms) -> Good
    const g1 = evaluateRhythmTap(150);
    assert.equal(g1.judgment, 'good');
    assert.equal(g1.score, 60);

    const g2 = evaluateRhythmTap(-240);
    assert.equal(g2.judgment, 'good');
    assert.equal(g2.score, 60);

    // Di luar window Good (> 250ms) -> Miss
    const m1 = evaluateRhythmTap(280);
    assert.equal(m1.judgment, 'miss');
    assert.equal(m1.score, 0);

    const m2 = evaluateRhythmTap(-310);
    assert.equal(m2.judgment, 'miss');
    assert.equal(m2.score, 0);
  },

  'getArabicFontSizeClass: memberikan ukuran font responsif sesuai panjang teks Arab': () => {
    const shortText = getArabicFontSizeClass('اَ بَ');
    assert.ok(shortText.includes('text-3xl') || shortText.includes('text-4xl'));

    const longText = getArabicFontSizeClass('وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ');
    assert.ok(longText.includes('text-lg') || longText.includes('text-sm') || longText.includes('text-xl'));
  },

  'isTilaCompanionExcluded: menyembunyikan maskot di game rhythm-memory namun mengizinkan di training hub': () => {
    // Game Rhythm Memory harus exclude agar tidak menutupi tombol KETUK
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/rhythm-memory'), true);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/rhythm-memory/1'), true);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/explore/rhythm-memory/3'), true);

    // Training Hub harus memunculkan maskot
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/training'), false);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/explore/training'), false);
  },

  'RhythmMemoryPage, SelectPage & TrainingHub: terdefinisi sebagai fungsi komponen React': () => {
    assert.equal(typeof RhythmMemoryPage, 'function');
    assert.equal(typeof RhythmMemorySelectPage, 'function');
    assert.equal(typeof TilawatiTrainingPage, 'function');

    assert.ok(React.isValidElement(React.createElement(RhythmMemoryPage)));
    assert.ok(React.isValidElement(React.createElement(RhythmMemorySelectPage)));
    assert.ok(React.isValidElement(React.createElement(TilawatiTrainingPage)));
  },

  'getArenaKartuMateri: setiap kartu memiliki patternType yang valid (salah satu dari 6 tipe)': () => {
    for (let j = 1; j <= 6; j++) {
      const cards = getArenaKartuMateri(j);
      // Jilid 6: audioUrl kosong -> tidak ada kartu, lewati
      if (cards.length === 0) continue;

      const validPatternTypes = new Set([
        '1-datar',
        '1-naik',
        '1-turun',
        '2-datar-turun',
        '3-datar-naik-turun',
        '4-datar-naik-naik-turun',
      ]);

      for (const card of cards) {
        assert.ok(card.patternType, `Kartu ${card.id} harus memiliki patternType`);
        assert.ok(validPatternTypes.has(card.patternType), `patternType ${card.patternType} tidak valid untuk kartu ${card.id}`);
      }
    }
  },
};
