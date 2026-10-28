import assert from 'node:assert/strict';
import {
  formatQuestionsForWebSocket,
  getSpecificPageForAssignment,
  getRandomQuestions,
  loadJilidPages,
} from '../src/features/ngaji-ceria/data/TilawatiDataProvider';

const WAQAF = /[○ۚۖۗۘۙ]/;

async function preloadJilid6(): Promise<void> {
  if (!globalThis.__tilawatiJilid6Preloaded) {
    globalThis.__tilawatiJilid6Preloaded = true;
    await loadJilidPages(6);
  }
}

export const tests = {
  'getRandomQuestions filters opening, empty, and digit-only questions': () => {
    const questions = getRandomQuestions(1, 5);
    assert.equal(questions.length, 5);
    for (const question of questions) {
      assert.equal(question.isOpening, undefined, 'soal pembuka tidak boleh diambil');
      assert.ok(question.arabic.trim().length > 0, 'arabic tidak boleh kosong');
      assert.ok(question.transliterationParts.length > 0, 'transliterationParts tidak boleh kosong');
      assert.equal(new Set(question.options).size, question.options.length, 'opsi duplikat harus dibersihkan');
    }
  },

  'getRandomQuestions preserves waqaf symbols': async () => {
    await preloadJilid6();
    const questions = getRandomQuestions(6, 200);
    const withWaqaf = questions.filter((question) => WAQAF.test(question.arabic + question.options.join('')));
    assert.ok(withWaqaf.length > 0, 'simbol waqaf harus dipertahankan');
  },

  'getSpecificPageForAssignment returns clean error for empty page': async () => {
    await preloadJilid6();
    const empty = getSpecificPageForAssignment(6, 42);
    assert.equal(empty.ok, false);
    if (!empty.ok) {
      assert.match(empty.error, /belum memiliki soal/);
    }

    const valid = getSpecificPageForAssignment(6, 41);
    assert.equal(valid.ok, true);
    if (valid.ok) {
      assert.ok(valid.page.questions.length > 0);
    }

    assert.equal(getSpecificPageForAssignment(9, 1).ok, false);
    assert.equal(getSpecificPageForAssignment(6, 9999).ok, false);
  },

  'formatQuestionsForWebSocket returns only light payload fields': () => {
    const payload = formatQuestionsForWebSocket(1, 3);
    assert.equal(payload.length, 3);
    for (const item of payload) {
      assert.deepEqual(Object.keys(item).sort(), ['correctAnswer', 'id', 'options', 'questionText']);
      assert.ok(item.correctAnswer.length > 0, 'correctAnswer tidak boleh kosong');
    }
  },

  'getRandomQuestions handles invalid jilid and zero limit': () => {
    assert.deepEqual(getRandomQuestions(99, 5), []);
    assert.deepEqual(getRandomQuestions(1, 0), []);
  },
};
