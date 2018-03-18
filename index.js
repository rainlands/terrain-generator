import { Noise } from "noisejs";
import normalizeArray from "normalize-to-range";

const normalize = (val, min, max) => (val - min) / (max - min);

/**
 * Endless chunked map generator based on user position
 * 1. Generate global height map (cell = chunk) and normalize it
 * 2. Generate detailed height map per every chunk and normalize it
 * To be rethinked...
 */
class Generator {
  constructor({ seed, minHeight, maxHeight }) {
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;

    this.noise = new Noise(seed);
    this.map = {};
  }

  _setMap(x, z, value) {
    if (!this.map[x]) this.map[x] = {};
    this.map[x][z] = value;
  }

  _generateNoise(x, z) {
    return this.noise.perlin2(x / 10, z / 10) * 100 + this.maxHeight / 2;
  }

  updateMap(userPosition, renderDist) {
    for (let x = -renderDist; x < renderDist + 1; x++) {
      for (let z = -renderDist; z < renderDist + 1; z++) {
        this._setMap(x, z, this._generateNoise(x, z));
      }
    }

    console.log(this.map);
  }
}

const generator = new Generator({
  seed: Math.random(),
  minHeight: 0,
  maxHeight: 256
});

generator.updateMap([0, 0, 0], 2);
