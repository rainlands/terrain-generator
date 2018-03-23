export const setMap2 = ({
  map, x, z, value, force,
}) => {
  if (!map[x]) map[x] = {};
  if (!map[x][z] || force) {
    map[x][z] = value;
  }
};

export const setMap3 = ({
  map, x, y, z, value, force,
}) => {
  if (!map[x]) map[x] = {};
  if (!map[x][y]) map[x][y] = {};
  if (!map[x][y][z] || force) {
    map[x][y][z] = value;
  }
};

export const adjustHeight3d = (map3, heightmap) => {
  Object.keys(map3).forEach((y) => {
    Object.keys(map3[y]).forEach((x) => {
      Object.keys(map3[y][x]).forEach((z) => {
        const height = Math.round(heightmap[x][z]);
        if (+y > height) {
          map3[y][x][z] = 0;
        }
      });
    });
  });

  return map3;
};
