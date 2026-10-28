import { createJiti } from 'jiti';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src');
const jiti = createJiti(import.meta.url, {
  jsx: true,
  alias: {
    '@': `${root}/..`,
  },
});
const ds = await jiti.import(`${root}/features/ngaji-ceria/data/tilawatiPageDatasets.ts`);
const data = await ds.loadTilawatiDataset(1);
console.log('loadTilawatiDataset(1) pages:', Object.keys(data).length);
for (const [hal, page] of Object.entries(data)) {
  console.log(`  hal ${hal}: ${page.questions.length} questions`);
}
