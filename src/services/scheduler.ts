import { Course, Option, ScheduleOptions, ScheduleProperties } from '../types/course';
import { Combination, Schedule, UnpackedSolution } from '../types/combination';
import { CourseGroups } from '../types/course';
import { Trie } from './prefix_tree';

const chrome = window.chrome;
const candidateWorkerLocation = './static/js/workers/candidateCourses.js';
const generateWorkerLocation = './static/js/workers/generateCombinations.js';

const generateCombinations = new Worker(
  chrome?.runtime?.getURL?.(generateWorkerLocation) || window.location + generateWorkerLocation
);
const candidateCourses = new Worker(
  chrome?.runtime?.getURL?.(candidateWorkerLocation) || window.location + candidateWorkerLocation
);

export default class Scheduler {
  // Combinations
  private candidateCombinations: Promise<number[][]>;
  private validCombinations: Combination[][];
  private increment: number;
  private rangePtr: number;

  // Courses
  private mustIncludeCost: number;
  private courses: Course[][];
  private min: number;
  private max: number;

  // Schedules
  private baseSchedules: Schedule[];
  private schedules: Course[][][];
  private considerFull: boolean;
  private preferMin: boolean;
  private conflicts: Trie;

  // Groups
  private visitedGroups: { [key: string]: boolean };
  private priorities: Option[];
  private groups: CourseGroups;

  constructor(courses: Course[][], options: ScheduleOptions, groups: CourseGroups) {
    if (!courses?.length) throw new Error('You must provide at least one course!');
    this.baseSchedules = [{ sessions: [], dates: options.exclude_dates }];
    this.considerFull = options.considerDisabled ?? false;
    this.priorities = options.priorities;
    this.preferMin = options.preferMin;
    this.min = options.minCredits;
    this.max = options.maxCredits;
    this.courses = [...courses];
    this.conflicts = new Trie();
    this.validCombinations = [];
    this.mustIncludeCost = 0;
    this.visitedGroups = {};
    this.groups = groups;
    this.schedules = [];
    this.filterCourses();

    for (let i = 0; i <= this.max; i++) this.validCombinations.push([]);
    for (let i = 0; i <= this.max; i++) this.schedules.push([]);

    generateCombinations.postMessage({ message: 'init' });
    generateCombinations.postMessage({
      message: 'add',
      data: {
        baseSchedules: this.baseSchedules,
        courses: this.courses,
        groups,
      },
    });
  }

  async init() {
    const courseValue = this.courses.map((courses) => {
      return courses.reduce((acc, course) => acc + course.credits, 0);
    });

    if (this.courses[0][0].priority == 0) {
      generateCombinations.postMessage({ message: 'generate', data: { mask: 1 } });
      const mustIncludeCombination: Promise<Combination> = new Promise((resolve) => {
        generateCombinations.addEventListener('message', (e: MessageEvent) => {
          resolve(e.data);
        });
      });
      this.baseSchedules = (await mustIncludeCombination).schedules;
      this.mustIncludeCost = courseValue[0];
      courseValue[0] = 1000;

      if (!this.baseSchedules.length)
        throw new Error('Schedule conflict in the Must Included Courses.');
      if (this.mustIncludeCost > this.max)
        throw new Error('The Must Included Courses exceed the maximum credits.');

      this.max -= this.mustIncludeCost;
      this.min = Math.max(this.min - this.mustIncludeCost, 0);
      if (this.min == 0)
        this.validCombinations[this.mustIncludeCost].push(await mustIncludeCombination);
    }

    candidateCourses.postMessage({ courseValue, minValue: this.min, maxValue: this.max });
    this.candidateCombinations = new Promise((resolve) => {
      candidateCourses.addEventListener('message', (e: MessageEvent) => {
        resolve(e.data);
      });
    });
    generateCombinations.postMessage({
      message: 'add',
      data: {
        baseSchedules: this.baseSchedules,
      },
    });

    this.rangePtr = this.preferMin ? this.min : this.max;
    this.increment = this.preferMin ? 1 : -1;
  }

  public next() {
    this.rangePtr += this.increment;
    this.rangePtr = Math.max(this.rangePtr, this.min - 1);
    this.rangePtr = Math.min(this.rangePtr, this.max + 1);
  }

  public prev() {
    this.rangePtr -= this.increment;
    this.rangePtr = Math.max(this.rangePtr, this.min - 1);
    this.rangePtr = Math.min(this.rangePtr, this.max + 1);
  }

