/**
 * Script Generator Audio Piper TTS untuk Tartila.
 * 
 * Fungsi:
 * 1. Membaca daftar kalimat dari src/features/ngaji-ceria/features/games/_shared/gameAudio.ts
 * 2. Menulis kalimat-kalimat tersebut ke file temp (satu per baris)
 * 3. Menjalankan perintah Piper TTS untuk menghasilkan file .mp3
 * 
 * USER INSTRUCTION:
 * 1. Pastikan Piper TTS terinstal: pip install piper-tts
 * 2. Download model id_ID-news_tts dari https://huggingface.co/rhasspy/piper-tts
 * 3. Letakan file .onnx di folder yang diketahui (contoh: ./models/id_ID-news_tts-medium.onnx)
 * 4. Jalankan: node scripts/generate_tts_audio.js
 * 5. File output akan muncul di public/audio/tts/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Dapatkan path ke file gameAudio.ts
const projectRoot = path.resolve(__dirname, '..');
const gameAudioPath = path.join(projectRoot, 'src', 'features', 'ngaji-ceria', 'features', 'games', '_shared', 'gameAudio.ts');

// 2. Baca file dan ekstrak kalimat-kalimat pujian
// Pattern mencari fungsi-playVoiceFeedback atau kalimat dalam file
const fileContent = fs.readFileSync(gameAudioPath, 'utf-8');

// Kalimat yang akan diproduksi audio (disediakan secara manual berdasarkan kebutuhan game)
// Ini adalah daftar yang diperlukan untuk fitur-fitur game di Tartila
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

// Buat folder output jika belum ada
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

// Hilangkan file lama di tempDir
const existingFiles = fs.readdirSync(tempDir);
existingFiles.forEach(file => {
  const filePath = path.join(tempDir, file);
  fs.unlinkSync(filePath);
});

// Write sentences to temp files (one per line)
const sentenceCategories = ['correct', 'wrong', 'complete'];

sentenceCategories.forEach(category => {
  const tempFile = path.join(tempDir, `${category}.txt`);
  const lines = sentences[category].map(s => `"${s}"`).join('\n');
  fs.writeFileSync(tempFile, lines);
  console.log(`✓ Written ${category} sentences (${sentences[category].length} items)`);
});

// 3. Jalankan Piper TTS untuk setiap kategori
// Catatan: user perlu memastikan model Piper TTS sudah didownload
const modelPath = path.join(projectRoot, 'models', 'id_ID-news_tts-medium.onnx');
const modelExists = fs.existsSync(modelPath);

if (!modelExists) {
  console.error(`❌ Model TTS tidak ditemukan di: ${modelPath}`);
  console.error('Silakan download model dari: https://huggingface.co/rhasspy/piper-tts');
  console.error('Letakan file id_ID-news_tts-medium.onnx di folder models/');
  process.exit(1);
}

console.log('\\n=== Menjalankan Piper TTS generation ===');

sentenceCategories.forEach(category => {
  const tempFile = path.join(tempDir, `${category}.txt`);
  const outputFile = path.join(ttsOutputDir, `${category}-0.mp3`);
  
  try {
    // Eksekusi perintah Piper TTS
    // --output_format: cepat untuk CPU, kualitas yag cukup
    const command = `piper --model "${modelPath}" --output_file "${outputFile}" < "${tempFile}"`;
    execSync(command, { stdio: 'pipe' });
    console.log(`✓ Generated: ${outputFile} (${category})`);
  } catch (error) {
    console.error(`✗ Failed to generate ${category}:`, error.message);
  }
});

// 4. (Opsional) Copy beberapa file SFX dari sumber eksternal
// User perlu mengunduh SFX dari Kenney.nl atau OpenGameArt
const sfxList = ['pop', 'correct', 'wrong', 'click', 'shuffle', 'tap'];
console.log('\\n=== Catatan SFX ===');
console.log('Silakan unduh file SFX dari Kenney.nl atau OpenGameArt ke:');
console.log(`  ${sfxOutputDir}/`);
console.log('File yang dibutuhkan:', sfxList.map(name => `${name}.mp3`).join(', '));
console.log('\\nSetelah file SFX terunduh, jalankan build: npm run build');

// Summary
console.log('\\n=== Selesai ===');
console.log(`File TTS dihasilkan di: ${ttsOutputDir}`);
console.log(`File SFX silakan tempatkan di: ${sfxOutputDir}`);
console.log('\\nLangkah selanjutnya:');
console.log('1. Jalankan: npm run generate:audio');
console.log('2. Unduh SFX dari Kenney.nl ke public/audio/sfx/');
console.log('3. Jalankan: npm run build');