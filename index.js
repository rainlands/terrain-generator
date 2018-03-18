import { Noise } from "./node_modules/noisejs";

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

  _generateNoise({ x, z }) {
    return this.noise.perlin2(x / 10, z / 10) * 100 + this.maxHeight / 2;
  }

  _unrenderChunksOutRange({ userX, userZ, renderDistance }) {
    Object.keys(this.map).forEach(x => {
      Object.keys(this.map[x]).forEach(z => {
        const minX = userX - renderDistance;
        const maxX = userX + renderDistance;

        const minZ = userZ - renderDistance;
        const maxZ = userZ + renderDistance;

        if (x < minX || x > maxX) {
          delete this.map[x];
        } else if (z < minZ || z > maxZ) {
          delete this.map[x][z];
        }
      });
    });
  }

  updateMap({ userPosition, renderDistance }) {
    const [userX, userY, userZ] = userPosition;

    this._unrenderChunksOutRange({ userX, userZ, renderDistance });

    for (let x = -renderDistance + userX; x < renderDistance + userX + 1; x++) {
      for (
        let z = -renderDistance + userZ;
        z < renderDistance + userZ + 1;
        z++
      ) {
        this._setMap({
          x,
          z,
          value: this._generateNoise({ x, z })
        });
      }
    }
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
    renderDistance: 1
  });
}

const generator2 = new Generator({
  seed: 1,
  minHeight: 0,
  maxHeight: 256
});

generator2.updateMap({
  userPosition: [4, 0, 4],
  renderDistance: 1
});

console.log(generator.map, generator2.map);
