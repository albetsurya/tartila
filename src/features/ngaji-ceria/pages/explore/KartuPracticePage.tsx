import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import { loadTimelineEdits } from "../../utils/timelineEditsLoader";
import type { TimelineEdits } from "../../utils/timelineEditsLoader";
import {
  getArenaKartuMateri,
  getArenaKartuCardById,
  getArabicFontSizeClass,
  type ArenaKartuMateri,
  type PatternType,
} from "../../utils/tilawatiTrainingDataAdapter";
import { useRhythmMemoryAudio } from "../../hooks/useRhythmMemoryAudio";
import { useEconomyStore } from "../../hooks/useEconomyStore";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { PatternArrowButton } from "../../components/lab-irama/PatternArrowButton";
import { StickerButton } from "@/components/ui";
import { CheckSvg, ChevronRight } from "@/components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { ArrowRightSvg } from "@/components/ui/CustomIcons";

// Pattern → correct label (5 options)
const PATTERN_TO_ANSWER: Record<PatternType, string> = {
  "1-datar": "Datar",
  "1-naik": "Naik",
  "1-turun": "Turun",
  "2-datar-turun": "Datar-Turun",
  "3-datar-naik-turun": "Datar-Naik-Turun",
  "4-datar-naik-naik-turun": "Datar-Naik-Naik-Turun",
};

