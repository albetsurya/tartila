/**
 * Game Audio Feedback untuk Ngaji Ceria (Tartila).
 * SATU-SATUNYA SUMBER SUARA (Single Source of Truth) untuk voice feedback.
 * 
 * Alur:
 * 1. Primary: Memutar file MP3 statis dari /audio/tts/{type}-{variant}.mp3 (0-9)
 * 2. Fallback: window.speechSynthesis dengan kalimat playful ceria HANYA JIKA MP3 gagal (404/error)
 * 3. SFX: Terpusat menggunakan soundManager
 */

import { soundManager, type SfxName } from '@/features/ngaji-ceria/services/soundManager';

export type FeedbackType = 'correct' | 'wrong' | 'complete';

export const PLAYFUL_PHRASES: Record<FeedbackType, string[]> = {
  correct: [
    "Masya Allah, pintar sekali!",
    "Yeay, jawabanmu tepat! Kamu keren!",
    "Wah, bintang untuk kamu! Benar sekali!",
    "Alhamdulillah, hebat! Ayo lanjut lagi!",
    "Tepat sekali! Masya Allah, anak pintar!",
    "Hebat! Kamu berhasil menjawabnya dengan benar.",
    "Masya Allah, jawabanmu luar biasa!",
    "Tepat! Teruskan semangat belajarnya ya.",
    "Yes! Kamu dapat satu poin lagi!",
    "Pintar! Jawabanmu benar sekali, lanjut ke soal berikutnya yuk!",
  ],
  wrong: [
    "Ups, belum tepat. Tidak apa-apa, ayo coba lagi!",
    "Hampir benar! Kamu pasti bisa, semangat!",
    "Yuk, dengarkan lagi baik-baik. Kamu bisa!",
    "Belum tepat, tapi jangan sedih ya. Coba sekali lagi!",
    "Tidak apa-apa, salah itu bagian dari belajar.",
    "Hampir tepat! Yuk, kita coba pelan-pelan lagi.",
    "Jangan menyerah ya, kamu pasti bisa menjawabnya.",
    "Mari dengarkan lagi, supaya kamu makin paham.",
    "Belum tepat nih. Mau coba sekali lagi?",
    "Tidak apa-apa. Yuk kita coba lagi bersama-sama!",
  ],
  complete: [
    "Masya Allah, luar biasa! Kamu berhasil menyelesaikan semuanya!",
    "Yeay, selesai! Kamu anak yang hebat dan pantang menyerah!",
    "Alhamdulillah, semua soal terjawab! Kamu memang bintang!",
    "Alhamdulillah, kamu sudah menyelesaikan semua soal dengan baik.",
    "Masya Allah, terima kasih sudah belajar dengan sungguh-sungguh hari ini.",
    "Yeay! Semua soal berhasil kamu jawab. Mau main lagi nanti?",
    "Masya Allah, kamu hebat! Sampai jumpa di tantangan berikutnya ya!",
    "Luar biasa! Kamu berhasil menaklukkan semua soal!",
    "Selamat! Kamu sudah menyelesaikan petualangan ini dengan hebat.",
    "Hebat sekali! Kamu mendapatkan banyak bintang hari ini!",
  ],
};

function fallbackToSpeechSynthesis(type: FeedbackType): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const texts = PLAYFUL_PHRASES[type];
    const text = texts[Math.floor(Math.random() * texts.length)];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.2;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(
      (v) => v.lang === 'id-ID' || v.lang.startsWith('id'),
    );
    if (idVoice) utterance.voice = idVoice;

    window.speechSynthesis.speak(utterance);
  } catch {
    // Silent: gameplay tetap berjalan jika audio tidak tersedia
  }
}

/**
 * Memutar suara pujian/feedback suara.
 * Primary: File MP3 acak (0-9) di /audio/tts/
 * Fallback: Web Speech API sintetis jika file tidak ditemukan atau play gagal
 */
export function playVoiceFeedback(type: FeedbackType): void {
  if (typeof window === 'undefined') return;

  const randomIndex = Math.floor(Math.random() * 10);
  const audioPath = `/audio/tts/${type}-${randomIndex}.mp3`;

  try {
    const audio = new Audio(audioPath);
    let handled = false;

    const runFallback = () => {
      if (!handled) {
        handled = true;
        fallbackToSpeechSynthesis(type);
      }
    };

    audio.onerror = runFallback;
    audio.play().catch(runFallback);
  } catch {
    fallbackToSpeechSynthesis(type);
  }
}

/**
 * Memutar SFX game secara non-blocking via soundManager terpusat.
 */
export function playSfx(sfxName: SfxName, volume = 1): void {
  if (typeof window === 'undefined') return;
  try {
    soundManager.playSfx(sfxName, volume);
  } catch {
    // Abaikan jika audio tidak tersedia
  }
}
