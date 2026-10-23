/**
 * Bank Kuis Ustadz — pembuatan kuis, penugasan ke kelas, dan penilaian.
 *
 * KONTRAK API / BACKEND (belum tersedia di Supabase):
 *
 * 1) Bank kuis:
 *    tabel `ustadz_quizzes`
 *      (id uuid, created_by text, title text, materi text, target_jilid int,
 *       room_id uuid null, created_at timestamptz)
 *    tabel `ustadz_quiz_questions`
 *      (id uuid, quiz_id uuid, prompt text, options jsonb, answer_index int,
 *       position int)
 *
 * 2) Pengerjaan santri:
 *    tabel `ustadz_quiz_attempts`
 *      (id uuid, quiz_id uuid, user_id text, score int, total int,
 *       answers jsonb, submitted_at timestamptz)
 *
 * Sampai backend siap: localStorage.
 */

import type { JilidNumber, MateriPokok } from '@/data/learningCatalog';

export const QUIZ_OPTION_COUNT = 4;

export interface QuizQuestion {
  id: string;
  prompt: string;
  /** Tepat 4 pilihan jawaban. */
  options: readonly string[];
  /** Indeks pilihan benar (0–3). */
  answerIndex: number;
}

export interface Quiz {
  id: string;
  createdBy: string;
  title: string;
  materi: MateriPokok;
  targetJilid: JilidNumber | null;
  /** Kelas yang ditugasi; null = bank pribadi ustadz. */
  roomId: string | null;
  questions: readonly QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  total: number;
  answers: readonly number[];
  submittedAt: string;
}

export interface QuizDraftQuestion {
  prompt: string;
  options: readonly string[];
  answerIndex: number;
}

export interface QuizDraft {
  title: string;
  materi: MateriPokok;
  targetJilid: JilidNumber | null;
  roomId: string | null;
  questions: readonly QuizDraftQuestion[];
}

/**
 * Validasi draf kuis — murni, tanpa I/O. Mengembalikan daftar pesan
 * kesalahan; kosong berarti valid.
 */
export function validateQuizDraft(draft: QuizDraft): string[] {
  const errors: string[] = [];
  if (draft.title.trim().length === 0) {
    errors.push('Judul kuis wajib diisi.');
  }
  if (draft.questions.length === 0) {
    errors.push('Kuis harus punya minimal satu pertanyaan.');
  }
  draft.questions.forEach((question, index) => {
    const nomor = index + 1;
    if (question.prompt.trim().length === 0) {
      errors.push(`Pertanyaan ${nomor}: teks pertanyaan wajib diisi.`);
    }
    if (question.options.length !== QUIZ_OPTION_COUNT) {
      errors.push(
        `Pertanyaan ${nomor}: harus tepat ${QUIZ_OPTION_COUNT} pilihan jawaban.`,
      );
      return;
    }
    question.options.forEach((option, optionIndex) => {
      if (option.trim().length === 0) {
        errors.push(
          `Pertanyaan ${nomor}: pilihan ${optionIndex + 1} tidak boleh kosong.`,
        );
      }
    });
    if (
      !Number.isInteger(question.answerIndex) ||
      question.answerIndex < 0 ||
      question.answerIndex >= QUIZ_OPTION_COUNT
    ) {
      errors.push(`Pertanyaan ${nomor}: kunci jawaban tidak valid.`);
    }
  });
  return errors;
}

export interface QuizScore {
  score: number;
  total: number;
  /** Nilai 0–100, dibulatkan. */
  percent: number;
}

/** Penilaian murni: cocokkan jawaban santri dengan kunci. */
export function scoreQuiz(
  quiz: Pick<Quiz, 'questions'>,
  answers: readonly number[],
): QuizScore {
  let score = 0;
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.answerIndex) score += 1;
  });
  const total = quiz.questions.length;
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);
  return { score, total, percent };
}

function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

const QUIZ_KEY = 'tartila_ustadz_quizzes';
const ATTEMPT_KEY = 'tartila_ustadz_quiz_attempts';

function readJsonArray(key: string): unknown[] {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const parsed: unknown = JSON.parse(storage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getQuiz(quizId: string): Promise<Quiz | undefined> {
  return (await listQuizzes()).find((quiz) => quiz.id === quizId);
}

function isQuiz(value: unknown): value is Quiz {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Quiz).id === 'string' &&
    typeof (value as Quiz).title === 'string' &&
    Array.isArray((value as Quiz).questions)
  );
}

function isAttempt(value: unknown): value is QuizAttempt {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as QuizAttempt).id === 'string' &&
    typeof (value as QuizAttempt).quizId === 'string'
  );
}

