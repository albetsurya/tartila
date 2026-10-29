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
import {
  CheckSvg,
  ChevronRight,
  ArrowRightSvg,
} from "@/components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";

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

  const [allCards, setAllCards] = useState<ArenaKartuMateri[]>([]);
  const [currentCard, setCurrentCard] = useState<ArenaKartuMateri | undefined>(
    undefined,
  );
  const [isLoadingCards, setIsLoadingCards] = useState(true);

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

  const { playCardSound, stopAudio, preloadAudio } = useRhythmMemoryAudio();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<PatternType | null>(
    null,
  );
  const [showResult, setShowResult] = useState<"idle" | "correct" | "wrong">(
    "idle",
  );
  const [listenCount, setListenCount] = useState(0);

  useEffect(() => {
    void preloadAudio();
    return () => {
      stopAudio();
    };
  }, [preloadAudio, stopAudio]);

  const correctAnswer = currentCard?.patternType;
  const correctLabel = correctAnswer ? PATTERN_TO_ANSWER[correctAnswer] : "";

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    try {
      triggerBibiReaction("click");
      soundManager.playSfx("pop");
    } catch (e) {
      console.warn("[flip] sfx error:", e);
    }
  };

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

  const handleSelectAnswer = (answer: PatternType) => {
    if (showResult !== "idle") return;
    setSelectedAnswer(answer);
  };

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

  const handleNextCard = () => {
    if (!currentCard) return;
    const currentIndex = allCards.findIndex((c) => c.id === currentCard.id);
    if (currentIndex >= 0 && currentIndex < allCards.length - 1) {
      const nextCard = allCards[currentIndex + 1];
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

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult("idle");
  };

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
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="text-[#FEF3C7] font-black text-lg">Memuat kartu...</div>
      </div>
    );
  } else if (currentCard) {
    renderContent = (
      <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
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

        {/* Wrapper untuk memastikan kartu berada tepat di tengah layar */}
        <div
          className="flex-1 flex items-center justify-center px-4 py-8 min-h-[calc(100dvh-140px)]"
          style={{ perspective: 1200 }}
        >
          {isLoadingTimeline && (
            <div className="py-6 text-center text-[10px] font-black text-[#A7F3D0]">
              Memuat data Timeline Editor...
            </div>
          )}

          <AnimatePresence mode="wait">
            {!isFlipped ? (
              /* =============================== */
              /* SISI DEPAN KARTU                */
              /* =============================== */
              <motion.section
                key={`front-${currentCard.id}`}
                initial={{ scale: 1.25, rotateY: -90, opacity: 0 }}
                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                exit={{
                  rotateY: 90,
                  scale: 1.08,
                  opacity: 0,
                  transition: { duration: 0.25, ease: "easeIn" },
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full flex justify-center"
              >
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFlip}
                  className={`relative cursor-pointer overflow-hidden rounded-3xl border-[4px] w-full p-6 text-center shadow-[6px_6px_0px_#78350F] transition-shadow ${
                    isAlreadyCompleted
                      ? "bg-[#F0FDF4] border-[#10B981] hover:shadow-[8px_8px_0px_#065F46]"
                      : "bg-[#FEF3C7] border-[#B45309] hover:shadow-[8px_8px_0px_#78350F]"
                  }`}
                >
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

                  <div
                    className="my-8 py-4 flex items-center justify-center min-h-[160px]"
                    dir="rtl"
                  >
                    <span
                      className={`font-arabic font-bold text-5xl sm:text-6xl leading-loose select-none drop-shadow-sm ${getArabicFontSizeClass(
                        currentCard.text,
                      )}`}
                    >
                      {currentCard.text}
                    </span>
                  </div>

                  <div className="text-center">
                    <h3 className="font-display font-black text-xl text-[#78350F]">
                      {currentCard.transliteration}
                    </h3>
                  </div>

                  <div className="mt-8 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 border-2 border-[#B45309]/30 text-[11px] font-black text-[#92400E] uppercase tracking-wider animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#B45309] animate-ping" />
                      Ketuk Kartu Ini
                    </span>
                  </div>
                </motion.div>
              </motion.section>
            ) : (
              /* =============================== */
              /* SISI BELAKANG KARTU (KUIS)      */
              /* =============================== */
              <motion.section
                key={`back-${currentCard.id}`}
                initial={{ rotateY: -90, scale: 0.85, opacity: 0 }}
                animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                exit={{
                  rotateY: 90,
                  scale: 0.9,
                  opacity: 0,
                  transition: { duration: 0.2, ease: "easeIn" },
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full flex flex-col gap-4 bg-[#065F46]/40 border-[3px] border-[#10B981]/30 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#10B981]/30">
                  <span className="text-[11px] font-black text-[#FEF3C7]/80 uppercase tracking-wider">
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

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-2"
                  dir="rtl"
                >
                  <span
                    className={`font-arabic font-bold text-4xl sm:text-5xl leading-loose select-none drop-shadow-md text-[#FEF3C7] ${getArabicFontSizeClass(currentCard.text)}`}
                  >
                    {currentCard.text}
                  </span>
                </motion.div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handlePlayAudio}
                    className="w-full py-3.5 rounded-2xl border-[3.5px] border-[#042F2E] bg-[#10B981] hover:bg-[#059669] active:translate-y-1 active:shadow-none text-white font-black text-sm sm:text-base shadow-[0_5px_0px_#042F2E] flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none"
                  >
                    <EqualizerIcon
                      isPlaying={isPlayingAudio}
                      size={20}
                      barClassName="bg-white"
                    />
                    <span>
                      {isPlayingAudio
                        ? "Mendengarkan Qari..."
                        : "Dengar Bacaan Qari"}
                    </span>
                    {listenCount > 0 && (
                      <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                        {listenCount}x
                      </span>
                    )}
                  </button>

                  <div className="text-center py-2 bg-[#042F2E]/60 rounded-xl border border-[#10B981]/20">
                    <h3 className="font-display font-black text-xl text-[#FEF3C7]">
                      {currentCard.transliteration}
                    </h3>
                    <p className="text-[10px] text-[#FDE047]/80 mt-0.5">
                      Transliterasi Latin
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-center text-[13px] font-black text-[#FEF3C7] mb-3">
                    Pola irama apa yang digunakan pada bacaan ini?
                  </h4>

                  {currentCard.patternType ? (
                    <div className="grid grid-cols-3 gap-2.5 justify-items-center">
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
                    <div className="px-5 py-4 rounded-2xl border-[3px] text-center bg-[#FEF3C7]">
                      <span className="text-sm font-black text-[#92400E]">
                        Kuis belum tersedia untuk kartu ini
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-2">
                  {currentCard.patternType ? (
                    <StickerButton
                      onClick={handleCheckAnswer}
                      disabled={
                        selectedAnswer === null || showResult !== "idle"
                      }
                      className="px-6 py-3 rounded-xl border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black text-sm flex items-center gap-2 transition-all cursor-pointer select-none shadow-[3px_3px_0px_#134E4A] disabled:opacity-50 disabled:shadow-none active:translate-y-[2px]"
                    >
                      <span>Periksa Jawaban</span>
                      <CheckSvg size={14} />
                    </StickerButton>
                  ) : (
                    <StickerButton
                      onClick={handleMarkCompleted}
                      className="px-6 py-3 rounded-xl border-[3px] border-[#0D9488] bg-[#10B981] text-white font-black text-sm flex items-center gap-2 transition-all cursor-pointer select-none shadow-[4px_4px_0px_#0D9488] hover:bg-[#059669] active:translate-y-[2px]"
                    >
                      <span>Tandai Selesai</span>
                      <CheckSvg size={14} />
                    </StickerButton>
                  )}
                </div>

                <AnimatePresence>
                  {showResult !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`
                        px-4 py-3 rounded-2xl border-[3px] text-center shadow-[4px_4px_0px_#134E4A]
                        flex flex-col items-center gap-1
                        ${
                          isCorrect
                            ? "bg-[#DCFCE7] border-[#16A34A] shadow-[4px_4px_0px_#16A34A]"
                            : "bg-[#FFF0F0] border-[#FF6B6B] shadow-[4px_4px_0px_#FF6B6B]"
                        }`}
                    >
                      <span className="text-xl font-black">
                        {isCorrect ? "✅ Benar!" : "❌ Salah!"}
                      </span>
                      <span className="text-[11px] font-bold text-[#92400E]">
                        {isCorrect
                          ? `Irama ${correctLabel} tepat!`
                          : `Irama yang benar: ${correctLabel}.`}
                      </span>
                      {isWrong && (
                        <StickerButton
                          onClick={handleReset}
                          variant="secondary"
                          className="mt-1 text-[10px] font-black text-[#991B1B] underline hover:text-[#991B1B]/80 p-0"
                        >
                          Coba Lagi
                        </StickerButton>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2.5 pt-2">
                  <StickerButton
                    onClick={handlePrevCard}
                    disabled={!canGoPrevious}
                    variant="secondary"
                    className="flex-1 rounded-xl border-[2px] px-2 py-2 text-[11px] font-black transition-all cursor-pointer select-none hover:bg-[#FDE68A]"
                  >
                    <span className="text-[#78350F]">Sebelumnya</span>
                    <ChevronRight size={12} />
                  </StickerButton>
                  <StickerButton
                    onClick={handleNextCard}
                    className="flex-1 rounded-xl border-[2px] px-2 py-2 text-[11px] font-black text-white transition-all cursor-pointer select-none bg-[#10B981] border-[#0D9488] shadow-[2px_2px_0px_#0D9488] hover:bg-[#059669] active:translate-y-[1px]"
                  >
                    <span>Berikutnya</span>
                    <ArrowRightSvg size={12} />
                  </StickerButton>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  } else {
    renderContent = (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
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
