import { Trie } from '../services/prefix_tree';
import { createSchedule } from '../modules/schedule';
import { Combination, Schedule } from '../types/combination';

self.addEventListener('message', function (e: MessageEvent) {
  const { message, data } = e.data;
  switch (message) {
    case 'add':
      base = { ...base, ...data };
      break;
    case 'init':
      base = {
        conflicts: new Trie(),
        visitedGroups: {},
        baseSchedules: [],
        courses: [],
        groups: [],
      };
      break;
    case 'generate':
      self.postMessage(generateCombinations(data.mask));
      break;
  }
});

let base;

function generateCombinations(mask: number): Combination {
  const ans: Combination = { courses: mask, schedules: base.baseSchedules.slice() };
  const visitedGroups = { ...base.visitedGroups };
  const copyMask = mask;
  let i = 0;

  if (base.conflicts.inverseStartsWIth(mask.toString(2).split('').reverse().join('')))
    return { ...ans, schedules: [] };

  while (mask) {
    if ((mask & 1) == 0) {
      ++i;
      mask >>= 1;
      continue;
    }

    for (const course of base.courses[i]) {
      const n = course.sessions.length;
      const nextSchedules: Schedule[] = [];
      const group = base.groups[course.code];

      if (n == 0 || visitedGroups[group]) {
        base.conflicts.insert(
          (copyMask & ((1 << ++i) - 1)).toString(2).split('').reverse().join('')
        );
        return { ...ans, schedules: [] };
      }
      if (group) visitedGroups[group] = true;

      for (let j = 0; j < n; j++) {
        const session = course.sessions[j];
        for (const schedule of ans.schedules) {
          if (session.dates.some((date) => schedule.dates[date])) continue;

          const newDates = schedule.dates.slice();
          session.dates.forEach((date) => (newDates[date] = true));
          nextSchedules.push({ sessions: [...schedule.sessions, j], dates: newDates, id: '' });
        }
      }

      if (!nextSchedules.length) {
        base.conflicts.insert(
          (copyMask & ((1 << ++i) - 1)).toString(2).split('').reverse().join('')
        );
        return { ...ans, schedules: [] };
      }
      ans.schedules = nextSchedules;
    }

    mask >>= 1;
    ++i;
  }

  if (base.courses[0][0].priority == 0) {
    if (ans.courses === 1) base.visitedGroups = { ...visitedGroups };
    ans.courses |= 1;
  }
  ans.schedules = ans.schedules.map(({ sessions, dates }) => createSchedule(sessions, dates));
  return ans;
}
