console.log('\n\n=== UPDATE ===\n\n\n'); // for HMR

import TerrainGenerator from '../index';
import * as utils from '../utils';

const generator = new TerrainGenerator({
  seed: Math.random(),
  elevation: 10,
  size: 16,
});

const mapObject = generator.generateMap();
const mapObjectBinary = utils.mapObjectToBinaries(mapObject);

console.log(mapObjectBinary);
