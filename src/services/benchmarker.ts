import Scheduler from './scheduler';
import packageInfo from '../../package.json';
import { Course } from '../types/course';

export async function benchmark(courses, groups, options, saveFiles = true) {
  const scheduler = new Scheduler(courses, options, groups);

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
  scheduler.log();
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
