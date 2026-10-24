#!/usr/bin/env node
/**
 * Batch Processing Audio Tilawati — Voice Changer via FFmpeg.
 *
 * Tujuan: mencegah santri menghafal "trek audio" asli dengan membuat varian
 * audio (pitch shift tipis + efek ruangan) untuk SELURUH audio Tilawati.
 *
 * PENTING: file asli TIDAK PERNAH ditimpa. Hasil disimpan terpisah di:
 *   public/audio/tilawati_modified/<struktur yang sama>
 * Frontend memilih folder via toggle "Gunakan Variasi Suara".
 *
 * Pemakaian:
 *   node scripts/process-audio-tilawati.cjs              # proses semua
 *   node scripts/process-audio-tilawati.cjs --dry-run    # hanya hitung & validasi
 *   node scripts/process-audio-tilawati.cjs --workers=8  # paralelisme
 *   node scripts/process-audio-tilawati.cjs --clean      # hapus folder output dulu
 */

const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(ROOT, "public", "audio", "tilawati");
const OUTPUT_DIR = path.join(ROOT, "public", "audio", "tilawati_modified");

// Intensitas modifikasi (natural & tetap jelas).
const PITCH_FACTOR = 1.03; // naik 3% (tanpa mengubah durasi)
const ECHO = "aecho=0.8:0.88:40:0.3"; // gema tipis seperti di kelas/masjid
const AUDIO_FILTER = `asetrate=44100*${PITCH_FACTOR},aresample=44100,atempo=1/${PITCH_FACTOR},${ECHO}`;

function parseArgs(argv) {
  const args = { dryRun: false, workers: 4, clean: false };
  for (const raw of argv.slice(2)) {
    if (raw === "--dry-run") args.dryRun = true;
    else if (raw === "--clean") args.clean = true;
    else if (raw.startsWith("--workers=")) {
      const n = Number(raw.split("=")[1]);
      if (Number.isFinite(n) && n > 0) args.workers = Math.floor(n);
    }
  }
  return args;
}

/** Rekursif kumpulkan semua file .ogg di dalam dir. */
function collectOggFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectOggFiles(full, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".ogg")) {
      out.push(full);
    }
  }
  return out;
}

/** Jalankan ffmpeg untuk satu file; resolve saat sukses, reject saat gagal. */
function processFile(sourcePath) {
  return new Promise((resolve, reject) => {
    const rel = path.relative(SOURCE_DIR, sourcePath);
    const dest = path.join(OUTPUT_DIR, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    const tmp = `${dest}.processing.ogg`;
    const args = [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      sourcePath,
      "-af",
      AUDIO_FILTER,
      "-c:a",
      "libvorbis",
      "-q:a",
      "5",
      tmp,
    ];

    const child = spawn("ffmpeg", args);
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        try {
          if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        } catch {
          /* abaikan */
        }
        reject(new Error(`ffmpeg exit ${code}: ${stderr.trim()}`));
        return;
      }
      try {
        fs.renameSync(tmp, dest);
        resolve(dest);
      } catch (err) {
        reject(err);
      }
    });
  });
}

/** Worker pool sederhana dengan jumlah konkurensi terbatas. */
async function runPool(items, workers, task, onSettled) {
  let index = 0;
  const total = items.length;

  async function worker() {
    while (index < total) {
      const current = items[index];
      index += 1;
      try {
        await task(current);
        onSettled({ ok: true, file: current, done: index, total });
      } catch (err) {
        onSettled({ ok: false, file: current, done: index, total, error: err.message });
      }
    }
  }

  const runners = [];
  const concurrency = Math.max(1, Math.min(workers, total || 1));
  for (let i = 0; i < concurrency; i += 1) runners.push(worker());
  await Promise.all(runners);
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}m ${String(s % 60).padStart(2, "0")}s`;
}

async function main() {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Folder sumber tidak ditemukan: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const files = collectOggFiles(SOURCE_DIR);
  console.log(`Menemukan ${files.length} file .ogg di ${SOURCE_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Filter: ${AUDIO_FILTER}`);

  if (files.length === 0) {
    console.log("Tidak ada file untuk diproses.");
    return;
  }

  if (args.dryRun) {
    console.log(`[DRY-RUN] ${files.length} file akan diproses ke ${OUTPUT_DIR}.`);
    console.log(
      "Contoh:",
      files.slice(0, 3).map((f) => path.relative(ROOT, path.join(OUTPUT_DIR, path.relative(SOURCE_DIR, f)))),
    );
    return;
  }

  if (args.clean && fs.existsSync(OUTPUT_DIR)) {
    console.log(`Menghapus folder output lama: ${OUTPUT_DIR}`);
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }

  console.log(`Memproses audio (workers=${args.workers}) ...`);
  const started = Date.now();
  let okCount = 0;
  let failCount = 0;
  const failures = [];

  await runPool(
    files,
    args.workers,
    (file) => processFile(file),
    (result) => {
      if (result.ok) {
        okCount += 1;
        if (okCount % 100 === 0 || result.done === result.total) {
          const elapsed = Date.now() - started;
          const processed = okCount + failCount;
          const rate = processed / (elapsed / 1000);
          const eta = rate > 0 ? ((result.total - result.done) / rate) * 1000 : 0;
          process.stdout.write(
            `\r  [${result.done}/${result.total}] OK=${okCount} Gagal=${failCount} ` +
              `ETA ${formatTime(eta)}   `,
          );
        }
      } else {
        failCount += 1;
        failures.push({
          file: path.relative(ROOT, result.file),
          error: result.error,
        });
        console.warn(`\n  GAGAL: ${path.relative(ROOT, result.file)} -> ${result.error}`);
      }
    },
  );

  process.stdout.write("\n");
  console.log(`Selesai dalam ${formatTime(Date.now() - started)}.`);
  console.log(`  Berhasil: ${okCount}`);
  console.log(`  Gagal:    ${failCount}`);

  if (failures.length > 0) {
    const reportPath = path.join(ROOT, "scripts", "process-audio-tilawati.failures.json");
    fs.writeFileSync(reportPath, JSON.stringify(failures, null, 2));
    console.log(`Laporan kegagalan: ${reportPath}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Kesalahan tak terduga:", err);
  process.exit(1);
});
