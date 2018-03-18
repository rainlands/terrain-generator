# Chunked terrain generator

> Create your worlds seamlessly

## Install

`npm i -S chunked-terrain-generator`

## Usage

```javascript
import TerrainGenerator from 'chunked-terrain-generator';

// create terrain generator instance
const terrainGenerator = new TerrainGenerator({
  seed: Math.random(),
  minHeight: 0,
  maxHeight: 256
});

...
// Update map on game tick.
// Generator extends world and deletes
// out-of-render-distance chunks automatically.

terrainGenerator.updateMap({
  userPosition: [10, 10, 10], // x, y, z
  renderDistance: 5, // 5 chunks around user + chunk user is on (11x11)
});
```
