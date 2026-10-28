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

/** Peta jilid ke dataset halamannya. Jilid 1 statik, 2-6 dinamis. */
const JILID_CACHES: Record<number, Record<number, PageQuizData>> = {
  1: TILAWATI_JILID_1_PAGES,
  // Jilid 2-6 dimuat secara dinamis via loadJilidPages
};

/** Flag per-jilid apakah sudah dimuat dinamis. */
const LOADING_STATE: Record<number, { loading: true } | { loaded: true; data: Record<number, PageQuizData> }> = {
  1: { loaded: true, data: TILAWATI_JILID_1_PAGES },
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
 * Memuat dataset jilid secara dinamis (dynamic import) dengan cache per-jilid.
 *
 * Jilid 1 selalu tersedia secara sinron (static import pada module load).
 * Jilid 2-6 dimuat secara lazy via dynamic import untuk mengurangi ukuran
 * bundle awal. Setelah dipanggil sekali, hasilnya disimpan di `JILID_CACHES`
 * sehingga pemanggilan berikutnya tidak perlu import ulang.
 *
 * @param jilid Nomor jilid (1-6).
 * @returns Peta nomor halaman ke `PageQuizData`, kosong bila gagal.
 */
export async function loadJilidPages(jilid: number): Promise<Record<number, PageQuizData>> {
  if (JILID_CACHES[jilid]) return JILID_CACHES[jilid]!;
  const module = await import(`./tilawatiQuizJilid${jilid}`);
  const pages = (module as Record<string, Record<number, PageQuizData>>)[`TILAWATI_JILID_${jilid}_PAGES`];
  if (!pages) return {};
  JILID_CACHES[jilid] = pages;
  return pages;
}

/**
 * Mengambil dataset halaman MENTAH untuk satu jilid.
 *
 * Untuk Jilid 1, data tersedia secara sinron (static import). Untuk Jilid 2-6,
 * panggil `await loadJilidPages(jilid)` terlebih dahulu agar data tersedia
 * di cache, lalu gunakan fungsi ini secara sinron.
 *
 * Dipakai pipeline audio (`tilawatiQuizData.ts`) sebagai sumber data inti,
 * sehingga file inti hanya di-import di sini. Struktur dan isi halaman tidak
 * diubah; simbol waqaf tetap utuh.
 *
 * @param jilid Nomor jilid (1-6).
 * @returns Peta nomor halaman ke `PageQuizData` mentah, kosong bila jilid belum
 *   dimuat (gunakan `loadJilidPages` terlebih dahulu untuk Jilid 2-6).
 */
export function getRawPages(jilid: number): Record<number, PageQuizData> {
  return JILID_CACHES[jilid] ?? {};
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
  const pages = JILID_CACHES[jilid];
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
  const pages = JILID_CACHES[jilid];
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
