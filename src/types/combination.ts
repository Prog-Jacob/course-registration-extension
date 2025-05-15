export type Schedule = {
  sessions: number[];
  dates: boolean[];
  id: string;
};

export type Combination = {
  courses: number;
  schedules: Schedule[];
};

export type UnpackedSolution = {
  courses: number;
  schedule: Schedule;
};
