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

export interface Option {
  id:
    | 'preferShortWeek'
    | 'preferLessDays'
    | 'preferShortDays'
    | 'preferEarlySessions'
    | 'preferLateSessions';
  reverse: boolean;
  label: string;
}

export type ScheduleOptions = {
  priorities: Option[];
  exclude_dates: boolean[];
  maxCredits: number;
  minCredits: number;
  group: number;
  section: number;
  preferMin: boolean;
  considerDisabled: boolean;
};

export type ScheduleProperties = {
  startOfTheWeek: number;
  endOfTheWeek: number;
  totalFreeDays: number;
  totalEarlySessions: number;
  totalLateSessions: number;
};
