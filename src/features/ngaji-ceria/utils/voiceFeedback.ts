type FeedbackType = "correct" | "wrong" | "complete";

const PHRASES: Record<FeedbackType, string[]> = {
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

export const playVoiceFeedback = (type: FeedbackType) => {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const texts = PHRASES[type];
  const text = texts[Math.floor(Math.random() * texts.length)];

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";

  // Sedikit lebih lambat agar jelas untuk anak-anak
  utterance.rate = 0.95;
  // Nada lebih tinggi agar terdengar ceria
  utterance.pitch = 1.2;

  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(
    (v) => v.lang === "id-ID" || v.lang.startsWith("id"),
  );
  if (idVoice) utterance.voice = idVoice;

  window.speechSynthesis.speak(utterance);
};
