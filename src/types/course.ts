export type Course = {
  code: string;
  name: string;
  credits: number;
  priority: number;
  sessions: Session[];
  options: CourseOptions;
};

export type Session = {
  dates: number[];
  group: number[];
  section: number[];
  isFull?: boolean;
  sectionNotes?: string;
};

export type CourseOptions = {
  group?: number;
  section?: number;
};

export interface CourseGroups {
  [key: string]: string;
}

export type ScheduleOptions = {
  exclude_dates: boolean[];
  maxCredits: number;
  minCredits: number;
  preferMin?: boolean;
  considerDisabled?: boolean;
};
