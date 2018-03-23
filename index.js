const { Noise } = require('noisejs');

import { generateNoise2Map, generateNoise3Map, adjustHeight3d } from './utils';

export default class TerrainGenerator {
  constructor({
    seed = Math.random(),
    size = 25,
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
    this.size = size;

    this.caves = caves;
    this.surface = surface;

    this.cavesMap = {};
    this.heightMap = {};
    this.map = {};

    this.noise = new Noise(seed);
  }

  _generateCavesMap() {
    const [width, depth, height] = Array.isArray(this.size) ? this.size : Array(3).fill(this.size);

    return generateNoise3Map({
      noise: this.noise,
      width,
      height,
      depth,
      ...this.caves,
    });
  }

  _generateHeightMap() {
    const [xSize, ySize, zSize] = Array.isArray(this.size) ? this.size : Array(3).fill(this.size);

    return generateNoise2Map({
      noise: this.noise,
      width: xSize,
      height: zSize,
      ...this.surface,
    });
  }

  generateMap() {
    const cavesMap = this._generateCavesMap();
    const heightMap = this._generateHeightMap();

    const map = adjustHeight3d(cavesMap, heightMap);

    return map;
  }
}
