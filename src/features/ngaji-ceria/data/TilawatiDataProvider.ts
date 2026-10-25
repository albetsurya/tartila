/**
 * Provider lapisan adaptasi untuk dataset kuis Tilawati Jilid 1-6.
 *
 * Satu-satunya file yang boleh meng-import enam file inti
 * (`tilawatiQuizJilid1.ts` s.d `tilawatiQuizJilid6.ts`). Fitur lain cukup
 * meng-import dari sini supaya logika pengambilan data tidak tersebar dan
 * bundle tidak memuat enam file inti secara langsung.
 *
 * ATURAN KERAS:
 * - Jangan mengubah atau menghapus isi file inti.
 * - Jangan pernah menghapus simbol waqaf (`○`, `ۚ`, `ۖ`, `ۗ`, `ۘ`, `ۙ`) dari
 *   string Arab maupun dari array `options`. Simbol tersebut bagian dari
 *   kurikulum Tilawati.
 */
import type { PageQuizData, QuizQuestion } from "./tilawatiQuizTypes";
import { TILAWATI_JILID_1_PAGES } from "./tilawatiQuizJilid1";
import { TILAWATI_JILID_2_PAGES } from "./tilawatiQuizJilid2";
import { TILAWATI_JILID_3_PAGES } from "./tilawatiQuizJilid3";
import { TILAWATI_JILID_4_PAGES } from "./tilawatiQuizJilid4";
import { TILAWATI_JILID_5_PAGES } from "./tilawatiQuizJilid5";
import { TILAWATI_JILID_6_PAGES } from "./tilawatiQuizJilid6";

/** Peta jilid ke dataset halamannya. Kunci harus cocok dengan `jilid`. */
const JILID_PAGES: Record<number, Record<number, PageQuizData>> = {
  1: TILAWATI_JILID_1_PAGES,
  2: TILAWATI_JILID_2_PAGES,
  3: TILAWATI_JILID_3_PAGES,
  4: TILAWATI_JILID_4_PAGES,
  5: TILAWATI_JILID_5_PAGES,
  6: TILAWATI_JILID_6_PAGES,
};

/** Payload ringan untuk WebSocket Tartila Arena. */
export interface WebSocketQuestionPayload {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

/** Hasil `getSpecificPageForAssignment`: halaman utuh atau pesan error rapi. */
export type SpecificPageResult =
  | { ok: true; page: PageQuizData }
  | { ok: false; error: string };

/** Hanya angka Arab (٠-٩) dan spasi; tanda soal yang kehilangan kunci jawaban. */
const ARABIC_DIGITS_ONLY = /^[\u0660-\u0669\s]+$/;

/**
 * Menentukan soal yang tidak bisa dipakai: `arabic` kosong, atau hanya berisi
 * angka Arab tanpa `transliterationParts` (bug Jilid 1 yang kehilangan kunci
 * jawaban).
 */
function isUnusable(question: QuizQuestion): boolean {
  const arabic = question.arabic.trim();
  if (arabic.length === 0) return true;
  if (question.transliterationParts.length === 0 && ARABIC_DIGITS_ONLY.test(arabic)) {
    return true;
  }
  return false;
}

/**
 * Membersihkan duplikasi opsi yang PERSIS SAMA memakai `new Set()`, lalu
 * memetakan ulang `correctOptionIndex` agar tetap menunjuk jawaban yang benar.
 * Nilai string tidak diubah sama sekali, sehingga simbol waqaf tetap utuh.
 */
function normalizeOptions(
  question: QuizQuestion,
): Pick<QuizQuestion, "options" | "correctOptionIndex"> {
  const seen = new Set<string>();
  const options: string[] = [];
  const indexMap = new Map<number, number>();
  question.options.forEach((option, originalIndex) => {
    if (seen.has(option)) return;
    seen.add(option);
    indexMap.set(originalIndex, options.length);
    options.push(option);
  });
  const correctOptionIndex =
    question.correctOptionIndex === undefined
      ? undefined
      : indexMap.get(question.correctOptionIndex);
  return { options, correctOptionIndex };
}

/** Mengacak salinan array dengan Fisher-Yates. */
function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = temp;
  }
  return result;
}

