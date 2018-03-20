export default class TGPluginComposer {
  constructor({ generator, detalization }) {
    this.generator = generator;
    this.detalization = detalization;
  }

  onMapDidUpdate(_, { map, added, deleted }) {
    Object.keys(added).forEach(x => {
      Object.keys(added[x]).forEach(z => {
        added[x][z] = { initial: added[x][z] };

        const offsetI = this.detalization * x;
        const offsetJ = this.detalization * z;

        for (let i = offsetI; i < offsetI + this.detalization; i++) {
          added[x][z][i] = {};

          for (let j = offsetJ; j < offsetJ + this.detalization; j++) {
            added[x][z][i][j] = this.generator._generateNoise({
              x: i,
              z: j
            });
          }
        }
      });
    });
  }
}
