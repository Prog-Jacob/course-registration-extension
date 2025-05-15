export function modifyObject(obj: object, keys: string[], value: any): object {
  if (!keys.length) return value;
  const key = +keys[0] >= 0 ? +keys.shift() : keys.shift();
  return { ...obj, [key]: modifyObject(obj[key], keys, value) };
}
