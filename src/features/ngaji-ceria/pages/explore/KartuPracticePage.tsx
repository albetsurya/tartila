import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NgajiCeriaLayout } from '../../components/NgajiCeriaLayout';
import { ExploreHeader } from '../../components/ExploreHeader';
import {
  ARENA_KARTU_DATA,
  getArenaKartuMateri,
  getArenaKartuCardById,
  getArabicFontSizeClass,
  ArenaKartuMateri,
} from '../../data/arenaKartuData';
import { RhythmTapZone } from '../../components/rhythm-memory/RhythmTapZone';
import { useRhythmMemoryAudio } from '../../hooks/useRhythmMemoryAudio';
import { useEconomyStore } from '../../hooks/useEconomyStore';
import { soundManager } from '../../services/soundManager';
import { triggerBibiReaction } from '@/utils/bibiEvent';
import { CheckSvg, ChevronRight, Volume2Svg, RotateCcwSvg } from '@/components/ui/CustomIcons';
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import type { HitResult } from '../../components/lab-irama/timingJudge';

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

  const levelInfo = useMemo(() => {
    return (
      ARENA_KARTU_DATA.find((l) => l.jilid === currentJilid) ||
      ARENA_KARTU_DATA[0]
    );
  }, [currentJilid]);

  const allCards = useMemo(() => {
    return getArenaKartuMateri(currentJilid);
  }, [currentJilid]);

  const currentCard = useMemo(() => {
    if (cardIdParam) {
      const found = getArenaKartuCardById(currentJilid, cardIdParam);
      if (found) return found;
    }
    return allCards[0];
  }, [currentJilid, cardIdParam, allCards]);

  const completedArenaCards = useEconomyStore((s) => s.completedArenaCards);
  const markCardAsCompleted = useEconomyStore((s) => s.markCardAsCompleted);

  const isAlreadyCompleted = useMemo(() => {
    const list = completedArenaCards?.[currentJilid] || [];
    return list.includes(currentCard.id);
  }, [completedArenaCards, currentJilid, currentCard.id]);

  // Audio Hook
  const { playCardSound, stopAudio, preloadAudio } = useRhythmMemoryAudio();

  // State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [listenCount, setListenCount] = useState(0);
  const [isTapZoneActive, setIsTapZoneActive] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastJudgment, setLastJudgment] = useState<HitResult | null>(null);

  // Preload AudioContext on mount
  useEffect(() => {
    void preloadAudio();
    return () => {
      stopAudio();
    };
  }, [preloadAudio, stopAudio]);

  // Putar Audio Qari
  const handlePlayAudio = useCallback(() => {
    triggerBibiReaction('click');
    soundManager.playSfx('pop');
    setIsPlayingAudio(true);
    setListenCount((c) => c + 1);

    void playCardSound({
      audioUrl: currentCard.audioUrl,
      tone: currentCard.tone,
      bpm: currentCard.bpm,
      beatsCount: currentCard.beatsCount,
    });

    const duration = (60 / currentCard.bpm) * currentCard.beatsCount * 1000 + 1200;
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, duration);
  }, [currentCard, playCardSound]);

  // Buka Mode Latihan Ketuk
  const handleStartTapping = () => {
    triggerBibiReaction('click');
    soundManager.playSfx('pop');
    setIsTapZoneActive(true);
    handlePlayAudio();
  };

  // Handler Berhasil Ketuk (Minimal Good / Perfect)
  const handleTapSuccess = (result: HitResult) => {
    setLastJudgment(result);
    setIsTapZoneActive(false);

    // Tandai kartu selesai secara permanen di Zustand & LocalStorage
    markCardAsCompleted(currentJilid, currentCard.id);

    triggerBibiReaction('success');
    soundManager.playSfx('victory');
    setIsSuccessModalOpen(true);
  };

  // Handler Meleset / Gagal Ketuk
  const handleTapFail = (result: HitResult) => {
    setLastJudgment(result);
    soundManager.playSfx('wrong');
  };

  // Navigasi ke kartu berikutnya di Jilid yang sama
  const handleNextCard = () => {
    setIsSuccessModalOpen(false);
    const currentIndex = allCards.findIndex((c) => c.id === currentCard.id);
    if (currentIndex >= 0 && currentIndex < allCards.length - 1) {
      const nextCard = allCards[currentIndex + 1];
      navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}/practice/${nextCard.id}`);
    } else {
      navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`);
    }
  };

  return (
    <NgajiCeriaLayout
      title={`Latihan Kartu #${currentCard.cardIndex} - Jilid ${currentJilid}`}
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`)}
    >
      <div className="relative min-h-[100dvh] w-full bg-[#065F46] overflow-x-hidden pb-44 select-none">
        {/* Latar Belakang Felt Hijau Kasino Santri */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 20%, #10B98133 0, transparent 65%)',
          }}
        />

        <div className="relative z-20">
          {/* Header Eksplorasi */}
          <ExploreHeader
            title={`Kartu #${currentCard.cardIndex}`}
            subtitle={`Latihan ${levelInfo.title}`}
            onBack={() => navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`)}
            themeScope="arena-kartu"
            themeColorClass="bg-[#065F46]"
            borderColorClass="border-[#B45309]"
            shadowClass="shadow-[0_4px_0px_#78350F]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#7C2D12] border-[#B45309] shadow-[2px_2px_0px_#78350F] hover:bg-[#FDE68A]"
          />

          {/* KONTEN UTAMA LATIHAN KARTU */}
          <section className="px-4 pt-4 max-w-md mx-auto flex flex-col gap-4">
            {/* KARTU MATERI ARAB BESAR (NEO-BRUTALISM) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              className={`relative overflow-hidden rounded-3xl border-[4px] p-6 text-center shadow-[6px_6px_0px_#78350F] ${
                isAlreadyCompleted
                  ? 'bg-[#F0FDF4] border-[#10B981]'
                  : 'bg-[#FEF3C7] border-[#B45309]'
              }`}
            >
              {/* Badge Status */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#B45309] px-2.5 py-1 text-xs font-black uppercase text-[#FEF3C7] shadow-xs">
                  Kartu #{String(currentCard.cardIndex).padStart(2, '0')}
                </span>

                {isAlreadyCompleted ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981] px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                    <CheckSvg size={13} /> Selesai
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-2.5 py-0.5 text-[11px] font-black text-[#78350F] shadow-xs">
                    Belum Dikuasai
                  </span>
                )}
              </div>

              {/* Teks Arab Utama (Font Besar & Harakat Jelas) */}
              <div className="my-6 py-4 flex items-center justify-center min-h-[140px]" dir="rtl">
                <span
                  className={`font-arabic font-bold text-5xl sm:text-6xl leading-loose select-none drop-shadow-xs ${
                    isAlreadyCompleted ? 'text-[#065F46]' : 'text-[#7C2D12]'
                  } ${getArabicFontSizeClass(currentCard.text)}`}
                >
                  {currentCard.text}
                </span>
              </div>

              {/* Transliterasi & Nada Rost */}
              <div className="space-y-1 mb-2">
                <h3 className="font-display font-black text-xl text-[#78350F]">
                  {currentCard.transliteration}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#92400E]">
                  <span className="px-2 py-0.5 rounded-md bg-[#FDE68A] border border-[#B45309]/30">
                    Nada: {currentCard.tone ? currentCard.tone.toUpperCase() : 'DATAR'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FDE68A] border border-[#B45309]/30">
                    {currentCard.beatsCount} Ketukan
                  </span>
                </div>
              </div>

              {/* Petunjuk Makhraj / Bacaan */}
              {currentCard.instruction && (
                <div className="mt-4 p-3 rounded-2xl bg-[#FEF08A]/60 border border-[#B45309]/40 text-left">
                  <p className="text-xs text-[#78350F] font-semibold leading-relaxed">
                    💡 <span className="font-bold">Tips Tilawati:</span> {currentCard.instruction}
                  </p>
                </div>
              )}
            </motion.div>

            {/* DUA TOMBOL AKSI UTAMA: DENGAR & KETUK */}
            <div className="flex flex-col gap-3">
              {/* 1. Tombol Dengar Suara Qari */}
              <button
                type="button"
                onClick={handlePlayAudio}
                className="w-full py-4 rounded-2xl border-[3.5px] border-[#042F2E] bg-[#10B981] hover:bg-[#059669] active:translate-y-1 active:shadow-none text-white font-black text-base sm:text-lg shadow-[0_5px_0px_#042F2E] flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none"
              >
                <EqualizerIcon isPlaying={isPlayingAudio} size={22} barClassName="bg-white" />
                <span>
                  {isPlayingAudio ? 'Mendengarkan Qari...' : 'Dengar Bacaan Qari'}
                </span>
                {listenCount > 0 && (
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                    {listenCount}x
                  </span>
                )}
              </button>

              {/* 2. Tombol Mulai Latihan Ketuk */}
              <button
                type="button"
                onClick={handleStartTapping}
                className="w-full py-4 rounded-2xl border-[3.5px] border-[#78350F] bg-gradient-to-r from-[#FDE047] via-[#F59E0B] to-[#D97706] hover:from-[#FEF08A] hover:to-[#F59E0B] active:translate-y-1 active:shadow-none text-[#78350F] font-black text-base sm:text-lg shadow-[0_5px_0px_#78350F] flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none"
              >
                <span className="text-xl">🥁</span>
                <span>Mulai Latihan Ketuk Irama</span>
              </button>
            </div>
          </section>

          {/* AREA KETUKAN HORIZONTAL (TAP ZONE) */}
          <AnimatePresence>
            {isTapZoneActive && (
              <RhythmTapZone
                active={isTapZoneActive}
                bpm={currentCard.bpm}
                beatsCount={currentCard.beatsCount}
                durationMs={3000}
                cardArabicText={currentCard.text}
                transliteration={currentCard.transliteration}
                tone={currentCard.tone}
                onSuccess={handleTapSuccess}
                onFail={handleTapFail}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DIALOG SUKSES MENGUASAI KARTU */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="w-full max-w-sm rounded-3xl bg-[#FEF3C7] border-[4px] border-[#B45309] p-6 text-center shadow-[8px_8px_0px_#78350F]"
            >
              {/* Ikon Piala / Bintang */}
              <div className="w-20 h-20 rounded-2xl bg-[#065F46] border-3 border-[#10B981] flex items-center justify-center text-4xl shadow-md mx-auto mb-3">
                ⭐
              </div>

              <h3 className="text-2xl font-black text-[#78350F] mb-1">
                Hebat! Kartu Dikuasai!
              </h3>
              <p className="text-xs text-[#92400E] font-medium mb-4">
                Kamu telah berhasil melatih irama dan menguasai Kartu #{currentCard.cardIndex}. Kartu ini sekarang terbuka permanen di Papan Progresmu!
              </p>

              {/* Box Kartu Mini */}
              <div className="p-4 rounded-2xl bg-[#F0FDF4] border-2 border-[#10B981] mb-5 flex items-center justify-between">
                <div className="text-right flex-1" dir="rtl">
                  <span className="font-arabic font-bold text-3xl text-[#065F46]">
                    {currentCard.text}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981] text-white text-xs font-black">
                  <CheckSvg size={14} /> Terbuka
                </div>
              </div>

              {/* Tombol Aksi Modal */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}`)}
                  className="w-full py-3 rounded-xl border-2 border-[#042F2E] bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm shadow-[2px_2px_0px_#042F2E] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  Kembali ke Papan Progres 📋
                </button>
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="w-full py-2.5 rounded-xl border-2 border-[#B45309] bg-[#FEF08A] hover:bg-[#FDE047] text-[#78350F] font-black text-xs shadow-[2px_2px_0px_#78350F] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  Lanjut ke Kartu Berikutnya ➔
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NgajiCeriaLayout>
  );
}
