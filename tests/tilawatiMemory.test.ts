import assert from 'node:assert/strict';
import React from 'react';
import {
  getArenaKartuMateri,
  getArenaKartuPairs,
  getArabicFontSizeClass,
  type PatternType,
} from '../src/features/ngaji-ceria/utils/tilawatiTrainingDataAdapter';
import {
  MEMORY_LEVELS_CONFIG,
  getMemoryLevelConfig,
  calculateMemoryStars,
} from '../src/features/ngaji-ceria/data/tilawatiMemoryData';
import { useTilawatiMemoryStore } from '../src/features/ngaji-ceria/hooks/useTilawatiMemoryStore';
import TilawatiMemoryPage from '../src/features/ngaji-ceria/pages/games/tilawati-memory/TilawatiMemoryPage';
import TilawatiMemorySelectPage from '../src/features/ngaji-ceria/pages/games/tilawati-memory/TilawatiMemorySelectPage';
import { isTilaCompanionExcluded } from '../src/components/ui/TilaCompanion';

export const tests = {
  'MEMORY_LEVELS_CONFIG: memuat 4 level kesulitan bertahap dengan konfigurasi pasangan dan waktu yang tepat': () => {
    // Level 1: 3 pasang, 6 kartu, 60s
    const l1 = getMemoryLevelConfig(1);
    assert.equal(l1.level, 1);
    assert.equal(l1.pairsCount, 3);
    assert.equal(l1.cardsCount, 6);
    assert.equal(l1.timeLimitSeconds, 60);

    // Level 2: 4 pasang, 8 kartu, 90s
    const l2 = getMemoryLevelConfig(2);
    assert.equal(l2.level, 2);
    assert.equal(l2.pairsCount, 4);
    assert.equal(l2.cardsCount, 8);
    assert.equal(l2.timeLimitSeconds, 90);

    // Level 3: 6 pasang, 12 kartu, 120s
    const l3 = getMemoryLevelConfig(3);
    assert.equal(l3.level, 3);
    assert.equal(l3.pairsCount, 6);
    assert.equal(l3.cardsCount, 12);
    assert.equal(l3.timeLimitSeconds, 120);

    // Level 4: 8 pasang, 16 kartu, 150s
    const l4 = getMemoryLevelConfig(4);
    assert.equal(l4.level, 4);
    assert.equal(l4.pairsCount, 8);
    assert.equal(l4.cardsCount, 16);
    assert.equal(l4.timeLimitSeconds, 150);

    // Fallback untuk level di luar rentang
    const fallback = getMemoryLevelConfig(999);
    assert.equal(fallback.level, 1, 'Fallback harus kembali ke level 1');
  },

  'calculateMemoryStars: menghitung bintang berdasarkan sisa waktu (>=50% 3 bintang, >=20% 2 bintang, sisanya 1 bintang)': () => {
    // 60 detik total
    assert.equal(calculateMemoryStars(40, 60), 3, 'Sisa 40/60 (66%) -> 3 bintang');
    assert.equal(calculateMemoryStars(30, 60), 3, 'Sisa 30/60 (50%) -> 3 bintang');
    assert.equal(calculateMemoryStars(25, 60), 2, 'Sisa 25/60 (41%) -> 2 bintang');
    assert.equal(calculateMemoryStars(12, 60), 2, 'Sisa 12/60 (20%) -> 2 bintang');
    assert.equal(calculateMemoryStars(5, 60), 1, 'Sisa 5/60 (8%) -> 1 bintang');
    assert.equal(calculateMemoryStars(0, 60), 1, 'Sisa 0/60 (0%) -> 1 bintang');
  },

  'useTilawatiMemoryStore: mengelola unlock level bertahap dan persistensi rekor': () => {
    useTilawatiMemoryStore.getState().resetProgress();

    // Default: Level 1 terbuka untuk Jilid 1, level 2-4 masih terkunci
    assert.equal(useTilawatiMemoryStore.getState().getUnlockedLevel(1), 1);
    assert.equal(useTilawatiMemoryStore.getState().isLevelUnlocked(1, 1), true);
    assert.equal(useTilawatiMemoryStore.getState().isLevelUnlocked(1, 2), false);

    // Menyelesaikan level 1 dengan 3 bintang
    const result1 = useTilawatiMemoryStore.getState().recordLevelComplete(1, 1, 3, 25, 300);
    assert.equal(result1.isNewUnlock, true, 'Menyelesaikan level 1 harus membuka level baru');
    assert.equal(result1.nextLevel, 2, 'Level berikutnya adalah 2');

    // Level 2 sekarang terbuka
    assert.equal(useTilawatiMemoryStore.getState().getUnlockedLevel(1), 2);
    assert.equal(useTilawatiMemoryStore.getState().isLevelUnlocked(1, 2), true);
    assert.equal(useTilawatiMemoryStore.getState().isLevelUnlocked(1, 3), false);

    // Menyelesaikan level 1 lagi tidak membuka level baru lagi
    const resultRepeat = useTilawatiMemoryStore.getState().recordLevelComplete(1, 1, 2, 35, 200);
    assert.equal(resultRepeat.isNewUnlock, false);

    // Rekor bintang dan skor tersimpan dengan nilai terbaik
    const rec1 = useTilawatiMemoryStore.getState().levelRecords['1-1'];
    assert.ok(rec1, 'Rekor 1-1 harus tersimpan');
    assert.equal(rec1.stars, 3, 'Bintang terbaik (3) harus tetap dipertahankan');
    assert.equal(rec1.bestScore, 300, 'Skor terbaik (300) harus dipertahankan');
    assert.equal(rec1.bestTimeSeconds, 25, 'Waktu tercepat (25s) harus dipertahankan');

    // Selesaikan level 2 -> buka level 3
    const result2 = useTilawatiMemoryStore.getState().recordLevelComplete(1, 2, 3, 40, 500);
    assert.equal(result2.isNewUnlock, true);
    assert.equal(result2.nextLevel, 3);
    assert.equal(useTilawatiMemoryStore.getState().isLevelUnlocked(1, 3), true);

    // Reset progress
    useTilawatiMemoryStore.getState().resetProgress();
    assert.equal(useTilawatiMemoryStore.getState().getUnlockedLevel(1), 1);
  },

  'Tilawati Memory Match: menghasilkan pasangan kartu dinamis sesuai level (8, 12, 16, 20 kartu)': async () => {
    for (let j = 1; j <= 6; j++) {
      const pairs = await getArenaKartuPairs(j, 4);
      const hasData = pairs.some(c => c.text.length > 0);
      if (!hasData) continue; // Jilid tanpa audioUrl tetap dilanjutkan

      // Level 1: 4 pasang -> 8 kartu
      const cardsL1 = await getArenaKartuPairs(j, 4);
      assert.equal(cardsL1.length, 8, `Jilid ${j} Level 1 harus menghasilkan 8 kartu`);

      // Level 2: 6 pasang -> 12 kartu
      const cardsL2 = await getArenaKartuPairs(j, 6);
      assert.equal(cardsL2.length, 12, `Jilid ${j} Level 2 harus menghasilkan 12 kartu`);

      // Level 3: 8 pasang -> 16 kartu
      const cardsL3 = await getArenaKartuPairs(j, 8);
      assert.equal(cardsL3.length, 16, `Jilid ${j} Level 3 harus menghasilkan 16 kartu`);

      // Level 4: 10 pasang -> 20 kartu
      const cardsL4 = await getArenaKartuPairs(j, 10);
      assert.equal(cardsL4.length, 20, `Jilid ${j} Level 4 harus menghasilkan 20 kartu`);

      // Validasi integritas kartu di Level 4
      const pairCounts = new Map<string, number>();
      for (const c of cardsL4) {
        assert.ok(c.id, 'ID kartu tidak boleh kosong');
        assert.ok(c.pairId, 'Pair ID tidak boleh kosong');
        assert.ok(c.text.length > 0, 'Teks Arab tidak boleh kosong');
        pairCounts.set(c.pairId, (pairCounts.get(c.pairId) || 0) + 1);
      }
      assert.equal(pairCounts.size, 10, `Harus ada 10 pasangan unik`);
      for (const [pairId, count] of pairCounts.entries()) {
        assert.equal(count, 2, `Setiap pairId (${pairId}) harus memiliki tepat 2 kartu kembar`);
      }
    }
  },

  'Tilawati Memory Match: getArabicFontSizeClass responsif terhadap panjang teks pendek (Jilid 1) dan panjang (Jilid 6)': () => {
    // Teks pendek Jilid 1 (e.g. 'اَ بَ') -> text-3xl / text-4xl
    const shortTextClass = getArabicFontSizeClass('اَ بَ');
    assert.ok(shortTextClass.includes('text-3xl') || shortTextClass.includes('text-4xl'));

    // Teks panjang Jilid 6 (e.g. 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ') -> text-lg / text-sm
    const longText = 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ';
    const longTextClass = getArabicFontSizeClass(longText);
    assert.ok(
      longTextClass.includes('text-lg') ||
      longTextClass.includes('text-sm') ||
      longTextClass.includes('text-xl')
    );
  },

  'isTilaCompanionExcluded: menyembunyikan maskot di rute game Tilawati Memory (termasuk rute berlevel)': () => {
    // Game Tilawati Memory harus menyembunyikan maskot agar layar fokus
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/games/memory/1'), true);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/games/memory/1/2'), true);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/games/memory/select'), true);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/games/tilawati-memory'), true);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/games/tilawati-memory/1'), true);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/games/tilawati-memory/1/3'), true);

    // Halaman daftar mini games tetap menampilkan maskot
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/games'), false);
  },

  'TilawatiMemoryPage & TilawatiMemorySelectPage: terdefinisi sebagai fungsi komponen React': () => {
    assert.equal(typeof TilawatiMemoryPage, 'function');
    assert.equal(typeof TilawatiMemorySelectPage, 'function');

    assert.ok(React.isValidElement(React.createElement(TilawatiMemoryPage)));
    assert.ok(React.isValidElement(React.createElement(TilawatiMemorySelectPage)));
  },

  'getArenaKartuMateri: setiap kartu memiliki patternType yang valid (salah satu dari 6 tipe)': async () => {
    for (let j = 1; j <= 6; j++) {
      const cards = await getArenaKartuMateri(j);
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
