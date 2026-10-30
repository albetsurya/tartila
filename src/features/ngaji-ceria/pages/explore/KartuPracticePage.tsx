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
      <div className="flex flex-1 items-center justify-center min-h-[60vh] bg-[#FEF3C7]">
        <div className="text-[#451A03] font-black text-lg">
          Menyiapkan tenda latihan...
        </div>
      </div>
    );
  } else if (currentCard) {
    renderContent = (
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-hidden flex flex-col">
        {/* Tirai Kanvas Tenda Segitiga Kiri & Kanan */}
        <div
          className="pointer-events-none fixed top-0 left-0 w-24 h-44 bg-[#D97706]/30 z-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        <div
          className="pointer-events-none fixed top-0 right-0 w-24 h-44 bg-[#D97706]/30 z-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
        />

        <div className="relative z-10 flex flex-col flex-1 w-full max-w-md mx-auto">
          <ExploreHeader
            title={`Tenda #${currentCard.cardIndex}`}
            subtitle={`Kemah Jilid ${currentJilid} • ${isAlreadyCompleted ? "Dikuasai" : "Latihan"}`}
            onBack={() =>
              navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`)
            }
            themeScope="arena-kartu"
            themeColorClass="bg-[#78350F]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF08A] text-[#451A03] border-[#451A03] shadow-[2px_2px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          <div
            className="flex-1 flex items-center justify-center px-4 py-8 min-h-[calc(100dvh-140px)]"
            style={{ perspective: 1200 }}
          >
            {isLoadingTimeline && (
              <div className="py-6 text-center text-[10px] font-black text-[#78350F]">
                Memuat data Timeline Editor...
              </div>
            )}

            <AnimatePresence mode="wait">
              {!isFlipped ? (
                /* ==================================================== */
                /* SISI DEPAN: PAPAN KAYU DALAM TENDA KEMAH SAVANA       */
                /* ==================================================== */
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
                  className="w-full flex justify-center pt-8 relative"
                >
                  {/* Atap Tenda Segitiga di Atas Kartu */}
                  <div
                    className="pointer-events-none absolute top-0 left-4 right-4 h-9 bg-[#451A03] z-20"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    }}
                  >
                    <div
                      className="w-full h-full bg-[#D97706]"
                      style={{
                        clipPath: "polygon(50% 15%, 96% 100%, 4% 100%)",
                      }}
                    />
                  </div>

                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleFlip}
                    className={`relative z-10 cursor-pointer overflow-hidden rounded-b-3xl rounded-t-md border-[4px] border-[#451A03] w-full p-6 text-center shadow-[6px_6px_0px_#451A03] transition-shadow ${
                      isAlreadyCompleted ? "bg-[#DCFCE7]" : "bg-[#FFFBEB]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#78350F] border-[2px] border-[#451A03] px-2.5 py-1 text-xs font-black uppercase text-[#FEF3C7]">
                        Tenda #{String(currentCard.cardIndex).padStart(2, "0")}
                      </span>
                      {isAlreadyCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#15803D] border-[2px] border-[#451A03] px-2.5 py-0.5 text-xs font-black text-[#FFFFFF]">
                          <CheckSvg size={13} /> Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FACC15] border-[2px] border-[#451A03] px-2.5 py-0.5 text-[11px] font-black text-[#451A03]">
                          Baru
                        </span>
                      )}
                    </div>

                    <div
                      className="my-6 py-6 px-4 rounded-2xl bg-[#FEF3C7] border-[3px] border-dashed border-[#B45309] flex items-center justify-center min-h-[160px]"
                      dir="rtl"
                    >
                      <span
                        className={`font-arabic font-bold text-5xl sm:text-6xl text-[#451A03] leading-loose select-none ${getArabicFontSizeClass(
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

                    <div className="mt-6 text-center">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FEF08A] border-[3px] border-[#451A03] text-[11px] font-black text-[#451A03] uppercase tracking-wider shadow-[3px_3px_0px_#451A03]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-ping" />
                        Ketuk Papan Kayu Ini
                      </span>
                    </div>
                  </motion.div>
                </motion.section>
              ) : (
                /* ==================================================== */
                /* SISI BELAKANG: PAPAN KAYU ALAM TERBUKA & KOMPAS       */
                /* ==================================================== */
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
                  className="w-full flex flex-col gap-4 bg-[#78350F] border-[4px] border-[#451A03] rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_#451A03]"
                >
                  <div className="flex items-center justify-between pb-2 border-b-[3px] border-dashed border-[#D97706]">
                    <span className="text-[11px] font-black text-[#FEF08A] uppercase tracking-wider">
                      ✦ Papan Uji Irama Savana
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#FEF08A] border-[2.5px] border-[#451A03] px-2.5 py-1 text-xs font-black text-[#451A03] shadow-[2px_2px_0px_#451A03] hover:bg-[#FDE047] transition-all cursor-pointer select-none"
                    >
                      <span>Balik Papan</span>
                      <ChevronRight size={10} />
                    </button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-3 rounded-2xl bg-[#FEF3C7] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03]"
                    dir="rtl"
                  >
                    <span
                      className={`font-arabic font-bold text-4xl sm:text-5xl leading-loose select-none text-[#451A03] ${getArabicFontSizeClass(currentCard.text)}`}
                    >
                      {currentCard.text}
                    </span>
                  </motion.div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      className="w-full py-3.5 rounded-2xl border-[3.5px] border-[#451A03] bg-[#15803D] hover:bg-[#166534] active:translate-y-1 active:shadow-none text-[#FFFFFF] font-black text-sm sm:text-base shadow-[0_5px_0px_#451A03] flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none"
                    >
                      <EqualizerIcon
                        isPlaying={isPlayingAudio}
                        size={20}
                        barClassName="bg-[#FFFFFF]"
                      />
                      <span>
                        {isPlayingAudio
                          ? "Mendengarkan Qari..."
                          : "Dengar Bacaan Qari"}
                      </span>
                      {listenCount > 0 && (
                        <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-[#451A03] text-[#FEF08A] font-bold">
                          {listenCount}x
                        </span>
                      )}
                    </button>

                    <div className="text-center py-2 bg-[#451A03] rounded-xl border-[2.5px] border-[#D97706]">
                      <h3 className="font-display font-black text-xl text-[#FEF3C7]">
                        {currentCard.transliteration}
                      </h3>
                      <p className="text-[10px] text-[#FACC15] font-bold mt-0.5">
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
                      <div className="px-5 py-4 rounded-2xl border-[3px] border-[#451A03] text-center bg-[#FEF3C7]">
                        <span className="text-sm font-black text-[#78350F]">
                          Kuis belum tersedia untuk tenda ini
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
                        className="px-6 py-3 rounded-xl border-[3px] border-[#451A03] bg-[#FEF08A] text-[#451A03] font-black text-sm flex items-center gap-2 transition-all cursor-pointer select-none shadow-[3px_3px_0px_#451A03] disabled:opacity-50 disabled:shadow-none active:translate-y-[2px]"
                      >
                        <span>Periksa Jawaban</span>
                        <CheckSvg size={14} />
                      </StickerButton>
                    ) : (
                      <StickerButton
                        onClick={handleMarkCompleted}
                        className="px-6 py-3 rounded-xl border-[3px] border-[#451A03] bg-[#15803D] text-[#FFFFFF] font-black text-sm flex items-center gap-2 transition-all cursor-pointer select-none shadow-[4px_4px_0px_#451A03] hover:bg-[#166534] active:translate-y-[2px]"
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
                        className={`px-4 py-3 rounded-2xl border-[3px] border-[#451A03] text-center shadow-[4px_4px_0px_#451A03] flex flex-col items-center gap-1 ${
                          isCorrect ? "bg-[#DCFCE7]" : "bg-[#FFE4E6]"
                        }`}
                      >
                        <span className="text-xl font-black text-[#451A03]">
                          {isCorrect ? "✅ Benar!" : "❌ Salah!"}
                        </span>
                        <span className="text-[11px] font-bold text-[#78350F]">
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

                  {/* Tombol Navigasi Panah Kayu & Kompas */}
                  <div className="flex gap-2.5 pt-2">
                    <StickerButton
                      onClick={handlePrevCard}
                      disabled={!canGoPrevious}
                      variant="secondary"
                      className="flex-1 rounded-xl border-[3px] border-[#451A03] bg-[#FEF3C7] px-2 py-2.5 text-[11px] font-black transition-all cursor-pointer select-none shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
                    >
                      <span className="text-[#451A03]">◀ Panah Sebelumnya</span>
                    </StickerButton>
                    <StickerButton
                      onClick={handleNextCard}
                      className="flex-1 rounded-xl border-[3px] border-[#451A03] px-2 py-2.5 text-[11px] font-black text-[#FFFFFF] transition-all cursor-pointer select-none bg-[#D97706] shadow-[3px_3px_0px_#451A03] hover:bg-[#B45309] active:translate-y-[1px]"
                    >
                      <span>Panah Berikutnya ▶</span>
                      <ArrowRightSvg size={12} />
                    </StickerButton>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  } else {
    renderContent = (
      <div className="flex flex-1 items-center justify-center min-h-[60vh] bg-[#FEF3C7]">
        <div className="text-[#451A03] font-black text-lg">
          Tenda kartu tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <NgajiCeriaLayout
      title={
        isLoadingCards
          ? `Memuat Tenda - Jilid ${currentJilid}`
          : `Latihan Tenda #${currentCard?.cardIndex ?? "?"} - Jilid ${currentJilid}`
      }
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`)}
    >
      {renderContent}
    </NgajiCeriaLayout>
  );
}
