import Generator, { mapObjectToArray } from "./index";

const generator = new Generator({
  seed: 1,
  minHeight: -5,
  maxHeight: 5,
});

const { map, added, deleted } = generator.updateMap({
  userPosition: [0, 0, 0],
  renderDistance: 1,
  unrenderOffset: 1,
});

console.log(map);
