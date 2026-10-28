import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getTilawatiJilidPages,
  TILAWATI_JILID_1_PAGES,
} from '../src/features/ngaji-ceria/data/tilawatiQuizData';
import { resolveTilawatiAudio } from '../src/features/ngaji-ceria/services/tilawatiAudio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicAudioDir = path.join(root, 'public');

export const tests = {
  'TILAWATI datasets contain latest editor audio from timeline edits': async () => {
    // Pre-load jilid 2-6 datasets
    await getTilawatiJilidPages(2);
    await getTilawatiJilidPages(3);

    // Check Jilid 1 Page 1
    const j1h1 = TILAWATI_JILID_1_PAGES[1];
    assert.ok(j1h1, 'Jilid 1 Hal 1 harus ada');
    assert.ok(
      j1h1.questions[0].audioUrl.includes('editor_'),
      `Jilid 1 Hal 1 soal 0 harus memakai audio editor, got: ${j1h1.questions[0].audioUrl}`,
    );

    // Check Jilid 1 Page 19
    const j1h19 = TILAWATI_JILID_1_PAGES[19];
    assert.ok(j1h19, 'Jilid 1 Hal 19 harus ada');
    assert.ok(
      j1h19.questions[0].audioUrl.includes('editor_'),
      `Jilid 1 Hal 19 soal 0 harus memakai audio editor, got: ${j1h19.questions[0].audioUrl}`,
    );

    // Check Jilid 2 Page 1
    const j2h1 = (await getTilawatiJilidPages(2))[1];
    assert.ok(j2h1, 'Jilid 2 Hal 1 harus ada');
    assert.ok(
      j2h1.questions[0].audioUrl.includes('editor_'),
      `Jilid 2 Hal 1 soal 0 harus memakai audio editor, got: ${j2h1.questions[0].audioUrl}`,
    );

    // Check Jilid 3 Page 26
    const j3h26 = (await getTilawatiJilidPages(3))[26];
    assert.ok(j3h26, 'Jilid 3 Hal 26 harus ada');
    assert.ok(
      j3h26.questions[0].audioUrl.includes('editor_'),
      `Jilid 3 Hal 26 soal 0 harus memakai audio editor, got: ${j3h26.questions[0].audioUrl}`,
    );
  },

  'resolveTilawatiAudio resolves latest editor audio': () => {
    const question = TILAWATI_JILID_1_PAGES[19].questions[0];
    const res = resolveTilawatiAudio({
      question,
      jilid: 1,
      pageNumber: 19,
      questionIndex: 0,
    });

    assert.ok(res.url, 'URL audio harus teresolusi');
    assert.ok(
      res.url.includes('editor_'),
      `Audio yang teresolusi harus merupakan klip editor terbaru, got: ${res.url}`,
    );

    // Verify audio file exists on disk
    const filePath = path.join(publicAudioDir, res.url);
    assert.ok(fs.existsSync(filePath), `File audio harus ada di public: ${filePath}`);
  },
};
