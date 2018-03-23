# Terrain Generator

> Create your worlds seamlessly

Configurable procedural chunked terrain generation based on perlin noise algorithm. Allows you to create endless worlds with ridges and caves like in Minecraft (and better).

## Install

`npm i -S terrain-generator`

## Usage

```javascript
import TerrainGenerator from 'chunked-terrain-generator';

// create terrain generator instance
const generator = new TerrainGenerator({
  seed: Math.random() * 100, // 1 - 65536
  height: 256, // chunk height
  chunkSize: 16, // chunk size (16 x 16)
  caves: {
    redistribution: 0.4, // Higher values make caves bigger and more solid
    frequency: 50, // less frequency - more caves. The bigger is frequency the less should be redistribution
  },
  surface: {
    // chunk surface (height map)
    redistribution: 5, // Higher values push middle elevations down into valleys and lower values pull middle elevations up towards mountain peaks.
    frequency: 120, // just zooming in and out
    minHeight: 5,
    maxHeight: 25,
  },
});

// to be continued ...
```
