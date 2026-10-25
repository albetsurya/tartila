import { useRef, useCallback } from 'react';
import { preloadLabIramaAudio } from './useLabIramaMetronome';
import { soundManager } from '../services/soundManager';

interface PlayRhythmOptions {
  audioUrl?: string;
  tone?: 'datar' | 'naik' | 'turun';
  bpm?: number;
  beatsCount?: number;
}

export function useRhythmMemoryAudio() {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);

  /**
   * Mainkan nada sintesis Web Audio sesuai nada Rost Tilawati
   * (Datar: ~440Hz / 660Hz, Naik: ~550Hz / 825Hz, Turun: ~330Hz / 495Hz)
   */
  const playSynthesizedMelody = useCallback(
    async (tone: 'datar' | 'naik' | 'turun' = 'datar', beatsCount: number = 2, bpm: number = 65) => {
      try {
        const ctx = await preloadLabIramaAudio();
        if (!ctx) return;
        synthCtxRef.current = ctx;

        const beatDuration = 60 / bpm;
        const now = ctx.currentTime + 0.05;

        // Frekuensi dasar Rost
        let baseFreq = 440; // A4 (Datar)
        if (tone === 'naik') baseFreq = 523.25; // C5 (Naik)
        if (tone === 'turun') baseFreq = 349.23; // F4 (Turun)

        for (let i = 0; i < beatsCount; i++) {
          const beatTime = now + i * beatDuration;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          // Nada sedikit bervariasi jika siklus
          let freq = baseFreq;
          if (tone === 'naik' && i > 0) freq *= 1.15;
          if (tone === 'turun' && i > 0) freq *= 0.88;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, beatTime);

          // Envelope lembut marimba/chime
          gain.gain.setValueAtTime(0.0001, beatTime);
          gain.gain.exponentialRampToValueAtTime(0.18, beatTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, beatTime + beatDuration * 0.85);

          osc.connect(gain).connect(ctx.destination);
          osc.start(beatTime);
          osc.stop(beatTime + beatDuration);
        }
      } catch (err) {
        console.warn('useRhythmMemoryAudio: synth error', err);
      }
    },
    []
  );

  /**
   * Mainkan audio qari jika tersedia; fallback ke synth melody jika tidak
   */
  const playCardSound = useCallback(
    async ({ audioUrl, tone = 'datar', bpm = 65, beatsCount = 2 }: PlayRhythmOptions) => {
      // Hentikan audio sebelumnya jika ada
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
          currentAudioRef.current.currentTime = 0;
        } catch {
          // ignore
        }
        currentAudioRef.current = null;
      }

      // Pastikan AudioContext siap
      await preloadLabIramaAudio();

      if (audioUrl) {
        try {
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          audio.volume = 0.9;

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Jika file audio 404 atau tidak didukung di browser, fallback ke synth
              void playSynthesizedMelody(tone, beatsCount, bpm);
            });
          }
          return;
        } catch {
          // Fallback ke synth
        }
      }

      // Mainkan synth jika tidak ada audioUrl
      void playSynthesizedMelody(tone, beatsCount, bpm);
    },
    [playSynthesizedMelody]
  );

  /**
   * Hentikan pemutaran audio
   */
  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      currentAudioRef.current = null;
    }
  }, []);

  return {
    playCardSound,
    stopAudio,
    preloadAudio: preloadLabIramaAudio,
  };
}
