export default class TGPluginComposer {
  constructor({ generator, detalization }) {
    this.generator = generator;
    this.detalization = detalization;
  }

  generateMap(map) {
    Object.keys(map).forEach(x => {
      Object.keys(map[x]).forEach(z => {


        if (typeof map[x][z] === 'number') {
          map[x][z] = { initial: map[x][z] };

          const offsetI = this.detalization * x;
          const offsetJ = this.detalization * z;

          for (let i = offsetI; i < offsetI + this.detalization; i++) {
            map[x][z][i] = {};

            for (let j = offsetJ; j < offsetJ + this.detalization; j++) {
              map[x][z][i][j] = this.generator._generateNoise({
                x: i,
                z: j
              });
            }
          }
        }
      });
    });
  }

  onMapDidUpdate(_, { map, added, deleted }) {
    this.generateMap(added);
    this.generateMap(deleted);
  }
}
