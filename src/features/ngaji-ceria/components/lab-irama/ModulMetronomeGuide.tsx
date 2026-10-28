import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LAB_IRAMA_GUIDE_LESSONS,
  type GuideLesson,
  type TilawatiTone,
} from '../../data/labIramaData';
import { useLabIramaMetronome } from '../../hooks/useLabIramaMetronome';
import { useLabIramaStore } from '../../hooks/useLabIramaStore';
import { soundManager } from '../../services/soundManager';
import { getAudioUrl } from '../../utils/audioUrl';
import {
  PlaySvg,
  Volume2Svg,
  VolumeXSvg,
  SparklesSvg,
  ArrowRightSvg,
  ArrowUpRightSvg,
  ArrowDownRightSvg,
} from '../../../../components/ui/CustomIcons';

export const ModulMetronomeGuide: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    LAB_IRAMA_GUIDE_LESSONS[0].id
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const preferredBpm = useLabIramaStore((s) => s.preferredBpm);
  const setPreferredBpm = useLabIramaStore((s) => s.setPreferredBpm);
  const metronomeSound = useLabIramaStore((s) => s.metronomeSound);
  const setMetronomeSound = useLabIramaStore((s) => s.setMetronomeSound);

  const activeLesson =
    LAB_IRAMA_GUIDE_LESSONS.find((l) => l.id === selectedLessonId) ||
    LAB_IRAMA_GUIDE_LESSONS[0];

  // Metronom siklus 6 ketukan Tilawati (Ketukan 1-2: Datar, 3-4: Naik, 5-6: Turun)
  const { beatProgress, currentBeatInCycle } = useLabIramaMetronome({
    active: true,
    bpm: preferredBpm,
    soundEnabled: metronomeSound,
    beatsPerCycle: 6,
  });

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

  // Hentikan audio saat ganti pelajaran atau unmount
  useEffect(() => {
    stopTracking();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
    setAudioProgress(0);
  }, [selectedLessonId]);

  useEffect(() => {
    return () => {
      stopTracking();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      stopTracking();
      setIsPlayingAudio(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const resolvedUrl = getAudioUrl(activeLesson.audioUrl) ?? activeLesson.audioUrl;
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

  // Evaluasi nada aktif berdasarkan ketukan siklus (1-2 Datar, 3-4 Naik, 5-6 Turun)
  const activeToneInCycle: TilawatiTone =
    currentBeatInCycle <= 2 ? 'Datar' : currentBeatInCycle <= 4 ? 'Naik' : 'Turun';

  // Ketinggian pantulan bola dinamis sesuai standar siklus Tilawati:
  // - Ketukan 1-2 (Datar): Pantulan stabil/tinggi sedang (42px)
  // - Ketukan 3-4 (Naik): Pantulan lebih tinggi/peak (66px)
  // - Ketukan 5-6 (Turun): Pantulan melandai/rendah (24px)
  const bounceAmplitude =
    activeToneInCycle === 'Datar' ? 44 : activeToneInCycle === 'Naik' ? 66 : 24;

  const bounceY = -Math.sin(beatProgress * Math.PI) * bounceAmplitude;
  const bounceScale = 1 + Math.sin(beatProgress * Math.PI) * 0.18;

  // Warna bola sesuai nada aktif
  const ballBg =
    activeToneInCycle === 'Datar'
      ? 'bg-[#38BDF8]'
      : activeToneInCycle === 'Naik'
      ? 'bg-[#FACC15]'
      : 'bg-[#FB7185]';
  const ballBorder = 'border-[#134E4A]';

  // Words breakdown untuk karaoke text
  const lessonTokens = activeLesson.arabic.trim().split(/\s+/).filter(Boolean);
  const nonPunctuationTokens = lessonTokens.filter((t) => t !== '·' && t !== '=');
  const activeWordIdx =
    isPlayingAudio && nonPunctuationTokens.length > 0
      ? Math.min(
          nonPunctuationTokens.length - 1,
          Math.floor(audioProgress * nonPunctuationTokens.length)
        )
      : -1;
  let wordCounter = 0;

  return (
    <div className="space-y-4">
      {/* 1. Selector Pelajaran */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {LAB_IRAMA_GUIDE_LESSONS.map((lesson) => {
          const isSelected = lesson.id === activeLesson.id;
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl border-2 font-display font-black text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FEF08A] text-[#134E4A] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] scale-[1.02]'
                  : 'bg-white text-[#134E4A]/80 border-[#134E4A]/40 hover:border-[#134E4A]'
              }`}
            >
              {lesson.title}
            </button>
          );
        })}
      </div>

      {/* 2. Visual Bouncing Ball & Runway Ketukan Siklus Tilawati */}
      <div className="relative overflow-hidden rounded-3xl border-[3px] border-[#134E4A] bg-[#FEF9C3] p-5 shadow-[4px_4px_0px_#134E4A] text-center">
        {/* Header Visual */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#134E4A] text-xs font-black border-2 border-[#134E4A]">
            <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-ping" />
            Ketukan ke-{currentBeatInCycle} dari 6
          </span>

          {/* Label Dinamis Nada Aktif */}
          <span
            className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black border-2 transition-all ${
              activeToneInCycle === 'Datar'
                ? 'bg-sky-100 text-sky-800 border-sky-400'
                : activeToneInCycle === 'Naik'
                ? 'bg-amber-100 text-amber-800 border-amber-400'
                : 'bg-rose-100 text-rose-800 border-rose-400'
            }`}
          >
            <span>Nada:</span>
            <span className="inline-flex items-center gap-1">
              {activeToneInCycle === 'Datar' ? (
                <>
                  <span>Datar...</span>
                  <ArrowRightSvg size={14} />
                </>
              ) : activeToneInCycle === 'Naik' ? (
                <>
                  <span>Naik...</span>
                  <ArrowUpRightSvg size={14} />
                </>
              ) : (
                <>
                  <span>Turun...</span>
                  <ArrowDownRightSvg size={14} />
                </>
              )}
            </span>
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMetronomeSound(!metronomeSound)}
              aria-label={metronomeSound ? 'Heningkan Metronom' : 'Bunyikan Metronom'}
              className="p-1.5 rounded-xl bg-white border-2 border-[#134E4A] text-[#134E4A] shadow-[1px_1px_0px_#134E4A] active:scale-95 transition-transform cursor-pointer"
            >
              {metronomeSound ? <Volume2Svg size={16} /> : <VolumeXSvg size={16} />}
            </button>
          </div>
        </div>

        {/* Area Bola Memantul (Bouncing Ball Stage) */}
        <div className="relative h-32 flex items-end justify-center pb-2">
          {/* Bola Bouncing Motion */}
          <div
            className="absolute z-10 flex flex-col items-center pointer-events-none"
            style={{
              transform: `translateY(${bounceY}px) scale(${bounceScale})`,
              transition: 'transform 0.04s linear',
            }}
          >
            <div
              className={`w-12 h-12 rounded-full border-[3px] ${ballBorder} ${ballBg} flex items-center justify-center text-[#134E4A] font-black text-xs shadow-[2px_2px_0px_#134E4A]`}
            >
              <span className="inline-flex items-center">
                {activeToneInCycle === 'Datar' ? (
                  <ArrowRightSvg size={20} />
                ) : activeToneInCycle === 'Naik' ? (
                  <ArrowUpRightSvg size={20} />
                ) : (
                  <ArrowDownRightSvg size={20} />
                )}
              </span>
            </div>
            {/* Bayangan bola di lantai */}
            <div
              className="w-10 h-2 rounded-full bg-[#0D9488]/20 mt-1"
              style={{
                transform: `scale(${Math.max(0.3, 1 - Math.abs(bounceY) / 75)})`,
                opacity: Math.max(0.2, 1 - Math.abs(bounceY) / 60),
              }}
            />
          </div>

          {/* Runway / Tumpuan 3 Tahap Siklus Tilawati (6 Ketukan: 1-2 Datar, 3-4 Naik, 5-6 Turun) */}
          <div className="w-full max-w-sm grid grid-cols-3 gap-2 sm:gap-3 pt-6 border-t-2 border-[#134E4A]/30">
            {[
              {
                stage: 1,
                beats: [1, 2],
                tone: 'Datar',
                label: '1-2 Datar',
                icon: <ArrowRightSvg size={14} />,
                desc: 'Stabil',
                color: 'bg-sky-400',
              },
              {
                stage: 2,
                beats: [3, 4],
                tone: 'Naik',
                label: '3-4 Naik',
                icon: <ArrowUpRightSvg size={14} />,
                desc: 'Meninggi',
                color: 'bg-amber-400',
              },
              {
                stage: 3,
                beats: [5, 6],
                tone: 'Turun',
                label: '5-6 Turun',
                icon: <ArrowDownRightSvg size={14} />,
                desc: 'Melandai',
                color: 'bg-rose-400',
              },
            ].map((p) => {
              const isHit = p.beats.includes(currentBeatInCycle);
              return (
                <div
                  key={p.stage}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl border-2 transition-all ${
                    isHit
                      ? `${p.color} border-[#134E4A] text-[#134E4A] font-black scale-105 shadow-[2px_2px_0px_#134E4A]`
                      : 'bg-white/80 border-[#134E4A]/40 text-[#134E4A]/60'
                  }`}
                >
                  <span className="text-xs font-black inline-flex items-center gap-1">{p.label} {p.icon}</span>
                  <span className="text-[10px] font-bold">({p.desc})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keterangan Karakteristik Nada */}
        <div className="mt-2 text-center">
          <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-0.5 rounded-full border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
            {activeToneInCycle === 'Datar' ? (
              <>
                <ArrowRightSvg size={12} />
                <span>NADA DATAR (Ketukan 1-2): Suara lurus, stabil, dan tenang.</span>
              </>
            ) : activeToneInCycle === 'Naik' ? (
              <>
                <ArrowUpRightSvg size={12} />
                <span>NADA NAIK (Ketukan 3-4): Intonasi meninggi ke puncak baris.</span>
              </>
            ) : (
              <>
                <ArrowDownRightSvg size={12} />
                <span>NADA TURUN (Ketukan 5-6): Alunan melandai ke bawah menutup bait.</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* 3. Kartu Teks Arab & Audio Player dengan Karaoke Highlight */}
      <div className="bg-white border-[3px] border-[#134E4A] rounded-3xl p-5 shadow-[4px_4px_0px_#134E4A] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#134E4A]/20 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0D9488]/10 text-[#0D9488]">
              {activeLesson.subtitle}
            </span>
            <h3 className="font-display font-black text-base text-[#134E4A] mt-0.5">
              {activeLesson.title}
            </h3>
          </div>

          <span
            className={`text-xs font-black px-2.5 py-1 rounded-xl border-2 border-[#134E4A] ${
              activeLesson.tone === 'datar'
                ? 'bg-sky-100 text-sky-800'
                : activeLesson.tone === 'naik'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            Rost: {activeLesson.tone.toUpperCase()}
          </span>
        </div>

        {/* Teks Arab Utama dengan Karaoke Effect saat Audio Qari Berjalan */}
        <div className="py-5 px-3 text-center bg-[#F0FDF4] border-2 border-[#134E4A]/20 rounded-2xl">
          <div
            dir="rtl"
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 leading-loose"
          >
            {lessonTokens.map((token, idx) => {
              const isPunctuation = token === '·' || token === '=';
              if (isPunctuation) {
                return (
                  <span
                    key={idx}
                    className="text-gray-400 font-black text-2xl px-1 select-none"
                  >
                    {token}
                  </span>
                );
              }

              const currentWordIdx = wordCounter++;
              const isWordActive = isPlayingAudio && activeWordIdx === currentWordIdx;

              return (
                <span
                  key={idx}
                  className={`font-arabic text-4xl sm:text-5xl font-black transition-all duration-200 px-3 py-1 rounded-2xl ${
                    isWordActive
                      ? 'text-amber-600 scale-110 bg-[#FEF08A] ring-3 ring-amber-400 shadow-[2px_2px_0px_#F59E0B]'
                      : 'text-[#134E4A] scale-100'
                  }`}
                >
                  {token}
                </span>
              );
            })}
          </div>

          <p className="mt-3 text-sm font-black text-[#134E4A]/80 tracking-wider">
            {activeLesson.transliteration}
          </p>
        </div>

        {/* Tips Guru */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF9C3] text-[#713F12] border-2 border-[#EAB308]/40 text-xs font-bold leading-relaxed">
          <SparklesSvg size={16} className="shrink-0 mt-0.5 text-[#CA8A04]" />
          <span>{activeLesson.tips}</span>
        </div>

        {/* Tombol Play Audio Qari */}
        <button
          type="button"
          onClick={toggleAudio}
          className={`w-full py-3.5 px-4 rounded-2xl border-[3px] border-[#134E4A] font-display font-black text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_#134E4A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
            isPlayingAudio
              ? 'bg-[#FF6B6B] text-white animate-pulse'
              : 'bg-[#0D9488] text-white hover:bg-[#0F766E]'
          }`}
        >
          <PlaySvg size={16} />
          {isPlayingAudio ? 'Jeda Audio Qari' : 'Dengarkan Audio Qari Asli'}
        </button>
      </div>

      {/* 4. Pengatur Kecepatan BPM */}
      <div className="bg-white border-[3px] border-[#134E4A] rounded-2xl p-3.5 shadow-[3px_3px_0px_#134E4A] flex items-center justify-between gap-2">
        <span className="font-display font-black text-xs text-[#134E4A]">
          Kecepatan Ketukan:
        </span>

        <div className="flex items-center gap-1.5">
          {[
            { bpm: 65, label: 'Lambat' },
            { bpm: 75, label: 'Normal (75 BPM)' },
            { bpm: 90, label: 'Cepat' },
          ].map((item) => (
            <button
              key={item.bpm}
              type="button"
              onClick={() => setPreferredBpm(item.bpm)}
              className={`px-2.5 py-1 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                preferredBpm === item.bpm
                  ? 'bg-[#0D9488] text-white border-[#134E4A] shadow-[1px_1px_0px_#134E4A]'
                  : 'bg-transparent text-[#134E4A] border-[#134E4A]/30 hover:bg-[#0D9488]/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
