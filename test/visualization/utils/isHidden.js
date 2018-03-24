export default ({ map, position }) => {
  const [y, x, z] = position.map(n => Number(n));

  return (
    map[y + 1] &&
    map[y + 1][x] &&
    map[y + 1][x][z] &&
    (map[y + 1] && map[y + 1][x] && map[y + 1][x][z + 1]) &&
    (map[y + 1] && map[y + 1][x] && map[y + 1][x][z - 1]) &&
    (map[y + 1] && map[y + 1][x + 1] && map[y + 1][x + 1][z]) &&
    (map[y + 1] && map[y + 1][x + 1] && map[y + 1][x + 1][z + 1]) &&
    (map[y + 1] && map[y + 1][x + 1] && map[y + 1][x + 1][z - 1]) &&
    (map[y + 1] && map[y + 1][x - 1] && map[y + 1][x - 1][z]) &&
    (map[y + 1] && map[y + 1][x - 1] && map[y + 1][x - 1][z + 1]) &&
    (map[y + 1] && map[y + 1][x - 1] && map[y + 1][x - 1][z - 1]) &&
    (map[y - 1] && map[y - 1][x] && map[y - 1][x][z]) &&
    (map[y - 1] && map[y - 1][x] && map[y - 1][x][z + 1]) &&
    (map[y - 1] && map[y - 1][x] && map[y - 1][x][z - 1]) &&
    (map[y - 1] && map[y - 1][x + 1] && map[y - 1][x + 1][z]) &&
    (map[y - 1] && map[y - 1][x + 1] && map[y - 1][x + 1][z + 1]) &&
    (map[y - 1] && map[y - 1][x + 1] && map[y - 1][x + 1][z - 1]) &&
    (map[y - 1] && map[y - 1][x - 1] && map[y - 1][x - 1][z]) &&
    (map[y - 1] && map[y - 1][x - 1] && map[y - 1][x - 1][z + 1]) &&
    (map[y - 1] && map[y - 1][x - 1] && map[y - 1][x - 1][z - 1]) &&
    (map[y] && map[y][x] && map[y][x][z]) &&
    (map[y] && map[y][x] && map[y][x][z + 1]) &&
    (map[y] && map[y][x] && map[y][x][z - 1]) &&
    (map[y] && map[y][x + 1] && map[y][x + 1][z]) &&
    (map[y] && map[y][x + 1] && map[y][x + 1][z + 1]) &&
    (map[y] && map[y][x + 1] && map[y][x + 1][z - 1]) &&
    (map[y] && map[y][x - 1] && map[y][x - 1][z]) &&
    (map[y] && map[y][x - 1] && map[y][x - 1][z + 1]) &&
    (map[y] && map[y][x - 1] && map[y][x - 1][z - 1])
  );
};
