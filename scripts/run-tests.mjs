import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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
  },
});

const defaultTests = [
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
