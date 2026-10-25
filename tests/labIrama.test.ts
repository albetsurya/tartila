import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import {
  judgeBeatHit,
  classifyRostTone,
  calculateIramaRank,
  HIT_WINDOWS,
} from '../src/features/ngaji-ceria/components/lab-irama/timingJudge.ts';
import { useLabIramaStore } from '../src/features/ngaji-ceria/hooks/useLabIramaStore.ts';
import {
  LAB_IRAMA_EAR_TRAINING_POOL,
  LAB_IRAMA_GUIDE_LESSONS,
  generateEarTrainingSession,
} from '../src/features/ngaji-ceria/data/labIramaData.ts';
import { ModulEarTraining } from '../src/features/ngaji-ceria/components/lab-irama/ModulEarTraining.tsx';
import { ModulMetronomeGuide } from '../src/features/ngaji-ceria/components/lab-irama/ModulMetronomeGuide.tsx';

export const tests = {
  'HIT_WINDOWS mengakomodasi anak-anak sesuai permintaan (Perfect <= 120ms, Good <= 250ms)': () => {
    assert.equal(HIT_WINDOWS.PERFECT, 120);
    assert.equal(HIT_WINDOWS.GOOD, 250);
  },

  'judgeBeatHit: evaluasi timing sesuai toleransi anak-anak': () => {
    // Tepat pada target (0 ms) -> Perfect
    const p1 = judgeBeatHit(0);
    assert.equal(p1.judgment, 'perfect');
    assert.equal(p1.score, 100);

    // 120 ms (tepat batas toleransi) -> Perfect
    const p2 = judgeBeatHit(120);
    assert.equal(p2.judgment, 'perfect');
    assert.equal(p2.score, 100);

    // -120 ms (sedikit lebih awal 120ms) -> Perfect
    const p3 = judgeBeatHit(-120);
    assert.equal(p3.judgment, 'perfect');
    assert.equal(p3.score, 100);

    // 121 ms s.d. 250 ms -> Good
    const g1 = judgeBeatHit(121);
    assert.equal(g1.judgment, 'good');
    assert.equal(g1.score, 60);

    const g2 = judgeBeatHit(250);
    assert.equal(g2.judgment, 'good');
    assert.equal(g2.score, 60);

    const g3 = judgeBeatHit(-250);
    assert.equal(g3.judgment, 'good');
    assert.equal(g3.score, 60);

    // > 250 ms -> Miss
    const m1 = judgeBeatHit(251);
    assert.equal(m1.judgment, 'miss');
    assert.equal(m1.score, 0);

    const m2 = judgeBeatHit(-260);
    assert.equal(m2.judgment, 'miss');
    assert.equal(m2.score, 0);
  },

  'classifyRostTone: mengidentifikasi nada Datar, Naik, dan Turun dari metadata Tilawati': () => {
    assert.equal(classifyRostTone('Rost: Nada Datar'), 'datar');
    assert.equal(classifyRostTone('Rost: Datar'), 'datar');
    assert.equal(classifyRostTone('Rost: Datar — Naik — Turun (3x)'), 'datar');

    assert.equal(classifyRostTone('Rost: Nada Naik'), 'naik');
    assert.equal(classifyRostTone('Rost: Naik'), 'naik');

    assert.equal(classifyRostTone('Rost: Nada Turun'), 'turun');
    assert.equal(classifyRostTone('Rost: Turun'), 'turun');

    assert.equal(classifyRostTone(''), 'datar');
    assert.equal(classifyRostTone(undefined as unknown as string), 'datar');
  },

  'calculateIramaRank: mengembalikan peringkat Islami (Mumtaz, Jayyid Jiddan, Jayyid, Maqbul)': () => {
    assert.equal(calculateIramaRank(95), 'mumtaz');
    assert.equal(calculateIramaRank(90), 'mumtaz');
    assert.equal(calculateIramaRank(80), 'jayyid-jiddan');
    assert.equal(calculateIramaRank(70), 'jayyid');
    assert.equal(calculateIramaRank(50), 'maqbul');
  },

  'useLabIramaStore: mencatat skor, rekor baru, preferensi BPM, dan tab': () => {
    const store = useLabIramaStore.getState();

    // Default BPM & Metronome sound
    assert.equal(store.preferredBpm, 75);
    assert.equal(store.metronomeSound, true);

    // Ganti BPM
    store.setPreferredBpm(90);
    assert.equal(useLabIramaStore.getState().preferredBpm, 90);

    // Ganti Tab
    store.setActiveTab('tap-beat');
    assert.equal(useLabIramaStore.getState().activeTab, 'tap-beat');

    // Catat Ear Training
    const earResult = store.recordEarTraining(80, 80);
    assert.equal(earResult.isNewRecord, true);
    assert.equal(useLabIramaStore.getState().bestEarScore, 80);
    assert.equal(useLabIramaStore.getState().earGamesPlayed >= 1, true);

    // Catat Tap The Beat
    const tapResult = store.recordTapTheBeat(350, 6, 85);
    assert.equal(tapResult.isNewRecord, true);
    assert.equal(useLabIramaStore.getState().bestTapScore, 350);
    assert.equal(useLabIramaStore.getState().tapMaxCombo, 6);
    assert.equal(useLabIramaStore.getState().tapGamesPlayed >= 1, true);
  },

  'LAB_IRAMA_EAR_TRAINING_POOL: sinkronisasi audio, teks Arab, dan kunci nada terverifikasi': () => {
    assert.ok(LAB_IRAMA_EAR_TRAINING_POOL.length >= 20, 'Pool soal harus memiliki minimal 20 soal');

    const counts = { datar: 0, naik: 0, turun: 0 };
    const categoryCounts = { 'siklus-3': 0, 'siklus-2': 0, tunggal: 0 };

    for (const item of LAB_IRAMA_EAR_TRAINING_POOL) {
      assert.ok(item.id, 'ID harus ada');
      assert.ok(item.arabic.trim().length > 0, 'Teks Arab tidak boleh kosong');
      assert.equal(item.arabic, item.arabicText, 'arabicText harus identik dengan arabic (Single Source of Truth)');
      assert.ok(['datar', 'naik', 'turun'].includes(item.tone), 'Tone harus valid');
      assert.equal(item.rostTone.toLowerCase(), item.tone, 'rostTone harus selaras dengan tone');

      // Validasi struktur siklus nada
      assert.ok(Array.isArray(item.siklusNada), 'siklusNada harus berupa array');
      assert.ok(item.siklusNada.length >= 1 && item.siklusNada.length <= 3, 'siklusNada harus memiliki 1-3 nada');

      if (item.category === 'siklus-3') {
        assert.deepEqual(item.siklusNada, ['Datar', 'Naik', 'Turun'], 'Siklus-3 harus Datar - Naik - Turun');
      } else if (item.category === 'siklus-2') {
        assert.deepEqual(item.siklusNada, ['Datar', 'Turun'], 'Siklus-2 harus Datar - Turun');
      } else if (item.category === 'tunggal') {
        assert.equal(item.siklusNada.length, 1, 'Tunggal harus memiliki tepat 1 nada');
      }

      // Verifikasi berkas audio fisik ada di public/
      const diskPath = path.resolve(process.cwd(), `public${item.audioUrl}`);
      assert.ok(fs.existsSync(diskPath), `Audio file harus ada di disk: ${diskPath}`);

      counts[item.tone]++;
      categoryCounts[item.category]++;
    }

    // Pastikan distribusi nada berimbang
    assert.ok(counts.datar >= 5, 'Harus ada minimal 5 soal nada Datar');
    assert.ok(counts.naik >= 5, 'Harus ada minimal 5 soal nada Naik');
    assert.ok(counts.turun >= 5, 'Harus ada minimal 5 soal nada Turun');

    // Pastikan pool memiliki siklus lengkap
    assert.ok(categoryCounts['siklus-3'] >= 5, 'Harus ada minimal 5 soal siklus penuh (3 nada)');
    assert.ok(categoryCounts['siklus-2'] >= 3, 'Harus ada minimal 3 soal siklus pendek (2 nada)');
    assert.ok(categoryCounts.tunggal >= 5, 'Harus ada minimal 5 soal nada tunggal');
  },

  'generateEarTrainingSession: menghasilkan 5 soal seimbang dengan kunci jawaban valid': () => {
    const session = generateEarTrainingSession(5);
    assert.equal(session.length, 5, 'Sesi harus berisi tepat 5 soal');

    const tones = session.map((s) => s.tone);
    assert.ok(tones.includes('datar'), 'Sesi 5 soal wajib memiliki minimal 1 soal nada Datar');
    assert.ok(tones.includes('naik'), 'Sesi 5 soal wajib memiliki minimal 1 soal nada Naik');
    assert.ok(tones.includes('turun'), 'Sesi 5 soal wajib memiliki minimal 1 soal nada Turun');

    // Sesi harus mencakup siklus 3 nada
    const categories = session.map((s) => s.category);
    assert.ok(categories.includes('siklus-3'), 'Sesi harus menyertakan siklus penuh (3 nada)');

    for (const q of session) {
      assert.ok(q.audioUrl, 'Audio URL harus valid');
      assert.ok(q.arabic, 'Teks Arab harus ada');
      assert.equal(q.arabic, q.arabicText, 'arabicText harus selaras');
      assert.ok(q.siklusNada.length >= 1, 'siklusNada harus terisi');
      assert.ok(q.explanation, 'Penjelasan harus ada');
    }
  },

  'LAB_IRAMA_GUIDE_LESSONS: panduan metronom tersinkronisasi dengan berkas audio asli': () => {
    for (const lesson of LAB_IRAMA_GUIDE_LESSONS) {
      const diskPath = path.resolve(process.cwd(), `public${lesson.audioUrl}`);
      assert.ok(fs.existsSync(diskPath), `Audio lesson harus ada di disk: ${diskPath}`);
      assert.ok(lesson.arabic.trim().length > 0, 'Teks Arab lesson tidak boleh kosong');
      assert.ok(['datar', 'naik', 'turun'].includes(lesson.tone), 'Tone lesson harus valid');
    }
  },

  'ModulEarTraining & ModulMetronomeGuide: terdefinisi sebagai fungsi komponen React valid': () => {
    assert.equal(typeof ModulEarTraining, 'function');
    assert.equal(typeof ModulMetronomeGuide, 'function');

    assert.ok(React.isValidElement(React.createElement(ModulEarTraining)));
    assert.ok(React.isValidElement(React.createElement(ModulMetronomeGuide)));
  },
};
