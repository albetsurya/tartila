import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  XSvg,
  SparklesSvg,
  TilawatiSvg,
  LockSvg,
  Volume2Svg as Volume2,
} from "../../../components/ui/CustomIcons";
import { tapFeedback } from "../../../lib/haptics";
import {
  playSoundEffect,
  playOpeningDua,
  stopAllAudio,
} from "../utils/audioPlayer";
import {
  TILAWATI_JILID_1_PAGES,
  TILAWATI_JILID_2_PAGES,
  TILAWATI_JILID_3_PAGES,
  TILAWATI_JILID_4_PAGES,
  TILAWATI_JILID_5_PAGES,
  TILAWATI_JILID_6_PAGES,
  QuizQuestion,
} from "../data/tilawatiQuizData";
import { awardStars } from "../hooks/useNgajiCeriaStore";
import { useJilidAccess } from "../components/GameLockGuard";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import {
  usePublishedTilawati,
  useTilawatiAudio,
} from "../services/tilawatiAudio";
import { getNgajiActivity } from "../hooks/useNgajiCeriaStore";
import { soundManager } from "../services/soundManager";
import { awardProgress } from "./games/_shared/progression";
import { addEvent } from "@/services/eventService";
import { QuizEngine } from "../components/quiz-models/QuizEngine";
import { QuizSessionResult } from "../components/QuizSessionResult";
import type { AudioMatchingOption, QuestionData } from "../components/quiz-models/types";
import { generateAvailableLetters, extractArabicTokens } from "../components/quiz-models/quizModelRandomizer";
import { GameStartSheet } from "./games/_shared/GameStartSheet";
import { GameHud } from "./games/_shared/GameHud";
import { GameResultModal } from "./games/_shared/GameResultModal";
import { useGameStore } from "../hooks/useGameStore";

const QUIZ_DATASETS = {
  1: TILAWATI_JILID_1_PAGES,
  2: TILAWATI_JILID_2_PAGES,
  3: TILAWATI_JILID_3_PAGES,
  4: TILAWATI_JILID_4_PAGES,
  5: TILAWATI_JILID_5_PAGES,
  6: TILAWATI_JILID_6_PAGES,
} as const;
type SupportedJilid = keyof typeof QUIZ_DATASETS;

/** Mengocok salinan array (Fisher–Yates) tanpa mengubah sumbernya. */
function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Menyusun opsi pilihan ganda Latin: jawaban benar + distraktor dari bacaan
 * soal saudara (sibling) pada halaman yang sama. Posisi jawaban benar
 * ikut diacak agar tidak selalu di opsi pertama.
 */
function buildMcqOptions(correct: string, siblingReadings: string[]): string[] {
  const uniqueDistractors = Array.from(
    new Set(
      siblingReadings
        .map((reading) => reading.trim())
        .filter((reading) => reading.length > 0 && reading !== correct),
    ),
  );
  const distractors = shuffleArray(uniqueDistractors).slice(0, 3);
  return shuffleArray([correct, ...distractors]);
}

/**
 * Menyusun opsi pilihan ganda Teks Arab untuk model Multiple Choice Audio.
 */
function buildArabicMcqOptions(correctArabic: string, siblingArabics: string[]): string[] {
  const cleanCorrect = correctArabic.replace(/\s+/g, " ").trim();
  const uniqueDistractors = Array.from(
    new Set(
      siblingArabics
        .map((text) => text.replace(/\s+/g, " ").trim())
        .filter((text) => text.length > 0 && text !== cleanCorrect),
    ),
  );
  const distractors = shuffleArray(uniqueDistractors).slice(0, 3);
  return shuffleArray([cleanCorrect, ...distractors]);
}

/**
 * Menyusun 2–4 opsi audio Kahoot-style untuk model Audio Matching.
 * Sesuai aturan: jika variasi kurang dari 4 klip, jangan fallback, cukup tampilkan 2 atau 3 kartu audio.
 */
