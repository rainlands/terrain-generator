import Generator, { mapObjectToArray } from "./index";

const generator = new Generator({
  seed: 1,
  minHeight: 0,
  maxHeight: 256
});

for (var i = 0; i < 5; i++) {
  const { map, added, deleted } = generator.updateMap({
    userPosition: [i, 0, 0],
    renderDistance: 1,
    unrenderOffset: 1,
  });

  console.log(map);
}
