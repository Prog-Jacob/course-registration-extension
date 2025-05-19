import { Course, Option, ScheduleOptions, ScheduleProperties } from '../types/course';
import { Combination, Schedule, UnpackedSolution } from '../types/combination';
import { createSchedule } from '../modules/schedule';
import { MemoizeWithKey } from '../modules/cache';
import { CourseGroups } from '../types/course';

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

  // Groups
  private priorities: Option[];

  constructor(courses: Course[][], options: ScheduleOptions, groups: CourseGroups) {
    if (!courses?.length) throw new Error('You must provide at least one course!');
    this.baseSchedules = [createSchedule([], options.exclude_dates)];
    this.considerFull = options.considerDisabled ?? false;
    this.priorities = options.priorities;
    this.preferMin = options.preferMin;
    this.min = options.minCredits;
    this.max = options.maxCredits;
    this.courses = [...courses];
    this.validCombinations = [];
    this.mustIncludeCost = 0;
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

  public log() {
    generateCombinations.postMessage({ message: 'tree-log' });
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
    const baseCourses = this.getCourses();

    while (mask) {
      if ((mask & 1) == 1) {
        for (const course of baseCourses[i]) {
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
    (this.getScheduleProperties as any).clearCache();
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

  @MemoizeWithKey((schedule: Schedule) => schedule.id)
  getScheduleProperties(schedule: Schedule): ScheduleProperties {
    const { dates } = schedule;
    let startOfTheWeek = 0;
    let endOfTheWeek = 4;
    let totalFreeDays = 0;
    let totalEarlySessions = 0;
    let totalLateSessions = 0;

    while (startOfTheWeek <= endOfTheWeek && !this.hasSession(dates, startOfTheWeek)) {
      startOfTheWeek++;
    }
    while (startOfTheWeek <= endOfTheWeek && !this.hasSession(dates, endOfTheWeek)) {
      endOfTheWeek--;
    }

    totalFreeDays = 5 - (endOfTheWeek - startOfTheWeek + 1);

    for (let day = startOfTheWeek; day <= endOfTheWeek; day++) {
      if (this.hasSession(dates, day)) {
        let early = 0;
        let late = 7;

        while (early <= late && !dates[day * 8 + early]) {
          ++totalEarlySessions;
          ++early;
        }
        while (early <= late && !dates[day * 8 + late]) {
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

  private hasSession(dates: boolean[], day: number): boolean {
    const offset = day * 8;
    for (let i = 0; i < 8; i++) {
      if (dates[offset + i]) return true;
    }
    return false;
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