function buildAudioShapes(
  question: QuizQuestion,
  allQuestions: QuizQuestion[],
  currentAudioUrl?: string | null,
): { audioShapes: AudioMatchingOption[]; correctAudioId: string } | undefined {
  const correctAudio = question.audioUrl || currentAudioUrl;
  if (!correctAudio) return undefined;

  const siblingAudios = Array.from(
    new Set(
      allQuestions
        .filter((q) => q !== question && Boolean(q.audioUrl) && q.audioUrl !== correctAudio)
        .map((q) => q.audioUrl!),
    ),
  );

  // Jika tidak ada audio lain di halaman ini sama sekali, tidak bisa audio matching
  if (siblingAudios.length === 0) return undefined;

  const pickedDistractors = shuffleArray(siblingAudios).slice(0, 3);
  const correctId = `audio-opt-${question.id}`;

  const candidates = shuffleArray([
    { id: correctId, audioUrl: correctAudio },
    ...pickedDistractors.map((url, idx) => ({
      id: `audio-sibling-${idx}-${url.split("/").pop() || idx}`,
      audioUrl: url,
    })),
  ]);

  const audioShapes: AudioMatchingOption[] = candidates.map((c) => ({
    id: c.id,
    audioUrl: c.audioUrl,
  }));

  return { audioShapes, correctAudioId: correctId };
}

/**
 * Memetakan pertanyaan Tilawati ke `QuestionData` yang fleksibel.
 * Halaman contoh (listen-only) tetap Material; soal biasa membawa opsi
 * pilihan ganda Latin, pilihan ganda Arab, kartu audio Kahoot, serta bank huruf,
 * sehingga QuizEngine bebas mengacak model UI-nya secara dinamis.
 */
function toQuestionData(
  question: QuizQuestion,
  allQuestions: QuizQuestion[],
  resolvedAudioUrl?: string | null,
): QuestionData {
  const correctReading = question.transliterationParts.join(" ");
  // Soal tanpa bacaan latin (mis. latihan angka Arab) tetap aman:
  // diputar sebagai materi contoh, bukan soal pilihan ganda tanpa jawaban.
  const isMaterial = Boolean(
    question.isListenOnly ||
      question.isOpening ||
      question.transliterationParts.length === 0 ||
      question.transliterationParts.every((p) => /^[0-9○\u06d6-\u06ed=\-—:.,\s]+$/.test(p)),
  );
  const audioUrl = question.audioUrl || resolvedAudioUrl || undefined;

  if (isMaterial) {
    return {
      id: String(question.id),
      type: "material",
      arabicTemplate: question.arabic,
      arabicText: question.arabic,
      correctAnswer: question.transliterationParts,
      audioUrl,
      transliteration: question.transliterationParts.join(" · "),
      instruction:
        "Judul halaman dibaca 3 kali sebagai contoh irama Rost (Datar, Naik, Turun).",
      isListenOnly: question.isListenOnly,
    };
  }

  const siblingReadings = allQuestions
    .filter((sibling) => sibling !== question)
    .map((sibling) => sibling.transliterationParts.join(" "));

  const siblingArabics = allQuestions
    .filter((sibling) => sibling !== question)
    .map((sibling) => sibling.arabic);

  const audioShapesResult = buildAudioShapes(question, allQuestions, audioUrl);

  // Kepingan kata/huruf Arab untuk model Susun Huruf (ModelArrangeLetters)
  const correctWords = extractArabicTokens(question.arabic);

  const siblingArabicWords = siblingArabics.flatMap((text) => extractArabicTokens(text));

  // Bank Huruf Arab: 100% teks Arab murni, menyalin seluruh frekuensi huruf kembar + 3-4 pengecoh
  const bankLetters = generateAvailableLetters(correctWords, siblingArabicWords, 3);

  // Bank Huruf Transliterasi Latin (untuk ModelFillInTheBlank):
  // Menjaga frekuensi kembar transliterationParts + pengecoh Latin dari options/siblings
  const siblingTranslitParts = allQuestions
    .filter((sibling) => sibling !== question)
    .flatMap((sibling) => sibling.transliterationParts);
  const availableLetters = generateAvailableLetters(
    question.transliterationParts,
    [...siblingTranslitParts, ...(question.options || [])],
    4,
  );

  return {
    id: String(question.id),
    type: "fill-in-the-blank",
    arabicTemplate: question.arabic,
    arabicText: question.arabic,
    options: buildMcqOptions(correctReading, siblingReadings),
    arabicOptions: buildArabicMcqOptions(question.arabic, siblingArabics),
    availableLetters,
    bankLetters,
    correctLetters: correctWords,
    audioShapes: audioShapesResult?.audioShapes,
    correctAudioId: audioShapesResult?.correctAudioId,
    correctAnswer: question.transliterationParts,
    audioUrl,
    transliteration: correctReading,
  };
}

