import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  JILID_6_AUDIO_FILES,
  getJilid6AudioUrl,
  parseJilid6Ayah,
} from '../src/features/ngaji-ceria/data/tilawatiJilid6Audio';
import { getQuestionAudioUrl } from '../src/features/ngaji-ceria/data/tilawatiAudioQuestionMap';
import { getRawPages, loadJilidPages } from '../src/features/ngaji-ceria/data/TilawatiDataProvider';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function ensureJilid6Loaded(): Promise<void> {
  await loadJilidPages(6);
}

export const tests = {
  'getJilid6AudioUrl menghasilkan URL audio yang berkas-nya ada di disk': async () => {
    await ensureJilid6Loaded();
    let checked = 0;
    for (const [pageStr, files] of Object.entries(JILID_6_AUDIO_FILES)) {
      const page = Number(pageStr);
      files.forEach((file, questionIndex) => {
        if (!file) return;
        const url = getJilid6AudioUrl(6, page, questionIndex, 'بِسْمِ اللّٰهِ');
        assert.ok(url, `URL kosong untuk halaman ${page} soal ${questionIndex}`);
        const filePath = path.join(root, 'public', url);
        assert.ok(fs.existsSync(filePath), `Berkas audio tidak ada: ${filePath}`);
        checked += 1;
      });
    }
    assert.ok(checked > 150, `Terlalu sedikit berkas audio terverifikasi: ${checked}`);
  },

  'getQuestionAudioUrl mengembalikan audio Jilid 6': async () => {
    await ensureJilid6Loaded();
    const pages = getRawPages(6);
    let withAudio = 0;
    let total = 0;
    for (const page of Object.values(pages)) {
      page.questions.forEach((question, questionIndex) => {
        total += 1;
        const url = getQuestionAudioUrl(question, 6, page.pageNumber, questionIndex);
        if (url) withAudio += 1;
      });
    }
    assert.ok(withAudio > 150, `Hanya ${withAudio} dari ${total} soal Jilid 6 yang bersuara`);
    assert.ok(withAudio < total, 'Soal basmalah pembuka tetap tanpa audio');
  },

  'parseJilid6Ayah membaca angka Arab setelah tanda lingkaran': () => {
    assert.equal(parseJilid6Ayah('مَلِكِ النَّاسِ ۙ ○٢'), 2);
    assert.equal(parseJilid6Ayah('اُولٰٓئِكَ يُنَادَوْنَ مِنْ مَّكَانٍ بَعِيْدٍ ○٤٤'), 44);
    assert.equal(parseJilid6Ayah('بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ'), null);
  },

  'getJilid6AudioUrl menolak jilid lain': () => {
    assert.equal(getJilid6AudioUrl(1, 1, 2, 'قُلْ اَعُوْذُ بِرَبِّ النَّاسِ ۙ ○١'), '');
    assert.equal(getJilid6AudioUrl(6, 4, 0, 'الْعَصْرِ'), '');
  },
};