  public setRange(value: number) {
    this.rangePtr = value - this.mustIncludeCost;
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
            (!course.options.group ||
              session.group.length == 0 ||
              session.group.includes(course.options.group)) &&
            (!course.options.section ||
              session.section.length == 0 ||
              session.section.includes(course.options.section))
          );
        }),
      }));
    });
  }

  private unpackSolution({ courses, schedule }: UnpackedSolution): Course[] {
    let i = 0,
      j = 0;
    let mask = courses;
    const solution: Course[] = [];

    while (mask) {
      if ((mask & 1) == 1) {
        for (const course of this.getCourses()[i]) {
          const session = course.sessions[schedule.sessions[j]];
          solution.push({
            ...course,
            sessions: [session],
          });
          j++;
        }
      }
      i++;
      mask >>= 1;
    }

    return solution;
  }

  public async getSolutions(): Promise<Course[][]> {
    if (this.rangePtr >= this.min && this.rangePtr <= this.max) {
      if (this.schedules[this.rangePtr].length) return this.schedules[this.rangePtr];
      const combinations = await this.getCombinations(this.getRange());
      const solutions = combinations.flatMap((combination) =>
        combination.schedules.map(
          (schedule) => ({ schedule, courses: combination.courses }) as UnpackedSolution
        )
      );
      this.schedules[this.rangePtr] = this.sortSolutions(solutions).map((solution) =>
        this.unpackSolution(solution)
      );
      if (this.schedules[this.rangePtr].length) return this.schedules[this.rangePtr];
      else throw new Error(`You can't register ${this.getRange()}CHs.`);
    } else throw new Error('There are no more schedules.');
  }

  private async getCombinations(index: number): Promise<Combination[]> {
    let mask;
    while ((mask = (await this.candidateCombinations)[this.rangePtr - this.min].pop())) {
      generateCombinations.postMessage({ message: 'generate', data: { mask } });
      const ans = (await new Promise((resolve) => {
        generateCombinations.addEventListener('message', (e: MessageEvent) => {
          resolve(e.data);
        });
      })) as Combination;
      if (ans.schedules.length) {
        this.validCombinations[index].push(ans);
      }
    }
    return this.validCombinations[index];
  }

  private sortSolutions(solutions: UnpackedSolution[]): UnpackedSolution[] {
    return solutions.sort((a, b) => {
      const schedule1 = this.getScheduleProperties(a.schedule);
      const schedule2 = this.getScheduleProperties(b.schedule);
      for (const { id, reverse } of this.priorities) {
        const val = this[id](schedule1, schedule2) * (reverse ? -1 : 1);
        if (val !== 0) return val;
      }
      return 0;
    });
  }

  private getScheduleProperties(schedule: Schedule): ScheduleProperties {
    let startOfTheWeek = 0;
    let endOfTheWeek = 4;
    let totalFreeDays = 0;
    let totalEarlySessions = 0;
    let totalLateSessions = 0;

    while (
      startOfTheWeek <= endOfTheWeek &&
      !schedule.dates.slice(startOfTheWeek * 8, (startOfTheWeek + 1) * 8).some(Boolean)
    ) {
      startOfTheWeek++;
    }
    while (
      startOfTheWeek <= endOfTheWeek &&
      !schedule.dates.slice(endOfTheWeek * 8, (endOfTheWeek + 1) * 8).some(Boolean)
    ) {
      endOfTheWeek--;
    }

    totalFreeDays = 5 - (endOfTheWeek - startOfTheWeek + 1);

    for (let day = startOfTheWeek; day <= endOfTheWeek; day++) {
      if (schedule.dates.slice(day * 8, (day + 1) * 8).some(Boolean)) {
        let early = 0;
        let late = 7;

        while (early <= late && !schedule.dates[day * 8 + early]) {
          ++totalEarlySessions;
          ++early;
        }
        while (early <= late && !schedule.dates[day * 8 + late]) {
          ++totalLateSessions;
          --late;
        }
      } else {
        ++totalFreeDays;
      }
    }

    return {
      startOfTheWeek,
      endOfTheWeek,
      totalFreeDays,
      totalEarlySessions,
      totalLateSessions,
    };
  }

  private preferShortWeek(a: ScheduleProperties, b: ScheduleProperties): number {
    const schedule1week = a.endOfTheWeek - a.startOfTheWeek;
    const schedule2week = b.endOfTheWeek - b.startOfTheWeek;
    return schedule1week - schedule2week;
  }
  private preferLessDays(a: ScheduleProperties, b: ScheduleProperties): number {
    const schedule1freeDays = a.totalFreeDays;
    const schedule2freeDays = b.totalFreeDays;
    return schedule2freeDays - schedule1freeDays;
  }
  private preferShortDays(a: ScheduleProperties, b: ScheduleProperties): number {
    const schedule1freeHours = a.totalEarlySessions + a.totalLateSessions;
    const schedule2freeHours = b.totalEarlySessions + b.totalLateSessions;
    return schedule2freeHours - schedule1freeHours;
  }
  private preferEarlySessions(a: ScheduleProperties, b: ScheduleProperties): number {
    const schedule1freeHours = a.totalEarlySessions;
    const schedule2freeHours = b.totalEarlySessions;
    return schedule1freeHours - schedule2freeHours;
  }
  private preferLateSessions(a: ScheduleProperties, b: ScheduleProperties): number {
    const schedule1freeHours = a.totalLateSessions;
    const schedule2freeHours = b.totalLateSessions;
    return schedule1freeHours - schedule2freeHours;
  }
}
