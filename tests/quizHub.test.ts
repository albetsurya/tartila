import assert from "node:assert/strict";
import React from "react";
import {
  QUIZ_HUB_CATEGORIES,
  getQuizHubQuestions,
  shuffleWithSeed,
  getSeededRandom,
} from "@/features/ngaji-ceria/data/quizHubData";
import { ARABIC_VOCAB_QUESTIONS } from "@/features/ngaji-ceria/data/arabicVocabData";
import { getAvailableModels, getRandomQuizModel } from "@/features/ngaji-ceria/components/quiz-models/quizModelRandomizer";
import { ChairSvg, QuizHubCoverSvg } from "@/components/ui/Illustrations";
import { WhatsAppSvg, SwordsSvg } from "@/components/ui/CustomIcons";
import { ModelWordScramble } from "@/features/ngaji-ceria/components/quiz-models/ModelWordScramble";
import QuizHubPage from "@/features/ngaji-ceria/pages/QuizHubPage";
import QuizHubPlayPage from "@/features/ngaji-ceria/pages/QuizHubPlayPage";

export const tests = {
  "ATURAN MUTLAK: Seluruh bank soal Bahasa Arab & Pusat Kuis bebas dari karakter Emoji": () => {
    // Regex deteksi emoji komprehensif
    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

    for (const q of ARABIC_VOCAB_QUESTIONS) {
      if (q.prompt) assert.ok(!emojiRegex.test(q.prompt), `Emoji terdeteksi pada prompt soal: ${q.id}`);
      if (q.arabicTemplate) assert.ok(!emojiRegex.test(q.arabicTemplate), `Emoji terdeteksi pada arabicTemplate: ${q.id}`);
      if (q.arabicText) assert.ok(!emojiRegex.test(q.arabicText), `Emoji terdeteksi pada arabicText: ${q.id}`);
      if (q.options) {
        for (const opt of q.options) {
          assert.ok(!emojiRegex.test(opt), `Emoji terdeteksi pada opsi soal: ${q.id} -> ${opt}`);
        }
      }
      if (q.correctWords) {
        for (const w of q.correctWords) {
          assert.ok(!emojiRegex.test(w), `Emoji terdeteksi pada correctWords: ${q.id} -> ${w}`);
        }
      }
    }
  },

  "Bank Soal Bahasa Arab: Menyertakan ChairSvg kustom, Fill-in-the-blank, & Word Scramble": () => {
    // 1. Soal Gambar Kursi
    const chairQ = ARABIC_VOCAB_QUESTIONS.find((q) => q.id === "ar-vocab-chair-1");
    assert.ok(chairQ, "Soal kursi harus ada");
    assert.equal(chairQ.correctAnswer, "كُرْسِيٌّ");
    assert.ok(chairQ.options?.includes("كُرْسِيٌّ"));
    assert.ok(React.isValidElement(chairQ.illustration), "Ilustrasi kursi harus berupa elemen React SVG valid");

    // 2. Soal Fill-in-the-blank Inna
    const innaQ = ARABIC_VOCAB_QUESTIONS.find((q) => q.id === "ar-vocab-fill-inna-1");
    assert.ok(innaQ, "Soal inna harus ada");
    assert.equal(innaQ.type, "fill-in-the-blank");
    assert.deepEqual(innaQ.correctAnswer, ["الْمُدَرِّسَ"]);

    // 3. Soal Scramble Hal Hadza Hisan
    const scrambleQ = ARABIC_VOCAB_QUESTIONS.find((q) => q.id === "ar-vocab-scramble-horse-1");
    assert.ok(scrambleQ, "Soal susun kata kuda harus ada");
    assert.equal(scrambleQ.type, "word-scramble");
    assert.deepEqual(scrambleQ.correctWords, ["هَلْ", "هَذَا", "حِصَانٌ"]);
    assert.ok(scrambleQ.bankWords && scrambleQ.bankWords.length >= 3);
  },

  "Komponen SVG Ilustrasi & Ikon: ChairSvg, QuizHubCoverSvg, WhatsAppSvg, SwordsSvg valid": () => {
    assert.equal(typeof ChairSvg, "function");
    assert.equal(typeof QuizHubCoverSvg, "function");
    assert.equal(typeof WhatsAppSvg, "function");
    assert.equal(typeof SwordsSvg, "function");

    const chairEl = React.createElement(ChairSvg, { size: 100 });
    assert.ok(React.isValidElement(chairEl));

    const coverEl = React.createElement(QuizHubCoverSvg, { size: 80 });
    assert.ok(React.isValidElement(coverEl));

    const waEl = React.createElement(WhatsAppSvg, { size: 24 });
    assert.ok(React.isValidElement(waEl));
  },

  "Model Word Scramble: Terdeteksi pada QuizModelRandomizer & dapat diacak": () => {
    const scrambleQuestion = {
      id: "test-scramble",
      type: "word-scramble" as const,
      correctWords: ["هَذَا", "بَيْتٌ"],
      bankWords: ["بَيْتٌ", "هَذَا"],
      correctAnswer: "هَذَا بَيْتٌ",
    };

    const available = getAvailableModels(scrambleQuestion);
    assert.ok(available.includes("word-scramble"));
    assert.equal(getRandomQuizModel(scrambleQuestion), "word-scramble");
  },

  "Tantang Teman: Mulberry32 Seed menghasilkan urutan soal 100% identik untuk penantang dan teman": () => {
    const seed = 98765;

    // Ambil soal dua kali dengan seed yang sama (simulasi penantang dan teman incognito)
    const setA = getQuizHubQuestions("bahasa-arab", "all", seed, 5);
    const setB = getQuizHubQuestions("bahasa-arab", "all", seed, 5);

    assert.equal(setA.length, setB.length);
    for (let i = 0; i < setA.length; i++) {
      assert.equal(
        setA[i].id,
        setB[i].id,
        `Soal index ${i} harus identik antara penantang dan teman (ID: ${setA[i].id} vs ${setB[i].id})`,
      );
    }

    // Pastikan seed berbeda menghasilkan urutan berbeda
    const setC = getQuizHubQuestions("bahasa-arab", "all", 11111, 5);
    const isDifferent = setA.some((q, idx) => q.id !== setC[idx]?.id);
    assert.ok(isDifferent, "Seed berbeda harus memberikan variasi kocokan soal");
  },

  "QuizHubPage & QuizHubPlayPage: Terdefinisi sebagai fungsi komponen React": () => {
    assert.equal(typeof QuizHubPage, "function");
    assert.equal(typeof QuizHubPlayPage, "function");
    assert.equal(typeof ModelWordScramble, "function");
  },
};
