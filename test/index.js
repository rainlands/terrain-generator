import TerrainGenerator from '../index';
import { mapObjectToBinaries } from '../utils';
// import { init as initVisualization } from './visualization';

const generateSeed = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = generateSeed(1, 65536);

console.log(`
  === UPDATE ===
  SEED: ${seed}
`);

const generator = new TerrainGenerator({
  seed,
  height: 256,
  caves: {
    // redistribution: 0.4,
    // elevation: 50,
    redistribution: 0,
    elevation: 0,
  },
  surface: {
    redistribution: 5,
    elevation: 120,
    minHeight: 128,
    maxHeight: 256,
  },
});

// initVisualization(generator);
