export const genChunk2 = ({
  noise,

  position,
  size,

  frequency,
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
        noise.perlin2(noiseX / frequency, noiseZ / frequency)
        + 0.5 * noise.simplex2(noiseX / frequency * 2, noiseZ / frequency * 2)
        + 0.25 * noise.perlin2(noiseX / frequency * 4, noiseZ / frequency * 4)
        + 0.0625 * noise.simplex2(noiseX / frequency * 8, noiseZ / frequency * 8)
        + 0.0625 * 0.0625 * noise.perlin2(noiseX / frequency * 16, noiseZ / frequency * 16)

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

  frequency,
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

          const noiseValue = 1;

          // const noiseValue =
          //   noise.simplex3(noiseX / frequency, noiseY / frequency, noiseZ / frequency)

          //   0.5 *
          //     noise.perlin3(
          //       noiseX / frequency * 2,
          //       noiseY / frequency * 2,
          //       noiseZ / frequency * 2,
          //     ) +
          //   0.25 *
          //     noise.perlin3(noiseX / frequency * 4, noiseY / frequency * 4, noiseZ / frequency * 4);
          // 0.0626 *
          //   noise.perlin3(noiseX / frequency * 8, noiseY / frequency * 8, noiseZ / frequency * 8);

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
