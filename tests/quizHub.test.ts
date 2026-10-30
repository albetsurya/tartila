import assert from "node:assert/strict";
import React from "react";
import {
  QUIZ_HUB_CATEGORIES,
  QUIZ_HUB_QUESTIONS,
  JUZ_AMMA_QUESTIONS,
  KISAH_DOA_QUESTIONS,
  DOA_HARIAN_QUESTIONS,
  SEJARAH_NABI_QUESTIONS,
  JUZ_AMMA_LEVEL_IDS,
  DOA_HARIAN_LEVEL_IDS,
  SEJARAH_NABI_LEVEL_IDS,
  BAHASA_ARAB_LEVEL_IDS,
  ADVENTURE_LEVEL_DEFINITIONS,
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

    for (const [catName, questions] of Object.entries(QUIZ_HUB_QUESTIONS)) {
      for (const q of questions) {
        if (q.prompt) assert.ok(!emojiRegex.test(q.prompt), `Emoji terdeteksi pada prompt [${catName}/${q.id}]`);
        if (q.arabicTemplate) assert.ok(!emojiRegex.test(q.arabicTemplate), `Emoji terdeteksi pada arabicTemplate [${catName}/${q.id}]`);
        if (q.arabicText) assert.ok(!emojiRegex.test(q.arabicText), `Emoji terdeteksi pada arabicText [${catName}/${q.id}]`);
        if (q.options) {
          for (const opt of q.options) {
            assert.ok(!emojiRegex.test(opt), `Emoji terdeteksi pada pilihan [${catName}/${q.id}]: ${opt}`);
          }
        }
        if (q.correctWords) {
          for (const w of q.correctWords) {
            assert.ok(!emojiRegex.test(w), `Emoji terdeteksi pada correctWords [${catName}/${q.id}]: ${w}`);
          }
        }
      }
    }
  },

  "Standarisasi Kategori & Level Difficulty (Pemula hingga Juara)": () => {
    // 1. Cek seluruh 13 ID kategori resmi
    const expectedCategories = [
      "tilawati",
      "juz-amma",
      "doa-harian",
      "sejarah-nabi",
      "bahasa-arab",
      "misi-5-waktu",
      "peta-iman",
      "air-kehidupan",
      "tameng-ramadan",
      "misi-berbagi",
      "panduan-ksatria",
      "lorong-waktu",
      "puncak-arafah",
    ];
    for (const catId of expectedCategories) {
      assert.ok(
        QUIZ_HUB_CATEGORIES.some((c) => c.id === catId),
        `Kategori resmi ${catId} harus terdaftar di QUIZ_HUB_CATEGORIES`,
      );
    }

    // 2. Backward compatibility untuk kisah-doa
    assert.ok(
      QUIZ_HUB_QUESTIONS["kisah-doa"] && QUIZ_HUB_QUESTIONS["kisah-doa"].length > 0,
      "QUIZ_HUB_QUESTIONS harus tetap mendukung legacy 'kisah-doa'",
    );

    // 3. Standarisasi 6 Level kesulitan
    assert.equal(ADVENTURE_LEVEL_DEFINITIONS.length, 6);
    const expectedLevelNames = ["Pemula", "Dasar", "Menengah", "Lanjutan", "Mahir", "Juara"];
    ADVENTURE_LEVEL_DEFINITIONS.forEach((def, idx) => {
      assert.equal(def.level, idx + 1);
      assert.equal(def.name, expectedLevelNames[idx]);
    });
  },

  "Kapasitas Bank Soal: 120+ soal per kategori & ekspor khusus": () => {
    assert.ok(ARABIC_VOCAB_QUESTIONS.length >= 120, `ARABIC_VOCAB_QUESTIONS harus >= 120 (saat ini ${ARABIC_VOCAB_QUESTIONS.length})`);
    assert.ok(JUZ_AMMA_QUESTIONS.length >= 120, `JUZ_AMMA_QUESTIONS harus >= 120 (saat ini ${JUZ_AMMA_QUESTIONS.length})`);
    assert.ok(DOA_HARIAN_QUESTIONS.length >= 120, `DOA_HARIAN_QUESTIONS harus >= 120 (saat ini ${DOA_HARIAN_QUESTIONS.length})`);
    assert.ok(SEJARAH_NABI_QUESTIONS.length >= 120, `SEJARAH_NABI_QUESTIONS harus >= 120 (saat ini ${SEJARAH_NABI_QUESTIONS.length})`);
    assert.ok(KISAH_DOA_QUESTIONS.length > 0, "KISAH_DOA_QUESTIONS harus dipertahankan");

    // 8 kategori petualangan masing-masing 120 soal
    const adventureCats = [
      "misi-5-waktu",
      "peta-iman",
      "air-kehidupan",
      "tameng-ramadan",
      "misi-berbagi",
      "panduan-ksatria",
      "lorong-waktu",
      "puncak-arafah",
    ] as const;
    for (const cat of adventureCats) {
      assert.ok(
        QUIZ_HUB_QUESTIONS[cat].length >= 120,
        `Kategori ${cat} harus memiliki minimal 120 soal (saat ini ${QUIZ_HUB_QUESTIONS[cat].length})`,
      );
    }
  },

  "Level ID Mappings: Memiliki 20+ soal valid di tiap level 1-6": () => {
    const mappings = [
      { name: "JUZ_AMMA_LEVEL_IDS", map: JUZ_AMMA_LEVEL_IDS, bank: JUZ_AMMA_QUESTIONS },
      { name: "DOA_HARIAN_LEVEL_IDS", map: DOA_HARIAN_LEVEL_IDS, bank: DOA_HARIAN_QUESTIONS },
      { name: "SEJARAH_NABI_LEVEL_IDS", map: SEJARAH_NABI_LEVEL_IDS, bank: SEJARAH_NABI_QUESTIONS },
      { name: "BAHASA_ARAB_LEVEL_IDS", map: BAHASA_ARAB_LEVEL_IDS, bank: ARABIC_VOCAB_QUESTIONS },
    ];

    for (const item of mappings) {
      const bankIdSet = new Set(item.bank.map((q) => q.id));
      for (let lvl = 1; lvl <= 6; lvl++) {
        const ids = item.map[lvl];
        assert.ok(Array.isArray(ids), `${item.name}[${lvl}] harus berupa array`);
        assert.ok(ids.length >= 20, `${item.name}[${lvl}] harus memiliki minimal 20 soal (saat ini ${ids.length})`);
        for (const id of ids) {
          assert.ok(bankIdSet.has(id), `ID ${id} di ${item.name}[${lvl}] harus ada di bank soal terkait`);
        }
      }
    }
  },

  "Gameplay Bank 40, Main 20: getQuizHubQuestions default limit 20 & level ID priority": () => {
    // 1. Default limit harus 20
    const defaultPlay = getQuizHubQuestions("doa-harian");
    assert.equal(defaultPlay.length, 20, "Default getQuizHubQuestions harus mengambil 20 soal");

    // 2. Pemilihan level mengutamakan Level ID Mappings
    const lvl1Doa = getQuizHubQuestions("doa-harian", "all", undefined, 20, 1);
    assert.equal(lvl1Doa.length, 20);
    const expectedLvl1Ids = new Set(DOA_HARIAN_LEVEL_IDS[1]);
    for (const q of lvl1Doa) {
      assert.ok(expectedLvl1Ids.has(q.id), `Soal level 1 doa harus berasal dari DOA_HARIAN_LEVEL_IDS[1]: ${q.id}`);
    }

    // 3. Level 2 Sejarah Nabi
    const lvl2Sejarah = getQuizHubQuestions("sejarah-nabi", "all", undefined, 20, 2);
    assert.equal(lvl2Sejarah.length, 20);
    const expectedLvl2Ids = new Set(SEJARAH_NABI_LEVEL_IDS[2]);
    for (const q of lvl2Sejarah) {
      assert.ok(expectedLvl2Ids.has(q.id), `Soal level 2 sejarah harus berasal dari SEJARAH_NABI_LEVEL_IDS[2]: ${q.id}`);
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
    const setA = getQuizHubQuestions("bahasa-arab", "all", seed, 20);
    const setB = getQuizHubQuestions("bahasa-arab", "all", seed, 20);

    assert.equal(setA.length, setB.length);
    assert.equal(setA.length, 20);
    for (let i = 0; i < setA.length; i++) {
      assert.equal(
        setA[i].id,
        setB[i].id,
        `Soal index ${i} harus identik antara penantang dan teman (ID: ${setA[i].id} vs ${setB[i].id})`,
      );
    }

    // Pastikan seed berbeda menghasilkan urutan berbeda
    const setC = getQuizHubQuestions("bahasa-arab", "all", 11111, 20);
    const isDifferent = setA.some((q, idx) => q.id !== setC[idx]?.id);
    assert.ok(isDifferent, "Seed berbeda harus memberikan variasi kocokan soal");
  },

  "QuizHubPage & QuizHubPlayPage: Terdefinisi sebagai fungsi komponen React": () => {
    assert.equal(typeof QuizHubPage, "function");
    assert.equal(typeof QuizHubPlayPage, "function");
    assert.equal(typeof ModelWordScramble, "function");
  },
};
