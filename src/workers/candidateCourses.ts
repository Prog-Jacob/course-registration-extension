import { sortByLSOne } from '../modules/LSone';

self.addEventListener('message', function (e: MessageEvent) {
  const { courseValue, minValue, maxValue } = e.data;
  self.postMessage(candidateCourses(courseValue, minValue, maxValue));
});

function candidateCourses(courseValue: number[], minValue: number, maxValue: number): number[][] {
  const n = courseValue.length;
  const memo: Set<number>[][] = [];
  for (let i = 0; i < n; i++) memo.push([]);

  const answer: number[][] = [];
  for (let value = minValue; value <= maxValue; value++)
    answer.push(candidateCoursesPerCredit(courseValue, value));

  return answer;

  function candidateCoursesPerCredit(courseValue: number[], value: number): number[] {
    return sortByLSOne(Array.from(dp(0, value)));

    function dp(i: number, target: number): Set<number> {
      if (target == 0) return new Set([0]);
      if (target < 0 || i >= n) return new Set();
      if (memo[i][target]) return memo[i][target];

      memo[i][target] = new Set();

      for (let j = i; j < n; j++) {
        dp(j + 1, target - courseValue[j]).forEach((mask) => {
          if (((mask >> j) & 1) == 0) memo[i][target].add(mask | (1 << j));
        });
      }

      return memo[i][target];
    }
  }
}
