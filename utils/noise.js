export const generateNoise2Map = ({
  map = {},
  force = false,

  noise,

  offsetX,
  offsetZ,
  sizeX,
  sizeZ,

  elevation,
  redistribution,
  minHeight,
  maxHeight,
}) => {
  const added = {};

  for (let x = offsetX; x < sizeX; x += 1) {
    if (!map[x]) map[x] = {};

    for (let z = offsetZ; z < sizeZ; z += 1) {
      if (!map[x][z] || force) {
        const noiseValue =
          noise.perlin2(x / elevation, z / elevation) +
          0.5 * noise.perlin2(x / elevation * 2, z / elevation * 2) +
          0.25 * noise.perlin2(x / elevation * 4, z / elevation * 4) +
          0.0625 * noise.perlin2(x / elevation * 8, z / elevation * 8);

        const normalized = (noiseValue + 1) / 2; // 0-1
        const redistributed = Math.pow(normalized, redistribution);
        const ranged = redistributed * (maxHeight - minHeight) + minHeight;

        map[x][z] = ranged;
        if (!added[x]) added[x] = {};
        added[x][z] = ranged;
      }
    }
  }

  return { map, added };
};

export const generateNoise3Map = ({
  map = {},
  height,
  heightMap = {},
  force = false,

  noise,

  offsetX,
  offsetZ,
  sizeX,
  sizeZ,

  elevation,
  redistribution,
}) => {
  const added = {};

  for (let y = 0; y < height; y += 1) {
    if (!map[y]) map[y] = {};

    for (let x = offsetX; x < sizeX; x += 1) {
      if (!map[y][x]) map[y][x] = {};

      for (let z = offsetZ; z < sizeZ; z += 1) {
        if (map[y][x][z] === undefined || force) {
          if (y <= heightMap[x][z]) {
            const noiseValue =
              noise.perlin3(x / elevation, y / elevation, z / elevation) +
              0.5 * noise.perlin3(x / elevation * 2, y / elevation * 2, z / elevation * 2) +
              0.25 * noise.perlin3(x / elevation * 4, y / elevation * 4, z / elevation * 4);
            0.0626 * noise.perlin3(x / elevation * 8, y / elevation * 8, z / elevation * 8);

            const normalized = (noiseValue + 1) / 2; // 0-1
            const redistributed = Math.pow(normalized, redistribution);

            map[y][x][z] = redistributed;

            if (!added[y]) added[y] = {};
            if (!added[y][x]) added[y][x] = {};
            added[y][x][z] = redistributed;
          } else {
            map[y][x][z] = 0;

            if (!added[y]) added[y] = {};
            if (!added[y][x]) added[y][x] = {};
            added[y][x][z] = 0;
          }
        }
      }
    }
  }

  return { map, added };
};
