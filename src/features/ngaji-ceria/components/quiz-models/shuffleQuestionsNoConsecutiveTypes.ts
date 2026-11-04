import type { QuestionData } from "./types";

/** Fisher-Yates pada salinan array; array sumber tidak diubah. */
function shuffleCopy<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Mengacak urutan soal, lalu merapikan agar dua soal bertipe sama tidak
 * tampil berurutan bila masih ada tipe lain di sisa array.
 *
 * Best-effort: jika sisa array hanya berisi tipe yang sama, urutannya
 * dibiarkan apa adanya.
 */
export function shuffleQuestionsNoConsecutiveTypes(
  questions: QuestionData[],
): QuestionData[] {
  const result = shuffleCopy(questions);

  for (let i = 1; i < result.length; i += 1) {
    if (result[i].type !== result[i - 1].type) continue;

    let swapIdx = -1;
    for (let j = i + 1; j < result.length; j += 1) {
      if (result[j].type !== result[i - 1].type) {
        swapIdx = j;
        break;
      }
    }

    if (swapIdx === -1) continue;
    [result[i], result[swapIdx]] = [result[swapIdx], result[i]];
  }

  return result;
}

export default shuffleQuestionsNoConsecutiveTypes;
