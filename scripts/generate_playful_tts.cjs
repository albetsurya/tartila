/**
 * Generator Audio Playful TTS untuk Ngaji Ceria (Tartila).
 * Menggunakan Microsoft Edge Speech Read Aloud (Voice: id-ID-GadisNeural).
 * Menghasilkan file audio MP3 terpisah per kalimat di public/audio/tts/
 * 
 * Target file:
 * - correct-0.mp3 s/d correct-9.mp3
 * - wrong-0.mp3 s/d wrong-9.mp3
 * - complete-0.mp3 s/d complete-9.mp3
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// Sec-MS-GEC v2 token implementation
const M = 0xffffffffn;
const SHA256_INITIAL = [0x6a09e667n, 0xbb67ae85n, 0x3c6ef372n, 0xa54ff53an, 0x510e527fn, 0x9b05688cn, 0x1f83d9abn, 0x5be0cd19n];
const SHA256_STATE = [0xfd9fbea2n, 0x91243ce7n, 0xbe499094n, 0xcd2e1e0an, 0x6c006f49n, 0x04bd35abn, 0xfeb0a7e4n, 0x03effbd2n];
const SHA256_SCHEDULE = [0xeb24bf9en, 0x1558691fn, 0xa0c09ee2n, 0x0cfa32ban, 0xa622ee8cn, 0xd1dd9491n, 0xc0dd25a0n, 0xf9e70ab6n, 0xf0c31573n, 0x7058ce4en, 0x7188e606n, 0x00e5ab33n, 0xd258b060n, 0x72766564n];
const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
].map(BigInt);
const SHA256_ADJUSTMENT = 0xc9dc06a7n;
const K_BLOCK = [...K.slice(0, 14), SHA256_ADJUSTMENT, ...K.slice(15)];
const SIGMA0_ADJUSTMENT = 0x059c0b80n;
const SIGMA1_ADJUSTMENT = 0x000b92c0n;
const CS64_COEFFICIENTS = [
  [0xe82e91b1n, 0xb32700d0n], [0x44de24c6n, 0x88dff51dn], [0x3beb65bcn, 0x29514038n], [0xc89c5933n, 0xb328cbdfn],
  [0x8d1ec211n, 0xd405b4d5n], [0x314ef5d5n, 0x26e55f3cn], [0xe92491b1n, 0x607801c6n], [0xf0a5b9d5n, 0x82b2c1fbn],
  [0x06064cf3n, 0xfa51a3dan], [0xda79fa60n, 0x207cc464n], [0xbed20560n, 0x3c3c74f3n], [0x89f9c9f8n, 0xd2d14b61n],
  [0x35fa38c6n, 0xbb04a2c1n], [0xcb49e3c6n, 0xc5626167n],
];
const CS64_FACTOR = 0x82893933n;
const CS64_ADJUSTMENT0 = 0xf2f90b1an;
const CS64_ADJUSTMENT1 = 0x0b1a0000n;

const rol16 = (v) => { v &= M; return ((v << 16n) | (v >> 16n)) & M; };
const rotr = (v, n) => ((v >> n) | (v << (32n - n))) & M;
const sigma0 = (v) => ((v >> 7n) ^ (v << 25n) ^ (v >> 18n) ^ (v << 14n) ^ (v >> 3n)) & M;
const sigma1 = (v) => ((v >> 17n) ^ (v << 15n) ^ (v >> 19n) ^ (v << 13n) ^ (v >> 10n)) & M;
const beWord = (b, o) => (BigInt(b[o]) << 24n) | (BigInt(b[o + 1]) << 16n) | (BigInt(b[o + 2]) << 8n) | BigInt(b[o + 3]);
const beInt = (b) => b.reduce((acc, x) => (acc << 8n) | BigInt(x), 0n);

function rounds(state, words, firstRound = 0) {
  let [a, b, c, d, e, f, g, h] = state;
  const k = firstRound === 14 ? K_BLOCK : K;
  for (let i = firstRound; i < 64; i++) {
    const t1 = h + (rotr(e, 6n) ^ rotr(e, 11n) ^ rotr(e, 25n)) + (g ^ (e & (f ^ g))) + k[i] + words[i];
    const t2 = (rotr(a, 2n) ^ rotr(a, 13n) ^ rotr(a, 22n)) + ((a & b) | (c & (a | b)));
    [a, b, c, d, e, f, g, h] = [(t1 + t2) & M, a, b, c, (d + t1) & M, e, f, g];
  }
  return [a, b, c, d, e, f, g, h];
}

function expand(words, first = 16) {
  for (let i = first; i < 64; i++) {
    words.push((sigma1(words[i - 2]) + words[i - 7] + sigma0(words[i - 15]) + words[i - 16]) & M);
  }
}

function sha256Init(head) {
  const w = [...Array(14).fill(0n), beInt(head.subarray(0, 3)), beInt(head.subarray(3, 7))];
  for (let i = 16; i < 30; i++) {
    let v = SHA256_SCHEDULE[i - 16];
    if (i - 2 >= 14) v += i === 16 ? sigma1(w[i - 2]) ^ SIGMA1_ADJUSTMENT : sigma1(w[i - 2]);
    if (i - 7 >= 14) v += w[i - 7];
    if (i - 15 >= 14) v += i === 29 ? sigma0(w[i - 15]) ^ SIGMA0_ADJUSTMENT : sigma0(w[i - 15]);
    w.push(v & M);
  }
  w.push((sigma1(w[28]) + w[23] + sigma0(w[15]) + w[14] + SHA256_ADJUSTMENT - K[14]) & M);
  expand(w, 31);
  const working = rounds(SHA256_STATE, w, 14);
  return SHA256_INITIAL.map((x, i) => (x + working[i]) & M);
}

function sha256Digest(data) {
  const length = 57 + data.length;
  const padLen = (((55 - length) % 64) + 64) % 64;
  const rest = data.subarray(7);
  const padded = new Uint8Array(rest.length + 1 + padLen + 8);
  padded.set(rest);
  padded[rest.length] = 0x80;
  new DataView(padded.buffer).setBigUint64(padded.length - 8, BigInt(length * 8));
  let state = sha256Init(data.subarray(0, 7));
  for (let o = 0; o < padded.length; o += 64) {
    const w = [];
    for (let j = 0; j < 16; j++) w.push(beWord(padded, o + j * 4));
    expand(w);
    const working = rounds(state, w);
    state = state.map((x, i) => (x + working[i]) & M);
  }
  return state;
}

function wordsLe4Even(data) {
  const padded = new Uint8Array(data.length + ((4 - (data.length % 4)) % 4));
  padded.set(data);
  const view = new DataView(padded.buffer);
  const words = [];
  for (let o = 0; o < padded.length; o += 4) words.push(BigInt(view.getUint32(o, true)));
  if (words.length % 2) words.push(0n);
  return words;
}

const bswap = (v) => ((v & 0xffn) << 24n) | ((v & 0xff00n) << 8n) | ((v >> 8n) & 0xff00n) | (v >> 24n);

function cs64Digest(data, state) {
  const keyA = bswap(state[0]) | 1n;
  const keyB = bswap(state[1]) | 1n;
  const factors = [(keyA * CS64_FACTOR) & M, (keyB * CS64_FACTOR) & M];
  const terms = CS64_COEFFICIENTS.map(([c], i) => (c * factors[i % 2]) & M);
  const offsets = CS64_COEFFICIENTS.map(([, o]) => o);
  const prefixed = new Uint8Array(data.length + 1);
  prefixed.set(data, 1);
  wordsLe4Even(prefixed).forEach((word, i) => {
    let term = word * (i % 2 === 0 ? keyA : keyB);
    let offset = rol16(word) * (i % 2 === 0 ? 0xef0569fbn : 0xc31713dbn);
    if (i === 0) {
      term += CS64_ADJUSTMENT0 * factors[0];
      offset += CS64_ADJUSTMENT1;
    }
    terms.push(term & M);
    offsets.push(offset & M);
  });
  let swapAcc = 0n, swapLast = 0n, st = 0n, acc = 0n;
  for (let i = 0; i < terms.length; i += 2) {
    const x = terms[i], y = terms[i + 1];
    let t = rol16((offsets[i] + x) & M);
    let q = (t * 0x76f50f34n) & M;
    swapAcc += (rol16(q) * 0xc3efea97n + q) & M;
    t = rol16((offsets[i + 1] + y) & M);
    q = (t * 0x1881ce3cn) & M;
    swapLast = (rol16(q) * 0x35bd1ec9n + q) & M;
    swapAcc = (swapAcc + swapLast) & M;
    st = (st * keyA + x) & M;
    st = (rol16(st) * 0xcf98b111n) & M;
    st = (rol16(st) * 0x87085b9fn) & M;
    st = (rol16(st) * 0x12ceb96dn) & M;
    st = (rol16(st) * 0x257e1d83n) & M;
    acc += st;
    t = (st * keyB + y) & M;
    t = (rol16(t) * 0xa27416f5n) & M;
    t = (rol16(t) * 0xd38396ffn) & M;
    st = (rol16((rol16(t) * 0x7c932b89n) & M) * 0xbfa49f69n) & M;
    acc = (acc + st) & M;
  }
  return [swapLast ^ st, swapAcc ^ acc];
}

const hex8 = (v) => v.toString(16).padStart(8, "0").toUpperCase();

function generateSecMsGecV2(trustedClientToken, unixSeconds) {
  let ticks = Math.floor(unixSeconds) + 11644473600;
  ticks -= ticks % 300;
  const data = new TextEncoder().encode(`${BigInt(ticks) * 10000000n}${trustedClientToken}`);
  const state = sha256Digest(data);
  const [c0, c1] = cs64Digest(data, state);
  return `${hex8(bswap(c0))}${hex8(bswap(c1))}-${state.map(hex8).join("")}`;
}

// Konstanta publik protokol Edge Read Aloud. Bukan kredensial, tapi jangan literal di repo publik.
const TRUSTED_TOKEN = process.env.MICROSOFT_TTS_KEY;
if (!TRUSTED_TOKEN) {
  console.error("MICROSOFT_TTS_KEY is not set.");
  process.exit(1);
}

async function synthesizeSentence(text, outputPath) {
  return new Promise((resolve, reject) => {
    const sec = generateSecMsGecV2(TRUSTED_TOKEN, Date.now() / 1000);
    const reqId = crypto.randomUUID().replace(/-/g, "");
    const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}&Sec-MS-GEC=${sec}&Sec-MS-GEC-Version=2-143.0.3650.75&ConnectionId=${reqId}`;

    const ws = new WebSocket(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
        "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
      },
    });

    const audioChunks = [];
    let completed = false;

    const timeout = setTimeout(() => {
      if (!completed) {
        completed = true;
        try { ws.close(); } catch {}
        reject(new Error("Timeout synthesis audio (15s)"));
      }
    }, 15000);

    ws.on("open", () => {
      const timestamp = new Date().toISOString();
      const speechConfig = `X-Timestamp:${timestamp}\r\nX-RequestId:${reqId}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
      ws.send(speechConfig);

      const ssml = `X-Timestamp:${timestamp}\r\nX-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="id-ID"><voice name="id-ID-GadisNeural"><prosody rate="+15%" pitch="+10Hz">${text}</prosody></voice></speak>`;
      ws.send(ssml);
    });

    ws.on("message", (data, isBinary) => {
      if (!isBinary) {
        const textMsg = data.toString("utf-8");
        if (textMsg.includes("turn.end")) {
          completed = true;
          clearTimeout(timeout);
          try { ws.close(); } catch {}

          const buffer = Buffer.concat(audioChunks);
          if (buffer.length > 0) {
            fs.writeFileSync(outputPath, buffer);
            resolve(buffer.length);
          } else {
            reject(new Error("Audio stream kosong (0 byte)"));
          }
        }
      } else {
        const buffer = Buffer.from(data);
        const headerLen = buffer.readUInt16BE(0);
        const header = buffer.subarray(2, 2 + headerLen).toString("utf-8");
        if (header.includes("Path:audio")) {
          const audio = buffer.subarray(2 + headerLen);
          audioChunks.push(audio);
        }
      }
    });

    ws.on("error", (err) => {
      if (!completed) {
        completed = true;
        clearTimeout(timeout);
        reject(err);
      }
    });

    ws.on("close", (code) => {
      if (!completed && audioChunks.length === 0) {
        completed = true;
        clearTimeout(timeout);
        reject(new Error(`WebSocket ditutup sebelum audio selesai diterima (code: ${code})`));
      }
    });
  });
}

async function main() {
  const outputDir = path.resolve(__dirname, '../public/audio/tts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("=================================================");
  console.log("  GENERATOR AUDIO PLAYFUL TTS (PER KALIMAT)     ");
  console.log("  Voice: id-ID-GadisNeural | Pitch: +10Hz | Rate: +15%");
  console.log("  Target: public/audio/tts/");
  console.log("=================================================\n");

  let totalGenerated = 0;

  for (const [category, sentences] of Object.entries(PHRASES)) {
    console.log(`\n--- Memproses Kategori: ${category.toUpperCase()} (${sentences.length} kalimat) ---`);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const fileName = `${category}-${i}.mp3`;
      const outputPath = path.join(outputDir, fileName);

      process.stdout.write(`[${i + 1}/${sentences.length}] Menghasilkan ${fileName} ... `);

      try {
        const bytes = await synthesizeSentence(sentence, outputPath);
        console.log(`✓ OK (${(bytes / 1024).toFixed(1)} KB) - "${sentence}"`);
        totalGenerated++;
        // Jeda kecil 200ms agar aman dari rate limiting
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.log(`✗ GAGAL: ${err.message}`);
      }
    }
  }

  console.log("\n=================================================");
  console.log(`  SELESAI! Berhasil membuat ${totalGenerated}/30 file audio.`);
  console.log("=================================================");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
