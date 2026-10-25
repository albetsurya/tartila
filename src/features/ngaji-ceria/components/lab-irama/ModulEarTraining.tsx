import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LAB_IRAMA_EAR_TRAINING_POOL,
  generateEarTrainingSession,
  type EarTrainingItem,
  type TilawatiTone,
} from '../../data/labIramaData';
import {
  calculateIramaRank,
  RANK_METADATA,
} from './timingJudge';
import { useLabIramaStore } from '../../hooks/useLabIramaStore';
import { soundManager } from '../../services/soundManager';
import { SparkleBurst } from '../../pages/games/_shared/SparkleBurst';
import { getAudioUrl } from '../../utils/audioUrl';
import {
  PlaySvg,
  SparklesSvg,
  CheckSvg,
  RotateCcwSvg,
} from '../../../../components/ui/CustomIcons';
import { AnimatedProgressBar } from '../../../../components/ui/AnimatedProgressBar';

interface ModulEarTrainingProps {
  onComplete?: () => void;
}

export const ModulEarTraining: React.FC<ModulEarTrainingProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<EarTrainingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Mekanik Susun Pola: User mengisi kotak-kotak sesuai jumlah nada siklus
  const [userPattern, setUserPattern] = useState<(TilawatiTone | null)[]>([]);
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [burstKey, setBurstKey] = useState<string>('');
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const recordEarTraining = useLabIramaStore((s) => s.recordEarTraining);

  const stopTracking = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const startTracking = (audio: HTMLAudioElement) => {
    stopTracking();
    const track = () => {
      if (!audio.paused && !audio.ended && audio.duration) {
        setAudioProgress(audio.currentTime / audio.duration);
        rafIdRef.current = requestAnimationFrame(track);
      }
    };
    rafIdRef.current = requestAnimationFrame(track);
  };

  // Inisialisasi 5 soal acak seimbang
  const startNewSession = () => {
    const sessionQuestions = generateEarTrainingSession(5);
    setQuestions(sessionQuestions);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setUserPattern(
      sessionQuestions[0]
        ? new Array(sessionQuestions[0].siklusNada.length).fill(null)
        : []
    );
    setHasWrongAttempt(false);
    setIsAnswerRevealed(false);
    setIsSessionFinished(false);
    setIsShaking(false);
    setAudioProgress(0);
  };

  useEffect(() => {
    startNewSession();
    return () => {
      stopTracking();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const currentQ = questions[currentIndex];

  // Putar audio tiap soal berganti & inisialisasi kotak drop zone
  useEffect(() => {
    if (!currentQ || isSessionFinished) return;

    setUserPattern(new Array(currentQ.siklusNada.length).fill(null));
    setHasWrongAttempt(false);
    setIsAnswerRevealed(false);
    setAudioProgress(0);
    stopTracking();

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const resolvedUrl = getAudioUrl(currentQ.audioUrl) ?? currentQ.audioUrl;
    const audio = new Audio(resolvedUrl);
    audioRef.current = audio;
    audio.volume = 0.95;

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress(audio.currentTime / audio.duration);
      }
    };

    audio.onended = () => {
      setIsPlayingAudio(false);
      stopTracking();
      setAudioProgress(0);
    };

    audio.onerror = () => {
      setIsPlayingAudio(false);
      stopTracking();
      setAudioProgress(0);
    };

    // Delay halus agar transisi soal terasa nyaman
    const timer = setTimeout(() => {
      audio
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          startTracking(audio);
        })
        .catch(() => setIsPlayingAudio(false));
    }, 400);

    return () => {
      clearTimeout(timer);
      stopTracking();
      audio.pause();
    };
  }, [currentIndex, currentQ, isSessionFinished]);

  const playCurrentAudio = () => {
    if (!currentQ) return;
    stopTracking();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const resolvedUrl = getAudioUrl(currentQ.audioUrl) ?? currentQ.audioUrl;
    const audio = new Audio(resolvedUrl);
    audioRef.current = audio;
    audio.volume = 0.95;

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress(audio.currentTime / audio.duration);
      }
    };

    audio.onended = () => {
      setIsPlayingAudio(false);
      stopTracking();
      setAudioProgress(0);
    };

    audio.onerror = () => {
      setIsPlayingAudio(false);
      stopTracking();
      setAudioProgress(0);
    };

    soundManager.playSfx('tap');
    audio
      .play()
      .then(() => {
        setIsPlayingAudio(true);
        startTracking(audio);
      })
      .catch(() => setIsPlayingAudio(false));
  };

  // Tambahkan nada terpilih ke kotak kosong pertama
  const handleAddTone = (tone: TilawatiTone) => {
    if (isAnswerRevealed || !currentQ) return;

    const firstEmptyIndex = userPattern.findIndex((t) => t === null);
    if (firstEmptyIndex === -1) {
      // Semua kotak sudah terisi, tidak bisa menambah lagi kecuali direset / dihapus
      soundManager.playSfx('tap');
      return;
    }

    const nextPattern = [...userPattern];
    nextPattern[firstEmptyIndex] = tone;
    setUserPattern(nextPattern);
    soundManager.playSfx('tap');
  };

  // Hapus nada dari kotak tertentu
  const handleRemoveSlot = (index: number) => {
    if (isAnswerRevealed) return;
    const nextPattern = [...userPattern];
    nextPattern[index] = null;
    setUserPattern(nextPattern);
    soundManager.playSfx('tap');
  };

  // Kosongkan semua kotak
  const handleResetPattern = () => {
    if (isAnswerRevealed || !currentQ) return;
    setUserPattern(new Array(currentQ.siklusNada.length).fill(null));
    soundManager.playSfx('tap');
  };

  // Periksa susunan pola nada
  const handleCheckAnswer = () => {
    if (!currentQ || isAnswerRevealed) return;

    const isAllFilled = !userPattern.includes(null);
    if (!isAllFilled) return;

    const isMatch = userPattern.every(
      (tone, idx) => tone === currentQ.siklusNada[idx]
    );

    if (isMatch) {
      // Benar!
      soundManager.playSfx('correct');
      setBurstKey(`burst-${Date.now()}`);
      setIsAnswerRevealed(true);

      // Hanya beri skor jika tebakan pertama langsung tepat
      if (!hasWrongAttempt) {
        setScore((prev) => prev + 20);
        setCorrectCount((prev) => prev + 1);
      }
    } else {
      // Salah
      soundManager.playSfx('wrong');
      setIsShaking(true);
      setHasWrongAttempt(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playSfx('tap');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Sesi selesai
      const totalScore = score;
      const accuracy = Math.round((correctCount / questions.length) * 100);
      const res = recordEarTraining(totalScore, accuracy);
      setEarnedCoins(res.coinsEarned);
      setIsNewRecord(res.isNewRecord);
      setIsSessionFinished(true);
      soundManager.playSfx('victory');
      onComplete?.();
    }
  };

  if (!currentQ && !isSessionFinished) return null;

  // Layar Hasil Akhir Sesi
  if (isSessionFinished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const rankKey = calculateIramaRank(accuracy);
    const rankInfo = RANK_METADATA[rankKey];

    return (
      <div className="bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#134E4A)] rounded-3xl p-6 shadow-[5px_5px_0px_var(--shadow-color,#134E4A)] text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FEF08A] border-[3px] border-[var(--border-color,#134E4A)] flex items-center justify-center text-3xl shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]">
          🎉
        </div>

        <div>
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0D9488]/10 text-[#0D9488]">
            Hasil Susun Pola Nada
          </span>
          <h2 className="font-display font-black text-2xl text-[var(--text-main,#134E4A)] mt-1">
            {rankInfo.label}
          </h2>
          <p className="font-arabic text-3xl text-[#0D9488] font-black mt-1">
            {rankInfo.arab}
          </p>
          <p className="text-xs font-bold text-[var(--text-main,#134E4A)]/70 max-w-xs mx-auto mt-2 leading-relaxed">
            {rankInfo.desc}
          </p>
        </div>

        {/* Skor & Koin */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <div className="bg-[var(--bg-app,#F0FDF4)] border-2 border-[var(--border-color,#134E4A)] rounded-2xl p-3">
            <span className="text-[10px] font-black uppercase text-gray-500">Skor Benar</span>
            <p className="font-display font-black text-2xl text-[#134E4A]">
              {correctCount} / {questions.length}
            </p>
          </div>
          <div className="bg-[#FEF9C3] border-2 border-[var(--border-color,#134E4A)] rounded-2xl p-3">
            <span className="text-[10px] font-black uppercase text-amber-800">Bonus Koin</span>
            <p className="font-display font-black text-2xl text-amber-700">+{earnedCoins} 🪙</p>
          </div>
        </div>

        {isNewRecord && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] text-[#134E4A] border-2 border-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A]">
            <SparklesSvg size={14} /> REKOR BARU TERCIPTA!
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={startNewSession}
            className="w-full py-3.5 rounded-2xl bg-[#0D9488] text-white font-display font-black text-sm border-[3px] border-[var(--border-color,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Latihan Lagi (5 Soal Baru)
          </button>
        </div>
      </div>
    );
  }

  // Hitung pembagian kata untuk karaoke animation
  const rawTokens = (currentQ.arabicText || currentQ.arabic || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const nonPunctuationTokens = rawTokens.filter((t) => t !== '·' && t !== '=');
  const totalWords = nonPunctuationTokens.length;

  const activeWordIndex =
    isPlayingAudio && totalWords > 0
      ? Math.min(totalWords - 1, Math.floor(audioProgress * totalWords))
      : -1;

  const activeToneIndex =
    isPlayingAudio && currentQ.siklusNada.length > 0
      ? Math.min(
          currentQ.siklusNada.length - 1,
          Math.floor(audioProgress * currentQ.siklusNada.length)
        )
      : -1;

  const isAllFilled = !userPattern.includes(null);
  let wordCounter = 0;

  return (
    <div className="space-y-4">
      {/* Sparkle Burst saat jawaban benar */}
      {burstKey && <SparkleBurst burstKey={burstKey} />}

      {/* Header Soal & Progress */}
      <div className="flex items-center justify-between px-1">
        <span className="font-display font-black text-xs text-[var(--text-main,#134E4A)]">
          Soal {currentIndex + 1} dari {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#134E4A] border-2 border-[var(--border-color,#134E4A)]">
            ⭐ {score} Poin
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <AnimatedProgressBar
        value={((currentIndex + 1) / questions.length) * 100}
        height="h-3"
        barClassName="bg-[#0D9488]"
      />

      {/* Kartu Audio & Karaoke Teks Arab (Single Source of Truth) */}
      <div className="bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#134E4A)] rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] text-center space-y-4">
        {/* Badge Metadata */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#0D9488]/10 text-[#0D9488]">
            Jilid {currentQ.jilid} · Hal {currentQ.hal}
            {currentQ.baris ? ` · Baris ${currentQ.baris}` : ''}
          </span>
          <span
            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
              currentQ.category === 'siklus-3'
                ? 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-200'
                : currentQ.category === 'siklus-2'
                ? 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-900/40 dark:text-sky-200'
                : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200'
            }`}
          >
            {currentQ.category === 'siklus-3'
              ? 'Siklus Penuh (3 Nada)'
              : currentQ.category === 'siklus-2'
              ? 'Siklus Pendek (2 Nada)'
              : 'Nada Tunggal (1 Nada)'}
          </span>
        </div>

        {/* Teks Arab dengan Efek Karaoke Sinkron Waktu Audio */}
        <div className="relative py-6 px-3 bg-[var(--bg-app,#F0FDF4)] border-2 border-[var(--border-color,#134E4A)]/25 rounded-2xl flex flex-col items-center justify-center min-h-[140px]">
          <div
            dir="rtl"
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 leading-relaxed max-w-full"
          >
            {rawTokens.map((token, idx) => {
              const isPunctuation = token === '·' || token === '=';
              if (isPunctuation) {
                return (
                  <span
                    key={idx}
                    className="text-gray-400 font-black text-xl px-1 select-none"
                  >
                    {token}
                  </span>
                );
              }

              const currentWordIdx = wordCounter++;
              const isWordActive = isPlayingAudio && activeWordIndex === currentWordIdx;

              return (
                <span
                  key={idx}
                  className={`font-arabic text-3xl sm:text-4xl font-black transition-all duration-200 px-3 py-1.5 rounded-2xl ${
                    isWordActive
                      ? 'text-amber-500 scale-110 bg-[#FEF08A] dark:bg-amber-900/80 ring-3 ring-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.4)]'
                      : 'text-[var(--text-main,#134E4A)] scale-100'
                  }`}
                >
                  {token}
                </span>
              );
            })}
          </div>

          <p className="mt-3 text-xs sm:text-sm font-bold text-[var(--text-main,#134E4A)]/80 tracking-wide">
            {currentQ.transliteration}
          </p>

          {/* Dinamis Monitor Alunan Nada Saat Audio Qari Berjalan */}
          <div className="mt-4 pt-3 border-t border-[var(--border-color,#134E4A)]/15 w-full flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[11px] font-black text-[var(--text-main,#134E4A)]/70">
              {isPlayingAudio ? '🎧 Mendengarkan Alunan:' : 'Siklus Nada:'}
            </span>
            <div className="flex items-center gap-1.5">
              {currentQ.siklusNada.map((tone, idx) => {
                const isToneActive = isPlayingAudio && activeToneIndex === idx;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <span className="text-xs font-black text-[var(--text-main,#134E4A)]/40">
                        ➔
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-all ${
                        isToneActive
                          ? tone === 'Datar'
                            ? 'bg-[#38BDF8] text-white border-[#0284C7] scale-110 ring-2 ring-sky-400 shadow-sm animate-pulse'
                            : tone === 'Naik'
                            ? 'bg-[#FACC15] text-[#134E4A] border-[#CA8A04] scale-110 ring-2 ring-amber-400 shadow-sm animate-pulse'
                            : 'bg-[#FB7185] text-white border-[#E11D48] scale-110 ring-2 ring-rose-400 shadow-sm animate-pulse'
                          : isAnswerRevealed
                          ? 'bg-white dark:bg-gray-800 text-[#134E4A] border-gray-300 dark:border-gray-600'
                          : 'bg-white/70 dark:bg-gray-800/70 text-gray-400 border-dashed border-gray-300'
                      }`}
                    >
                      {isAnswerRevealed || isToneActive
                        ? `${tone === 'Datar' ? '➡️' : tone === 'Naik' ? '↗️' : '↘️'} ${tone}`
                        : `Kotak ${idx + 1}`}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tombol Putar Ulang Audio Qari */}
        <button
          type="button"
          onClick={playCurrentAudio}
          className="w-full py-3 rounded-2xl bg-white dark:bg-gray-800 border-2 border-[var(--border-color,#134E4A)] font-display font-black text-xs text-[var(--text-main,#134E4A)] flex items-center justify-center gap-2 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:scale-98 transition-transform cursor-pointer"
        >
          <PlaySvg size={14} />
          {isPlayingAudio ? 'Sedang Memutar Audio...' : 'Putar Ulang Suara Qari 🎧'}
        </button>

        {/* Feedback Penjelasan Saat Terjawab */}
        <AnimatePresence>
          {isAnswerRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border-2 text-xs font-bold text-left leading-relaxed flex items-start gap-2.5 ${
                !hasWrongAttempt
                  ? 'bg-[#DCFCE7] border-[#15803D]/40 text-[#14532D]'
                  : 'bg-[#FEF3C7] border-[#B45309]/40 text-[#78350F]'
              }`}
            >
              <CheckSvg
                size={18}
                className={`shrink-0 mt-0.5 ${!hasWrongAttempt ? 'text-[#15803D]' : 'text-[#B45309]'}`}
              />
              <div>
                <p className="font-black text-sm">
                  {!hasWrongAttempt
                    ? 'Luar Biasa, Tepat Sekali! 🎉'
                    : 'Susunan Nada yang Tepat:'}{' '}
                  ({currentQ.siklusNada.join(' ➔ ')})
                </p>
                <p className="text-[11px] mt-1 leading-relaxed opacity-95">
                  {currentQ.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bagian Interaktif: Susun Pola Nada */}
      {!isAnswerRevealed ? (
        <div className="space-y-4">
          {/* Instruksi */}
          <div className="text-center space-y-1">
            <p className="font-display font-black text-sm text-[var(--text-main,#134E4A)]">
              Susun Pola Nada Irama Tilawati:
            </p>
            <p className="text-[11px] font-bold text-[var(--text-main,#134E4A)]/70">
              Pilih nada dari Bank Nada di bawah untuk mengisi {currentQ.siklusNada.length} kotak urutan!
            </p>
          </div>

          {/* DROP ZONE (Kotak-Kotak Urutan Jawaban) */}
          <motion.div
            animate={isShaking ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 sm:gap-3"
          >
            {userPattern.map((placedTone, slotIdx) => (
              <React.Fragment key={slotIdx}>
                {slotIdx > 0 && (
                  <span className="text-base font-black text-[#134E4A]/40 shrink-0 select-none">
                    ➔
                  </span>
                )}

                {placedTone ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleRemoveSlot(slotIdx)}
                    title="Klik untuk menghapus nada ini"
                    className={`flex-1 min-w-[90px] max-w-[130px] py-3 px-2 rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] relative cursor-pointer ${
                      placedTone === 'Datar'
                        ? 'bg-[#38BDF8] text-white'
                        : placedTone === 'Naik'
                        ? 'bg-[#FACC15] text-[#134E4A]'
                        : 'bg-[#FB7185] text-white'
                    }`}
                  >
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[#134E4A] border-2 border-[#134E4A] text-[10px] font-black flex items-center justify-center shadow-xs">
                      ✕
                    </span>
                    <span className="text-2xl">
                      {placedTone === 'Datar'
                        ? '➡️'
                        : placedTone === 'Naik'
                        ? '↗️'
                        : '↘️'}
                    </span>
                    <span className="font-display font-black text-xs sm:text-sm">
                      {placedTone}
                    </span>
                    <span className="text-[9px] font-bold opacity-80">
                      Urutan {slotIdx + 1}
                    </span>
                  </motion.button>
                ) : (
                  <div
                    className="flex-1 min-w-[90px] max-w-[130px] py-3.5 px-2 rounded-2xl border-[3px] border-dashed border-[var(--border-color,#134E4A)]/40 bg-white/70 dark:bg-gray-800/70 flex flex-col items-center justify-center gap-1 shadow-inner text-center select-none"
                  >
                    <span className="text-xl opacity-60">❓</span>
                    <span className="font-display font-black text-xs text-[var(--text-main,#134E4A)]/70 dark:text-gray-300">
                      Kotak {slotIdx + 1}
                    </span>
                    <span className="text-[9px] font-bold text-[var(--text-main,#134E4A)]/50 dark:text-gray-400">
                      (Ketuk Nada)
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Feedback jika susunan salah */}
          {hasWrongAttempt && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-[#FEE2E2] border-2 border-[#DC2626]/40 text-[#991B1B] text-xs font-bold text-center leading-relaxed"
            >
              ⚠️ Urutan nada belum tepat dengan alunan qari. Coba dengarkan lagi dan atur ulang kotaknya ya!
            </motion.div>
          )}

          {/* BANK NADA (Tombol Pilihan Nada) */}
          <div className="space-y-2 pt-1">
            <span className="block text-center text-[11px] font-black text-[var(--text-main,#134E4A)] uppercase tracking-wider">
              Bank Nada Tilawati
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Datar */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddTone('Datar')}
                className="py-3.5 px-2 rounded-2xl font-display font-black text-xs sm:text-sm border-[3px] border-[var(--border-color,#134E4A)] bg-[#38BDF8] hover:bg-[#0284C7] text-white shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] active:translate-y-0.5 active:shadow-none flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all"
              >
                <span className="text-xl">➡️</span>
                <span>Datar</span>
                <span className="text-[9px] font-bold opacity-90">(Lurus)</span>
              </motion.button>

              {/* Naik */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddTone('Naik')}
                className="py-3.5 px-2 rounded-2xl font-display font-black text-xs sm:text-sm border-[3px] border-[var(--border-color,#134E4A)] bg-[#FACC15] hover:bg-[#EAB308] text-[#134E4A] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] active:translate-y-0.5 active:shadow-none flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all"
              >
                <span className="text-xl">↗️</span>
                <span>Naik</span>
                <span className="text-[9px] font-bold opacity-90">(Meninggi)</span>
              </motion.button>

              {/* Turun */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddTone('Turun')}
                className="py-3.5 px-2 rounded-2xl font-display font-black text-xs sm:text-sm border-[3px] border-[var(--border-color,#134E4A)] bg-[#FB7185] hover:bg-[#F43F5E] text-white shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] active:translate-y-0.5 active:shadow-none flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all"
              >
                <span className="text-xl">↘️</span>
                <span>Turun</span>
                <span className="text-[9px] font-bold opacity-90">(Melandai)</span>
              </motion.button>
            </div>
          </div>

          {/* Tombol Periksa Jawaban & Reset */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleResetPattern}
              disabled={userPattern.every((t) => t === null)}
              className="py-3.5 px-4 rounded-2xl bg-white dark:bg-gray-800 text-[var(--text-main,#134E4A)] border-2 border-[var(--border-color,#134E4A)] font-display font-black text-xs shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcwSvg size={14} />
              Kosongkan Kotak
            </button>

            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={!isAllFilled}
              className={`flex-1 py-4 px-4 rounded-2xl font-display font-black text-sm border-[3px] border-[var(--border-color,#134E4A)] transition-all ${
                isAllFilled
                  ? 'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] active:translate-y-0.5 active:shadow-none cursor-pointer'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 border-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isAllFilled
                ? 'Periksa Susunan Nada ✨'
                : `Isi Semua Kotak (${userPattern.filter(Boolean).length}/${userPattern.length})`}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-black text-base border-[3px] border-[var(--border-color,#134E4A)] shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          {currentIndex < questions.length - 1 ? 'Soal Berikutnya ➡️' : 'Lihat Hasil Akhir 🎉'}
        </button>
      )}
    </div>
  );
};
