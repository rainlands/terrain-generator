const { Noise } = require("noisejs");

const normalize = (val, min, max) => max + (val * max - min);

/**
 * Endless terrain height map generator based on user position
 */
export default class Generator {
  constructor({
    seed,
    detalization = 100,
    minHeight,
    maxHeight,
    unrenderChunks = true,
  }) {
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.detalization = detalization;
    this.unrenderChunks = unrenderChunks;

    this.noise = new Noise(seed);
    this.map = {};

    this.plugins = [];
  }

  _setMap({ x, z, value, force }) {
    if (!this.map[x]) this.map[x] = {};
    if (!this.map[x][z] || force) {
      this.map[x][z] = value;
      return true;
    }

    return false;
  }

  _generateNoise({ x, z }) {
    const noise =
      (this.noise.perlin2(x / this.detalization, z / this.detalization) + 1) *
      0.5;
    const range = this.maxHeight - this.minHeight;

    return noise * range + this.minHeight;
  }

  _unrenderChunksOutRange({ userX, userZ, renderDistance, unrenderOffset }) {
    const deleted = {};
    const unrenderDistance = renderDistance + unrenderOffset;

    Object.keys(this.map).forEach(x => {
      Object.keys(this.map[x]).forEach(z => {
        // get render range boundary positions

        const minX = userX - unrenderDistance;
        const maxX = userX + unrenderDistance;

        const minZ = userZ - unrenderDistance;
        const maxZ = userZ + unrenderDistance;

        // delete chunk if out of render distance

        if (x < minX || x > maxX) {
          if (this.map[x]) {
            Object.keys(this.map[x]).forEach(z => {
              // deleted.push({ x: Number(x), z: Number(z) })
              if (!deleted[x]) deleted[x] = {};
              deleted[x][z] = this.map[x][z];
            });
            delete this.map[x];
          }
        } else if (z < minZ || z > maxZ) {
          // deleted.push({ x: Number(x), z: Number(z) });
          if (!deleted[x]) deleted[x] = {};
          deleted[x][z] = this.map[x][z];

          delete this.map[x][z];
        }
      });
    });

    return deleted;
  }

  addPlugin(plugin) {
    this.plugins.push(plugin);

    if (plugin.onInitialize) plugin.onInitialize(this);
  }

  updateMap({ userPosition, renderDistance, unrenderOffset }) {
    const [userX, userY, userZ] = userPosition.map(o => Number(o));

    this.plugins.forEach(plugin => {
      if (plugin.onMapWillUpdate)
        plugin.onMapWillUpdate(this, {
          map: this.map,
          userPosition: [userX, userY, userZ],
          renderDistance,
          unrenderOffset
        });
    });

    let deleted;
    const added = {};

    if (this.unrenderChunks) {
      // delete chunks out of visibility distance
      deleted = this._unrenderChunksOutRange({
        userX,
        userZ,
        renderDistance,
        unrenderOffset
      });
    }

    for (let x = -renderDistance + userX; x < renderDistance + userX + 1; x++) {
      for (
        let z = -renderDistance + userZ;
        z < renderDistance + userZ + 1;
        z++
      ) {
        const isAdded = this._setMap({
          x,
          z,
          value: this._generateNoise({ x, z })
        });

        if (isAdded) {
          if (!added[x]) added[x] = {};
          added[x][z] = this.map[x][z];
        }
      }
    }

    this.plugins.forEach(plugin => {
      if (plugin.onMapDidUpdate)
        plugin.onMapDidUpdate(this, {
          map: this.map,
          added,
          deleted
        });
    });

    return {
      map: this.map,
      added,
      deleted
    };
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
