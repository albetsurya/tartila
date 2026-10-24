/**
 * Bank Kuis Ustadz — pembuatan kuis, penugasan ke kelas, dan penilaian.
 *
 * Mode penyimpanan:
 * - Backend Supabase: tabel `quizzes`, `quiz_questions`, `quiz_attempts`
 *   (lihat migrasi 20261024120000_create_ustadz_panel_tables.sql) dipakai
 *   saat env VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY terpasang.
 * - Fallback localStorage saat Supabase belum dikonfigurasi
 *   (dev baru / unit test / offline).
 */

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
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

// ── Pemetaan Supabase ───────────────────────────────────────────

interface QuizRow {
  id: string;
  created_by: string;
  title: string;
  materi: string;
  target_jilid: number | null;
  room_id: string | null;
  created_at: string;
  quiz_questions: {
    id: string;
    prompt: string;
    options: string[];
    answer_index: number;
    position: number;
  }[];
}

interface AttemptRow {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total: number;
  answers: number[];
  submitted_at: string;
}

function toQuiz(row: QuizRow): Quiz {
  const questions = [...row.quiz_questions]
    .sort((a, b) => a.position - b.position)
    .map(bareQuestion);
  return {
    id: row.id,
    createdBy: row.created_by,
    title: row.title,
    materi: row.materi as MateriPokok,
    targetJilid: row.target_jilid as JilidNumber | null,
    roomId: row.room_id,
    questions,
    createdAt: row.created_at,
  };
}

function bareQuestion(row: QuizRow['quiz_questions'][number]): QuizQuestion {
  return {
    id: row.id,
    prompt: row.prompt,
    options: [...row.options],
    answerIndex: row.answer_index,
  };
}

function toAttempt(row: AttemptRow): QuizAttempt {
  return {
    id: row.id,
    quizId: row.quiz_id,
    userId: row.user_id,
    score: row.score,
    total: row.total,
    answers: [...(row.answers ?? [])],
    submittedAt: row.submitted_at,
  };
}

function makeId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
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

export async function getQuiz(quizId: string): Promise<Quiz | undefined> {
  if (isSupabaseConfigured) {
    const { data } = await supabase
      .from('quizzes')
      .select('*, quiz_questions (*)')
      .eq('id', quizId)
      .maybeSingle<QuizRow>();
    if (!data) return undefined;
    return toQuiz(data);
  }
  return (await listQuizzes()).find((quiz) => quiz.id === quizId);
}

export async function listQuizzes(): Promise<Quiz[]> {
  if (isSupabaseConfigured) {
    const { data } = await supabase
      .from('quizzes')
      .select('*, quiz_questions (*)')
      .order('created_at', { ascending: false });
    if (!data) return [];
    return (data as unknown as QuizRow[]).map(toQuiz);
  }
  return readJsonArray(QUIZ_KEY).filter(isQuiz);
}

export async function listQuizzesForRoom(roomId: string): Promise<Quiz[]> {
  if (isSupabaseConfigured) {
    const { data } = await supabase
      .from('quizzes')
      .select('*, quiz_questions (*)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false });
    if (!data) return [];
    return (data as unknown as QuizRow[]).map(toQuiz);
  }
  const quizzes = await listQuizzesFallback();
  return quizzes.filter((quiz) => quiz.roomId === roomId);
}

/** Kuis yang ditugaskan ke salah satu kelas yang diikuti santri. */
export async function listQuizzesForRooms(
  roomIds: readonly string[],
): Promise<Quiz[]> {
  if (roomIds.length === 0) return [];
  if (isSupabaseConfigured) {
    const { data } = await supabase
      .from('quizzes')
      .select('*, quiz_questions (*)')
      .in('room_id', [...roomIds])
      .order('created_at', { ascending: false });
    if (!data) return [];
    return (data as unknown as QuizRow[]).map(toQuiz);
  }
  const quizzes = await listQuizzesFallback();
  return quizzes.filter(
    (quiz) => quiz.roomId !== null && roomIds.includes(quiz.roomId),
  );
}

async function listQuizzesFallback(): Promise<Quiz[]> {
  if (isSupabaseConfigured) return [];
  return listQuizzes();
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

  const questions = draft.questions.map((question, questionIndex) => ({
    id: makeId('q'),
    prompt: question.prompt.trim(),
    options: question.options.map((option) => option.trim()),
    answerIndex: question.answerIndex,
    position: questionIndex,
  }));

  if (isSupabaseConfigured) {
    const { data: quizRow, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        created_by: createdBy,
        title: draft.title.trim(),
        materi: draft.materi,
        target_jilid: draft.targetJilid,
        room_id: draft.roomId,
      })
      .select('id, created_at')
      .single<{ id: string; created_at: string }>();
    if (quizError || !quizRow) {
      return { ok: false, errors: ['Gagal menyimpan kuis ke server.'] };
    }
    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(
        questions.map((question) => ({
          quiz_id: quizRow.id,
          prompt: question.prompt,
          options: question.options,
          answer_index: question.answerIndex,
          position: question.position,
        })),
      );
    if (questionsError) {
      await supabase.from('quizzes').delete().eq('id', quizRow.id);
      return { ok: false, errors: ['Gagal menyimpan soal kuis ke server.'] };
    }
    return {
      ok: true,
      quiz: {
        id: quizRow.id,
        createdBy,
        title: draft.title.trim(),
        materi: draft.materi,
        targetJilid: draft.targetJilid,
        roomId: draft.roomId,
        questions,
        createdAt: quizRow.created_at,
      },
      errors: [],
    };
  }

  const storage = safeStorage();
  const quiz: Quiz = {
    id: makeId('quiz'),
    createdBy,
    title: draft.title.trim(),
    materi: draft.materi,
    targetJilid: draft.targetJilid,
    roomId: draft.roomId,
    questions,
    createdAt: new Date().toISOString(),
  };
  if (storage) {
    storage.setItem(QUIZ_KEY, JSON.stringify([...(await listQuizzes()), quiz]));
  }
  return { ok: true, quiz, errors: [] };
}

export async function deleteQuiz(quizId: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.from('quizzes').delete().eq('id', quizId);
    return;
  }
  const storage = safeStorage();
  if (!storage) return;
  const remaining = (await listQuizzes()).filter((quiz) => quiz.id !== quizId);
  storage.setItem(QUIZ_KEY, JSON.stringify(remaining));
}

export async function listAttempts(quizId?: string): Promise<QuizAttempt[]> {
  if (isSupabaseConfigured) {
    const builder = supabase
      .from('quiz_attempts')
      .select('id, quiz_id, user_id, score, total, answers, submitted_at')
      .order('submitted_at', { ascending: true });
    const { data } =
      quizId === undefined
        ? await builder
        : await builder.eq('quiz_id', quizId);
    if (!data) return [];
    return (data as AttemptRow[]).map(toAttempt);
  }
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
  const quiz = await getQuiz(quizId);
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

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        user_id: userId,
        score,
        total,
        answers: attempt.answers,
      })
      .select('id, quiz_id, user_id, score, total, answers, submitted_at')
      .single<AttemptRow>();
    if (error || !data) return null;
    return toAttempt(data);
  }

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
