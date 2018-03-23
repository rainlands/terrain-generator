const { Noise } = require('noisejs');

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

  _setMap3({
    map, x, y, z, value, force,
  }) {
    if (!map[x]) map[x] = {};
    if (!map[x][y]) map[x][y] = {};
    if (!map[x][y][z] || force) {
      map[x][y][z] = value;
    }
  }

  _setMap2({
    map, x, z, value, force,
  }) {
    if (!map[x]) map[x] = {};
    if (!map[x][z] || force) {
      map[x][z] = value;
    }
  }

  _generateNoise3({ position: { x, y, z }, elevation, redistribution }) {
    // const noise = this.noise.perlin3(x / elevation, y / elevation, z / elevation);
    const noise =
      this.noise.perlin3(x / elevation, y / elevation, z / elevation) +
      0.5 * this.noise.perlin3(x / elevation * 2, y / elevation * 2, z / elevation * 2) +
      0.25 * this.noise.perlin3(x / elevation * 4, y / elevation * 4, z / elevation * 4);
      0.0626 * this.noise.perlin3(x / elevation * 8, y / elevation * 8, z / elevation * 8);

    const normalized = (noise + 1) / 2; // 0-1
    const redistributed = Math.pow(normalized, redistribution);

    this._setMap3({
      map: this.cavesMap,
      x,
      y,
      z,
      value: redistributed,
    });
  }

  _generateCavesMap() {
    const { size } = this;
    const [xSize, ySize, zSize] = Array.isArray(size) ? size : Array(3).fill(size);
    const { elevation, redistribution } = this.caves;

    for (let x = 0; x < ySize; x += 1) {
      for (let y = 0; y < xSize; y += 1) {
        for (let z = 0; z < zSize; z += 1) {
          this._generateNoise3({
            position: { x, y, z },
            elevation,
            redistribution,
          });
        }
      }
    }
  }

  _generateNoise2({
    position: { x, z }, elevation, redistribution, minHeight, maxHeight,
  }) {
    const noise =
      this.noise.perlin2(x / elevation, z / elevation) +
      0.5 * this.noise.perlin2(x / elevation * 2, z / elevation * 2) +
      0.25 * this.noise.perlin2(x / elevation * 4, z / elevation * 4) +
      0.0625 * this.noise.perlin2(x / elevation * 8, z / elevation * 8);

    const normalized = (noise + 1) / 2; // 0-1
    const redistributed = Math.pow(normalized, redistribution);
    const ranged = redistributed * (maxHeight - minHeight) + minHeight;

    this._setMap2({
      map: this.heightMap,
      x,
      z,
      value: ranged,
    });
  }

  _generateHeightMap() {
    const { size } = this;
    const [xSize, ySize, zSize] = Array.isArray(size) ? size : Array(3).fill(size);
    const {
      elevation, redistribution, maxHeight, minHeight,
    } = this.surface;

    for (let x = 0; x < xSize; x += 1) {
      for (let z = 0; z < zSize; z += 1) {
        this._generateNoise2({
          position: { x, z },
          elevation,
          redistribution,
          maxHeight,
          minHeight,
        });
      }
    }
  }

  _overlapMaps(map3, map2) {
    Object.keys(map3).forEach((y) => {
      Object.keys(map3[y]).forEach((x) => {
        Object.keys(map3[y][x]).forEach((z) => {
          const height = Math.round(map2[x][z]);

          if (+y > height) {
            map3[y][x][z] = 0;
          }
        });
      });
    });

    return map3;
  }

  generateMap() {
    this._generateCavesMap();
    this._generateHeightMap();

    this.map = this._overlapMaps(this.cavesMap, this.heightMap);

    return this.cavesMap;
  }
}
