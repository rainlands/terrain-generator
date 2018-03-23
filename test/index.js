import TerrainGenerator from '../index';
import { mapObjectToBinaries } from '../utils';

const generateSeed = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = generateSeed(1, 65536);

console.log(`
  === UPDATE ===
  SEED: ${seed}
`);

const generator = new TerrainGenerator({
  seed,
  height: 20,
  chunkSize: 2,
  caves: {
    // redistribution: 0.4,
    // frequency: 50,
    redistribution: 0,
    frequency: 0,
  },
  surface: {
    redistribution: 5,
    frequency: 120,
    minHeight: 5,
    maxHeight: 25,
  },
});

for (let i = 0; i < 10; i++) {
  const { chunks } = generator.updateMap({
    position: [i, i],
    renderDistance: 1,
    unrenderOffset: 1,
  });
}