export default function KartuPracticePage() {
  const navigate = useNavigate();
  const { jilid: jilidParam, cardId: cardIdParam } = useParams<{
    jilid?: string;
    cardId?: string;
  }>();

  const currentJilid = useMemo(() => {
    const parsed = Number(jilidParam);
    return parsed >= 1 && parsed <= 6 ? parsed : 1;
  }, [jilidParam]);

  // Timeline Editor data (SSOT) — fetched once on mount
  const [timelineData, setTimelineData] = useState<TimelineEdits | undefined>(
    undefined,
  );
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);

  useEffect(() => {
    let alive = true;
    void loadTimelineEdits()
      .then((data) => {
        if (alive) setTimelineData(data);
      })
      .finally(() => {
        if (alive) setIsLoadingTimeline(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Kartu untuk jilid ini (async — dimuat via dataset lazy loader)
  const [allCards, setAllCards] = useState<ArenaKartuMateri[]>([]);
  const [currentCard, setCurrentCard] = useState<ArenaKartuMateri | undefined>(
    undefined,
  );
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  // Load semua kartu + tentukan kartu aktif (cardIdParam jika ada, selain itu kartu pertama)
  useEffect(() => {
    let alive = true;

    void getArenaKartuMateri(currentJilid, timelineData)
      .then((cards) => {
        if (!alive) return;
        setAllCards(cards);
        if (cardIdParam) {
          return void getArenaKartuCardById(
            currentJilid,
            cardIdParam,
            timelineData,
          )
            .then((found) => {
              if (alive && found) setCurrentCard(found);
            })
            .catch(() => {
              if (alive && cards.length > 0) setCurrentCard(cards[0]);
            });
        }
        if (cards.length > 0) setCurrentCard(cards[0]);
      })
      .finally(() => {
        if (alive) setIsLoadingCards(false);
      });

    return () => {
      alive = false;
    };
  }, [currentJilid, timelineData, cardIdParam]);

  const completedArenaCards = useEconomyStore((s) => s.completedArenaCards);
  const markCardAsCompleted = useEconomyStore((s) => s.markCardAsCompleted);

  const isAlreadyCompleted = useMemo(() => {
    if (!currentCard) return false;
    const list = completedArenaCards?.[currentJilid] || [];
    return list.includes(currentCard.id);
  }, [completedArenaCards, currentJilid, currentCard]);

  // Audio hook
  const { playCardSound, stopAudio, preloadAudio } = useRhythmMemoryAudio();

  // State
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<PatternType | null>(
    null,
  );
  const [showResult, setShowResult] = useState<"idle" | "correct" | "wrong">(
    "idle",
  );
  const [listenCount, setListenCount] = useState(0);

  // Preload audio on mount
  useEffect(() => {
    void preloadAudio();
    return () => {
      stopAudio();
    };
  }, [preloadAudio, stopAudio]);

  // Get correct answer from patternType
  const correctAnswer = currentCard?.patternType;
  const correctLabel = correctAnswer ? PATTERN_TO_ANSWER[correctAnswer] : "";

  // Handle flip card
  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true); // ← pindah ke atas, selalu jalan
    try {
      triggerBibiReaction("click");
      soundManager.playSfx("pop");
    } catch (e) {
      console.warn("[flip] sfx error:", e);
    }
  };

  // Handle play audio with safe audioUrl check
  const handlePlayAudio = useCallback(() => {
    if (!currentCard) return;
    triggerBibiReaction("click");
    soundManager.playSfx("pop");
    setIsPlayingAudio(true);
    setListenCount((c) => c + 1);

    void playCardSound({
      audioUrl: currentCard.audioUrl,
      tone: currentCard.tone ?? "datar",
      bpm: currentCard.bpm,
      beatsCount: currentCard.beatsCount,
    });

    const duration =
      (60 / currentCard.bpm!) * currentCard.beatsCount! * 1000 + 1200;
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, duration);
  }, [currentCard, playCardSound]);

  // Handle answer selection
  const handleSelectAnswer = (answer: PatternType) => {
    if (showResult !== "idle") return;
    setSelectedAnswer(answer);
  };

  // Handle answer check
  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    if (!currentCard) return;

    if (selectedAnswer === correctAnswer) {
      setShowResult("correct");
      triggerBibiReaction("success");
      soundManager.playSfx("victory");
      markCardAsCompleted(currentJilid, currentCard.id);
    } else {
      setShowResult("wrong");
      triggerBibiReaction("error");
      soundManager.playSfx("wrong");
    }
  };

  // Handle next card (after correct answer)
  const handleNextCard = () => {
    if (!currentCard) return;
    const currentIndex = allCards.findIndex((c) => c.id === currentCard.id);
    if (currentIndex >= 0 && currentIndex < allCards.length - 1) {
      const nextCard = allCards[currentIndex + 1];
      // Reset state for next card
      setIsFlipped(false);
      setSelectedAnswer(null);
      setShowResult("idle");
      navigate(
        `/member/ngaji-ceria/arena-kartu/${currentJilid}/practice/${nextCard.id}`,
      );
    } else {
      navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`);
    }
  };

  // Handle previous card
  const handlePrevCard = () => {
    if (!currentCard) return;
    const currentIndex = allCards.findIndex((c) => c.id === currentCard.id);
    if (currentIndex > 0) {
      setIsFlipped(false);
      setSelectedAnswer(null);
      setShowResult("idle");
      const prevCard = allCards[currentIndex - 1];
      navigate(
        `/member/ngaji-ceria/arena-kartu/${currentJilid}/practice/${prevCard.id}`,
      );
    }
  };

  // Reset answer for retrying
  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult("idle");
  };

  // Mark card completed (fallback when patternType unavailable)
  const handleMarkCompleted = () => {
    if (!currentCard) return;
    markCardAsCompleted(currentJilid, currentCard.id);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowResult("idle");
  };

  const isCorrect = showResult === "correct";
  const isWrong = showResult === "wrong";
  const canGoPrevious =
    !isFlipped && allCards.findIndex((c) => c.id === currentCard?.id) > 0;

  let renderContent;
  if (isLoadingCards) {
    renderContent = (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#FEF3C7] font-black text-lg">Memuat kartu...</div>
      </div>
    );
  } else if (currentCard) {
    renderContent = (
      <>
        {/* Header */}
        <ExploreHeader
          title={`Kartu #${currentCard.cardIndex}`}
          subtitle={`Jilid ${currentJilid} • ${isAlreadyCompleted ? "Dikuasai" : "Latihan"}`}
          onBack={() =>
            navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`)
          }
          themeScope="arena-kartu"
          themeColorClass="bg-[#065F46]"
          borderColorClass="border-[#B45309]"
          shadowClass="shadow-[0_4px_0px_#78350F]"
          textColorClass="text-[#FEF3C7]"
          backClass="bg-[#FEF3C7] text-[#7C2D12] border-[#B45309] shadow-[2px_2px_0px_#78350F] hover:bg-[#FDE68A]"
        />

        {/* Cards Grid - Show only when not flipped */}
        {!isFlipped && (
          <section className="px-4 pt-4 flex justify-center">
            {isLoadingTimeline && (
              <div className="py-6 text-center text-[10px] font-black text-[#A7F3D0]">
                Memuat data Timeline Editor...
              </div>
            )}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 260 }}
              onClick={handleFlip}
              className={`relative cursor-pointer overflow-hidden rounded-3xl border-[4px] w-full max-w-sm p-6 text-center shadow-[6px_6px_0px_#78350F] transition-all ${
                isAlreadyCompleted
                  ? "bg-[#F0FDF4] border-[#10B981] hover:shadow-[8px_8px_0px_#065F46] cursor-pointer"
                  : "bg-[#FEF3C7] border-[#B45309] hover:shadow-[8px_8px_0px_#78350F]"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#B45309] px-2.5 py-1 text-xs font-black uppercase text-[#FEF3C7] shadow-xs">
                  Kartu #{String(currentCard.cardIndex).padStart(2, "0")}
                </span>
                {isAlreadyCompleted ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981] px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                    <CheckSvg size={13} /> Selesai
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-2.5 py-0.5 text-[11px] font-black text-[#78350F] shadow-xs">
                    Baru
                  </span>
                )}
              </div>

              {/* Front: Arabic Text */}
              <div
                className="my-6 py-4 flex items-center justify-center min-h-[140px]"
                dir="rtl"
              >
                <span
                  className={`font-arabic font-bold text-5xl sm:text-6xl leading-loose select-none drop-shadow-xs ${getArabicFontSizeClass(
                    currentCard.text,
                  )}`}
                >
                  {currentCard.text}
                </span>
              </div>

              {/* Transliteration */}
              <div className="text-center">
                <h3 className="font-display font-black text-xl text-[#78350F]">
                  {currentCard.transliteration}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#92400E] mt-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#FDE68A] border border-[#B45309]/30">
                    Nada: {currentCard.tone?.toUpperCase() ?? "DATAR"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FDE68A] border border-[#B45309]/30">
                    {currentCard.beatsCount} Ketukan
                  </span>
                </div>
              </div>

              {/* Tap to flip hint */}
              <div className="mt-4 text-center">
                <span className="text-[10px] font-black text-[#92400E] uppercase tracking-wider">
                  Klik atau ketuk untuk dengar & jawab pertanyaan
                </span>
              </div>
            </motion.div>
          </section>
        )}

        {/* Back Side - After Flip */}
        {isFlipped && (
          <section className="px-4 pt-4 max-w-md mx-auto flex flex-col gap-4">
            {/* Back Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#FEF3C7]/80 uppercase tracking-wider">
                Sisi Belakang
              </span>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="inline-flex items-center gap-1 rounded-lg bg-[#065F46] border border-[#B45309] px-2.5 py-1 text-xs font-black text-[#FEF3C7] shadow-xs hover:bg-[#0D9488] transition-all cursor-pointer select-none"
              >
                <span>Kembali</span>
                <ChevronRight size={10} />
              </button>
            </div>

            {/* Arabic Text (Back Side) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
              dir="rtl"
            >
              <span
                className={`font-arabic font-bold text-4xl sm:text-5xl leading-loose select-none drop-shadow-xs ${
                  isAlreadyCompleted ? "text-[#065F46]" : "text-[#7C2D12]"
                } ${getArabicFontSizeClass(currentCard.text)}`}
              >
                {currentCard.text}
              </span>
            </motion.div>

            {/* Audio Player */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handlePlayAudio}
                className="w-full py-4 rounded-2xl border-[3.5px] border-[#042F2E] bg-[#10B981] hover:bg-[#059669] active:translate-y-1 active:shadow-none text-white font-black text-base sm:text-lg shadow-[0_5px_0px_#042F2E] flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none"
              >
                <EqualizerIcon
                  isPlaying={isPlayingAudio}
                  size={22}
                  barClassName="bg-white"
                />
                <span>
                  {isPlayingAudio
                    ? "Mendengarkan Qari..."
                    : "Dengar Bacaan Qari"}
                </span>
                {listenCount > 0 && (
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                    {listenCount}x
                  </span>
                )}
              </button>

              {/* Transliteration Latin */}
              <div className="text-center py-3">
                <h3 className="font-display font-black text-2xl text-[#FEF3C7]">
                  {currentCard.transliteration}
                </h3>
                <p className="text-xs text-[#FDE047] mt-1">
                  Transliterasi Latin
                </p>
              </div>
            </div>

            {/* Mini Quiz Section */}
            <div className="pt-2">
              <h4 className="text-center text-sm font-black text-[#FEF3C7] mb-3">
                Pola irama apa yang digunakan pada bacaan ini?
              </h4>

              {currentCard.patternType ? (
                <div className="grid grid-cols-3 gap-3 justify-items-center">
                  {Object.entries(PATTERN_TO_ANSWER).map(
                    ([patternType, label]) => (
                      <PatternArrowButton
                        key={patternType}
                        type={patternType as PatternType}
                        onClick={() =>
                          handleSelectAnswer(patternType as PatternType)
                        }
                        active={selectedAnswer === patternType}
                        disabled={showResult !== "idle"}
                        label={label}
                      />
                    ),
                  )}
                </div>
              ) : (
                <div className="px-5 py-4 rounded-2xl border-[3px] text-center">
                  <span className="text-sm font-black text-[#92400E]">
                    Kuis belum tersedia untuk kartu ini
                  </span>
                </div>
              )}
            </div>

            {/* Action Button: Periksa Jawaban or Tandai Selesai */}
            <div className="flex justify-center">
              {currentCard.patternType ? (
                <StickerButton
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null || showResult !== "idle"}
                  className="px-6 py-3 rounded-xl border-[3px] font-black text-sm flex items-center gap-2 transition-all cursor-pointer select-none"
                >
                  <span>Periksa Jawaban</span>
                  <CheckSvg size={14} />
                </StickerButton>
              ) : (
                <StickerButton
                  onClick={handleMarkCompleted}
                  className="px-6 py-3 rounded-xl border-[3px] font-black text-sm flex items-center gap-2 transition-all cursor-pointer select-none bg-[#10B981] border-[#0D9488] shadow-[4px_4px_0px_#0D9488] hover:bg-[#059669] active:translate-y-[2px] text-white"
                >
                  <span>Tandai Selesai</span>
                  <CheckSvg size={14} />
                </StickerButton>
              )}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showResult !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`
                    px-5 py-4 rounded-2xl border-[3px] text-center shadow-[4px_4px_0px_#134E4A]
                    flex flex-col items-center gap-2
                    ${
                      isCorrect
                        ? "bg-[#DCFCE7] border-[#16A34A] shadow-[4px_4px_0px_#16A34A] spring"
                        : "bg-[#FFF0F0] border-[#FF6B6B] shadow-[4px_4px_0px_#FF6B6B] shake"
                    }`}
                >
                  <span className="text-3xl font-black">
                    {isCorrect ? "✅ Benar!" : "❌ Salah!"}
                  </span>
                  <span className="text-xs font-medium text-[#92400E]">
                    {isCorrect
                      ? `Irama ${correctLabel} tepat! Anda telah menguasai Kartu #${currentCard.cardIndex}.`
                      : `Irama yang benar: ${correctLabel}. Coba lagi!`}
                  </span>
                  {isWrong && (
                    <StickerButton
                      onClick={handleReset}
                      variant="secondary"
                      className="text-xs font-black text-[#991B1B] underline hover:text-[#991B1B]/80 p-1"
                    >
                      Coba Lagi
                    </StickerButton>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <StickerButton
                onClick={handlePrevCard}
                disabled={!canGoPrevious}
                variant="secondary"
                className="flex-1 rounded-xl border-[3px] px-3 py-2 text-xs font-black transition-all cursor-pointer select-none hover:bg-[#FDE68A]"
              >
                <span className="text-[#78350F]">Kartu Sebelumnya</span>
                <ChevronRight size={12} />
              </StickerButton>
              <StickerButton
                onClick={handleNextCard}
                className="flex-1 rounded-xl border-[3px] px-3 py-2 text-xs font-black text-white transition-all cursor-pointer select-none bg-[#10B981] border-[#0D9488] shadow-[2px_2px_0px_#0D9488] hover:bg-[#059669] active:translate-y-[1px]"
              >
                <span>Kartu Berikutnya</span>
                <ArrowRightSvg size={12} />
              </StickerButton>
            </div>
          </section>
        )}
      </>
    );
  } else {
    renderContent = (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#FEF3C7] font-black text-lg">
          Kartu tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <NgajiCeriaLayout
      title={
        isLoadingCards
          ? `Memuat Kartu - Jilid ${currentJilid}`
          : `Latihan Kartu #${currentCard?.cardIndex ?? "?"} - Jilid ${currentJilid}`
      }
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`)}
    >
      {renderContent}
    </NgajiCeriaLayout>
  );
}
