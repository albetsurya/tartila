const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

const PHRASES = {
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

async function generateSingleAudio(tts, text, filePath, options) {
  return new Promise((resolve, reject) => {
    try {
      const { audioStream } = tts.toStream(text, options);
      const outStream = fs.createWriteStream(filePath);

      audioStream.pipe(outStream);

      outStream.on('close', () => {
        resolve();
      });

      audioStream.on('error', (err) => {
        outStream.destroy();
        reject(err);
      });

      outStream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function generateAudio() {
  const outputDir = path.resolve(__dirname, '../public/audio/tts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const tts = new MsEdgeTTS();
  await tts.setMetadata('id-ID-GadisNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const prosodyOptions = {
    rate: '+15%',
    pitch: '+10Hz',
  };

  console.log('Mulai generate audio TTS menggunakan msedge-tts (id-ID-GadisNeural)...');

  let successCount = 0;
  let totalCount = 0;

  for (const [type, phrases] of Object.entries(PHRASES)) {
    totalCount += phrases.length;
    for (let i = 0; i < phrases.length; i++) {
      const filePath = path.join(outputDir, `${type}-${i}.mp3`);
      const phrase = phrases[i];
      console.log(`[${type}-${i}] Sedang generate: "${phrase}"`);

      try {
        await generateSingleAudio(tts, phrase, filePath, prosodyOptions);
        console.log(`  ✓ Tersimpan: ${type}-${i}.mp3`);
        successCount++;
      } catch (err) {
        console.error(`  ✗ Gagal generate ${type}-${i}.mp3:`, err.message);
      }
    }
  }

  console.log(`\nSelesai! Berhasil menghasilkan ${successCount} dari ${totalCount} file audio.`);
}

generateAudio().catch((err) => {
  console.error('Fatal error saat generate audio:', err);
  process.exit(1);
});
