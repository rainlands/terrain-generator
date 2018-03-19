# Chunked terrain generator
> Create your worlds seamlessly

#### ⚠️ **UNDER CONSTRUCTION** ⚠️

Blazing fast configurable procedural terrain generation based on perlin noise algorithm.
 
## Install

`npm i -S chunked-terrain-generator`

## Usage

```javascript
import TerrainGenerator, { mapObjectToArray } from 'chunked-terrain-generator';

// create terrain generator instance
const terrainGenerator = new TerrainGenerator({
  seed: Math.random(),
  minHeight: 0,
  maxHeight: 256
});

// ...

// Update map on game tick.
// Generator extends world and deletes
// out-of-render-distance chunks automatically.

const mapObject = const map = terrainGenerator.updateMap({
  userPosition: [0, 0, 0], // x, y, z
  renderDistance: 1, // 1 chunks around user + chunk user is on (3x3)
});

// map object
// object keys represent chunk coordinates
// mapObject[0][0];

const mapArray = mapObjectToArray(mapObject);
// map array
// array keys represent chunk coordinates
// mapArray[0][0];

```
