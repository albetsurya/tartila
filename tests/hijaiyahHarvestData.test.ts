import assert from "node:assert/strict";
import {
  getFallbackWords,
  getWordsForLevel,
  splitArabicToLetters,
  LEVELS,
  LEVEL_WORD_LENGTHS,
} from "../src/features/ngaji-ceria/data/hijaiyahHarvestData.ts";

export const tests = {
  "splitArabicToLetters: memecah frasa menjadi huruf dengan harakat": () => {
    const letters = splitArabicToLetters("بِسْمِ اللّٰهِ");
    assert.ok(letters.length >= 7, "Harus menghasilkan minimal 7 huruf");
    assert.equal(letters[0], "بِ");
    assert.equal(letters[1], "سْ");
  },

  "getFallbackWords: menghasilkan frasa Al-Qur'an dan doa valid untuk setiap level": () => {
    for (let i = 0; i < LEVELS.length; i++) {
      const words = getFallbackWords(i);
      assert.ok(words.length > 0, `Level ${i + 1} fallback tidak boleh kosong`);
      for (const word of words) {
        assert.ok(word.length >= 2, `Frasa level ${i + 1} minimal 2 huruf`);
        for (const letter of word) {
          assert.ok(letter.trim().length > 0, "Huruf tidak boleh kosong");
        }
      }
    }
  },

  "getWordsForLevel: memuat frasa utuh dan mematuhi batas panjang": async () => {
    for (let i = 0; i < LEVELS.length; i++) {
      const words = await getWordsForLevel(i);
      assert.ok(words.length > 0, `Kata level ${i + 1} tidak boleh kosong`);

      const [min, max] = LEVEL_WORD_LENGTHS[i] ?? [2, null];
      for (const word of words) {
        assert.ok(word.length >= min, `Panjang ${word.length} harus >= ${min} (Level ${i + 1})`);
        if (max !== null) {
          assert.ok(word.length <= max, `Panjang ${word.length} harus <= ${max} (Level ${i + 1})`);
        }
      }
    }
  },
};
