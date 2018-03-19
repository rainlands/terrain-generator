import Generator, { mapObjectToArray } from "./index";
import CTGPluginDetailer from "./plugins/detailer/index";

const generator = new Generator({
  seed: 1,
  minHeight: 0,
  maxHeight: 256
});

generator.addPlugin(new CTGPluginDetailer(2, 4))

const { map, added, deleted } = generator.updateMap({
  userPosition: [0, 0, 0],
  renderDistance: 1
});

console.log(map);
