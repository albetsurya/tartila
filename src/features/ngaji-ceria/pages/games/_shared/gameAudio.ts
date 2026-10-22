/**
 * Audio pelafalan untuk seluruh game Ngaji Ceria.
 * Sengaja TIDAK memakai aset Tilawati / soundManager Tilawati:
 * - Huruf hijaiyah: Web Speech API (window.speechSynthesis, lang ar-SA).
 * - Ayat Al-Quran: CDN EveryAyah (rekaman Syaikh Mishary Alafasy).
 */

const HIJAIYAH_NAMES: Record<string, string> = {
  "ا": "Alif",
  "ب": "Ba",
  "ت": "Ta",
  "ث": "Tsa",
  "ج": "Jim",
  "ح": "Ha",
  "خ": "Kha",
  "د": "Dal",
  "ذ": "Dzal",
  "ر": "Ra",
  "ز": "Zai",
  "س": "Sin",
  "ش": "Syin",
  "ص": "Shad",
  "ض": "Dhad",
  "ط": "Tha",
  "ظ": "Zha",
  "ع": "Ain",
  "غ": "Ghain",
  "ف": "Fa",
  "ق": "Qaf",
  "ك": "Kaf",
  "ل": "Lam",
  "م": "Mim",
  "ن": "Nun",
  "و": "Wau",
  "ه": "Ha",
  "ء": "Hamzah",
  "ي": "Ya",
};

/** Nama latin huruf (tanpa harakat) — dipakai sebagai teks ucap Web Speech. */
const SENSOR_SIGNS = /[\u064B-\u0655\u0670\u0640]/g;

function resolveLetterName(letter: string): string | null {
  const cleaned = letter.normalize("NFC").replace(SENSOR_SIGNS, "").split(/\s+/)[0];
  if (!cleaned) return null;
  const base = cleaned.slice(0, 1);
  return HIJAIYAH_NAMES[base] ?? null;
}

let activeVerseAudio: HTMLAudioElement | null = null;

export function stopVerseAudio() {
  if (!activeVerseAudio) return;
  const audio = activeVerseAudio;
  activeVerseAudio = null;
  audio.pause();
  audio.removeAttribute("src");
  try {
    audio.load();
  } catch {
    // abaikan: simulasi beban di beberapa browser bisa melempar error noop
  }
}

export function stopLetterAudio() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

/** Hentikan seluruh audio pelafalan (dipanggil saat pause / keluar game). */
export function stopGameAudio() {
  stopLetterAudio();
  stopVerseAudio();
}

/**
 * Lapatkan huruf hijaiyah dengan Web Speech API (lang ar-SA).
 * Contoh: "ا" → "Alif", "ش" → "Syin".
 */
export function playLetterAudio(letter: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const name = resolveLetterName(letter);
  if (!name) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = "ar-SA";
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith("ar"),
    );
    if (arabicVoice) utterance.voice = arabicVoice;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Web Speech tidak tersedia / diblokir browser — cengang token saja.
  }
}

/**
 * Muafalankan satu ayat dari CDN EveryAyah (Alafasy_128kbps).
 * Memanggil stopVerseAudio() lebih dahulu agar tidak ada dua rekaman berlapis.
 */
export function playVerseAudio(surah: number, ayah: number) {
  if (typeof window === "undefined" || typeof Audio === "undefined") return;
  if (!surah || !ayah || surah > 114 || ayah > 300) return;
  stopVerseAudio();
  try {
    const url = `https://everyayah.com/data/Alafasy_128kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`;
    const audio = new Audio(url);
    audio.preload = "auto";
    activeVerseAudio = audio;
    const clear = () => {
      if (activeVerseAudio === audio) activeVerseAudio = null;
    };
    audio.addEventListener("ended", clear);
    audio.addEventListener("error", clear);
    void audio.play().catch(clear);
  } catch {
    // CDN gagal dibuka — cengang token saja, gameplay tetap jalan.
  }
}
