import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tests } from './rhythmMemory.test.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.');
const jiti = createJiti(import.meta.url, { jsx: true, alias: { '@': `${root}/src/` } });

async function run() {
  // Preload all datasets
  const { loadTilawatiDataset } = await jiti.import('./features/ngaji-ceria/data/tilawatiPageDatasets.ts');
  const jilids = [1, 2, 3, 4, 5, 6];
  const results = await Promise.all(jilids.map(j => loadTilawatiDataset(j)));
  console.log('Dataset pages loaded:', results.map(r => Object.keys(r).length).join(', '));

  // Test getRhythmMemoryLevels for jilid 1
  const { getRhythmMemoryLevels } = await jiti.import('./features/ngaji-ceria/utils/tilawatiTrainingDataAdapter.ts');
  const levels = await getRhythmMemoryLevels(1);
  console.log('getRhythmMemoryLevels(1):', levels.map(l => l.length).join(', '));

  // Test getArenaKartuPairs for jilid 1
  const { getArenaKartuPairs } = await jiti.import('./features/ngaji-ceria/utils/tilawatiTrainingDataAdapter.ts');
  const pairs = await getArenaKartuPairs(1, 6);
  console.log('getArenaKartuPairs(1, 6):', pairs.length);
}

run().catch(console.error);
