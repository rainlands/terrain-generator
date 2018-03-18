import { Noise } from "node_modules/noisejs";

const normalize = (val, min, max) => (val - min) / (max - min);

/**
 * Endless chunked map generator based on user position
 * 1. Generate global height map (cell = chunk)
 * 2. Generate detailed height map per every chunk
 * To be rethinked...
 */
class Generator {
  constructor({ seed, minHeight, maxHeight }) {
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;

    this.noise = new Noise(seed);
    this.map = {};
  }

  _setMap({ x, z, value, force }) {
    if (!this.map[x]) this.map[x] = {};
    if (!this.map[x][z] || force) {
      this.map[x][z] = value;
    }
  }

  _generateNoise(x, z) {
    return this.noise.perlin2(x / 10, z / 10) * 100 + this.maxHeight / 2;
  }

  updateMap({ userPosition, renderDistance }) {
    const [userX, userY, userZ] = userPosition;

    for (let x = -renderDistance + userX; x < renderDistance + userX + 1; x++) {
      for (
        let z = -renderDistance + userZ;
        z < renderDistance + userZ + 1;
        z++
      ) {
        this._setMap({
          x,
          z,
          value: this._generateNoise(x, z)
        });
      }
    }

    console.log(this.map);
  }
}

const generator = new Generator({
  seed: 1,
  minHeight: 0,
  maxHeight: 256
});

for (let i = 0; i < 5; i++) {
  generator.updateMap({
    userPosition: [i, 0, i],
    renderDistance: 0
  });
}
