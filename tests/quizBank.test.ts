import assert from 'node:assert/strict';
import {
  averagePercent,
  averagePercentByMateri,
  scoreQuiz,
  validateQuizDraft,
  type Quiz,
  type QuizAttempt,
  type QuizDraft,
} from '../src/services/quizBankService.ts';

function makeDraft(): QuizDraft {
  return {
    title: 'Kuis Harakat Dasar',
    materi: 'harakat',
    targetJilid: 2,
    roomId: 'room-1',
    questions: [
      {
        prompt: 'Bunyi harakat fathah pada huruf ب?',
        options: ['ba', 'bi', 'bu', 'ban'],
        answerIndex: 0,
      },
      {
        prompt: 'Bunyi harakat kasroh pada huruf ب?',
        options: ['ba', 'bi', 'bu', 'ban'],
        answerIndex: 1,
      },
    ],
  };
}

function makeQuiz(): Quiz {
  const draft = makeDraft();
  return {
    id: 'quiz-1',
    createdBy: 'u-1',
    title: draft.title,
    materi: draft.materi,
    targetJilid: draft.targetJilid,
    roomId: draft.roomId,
    questions: draft.questions.map((question, index) => ({
      id: `q-${index}`,
      prompt: question.prompt,
      options: question.options,
      answerIndex: question.answerIndex,
    })),
    createdAt: new Date(0).toISOString(),
  };
}

export const tests = {
  'draf kuis valid lolos tanpa kesalahan': () => {
    assert.deepEqual(validateQuizDraft(makeDraft()), []);
  },

  'draf kuis kosong ditolak dengan pesan': () => {
    const errors = validateQuizDraft({
      title: '  ',
      materi: 'hijaiyah',
      targetJilid: null,
      roomId: null,
      questions: [],
    });
    assert.ok(errors.some((error) => error.includes('Judul')));
    assert.ok(errors.some((error) => error.includes('minimal satu pertanyaan')));
  },

  'pertanyaan harus tepat 4 pilihan': () => {
    const draft = makeDraft();
    const errors = validateQuizDraft({
      ...draft,
      questions: [
        {
          prompt: 'Soal',
          options: ['a', 'b', 'c'],
          answerIndex: 0,
        },
      ],
    });
    assert.ok(errors.some((error) => error.includes('4 pilihan')));
  },

  'kunci jawaban di luar rentang ditolak': () => {
    const draft = makeDraft();
    const errors = validateQuizDraft({
      ...draft,
      questions: [
        { prompt: 'Soal', options: ['a', 'b', 'c', 'd'], answerIndex: 9 },
      ],
    });
    assert.ok(errors.some((error) => error.includes('kunci jawaban')));
  },

  'scoreQuiz menghitung jawaban benar': () => {
    const quiz = makeQuiz();
    const allCorrect = scoreQuiz(quiz, [0, 1]);
    assert.equal(allCorrect.score, 2);
    assert.equal(allCorrect.total, 2);
    assert.equal(allCorrect.percent, 100);

    const half = scoreQuiz(quiz, [0, 0]);
    assert.equal(half.score, 1);
    assert.equal(half.percent, 50);

    const none = scoreQuiz(quiz, [3, 3]);
    assert.equal(none.score, 0);
    assert.equal(none.percent, 0);
  },

  'scoreQuiz tanpa soal tidak membagi nol': () => {
    const result = scoreQuiz({ questions: [] }, []);
    assert.deepEqual(result, { score: 0, total: 0, percent: 0 });
  },

  'averagePercent menghitung rata-rata dan mengabaikan total 0': () => {
    const attempts: QuizAttempt[] = [
      { id: 'a1', quizId: 'quiz-1', userId: 's1', score: 2, total: 2, answers: [], submittedAt: '' },
      { id: 'a2', quizId: 'quiz-1', userId: 's2', score: 1, total: 2, answers: [], submittedAt: '' },
      { id: 'a3', quizId: 'quiz-1', userId: 's3', score: 0, total: 0, answers: [], submittedAt: '' },
    ];
    assert.equal(averagePercent(attempts), 75);
    assert.equal(averagePercent([]), 0);
  },

  'averagePercentByMateri mengelompokkan per materi': () => {
    const quiz = makeQuiz();
    const other: Quiz = {
      ...quiz,
      id: 'quiz-2',
      materi: 'tajwid',
      questions: quiz.questions,
    };
    const attempts: QuizAttempt[] = [
      { id: 'a1', quizId: 'quiz-1', userId: 's1', score: 2, total: 2, answers: [], submittedAt: '' },
      { id: 'a2', quizId: 'quiz-2', userId: 's1', score: 0, total: 2, answers: [], submittedAt: '' },
      { id: 'a3', quizId: 'quiz-2', userId: 's2', score: 1, total: 2, answers: [], submittedAt: '' },
    ];
    const result = averagePercentByMateri([quiz, other], attempts);
    const harakat = result.find((item) => item.materi === 'harakat');
    const tajwid = result.find((item) => item.materi === 'tajwid');
    assert.equal(harakat?.averagePercent, 100);
    assert.equal(harakat?.attemptCount, 1);
    assert.equal(tajwid?.averagePercent, 25);
    assert.equal(tajwid?.attemptCount, 2);
    assert.equal(result[0].materi, 'harakat');
  },
};