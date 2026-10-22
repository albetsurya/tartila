import { SOAL_TILAWATI } from "./soal-tilawati";
import { SOAL_TAJWID } from "./soal-tajwid";
import { SOAL_NABI } from "./soal-nabi";
import type { UniversalQuestion, QuestionCategory } from "./types";

export * from "./types";
export * from "./soal-tilawati";
export * from "./soal-tajwid";
export * from "./soal-nabi";

export const ALL_QUESTIONS: UniversalQuestion[] = [
  ...SOAL_TILAWATI,
  ...SOAL_TAJWID,
  ...SOAL_NABI,
];

export function getQuestionsByCategory(category: QuestionCategory): UniversalQuestion[] {
  switch (category) {
    case "tilawati":
      return SOAL_TILAWATI;
    case "tajwid":
      return SOAL_TAJWID;
    case "nabi":
      return SOAL_NABI;
    default:
      return [];
  }
}
