import { Schedule } from '../types/combination';

function getNumberOfOutermostFreeDays(schedule: Schedule): number {
  let left = 0;
  let right = 4;
  let count = 0;

  while (left <= right && !schedule.dates.slice(left * 8, (left + 1) * 8).some(Boolean)) {
    count++;
    left++;
  }

  while (right >= left && !schedule.dates.slice(right * 8, (right + 1) * 8).some(Boolean)) {
    count++;
    right--;
  }

  return count;
}

function getNumberOfOutermostFreeSlots(schedule: Schedule): number {
  let count = 0;

  for (let day = 0; day < 5; day++) {
    let left = 0;
    let right = 7;

    while (left <= right && !schedule.dates[day * 8 + left]) {
      count++;
      left++;
    }
    while (right >= left && !schedule.dates[day * 8 + right]) {
      count++;
      right--;
    }
  }

  return count;
}

export default function sortSchedulesByFreeTime(schedules: Schedule[]): Schedule[] {
  return schedules.sort((a, b) => {
    const aFreeDays = getNumberOfOutermostFreeDays(a);
    const bFreeDays = getNumberOfOutermostFreeDays(b);
    const aFreeSlots = getNumberOfOutermostFreeSlots(a);
    const bFreeSlots = getNumberOfOutermostFreeSlots(b);

    if (aFreeDays != bFreeDays) return bFreeDays - aFreeDays;
    return bFreeSlots - aFreeSlots;
  });
}
