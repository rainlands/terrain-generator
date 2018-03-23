import TerrainGenerator from '../index';
import { mapObjectToBinaries } from '../utils';
import { init as initVisualization } from './visualization';

const generateSeed = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = generateSeed(1, 65536);

console.log(`
  === UPDATE ===
  SEED: ${seed}
`);

const generator = new TerrainGenerator({
  seed,
  size: 100,
  caves: {
    redistribution: 0.3,
    elevation: 100,
  },
  surface: {
    redistribution: 5.5,
    elevation: 120,
    minHeight: 50,
    maxHeight: 150,
  },
});

const map = generator.generateMap();

const mapObjectBinary = mapObjectToBinaries(map);

initVisualization(mapObjectBinary);
