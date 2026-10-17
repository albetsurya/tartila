import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Volume2, X, Sparkles } from "../../../components/ui/FontAwesomeIcons";
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
import { QuizEngine } from "../components/quiz-models/QuizEngine";
import type { QuestionData } from "../components/quiz-models/types";

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
 * Menyusun opsi pilihan ganda: jawaban benar + distraktor dari bacaan
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
 * Memetakan pertanyaan Tilawati ke `QuestionData` yang fleksibel.
 * Halaman contoh (listen-only) tetap Material; soal biasa membawa opsi
 * pilihan ganda (dari sibling) sekaligus bank huruf untuk isi rumpang,
 * sehingga QuizEngine bebas mengacak model UI-nya.
 */
function toQuestionData(
  question: QuizQuestion,
  allQuestions: QuizQuestion[],
  resolvedAudioUrl?: string | null,
): QuestionData {
  const correctReading = question.transliterationParts.join(" ");
  const isMaterial = Boolean(question.isListenOnly || question.isOpening);
  // `question.audioUrl` hampir selalu kosong; URL sebenarnya dihitung oleh
  // layanan audio (getTilawatiQuestionAudioUrl). Pakai hasil resolusi itu.
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

  return {
    id: String(question.id),
    type: "fill-in-the-blank",
    arabicTemplate: question.arabic,
    arabicText: question.arabic,
    options: buildMcqOptions(correctReading, siblingReadings),
    availableLetters: question.options,
    correctAnswer: question.transliterationParts,
    audioUrl,
    transliteration: correctReading,
  };
}

export default function NgajiCeriaQuizPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const [currentIdx, setCurrentIdx] = useState(0);

  const question = questions[currentIdx] || questions[0];
  const totalQuestions = questions.length;
  const currentStep = currentIdx + 1;
  const progressPercent = Math.round((currentStep / totalQuestions) * 100);

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

  const handleNext = () => {
    tapFeedback();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Halaman ini selesai! Simpan progres dan award stars
      if (pageAwarded.current) return;
      pageAwarded.current = true;
      awardStars(activeJilid, activePageNum, 100);
      const stars = getNgajiActivity().stars;
      const completed = Object.keys(activeDataset).every(
        (page) => stars[`jilid-${activeJilid}-hal-${page}`] > 0,
      );
      awardProgress(
        "tilawati-quiz",
        100,
        10,
        completed ? [`jilid-${activeJilid}-clear`] : [],
      );

      if (activePageNum < pageCount) {
        stopAllAudio();
        setSearchParams({
          jilid: String(activeJilid),
          hal: String(activePageNum + 1),
        });
        setCurrentIdx(0);
      } else {
        stopAllAudio();
        navigate("/member/ngaji-ceria/map");
      }
    }
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    playSoundEffect(isCorrect ? "correct" : "wrong");
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
        onBack={() => navigate("/member/ngaji-ceria/quiz")}
      >
        <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-5xl">{access.isComingSoon ? "🎙️" : "🔒"}</div>
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

  const renderToneBadge = () => {
    if (!question) return null;
    if (question.hintTone.includes("Datar")) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-xs font-black tracking-wide border border-[#0D9488]/20">
          <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
          {question.hintTone.includes("3x")
            ? "Rost: Datar (3x)"
            : "Rost: Datar"}
        </span>
      );
    }
    if (question.hintTone.includes("Naik")) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-xs font-black tracking-wide border border-[#0D9488]/20">
          <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
          Rost: Naik
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs font-black tracking-wide border border-[#FF6B6B]/20">
        <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-pulse" />
        Rost: Turun
      </span>
    );
  };

  return (
    <div
      onPointerDownCapture={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("button:not(:disabled)")
        )
          soundManager.playSfx("tap", 0.55);
      }}
      className="min-h-screen bg-[#F0FDF4] flex flex-col selection:bg-[#0D9488]/20"
    >
      {/* Top Header */}
      <div className="pt-safe px-4 py-3 border-b-2 border-[#134E4A]/10 bg-[#F0FDF4]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={handleExit}
            aria-label="Kembali"
            className="min-w-[52px] h-[52px] rounded-2xl bg-white border-[3px] border-[#134E4A] flex items-center justify-center text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <X size={18} />
          </button>

          <div className="flex-1">
            <div className="flex justify-between items-center text-[11px] font-black mb-1 text-[#134E4A]/70">
              <span className="font-extrabold text-[#134E4A]">
                Jilid {activeJilid} · Hal {activePageNum} ({currentStep}/
                {totalQuestions})
              </span>
              <span className="text-[#FF6B6B] font-black">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3.5 p-0.5 border-2 border-[#134E4A]">
              <div
                className="bg-[#0D9488] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FEF3C7] text-[#134E4A] font-black text-xs border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <Sparkles size={13} className="text-[#FF6B6B]" />
            <span>+10</span>
          </div>
        </div>
      </div>

      {/* Body - tetap sama persis seperti aslinya */}
      {isTaawudzPhase ? (
        <main className="max-w-md mx-auto w-full px-5 py-8 flex-1 flex flex-col items-center justify-center">
          <div className="w-full bg-[#134E4A] text-white border-[3px] border-[#134E4A] rounded-3xl p-8 shadow-[4px_4px_0px_#FF6B6B] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-2">
              <Volume2 size={28} className="animate-pulse text-[#FF6B6B]" />
            </div>
            <div>
              <p
                className="text-2xl font-arabic leading-loose tracking-wide text-[#FF6B6B]"
                dir="rtl"
              >
                أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
              </p>
              <div className="my-4 border-t border-white/20 w-24 mx-auto" />
              <p
                className="text-3xl font-arabic leading-loose tracking-wide text-white"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            </div>
            <p className="text-xs text-white/80 font-bold pt-2">
              Mendengarkan pembuka...
            </p>
          </div>
        </main>
      ) : (
        <>
          <div className="max-w-md mx-auto w-full px-5 pt-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-white text-[#0D9488] text-[10px] font-black uppercase border-2 border-[#0D9488]/30 shadow-[2px_2px_0px_#0D9488]/20">
                Tebak Bacaan Hal {activePageNum}
              </span>
              {renderToneBadge()}
            </div>
          </div>

          {questionData && (
            <QuizEngine
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
    </div>
  );
}