interface QuizLevelConfig {
  level: number;
  title: string;
  questionCount: number;
  durationSeconds: number;
  description: string;
}

const QUIZ_LEVELS: QuizLevelConfig[] = [
  {
    level: 1,
    title: "Level 1: Pemula",
    questionCount: 5,
    durationSeconds: 60,
    description: "Jawab 5 soal dalam 60 detik (minimal 70% benar).",
  },
  {
    level: 2,
    title: "Level 2: Terampil",
    questionCount: 10,
    durationSeconds: 90,
    description: "Jawab 10 soal dalam 90 detik (minimal 70% benar).",
  },
  {
    level: 3,
    title: "Level 3: Mahir",
    questionCount: 15,
    durationSeconds: 120,
    description: "Jawab 15 soal dalam 120 detik (minimal 70% benar).",
  },
];

export default function NgajiCeriaQuizPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isPractice = searchParams.get("practice") === "true";
  const jilidParam = parseInt(searchParams.get("jilid") || "1", 10);
  const activeJilid: SupportedJilid =
    jilidParam >= 1 && jilidParam <= 6 ? (jilidParam as SupportedJilid) : 1;
  const activeDataset = QUIZ_DATASETS[activeJilid];
  const pageCount = Object.keys(activeDataset).length;
  const pageParam = parseInt(searchParams.get("hal") || "1", 10);
  const activePageNum =
    isNaN(pageParam) || pageParam < 1 || pageParam > pageCount ? 1 : pageParam;

  const pageData = activeDataset[activePageNum] || activeDataset[1];
  const published = usePublishedTilawati(activeJilid, activePageNum);
  const questions: QuizQuestion[] =
    published?.questions ?? pageData?.questions ?? [];
  const pageAwarded = useRef(false);

  // Universal Game Framework State
  const unlockedLevel = useGameStore((s) => s.getUnlockedLevel("tilawati-quiz"));
  const unlockNextLevel = useGameStore((s) => s.unlockNextLevel);

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const currentLevelConfig = QUIZ_LEVELS[selectedLevel - 1] || QUIZ_LEVELS[0];
  const [isStartSheetOpen, setIsStartSheetOpen] = useState<boolean>(!searchParams.get("hal"));
  const [isPlaying, setIsPlaying] = useState<boolean>(Boolean(searchParams.get("hal")));
  const [timeLeft, setTimeLeft] = useState<number>(currentLevelConfig.durationSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  // Bertambah tiap sesi baru/Ulangi agar model kuis selalu mount ulang
  // (mengosongkan `selected`/`status`), termasuk saat halaman hanya 1 soal.
  const [sessionKey, setSessionKey] = useState(0);

  // Batasi soal aktif sesuai level kuis
  const activeQuestions = useMemo(() => {
    return questions.slice(0, currentLevelConfig.questionCount);
  }, [questions, currentLevelConfig.questionCount]);

  const totalQuestions = activeQuestions.length;
  const question = activeQuestions[currentIdx] || activeQuestions[0];
  const currentStep = currentIdx + 1;
  const progressPercent =
    totalQuestions > 0
      ? Math.round((currentStep / totalQuestions) * 100)
      : 0;

  // Timer hitung mundur saat bermain
  useEffect(() => {
    if (!isPlaying || isPaused || showResult) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, showResult]);

  const handleTimeOut = () => {
    stopAllAudio();
    soundManager.playSfx("gameover");
    setIsWin(false);
    setShowResult(true);
  };

  const handleStartLevel = (lvl: number) => {
    setSelectedLevel(lvl);
    const cfg = QUIZ_LEVELS[lvl - 1] || QUIZ_LEVELS[0];
    setTimeLeft(cfg.durationSeconds);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setIsWin(false);
    setIsStartSheetOpen(false);
    setIsPlaying(true);
    setIsPaused(false);
    setSessionKey((prev) => prev + 1);
  };

  const [isOpening, setIsOpening] = useState(true);
  const [isTaawudzPhase, setIsTaawudzPhase] = useState(true);
  const access = useJilidAccess(activeJilid);
  const tilawatiAudio = useTilawatiAudio({
    question,
    jilid: activeJilid,
    pageNumber: activePageNum,
    questionIndex: currentIdx,
  });
  const isAudioPlaying = tilawatiAudio.isPlaying;
  useEffect(() => {
    if (!access.isOpen || access.isComingSoon) return;
    soundManager.playBgm("quiz", 0.18);
    return () => soundManager.stopBgm();
  }, [access.isOpen, access.isComingSoon]);

  // Reset state when page number changes
  useEffect(() => {
    if (!access.isOpen || access.isComingSoon || !question) return;
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSessionKey((prev) => prev + 1);
    setIsOpening(true);
    setIsTaawudzPhase(true);
    pageAwarded.current = false;
  }, [activeJilid, activePageNum]);

  // Auto-play audio when question or opening phase changes
  useEffect(() => {
    if (!access.isOpen || access.isComingSoon || !question) return;
    if (currentIdx === 0 && isOpening) {
      setIsTaawudzPhase(true);
      playOpeningDua(() => {
        setIsTaawudzPhase(false);
        setIsOpening(false);
      });
    } else {
      handlePlayAudio();
    }

    return () => {
      stopAllAudio();
    };
  }, [
    currentIdx,
    isOpening,
    activePageNum,
    access.isOpen,
    access.isComingSoon,
    tilawatiAudio.url,
  ]);

  // Petakan soal ke QuestionData (opsi MCQ + bank huruf). Di-memo agar
  // distraktor/posisi jawaban tidak teracak ulang pada setiap render.
  const questionData = useMemo(
    () =>
      question ? toQuestionData(question, questions, tilawatiAudio.url) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeJilid, activePageNum, currentIdx, question?.id, tilawatiAudio.url],
  );

  const handleExit = () => {
    stopAllAudio();
    navigate("/member/ngaji-ceria/quiz");
  };

  const scorePercent =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const earnedStars =
    scorePercent >= 90 ? 3 : scorePercent >= 70 ? 2 : 1;

  const handleNext = () => {
    tapFeedback();
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      return;
    }

    // Sesi selesai: tentukan kemenangan (minimal 70% benar)
    const win = scorePercent >= 70;
    setIsWin(win);
    if (win) {
      soundManager.playSfx("victory");
      unlockNextLevel("tilawati-quiz", selectedLevel);
    } else {
      soundManager.playSfx("wrong");
    }

    // Halaman selesai: simpan bintang (ambil nilai terbaik) & progres jika bukan mode latihan.
    stopAllAudio();
    if (!isPractice) {
      awardStars(activeJilid, activePageNum, scorePercent);
      if (!pageAwarded.current) {
        pageAwarded.current = true;
        const stars = getNgajiActivity().stars;
        const completed = Object.keys(activeDataset).every(
          (page) => stars[`jilid-${activeJilid}-hal-${page}`] > 0,
        );
        awardProgress(
          "tilawati-quiz",
          scorePercent,
          10,
          completed ? [`jilid-${activeJilid}-clear`] : [],
        );
      }
    }
    addEvent({
      type: "quiz_completed",
      missionId: `jilid-${activeJilid}-hal-${activePageNum}`,
      missionName: `Tilawati Jilid ${activeJilid} Hal ${activePageNum}`,
      details: {
        score,
        total: totalQuestions,
        percent: scorePercent,
        jilid: activeJilid,
        hal: activePageNum,
        stars: earnedStars,
      },
    });
    setShowResult(true);
  };

  const handleReplay = () => {
    tapFeedback();
    stopAllAudio();
    setScore(0);
    setCurrentIdx(0);
    setSessionKey((prev) => prev + 1);
    setIsOpening(true);
    setIsTaawudzPhase(true);
    setShowResult(false);
  };

  const handleContinue = () => {
    tapFeedback();
    stopAllAudio();
    setShowResult(false);
    if (activePageNum < pageCount) {
      setSearchParams({
        jilid: String(activeJilid),
        hal: String(activePageNum + 1),
      });
      setCurrentIdx(0);
    } else {
      navigate("/member/ngaji-ceria/map");
    }
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    playSoundEffect(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((prev) => prev + 1);
  };

  const handlePlayAudio = () => {
    if (!question || !access.isOpen || access.isComingSoon) return;
    if (isAudioPlaying) {
      tilawatiAudio.stop();
      return;
    }
    tapFeedback();
    void tilawatiAudio.play();
  };

  if (!access.isOpen || access.isComingSoon) {
    return (
      <NgajiCeriaLayout
        title={`Jilid ${activeJilid}`}
        showBack
        onBack={handleExit}
      >
        <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]">
            {access.isComingSoon ? (
              <Volume2 size={32} className="text-[#0D9488]" />
            ) : (
              <LockSvg size={32} />
            )}
          </div>
          <span className="rounded-full bg-[#FF6B6B]/10 px-3 py-1 text-xs font-black text-[#FF6B6B]">
            {access.isComingSoon ? "Segera Hadir" : "Masuk untuk Akses Penuh"}
          </span>
          <h1 className="font-display text-2xl font-black text-[#134E4A]">
            {access.isComingSoon
              ? "Rekaman Audio Menyusul"
              : `Jilid ${activeJilid} terkunci`}
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-[#134E4A]/70">
            {access.isComingSoon
              ? "Materi Jilid 6 sedang disiapkan agar pengalaman belajarnya tetap nyaman."
              : "Masuk atau daftar untuk membuka Jilid 3 sampai 5."}
          </p>
          {!access.isLoggedIn && (
            <button
              type="button"
              className="game-button bg-[#0D9488]"
              onClick={() => navigate("/login")}
            >
              Masuk untuk Akses Penuh
            </button>
          )}
        </div>
      </NgajiCeriaLayout>
    );
  }

  if (totalQuestions === 0 || !question) {
    return (
      <NgajiCeriaLayout
        title={`Jilid ${activeJilid}`}
        showBack
        onBack={handleExit}
      >
        <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
            <TilawatiSvg size={28} />
          </div>
          <h1 className="font-display text-xl font-black text-[#134E4A]">
            Materi belum tersedia
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-[#134E4A]/70">
            Soal untuk Jilid {activeJilid} halaman {activePageNum} sedang
            disiapkan. Coba halaman atau jilid lain ya.
          </p>
          <button
            type="button"
            className="game-button bg-[#0D9488]"
            onClick={handleExit}
          >
            Pilih Kitab Lain
          </button>
        </div>
      </NgajiCeriaLayout>
    );
  }

  const renderToneBadge = () => {
    if (!question) return null;
    if (question.hintTone.includes("Datar")) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[var(--text-main,#0369A1)] text-xs font-black tracking-wide border border-[var(--border-color,#0284C7)]/30">
          <span className="w-2 h-2 rounded-full bg-[var(--border-color,#0284C7)] animate-pulse" />
          {question.hintTone.includes("3x")
            ? "Rost: Datar (3x)"
            : "Rost: Datar"}
        </span>
      );
    }
    if (question.hintTone.includes("Naik")) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[var(--text-main,#0369A1)] text-xs font-black tracking-wide border border-[var(--border-color,#0284C7)]/30">
          <span className="w-2 h-2 rounded-full bg-[var(--border-color,#0284C7)] animate-pulse" />
          Rost: Naik
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs font-black tracking-wide border border-[#FF6B6B]/30">
        <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-pulse" />
        Rost: Turun
      </span>
    );
  };

  return (
    <NgajiCeriaLayout themeScope="tilawati" hideHeader={true}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onPointerDownCapture={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("button:not(:disabled)")
          )
            soundManager.playSfx("tap", 0.55);
        }}
        className="min-h-screen bg-[var(--bg-app,#E0F2FE)] flex flex-col selection:bg-[var(--border-color,#0284C7)]/20"
      >
        {/* Top Header */}
        <div className="pt-safe px-4 py-3 border-b-2 border-[var(--border-color,#0284C7)]/25 bg-[var(--bg-app,#E0F2FE)]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <button
              onClick={handleExit}
              aria-label="Kembali"
              className="min-w-[48px] h-[48px] rounded-2xl bg-white border-[3px] border-[var(--border-color,#0284C7)] flex items-center justify-center text-[var(--text-main,#0369A1)] shadow-[3px_3px_0px_var(--border-color,#0284C7)] active:translate-y-[2px] active:shadow-none transition-all hover:bg-sky-50"
            >
              <XSvg size={18} />
            </button>

            <div className="flex-1">
              <div className="flex justify-between items-center text-[11px] font-black mb-1 text-[var(--text-main,#0369A1)]">
                <span className="font-extrabold text-[var(--text-main,#0369A1)]">
                  Jilid {activeJilid} · Hal {activePageNum} ({currentStep}/
                  {totalQuestions})
                </span>
                <span className="text-[var(--border-color,#0284C7)] font-black">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-3.5 p-0.5 border-2 border-[var(--border-color,#0284C7)]">
                <div
                  className="bg-[var(--border-color,#0284C7)] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FEF3C7] text-[var(--text-main,#0369A1)] font-black text-xs border-2 border-[var(--border-color,#0284C7)] shadow-[2px_2px_0px_var(--border-color,#0284C7)]">
              <SparklesSvg size={14} />
              <span>+10</span>
            </div>
          </div>

          {/* Universal Game HUD */}
          <div className="max-w-md mx-auto w-full pt-1">
            <GameHud
              level={selectedLevel}
              timeLeft={timeLeft}
              score={score}
              targetScore={Math.ceil(totalQuestions * 0.7)}
              onPause={() => setIsPaused((p) => !p)}
            />
          </div>
        </div>

        {/* Body */}
        {isTaawudzPhase ? (
          <main className="max-w-md mx-auto w-full px-5 py-8 flex-1 flex flex-col items-center justify-center">
            <div className="w-full bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#0369A1)] border-[3px] border-[var(--border-color,#0284C7)] rounded-3xl p-8 shadow-[4px_4px_0px_var(--border-color,#0284C7)] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mb-2">
                <Volume2 size={28} className="animate-pulse text-[var(--border-color,#0284C7)]" />
              </div>
              <div>
                <p
                  className="text-2xl font-arabic leading-loose tracking-wide text-[var(--border-color,#0284C7)]"
                  dir="rtl"
                >
                  أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
                </p>
                <div className="my-4 border-t border-[var(--border-color,#0284C7)]/20 w-24 mx-auto" />
                <p
                  className="text-3xl font-arabic leading-loose tracking-wide text-[var(--text-main,#0369A1)]"
                  dir="rtl"
                >
                  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </p>
              </div>
              <p className="text-xs text-[var(--text-main,#0369A1)]/80 font-bold pt-2">
                Mendengarkan pembuka...
              </p>
            </div>
          </main>
        ) : (
          <>
            <div className="max-w-md mx-auto w-full px-5 pt-6">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-xl bg-white text-[var(--text-main,#0369A1)] text-[10px] font-black uppercase border-2 border-[var(--border-color,#0284C7)] shadow-[2px_2px_0px_var(--border-color,#0284C7)]">
                  Tebak Bacaan Hal {activePageNum}
                </span>
                {renderToneBadge()}
              </div>
            </div>

            {questionData && (
              <QuizEngine
                key={sessionKey}
                question={questionData}
                questionIndex={currentIdx}
                onAnswerSubmit={handleAnswerSubmit}
                onNext={handleNext}
                onPlayAudio={handlePlayAudio}
                isAudioPlaying={isAudioPlaying}
              />
            )}
          </>
        )}

        {/* UNIVERSAL GAME START SHEET */}
        <GameStartSheet
          isOpen={isStartSheetOpen}
          gameTitle="Kuis Ngaji"
          gameSubtitle={`Tilawati Jilid ${activeJilid} · Level ${selectedLevel}`}
          ruleDescription="Pilih level tantangan, jawab soal dengan tepat sebelum waktu habis! Minimal 70% benar untuk lulus dan membuka level berikutnya."
          levels={QUIZ_LEVELS.map((l) => ({
            level: l.level,
            title: l.title,
            description: l.description,
            target: `${l.questionCount} Soal`,
            durationSeconds: l.durationSeconds,
          }))}
          unlockedLevels={unlockedLevel}
          selectedLevel={selectedLevel}
          onSelectLevel={(lvl) => setSelectedLevel(lvl)}
          onStart={(lvl) => handleStartLevel(lvl)}
          onClose={handleExit}
        />

        {/* UNIVERSAL GAME RESULT MODAL */}
        <GameResultModal
          isOpen={showResult}
          isWin={isWin}
          score={score}
          targetScore={Math.ceil(totalQuestions * 0.7)}
          stars={earnedStars}
          level={selectedLevel}
          hasNextLevel={selectedLevel < QUIZ_LEVELS.length}
          onRetry={() => handleStartLevel(selectedLevel)}
          onNextLevel={() => handleStartLevel(selectedLevel + 1)}
          onBackToHub={handleExit}
        />
      </motion.div>
    </NgajiCeriaLayout>
  );
}
