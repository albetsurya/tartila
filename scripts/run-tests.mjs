import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Mock localStorage for Node.js test environment (required by zustand persist middleware)
const localStorageMock = {
  store: new Map(),
  getItem: (key) => localStorageMock.store.get(key) ?? null,
  setItem: (key, val) => localStorageMock.store.set(key, val),
  removeItem: (key) => localStorageMock.store.delete(key),
  clear: () => localStorageMock.store.clear(),
};
(globalThis).localStorage = localStorageMock;

// Pre-load timeline edits JSON for test environment (Node.js, not frontend source).
// This populates globalThis.__TILAWATI_TIMELINE_EDITS__ so that the module-level
// constants in tilawatiQuizData.ts are computed with actual timeline data.
const timelineEditsPath = path.join(root, 'public/data/tilawatiTimelineEdits.json');
if (fs.existsSync(timelineEditsPath)) {
  const timelineEdits = JSON.parse(fs.readFileSync(timelineEditsPath, 'utf-8'));
  globalThis.__TILAWATI_TIMELINE_EDITS__ = timelineEdits;
  console.log('[test-runner] timeline edits loaded:', Object.keys(timelineEdits).length, 'keys');
} else {
  console.log('[test-runner] timeline edits file not found at ' + timelineEditsPath);
}

const jiti = createJiti(import.meta.url, {
  jsx: true,
  alias: {
    '@': `${root}/src/`,
    '@/lib/roles': `${root}/src/lib/roles.ts`,
    '@/lib/joinCode': `${root}/src/lib/joinCode.ts`,
    '@/lib/supabase': `${root}/src/lib/supabase.ts`,
    '@/data/learningCatalog': `${root}/src/data/learningCatalog.ts`,
    '@/data/gameAccess': `${root}/src/features/ngaji-ceria/data/gameAccess.ts`,
    '@/services/quizBankService': `${root}/src/services/quizBankService.ts`,
    '@/services/economyApi': `${root}/src/services/economyApi.ts`,
  },
});

// Patch economyApi (named export from economyApi.ts) for test environment
const economyApiPath = path.resolve(root, 'src/services/economyApi.ts');
let moduleNs = null;
let economyApi = null;
if (fs.existsSync(economyApiPath)) {
  try {
    moduleNs = await jiti.import(economyApiPath);
    economyApi = moduleNs?.economyApi ?? null;
    console.log('[test-runner] economyApi loaded:', economyApi ? 'yes' : 'missing');
  } catch (e) {
    console.log('[test-runner] economyApi import failed:', e.message);
  }
} else {
  console.log('[test-runner] economyApi file not found at ' + economyApiPath);
}

if (economyApi?.claimDaily) {
  console.log('[test-runner] patching economyApi.claimDaily & buyItem');
  let dailyClaimCalled = false;
  economyApi.claimDaily = async () => {
    if (dailyClaimCalled) {
      const err = new Error('already claimed today');
      throw err;
    }
    dailyClaimCalled = true;
    return {
      success: true,
      claimed: false,
      coinsAwarded: 10,
      totalCoins: 10,
      coins: 10,
      streak: 1,
      loginStreak: 1,
      date: '2026-10-28',
      lastClaimDate: '2026-10-28',
    };
  };
  economyApi.buyItem = async () => ({
    granted: true,
    already: false,
    coins: 0,
  });
}

const defaultTests = [
  'tests/classroomPassword.test.ts',
  'tests/roles.test.ts',
  'tests/gameAccess.test.ts',
  'tests/economyLimits.test.ts',
  'tests/learningCatalog.test.ts',
  'tests/gameCatalogAdmin.test.ts',
  'tests/monitoring.test.ts',
  'tests/quizBank.test.ts',
  'tests/mascot.test.ts',
  'tests/voucher.test.ts',
  'tests/appTheme.test.ts',
  'tests/referral.test.ts',
  'tests/arenaRooms.test.ts',
  'tests/labIrama.test.ts',
  'tests/tilawatiAudio.test.ts',
  'tests/exploreHeader.test.ts',
  'tests/answerFeedbackSheet.test.ts',
  'tests/tilawatiAdventure.test.ts',
  'tests/quizModelsOverhaul.test.ts',
  'tests/arenaKartu.test.ts',
  'tests/rhythmMemory.test.ts',
  'tests/tilawatiMemory.test.ts',
  'tests/universalGameFramework.test.ts',
];
const requested = process.argv.slice(2);
const entries = requested.length > 0 ? requested : defaultTests;

let failed = 0;

for (const entry of entries) {
  const full = path.join(root, entry);
  try {
    const mod = await jiti.import(full);
    const tests = mod.tests ?? {};
    const names = Object.keys(tests);
    if (names.length === 0) {
      console.log(`？ ${entry}: tidak ada test diekspor`);
      failed += 1;
      continue;
    }
    for (const name of names) {
      try {
        await tests[name]();
        console.log(`✓ ${entry} › ${name}`);
      } catch (error) {
        failed += 1;
        console.log(`✗ ${entry} › ${name}`);
        console.log(`  ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } catch (error) {
    failed += 1;
    console.log(`✗ ${entry}: gagal dimuat`);
    console.log(`  ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log('');
if (failed > 0) {
  console.log(`${failed} test gagal`);
  process.exitCode = 1;
} else {
  console.log('Semua test lulus');
}
