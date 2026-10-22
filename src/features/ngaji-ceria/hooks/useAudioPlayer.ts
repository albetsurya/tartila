import { useCallback, useEffect, useRef, useState } from "react";

export interface AudioPlayerController {
  isPlaying: boolean;
  currentAudioUrl: string | null;
  currentTime: number;
  duration: number;
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime || 0);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration || 0);
      }
    };

    const handleStop = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleLoadedMetadata);
    audio.addEventListener("ended", handleStop);
    audio.addEventListener("error", handleStop);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleLoadedMetadata);
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

    // Normalisasi ke URL absolut agar perbandingan konsisten (audio.src selalu absolut).
    const targetUrl = new URL(url, window.location.href).href;

    if (audio.src !== targetUrl) {
      // Pause + reset audio lama, lalu muat ulang src baru.
      audio.pause();
      audio.src = url;
      audio.load();
      setCurrentAudioUrl(url);
      setCurrentTime(0);
      setDuration(0);
    } else {
      // Selalu mulai dari awal walaupun URL sama (mencegah posisi melewat).
      audio.currentTime = 0;
      setCurrentTime(0);
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

      const targetUrl = new URL(url, window.location.href).href;
      if (isPlaying && audio.src === targetUrl) {
        pause();
        return;
      }
      // URL berbeda → play() wajib mereset posisi & memuat ulang src.
      play(url);
    },
    [isPlaying, pause, play],
  );

  // Jika audioUrl aktif berubah dari luar, hentikan & reset audio lama
  // yang masih menempel pada elemen (anti "suara nyasar" antar soal).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentAudioUrl === null) return;
    const attachedUrl = new URL(currentAudioUrl, window.location.href).href;
    if (audio.src && audio.src !== attachedUrl) {
      audio.pause();
      audio.removeAttribute("src");
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    } else if (!audio.src) {
      audio.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentAudioUrl]);

  return { isPlaying, currentAudioUrl, currentTime, duration, play, pause, toggle };
}
