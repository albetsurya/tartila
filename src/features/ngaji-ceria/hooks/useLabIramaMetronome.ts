import { useEffect, useRef, useState, useCallback } from 'react';
import { soundManager } from '../services/soundManager';

type BeatCallback = (beat: number, isDownbeat: boolean) => void;

let sharedAudioContext: AudioContext | null = null;
let isAudioPreloaded = false;

/**
 * Pre-loading AudioContext dan SoundManager agar tidak ada delay (latency)
 * saat audio qari atau metronom pertama kali dibunyikan oleh anak.
 */
export async function preloadLabIramaAudio(): Promise<AudioContext | null> {
  if (typeof window === 'undefined') return null;

  try {
    if (!sharedAudioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        sharedAudioContext = new AudioCtx();
      }
    }

    if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
      await sharedAudioContext.resume();
    }

    // Pre-warm Web Audio buffer soundManager (SFX yang sering digunakan di Lab Irama)
    if (!isAudioPreloaded) {
      isAudioPreloaded = true;
      void soundManager.playSfx('tap', 0.001); // ultra-low volume warm-up
    }

    return sharedAudioContext;
  } catch (err) {
    console.warn('preloadLabIramaAudio: AudioContext resume warning', err);
    return null;
  }
}

/**
 * Membunyikan suara detak (tick) metronom prosedural sine wave.
 * Downbeat (ketukan ke-1) bernada lebih tinggi (880 Hz) dibanding ketukan lain (660 Hz),
 * selaras dengan struktur irama 1-2-3 Rost Tilawati.
 */
function playMetronomeTick(context: AudioContext, time: number, isDownbeat: boolean): void {
  try {
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isDownbeat ? 880 : 660, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.09, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);

    osc.connect(gain).connect(context.destination);
    osc.start(time);
    osc.stop(time + 0.05);
  } catch {
    // Ignore audio context error if closed
  }
}

export interface UseLabIramaMetronomeOptions {
  active: boolean;
  bpm: number;
  soundEnabled?: boolean;
  beatsPerCycle?: number; // default 3 (sesuai siklus irama Rost Tilawati: Datar, Naik, Turun)
  onBeat?: BeatCallback;
}

export function useLabIramaMetronome({
  active,
  bpm,
  soundEnabled = true,
  beatsPerCycle = 3,
  onBeat,
}: UseLabIramaMetronomeOptions) {
  const [beatProgress, setBeatProgress] = useState(0);
  const [beatCount, setBeatCount] = useState(0);
  const [currentBeatInCycle, setCurrentBeatInCycle] = useState(1);

  const callbackRef = useRef(onBeat);
  const bpmRef = useRef(bpm);
  const soundRef = useRef(soundEnabled);
  const cycleRef = useRef(beatsPerCycle);

  callbackRef.current = onBeat;
  bpmRef.current = Math.max(50, Math.min(120, bpm));
  soundRef.current = soundEnabled;
  cycleRef.current = beatsPerCycle;

  // Pasang listener interaksi pertama untuk preload AudioContext
  useEffect(() => {
    const handleFirstTouch = () => {
      void preloadLabIramaAudio();
    };

    window.addEventListener('pointerdown', handleFirstTouch, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstTouch, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
  }, []);

  useEffect(() => {
    if (!active) {
      setBeatProgress(0);
      return;
    }

    // Bangun AudioContext
    let context = sharedAudioContext;
    if (!context) {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        context = new AudioCtx();
        sharedAudioContext = context;
      }
    }

    if (context && context.state === 'suspended') {
      void context.resume();
    }

    let animationFrameId = 0;
    let localBeat = 0;
    const startTime = context?.currentTime ?? performance.now() / 1000;
    let nextBeatAt = startTime;
    let beatStartedAt = startTime;

    const frame = () => {
      const now = context?.currentTime ?? performance.now() / 1000;
      const beatDuration = 60 / bpmRef.current;

      if (now >= nextBeatAt) {
        while (now >= nextBeatAt) {
          localBeat += 1;
          const beatInCycle = ((localBeat - 1) % cycleRef.current) + 1;
          const isDownbeat = beatInCycle === 1;

          if (soundRef.current && !soundManager.muted && context) {
            playMetronomeTick(context, nextBeatAt, isDownbeat);
          }

          callbackRef.current?.(localBeat, isDownbeat);
          nextBeatAt += beatDuration;
          beatStartedAt = nextBeatAt - beatDuration;
        }

        setBeatCount(localBeat);
        setCurrentBeatInCycle(((localBeat - 1) % cycleRef.current) + 1);
      }

      const progress = Math.max(0, Math.min(1, (now - beatStartedAt) / beatDuration));
      setBeatProgress(progress);

      animationFrameId = requestAnimationFrame(frame);
    };

    animationFrameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  const triggerManualTick = useCallback(() => {
    if (sharedAudioContext && soundRef.current && !soundManager.muted) {
      playMetronomeTick(sharedAudioContext, sharedAudioContext.currentTime, true);
    }
  }, []);

  return {
    beatProgress,
    beatCount,
    currentBeatInCycle,
    triggerManualTick,
  };
}
