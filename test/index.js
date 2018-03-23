console.log('\n\n=== UPDATE ===\n\n\n'); // for HMR

import TerrainGenerator from '../index';
import * as utils from '../utils';
import * as visualization from './visualization';

const generator = new TerrainGenerator({
  seed: 123,
  size: 50,
  caves: {
    redistribution: 0.5,
    elevation: 15,
  },
});

const mapObject = generator.generateMap();
const mapObjectBinary = utils.mapObjectToBinaries(mapObject);

visualization.init(mapObjectBinary);