/**
 * Mengambil dataset halaman MENTAH untuk satu jilid.
 *
 * Dipakai pipeline audio (`tilawatiQuizData.ts`) sebagai sumber data inti,
 * sehingga file inti hanya di-import di sini. Struktur dan isi halaman tidak
 * diubah; simbol waqaf tetap utuh.
 *
 * @param jilid Nomor jilid (1-6).
 * @returns Peta nomor halaman ke `PageQuizData` mentah, kosong bila jilid tidak
 *   tersedia.
 */
export function getRawPages(jilid: number): Record<number, PageQuizData> {
  return JILID_PAGES[jilid] ?? {};
}

/**
 * Mengambil soal acak dari jilid tertentu.
 *
 * Soal pembuka (`isOpening`) tidak diambil. Opsi duplikat yang persis sama
 * dibersihkan, dan soal tanpa `arabic` atau tanpa `transliterationParts`
 * (hanya angka Arab) disaring. Simbol waqaf tidak pernah dihapus.
 *
 * @param jilid Nomor jilid (1-6).
 * @param limit Jumlah maksimal soal yang dikembalikan.
 * @returns Array soal acak, kosong bila jilid tidak tersedia.
 */
export function getRandomQuestions(jilid: number, limit: number): QuizQuestion[] {
  const pages = JILID_PAGES[jilid];
  if (!pages) return [];
  const pool: QuizQuestion[] = [];
  for (const page of Object.values(pages)) {
    for (const question of page.questions) {
      if (question.isOpening) continue;
      if (isUnusable(question)) continue;
      pool.push(question);
    }
  }
  const take = Math.max(0, Math.floor(limit));
  return shuffle(pool)
    .slice(0, take)
    .map((question) => {
      const { options, correctOptionIndex } = normalizeOptions(question);
      return { ...question, options, correctOptionIndex };
    });
}

/**
 * Mengembalikan data halaman spesifik secara utuh (untuk fitur Kelas Bersama).
 *
 * Bila jilid tidak ada, halaman tidak ditemukan, atau halaman tidak memiliki
 * soal (mis. Jilid 6 Halaman 42), fungsi mengembalikan `{ ok: false, error }`
 * berisi pesan yang rapi, bukan error `undefined`.
 *
 * @param jilid Nomor jilid (1-6).
 * @param pageNumber Nomor halaman yang diminta.
 * @returns `{ ok: true, page }` atau `{ ok: false, error }`.
 */
export function getSpecificPageForAssignment(
  jilid: number,
  pageNumber: number,
): SpecificPageResult {
  const pages = JILID_PAGES[jilid];
  if (!pages) {
    return { ok: false, error: `Jilid ${jilid} tidak tersedia.` };
  }
  const page = pages[pageNumber];
  if (!page) {
    return {
      ok: false,
      error: `Halaman ${pageNumber} tidak ditemukan pada Jilid ${jilid}.`,
    };
  }
  if (page.questions.length === 0) {
    return {
      ok: false,
      error: `Halaman ${pageNumber} Jilid ${jilid} belum memiliki soal.`,
    };
  }
  return { ok: true, page };
}

/**
 * Mengambil soal via `getRandomQuestions`, lalu memformatnya menjadi payload
 * ringan (hanya `id`, `questionText`, `options`, `correctAnswer`) agar tidak
 * memberatkan WebSocket Tartila Arena. Simbol waqaf dipertahankan.
 *
 * `correctAnswer` diambil dari opsi yang ditunjuk `correctOptionIndex`; bila
 * tidak ada, dipakai `transliterationParts` (kunci jawaban pada data inti).
 *
 * @param jilid Nomor jilid (1-6).
 * @param limit Jumlah maksimal soal yang dikembalikan.
 * @returns Array payload siap kirim ke WebSocket.
 */
export function formatQuestionsForWebSocket(
  jilid: number,
  limit: number,
): WebSocketQuestionPayload[] {
  return getRandomQuestions(jilid, limit).map((question) => ({
    id: String(question.id),
    questionText: question.arabic,
    options: question.options,
    correctAnswer:
      question.correctOptionIndex !== undefined
        ? (question.options[question.correctOptionIndex] ?? "")
        : question.transliterationParts.join(" "),
  }));
}
