/**
 * Audio pelafalan untuk seluruh game Ngaji Ceria.
 * - Ayat Al-Quran: CDN EveryAyah (rekaman Syaikh Mishary Alafasy).
 */

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

/** Hentikan seluruh audio pelafalan (dipanggil saat pause / keluar game). */
export function stopGameAudio() {
  stopVerseAudio();
}

export function playLetterAudio(_letter: string): void {
  // TTS (Web Speech API) dihapus per policy build; fungsi ringan tanpa aksi.
}

export function stopLetterAudio(): void {
  // TTS (Web Speech API) dihapus per policy build.
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
