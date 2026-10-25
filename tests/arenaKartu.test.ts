import assert from 'node:assert/strict';
import React from 'react';
import {
  ARENA_KARTU_DATA,
  getArenaKartuPairs,
  getArenaKartuMateri,
  getArenaKartuCardById,
  getArabicFontSizeClass,
} from '../src/features/ngaji-ceria/data/arenaKartuData';
import ArenaKartuSelectPage from '../src/features/ngaji-ceria/pages/explore/ArenaKartuSelectPage';
import ArenaKartuPage from '../src/features/ngaji-ceria/pages/explore/ArenaKartuPage';
import KartuPracticePage from '../src/features/ngaji-ceria/pages/explore/KartuPracticePage';
import { useEconomyStore } from '../src/features/ngaji-ceria/hooks/useEconomyStore';
import { isTilaCompanionExcluded } from '../src/components/ui/TilaCompanion';

export const tests = {
  'ARENA_KARTU_DATA: memiliki data lengkap Jilid 1 sampai 6 dengan 12 kartu materi': () => {
    assert.equal(ARENA_KARTU_DATA.length, 6);
    for (let j = 1; j <= 6; j++) {
      const level = ARENA_KARTU_DATA.find((item) => item.jilid === j);
      assert.ok(level, `Jilid ${j} harus ada`);
      assert.ok(level.title.includes(`Jilid ${j}`), `Title harus menyebutkan Jilid ${j}`);
      assert.ok(level.subtitle.length > 0, `Subtitle harus terisi`);
      assert.equal(level.cards.length, 12, `Tiap jilid harus memiliki tepat 12 kartu materi`);
      level.cards.forEach((card, idx) => {
        assert.equal(card.cardIndex, idx + 1, `Indeks kartu harus berurutan 1 sampai 12`);
        assert.ok(card.id.length > 0, 'Card ID harus terisi');
        assert.ok(card.text.length > 0, 'Teks Arab harus terisi');
        assert.ok(card.transliteration.length > 0, 'Transliterasi harus terisi');
      });
    }
  },

  'getArenaKartuMateri & getArenaKartuCardById: mengembalikan data kartu dengan tepat': () => {
    const cards = getArenaKartuMateri(1);
    assert.equal(cards.length, 12);
    assert.equal(cards[0].id, 'j1-c1');

    const card = getArenaKartuCardById(1, 'j1-c1');
    assert.ok(card);
    assert.equal(card.text, 'اَ');
    assert.equal(card.cardIndex, 1);
  },

  'getArenaKartuPairs: menghasilkan 12 kartu (6 pasang cocok) untuk backward compatibility': () => {
    const pairs = getArenaKartuPairs(1, 6);
    assert.equal(pairs.length, 12, 'Harus menghasilkan 12 kartu');

    const pairCounts: Record<string, number> = {};
    for (const card of pairs) {
      assert.ok(card.id, 'Setiap kartu memiliki ID unik');
      assert.ok(card.pairId, 'Setiap kartu memiliki pairId');
      assert.ok(card.text, 'Setiap kartu memiliki teks');
      pairCounts[card.pairId] = (pairCounts[card.pairId] || 0) + 1;
    }

    const uniquePairs = Object.keys(pairCounts);
    assert.equal(uniquePairs.length, 6, 'Harus ada 6 pasangan unik');
    for (const p of uniquePairs) {
      assert.equal(pairCounts[p], 2, `Pasangan ${p} harus muncul tepat 2 kali`);
    }
  },

  'getArabicFontSizeClass: menghasilkan ukuran font dinamis sesuai panjang teks': () => {
    assert.equal(getArabicFontSizeClass('اَ'), 'text-3xl sm:text-4xl');
    assert.equal(getArabicFontSizeClass('اَبَ'), 'text-3xl sm:text-4xl');
    assert.equal(getArabicFontSizeClass('دَخَلَ عُمَرُ'), 'text-xl sm:text-2xl');
    assert.equal(getArabicFontSizeClass('وَلَيَالٍ عَشْرٍ وَالشَّفْعِ'), 'text-sm sm:text-base');
  },

  'useEconomyStore: markCardAsCompleted memperbarui status kartu secara persisten': () => {
    const state = useEconomyStore.getState();
    assert.ok(typeof state.markCardAsCompleted === 'function');

    state.markCardAsCompleted(1, 'j1-c1');
    const updated = useEconomyStore.getState().completedArenaCards;
    assert.ok(updated[1].includes('j1-c1'), 'Kartu j1-c1 harus ditandai selesai di Jilid 1');

    // Menandai kartu yang sama tidak menyebabkan duplikasi ID
    state.markCardAsCompleted(1, 'j1-c1');
    const deduped = useEconomyStore.getState().completedArenaCards[1].filter((id) => id === 'j1-c1');
    assert.equal(deduped.length, 1);
  },

  'isTilaCompanionExcluded: menyembunyikan maskot di layar latihan dan menampilkannya di Papan Progres': () => {
    // Di Papan Progres maskot tampil
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/arena-kartu'), false);
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/arena-kartu/1'), false);

    // Di Layar Latihan ketuk irama maskot disembunyikan
    assert.equal(isTilaCompanionExcluded('/member/ngaji-ceria/arena-kartu/1/practice/j1-c1'), true);
  },

  'ArenaKartuSelectPage, ArenaKartuPage, & KartuPracticePage: terdefinisi sebagai fungsi komponen React': () => {
    assert.equal(typeof ArenaKartuSelectPage, 'function');
    assert.equal(typeof ArenaKartuPage, 'function');
    assert.equal(typeof KartuPracticePage, 'function');

    assert.ok(React.isValidElement(React.createElement(ArenaKartuSelectPage)));
    assert.ok(React.isValidElement(React.createElement(ArenaKartuPage)));
    assert.ok(React.isValidElement(React.createElement(KartuPracticePage)));
  },
};
