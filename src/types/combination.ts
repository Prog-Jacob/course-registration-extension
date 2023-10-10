export type Schedule = {
  sessions: number[];
  dates: boolean[];
};

export type Combination = {
  courses: number;
  schedules: Schedule[];
};
