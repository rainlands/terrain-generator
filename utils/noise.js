export const generateNoise2Map = ({
  noise,
  width,
  height,
  elevation,
  redistribution,
  minHeight,
  maxHeight,
}) => {
  const map = {};

  for (let x = 0; x < width; x += 1) {
    map[x] = {};

    for (let z = 0; z < height; z += 1) {
      const noiseValue =
        noise.perlin2(x / elevation, z / elevation) +
        0.5 * noise.perlin2(x / elevation * 2, z / elevation * 2) +
        0.25 * noise.perlin2(x / elevation * 4, z / elevation * 4) +
        0.0625 * noise.perlin2(x / elevation * 8, z / elevation * 8);

      const normalized = (noiseValue + 1) / 2; // 0-1
      const redistributed = Math.pow(normalized, redistribution);
      const ranged = redistributed * (maxHeight - minHeight) + minHeight;

      map[x][z] = ranged;
    }
  }

  return map;
};

export const generateNoise3Map = ({
  noise, width, height, depth, elevation, redistribution,
}) => {
  const map = {};

  for (let x = 0; x < depth; x += 1) {
    map[x] = {};

    for (let y = 0; y < width; y += 1) {
      map[x][y] = {};

      for (let z = 0; z < height; z += 1) {
        const noiseValue =
          noise.perlin3(x / elevation, y / elevation, z / elevation) +
          0.5 * noise.perlin3(x / elevation * 2, y / elevation * 2, z / elevation * 2) +
          0.25 * noise.perlin3(x / elevation * 4, y / elevation * 4, z / elevation * 4);
        0.0626 * noise.perlin3(x / elevation * 8, y / elevation * 8, z / elevation * 8);

        const normalized = (noiseValue + 1) / 2; // 0-1
        const redistributed = Math.pow(normalized, redistribution);

        map[x][y][z] = redistributed;
      }
    }
  }

  return map;
};
