const { Noise } = require('noisejs');

export default class TerrainGenerator {
  constructor({
    seed = Math.random(),
    size = 100,
    caves = {
      redistribution: 0.5,
      elevation: 100,
    },
  }) {
    this.seed = seed;
    this.size = size;
    this.caves = caves;

    this.map = {};

    this.noise = new Noise(seed);
  }

  _setMap({
    x, y, z, value, force,
  }) {
    if (!this.map[x]) this.map[x] = {};
    if (!this.map[x][y]) this.map[x][y] = {};
    if (!this.map[x][y][z] || force) {
      this.map[x][y][z] = value;
    }
  }

  _generateNoise({ x, y, z }) {
    const { elevation: e, redistribution: r } = this.caves;
    const noiseValue = this.noise.perlin3(x / e, y / e, z / e);
    const normalized = (noiseValue + 1) / 2; // 0-1
    const redistributed = Math.pow(normalized, r);


    this._setMap({
      x,
      y,
      z,
      value: redistributed,
    });
  }

  generateMap() {
    const { size } = this;
    const [xSize, ySize, zSize] = Array.isArray(size) ? size : Array(3).fill(size);

    console.log(xSize);
    for (let x = 0; x < xSize; x += 1) {
      for (let y = 0; y < ySize; y += 1) {
        for (let z = 0; z < zSize; z += 1) {
          this._generateNoise({ x, y, z });
        }
      }
    }

    return this.map;
  }
}
