import { useState, useEffect, useRef, useCallback } from 'react';
import { PatternArrow, type PatternArrowType } from './PatternArrow';
import { soundManager } from '../../services/soundManager';
import {
  PlaySvg,
  RotateCcwSvg,
  DrumSvg,
  SparklesSvg,
} from '../../../../components/ui/CustomIcons';

type Tone = 'datar' | 'naik' | 'turun';

type Phase = 'ready' | 'demo' | 'input' | 'result';

interface PatternDef {
  type: PatternArrowType;
  label: string;
  beats: Tone[];
}

const PATTERNS: PatternDef[] = [
  { type: '1-datar', label: '1 Nada', beats: ['datar'] },
  { type: '2-datar-turun', label: '2 Nada', beats: ['datar', 'turun'] },
  { type: '3-datar-naik-turun', label: '3 Nada', beats: ['datar', 'naik', 'turun'] },
  { type: '4-datar-naik-naik-turun', label: '4 Nada', beats: ['datar', 'naik', 'naik', 'turun'] },
];

const TONE_META: Record<Tone, { label: string; color: string; arrow: string }> = {
  datar: { label: 'Datar', color: '#0D9488', arrow: '→' },
  naik: { label: 'Naik', color: '#F59E0B', arrow: '↗' },
  turun: { label: 'Turun', color: '#FF6B6B', arrow: '↘' },
};

const STEP_INTERVAL = 650;
const MIN_INTERVAL = 450;
const MAX_INTERVAL = 850;

function pickPattern(excludeType?: PatternArrowType): PatternDef {
  const pool = PATTERNS.filter((p) => p.type !== excludeType);
  const list = pool.length > 0 ? pool : PATTERNS;
  return list[Math.floor(Math.random() * list.length)];
}

