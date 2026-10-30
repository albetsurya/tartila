import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { NgajiCeriaLayout } from '../../../components/NgajiCeriaLayout';
import { ExploreHeader, ExploreStatBadge } from '../../../components/ExploreHeader';
import {
  ARENA_KARTU_DATA,
  getArenaKartuPairs,
  getArabicFontSizeClass,
  ArenaKartuCardItem,
} from '../../../data/arenaKartuData';
import {
  MEMORY_LEVELS_CONFIG,
  getMemoryLevelConfig,
  calculateMemoryStars,
} from '../../../data/tilawatiMemoryData';
import { useTilawatiMemoryStore } from '../../../hooks/useTilawatiMemoryStore';
import { useEconomyStore } from '../../../hooks/useEconomyStore';
import {
  StarSvg,
  RotateCcwSvg,
  ChevronRight,
  ShuffleSvg,
  PauseSvg,
  PlaySvg,
  CheckSvg,
  CardsSvg,
} from '@/components/ui/CustomIcons';
import { triggerBibiReaction } from '@/utils/bibiEvent';
import { soundManager } from '@/features/ngaji-ceria/services/soundManager';
import { getBest, setBest } from '../_shared/storage';
import { GameLevelSelectSheet } from '../_shared/GameLevelSelectSheet';
import { GameHud } from '../_shared/GameHud';
import { GameResultModal } from '../_shared/GameResultModal';
import { AppModal } from '@/components/ui/AppModal';
import { useGameStore } from '@/features/ngaji-ceria/hooks/useGameStore';

// Varian animasi realistis shuffle kartu di atas meja
const cardVariants: Variants = {
  initial: { scale: 1, rotate: 0, y: 0 },
  shuffling: (i: number) => ({
    scale: [1, 1.1, 1],
    rotate: [0, i % 2 === 0 ? 15 : -15, 0], // Berputar ke kanan/kiri secara acak
    y: [0, -20, 0], // Sedikit terangkat seperti dilempar
    transition: { duration: 0.8, ease: 'easeInOut' },
  }),
  settled: { scale: 1, rotate: 0, y: 0 },
};

interface CompletionResult {
  stars: number;
  isNewUnlock: boolean;
  nextLevel: number;
  elapsedTime: number;
}

