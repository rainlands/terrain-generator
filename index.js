const { Noise } = require('noisejs');

import { generateNoise2Map, generateNoise3Map, adjustHeight3d } from './utils';

export default class TerrainGenerator {
  constructor({
    seed = Math.random(),
    height,
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
    this.cavesConfig = caves;
    this.surfaceConfig = surface;

    this.cavesMap = {};
    this.heightMap = {};
    this.map = {};

    this.noise = new Noise(seed);
  }

  _generateCavesMap({ unset, offset, heightMap }) {
    return generateNoise3Map({
      map: this.cavesMap,
      noise: this.noise,

      height: this.height,
      heightMap: heightMap,

      offsetX: unset[0],
      offsetZ: unset[1],

      sizeX: offset[0],
      sizeZ: offset[1],

      ...this.cavesConfig,
    });
  }

  _generateHeightMap({ unset, offset }) {
    const [xSize, zSize] = Array.isArray(this.size) ? this.size : Array(3).fill(this.size);

    return generateNoise2Map({
      map: this.heightMap,
      noise: this.noise,

      offsetX: unset[0],
      offsetZ: unset[1],

      sizeX: offset[0],
      sizeZ: offset[1],

      ...this.surfaceConfig,
    });
  }

  updateMap({ position, renderDistance, unrenderOffset }) {
    const offset = position.map(n => n + renderDistance);
    const unset = position.map(n => n + -renderDistance);

    const height = this._generateHeightMap({ unset, offset });
    const caves = this._generateCavesMap({
      unset,
      offset,
      heightMap: height.map,
    });

    return caves;
  }
}
