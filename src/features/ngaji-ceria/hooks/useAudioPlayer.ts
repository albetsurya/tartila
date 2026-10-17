import { useCallback, useEffect, useRef, useState } from "react";

export interface AudioPlayerController {
  isPlaying: boolean;
  currentAudioUrl: string | null;
  play: (url: string) => void;
  pause: () => void;
  toggle: (url: string) => void;
}

/**
 * Mengelola satu elemen HTMLAudioElement untuk seluruh halaman.
 * Memutar URL baru otomatis menghentikan audio yang sedang berjalan,
 * dan kesalahan pemuatan (error) mengembalikan status ke keadaan berhenti.
 */
export function useAudioPlayer(): AudioPlayerController {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";

    const handleStop = () => setIsPlaying(false);
    audio.addEventListener("ended", handleStop);
    audio.addEventListener("error", handleStop);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleStop);
      audio.removeEventListener("error", handleStop);
      audio.removeAttribute("src");
      audioRef.current = null;
    };
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const play = useCallback((url: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.src !== url) {
      audio.src = url;
      setCurrentAudioUrl(url);
    }

    const result = audio.play();
    if (result && typeof result.then === "function") {
      result.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
    }
  }, []);

  const toggle = useCallback(
    (url: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying && audio.src === url) {
        pause();
        return;
      }
      play(url);
    },
    [isPlaying, pause, play],
  );

  return { isPlaying, currentAudioUrl, play, pause, toggle };
}
