import React from "react";
import type { QuestionData } from "../components/quiz-models/types";
import { ChairSvg } from "@/components/ui/Illustrations";
import { HomeSvg, QuranSvg } from "@/components/ui/CustomIcons";

/**
 * Bank Soal Bahasa Arab (Durus al-Lughah & Mufradat Dasar)
 * ATURAN MUTLAK: DILARANG menggunakan emoji. Seluruh ilustrasi menggunakan komponen SVG.
 */
export const ARABIC_VOCAB_QUESTIONS: QuestionData[] = [
  // 1. Tipe Gambar: Ilustrasi SVG Kursi (ChairSvg) -> Pilihan Arab: كُرْسِيٌّ
  {
    id: "ar-vocab-chair-1",
    type: "multiple-choice-text",
    prompt: "Pilihlah kosakata Arab yang tepat untuk gambar berikut:",
    illustration: <ChairSvg size={120} />,
    arabicText: "",
    options: ["كُرْسِيٌّ", "بَابٌ", "كِتَابٌ", "قَلَمٌ"],
    correctAnswer: "كُرْسِيٌّ",
  },

  // 2. Tipe Fill-in-the-blank: "إِنَّ ______ جَدِيدٌ" (Sesungguhnya guru itu baru)
  {
    id: "ar-vocab-fill-inna-1",
    type: "fill-in-the-blank",
    prompt: "Sesungguhnya guru itu baru",
    arabicTemplate: "إِنَّ ______ جَدِيدٌ",
    availableLetters: ["الْمُدَرِّسَ", "الْمُدَرِّسُ", "الْمُدَرِّسِ", "الطَّالِبَ"],
    options: ["الْمُدَرِّسَ", "الْمُدَرِّسُ", "الْمُدَرِّسِ"],
    correctAnswer: ["الْمُدَرِّسَ"],
  },

  // 3. Tipe Scramble: Kata diacak: [هَلْ] [هَذَا] [حِصَانٌ] -> هَلْ هَذَا حِصَانٌ؟
  {
    id: "ar-vocab-scramble-horse-1",
    type: "word-scramble",
    instruction: "Susun kalimat tanya dengan benar",
    prompt: "Apakah ini seekor kuda?",
    correctWords: ["هَلْ", "هَذَا", "حِصَانٌ"],
    bankWords: ["حِصَانٌ", "هَلْ", "هَذَا", "قِطٌّ"],
    correctAnswer: "هَلْ هَذَا حِصَانٌ",
  },

  // 4. Tipe Scramble: [هَذَا] [بَيْتٌ] -> هَذَا بَيْتٌ
  {
    id: "ar-vocab-scramble-house-1",
    type: "word-scramble",
    instruction: "Susun kata menjadi kalimat",
    prompt: "Ini adalah sebuah rumah",
    illustration: <HomeSvg size={64} />,
    correctWords: ["هَذَا", "بَيْتٌ"],
    bankWords: ["بَيْتٌ", "هَذَا", "مَسْجِدٌ"],
    correctAnswer: "هَذَا بَيْتٌ",
  },

  // 5. Tipe Gambar Kitab (QuranSvg) -> كِتَابٌ
  {
    id: "ar-vocab-book-1",
    type: "multiple-choice-text",
    prompt: "Benda apakah ini dalam bahasa Arab?",
    illustration: <QuranSvg size={68} />,
    arabicText: "",
    options: ["كِتَابٌ", "دَفْتَرٌ", "قَلَمٌ", "مَكْتَبٌ"],
    correctAnswer: "كِتَابٌ",
  },

  // 6. Tipe Fill-in-the-blank: الْقَلَمُ ______ (Pena itu patah)
  {
    id: "ar-vocab-fill-pen-1",
    type: "fill-in-the-blank",
    prompt: "Pena itu patah / rusak",
    arabicTemplate: "الْقَلَمُ ______",
    availableLetters: ["مَكْسُورٌ", "مَفْتُوحٌ", "جَمِيلٌ", "نَظِيفٌ"],
    options: ["مَكْسُورٌ", "مَفْتُوحٌ", "جَمِيلٌ"],
    correctAnswer: ["مَكْسُورٌ"],
  },

  // 7. Tipe Scramble: [أَيْنَ] [الْمُدَرِّسُ]
  {
    id: "ar-vocab-scramble-where-teacher",
    type: "word-scramble",
    instruction: "Susun kalimat tanya berikut",
    prompt: "Di mana sang guru?",
    correctWords: ["أَيْنَ", "الْمُدَرِّسُ"],
    bankWords: ["الْمُدَرِّسُ", "أَيْنَ", "الطَّالِبُ"],
    correctAnswer: "أَيْنَ الْمُدَرِّسُ",
  },
];
