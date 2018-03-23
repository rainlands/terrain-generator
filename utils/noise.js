export const genChunk2 = ({
  noise,

  position,
  size,

  elevation,
  redistribution,
  minHeight,
  maxHeight,
}) => {
  const [posX, posZ] = position;
  const chunk = {};

  for (let x = 0; x < size; x += 1) {
    chunk[x] = {};

    for (let z = 0; z < size; z += 1) {
      const noiseX = x + posX;
      const noiseZ = z + posZ;

      const noiseValue =
        noise.perlin2(noiseX / elevation, noiseZ / elevation) +
        0.5 * noise.perlin2(noiseX / elevation * 2, noiseZ / elevation * 2) +
        0.25 * noise.perlin2(noiseX / elevation * 4, noiseZ / elevation * 4) +
        0.0625 * noise.perlin2(noiseX / elevation * 8, noiseZ / elevation * 8);

      const normalized = (noiseValue + 1) / 2; // 0-1
      const redistributed = Math.pow(normalized, redistribution);
      const ranged = redistributed * (maxHeight - minHeight) + minHeight;

      chunk[x][z] = ranged;
    }
  }

  return chunk;
};

export const genChunk3 = ({
  noise,

  position,
  size,
  height,
  heightMap,

  elevation,
  redistribution,
}) => {
  const [posX, posZ] = position;
  const chunk = {};

  for (let y = 0; y < height; y++) {
    chunk[y] = {};

    for (let x = 0; x < size; x++) {
      chunk[y][x] = {};

      for (let z = 0; z < size; z++) {
        if (y < heightMap[x][z]) {
          const noiseX = x + posX;
          const noiseY = y;
          const noiseZ = z + posZ;

          const noiseValue =
            noise.perlin3(noiseX / elevation, noiseY / elevation, noiseZ / elevation) +
            0.5 *
              noise.perlin3(
                noiseX / elevation * 2,
                noiseY / elevation * 2,
                noiseZ / elevation * 2,
              ) +
            0.25 *
              noise.perlin3(noiseX / elevation * 4, noiseY / elevation * 4, noiseZ / elevation * 4);
          0.0626 *
            noise.perlin3(noiseX / elevation * 8, noiseY / elevation * 8, noiseZ / elevation * 8);

          const normalized = (noiseValue + 1) / 2; // 0-1
          const redistributed = Math.pow(normalized, redistribution);

          chunk[y][x][z] = redistributed;
        } else {
          chunk[y][x][z] = 0;
        }
      }
    }
  }

  return chunk;
};
