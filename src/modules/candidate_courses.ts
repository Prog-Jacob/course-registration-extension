import { sortByLSOne } from './LSone';

export default function cadidateCourses(courseValue: number[], value: number): number[] {
  const memo: Set<number>[][] = new Array(courseValue.length).fill(new Array(value + 1));
  const n = courseValue.length;

  function dp(i: number, target: number): Set<number> {
    if (target == 0) {
      return new Set([0]);
    }
    if (target < 0 || i >= n) {
      return new Set();
    }
    if (memo[i][target] != undefined) {
      return memo[i][target];
    }

    memo[i][target] = new Set();

    for (let j = i; j < n; j++) {
      dp(j + 1, target - courseValue[j]).forEach((mask) => {
        if (((mask >> j) & 1) == 0) {
          memo[i][target].add(mask | (1 << j));
        }
      });
    }

    return memo[i][target];
  }

  return sortByLSOne(Array.from(dp(0, value)));
}
