import { Noise } from "noisejs";

/**
 * Endless chunked map generator based on user position
 * 1. Generate global height map (cell = chunk)
 * 2. Generate detailed height map per every chunk
 * To be rethinked...
 */
export default class Generator {
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
        // get render range boundary positions

        const minX = userX - renderDistance;
        const maxX = userX + renderDistance;

        const minZ = userZ - renderDistance;
        const maxZ = userZ + renderDistance;

        // delete chunk if out of render distance

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

    // delete chunks out of visibility distance
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

    return this.map;
  }
}

/**
 * Convert map object to multidimensional array
 * @param  {Object} object map object
 * @return {Array}        map array
 */
export const mapObjectToArray = object =>
  Object.keys(object).map(key => {
    if (typeof object[key] === "object") {
      return mapObjectToArray(object[key]);
    } else if (typeof object[key] === "number") {
      return object[key];
    } else {
      throw new Error(`Unsupported element type in map: ${typeof object[key]}`);
    }
  });
