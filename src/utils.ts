export const label = (key: string) => key.replace(/_/g, ' ');
export const value = (v: number | undefined, plus = '+') => isNumber(v) ? ((v > 0 ? plus : '') + v) : '';
export const img = (key: string) => ({ path: require(`./img/${key.replace(/[^a-z0-9-_\/]/g, '')}.png`) });

export const undefinedToNaN = (n:number|undefined): number => n === undefined ? NaN : n;

export const isNumber = (n: number | undefined): n is number => isFinite(n as number);

export function keyForValue<T>(value: T, map: { [k: string]: T }) {
  for (let key in map) {
    if (map[key] === value) {
      return key;
    }
  }
  throw new Error(`${JSON.stringify(value)} for found in ${JSON.stringify(map)}`);
}
