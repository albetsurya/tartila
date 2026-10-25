/**
 * Script Generator Audio Piper TTS untuk Tartila.
 * 
 * Fungsi:
 * 1. Menghasilkan file audio TTS menggunakan Piper TTS (model id_ID-news_tts)
 * 2. Menyimpan ke public/audio/tts/
 * 3. Memberi instruksi pengguna untuk mengunduh SFX
 * 
 * USER INSTRUCTION:
 * 1. Install Piper TTS: pip install piper-tts
 * 2. Download model id_ID-news_tts dari HuggingFace: https://huggingface.co/rhasspy/piper-tts
 * 3. Letakan file .onnx di folder models/
 * 4. Jalankan: node scripts/generate_tts_audio.js
 * 5. File output akan muncul di public/audio/tts/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const gameAudioPath = path.join(projectRoot, 'src', 'features', 'ngaji-ceria', 'features', 'games', '_shared', 'gameAudio.ts');

// Kalimat yang akan diproduksi audio (sesuai kebutuhan game)
// Berdasarkan gameAudio.ts dan kebutuhan 4 fitur kuis
const sentences = {
  correct: [
    "Jawaban Anda benar! Bagus sekali.",
    "Sempurna! Anda menjawab dengan benar.",
    "Wajar! Jawaban Anda benar.",
    "Luar biasa! Solusi Anda tepat.",
    "Bagus! Jawaban Anda benar.",
  ],
  wrong: [
    "Maaf, jawaban tersebut salah. Coba lagi!",
    "Yah, jawaban tersebut kurang tepat. Coba perhatian lagi.",
    "Tidak ada, jawaban tersebut salah. Coba perhatian soal.",
    "Wajar, jawaban tersebut kurang tepat. Coba perhatian soal.",
    "Maaf, pilihan tersebut salah. Coba jawaban lain.",
  ],
  complete: [
    "Selesai! Anda mengerjakan semua soal.",
    "Sampai! Anda telah menyelesaikan semua tantangan.",
    "Selesai! Tantangan ini telah Anda selesaikan.",
    "Sampai! Anda mengerjakan semua soal dengan baik.",
    "Selesai! Semua soal telah dijawab.",
  ],
};

// Buat folder output
const ttsOutputDir = path.join(projectRoot, 'public', 'audio', 'tts');
const sfxOutputDir = path.join(projectRoot, 'public', 'audio', 'sfx');

if (!fs.existsSync(ttsOutputDir)) {
  fs.mkdirSync(ttsOutputDir, { recursive: true });
}
if (!fs.existsSync(sfxOutputDir)) {
  fs.mkdirSync(sfxOutputDir, { recursive: true });
}

// Tulis kalimat ke file sementara
const tempDir = path.join(projectRoot, 'temp_tts');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Bersihkan file lama
const existingFiles = fs.readdirSync(tempDir);
existingFiles.forEach(file => {
  fs.unlinkSync(path.join(tempDir, file));
});

// Write sentences to temp files (one per line per category)
const sentenceCategories = ['correct', 'wrong', 'complete'];

sentenceCategories.forEach(category => {
  const tempFile = path.join(tempDir, `${category}.txt`);
  const lines = sentences[category].map(s => `"${s}"`).join('\n');
  fs.writeFileSync(tempFile, lines);
  console.log(`✓ Written ${category} sentences (${sentences[category].length} items)`);
});

// Jalankan Piper TTS untuk setiap kategori
const modelPath = path.join(projectRoot, 'models', 'id_ID-news_tts-medium.onnx');
const modelExists = fs.existsSync(modelPath);

if (!modelExists) {
  console.error(`❌ Model TTS tidak ditemukan di: ${modelPath}`);
  console.error('Silakan download model dari: https://huggingface.co/rhasspy/piper-tts');
  console.error('Letakan file id_ID-news_tts-medium.onnx di folder models/');
  process.exit(1);
}

console.log('\n=== Menjalankan Piper TTS generation ===');

sentenceCategories.forEach(category => {
  const tempFile = path.join(tempDir, `${category}.txt`);
  const outputFile = path.join(ttsOutputDir, `${category}-0.mp3`);
  
  try {
    const command = `piper --model "${modelPath}" --output_file "${outputFile}" < "${tempFile}"`;
    execSync(command, { stdio: 'pipe' });
    console.log(`✓ Generated: ${outputFile} (${category})`);
  } catch (error) {
    console.error(`✗ Failed to generate ${category}:`, error.message);
  }
});

// Catatan tentang SFX
console.log('\n=== Catatan SFX ===');
console.log('Silakan unduh file SFX dari Kenney.nl atau OpenGameArt ke:');
console.log(`  ${sfxOutputDir}/`);
const sfxList = ['pop', 'correct', 'wrong', 'click', 'shuffle', 'tap', 'streak', 'powerup', 'victory', 'defeat', 'gameover'];
console.log('File yang dibutuhkan:', sfxList.map(name => `${name}.mp3`).join(', '));
console.log('\nSetelah file SFX terunduh, jalankan build: npm run build');

// Summary
console.log('\n=== Selesai ===');
console.log(`File TTS dihasilkan di: ${ttsOutputDir}`);
console.log(`File SFX silakan tempatkan di: ${sfxOutputDir}`);
console.log('\nLangkah selanjutnya:');
console.log('1. Jalankan: npm run generate:audio');
console.log('2. Unduh SFX dari Kenney.nl ke public/audio/sfx/');
console.log('3. Jalankan: npm run build');