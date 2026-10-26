import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { judgeBeatHit, HitResult, HIT_WINDOWS } from '../lab-irama/timingJudge';
import { soundManager } from '../../services/soundManager';
import { DrumSvg, TargetSvg, SparklesSvg, MusicSvg } from '../../../../components/ui/CustomIcons';

interface RhythmTapZoneProps {
  active: boolean;
  bpm: number;
  beatsCount: number;
  durationMs: number;
  onSuccess: (result: HitResult) => void;
  onFail: (result: HitResult) => void;
  onCancel?: () => void;
  cardArabicText?: string;
  transliteration?: string;
  tone?: 'datar' | 'naik' | 'turun';
}

export function RhythmTapZone({
  active,
  bpm,
  beatsCount,
  durationMs,
  onSuccess,
  onFail,
  onCancel,
  cardArabicText,
  transliteration,
  tone = 'datar',
}: RhythmTapZoneProps) {
  const [feedback, setFeedback] = useState<HitResult | null>(null);
  const [isHit, setIsHit] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0); // 0 to 100%
  const [currentBeatTargetIndex, setCurrentBeatTargetIndex] = useState(0);

  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const hasJudgedRef = useRef(false);
  const beatTimesRef = useRef<number[]>([]); // ms from start

  // Hitung jadwal beat (misal 2 beat: 1000ms dan 1900ms)
  useEffect(() => {
    if (!active) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setFeedback(null);
      setIsHit(false);
      setProgressPercent(0);
      hasJudgedRef.current = false;
      return;
    }

    const beatInterval = (60 / bpm) * 1000;
    // Beri jeda 600ms awal agar anak siap mendengarkan qari sebelum beat pertama
    const leadInMs = 650;
    const targets: number[] = [];
    for (let i = 0; i < beatsCount; i++) {
      targets.push(leadInMs + i * beatInterval);
    }
    beatTimesRef.current = targets;
    startTimeRef.current = performance.now();
    hasJudgedRef.current = false;
    setCurrentBeatTargetIndex(0);
    setFeedback(null);
    setIsHit(false);

    const totalDuration = Math.max(durationMs, targets[targets.length - 1] + 800);

    const updateLoop = () => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgressPercent(progress);

      // Cek apakah target beat terakhir sudah lewat tanpa ketukan
      const lastTarget = targets[targets.length - 1];
      if (!hasJudgedRef.current && elapsed > lastTarget + HIT_WINDOWS.GOOD + 100) {
        hasJudgedRef.current = true;
        const missResult: HitResult = {
          judgment: 'miss',
          score: 0,
          label: 'Terlewat!',
          color: '#EF4444',
          diffMs: elapsed - lastTarget,
        };
        setFeedback(missResult);
        soundManager.playSfx('wrong');
        setTimeout(() => {
          onFail(missResult);
        }, 700);
      }

      if (elapsed < totalDuration && !hasJudgedRef.current) {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, bpm, beatsCount, durationMs, onFail]);

  // Handler saat tombol KETUK ditekan anak
  const handleTap = useCallback(() => {
    if (!active || hasJudgedRef.current) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;

    // Cari beat target yang paling dekat dengan waktu ketukan
    const targets = beatTimesRef.current;
    if (targets.length === 0) return;

    let minDiff = Infinity;
    let closestTarget = targets[0];

    for (const target of targets) {
      const diff = elapsed - target;
      if (Math.abs(diff) < Math.abs(minDiff)) {
        minDiff = diff;
        closestTarget = target;
      }
    }

    const result = judgeBeatHit(minDiff);
    setFeedback(result);
    setIsHit(true);

    if (result.judgment === 'perfect' || result.judgment === 'good') {
      hasJudgedRef.current = true;
      soundManager.playSfx(result.judgment === 'perfect' ? 'correct' : 'pop');
      setTimeout(() => {
        onSuccess(result);
      }, 550);
    } else {
      // Miss
      hasJudgedRef.current = true;
      soundManager.playSfx('wrong');
      setTimeout(() => {
        onFail(result);
      }, 700);
    }
  }, [active, onSuccess, onFail]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 bg-gradient-to-t from-[#022c22] via-[#042f2e] to-transparent backdrop-blur-xs select-none"
    >
      <div className="mx-auto max-w-md w-full flex flex-col gap-2.5">
        {/* PANEL STATUS & PETUNJUK */}
        <div className="flex items-center justify-between rounded-xl bg-[#0f172a]/90 border-2 border-[#10b981]/50 px-3 py-1.5 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 animate-pulse inline-flex items-center"><MusicSvg size={14} /></span>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-amber-200">
                {transliteration ? `${transliteration} (${tone.toUpperCase()})` : 'Ikuti Ketukan'}
              </span>
              <span className="text-[9px] text-emerald-200/80 font-medium">
                Ketuk saat bola tepat masuk ke lingkaran!
              </span>
            </div>
          </div>

          {/* Feedback Label Popup */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs"
                style={{ backgroundColor: feedback.color, color: '#FFFFFF' }}
              >
                {feedback.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TIMELINE HORIZONTAL (BOLA BERGERAK DARI KANAN KE TARGET DI KIRI) */}
        <div className="relative h-16 w-full rounded-2xl bg-[#064e3b] border-[3px] border-[#34d399] p-2 flex items-center shadow-[inset_0_3px_8px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Garis lintasan bergelombang */}
          <div className="absolute inset-x-4 h-1.5 bg-[#022c22] rounded-full border border-[#10b981]/40" />

          {/* TARGET HIT ZONE DI KIRI */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              animate={
                isHit
                  ? { scale: [1, 1.3, 1], borderColor: ['#fde047', '#10b981', '#fde047'] }
                  : { scale: [1, 1.08, 1] }
              }
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-12 h-12 rounded-full border-[3.5px] border-[#fde047] bg-[#022c22] flex items-center justify-center shadow-[0_0_12px_#fde047]"
            >
              <div className="w-5 h-5 rounded-full bg-[#fde047]/30 border-2 border-dashed border-[#fde047] flex items-center justify-center">
                <TargetSvg size={12} stroke="#78350f" />
              </div>
            </motion.div>
          </div>

          {/* BOLA-BOLA IRAMA MELUNCUR DARI KANAN KE KIRI MENUJU TARGET */}
          <div className="relative flex-1 h-full flex items-center overflow-hidden">
            {beatTimesRef.current.map((targetTime, idx) => {
              // Posisi bola: saat elapsed = 0, posisi di kanan (100%). Saat elapsed = targetTime, posisi di kiri (0% / di target)
              const leadInMs = 650;
              const spawnTime = Math.max(0, targetTime - leadInMs);
              const totalTravelTime = targetTime - spawnTime;
              const now = performance.now();
              const elapsed = now - startTimeRef.current;

              // Berapa persen jarak dari spawn ke target
              let travelRatio = (targetTime - elapsed) / totalTravelTime;
              // Batasi antara -0.2 (sudah lewat) sampai 1 (baru muncul)
              travelRatio = Math.max(-0.2, Math.min(1, travelRatio));
              const leftPercent = travelRatio * 85; // 0% = tepat di target, 85% = di kanan

              return (
                <motion.div
                  key={idx}
                  className="absolute"
                  style={{
                    left: `${Math.max(0, leftPercent)}%`,
                    display: elapsed < spawnTime - 200 ? 'none' : 'block',
                  }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 0.4 }}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#d97706] border-[2.5px] border-[#78350f] shadow-[0_3px_6px_rgba(0,0,0,0.4)] flex items-center justify-center text-xs font-black text-[#78350f]">
                    {idx + 1}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* TOMBOL KETUK RAKSASA (FULL WIDTH & SUPER RESPONSIF) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95, y: 3 }}
          onClick={handleTap}
          className="w-full py-4 sm:py-5 rounded-2xl border-[3.5px] border-[#78350f] bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:from-[#fde047] hover:to-[#f59e0b] text-[#78350f] font-black text-xl sm:text-2xl tracking-wider uppercase shadow-[0_6px_0px_#78350f] active:shadow-none flex items-center justify-center gap-3 transition-colors cursor-pointer select-none"
        >
          <DrumSvg size={28} stroke="#78350f" className="animate-bounce" />
          <span>KETUK SEKARANG!</span>
          <SparklesSvg size={24} stroke="#78350f" className="animate-bounce text-[#78350f]" />
        </motion.button>
      </div>
    </motion.div>
  );
}