function makeId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export async function listQuizzes(): Promise<Quiz[]> {
  return readJsonArray(QUIZ_KEY).filter(isQuiz);
}

export async function listQuizzesForRoom(roomId: string): Promise<Quiz[]> {
  const quizzes = await listQuizzes();
  return quizzes.filter((quiz) => quiz.roomId === roomId);
}

/** Kuis yang ditugaskan ke salah satu kelas yang diikuti santri. */
export async function listQuizzesForRooms(
  roomIds: readonly string[],
): Promise<Quiz[]> {
  const quizzes = await listQuizzes();
  return quizzes.filter(
    (quiz) => quiz.roomId !== null && roomIds.includes(quiz.roomId),
  );
}

export interface CreateQuizResult {
  ok: boolean;
  quiz?: Quiz;
  errors: string[];
}

export async function createQuiz(
  draft: QuizDraft,
  createdBy: string,
): Promise<CreateQuizResult> {
  const errors = validateQuizDraft(draft);
  if (errors.length > 0) return { ok: false, errors };

  const quiz: Quiz = {
    id: makeId('quiz'),
    createdBy,
    title: draft.title.trim(),
    materi: draft.materi,
    targetJilid: draft.targetJilid,
    roomId: draft.roomId,
    questions: draft.questions.map((question) => ({
      id: makeId('q'),
      prompt: question.prompt.trim(),
      options: question.options.map((option) => option.trim()),
      answerIndex: question.answerIndex,
    })),
    createdAt: new Date().toISOString(),
  };

  const storage = safeStorage();
  if (storage) {
    storage.setItem(QUIZ_KEY, JSON.stringify([...(await listQuizzes()), quiz]));
  }
  return { ok: true, quiz, errors: [] };
}

export async function deleteQuiz(quizId: string): Promise<void> {
  const storage = safeStorage();
  if (!storage) return;
  const remaining = (await listQuizzes()).filter((quiz) => quiz.id !== quizId);
  storage.setItem(QUIZ_KEY, JSON.stringify(remaining));
}

export async function listAttempts(quizId?: string): Promise<QuizAttempt[]> {
  const attempts = readJsonArray(ATTEMPT_KEY).filter(isAttempt);
  return quizId === undefined
    ? attempts
    : attempts.filter((attempt) => attempt.quizId === quizId);
}

export async function submitQuizAttempt(
  quizId: string,
  userId: string,
  answers: readonly number[],
): Promise<QuizAttempt | null> {
  const quiz = (await listQuizzes()).find((item) => item.id === quizId);
  if (!quiz) return null;
  const { score, total } = scoreQuiz(quiz, answers);
  const attempt: QuizAttempt = {
    id: makeId('attempt'),
    quizId,
    userId,
    score,
    total,
    answers: [...answers],
    submittedAt: new Date().toISOString(),
  };
  const storage = safeStorage();
  if (storage) {
    storage.setItem(
      ATTEMPT_KEY,
      JSON.stringify([...(await listAttempts()), attempt]),
    );
  }
  return attempt;
}

/** Rata-rata nilai (0–100) dari sekumpulan attempt. */
export function averagePercent(attempts: readonly QuizAttempt[]): number {
  const answered = attempts.filter((attempt) => attempt.total > 0);
  if (answered.length === 0) return 0;
  const totalPercent = answered.reduce(
    (sum, attempt) => sum + (attempt.score / attempt.total) * 100,
    0,
  );
  return Math.round(totalPercent / answered.length);
}

export interface MateriQuizAverage {
  materi: MateriPokok;
  averagePercent: number;
  attemptCount: number;
}

/** Rata-rata nilai kuis dikelompokkan per materi (untuk dashboard). */
export function averagePercentByMateri(
  quizzes: readonly Quiz[],
  attempts: readonly QuizAttempt[],
): MateriQuizAverage[] {
  const quizById = new Map(quizzes.map((quiz) => [quiz.id, quiz]));
  const grouped = new Map<MateriPokok, QuizAttempt[]>();
  for (const attempt of attempts) {
    const quiz = quizById.get(attempt.quizId);
    if (!quiz) continue;
    const bucket = grouped.get(quiz.materi) ?? [];
    bucket.push(attempt);
    grouped.set(quiz.materi, bucket);
  }
  return [...grouped.entries()]
    .map(([materi, bucket]) => ({
      materi,
      averagePercent: averagePercent(bucket),
      attemptCount: bucket.length,
    }))
    .sort(
      (a, b) =>
        b.averagePercent - a.averagePercent ||
        a.materi.localeCompare(b.materi),
    );
}
