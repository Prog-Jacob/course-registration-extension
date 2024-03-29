import sortSchedulesByFreeTime from '../modules/schedules_sorting';
import { Combination, Schedule } from '../types/combination';
import candidateCourses from '../modules/candidate_courses';
import { Course, ScheduleOptions } from '../types/course';
import { CourseGroups } from '../types/course';
import { Trie } from './prefix_tree';

export default class Scheduler {
  // Combinations
  private validCombinations: Combination[][];
  private candidateCombinations: number[][];
  private increment: number;
  private rangePtr: number;
  private slidePtr: number;

  // Courses
  private mustIncludeCost: number;
  private courses: Course[][];
  private min: number;
  private max: number;

  // Schedules
  private baseSchedules: Schedule[];
  private considerFull: boolean;
  private conflicts: Trie;

  // Groups
  private visitedGroups: { [key: string]: boolean };
  private groups: CourseGroups;

  constructor(courses: Course[][], options: ScheduleOptions, groups: CourseGroups) {
    this.baseSchedules = [{ sessions: [], dates: options.exclude_dates }];
    this.considerFull = options.considerDisabled ?? false;
    this.min = options.minCredits;
    this.max = options.maxCredits;
    this.courses = [...courses];
    this.conflicts = new Trie();
    this.mustIncludeCost = 0;
    this.visitedGroups = {};
    this.groups = groups;
    this.filterCourses();

    const courseValue = this.courses.map((courses) => {
      return courses.reduce((acc, course) => acc + course.credits, 0);
    });
    this.validCombinations = [];
    for (let i = 0; i <= this.max; i++) this.validCombinations.push([]);

    if (this.courses[0][0].priority == 0) {
      const mustIncludeCombination = this.generateCombinations(1);
      this.baseSchedules = mustIncludeCombination.schedules;
      this.mustIncludeCost = courseValue[0];

      if (!this.baseSchedules.length) throw new Error('Schedule conflict in the Must Included Courses.');
      if (this.mustIncludeCost > this.max) throw new Error('The Must Included Courses exceed the maximum credits.');

      this.min = Math.max(this.min - this.mustIncludeCost, 0);
      this.max -= this.mustIncludeCost;
      courseValue[0] = 0;
      if (this.min == 0) this.validCombinations[this.mustIncludeCost].push(mustIncludeCombination);
    }

    this.candidateCombinations = candidateCourses(courseValue, this.min, this.max);
    this.rangePtr = options.preferMin ? this.min : this.max;
    this.increment = options.preferMin ? 1 : -1;
    this.slidePtr = 0;
  }

  public next() {
    if (this.increment == 1) {
      if (this.rangePtr > this.max) return;
      if (this.rangePtr < this.min) {
        this.rangePtr = this.min;
        this.slidePtr = 0;
        return;
      }
    } else {
      if (this.rangePtr < this.min) return;
      if (this.rangePtr > this.max) {
        this.rangePtr = this.max;
        this.slidePtr = 0;
        return;
      }
    }
    this.slidePtr++;
  }

  public prev() {
    if (this.increment == 1) {
      if (this.rangePtr < this.min) return;
      if (this.rangePtr > this.max) {
        this.rangePtr = this.max;
        this.slidePtr = this.validCombinations[this.getRange()].length;
      }
    } else {
      if (this.rangePtr > this.max) return;
      if (this.rangePtr < this.min) {
        this.rangePtr = this.min;
        this.slidePtr = this.validCombinations[this.getRange()].length;
      }
    }

    while (this.slidePtr == 0) {
      this.rangePtr -= this.increment;
      if (this.rangePtr > this.max || this.rangePtr < this.min) return;
      this.slidePtr = this.validCombinations[this.getRange()].length;
    }

    this.slidePtr--;
  }

  public setRange(value: number) {
    this.rangePtr = value - this.mustIncludeCost;
    this.slidePtr = 0;
  }

  public getRange(): number {
    return this.rangePtr + this.mustIncludeCost;
  }

  public getCourses(): Course[][] {
    return this.courses;
  }

  private filterCourses(): void {
    if (this.courses[this.courses.length - 1][0].priority == 1000) this.courses.pop();

    this.courses = this.courses.map((level) => {
      return level.map((course) => ({
        ...course,
        sessions: course.sessions.filter((session) => {
          return (
            (this.considerFull || !session.isFull) &&
            (!course.options.group || session.group.length == 0 || session.group.includes(course.options.group)) &&
            (!course.options.section || session.section.length == 0 || session.section.includes(course.options.section))
          );
        }),
      }));
    });
  }

  public getCombinations(): Combination {
    while (this.rangePtr >= this.min && this.rangePtr <= this.max) {
      const ans =
        this.validCombinations[this.getRange()][this.slidePtr] ??
        (() => {
          const mask = this.candidateCombinations[this.rangePtr - this.min].pop();

          if (mask) {
            const ans = this.generateCombinations(mask);
            if (ans.schedules.length) {
              this.slidePtr = this.validCombinations[this.getRange()].length;
              this.validCombinations[this.getRange()].push(ans);
              return ans;
            }
            return;
          }

          this.rangePtr += this.increment;
          this.slidePtr = 0;
        })();
      if (ans) return ans;
    }
    throw new Error('There are no more schedules.');
  }

  private generateCombinations(mask: number): Combination {
    const ans: Combination = { courses: mask, schedules: this.baseSchedules.slice() };
    const visitedGroups = { ...this.visitedGroups };
    const copyMask = mask;
    let i = 0;

    if (this.conflicts.inverseStartsWIth(mask.toString(2).split('').reverse().join(''))) return { ...ans, schedules: [] };

    while (mask) {
      if ((mask & 1) == 0) {
        ++i;
        mask >>= 1;
        continue;
      }

      for (const course of this.courses[i]) {
        const n = course.sessions.length;
        const nextSchedules: Schedule[] = [];
        const group = this.groups[course.code];

        if (n == 0 || visitedGroups[group]) {
          this.conflicts.insert((copyMask & ((1 << ++i) - 1)).toString(2).split('').reverse().join(''));
          return { ...ans, schedules: [] };
        }
        if (group) visitedGroups[group] = true;

        for (let j = 0; j < n; j++) {
          const session = course.sessions[j];
          for (const schedule of ans.schedules) {
            if (session.dates.some((date) => schedule.dates[date])) continue;

            const newDates = schedule.dates.slice();
            session.dates.forEach((date) => (newDates[date] = true));
            nextSchedules.push({ sessions: [...schedule.sessions, j], dates: newDates });
          }
        }

        if (!nextSchedules.length) {
          this.conflicts.insert((copyMask & ((1 << ++i) - 1)).toString(2).split('').reverse().join(''));
          return { ...ans, schedules: [] };
        }

        ans.schedules = sortSchedulesByFreeTime(nextSchedules);
      }

      mask >>= 1;
      ++i;
    }

    if (this.courses[0][0].priority == 0) {
      if (ans.courses === 1) this.visitedGroups = { ...visitedGroups };
      ans.courses |= 1;
    }
    return ans;
  }
}
