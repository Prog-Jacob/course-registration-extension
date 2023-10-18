export function clean(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}
