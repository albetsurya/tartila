import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NgajiCeriaLayout } from '../../components/NgajiCeriaLayout';
import { ExploreHeader, ExploreStatBadge } from '../../components/ExploreHeader';
import {
  RHYTHM_MEMORY_LEVELS,
  getRhythmMemoryPairs,
  getArabicFontSizeClass,
  RhythmMemoryCardItem,
} from '../../data/rhythmMemoryData';
import { RhythmTapZone } from '../../components/rhythm-memory/RhythmTapZone';
import { useRhythmMemoryAudio } from '../../hooks/useRhythmMemoryAudio';
import {
  StarSvg,
  ChevronRight,
  RotateCcwSvg,
  TargetSvg,
  FireSvg,
  SparklesSvg,
  MusicSvg,
  TrophySvg,
  CheckSvg,
} from '@/components/ui/CustomIcons';
import { soundManager } from '../../services/soundManager';
import { triggerBibiReaction } from '@/utils/bibiEvent';
import type { HitResult } from '../../components/lab-irama/timingJudge';

export default function RhythmMemoryPage() {
  const navigate = useNavigate();
  const { jilid: jilidParam } = useParams<{ jilid?: string }>();

  const currentJilid = useMemo(() => {
    const parsed = Number(jilidParam);
    return parsed >= 1 && parsed <= 6 ? parsed : 1;
  }, [jilidParam]);

  const levelInfo = useMemo(() => {
    return (
      RHYTHM_MEMORY_LEVELS.find((l) => l.jilid === currentJilid) ||
      RHYTHM_MEMORY_LEVELS[0]
    );
  }, [currentJilid]);

  // Audio Hook
  const { playCardSound, stopAudio, preloadAudio } = useRhythmMemoryAudio();

  // State Permainan
  const [cards, setCards] = useState<RhythmMemoryCardItem[]>(() =>
    getRhythmMemoryPairs(currentJilid, 6)
  );
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [firstOpenIndex, setFirstOpenIndex] = useState<number | null>(null);
  const [activeTappingIndex, setActiveTappingIndex] = useState<number | null>(null);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [isCheckingMismatch, setIsCheckingMismatch] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [gameHint, setGameHint] = useState<string>('Pilih kartu untuk mendengar iramanya!');

  // Reset Permainan
  const handleResetGame = useCallback(() => {
    stopAudio();
    triggerBibiReaction('click');
    soundManager.playSfx('pop');
    setCards(getRhythmMemoryPairs(currentJilid, 6));
    setMatchedPairIds([]);
    setFlippedIndices([]);
    setFirstOpenIndex(null);
    setActiveTappingIndex(null);
    setShakeIndex(null);
    setIsCheckingMismatch(false);
    setScore(0);
    setStreak(0);
    setMoves(0);
    setIsComplete(false);
    setGameHint('Pilih kartu untuk mendengar iramanya!');
  }, [currentJilid, stopAudio]);

  // Reset saat jilid berubah
  useEffect(() => {
    handleResetGame();
  }, [currentJilid, handleResetGame]);

  // Preload audio context on mount
  useEffect(() => {
    void preloadAudio();
  }, [preloadAudio]);

  // Handler Klik Kartu
  const handleCardClick = (idx: number) => {
    if (isCheckingMismatch) return;
    if (activeTappingIndex !== null) return; // Sedang ada kartu yang dalam fase ketuk

    const clickedCard = cards[idx];
    if (!clickedCard) return;

    // Abaikan jika kartu sudah matched atau sudah terbuka
    if (matchedPairIds.includes(clickedCard.pairId)) return;
    if (flippedIndices.includes(idx)) return;

    triggerBibiReaction('click');
    soundManager.playSfx('pop');

    // Buka kartu & set sebagai kartu aktif yang harus diketuk
    setFlippedIndices((prev) => [...prev, idx]);
    setActiveTappingIndex(idx);
    setGameHint('Dengarkan lagunya, lalu ketuk tombol sesuai irama!');

    // Putar audio & nada qari
    void playCardSound({
      audioUrl: clickedCard.item.audioUrl,
      tone: clickedCard.item.tone,
      bpm: clickedCard.item.bpm,
      beatsCount: clickedCard.item.beatsCount,
    });
  };

  // Handler Ketukan Berhasil
  const handleTapSuccess = (result: HitResult) => {
    if (activeTappingIndex === null) return;

    const currentCard = cards[activeTappingIndex];
    if (!currentCard) return;

    const bonusScore = result.judgment === 'perfect' ? 100 : 60;
    setScore((s) => s + bonusScore);

    // Kasus 1: Ini adalah kartu pertama dari pasangan
    if (firstOpenIndex === null) {
      setFirstOpenIndex(activeTappingIndex);
      setActiveTappingIndex(null);
      setGameHint('Bagus! Sekarang buka kartu kedua untuk mencari pasangannya!');
      return;
    }

    // Kasus 2: Ini adalah kartu kedua! Evaluasi apakah cocok dengan kartu pertama
    const firstIdx = firstOpenIndex;
    const secondIdx = activeTappingIndex;
    const firstCard = cards[firstIdx];
    setMoves((m) => m + 1);

    if (firstCard.pairId === currentCard.pairId) {
      // MATCH!
      triggerBibiReaction('success');
      soundManager.playSfx('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((s) => s + 150 + newStreak * 25);
      setMatchedPairIds((prev) => {
        const next = [...prev, firstCard.pairId];
        if (next.length === 6) {
          setTimeout(() => {
            setIsComplete(true);
            soundManager.playSfx('victory');
          }, 600);
        }
        return next;
      });
      setFirstOpenIndex(null);
      setActiveTappingIndex(null);
      setGameHint('Luar biasa, kartu cocok! Lanjutkan pasangan berikutnya!');
    } else {
      // BEDA PASANGAN
      soundManager.playSfx('wrong');
      setIsCheckingMismatch(true);
      setStreak(0);
      setGameHint('Belum cocok! Ingat-ingat letak kartunya ya!');

      setTimeout(() => {
        // Tutup kembali kedua kartu
        setFlippedIndices((prev) =>
          prev.filter((i) => i !== firstIdx && i !== secondIdx)
        );
        setFirstOpenIndex(null);
        setActiveTappingIndex(null);
        setIsCheckingMismatch(false);
      }, 1000);
    }
  };

  // Handler Ketukan Meleset / Gagal
  const handleTapFail = (_result: HitResult) => {
    if (activeTappingIndex === null) return;

    const failedIdx = activeTappingIndex;
    setShakeIndex(failedIdx);
    setGameHint('Ketukan meleset! Ayo dengarkan iramanya dan coba lagi!');

    setTimeout(() => {
      // Kartu kembali tertutup
      setFlippedIndices((prev) => prev.filter((i) => i !== failedIdx));
      setActiveTappingIndex(null);
      setShakeIndex(null);
      stopAudio();
    }, 700);
  };

  const activeCardItem =
    activeTappingIndex !== null ? cards[activeTappingIndex]?.item : null;

  return (
    <NgajiCeriaLayout
      title={`Rhythm Memory - Jilid ${currentJilid}`}
      hideHeader={true}
      themeScope="lab-irama"
      onBack={() => navigate('/member/ngaji-ceria/training')}
    >
      <div className="relative min-h-[100dvh] w-full bg-[#042f2e] overflow-x-hidden pb-44 sm:pb-48 select-none">
        {/* Latar Belakang Panggung Irama */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 25%, #10B981 0, transparent 65%)',
          }}
        />

        <div className="relative z-20">
          {/* Header Eksplorasi Terstandarisasi */}
          <ExploreHeader
            title={`Rhythm Memory: Jilid ${currentJilid}`}
            subtitle={levelInfo.subtitle}
            onBack={() => navigate('/member/ngaji-ceria/training')}
            themeScope="lab-irama"
            themeColorClass="bg-[#064e3b]"
            borderColorClass="border-[#34d399]"
            shadowClass="shadow-[0_4px_0px_#022c22]"
            textColorClass="text-[#fef3c7]"
            backClass="bg-[#fef3c7] text-[#064e3b] border-[#34d399] shadow-[2px_2px_0px_#022c22] hover:bg-[#fde68a]"
            extraBadge={
              <ExploreStatBadge
                icon={<StarSvg size={18} fill="#fde047" className="shrink-0" />}
                value={`${matchedPairIds.length}/6`}
                title={`Pasangan: ${matchedPairIds.length} dari 6`}
                className="bg-[#fef3c7] text-[#064e3b] border-[#34d399] shadow-[2px_2px_0px_#022c22]"
              />
            }
            rightAction={
              <button
                type="button"
                onClick={() => navigate('/member/ngaji-ceria/rhythm-memory')}
                className="inline-flex items-center gap-1 rounded-xl border-2 border-[#34d399] bg-[#fef3c7] px-2.5 py-1 text-xs font-black text-[#064e3b] shadow-[2px_2px_0px_#022c22] active:translate-y-[1px] hover:bg-[#fde68a] transition-all cursor-pointer shrink-0"
              >
                <span>Ganti Jilid</span>
                <ChevronRight size={12} />
              </button>
            }
          />

          {/* HUD STATUS & SKOR */}
          <section className="px-4 pt-3 max-w-md mx-auto">
            <div className="flex items-center justify-between rounded-2xl bg-[#022c22]/90 border-2 border-[#10b981]/50 px-3 py-2 text-[#fef3c7] shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-black">
                <TargetSvg size={14} className="text-amber-300" stroke="#fde047" />
                <span>Langkah: {moves}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black">
                <FireSvg size={14} className="text-emerald-400" />
                <span>Streak: {streak}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black">
                <SparklesSvg size={14} className="text-yellow-300" />
                <span>Skor: {score}</span>
              </div>
              <button
                type="button"
                onClick={handleResetGame}
                className="inline-flex items-center gap-1 rounded-lg bg-[#fef3c7] text-[#064e3b] px-2 py-0.5 text-[10px] font-black border border-[#34d399] active:translate-y-[1px] hover:bg-[#fde68a]"
              >
                <RotateCcwSvg size={11} /> Acak
              </button>
            </div>

            {/* PITA PETUNJUK DINAMIS */}
            <div className="mt-2 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-[#064e3b] border border-[#10b981]/40 text-[11px] font-bold text-[#a7f3d0] shadow-xs">
                {gameHint}
              </span>
            </div>
          </section>

          {/* GRID 12 KARTU (3 KOLOM X 4 BARIS) NEO-BRUTALISM DENGAN ANIMASI FLIP */}
          <section className="px-4 pt-3 max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {cards.map((card, index) => {
                const isMatched = matchedPairIds.includes(card.pairId);
                const isFlipped = flippedIndices.includes(index);
                const isFaceUp = isMatched || isFlipped;
                const isTapping = activeTappingIndex === index;
                const isShaking = shakeIndex === index;

                return (
                  <div
                    key={card.id}
                    className="aspect-[3/4] w-full"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      className="relative w-full h-full cursor-pointer select-none"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{
                        rotateY: isFaceUp ? 180 : 0,
                        scale: isMatched ? [1, 1.05, 1] : isTapping ? [1, 1.04, 1] : 1,
                        x: isShaking ? [-6, 6, -5, 5, -2, 2, 0] : 0,
                      }}
                      transition={{
                        rotateY: { type: 'spring', stiffness: 280, damping: 22 },
                        scale: { duration: 0.25 },
                        x: { duration: 0.4 },
                      }}
                      whileHover={
                        !isFaceUp && !isMatched ? { y: -3, scale: 1.02 } : undefined
                      }
                      whileTap={
                        !isFaceUp && !isMatched ? { scale: 0.94 } : undefined
                      }
                      onClick={() => handleCardClick(index)}
                    >
                      {/* SISI BELAKANG: KARTU TERTUTUP (TEAL & MOTIF BINTANG EMAS) */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-2xl border-[3.5px] border-[#134E4A] bg-[#0D9488] shadow-[4px_4px_0px_#134E4A] flex flex-col items-center justify-between p-2 overflow-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        <div className="absolute inset-1.5 border-2 border-dashed border-[#FEF08A]/40 rounded-xl pointer-events-none" />

                        <div className="w-full flex justify-between items-center z-10 px-0.5">
                          <span className="text-[#FDE047] text-[10px]">✦</span>
                          <span className="text-[9px] font-black text-[#FEF08A]/85 tracking-widest uppercase">
                            JILID {currentJilid}
                          </span>
                          <span className="text-[#FDE047] text-[10px]">✦</span>
                        </div>

                        {/* Logo Nada & Bintang */}
                        <div className="z-10 flex items-center justify-center my-auto">
                          <div className="w-10 h-10 rounded-2xl bg-[#042F2E]/40 border-2 border-[#FDE047]/70 flex items-center justify-center rotate-45 shadow-xs">
                            <div className="-rotate-45 flex items-center justify-center text-[#FDE047]">
                              <MusicSvg size={18} stroke="#FDE047" />
                            </div>
                          </div>
                        </div>

                        <div className="w-full flex justify-between items-center z-10 px-0.5">
                          <span className="text-[8px] font-bold text-[#FEF08A]/60">
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[#FDE047] text-[10px]">✦</span>
                        </div>
                      </div>

                      {/* SISI DEPAN: KARTU TERBUKA (TEKS ARAB & STATUS KETUKAN) */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-2xl border-[3.5px] p-2 flex flex-col items-center justify-between overflow-hidden transition-colors ${
                          isMatched
                            ? 'bg-[#F0FDF4] border-[#10B981] shadow-[-4px_4px_0px_#065F46]'
                            : isTapping
                            ? 'bg-[#FFFBEB] border-[#F59E0B] shadow-[-4px_4px_0px_#78350F]'
                            : 'bg-white border-[#134E4A] shadow-[-4px_4px_0px_#134E4A]'
                        }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        {/* Header Mini Kartu */}
                        <div className="w-full flex items-center justify-between z-10">
                          <span
                            className={`text-[8px] font-black ${
                              isMatched
                                ? 'text-[#10B981]'
                                : isTapping
                                ? 'text-[#D97706]'
                                : 'text-[#134E4A]/50'
                            }`}
                          >
                            #{String(index + 1).padStart(2, '0')}
                          </span>

                          {isMatched ? (
                            <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs">
                              <CheckSvg size={10} />
                            </span>
                          ) : isTapping ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[8px] font-black animate-pulse">
                              KETUK
                            </span>
                          ) : null}
                        </div>

                        {/* Teks Arab Dinamis */}
                        <div
                          className="flex items-center justify-center flex-1 w-full p-1 text-center select-none"
                          dir="rtl"
                        >
                          <span
                            className={`font-arabic font-bold leading-loose drop-shadow-xs max-w-full break-words text-center ${
                              isMatched
                                ? 'text-[#065F46]'
                                : isTapping
                                ? 'text-[#92400E]'
                                : 'text-[#134E4A]'
                            } ${getArabicFontSizeClass(card.item.arabic)}`}
                          >
                            {card.item.arabic}
                          </span>
                        </div>

                        {/* Transliterasi & Ketukan */}
                        <div className="w-full text-center">
                          <span className="text-[9px] font-bold text-[#64748B] line-clamp-1">
                            {card.item.transliteration}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TAP ZONE METRONOM HORIZONTAL (MUNCUL SAAT KARTU AKTIF MEMBUTUHKAN KETUKAN) */}
          <AnimatePresence>
            {activeTappingIndex !== null && activeCardItem && (
              <RhythmTapZone
                active={activeTappingIndex !== null}
                bpm={activeCardItem.bpm}
                beatsCount={activeCardItem.beatsCount}
                durationMs={activeCardItem.durationMs}
                cardArabicText={activeCardItem.arabic}
                transliteration={activeCardItem.transliteration}
                tone={activeCardItem.tone}
                onSuccess={handleTapSuccess}
                onFail={handleTapFail}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DIALOG KEMENANGAN (VICTORY MODAL) */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="w-full max-w-sm rounded-3xl bg-[#FEF3C7] border-[4px] border-[#B45309] p-6 text-center shadow-[8px_8px_0px_#78350F]"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#065F46] border-3 border-[#134E4A] flex items-center justify-center text-white shadow-md mx-auto mb-3">
                <TrophySvg size={44} />
              </div>

              <h3 className="text-2xl font-black text-[#78350F] mb-1">
                Mumtaz! Luar Biasa!
              </h3>
              <p className="text-xs text-[#92400E] font-medium mb-4">
                Kamu berhasil menyelesaikan seluruh irama & kartu Tilawati Jilid {currentJilid}!
              </p>

              <div className="flex justify-around bg-[#FDE68A] border-2 border-[#B45309] rounded-2xl p-3 mb-5">
                <div>
                  <span className="block text-[10px] font-bold text-[#78350F] uppercase">
                    Total Skor
                  </span>
                  <span className="text-xl font-black text-[#78350F]">
                    {score}
                  </span>
                </div>
                <div className="border-r border-[#B45309]/30" />
                <div>
                  <span className="block text-[10px] font-bold text-[#78350F] uppercase">
                    Langkah
                  </span>
                  <span className="text-xl font-black text-[#78350F]">
                    {moves}
                  </span>
                </div>
                <div className="border-r border-[#B45309]/30" />
                <div>
                  <span className="block text-[10px] font-bold text-[#78350F] uppercase">
                    Streak
                  </span>
                  <span className="text-xl font-black text-[#78350F] flex items-center justify-center gap-0.5">
                    <span>{streak}</span>
                    <FireSvg size={16} className="text-[#EA580C]" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResetGame}
                  className="w-full py-3 rounded-xl border-2 border-[#042F2E] bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm shadow-[2px_2px_0px_#042F2E] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Main Lagi</span>
                  <RotateCcwSvg size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/member/ngaji-ceria/training')}
                  className="w-full py-2.5 rounded-xl border-2 border-[#B45309] bg-[#FEF08A] hover:bg-[#FDE047] text-[#78350F] font-black text-xs shadow-[2px_2px_0px_#78350F] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  Kembali ke Pusat Latihan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NgajiCeriaLayout>
  );
}
