import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  ExploreHeader,
  ExploreStatBadge,
} from "../../components/ExploreHeader";
import { loadTimelineEdits } from "../../utils/timelineEditsLoader";
import type { TimelineEdits } from "../../utils/timelineEditsLoader";
import {
  getArenaKartuMateri,
  getArabicFontSizeClass,
  getArenaKartuLevelInfo,
  type ArenaKartuMateri,
} from "../../utils/tilawatiTrainingDataAdapter";
import { useEconomyStore } from "../../hooks/useEconomyStore";
import {
  StarSvg,
  CheckSvg,
  ChevronRight,
  BookOpen,
  ClipboardListSvg,
  LockSvg,
  HelpCircleSvg,
} from "@/components/ui/CustomIcons";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { soundManager } from "@/features/ngaji-ceria/services/soundManager";

export default function ArenaKartuPage() {
  const navigate = useNavigate();
  const { jilid: jilidParam } = useParams<{ jilid?: string }>();

  const currentJilid = useMemo(() => {
    const parsed = Number(jilidParam);
    return parsed >= 1 && parsed <= 6 ? parsed : 1;
  }, [jilidParam]);

  const levelInfo = useMemo(() => {
    return getArenaKartuLevelInfo(currentJilid);
  }, [currentJilid]);

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

  const [cards, setCards] = useState<ArenaKartuMateri[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  useEffect(() => {
    let alive = true;
    void getArenaKartuMateri(currentJilid, timelineData)
      .then((result) => {
        if (alive) setCards(result);
      })
      .finally(() => {
        if (alive) setIsLoadingCards(false);
      });
    return () => {
      alive = false;
    };
  }, [currentJilid, timelineData]);

  const completedArenaCards = useEconomyStore((s) => s.completedArenaCards);
  const completedList = useMemo(() => {
    return completedArenaCards?.[currentJilid] || [];
  }, [completedArenaCards, currentJilid]);

  const completedCount = useMemo(() => {
    return cards.filter((c) => completedList.includes(c.id)).length;
  }, [cards, completedList]);

  const progressPercent =
    cards.length > 0 ? Math.round((completedCount / cards.length) * 100) : 0;

  const [selectedCard, setSelectedCard] = useState<ArenaKartuMateri | null>(
    null,
  );
  const [cardOrigin, setCardOrigin] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleCardClick = (
    card: ArenaKartuMateri,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (selectedCard) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    setCardOrigin({
      x: cardCenterX - centerX,
      y: cardCenterY - centerY,
    });

    triggerBibiReaction("click");
    soundManager.playSfx("pop");
    setSelectedCard(card);
  };

  const handleAnimationComplete = () => {
    if (selectedCard) {
      navigate(
        `/member/ngaji-ceria/arena-kartu/${currentJilid}/practice/${selectedCard.id}`,
      );
    }
  };

  return (
    <NgajiCeriaLayout
      title={`Perkemahan Savana - Jilid ${currentJilid}`}
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate("/member/ngaji-ceria/training")}
    >
      {/* Latar Padang Rumput Savana */}
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-hidden pb-48 select-none">
        {/* Pola Bintik Matahari Savana */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(#D97706 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Bukit Rumput Savana di Latar Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-44 bg-[#15803D] border-t-[4px] border-[#134E4A] z-0"
          style={{
            clipPath:
              "polygon(0% 35%, 20% 15%, 45% 30%, 70% 10%, 100% 25%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="relative z-20">
          <ExploreHeader
            title={`Kemah Jilid ${currentJilid}`}
            subtitle={levelInfo.subtitle}
            onBack={() => navigate("/member/ngaji-ceria/training")}
            themeScope="arena-kartu"
            themeColorClass="bg-[#D97706]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
            extraBadge={
              <ExploreStatBadge
                icon={<StarSvg size={18} fill="#FACC15" className="shrink-0" />}
                value={`${completedCount}/${cards.length}`}
                title={`Progres: ${completedCount} dari ${cards.length} Tenda`}
                className="bg-[#FEF3C7] text-[#451A03] border-[#451A03] shadow-[2px_2px_0px_#451A03]"
              />
            }
            rightAction={
              <button
                type="button"
                onClick={() => navigate("/member/ngaji-ceria/arena-kartu")}
                className="inline-flex items-center gap-1 rounded-xl border-[3px] border-[#451A03] bg-[#FEF08A] px-3 py-1 text-xs font-black text-[#451A03] shadow-[3px_3px_0px_#451A03] active:translate-y-[1px] hover:bg-[#FDE047] transition-all cursor-pointer shrink-0"
              >
                <span>Pindah Kemah</span>
                <ChevronRight size={12} />
              </button>
            }
          />

          {/* PAPAN KAYU UTAMA PERKEMAHAN SAVANA & API UNGGUN */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative">
              {/* Tiang Kayu Penyangga Papan */}
              <div className="pointer-events-none absolute -bottom-5 left-10 w-4 h-6 bg-[#78350F] border-x-[3px] border-[#451A03]" />
              <div className="pointer-events-none absolute -bottom-5 right-10 w-4 h-6 bg-[#78350F] border-x-[3px] border-[#451A03]" />

              <div className="relative rounded-2xl bg-[#78350F] border-[4px] border-[#451A03] p-4 sm:p-5 text-[#FEF3C7] shadow-[6px_6px_0px_#451A03]">
                {/* Paku Kayu Sudut */}
                <span className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-[#F59E0B] border-[2px] border-[#451A03]" />
                <span className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-[#F59E0B] border-[2px] border-[#451A03]" />

                <div className="flex items-center justify-between gap-3 mb-3 pt-1">
                  <div className="flex items-center gap-3">
                    {/* Ikon Api Unggun Savana */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDE68A] border-[3px] border-[#451A03] text-[#451A03] shadow-[3px_3px_0px_#451A03]">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2C12 2 7 7 7 12C7 15.3 9.2 18 12 18C14.8 18 17 15.3 17 12C17 9.5 15.5 7.5 14 6C14 8 12.5 9 12.5 9C12.5 6 12 2 12 2Z"
                          fill="#EF4444"
                          stroke="#451A03"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 10C12 10 10 12 10 14C10 15.5 10.9 16.5 12 16.5C13.1 16.5 14 15.5 14 14C14 12 12 10 12 10Z"
                          fill="#FACC15"
                        />
                        <path
                          d="M4 20L20 17M4 17L20 20"
                          stroke="#78350F"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-[#FEF08A] flex items-center gap-1.5">
                        <ClipboardListSvg size={16} /> Eksplorasi Tenda Jilid{" "}
                        {currentJilid}
                      </h2>
                      <span className="text-xs text-[#FDE68A] font-bold">
                        Ketuk tenda kemah untuk membuka tirai & melatih irama!
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#451A03] px-3 py-1.5 text-right shrink-0 border-[3px] border-[#D97706]">
                    <span className="text-sm sm:text-base font-black text-[#FEF08A]">
                      {completedCount} / {cards.length}
                    </span>
                    <span className="block text-[10px] font-black text-[#4ADE80]">
                      {progressPercent}% Tenda
                    </span>
                  </div>
                </div>

                <div className="h-4 w-full rounded-full bg-[#451A03] border-[3px] border-[#FEF08A] overflow-hidden p-0.5">
                  <motion.div
                    className="h-full rounded-full bg-[#15803D]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* GRID TENDA KEMAH SAVANA */}
          <section className="px-4 pt-9 max-w-4xl mx-auto">
            {isLoadingTimeline && (
              <div className="py-8 text-center text-xs font-black text-[#78350F]">
                Memuat data Timeline Editor...
              </div>
            )}
            {isLoadingCards && !isLoadingTimeline ? (
              <div className="py-8 text-center text-xs font-black text-[#78350F]">
                Mendirikan tenda kartu jilid...
              </div>
            ) : cards.length === 0 ? (
              <div className="rounded-2xl border-[4px] border-[#451A03] bg-[#FEF3C7] text-center py-12 text-[#451A03] font-black text-lg shadow-[6px_6px_0px_#451A03]">
                Segera Hadir untuk Kemah Jilid ini
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-8">
                {cards.map((card, index) => {
                  const isCompleted = completedList.includes(card.id);
                  const isSelected = selectedCard?.id === card.id;
                  const tiltClass =
                    index % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]";

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{
                        opacity: isSelected ? 0 : 1,
                        scale: isSelected ? 0.95 : 1,
                        y: 0,
                      }}
                      transition={{
                        delay: isSelected ? 0 : index * 0.03,
                        type: "spring",
                        stiffness: 280,
                        damping: 22,
                      }}
                      whileHover={{ y: -5, scale: 1.03, rotate: 0 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={(e) => handleCardClick(card, e)}
                      className={`group relative cursor-pointer select-none flex flex-col pt-9 ${tiltClass}`}
                    >
                      {/* Bendera Kecil di Puncak Tenda */}
                      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                        <div
                          className={`w-5 h-3.5 border-[2px] border-[#451A03] ${
                            isCompleted ? "bg-[#15803D]" : "bg-[#EF4444]"
                          }`}
                          style={{
                            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                          }}
                        />
                        <div className="w-[3px] h-2 bg-[#451A03]" />
                      </div>

                      {/* ATAP SEGITIGA TENDA KEMAH (CLIP-PATH) */}
                      <div
                        className="pointer-events-none absolute top-3 left-0 right-0 h-8 bg-[#451A03] z-10"
                        style={{
                          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                        }}
                      >
                        <div
                          className={`w-full h-full ${
                            isCompleted ? "bg-[#15803D]" : "bg-[#D97706]"
                          }`}
                          style={{
                            clipPath: "polygon(50% 14%, 95% 100%, 5% 100%)",
                          }}
                        />
                      </div>

                      {/* Badan Utama Tenda Kemah */}
                      <div
                        className={`relative z-10 overflow-hidden rounded-b-2xl rounded-t-sm border-[4px] border-[#451A03] p-3 text-center flex flex-col justify-between aspect-[3/3.6] ${
                          isCompleted
                            ? "bg-[#FFFBEB] shadow-[5px_5px_0px_#451A03]"
                            : "bg-[#FDE68A] shadow-[5px_5px_0px_#451A03]"
                        }`}
                      >
                        {/* Tirai Kiri & Kanan Tenda */}
                        <div
                          className="pointer-events-none absolute top-0 left-0 w-6 h-12 bg-[#B45309]/25"
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 0 100%)",
                          }}
                        />
                        <div
                          className="pointer-events-none absolute top-0 right-0 w-6 h-12 bg-[#B45309]/25"
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                          }}
                        />

                        {/* Pojok Atas Nomor & Status */}
                        <div className="w-full flex items-center justify-between z-10 px-1 pt-0.5">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase border-[2px] border-[#451A03] ${
                              isCompleted
                                ? "bg-[#15803D] text-[#FFFFFF]"
                                : "bg-[#78350F] text-[#FEF08A]"
                            }`}
                          >
                            #{String(card.cardIndex).padStart(2, "0")}
                          </span>

                          {isCompleted ? (
                            <span className="w-6 h-6 rounded-full bg-[#15803D] border-[2px] border-[#451A03] text-[#FFFFFF] flex items-center justify-center text-[10px] font-black shadow-[1.5px_1.5px_0px_#451A03]">
                              <CheckSvg size={12} />
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-[#78350F] border-[2px] border-[#451A03] text-[#FEF08A] flex items-center justify-center">
                              <LockSvg size={11} />
                            </span>
                          )}
                        </div>

                        {/* Bagian Dalam Pintu Tenda */}
                        {isCompleted ? (
                          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-1 px-1">
                            <div
                              className="flex items-center justify-center w-full my-auto"
                              dir="rtl"
                            >
                              <span
                                className={`font-arabic font-bold text-[#451A03] leading-loose max-w-full break-words select-none ${getArabicFontSizeClass(
                                  card.text,
                                )}`}
                              >
                                {card.text}
                              </span>
                            </div>
                            <span className="text-[10px] font-black text-[#15803D] line-clamp-1 bg-[#DCFCE7] px-2 py-0.5 rounded-md border-[2px] border-[#451A03]">
                              {card.transliteration}
                            </span>
                          </div>
                        ) : (
                          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto">
                            {/* Pintu Tenda Segitiga Tertutup */}
                            <div className="w-16 h-16 bg-[#D97706] border-[3px] border-[#451A03] flex items-center justify-center shadow-[3px_3px_0px_#451A03] mb-2 group-hover:scale-110 transition-transform rounded-xl">
                              <div className="text-[#FEF3C7]">
                                <HelpCircleSvg size={24} />
                              </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#78350F]">
                              Buka Tenda
                            </span>
                          </div>
                        )}

                        {/* Alas Papan Kayu Tenda */}
                        <div className="relative z-10 w-full pt-1.5">
                          <div
                            className={`inline-flex items-center justify-center gap-1 w-full py-1.5 rounded-xl text-[10px] font-black uppercase border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] transition-colors ${
                              isCompleted
                                ? "bg-[#4ADE80] text-[#14532D]"
                                : "bg-[#78350F] text-[#FEF08A]"
                            }`}
                          >
                            <span>
                              {isCompleted ? "Masuk Lagi" : "Masuk Tenda"}
                            </span>
                            <ChevronRight size={11} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* DOCK NAVIGASI BAWAH: PAPAN PENUNJUK KAYU & KOMPAS SAVANA */}
          <div className="fixed bottom-20 sm:bottom-24 left-0 right-0 z-50 px-4 pointer-events-none">
            <div className="mx-auto max-w-md pointer-events-auto">
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#78350F] border-[4px] border-[#451A03] p-2.5 shadow-[0_6px_0px_#451A03]">
                <button
                  type="button"
                  onClick={() => navigate("/member/ngaji-ceria/training")}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-[#451A03] bg-[#FEF08A] hover:bg-[#FDE047] active:translate-y-[1px] active:shadow-none px-3 py-2.5 text-xs font-black text-[#451A03] shadow-[3px_3px_0px_#451A03] transition-all cursor-pointer select-none"
                >
                  <BookOpen size={15} />
                  <span>Pos Savana</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/member/ngaji-ceria/arena-kartu")}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-[#451A03] bg-[#15803D] hover:bg-[#166534] active:translate-y-[1px] active:shadow-none px-3 py-2.5 text-xs font-black text-[#FFFFFF] shadow-[3px_3px_0px_#451A03] transition-all cursor-pointer select-none"
                >
                  <span>Pindah Jilid</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-auto overflow-hidden"
            style={{ perspective: 1200 }}
            initial={{ backgroundColor: "rgba(69, 26, 3, 0)" }}
            animate={{ backgroundColor: "rgba(69, 26, 3, 0.85)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-0 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            />

            <motion.div
              initial={{
                x: cardOrigin.x,
                y: cardOrigin.y,
                scale: 0.65,
                rotateY: 0,
                rotateZ: 0,
                opacity: 1,
              }}
              animate={{
                x: [cardOrigin.x, 0, 0],
                y: [cardOrigin.y, 0, 0],
                scale: [0.65, 1.15, 4.8],
                rotateY: [0, 180, 180],
                rotateZ: [0, -3, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 0.95,
                times: [0, 0.52, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={handleAnimationComplete}
              className="relative w-60 sm:w-64 aspect-[3/4]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className={`absolute inset-0 rounded-3xl border-[4px] border-[#451A03] p-4 flex flex-col justify-between items-center shadow-[6px_6px_0px_#451A03] ${
                  completedList.includes(selectedCard.id)
                    ? "bg-[#FFFBEB]"
                    : "bg-[#D97706]"
                }`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-xs font-black uppercase ${
                      completedList.includes(selectedCard.id)
                        ? "text-[#15803D]"
                        : "text-[#FEF08A]"
                    }`}
                  >
                    #{String(selectedCard.cardIndex).padStart(2, "0")}
                  </span>
                </div>

                <div className="my-auto flex flex-col items-center">
                  {completedList.includes(selectedCard.id) ? (
                    <span
                      dir="rtl"
                      className="font-arabic font-bold text-3xl text-[#451A03]"
                    >
                      {selectedCard.text}
                    </span>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#FEF08A] border-[3px] border-[#451A03] flex items-center justify-center rotate-45">
                      <div className="-rotate-45 text-[#451A03]">
                        <HelpCircleSvg size={28} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full py-1.5 rounded-xl bg-[#451A03] text-[10px] font-black text-center text-[#FEF08A] uppercase">
                  Membuka Tenda...
                </div>
              </div>

              <div
                className="absolute inset-0 rounded-3xl border-[4px] border-[#451A03] bg-[#FEF3C7] p-6 flex flex-col items-center justify-center shadow-[8px_8px_0px_#451A03]"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FDE68A] border-[3px] border-[#451A03] flex items-center justify-center mb-3 shadow-[3px_3px_0px_#451A03]">
                  <StarSvg
                    size={34}
                    fill="#F59E0B"
                    className="text-[#B45309]"
                  />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#B45309] text-[#FEF3C7] text-[10px] font-black uppercase tracking-wider mb-2">
                  Tenda #{String(selectedCard.cardIndex).padStart(2, "0")}
                </span>
                <div dir="rtl" className="my-2 text-center">
                  <span className="font-arabic font-bold text-4xl text-[#78350F]">
                    {selectedCard.text}
                  </span>
                </div>
                <p className="font-display font-black text-sm text-[#92400E] mt-1">
                  {selectedCard.transliteration}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NgajiCeriaLayout>
  );
}
