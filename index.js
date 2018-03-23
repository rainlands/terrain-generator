const { Noise } = require('noisejs');

import { setMap2, genChunk2, genChunk3 } from './utils';

export default class TerrainGenerator {
  constructor({
    seed = Math.random(),
    height = 20,
    chunkSize = 16,
    caves = {
      redistribution: 0.5,
      elevation: 100,
    },
    surface = {
      redistribution: 0.5,
      elevation: 100,
      minHeight: 15,
      maxHeight: 25,
    },
  }) {
    this.seed = seed;

    this.height = height;
    this.chunkSize = chunkSize;
    this.cavesConfig = caves;
    this.surfaceConfig = surface;

    this.cavesMap = {};
    this.heightMap = {};
    this.chunks = {};

    this.noise = new Noise(seed);
  }

  _unrenderChunks({
    xOffset, zOffset, xLength, zLength,
  }) {
    const deleted = {};

    Object.keys(this.chunks).forEach((x) => {
      if (x < xOffset || x > xLength) {
        deleted[x] = { ...this.chunks[x] };

        delete this.chunks[x];
      } else {
        Object.keys(this.chunks[x]).forEach((z) => {
          if (z < zOffset || z > zLength) {
            if (!deleted[x]) deleted[x] = {};
            deleted[x][z] = { ...this.chunks[x][z] };

            delete this.chunks[x][z];
          }
        });
      }
    });

    return deleted;
  }

  _updateChunks({ position, renderDistance, unrenderOffset }) {
    const [xOffset, zOffset] = position.map(v => v - renderDistance);
    const [xLength, zLength] = position.map(v => v + renderDistance + 1);

    const sharedParams = {
      noise: this.noise,
      size: this.chunkSize,
    };

    const added = {};
    const deleted = this._unrenderChunks({
      xOffset,
      zOffset,
      xLength,
      zLength,
    });

    for (let x = xOffset; x < xLength; x += 1) {
      if (!this.chunks[x]) this.chunks[x] = {};

      for (let z = zOffset; z < zLength; z += 1) {
        if (!this.chunks[x][z]) {
          const heightMap = genChunk2({
            position: [x, z],
            ...sharedParams,
            ...this.surfaceConfig,
          });

          const cavesMap = genChunk3({
            position: [x, z],
            height: this.height,

            heightMap,

            ...sharedParams,
            ...this.cavesConfig,
          });

          this.chunks[x][z] = cavesMap;
          if (!added[x]) added[x] = {};
          added[x][z] = cavesMap;
        }
      }
    }

    return {
      chunks: this.chunks,
      added,
      deleted,
    };
  }

  updateMap({ position, renderDistance, unrenderOffset }) {
    return this._updateChunks({
      position: position.map(v => Math.ceil(v / this.chunkSize)),
      renderDistance,
      unrenderOffset,
    });
  }
}
