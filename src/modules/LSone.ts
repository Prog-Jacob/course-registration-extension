export function sortByLSOne(arr: number[]) {
  return arr.sort((a, b) => {
    while (LSOne(a) == LSOne(b)) {
      a -= LSOne(a);
      b -= LSOne(b);
    }
    return LSOne(b) - LSOne(a);
  });
}

export function LSOne(S: number): number {
  return S & -S;
}
