const seed = '&g![a8#>p';

export function hash(str: string) {
  return Math.abs(
    Array.from(str).reduce(
      (hash, char) => hash ^ ((hash << 5) + char.charCodeAt(0) + (hash >> 2)),
      1315423911
    )
  );
}

export function hashToHex(str: string): string {
  return hash(str + seed).toString(16);
}

export function hashToHexColor(str: string): string {
  return '#' + hashToHex(str).substr(-6, 6).padStart(6, '0');
}
