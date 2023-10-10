import { Course } from '../../types/course';

export const defaultData: Course[] = [
  {
    code: 'CSE 110',
    name: 'Introduction to Computer Science',
    credits: 3,
    options: {
      group: 2,
      section: 1,
    },
    priority: 1,
    sessions: [
      {
        dates: [1, 3, 10, 12],
        section: 1,
        group: 2,
      },
      {
        dates: [2, 5],
      },
    ],
  },
  {
    code: 'CSE 111',
    name: 'Introduction to Programming',
    credits: 4,
    options: {
      section: 7,
    },
    priority: 2,
    sessions: [
      {
        dates: [1, 5],
        section: 1,
        group: 2,
      },
      {
        dates: [2, 5],
      },
    ],
  },
  {
    code: 'CSE 210',
    name: 'Data Structures and Algorithms',
    credits: 4,
    options: {
      group: 1,
      section: 2,
    },
    priority: 2,
    sessions: [
      {
        dates: [2, 4, 9, 11, 16],
        section: 2,
        group: 1,
      },
      {
        dates: [3, 6, 13],
        group: 1,
      },
    ],
  },
  {
    code: 'CSE 310',
    name: 'Operating Systems',
    credits: 3,
    options: {
      group: 3,
      section: 1,
    },
    priority: 3,
    sessions: [
      {
        dates: [1, 8, 15],
        section: 1,
        group: 3,
      },
      {
        dates: [5, 12],
        section: 1,
      },
    ],
  },
  {
    code: 'CSE 410',
    name: 'Artificial Intelligence',
    credits: 3,
    options: {
      group: 2,
      section: 3,
    },
    priority: 4,
    sessions: [
      {
        dates: [2, 6, 10, 14],
        section: 3,
        group: 2,
      },
      {
        dates: [4, 8, 12],
        group: 2,
      },
    ],
  },
  {
    code: 'CSE 120',
    name: 'Computer Programming',
    credits: 3,
    options: {
      group: 4,
      section: 1,
    },
    priority: 1,
    sessions: [
      {
        dates: [1, 3, 8, 10, 15],
        section: 1,
        group: 4,
      },
      {
        dates: [2, 9],
      },
    ],
  },
  {
    code: 'CSE 220',
    name: 'Object Oriented Programming',
    credits: 4,
    options: {
      group: 2,
      section: 2,
    },
    priority: 2,
    sessions: [
      {
        dates: [2, 4, 11, 13, 18],
        section: 2,
        group: 2,
      },
      {
        dates: [6, 20],
        section: 2,
      },
    ],
  },
  {
    code: 'CSE 320',
    name: 'Database Systems',
    credits: 3,
    options: {
      group: 1,
      section: 3,
    },
    priority: 3,
    sessions: [
      {
        dates: [3, 5, 12, 14, 19],
        section: 3,
        group: 1,
      },
      {
        dates: [7, 21],
        group: 1,
      },
    ],
  },
  {
    code: 'CSE 420',
    name: 'Software Engineering',
    credits: 3,
    options: {
      group: 3,
      section: 2,
    },
    priority: 4,
    sessions: [
      {
        dates: [1, 6, 13, 15, 20],
        section: 2,
        group: 3,
      },
      {
        dates: [3, 10],
        section: 2,
      },
    ],
  },
  {
    code: 'CSE 230',
    name: 'Digital Logic Design',
    credits: 4,
    options: {
      group: 4,
      section: 3,
    },
    priority: 2,
    sessions: [
      {
        dates: [2, 7, 14, 16, 21],
        section: 3,
        group: 4,
      },
      {
        dates: [4, 11],
        group: 4,
      },
    ],
  },
  {
    code: 'CSE 330',
    name: 'Computer Networks',
    credits: 3,
    options: {
      group: 1,
      section: 1,
    },
    priority: 3,
    sessions: [
      {
        dates: [3, 8, 15, 17, 22],
        section: 1,
        group: 1,
      },
      {
        dates: [5, 12],
        section: 1,
      },
    ],
  },
];
