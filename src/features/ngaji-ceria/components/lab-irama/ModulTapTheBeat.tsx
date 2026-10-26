import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_RHYTHM_TRACK } from '../../data/labIramaData';
import {
  judgeBeatHit,
  calculateIramaRank,
  RANK_METADATA,
  type HitResult,
} from './timingJudge';
import { useLabIramaMetronome, preloadLabIramaAudio } from '../../hooks/useLabIramaMetronome';
import { useLabIramaStore } from '../../hooks/useLabIramaStore';
import { soundManager } from '../../services/soundManager';
import { tapFeedback } from '../../../../lib/haptics';
import {
  PlaySvg,
  SparklesSvg,
  RotateCcwSvg,
  TrophySvg,
  FireSvg,
  StarSvg,
  DrumSvg,
  ArrowRightSvg,
  ArrowUpRightSvg,
  ArrowDownRightSvg,
  LeafSvg,
} from '../../../../components/ui/CustomIcons';

interface BeatNode {
  id: number;
  beatNumber: number;
  arabic?: string;
  tone: 'datar' | 'naik' | 'turun';
  type: '1-harakat' | '2-harakat';
  targetTime: number; // in seconds from start
  hit: boolean;
}

export const ModulTapTheBeat: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [lastHit, setLastHit] = useState<HitResult | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const preferredBpm = useLabIramaStore((s) => s.preferredBpm);
  const metronomeSound = useLabIramaStore((s) => s.metronomeSound);
  const recordTapTheBeat = useLabIramaStore((s) => s.recordTapTheBeat);
  const bestTapScore = useLabIramaStore((s) => s.bestTapScore);

  const startTimeRef = useRef<number>(0);
  const activeNodesRef = useRef<BeatNode[]>([]);
  const [activeNodes, setActiveNodes] = useState<BeatNode[]>([]);
  const animationFrameRef = useRef<number>(0);
  const gameDurationRef = useRef<number>(0);

  // Metronom audio & timing
  const { currentBeatInCycle, triggerManualTick } = useLabIramaMetronome({
    active: isPlaying,
    bpm: preferredBpm,
    soundEnabled: metronomeSound,
    beatsPerCycle: 3,
  });

  const startGame = useCallback(() => {
    void preloadLabIramaAudio();
    soundManager.playSfx('tap');

    const beatInterval = 60 / preferredBpm;
    const track = DEFAULT_RHYTHM_TRACK;

    // Persiapkan daftar node ketukan berdasarkan track
    const nodes: BeatNode[] = track.beats.map((b, idx) => ({
      id: idx + 1,
      beatNumber: b.beatNumber,
      arabic: b.arabic,
      tone: b.tone,
      type: b.type,
      targetTime: b.beatNumber * beatInterval,
      hit: false,
    }));

    activeNodesRef.current = nodes;
    setActiveNodes(nodes);

    startTimeRef.current = performance.now() / 1000 + 1.2; // 1.2 detik lead-in
    gameDurationRef.current = (track.totalBeats + 2) * beatInterval;

    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPerfectCount(0);
    setGoodCount(0);
    setMissCount(0);
    setLastHit(null);
    setIsGameOver(false);
    setIsPlaying(true);
  }, [preferredBpm]);

  // Main game loop (RAF)
  useEffect(() => {
    if (!isPlaying) return;

    const loop = () => {
      const now = performance.now() / 1000;
      const elapsed = now - startTimeRef.current;

      // Cek apakah ada beat yang terlewat (missed) karena tidak di-tap
      const nodes = activeNodesRef.current;
      let stateChanged = false;

      nodes.forEach((node) => {
        if (!node.hit && elapsed - node.targetTime > 0.28) {
          node.hit = true;
          stateChanged = true;
          setCombo(0);
          setMissCount((c) => c + 1);
          setLastHit({
            judgment: 'miss',
            score: 0,
            label: 'Terlewat!',
            color: '#EF4444',
            diffMs: (elapsed - node.targetTime) * 1000,
          });
        }
      });

      if (stateChanged) {
        setActiveNodes([...nodes]);
      }

      // Selesai game
      if (elapsed >= gameDurationRef.current) {
        setIsPlaying(false);
        setIsGameOver(true);
        soundManager.playSfx('victory');

        // Rekap nilai
        const totalNotes = nodes.length;
        const totalScore = score;
        const totalHits = perfectCount + goodCount;
        const accuracy = totalNotes > 0 ? Math.round((totalHits / totalNotes) * 100) : 0;
        const res = recordTapTheBeat(totalScore, maxCombo, accuracy);
        setEarnedCoins(res.coinsEarned);
        setIsNewRecord(res.isNewRecord);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, score, maxCombo, perfectCount, goodCount, recordTapTheBeat]);

  // Handle Tap aksi anak
  const handleTap = useCallback(() => {
    if (!isPlaying) return;

    tapFeedback();
    triggerManualTick();

    const now = performance.now() / 1000;
    const elapsed = now - startTimeRef.current;

    // Cari node terdekat yang belum di-hit
    const nodes = activeNodesRef.current;
    let closestNode: BeatNode | null = null;
    let minDiffMs = Infinity;

    for (const node of nodes) {
      if (!node.hit) {
        const diffMs = (elapsed - node.targetTime) * 1000;
        if (Math.abs(diffMs) < Math.abs(minDiffMs)) {
          minDiffMs = diffMs;
          closestNode = node;
        }
      }
    }

    if (!closestNode || Math.abs(minDiffMs) > 400) {
      // Tap terlalu jauh / acak
      return;
    }

    // Evaluasi dengan window ramah anak (Perfect <= 120ms, Good <= 250ms)
    const result = judgeBeatHit(minDiffMs);
    closestNode.hit = true;
    setLastHit(result);

    if (result.judgment === 'perfect') {
      soundManager.playSfx('correct');
      setScore((s) => s + result.score + Math.min(combo * 5, 50));
      setCombo((c) => {
        const next = c + 1;
        setMaxCombo((m) => Math.max(m, next));
        return next;
      });
      setPerfectCount((c) => c + 1);
    } else if (result.judgment === 'good') {
      soundManager.playSfx('pop');
      setScore((s) => s + result.score + Math.min(combo * 2, 20));
      setCombo((c) => {
        const next = c + 1;
        setMaxCombo((m) => Math.max(m, next));
        return next;
      });
      setGoodCount((c) => c + 1);
    } else {
      soundManager.playSfx('wrong');
      setCombo(0);
      setMissCount((c) => c + 1);
    }

    setActiveNodes([...nodes]);
  }, [isPlaying, combo, triggerManualTick]);

  // Listen Spacebar untuk kemudahan di desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (!isPlaying && !isGameOver) {
          startGame();
        } else {
          handleTap();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, startGame, handleTap]);

  // Layar Akhir Sesi
  if (isGameOver) {
    const totalHits = perfectCount + goodCount;
    const totalNotes = activeNodesRef.current.length || 1;
    const accuracy = Math.round((totalHits / totalNotes) * 100);
    const rankKey = calculateIramaRank(accuracy);
    const rankInfo = RANK_METADATA[rankKey];

    return (
      <div className="bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#134E4A)] rounded-3xl p-6 shadow-[5px_5px_0px_var(--shadow-color,#134E4A)] text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0D9488] border-[3px] border-[var(--border-color,#134E4A)] flex items-center justify-center text-white shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]">
          <TrophySvg size={32} />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0D9488]/10 text-[#0D9488]">
            Hasil Ronde Ketuk Irama
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

        {/* Statistik */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto text-center">
          <div className="bg-[var(--bg-app,#F0FDF4)] border-2 border-[var(--border-color,#134E4A)] rounded-2xl p-2.5">
            <span className="text-[9px] font-black uppercase text-gray-500">Skor Akhir</span>
            <p className="font-display font-black text-lg text-[#134E4A]">{score}</p>
          </div>
          <div className="bg-[#FEF9C3] border-2 border-[var(--border-color,#134E4A)] rounded-2xl p-2.5">
            <span className="text-[9px] font-black uppercase text-amber-800">Max Combo</span>
            <p className="font-display font-black text-lg text-amber-700 flex items-center justify-center gap-1">
              <span>{maxCombo}x</span>
              <FireSvg size={18} className="text-[#EA580C]" />
            </p>
          </div>
          <div className="bg-[#E0F2FE] border-2 border-[var(--border-color,#134E4A)] rounded-2xl p-2.5">
            <span className="text-[9px] font-black uppercase text-sky-800">Akurasi</span>
            <p className="font-display font-black text-lg text-sky-700">{accuracy}%</p>
          </div>
        </div>

        {isNewRecord && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] text-[#134E4A] border-2 border-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A]">
            <SparklesSvg size={14} /> REKOR SKOR TERTINGGI!
          </div>
        )}

        {/* Rincian Perfect / Good / Miss */}
        <div className="flex justify-center gap-4 text-xs font-black">
          <span className="text-emerald-700">Sempurna: {perfectCount}</span>
          <span className="text-sky-700">Bagus: {goodCount}</span>
          <span className="text-rose-600">Terlewat: {missCount}</span>
        </div>

        <button
          type="button"
          onClick={startGame}
          className="w-full py-4 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-black text-base border-[3px] border-[var(--border-color,#134E4A)] shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <RotateCcwSvg size={18} /> Main Lagi!
        </button>
      </div>
    );
  }

  // Posisi target ring di runway (persentase dari kiri)
  const targetXPercent = 22;

  return (
    <div className="space-y-4 select-none">
      {/* 1. Header Game Info */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-xs text-[var(--text-main,#134E4A)]">
            Tempo: {preferredBpm} BPM
          </span>
          {combo >= 3 && (
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-white shadow-sm animate-pulse inline-flex items-center gap-1">
              <span>{combo}x COMBO</span>
              <FireSvg size={12} className="inline-block" />
            </span>
          )}
        </div>

        <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FEF08A] text-[#134E4A] border-2 border-[var(--border-color,#134E4A)] inline-flex items-center gap-1">
          <StarSvg size={14} fill="#FDE047" stroke="#134E4A" /> {score} Poin
        </span>
      </div>

      {/* 2. Rhythm Runway Arena (Lintasan Ketukan) */}
      <div
        onClick={handleTap}
        className="relative h-44 overflow-hidden rounded-3xl border-[3px] border-[var(--border-color,#134E4A)] bg-gradient-to-b from-[#134E4A] to-[#042F2C] p-4 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] cursor-pointer"
      >
        {/* Garis lintasan tengah */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-white/40 -translate-y-1/2" />

        {/* Target Zone (Lingkaran Target Ketukan di sebelah kiri) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
          style={{ left: `${targetXPercent}%`, transform: 'translate(-50%, -50%)' }}
        >
          {/* Target Ring Berdenyut */}
          <div className="relative w-16 h-16 rounded-full border-4 border-[#FEF08A] bg-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(254,240,138,0.5)]">
            <div className="w-10 h-10 rounded-full border-2 border-white/80 animate-ping opacity-40" />
            <span className="text-xs font-black text-[#FEF08A]">TAP</span>
          </div>
        </div>

        {/* Feedback Floating Text (Sempurna / Bagus / Terlewat) */}
        <AnimatePresence>
          {lastHit && (
            <motion.div
              key={`${lastHit.judgment}-${Date.now()}`}
              initial={{ opacity: 1, y: 0, scale: 0.9 }}
              animate={{ opacity: 0, y: -45, scale: 1.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute top-6 z-20 font-display font-black text-base px-3 py-1 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{
                left: `${targetXPercent}%`,
                transform: 'translateX(-50%)',
                backgroundColor: lastHit.color,
                color: '#FFFFFF',
              }}
            >
              {lastHit.label}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Node-node ketukan yang bergerak dari kanan ke kiri */}
        {isPlaying &&
          activeNodes.map((node) => {
            if (node.hit) return null;
            const now = performance.now() / 1000;
            const elapsed = now - startTimeRef.current;
            const timeToTarget = node.targetTime - elapsed; // detik tersisa sebelum target

            // Speed: node bergerak selama 2 detik dari tepi kanan ke target
            const runwayDuration = 2.0;
            const progress = (runwayDuration - timeToTarget) / runwayDuration; // 0 saat mulai muncul, 1 saat di target
            const xPosPercent = 100 - progress * (100 - targetXPercent);

            if (xPosPercent < -10 || xPosPercent > 110) return null;

            const isMad = node.type === '2-harakat';

            return (
              <div
                key={node.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                style={{ left: `${xPosPercent}%` }}
              >
                <div
                  className={`flex items-center justify-center rounded-2xl border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] font-black ${
                    isMad
                      ? 'w-16 h-14 bg-[#F59E0B] text-white'
                      : 'w-12 h-12 bg-[#2DD4BF] text-[#134E4A]'
                  }`}
                >
                  {node.arabic ? (
                    <span className="font-arabic text-xl leading-none">
                      {node.arabic}
                    </span>
                  ) : (
                    <span className="text-xs inline-flex items-center">
                      {node.tone === 'datar' ? (
                        <ArrowRightSvg size={14} />
                      ) : node.tone === 'naik' ? (
                        <ArrowUpRightSvg size={14} />
                      ) : (
                        <ArrowDownRightSvg size={14} />
                      )}
                    </span>
                  )}
                </div>
                {isMad && (
                  <span className="text-[9px] font-black text-[#FEF08A] bg-black/50 px-1 rounded mt-0.5">
                    2 Ketukan
                  </span>
                )}
              </div>
            );
          })}

        {/* Layar Panduan Siap Main */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10">
            <h3 className="font-display font-black text-lg text-white">
              Siap Mengetuk Sesuai Irama?
            </h3>
            <p className="text-xs font-bold text-teal-200 mt-1 max-w-xs">
              Tekan tombol saat bola nada mengenai lingkaran target emas!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-3 px-6 py-2.5 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-black text-sm border-2 border-white shadow-[3px_3px_0px_#FFFFFF] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
            >
              <PlaySvg size={16} /> Mulai Main Sekarang!
            </button>
          </div>
        )}
      </div>

      {/* 3. AREA KETUKAN LEBAR (FULL-WIDTH BOTTOM TAP BUTTON) */}
      {/* Memenuhi instruksi user: "Pastikan area ketukan di Modul 3 sangat luas (mencakup seluruh lebar layar bagian bawah)" */}
      <div className="pt-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98, y: 3 }}
          onClick={isPlaying ? handleTap : startGame}
          className={`w-full py-7 sm:py-9 px-6 rounded-3xl font-display font-black text-xl sm:text-2xl border-[4px] border-[var(--border-color,#134E4A)] shadow-[0_6px_0_var(--shadow-color,#134E4A)] active:translate-y-1 active:shadow-[0_2px_0_var(--shadow-color,#134E4A)] flex flex-col items-center justify-center gap-1 transition-all touch-manipulation ${
            isPlaying
              ? 'bg-[#0D9488] text-white hover:bg-[#0F766E]'
              : 'bg-[#FEF08A] text-[#134E4A] hover:bg-[#FDE047]'
          }`}
        >
          <div className="flex items-center gap-2">
            <DrumSvg size={28} />
            <span>{isPlaying ? 'TAP KETUKAN DI SINI!' : 'MULAI KETUK IRAMA'}</span>
          </div>
          <span className="text-xs opacity-90 font-bold tracking-wide">
            {isPlaying
              ? '(Sentuh area mana saja di tombol ini saat bola mengenai target)'
              : 'Tekan untuk memulai ronde 24 ketukan'}
          </span>
        </motion.button>
      </div>
    </div>
  );
};
