import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { NgajiCeriaLayout } from '../../components/NgajiCeriaLayout';
import { ExploreHeader, ExploreStatBadge } from '../../components/ExploreHeader';
import { PatternArrowButton, type ArrowType, type PatternType } from '../../components/lab-irama/PatternArrowButton';
import {
  getRhythmMemoryLevels,
  getRhythmMemoryLevelInfo,
  getBaseTone,
  type TrainingItem,
} from '../../utils/tilawatiTrainingDataAdapter';
import { useRhythmMemoryAudio } from '../../hooks/useRhythmMemoryAudio';
import { triggerBibiReaction } from '@/utils/bibiEvent';
import { soundManager } from '../../services/soundManager';
import { patternTypeToArrows } from '../../utils/rhythmMemoryPattern';
import { AnswerFeedbackSheet } from '../../components/AnswerFeedbackSheet';
import { StarSvg } from '@/components/ui/CustomIcons';

// Kamus: kode panah ditampilkan di bank panah dan kotak jawaban.
const ARROW_LABEL: Record<ArrowType, string> = {
  datar: 'Datar',
  naik: 'Naik',
  turun: 'Turun',
};

const ARROW_SYMBOL: Record<ArrowType, string> = {
  datar: '→',
  naik: '↗',
  turun: '↘',
};

const ARROW_COLOR_CLASS: Record<ArrowType, string> = {
  datar: 'text-[#0D9488]',
  naik: 'text-[#F59E0B]',
  turun: 'text-[#FF6B6B]',
};

