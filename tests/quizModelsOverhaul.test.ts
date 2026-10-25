import assert from 'node:assert/strict';
import {
  getAvailableModels,
  getRandomQuizModel,
  generateAvailableLetters,
  validateAvailableLetters,
  isArabicText,
  extractArabicTokens,
} from '../src/features/ngaji-ceria/components/quiz-models/quizModelRandomizer';
import type { QuestionData } from '../src/features/ngaji-ceria/components/quiz-models/types';
import { TILAWATI_JILID_1_PAGES } from '../src/features/ngaji-ceria/data/tilawatiQuizJilid1';
import { TILAWATI_JILID_2_PAGES } from '../src/features/ngaji-ceria/data/tilawatiQuizJilid2';
import { TILAWATI_JILID_3_PAGES } from '../src/features/ngaji-ceria/data/tilawatiQuizJilid3';
import { TILAWATI_JILID_4_PAGES } from '../src/features/ngaji-ceria/data/tilawatiQuizJilid4';
import { TILAWATI_JILID_5_PAGES } from '../src/features/ngaji-ceria/data/tilawatiQuizJilid5';
import { TILAWATI_JILID_6_PAGES } from '../src/features/ngaji-ceria/data/tilawatiQuizJilid6';

export const tests = {
  'getAvailableModels includes all 5 models when audio and data are ready': () => {
    const qData: QuestionData = {
      id: 'q1',
      type: 'fill-in-the-blank',
      arabicText: 'اَ بَ',
      options: ['a ba', 'ta tsa', 'ja ha', 'kho da'],
      arabicOptions: ['اَ بَ', 'تَ ثَ', 'جَ حَ', 'خَ دَ'],
      bankLetters: ['اَ', 'بَ', 'تَ', 'ثَ'],
      correctLetters: ['اَ', 'بَ'],
      correctAnswer: ['a', 'ba'],
      audioUrl: '/audio/tilawati/jilid_1/hal1/editor_123.ogg',
      audioShapes: [
        { id: 'opt-1', audioUrl: '/audio/tilawati/jilid_1/hal1/editor_1.ogg', color: 'red' },
        { id: 'opt-2', audioUrl: '/audio/tilawati/jilid_1/hal1/editor_2.ogg', color: 'blue' },
        { id: 'opt-3', audioUrl: '/audio/tilawati/jilid_1/hal1/editor_3.ogg', color: 'yellow' },
        { id: 'opt-4', audioUrl: '/audio/tilawati/jilid_1/hal1/editor_4.ogg', color: 'green' },
      ],
      correctAudioId: 'opt-1',
    };

    const models = getAvailableModels(qData);
    assert.ok(models.includes('fill-in-the-blank'), 'Harus ada fill-in-the-blank');
    assert.ok(models.includes('multiple-choice-text'), 'Harus ada multiple-choice-text');
    assert.ok(models.includes('multiple-choice-audio'), 'Harus ada multiple-choice-audio');
    assert.ok(models.includes('audio-matching'), 'Harus ada audio-matching');
    assert.ok(models.includes('arrange-letters'), 'Harus ada arrange-letters');
    assert.equal(models.length, 5, 'Harus mencakup semua 5 model');
  },

  'audio-matching is available even with 2 or 3 audio clips (no fallback to text)': () => {
    const qData: QuestionData = {
      id: 'q2',
      type: 'fill-in-the-blank',
      arabicText: 'تَ ثَ',
      options: ['ta tsa', 'ja ha'],
      correctAnswer: ['ta', 'tsa'],
      audioUrl: '/audio/tilawati/jilid_1/hal1/editor_123.ogg',
      audioShapes: [
        { id: 'opt-1', audioUrl: '/audio/1.ogg', color: 'red' },
        { id: 'opt-2', audioUrl: '/audio/2.ogg', color: 'blue' },
      ],
      correctAudioId: 'opt-1',
    };

    const models = getAvailableModels(qData);
    assert.ok(
      models.includes('audio-matching'),
      'audio-matching harus tetap tersedia meski hanya 2 opsi audio',
    );
  },

  'audio models are excluded when audioUrl is missing': () => {
    const qData: QuestionData = {
      id: 'q3',
      type: 'fill-in-the-blank',
      arabicText: 'جَ حَ',
      options: ['ja ha', 'kho da'],
      correctAnswer: ['ja', 'ha'],
      audioUrl: undefined,
    };

    const models = getAvailableModels(qData);
    assert.ok(!models.includes('multiple-choice-audio'), 'multiple-choice-audio tidak boleh ada');
    assert.ok(!models.includes('audio-matching'), 'audio-matching tidak boleh ada');
    assert.ok(!models.includes('arrange-letters'), 'arrange-letters tidak boleh ada');
    assert.ok(models.includes('multiple-choice-text'), 'multiple-choice-text boleh ada');
    assert.ok(models.includes('fill-in-the-blank'), 'fill-in-the-blank boleh ada');
  },

  'getRandomQuizModel returns randomly among all available models': () => {
    const qData: QuestionData = {
      id: 'q4',
      type: 'fill-in-the-blank',
      arabicText: 'اَ بَ',
      options: ['a ba', 'ta tsa'],
      arabicOptions: ['اَ بَ', 'تَ ثَ'],
      bankLetters: ['اَ', 'بَ'],
      correctAnswer: ['a', 'ba'],
      audioUrl: '/audio/1.ogg',
      audioShapes: [
        { id: '1', audioUrl: '/audio/1.ogg', color: 'red' },
        { id: '2', audioUrl: '/audio/2.ogg', color: 'blue' },
      ],
    };

    const counts: Record<string, number> = {};
    for (let i = 0; i < 200; i++) {
      const model = getRandomQuizModel(qData);
      counts[model] = (counts[model] || 0) + 1;
    }

    assert.ok((counts['audio-matching'] || 0) > 0, 'audio-matching harus terpilih');
    assert.ok((counts['multiple-choice-audio'] || 0) > 0, 'multiple-choice-audio harus terpilih');
    assert.ok((counts['arrange-letters'] || 0) > 0, 'arrange-letters harus terpilih');
  },

  'generateAvailableLetters preserves twin letters without deduplication': () => {
    // Kasus 1: Huruf kembar Latin ('a', 'a')
    const latinTwin = ['a', 'a'];
    const bankLatin = generateAvailableLetters(latinTwin, ['ba', 'ta', 'tsa'], 3);
    const countA = bankLatin.filter((l) => l === 'a').length;
    assert.ok(
      countA >= 2,
      `Bank huruf Latin harus memiliki minimal dua 'a', aktual: ${countA}`,
    );

    // Kasus 2: Huruf kembar Arab ('بَ', 'بَ')
    const arabicTwin = ['بَ', 'بَ'];
    const bankArabic = generateAvailableLetters(arabicTwin, ['تَ', 'ثَ', 'جَ'], 3);
    const countBa = bankArabic.filter((l) => l === 'بَ').length;
    assert.ok(
      countBa >= 2,
      `Bank huruf Arab harus memiliki minimal dua 'بَ', aktual: ${countBa}`,
    );
  },

  'generateAvailableLetters enforces uniform format (Arabic only for Arabic, Latin only for Latin)': () => {
    // Input Arab tidak boleh ada huruf Latin sama sekali
    const arabicAnswer = ['اَ', 'اَ'];
    const bankArabic = generateAvailableLetters(arabicAnswer, ['u', 'i', 'ha', 'ta', 'تَ', 'ثَ'], 3);
    for (const letter of bankArabic) {
      assert.ok(
        isArabicText(letter),
        `Bank huruf Arab tidak boleh mengandung karakter Latin: "${letter}"`,
      );
    }

    // Input Latin tidak boleh ada huruf Arab sama sekali
    const latinAnswer = ['a', 'a'];
    const bankLatin = generateAvailableLetters(latinAnswer, ['اَ', 'بَ', 'ba', 'ta'], 3);
    for (const letter of bankLatin) {
      assert.ok(
        !isArabicText(letter),
        `Bank huruf Latin tidak boleh mengandung karakter Arab: "${letter}"`,
      );
    }
  },

  'validateAvailableLetters correctly flags missing twin letters and mixed formats': () => {
    // Valid: ada 2 'a'
    const resOk = validateAvailableLetters(['a', 'a'], ['a', 'ba', 'a', 'ta']);
    assert.equal(resOk.valid, true);

    // Invalid: hanya ada 1 'a' padahal butuh 2
    const resMissing = validateAvailableLetters(['a', 'a'], ['a', 'ba', 'ta', 'tsa']);
    assert.equal(resMissing.valid, false);
    assert.ok(resMissing.reason?.includes('membutuhkan 2 buah'));

    // Invalid: format bercampur
    const resMixed = validateAvailableLetters(['اَ', 'اَ'], ['اَ', 'اَ', 'ba', 'ta']);
    assert.equal(resMixed.valid, false);
    assert.ok(resMixed.reason?.includes('bercampur'));
  },

  'validation check across all 6 jilids of Tilawati data sources': () => {
    const allJilids = [
      { num: 1, dataset: TILAWATI_JILID_1_PAGES },
      { num: 2, dataset: TILAWATI_JILID_2_PAGES },
      { num: 3, dataset: TILAWATI_JILID_3_PAGES },
      { num: 4, dataset: TILAWATI_JILID_4_PAGES },
      { num: 5, dataset: TILAWATI_JILID_5_PAGES },
      { num: 6, dataset: TILAWATI_JILID_6_PAGES },
    ];

    let totalChecked = 0;
    for (const { num, dataset } of allJilids) {
      for (const [pageKey, page] of Object.entries(dataset)) {
        for (const q of page.questions) {
          const isPunctOnly =
            q.transliterationParts.length === 0 ||
            q.transliterationParts.every((part) => /^[0-9○\u06d6-\u06ed=\-—:.,\s]+$/.test(part));
          if (q.isListenOnly || q.isOpening || isPunctOnly) continue;
          totalChecked++;

          // 1. Cek options sumber mencukupi seluruh frekuensi transliterationParts
          const needed: Record<string, number> = {};
          for (const part of q.transliterationParts) {
            needed[part] = (needed[part] || 0) + 1;
          }
          const available: Record<string, number> = {};
          for (const opt of q.options || []) {
            available[opt] = (available[opt] || 0) + 1;
          }
          for (const [part, count] of Object.entries(needed)) {
            assert.ok(
              (available[part] || 0) >= count,
              `Jilid ${num} Hal ${pageKey} Q ${q.id} kekurangan frekuensi "${part}"`,
            );
          }

          // 2. Cek generator availableLetters menghasilkan bank seragam (tanpa campur Latin/Arab) & lengkap
          const generatedTranslitBank = generateAvailableLetters(q.transliterationParts, q.options || [], 3);
          const valTranslit = validateAvailableLetters(q.transliterationParts, generatedTranslitBank);
          assert.ok(
            valTranslit.valid,
            `Jilid ${num} Hal ${pageKey} Q ${q.id} gagal validasi bank translit: ${valTranslit.reason}`,
          );

          // 3. Cek generator Bank Huruf Arab (ModelArrangeLetters) menghasilkan bank valid & lengkap
          const arabicWords = extractArabicTokens(q.arabic);
          if (arabicWords.length > 0) {
            const generatedArabicBank = generateAvailableLetters(arabicWords, [], 3);
            const valGenerated = validateAvailableLetters(arabicWords, generatedArabicBank);
            assert.ok(
              valGenerated.valid,
              `Jilid ${num} Hal ${pageKey} Q ${q.id} gagal validasi bank Arab: ${valGenerated.reason}`,
            );
          }
        }
      }
    }
    assert.ok(totalChecked > 3000, `Harus memeriksa minimal 3000 soal, terperiksa: ${totalChecked}`);
  },
};
