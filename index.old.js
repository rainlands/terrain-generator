const { Noise } = require('noisejs');

export default class TerrainGenerator {
  constructor({
    seed = Math.random(),
    height = 20,
    chunkSize = 16,
    caves = {
      redistribution: 0.5,
      frequency: 100,
    },
    surface = {
      redistribution: 0.5,
      frequency: 100,
      minHeight: 15,
      maxHeight: 25,
    },
  }) {
    this.seed = seed;
    this.noise = new Noise(seed);

    this.height = height;
    this.chunkSize = chunkSize;
    this.cavesConfig = caves;
    this.surfaceConfig = surface;

    this.cavesMap = {};
    this.heightMap = {};
    this.chunks = {};

    this.latestPosition = [];
    this.latestResults = {};

    this.utils = require('./utils');
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
    // TODO: UNRENDER OFFSET

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
          const heightMap = this.utils.genChunk2({
            position: [x, z].map(v => v * this.chunkSize),
            ...sharedParams,
            ...this.surfaceConfig,
          });

          const cavesMap = this.utils.genChunk3({
            position: [x, z].map(v => v * this.chunkSize),
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

  update({ position, renderDistance, unrenderOffset }) {
    const latestPosition = position.map(v => Math.ceil(v / this.chunkSize));

    if (
      latestPosition[0] !== this.latestPosition[0] ||
      latestPosition[1] !== this.latestPosition[1]
    ) {
      this.onMapUpdateCB(this._updateChunks({
        position: position.map(v => Math.ceil(v / this.chunkSize)),
        renderDistance,
        unrenderOffset,
      }));
    }
  }

  onMapUpdate(cb) {
    this.onMapUpdateCB = cb;
  }
}
