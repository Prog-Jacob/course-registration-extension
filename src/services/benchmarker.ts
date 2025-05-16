import Scheduler from './scheduler';
import packageInfo from '../../package.json';
import { defaultData } from '../pages/SetOptions';
import { levelCourses } from '../pages/SetOptions';
import { Course, ScheduleOptions } from '../types/course';

export async function benchmark(file: File, saveFiles = true) {
  const text = await file?.text();
  const { courses, groups } = JSON.parse(text);
  const options = {
    ...defaultData.scheduleOptions,
    maxCredits: 25,
    minCredits: 14,
  } as ScheduleOptions;

  const scheduler = new Scheduler(levelCourses(courses), options, groups);

  console.log(`Benchmark started.`);
  const start = performance.now();

  await scheduler.init();
  while (true) {
    try {
      const solutions = await scheduler.getSolutions();
      saveFiles && saveSolutions(solutions, scheduler.getRange());
      scheduler.next();
    } catch (error) {
      console.log('Finished iterating scheduler:', (error as Error).message);
      break;
    }
  }

  const end = performance.now();
  const totalDuration = end - start;
  console.log(`Benchmark complete.`);
  console.log(`Total time: ${(totalDuration / 1000).toFixed(2)}s`);
}

function saveSolutions(solutions: Course[][], index: number) {
  const json = JSON.stringify(solutions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');

  a.href = URL.createObjectURL(blob);
  a.download = `${packageInfo.version}_${index}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
