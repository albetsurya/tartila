import { useCallback, useEffect, useRef, useState } from "react";
import { getAudioUrl } from "../utils/audioUrl";

export interface AudioPlayerController {
  isPlaying: boolean;
  isPending: boolean;
  currentAudioUrl: string | null;
  currentTime: number;
  duration: number;
  play: (url: string) => void;
  pause: () => void;
  stop: () => void;
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
  const [isPending, setIsPending] = useState(false);
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

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsPending(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsPending(false);
    };

    const handleWaiting = () => {
      // Buffering bukan berhenti: animasi tetap hidup, hanya tandai memuat.
      setIsPending(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsPending(false);
      setCurrentTime(0);
      setCurrentAudioUrl(null);
    };

    const handleError = () => {
      setIsPlaying(false);
      setIsPending(false);
      setCurrentTime(0);
      setCurrentAudioUrl(null);
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleLoadedMetadata);

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleLoadedMetadata);
      audio.removeAttribute("src");
      audioRef.current = null;
    };
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setIsPending(false);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute("src");
    setIsPlaying(false);
    setIsPending(false);
    setCurrentTime(0);
    setCurrentAudioUrl(null);
  }, []);

  const play = useCallback((url: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    url = getAudioUrl(url) ?? url;

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
    }

    setIsPending(true);
    const result = audio.play();
    if (result && typeof result.catch === "function") {
      result.catch((e: unknown) => {
        // AbortError berarti ada pemutaran lebih baru; jangan sentuh state-nya.
        if (e instanceof Error && e.name === "AbortError") {
          return;
        }
        setIsPlaying(false);
        setIsPending(false);
        console.warn("Gagal memutar audio", e);
      });
    }
  }, []);

  const toggle = useCallback(
    (url: string) => {
      const audio = audioRef.current;
      if (!audio) return;
      url = getAudioUrl(url) ?? url;

      const targetUrl = new URL(url, window.location.href).href;
      if (isPlaying && audio.src === targetUrl) {
        pause();
        return;
      }
      // URL berbeda: play() wajib mereset posisi & memuat ulang src.
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

  return { isPlaying, isPending, currentAudioUrl, currentTime, duration, play, pause, stop, toggle };
}
