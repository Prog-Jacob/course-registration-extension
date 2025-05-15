import { hashToHex } from '../modules/hash';
import { Schedule } from '../types/combination';

export function createSchedule(sessions: number[], dates: boolean[]): Schedule {
  const raw = `${sessions.join(',')}|${dates.map(Number).join(',')}`;
  return { sessions, dates, id: hashToHex(raw) };
}