export default function TilawatiMemoryPage() {
  const navigate = useNavigate();
  const { jilid: jilidParam, level: levelParam } = useParams<{
    jilid?: string;
    level?: string;
  }>();
  const [searchParams] = useSearchParams();

  const currentJilid = useMemo(() => {
    const parsed = Number(jilidParam);
    return parsed >= 1 && parsed <= 6 ? parsed : 1;
  }, [jilidParam]);

  const currentLevel = useMemo(() => {
    const parsed = Number(levelParam || searchParams.get('level'));
    return parsed >= 1 && parsed <= 4 ? parsed : 1;
  }, [levelParam, searchParams]);

  const consumeTicket = useEconomyStore((s) => s.consumeTicket);

  const levelConfig = useMemo(() => {
    return getMemoryLevelConfig(currentLevel);
  }, [currentLevel]);

  const levelInfo = useMemo(() => {
    return (
      ARENA_KARTU_DATA.find((l) => l.jilid === currentJilid) ||
      ARENA_KARTU_DATA[0]
    );
  }, [currentJilid]);

  // State Permainan
  const [cards, setCards] = useState<ArenaKartuCardItem[]>(() =>
    getArenaKartuPairs(currentJilid, levelConfig.pairsCount)
  );
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Universal Game Framework State
  const unlockedLevel = useGameStore((s) => s.getUnlockedLevel("tilawati-memory"));
  const unlockNextLevel = useGameStore((s) => s.unlockNextLevel);
  const [isStartSheetOpen, setIsStartSheetOpen] = useState<boolean>(!levelParam);

  // Time Attack State
  const [timeLeft, setTimeLeft] = useState<number>(levelConfig.timeLimitSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [completionResult, setCompletionResult] = useState<CompletionResult | null>(null);

  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isShufflingRef = useRef<boolean>(false);

  // Logika Realistic Card Shuffle (Stable dependency dengan ref agar tidak re-trigger loop)
  const handleShuffle = useCallback(() => {
    if (isShufflingRef.current) return;

    isShufflingRef.current = true;
    setIsShuffling(true);
    setFlippedIndices([]); // Tutup kartu yang sedang terbuka saat dikocok
    triggerBibiReaction('click');
    soundManager.playSfx('pop');

    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
    }

    shuffleTimeoutRef.current = setTimeout(() => {
      setCards((prev) => {
        const copy = [...prev];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      });

      isShufflingRef.current = false;
      setIsShuffling(false);
      soundManager.playSfx('tap');
    }, 1100);
  }, []);

  // Reset Permainan & Acak Ulang Level
  const handleResetGame = useCallback(() => {
    setCards(getArenaKartuPairs(currentJilid, levelConfig.pairsCount));
    setMatchedPairIds([]);
    setFlippedIndices([]);
    setIsChecking(false);
    setMoves(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(levelConfig.timeLimitSeconds);
    setIsPaused(false);
    setIsTimeOut(false);
    setIsComplete(false);
    setCompletionResult(null);
    handleShuffle();
  }, [currentJilid, levelConfig.pairsCount, levelConfig.timeLimitSeconds, handleShuffle]);

  // Inisialisasi ulang jika Jilid atau Level berganti
  useEffect(() => {
    setCards(getArenaKartuPairs(currentJilid, levelConfig.pairsCount));
    setMatchedPairIds([]);
    setFlippedIndices([]);
    setIsChecking(false);
    setMoves(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(levelConfig.timeLimitSeconds);
    setIsPaused(false);
    setIsTimeOut(false);
    setIsComplete(false);
    setCompletionResult(null);
    handleShuffle();
  }, [currentJilid, currentLevel, levelConfig.pairsCount, levelConfig.timeLimitSeconds, handleShuffle]);

  // Countdown Timer untuk Time Attack
  useEffect(() => {
    if (isComplete || isTimeOut || isPaused || isShuffling) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, isTimeOut, isPaused, isShuffling]);

  // Deteksi Waktu Habis (Time Out)
  useEffect(() => {
    if (timeLeft === 0 && !isComplete && !isTimeOut) {
      setIsTimeOut(true);
      soundManager.playSfx('wrong');
      triggerBibiReaction('error');
    }
  }, [timeLeft, isComplete, isTimeOut]);

  // Cleanup timeout saat unmount
  useEffect(() => {
    return () => {
      isShufflingRef.current = false;
      if (shuffleTimeoutRef.current) {
        clearTimeout(shuffleTimeoutRef.current);
      }
    };
  }, []);

  // Format hitung mundur ke MM:SS
  const formattedTimeLeft = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timeLeft]);

  // Handler Klik Kartu
  const handleCardClick = (idx: number) => {
    // Nonaktifkan klik saat mengevaluasi, shuffling, dijeda, waktu habis, atau sudah selesai
    if (isChecking || isShuffling || isPaused || isTimeOut || isComplete) return;
    const clickedCard = cards[idx];
    if (!clickedCard) return;

    // Abaikan jika kartu sudah matched atau sedang terbuka
    if (matchedPairIds.includes(clickedCard.pairId)) return;
    if (flippedIndices.includes(idx)) return;

    if (flippedIndices.length === 0) {
      // Buka kartu pertama
      triggerBibiReaction('click');
      soundManager.playSfx('pop');
      setFlippedIndices([idx]);
    } else if (flippedIndices.length === 1) {
      // Buka kartu kedua & evaluasi
      const firstIdx = flippedIndices[0];
      const firstCard = cards[firstIdx];
      setFlippedIndices([firstIdx, idx]);
      setMoves((m) => m + 1);

      if (firstCard.pairId === clickedCard.pairId) {
        // MATCH SAMA!
        triggerBibiReaction('success');
        soundManager.playSfx('correct');
        const currentStreak = streak + 1;
        setStreak(currentStreak);
        const gainScore = 100 + currentStreak * 25;
        const newScore = score + gainScore;
        setScore(newScore);

        setMatchedPairIds((prev) => {
          const next = [...prev, firstCard.pairId];
          if (next.length === levelConfig.pairsCount) {
            // Semua pasangan level ini cocok!
            setTimeout(() => {
              setIsComplete(true);
              soundManager.playSfx('victory');
              triggerBibiReaction('success');

              const stars = calculateMemoryStars(
                timeLeft,
                levelConfig.timeLimitSeconds
              );
              const elapsedTime = levelConfig.timeLimitSeconds - timeLeft;

              const unlockData = useTilawatiMemoryStore
                .getState()
                .recordLevelComplete(
                  currentJilid,
                  currentLevel,
                  stars,
                  elapsedTime,
                  newScore
                );
              unlockNextLevel("tilawati-memory", currentLevel);

              setCompletionResult({
                stars,
                isNewUnlock: unlockData.isNewUnlock,
                nextLevel: unlockData.nextLevel,
                elapsedTime,
              });

              const prevBest = getBest(
                `tilawati-memory-${currentJilid}-${currentLevel}`
              );
              if (newScore > prevBest) {
                setBest(
                  `tilawati-memory-${currentJilid}-${currentLevel}`,
                  newScore
                );
              }
            }, 500);
          }
          return next;
        });

        setFlippedIndices([]);
      } else {
        // BEDA: Jeda 1000ms (1 detik) lalu tutup kembali
        soundManager.playSfx('wrong');
        setStreak(0);
        setIsChecking(true);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <NgajiCeriaLayout
      title="Tilawati Memory"
      showBack={true}
      themeScope="arena-kartu"
      onBack={() => navigate('/member/ngaji-ceria/games/memory/select')}
    >
      <div className="relative min-h-[100dvh] w-full bg-[#065F46] overflow-x-hidden pb-44 sm:pb-48 select-none">
        {/* Latar Belakang Meja Felt Kasino Santri */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 30%, #10B98133 0, transparent 65%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            boxShadow: 'inset 0 0 0 10px #B45309, inset 0 0 0 14px #78350F',
          }}
        />

        <div className="relative z-20">
          {/* UNIVERSAL GAME HUD: TIMER MUNDUR, PERCOBAAN & SKOR */}
          <section className="px-4 pt-2 max-w-lg mx-auto">
            <GameHud
              level={currentLevel}
              timeLeft={timeLeft}
              score={score}
              targetScore={levelConfig.pairsCount * 100}
              onPause={() => setIsPaused((p) => !p)}
            />
          </section>

          {/* GRID KARTU DINAMIS SESUAI LEVEL DENGAN ANIMASI SHUFFLE & FLIP 3D */}
          <section className="px-4 pt-4 max-w-lg mx-auto relative">
            {/* Overlay Teks Saat Mengocok Kartu */}
            <AnimatePresence>
              {isShuffling && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-[#042F2E]/95 border-[3px] border-[#FDE047] text-[#FEF3C7] px-4 py-2.5 rounded-2xl shadow-[4px_4px_0px_#78350F] flex items-center gap-2 text-xs font-black">
                    <ShuffleSvg size={16} className="animate-spin" />
                    <span>Mengacak kartu...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`grid gap-2 content-evenly pb-32 ${levelConfig.gridColsClass}`}>
              {cards.map((card, index) => {
                const isMatched = matchedPairIds.includes(card.pairId);
                const isFlipped = flippedIndices.includes(index);
                const isFaceUp = isMatched || isFlipped;

                return (
                  <motion.div
                    key={card.id}
                    custom={index}
                    variants={cardVariants}
                    initial="initial"
                    animate={isShuffling ? 'shuffling' : 'settled'}
                    transition={{
                      default: { type: 'spring', stiffness: 300, damping: 25 },
                    }}
                    className="aspect-[3/4] w-full"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      className={`relative w-full h-full select-none ${
                        isShuffling || isPaused || isTimeOut || isComplete
                          ? 'cursor-not-allowed pointer-events-none'
                          : 'cursor-pointer'
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{
                        rotateY: isFaceUp ? 180 : 0,
                        scale: isMatched ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        rotateY: { type: 'spring', stiffness: 280, damping: 22 },
                        scale: { duration: 0.25 },
                      }}
                      whileHover={
                        !isFaceUp && !isMatched && !isShuffling && !isPaused && !isTimeOut
                          ? { y: -3, scale: 1.02 }
                          : undefined
                      }
                      whileTap={
                        !isFaceUp && !isMatched && !isShuffling && !isPaused && !isTimeOut
                          ? { scale: 0.94 }
                          : undefined
                      }
                      onClick={() => !isShuffling && handleCardClick(index)}
                    >
                      {/* SISI BELAKANG: KARTU TERTUTUP (TEAL & BINTANG TARTILA) */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-2xl border-[3.5px] border-[#134E4A] bg-[#0D9488] shadow-[4px_4px_0px_#134E4A] flex flex-col items-center justify-between p-2 overflow-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                        }}
                      >
                        {/* Garis ornamen putus-putus emas */}
                        <div className="absolute inset-1.5 border-2 border-dashed border-[#FEF08A]/40 rounded-xl pointer-events-none" />

                        {/* Sudut atas */}
                        <div className="w-full flex justify-between items-center z-10 px-0.5">
                          <span className="text-[#FDE047] text-[10px]">✦</span>
                          <span className="text-[9px] font-black text-[#FEF08A]/85 tracking-widest uppercase">
                            J{currentJilid} • L{currentLevel}
                          </span>
                          <span className="text-[#FDE047] text-[10px]">✦</span>
                        </div>

                        {/* Motif Bintang Tengah Berotasi */}
                        <div className="z-10 flex items-center justify-center my-auto">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#042F2E]/40 border-2 border-[#FDE047]/70 flex items-center justify-center rotate-45 shadow-xs">
                            <div className="-rotate-45 flex items-center justify-center text-[#FDE047]">
                              <StarSvg size={18} fill="#FDE047" stroke="#042F2E" />
                            </div>
                          </div>
                        </div>

                        {/* Sudut bawah */}
                        <div className="w-full flex justify-between items-center z-10 px-0.5">
                          <span className="text-[8px] font-bold text-[#FEF08A]/60">
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[#FDE047] text-[10px]">✦</span>
                        </div>
                      </div>

                      {/* SISI DEPAN: KARTU TERBUKA (TEKS ARAB DENGAN FONT DINAMIS) */}
                      <div
                        className={`absolute inset-0 w-full h-full rounded-2xl border-[3.5px] p-2 flex flex-col items-center justify-center overflow-hidden transition-colors ${
                          isMatched
                            ? 'bg-[#F0FDF4] border-[#10B981] shadow-[-4px_4px_0px_#065F46]'
                            : 'bg-white border-[#134E4A] shadow-[-4px_4px_0px_#134E4A]'
                        }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        {/* Status centang matched */}
                        {isMatched && (
                          <div className="absolute top-1.5 right-1.5 z-10">
                            <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-2xs">
                              <CheckSvg size={10} />
                            </div>
                          </div>
                        )}

                        <div className="absolute top-1.5 left-2 z-10">
                          <span
                            className={`text-[8px] font-black ${
                              isMatched ? 'text-[#10B981]' : 'text-[#134E4A]/40'
                            }`}
                          >
                            #{String(index + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Teks Arab Dinamis dengan font size adaptif */}
                        <div
                          className="flex items-center justify-center h-full w-full p-1 text-center select-none"
                          dir="rtl"
                        >
                          <span
                            className={`font-arabic font-bold leading-relaxed drop-shadow-xs max-w-full break-words text-center ${
                              isMatched ? 'text-[#065F46]' : 'text-[#134E4A]'
                            } ${getArabicFontSizeClass(card.text)}`}
                          >
                            {card.text}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* BOTTOM BAR: JEDA, ACAK ULANG & PILIH LEVEL */}
          <div className="fixed bottom-20 sm:bottom-24 left-0 right-0 z-40 px-4 pointer-events-none">
            <div className="mx-auto max-w-md pointer-events-auto">
              <div className="flex items-center gap-2 rounded-2xl bg-[#1E1B4B] border-[3px] border-[#FDE68A] p-2.5 shadow-[0_5px_0px_#0F172A]">
                <button
                  type="button"
                  onClick={() => setIsPaused(true)}
                  disabled={isShuffling || isTimeOut || isComplete}
                  className="flex items-center justify-center gap-1 rounded-xl border-2 border-[#1E293B] bg-[#334155] hover:bg-[#475569] active:translate-y-[1px] px-3 py-2.5 text-xs font-black text-[#FEF08A] shadow-[2px_2px_0px_#0F172A] transition-all cursor-pointer disabled:opacity-50"
                >
                  <PauseSvg size={15} />
                  <span>Jeda</span>
                </button>

                <button
                  type="button"
                  onClick={handleShuffle}
                  disabled={isShuffling || isPaused || isTimeOut || isComplete}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#78350F] bg-[#FEF08A] hover:bg-[#FDE047] active:translate-y-[1px] active:shadow-none px-3 py-2.5 text-xs font-black text-[#78350F] shadow-[2px_2px_0px_#78350F] transition-all cursor-pointer select-none disabled:opacity-50"
                >
                  <ShuffleSvg size={16} className={isShuffling ? 'animate-spin' : ''} />
                  <span>{isShuffling ? 'Mengacak...' : 'Acak Kartu'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/member/ngaji-ceria/games/memory/select')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#042F2E] bg-[#10B981] hover:bg-[#059669] active:translate-y-[1px] active:shadow-none px-3 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_#042F2E] transition-all cursor-pointer select-none"
                >
                  <span>Pilih Level</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL JEDA (PAUSE MODAL) */}
      <AppModal
        isOpen={isPaused}
        onClose={() => setIsPaused(false)}
        title="Permainan Dijeda"
        variant="warm"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#065F46] border-3 border-[#134E4A] flex items-center justify-center text-white shadow-md mx-auto mb-3">
          <PauseSvg size={28} />
        </div>

        <p className="text-xs text-[#92400E] font-medium mb-4 text-center">
          Napas dulu sejenak! Waktu dihentikan sementara.
        </p>

        <div className="bg-[#FDE68A] border-2 border-[#B45309] rounded-2xl p-3 mb-5 text-left text-xs text-[#78350F] space-y-1 font-bold">
          <div className="flex justify-between">
            <span>Level:</span>
            <span>{levelConfig.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Sisa Waktu:</span>
            <span>{formattedTimeLeft}</span>
          </div>
          <div className="flex justify-between">
            <span>Pasangan Cocok:</span>
            <span>
              {matchedPairIds.length} / {levelConfig.pairsCount}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(false)}
            className="w-full py-3 rounded-xl border-2 border-[#042F2E] bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm shadow-[2px_2px_0px_#042F2E] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Lanjutkan Bermain</span>
            <PlaySvg size={14} />
          </button>
          <button
            type="button"
            onClick={handleResetGame}
            className="w-full py-2.5 rounded-xl border-2 border-[#B45309] bg-[#FEF08A] hover:bg-[#FDE047] text-[#78350F] font-black text-xs shadow-[2px_2px_0px_#78350F] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcwSvg size={14} />
            <span>Ulangi Level Ini</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/member/ngaji-ceria/games/memory/select')}
            className="w-full py-2 text-xs font-bold text-[#78350F]/80 hover:text-[#78350F] underline cursor-pointer"
          >
            Pilih Level Lain
          </button>
        </div>
      </AppModal>

      {/* UNIVERSAL GAME START SHEET */}
      <GameLevelSelectSheet
        isOpen={isStartSheetOpen}
        onClose={() => setIsStartSheetOpen(false)}
        gameTitle="Tilawati Memory"
        gameIcon={<CardsSvg size={22} />}
        levels={MEMORY_LEVELS_CONFIG.map((cfg) => ({
          id: cfg.level,
          title: cfg.title,
          description: cfg.desc,
        }))}
        unlockedCount={unlockedLevel}
        onSelectLevel={async (idx) => {
          const lvl = MEMORY_LEVELS_CONFIG[idx]?.level ?? 1;
          setIsStartSheetOpen(false);
          if (lvl !== currentLevel) {
            const ok = await consumeTicket();
            if (!ok) return;
            navigate(`/member/ngaji-ceria/games/memory/${currentJilid}/${lvl}`);
          } else {
            handleResetGame();
          }
        }}
      />

      {/* UNIVERSAL GAME RESULT MODAL */}
      <GameResultModal
        isOpen={isComplete || isTimeOut}
        isWin={isComplete}
        score={score}
        stars={completionResult?.stars ?? (isComplete ? 3 : 0)}
        level={currentLevel}
        hasNextLevel={currentLevel < 4}
        onRetry={handleResetGame}
        onNextLevel={() => {
          const next = Math.min(4, currentLevel + 1);
          navigate(`/member/ngaji-ceria/games/tilawati-memory/${currentJilid}/${next}`);
        }}
        onBackToHub={() => navigate('/member/ngaji-ceria/games')}
      />
    </NgajiCeriaLayout>
  );
}
