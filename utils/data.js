export const mapObjectToArray = object =>
  Object.keys(object).map((key) => {
    if (typeof object[key] === 'object') {
      return mapObjectToArray(object[key]);
    } else if (typeof object[key] === 'number') {
      return object[key];
    }
    throw new Error(`Unsupported element type in map: ${typeof object[key]}`);
  });

export const mapObject = (object, cb) =>
  Object.keys(object).map((key, index) => cb(object[key], key, index));

export const roundArrayToBinaries = (array) => {
  if (Array.isArray(array[0])) {
    return array.map(roundArrayToBinaries);
  }
  return array.map(v => Math.round(v));
};

export const mapObjectToBinaries = (object) => {
  const keys = Object.keys(object);
  let values = Object.values(object);

  if (typeof object[keys[0]] === 'object') {
    values = values.map(mapObjectToBinaries);
  } else {
    values = values.map(v => Math.round(v));
  }

  return values.reduce((acc, cur, i) => {
    acc[keys[i]] = cur;
    return acc;
  }, {});
};
