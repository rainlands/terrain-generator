import TerrainGenerator from '../index';
import { mapObjectToBinaries } from '../utils';
import { init } from './visualization';

const generateSeed = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = generateSeed(1, 65536);

console.log(`
  === UPDATE ===
  SEED: ${seed}
`);

const generator = new TerrainGenerator({
  seed,
  height: 50,
  chunkSize: 16,
  caves: {
    // redistribution: 0.4,
    // frequency: 50,
    redistribution: 0,
    frequency: 0,
  },
  surface: {
    redistribution: 5,
    frequency: 120,
    minHeight: 10,
    maxHeight: 90,
  },
});

init(generator);