export default function RhythmMemoryPage() {
  const navigate = useNavigate();
  const { jilid: jilidParam } = useParams<{ jilid?: string }>();

  const currentJilid = useMemo(() => {
    const parsed = Number(jilidParam);
    return parsed >= 1 && parsed <= 6 ? parsed : 1;
  }, [jilidParam]);

  const [levels, setLevels] = useState<TrainingItem[][]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);

  useEffect(() => {
    let alive = true;
    void getRhythmMemoryLevels(currentJilid, 12)
      .then((result) => {
        if (alive) setLevels(result);
      })
      .finally(() => {
        if (alive) setIsLoadingLevels(false);
      });
    return () => {
      alive = false;
    };
  }, [currentJilid]);

  const { title, subtitle, badgeBg, borderColor } =
    getRhythmMemoryLevelInfo(currentJilid);

  // Audio hooks (dari adapter yang sudah ada)
  const { playCardSound, stopAudio, preloadAudio } = useRhythmMemoryAudio();

  // State permainan
  const [answer, setAnswer] = useState<ArrowType[]>([]);
  const [phase, setPhase] = useState<'idle' | 'listening' | 'answered'>('idle');
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'fail'>('idle');
  const [checkError, setCheckError] = useState<string | null>(null);
  const [levelIndex, setLevelIndex] = useState(0);

  // Bikin level dari adapter
  const levelItems = levels[levelIndex] ?? [];
  const representativeItem = levelItems.find(
    (item) => item.audioUrl && item.patternType !== '1-datar',
  ) ?? levelItems[0];

  // Pola yang benar (murni dari data adapter)
  const correctPattern = useMemo(() => {
    if (representativeItem?.patternType) {
      return patternTypeToArrows(representativeItem.patternType);
    }
    return [];
  }, [representativeItem]);

  // Audio yang diputar saat level dimuat/dirubah
  const audioUrl = representativeItem?.audioUrl ?? null;
  const audioBpm = representativeItem?.bpm ?? 65;
  const audioBeatsCount = representativeItem?.beatsCount ?? 2;
  const audioTone = getBaseTone(representativeItem?.patternType ?? '1-datar');

  // Reset level
  const resetLevel = useCallback(() => {
    stopAudio();
    triggerBibiReaction('click');
    soundManager.playSfx('pop');
    setAnswer([]);
    setPhase('idle');
    setFeedback('idle');
    setCheckError(null);
  }, [stopAudio]);

  // Ketika jilid berubah -> reset ke level 0
  const prevJilidRef = React.useRef(currentJilid);
  React.useEffect(() => {
    if (currentJilid !== prevJilidRef.current) {
      prevJilidRef.current = currentJilid;
      resetLevel();
      setLevelIndex(0);
      void preloadAudio();
    }
  }, [currentJilid, resetLevel, preloadAudio]);

  // Preload audio saat mount
  React.useEffect(() => {
    void preloadAudio();
  }, [preloadAudio]);

  // Putar audio sesuai audioUrl yang ada
  const handlePlayAudio = useCallback(() => {
    if (phase !== 'idle' && phase !== 'answered') return;
    stopAudio();
    triggerBibiReaction('play');
    void playCardSound({
      audioUrl,
      tone: audioTone,
      bpm: audioBpm,
      beatsCount: audioBeatsCount,
    });
    setPhase('listening');
    setFeedback('idle');
  }, [audioUrl, audioTone, audioBpm, audioBeatsCount, playCardSound, stopAudio]);

  // Tambah panah ke kotak jawaban
  const handleAddArrow = useCallback(
    (arrow: ArrowType) => {
      if (phase !== 'idle') return;
      setAnswer((prev) => [...prev, arrow]);
    },
    [phase]
  );

  // Hapus panah terakhir
  const handleRemoveArrow = useCallback(() => {
    if (phase !== 'idle') return;
    setAnswer((prev) => prev.slice(0, -1));
    setFeedback('idle');
  }, [phase]);

  // Periksa jawaban
  const handleCheck = useCallback(() => {
    if (phase !== 'idle') return;
    if (answer.length === 0) {
      setCheckError('Belum ada jawaban. Tambah panah dari bank panah dulu.');
      setFeedback('fail');
      return;
    }
    setCheckError(null);
    if (JSON.stringify(answer) === JSON.stringify(correctPattern)) {
      triggerBibiReaction('success');
      setPhase('answered');
      setFeedback('success');
    } else {
      triggerBibiReaction('error');
      setPhase('answered');
      setFeedback('fail');
    }
  }, [answer, correctPattern, phase]);

  // Main lagi (reset semua)
  const handleResetAll = useCallback(() => {
    resetLevel();
    setLevelIndex(0);
  }, [resetLevel]);

  const isCorrect = feedback === 'success';
  const isWrong = feedback === 'fail';

  return (
    <NgajiCeriaLayout
      title="Rhythm Memory - Jilid"
      hideHeader={true}
      themeScope="lab-irama"
      onBack={() => navigate('/member/ngaji-ceria/training')}
    >
      <div className="relative min-h-[100dvh] w-full bg-[#F0FDF4] overflow-x-hidden pb-44 sm:pb-48 select-none">
        {/* Latar belakang mint (hard shadow, bright) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, #ECFDF5 0, transparent 70%)',
          }}
        />

        <div className="relative z-20">
          {/* Header eksplorasi */}
          <ExploreHeader
            title={`Kenangan Irama - Jilid ${currentJilid}`}
            subtitle={subtitle}
            onBack={() => navigate('/member/ngaji-ceria/training')}
            themeScope="lab-irama"
            themeColorClass="bg-[#064e3b]"
            borderColorClass="border-[#34d399]"
            shadowClass="shadow-[0_4px_0px_#022c22]"
            textColorClass="text-[#fef3c7]"
            backClass="bg-[#fef3c7] text-[#064e3b] border-[#34d399] shadow-[2px_2px_0px_#022c22] hover:bg-[#fde68a]"
            extraBadge={
              <ExploreStatBadge
                icon={<StarSvg size={16} />}
                value={`Level ${levelIndex + 1} / ${levels.length}`}
                title={`Level ${levelIndex + 1} dari ${levels.length}`}
                className="bg-[#fef3c7] text-[#064e3b] border-[#34d399] shadow-[2px_2px_0px_#022c22]"
              />
            }
          />

          {/* HUD level & score */}
          <section className="px-4 pt-3 max-w-xl mx-auto">
            <div className="flex items-center justify-between rounded-2xl bg-white border-[3px] border-[#134E4A] px-3 py-2 shadow-[4px_4px_0px_#134E4A]">
              <div className="flex items-center gap-2 text-[13px] font-black text-[#134E4A]">
                <span className={`w-2.5 h-2.5 rounded-full ${badgeBg}`} />
                {title}
              </div>
              <div className="flex items-center gap-2 text-[13px] font-black text-[#134E4A]">
                <span className="flex items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${borderColor}`} />
                  Level {levelIndex + 1} / {levels.length}
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${feedback === 'success' ? 'bg-[#16A34A]' : feedback === 'fail' ? 'bg-[#FF6B6B]' : 'bg-[#F59E0B]'}`}
                  />
                  <span className="font-bold">{answer.length} / {correctPattern.length}</span>
                </span>
              </div>
            </div>

            {/* Pita hint */}
            <div className="mt-2 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-white border-[3px] border-[#134E4A] text-[11px] font-black text-[#64748B] shadow-[3px_3px_0px_#134E4A]">
                {checkError ?? 'Temukan urutan panah dari suara iramanya.'
                }
              </span>
            </div>
          </section>

          {/* 1) PUTAR AUDIO */}
          <section className="px-4 pt-4 max-w-xl mx-auto">
            <button
              type="button"
              onClick={handlePlayAudio}
              disabled={
                phase === 'listening' || !audioUrl && correctPattern.length === 0
              }
              className={`
                inline-flex items-center justify-center gap-3
                w-full rounded-2xl border-[3px] border-[#0D9488] bg-[#0D9488] px-6 py-4 font-black text-white shadow-[4px_4px_0px_#0D9488]
                active:translate-y-[2px] active:shadow-none
                disabled:cursor-not-allowed disabled:opacity-60
                transition-all hover:scale-[1.02]
              `}
            >
              <span className="text-3xl">▶</span>
              <span>
                {phase === 'listening'
                  ? 'Mengputar...'
                  : audioUrl
                  ? 'Putar Audio Irama'
                  : 'Sinetron (sinyal)'}
              </span>
              {phase === 'listening' && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </button>
            {!audioUrl && levelItems.length > 0 && (
              <p className="mt-2 text-center text-[11px] font-black text-[#64748B]">
                Audio belum tersedia. Menampilkan pola dari data level.
              </p>
            )}
          </section>

          {/* 2) KOTAK JAWABAN */}
          <section className="px-4 pt-2 max-w-xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                Kotak Jawaban
              </span>
              <div
                className={`flex flex-wrap items-center justify-center gap-2 rounded-2xl border-[3px] p-3 shadow-[4px_4px_0px_#134E4A] transition-all ${
                  feedback === 'fail'
                    ? 'border-[#FF6B6B] bg-[#FFF0F0] shadow-[4px_4px_0px_#FF6B6B]'
                    : feedback === 'success'
                    ? 'border-[#16A34A] bg-[#DCFCE7] shadow-[4px_4px_0px_#16A34A]'
                    : 'border-[#134E4A] bg-white'
                }`}
                aria-label="Kotak jawaban"
              >
                {answer.length === 0 ? (
                  <span className="text-xs font-black text-[#9CA3AF]">
                    Belum ada jawaban. Klik panah di bawah.
                  </span>
                ) : (
                  answer.map((arrow, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-[3px] border-[#134E4A] font-black text-sm shadow-[3px_3px_0px_#134E4A] ${
                        ARROW_COLOR_CLASS[arrow]
                      }`}
                    >
                      <span className={`text-lg leading-none ${ARROW_COLOR_CLASS[arrow]}`}>
                        {ARROW_SYMBOL[arrow]}
                      </span>
                      <span className="text-[10px] font-black text-white/80">{ARROW_LABEL[arrow]}</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* 3) BANK PANAH */}
          <section className="px-4 pt-2 pb-4 max-w-xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                Bank Panah
              </span>
              <PatternArrowButton
                type={('datar' as PatternType)}
                onClick={() => handleAddArrow('datar')}
                disabled={phase !== 'idle'}
              />
              <PatternArrowButton
                type={('naik' as PatternType)}
                onClick={() => handleAddArrow('naik')}
                disabled={phase !== 'idle'}
              />
              <PatternArrowButton
                type={('turun' as PatternType)}
                onClick={() => handleAddArrow('turun')}
                disabled={phase !== 'idle'}
              />
            </div>
          </section>

          {/* 4) KONTROL */}
          <section className="px-4 pb-2 max-w-xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRemoveArrow}
                disabled={answer.length === 0 || phase !== 'idle'}
                className="inline-flex items-center gap-1.5 rounded-xl border-[3px] border-[#FF6B6B] bg-[#FF6B6B] px-4 py-2.5 font-black text-white shadow-[4px_4px_0px_#FF6B6B] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 transition-all hover:scale-[1.02]"
              >
                <span className="text-lg">⌫</span>
                <span className="text-xs font-black">Hapus</span>
              </button>

              <button
                type="button"
                onClick={handleCheck}
                disabled={
                  phase !== 'idle' ||
                  answer.length !== correctPattern.length ||
                  correctPattern.length === 0
                }
                className="inline-flex items-center gap-1.5 rounded-xl border-[3px] border-[#0D9488] bg-[#0D9488] px-5 py-2.5 font-black text-white shadow-[4px_4px_0px_#0D9488] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 transition-all hover:scale-[1.02]"
              >
                <span className="text-lg">✓</span>
                <span className="text-sm font-black">Periksa Jawaban</span>
              </button>

              {phase === 'answered' && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1.5 rounded-xl border-[3px] border-[#0D9488] bg-[#0D9488] px-5 py-2.5 font-black text-white shadow-[4px_4px_0px_#0D9488] active:translate-y-[2px] active:shadow-none transition-all hover:scale-[1.02]"
                >
                  <span className="text-lg">↺</span>
                  <span className="text-sm font-black">Coba Lagi</span>
                </button>
              )}
            </div>

            {/* Navigasi level */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setLevelIndex((i) => Math.max(0, i - 1))}
                disabled={levelIndex === 0}
                className="inline-flex items-center gap-1 rounded-xl border-[3px] border-[#64748B] bg-white px-3 py-1.5 font-black text-[#374151] shadow-[2px_2px_0px_#64748B] disabled:cursor-not-allowed disabled:opacity-40 transition-all hover:bg-[#F9FAFB]"
              >
                <span className="text-base">‹</span>
                <span className="text-xs font-black">Sebelum</span>
              </button>
              <button
                type="button"
                onClick={() => setLevelIndex((i) => Math.min(levels.length - 1, i + 1))}
                disabled={levelIndex >= levels.length - 1}
                className="inline-flex items-center gap-1 rounded-xl border-[3px] border-[#64748B] bg-white px-3 py-1.5 font-black text-[#374151] shadow-[2px_2px_0px_#64748B] disabled:cursor-not-allowed disabled:opacity-40 transition-all hover:bg-[#F9FAFB]"
              >
                <span className="text-base">›</span>
                <span className="text-xs font-black">Berikutnya</span>
              </button>
            </div>
          </section>

          {/* Feedback benar/salah */}
          <AnimatePresence>
            {isCorrect ? (
              <div className="px-4 pb-6 max-w-xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-[#16A34A] bg-[#DCFCE7] px-5 py-4 text-center shadow-[4px_4px_0px_#16A34A] spring">
                  <span className="text-4xl">✅</span>
                  <span className="text-[13px] font-black text-[#16A34A]">
                    Benar! Irama {correctPattern.join(' → ')} berhasil.
                  </span>
                </div>
              </div>
            ) : isWrong ? (
              <div className="px-4 pb-6 max-w-xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-[#FF6B6B] bg-[#FFF0F0] px-5 py-4 text-center shadow-[4px_4px_0px_#FF6B6B] shake">
                  <span className="text-4xl">❌</span>
                  <span className="text-[13px] font-black text-[#991B1B]">
                    Salah. Ulangi dari nol (Coba Lagi).
                  </span>
                </div>
              </div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Bottom Sheet Feedback Jawaban */}
        <AnswerFeedbackSheet
          isOpen={phase === 'answered'}
          isCorrect={isCorrect}
          onNext={() => {
            if (levelIndex < levels.length - 1) {
              setLevelIndex((i) => i + 1);
              resetLevel();
            } else {
              navigate('/member/ngaji-ceria/training');
            }
          }}
          onRetry={resetLevel}
          onReset={resetLevel}
          onClose={() => setPhase('idle')}
        />
      </div>
    </NgajiCeriaLayout>
  );
}