export const ModulTapTheBeat: React.FC = () => {
  const [pattern, setPattern] = useState<PatternDef>(() => PATTERNS[2]);
  const [phase, setPhaseState] = useState<Phase>('ready');
  const [activeStep, setActiveStep] = useState(-1);
  const [taps, setTaps] = useState<number[]>([]);
  const [resultKind, setResultKind] = useState<'success' | 'fail' | null>(null);

  const phaseRef = useRef<Phase>('ready');
  const tapsRef = useRef<number[]>([]);
  const timersRef = useRef<number[]>([]);

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const finishRound = useCallback(
    (success: boolean) => {
      setResultKind(success ? 'success' : 'fail');
      setPhase('result');
      soundManager.playSfx(success ? 'correct' : 'wrong');
    },
    [setPhase],
  );

  const runDemo = useCallback(
    (def: PatternDef) => {
      clearTimers();
      tapsRef.current = [];
      setTaps([]);
      setActiveStep(-1);
      setResultKind(null);
      setPhase('demo');

      def.beats.forEach((_, i) => {
        const t = window.setTimeout(() => {
          setActiveStep(i);
          soundManager.playSfx('tap');
        }, 400 + i * STEP_INTERVAL);
        timersRef.current.push(t);
      });

      const endT = window.setTimeout(
        () => {
          setActiveStep(-1);
          tapsRef.current = [];
          setPhase('input');
        },
        400 + def.beats.length * STEP_INTERVAL + 350,
      );
      timersRef.current.push(endT);
    },
    [clearTimers, setPhase],
  );

  const handleStart = useCallback(() => {
    const next = pickPattern(pattern.type);
    setPattern(next);
    soundManager.playSfx('tap');
    runDemo(next);
  }, [pattern.type, runDemo]);

  const handleTap = useCallback(() => {
    if (phaseRef.current !== 'input') return;

    const now = performance.now();
    const nextTaps = [...tapsRef.current, now];
    tapsRef.current = nextTaps;
    setTaps(nextTaps);
    soundManager.playSfx('tap');

    if (nextTaps.length < pattern.beats.length) return;

    const intervals: number[] = [];
    for (let i = 1; i < nextTaps.length; i += 1) {
      intervals.push(nextTaps[i] - nextTaps[i - 1]);
    }
    const allGood = intervals.every((d) => d >= MIN_INTERVAL && d <= MAX_INTERVAL);
    finishRound(allGood);
  }, [pattern.beats.length, finishRound]);

  const handleNextRound = useCallback(() => {
    const next = pickPattern(pattern.type);
    setPattern(next);
    runDemo(next);
  }, [pattern.type, runDemo]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  // Layar Hasil
  if (phase === 'result') {
    const success = resultKind === 'success';
    const intervals: number[] = [];
    for (let i = 1; i < taps.length; i += 1) {
      intervals.push(Math.round(taps[i] - taps[i - 1]));
    }

    return (
      <div className="max-w-md mx-auto p-4 space-y-4 rounded-3xl bg-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A]">
        <div className="text-center space-y-3">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl border-[3px] border-[#134E4A] flex items-center justify-center shadow-[3px_3px_0px_#134E4A] ${
              success ? 'bg-[#DCFCE7]' : 'bg-[#FEE2E2]'
            }`}
          >
            <SparklesSvg size={32} />
          </div>
          <span
            className={`inline-block rounded-full border-2 border-[#134E4A] px-3 py-0.5 text-[10px] font-black uppercase ${
              success ? 'bg-[#DCFCE7] text-[#14532D]' : 'bg-[#FEE2E2] text-[#991B1B]'
            }`}
          >
            {success ? 'Berhasil!' : 'Coba Lagi'}
          </span>
          <h2 className="text-xl font-black text-[#134E4A]">
            {success ? 'Ritmeger Kepetakan!' : 'Ritme Masih Berantakan'}
          </h2>
          <p className="text-sm font-bold text-[#134E4A]/70">
            Pola: <span className="text-[#0D9488]">{pattern.label}</span>
          </p>
          {intervals.length > 0 && (
            <p className="text-xs font-bold text-[#134E4A]/60">
              Jeda ketukanmu: {intervals.join('ms · ')}ms
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextRound}
          className="w-full py-3 rounded-2xl bg-[#0D9488] text-white font-black shadow-[4px_4px_0px_#134E4A] border-[3px] border-[#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcwSvg size={18} /> Pola Berikutnya
        </button>
      </div>
    );
  }

  const beatTotal = pattern.beats.length;
  const isInput = phase === 'input';
  const progressDots = Math.min(taps.length, beatTotal);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Header info */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black text-[#134E4A]">Ketuk Irama</span>
        <span className="flex items-center gap-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-2.5 py-0.5 text-xs font-black text-[#134E4A]">
          {pattern.label}
        </span>
      </div>

      {/* Kartu pola */}
      <div className="rounded-3xl bg-white border-[3px] border-[#134E4A] p-5 text-center shadow-[4px_4px_0px_#134E4A] space-y-4">
        <span className="inline-block rounded-full bg-[#0D9488]/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#0D9488]">
          Pola Nada
        </span>

        <div className="flex justify-center">
          <PatternArrow type={pattern.type} />
        </div>

        {/* Indikator ketukan menyala satu per satu */}
        <div className="flex items-center justify-center gap-3">
          {pattern.beats.map((tone, i) => {
            const meta = TONE_META[tone];
            const lit = phase === 'demo' ? i === activeStep : isInput && i < progressDots;
            return (
              <div
                key={i}
                className={`flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-[3px] border-[#134E4A] transition-all duration-150 ${
                  lit ? 'scale-105 opacity-100 shadow-[3px_3px_0px_#134E4A]' : 'opacity-50'
                }`}
                style={lit ? { backgroundColor: meta.color } : { backgroundColor: '#FFFFFF' }}
              >
                <span
                  className="text-xl font-black leading-none"
                  style={{ color: lit ? '#FFFFFF' : meta.color }}
                >
                  {meta.arrow}
                </span>
                <span
                  className="text-[8px] font-black uppercase"
                  style={{ color: lit ? '#FFFFFF' : '#134E4A' }}
                >
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status instruksi */}
        <p className="text-xs font-bold text-[#134E4A]/70">
          {phase === 'ready' && 'Tekan Mulai, dengar pola, lalu tiru ketukannya.'}
          {phase === 'demo' && 'Perhatikan panah yang menyala satu per satu...'}
          {isInput &&
            `Sekarang ketuk ${beatTotal}x sesuai irama! (${progressDots}/${beatTotal})`}
        </p>
      </div>

      {/* Area ketukan besar */}
      <button
        type="button"
        onClick={isInput ? handleTap : handleStart}
        className="w-full py-7 sm:py-9 px-6 rounded-3xl font-black text-xl sm:text-2xl border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all touch-manipulation flex flex-col items-center justify-center gap-1 cursor-pointer bg-[#0D9488] text-white hover:bg-[#0F766E]"
      >
        <div className="flex items-center gap-2">
          {isInput ? <DrumSvg size={28} /> : <PlaySvg size={28} />}
          <span>{isInput ? 'KETUK DI SINI!' : 'MULAI KETUK IRAMA'}</span>
        </div>
        <span className="text-xs opacity-90 font-bold tracking-wide">
          {isInput
            ? `Ketuk ${beatTotal}x mengikuti irama pola`
            : 'Tekan untuk mendengar panduan pola'}
        </span>
      </button>
    </div>
  );
};
