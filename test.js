import Generator, {
  mapObjectToArray
} from "./dist/index.umd";

const generator = new Generator({
  seed: 1,
  detalization: 10,
  minHeight: 5,
  maxHeight: 10,
});

const {
  map,
  added,
  deleted
} = generator.updateMap({
  userPosition: [0, 0, 0],
  renderDistance: 1,
  unrenderOffset: 1,
});

console.log(map);

for (var i = 0; i < 20; i++) {
  const {
    map,
    added,
    deleted
  } = generator.updateMap({
    userPosition: [i, 0, i],
    renderDistance: 1,
    unrenderOffset: 1,
  });
}