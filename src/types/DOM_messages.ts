import { Course } from './course';

export type DOMMessage = {
  type: 'GET_Courses' | 'POST_Courses';
  courses?: Course[];
};

export type DOMResponse = Course[] | string[];

export const DOMErrors = {
  // User is not in the SIS page.
  '00': 'Please, make sure to open the SIS page!',
  // Couldn't fetch page params before fetching courses.
  '01': 'Please, make sure you are logged in!',
  // Couldn't fetch courses even though params are valid.
  '02': "Couldn't get courses. Please, make sure that registration is open!",
  // Couldn't fetch page params before fetching sessions.
  '03': "Couldn't fetch page params before fetching sessions.",
  // Couldn't fetch sessions even though params are valid.
  '04': "Couldn't get sessions.",

  '10': "Couldn't register for course. Please, provide any course to register for!",
  '11': "Couldn't register for course. Course not found!",
  '12': "Couldn't register for course. Session not found!",
  '13': "Couldn't register for course. SIS error!",
  '19': 'Successfully registered this course.',

  '98': 'Unkown Request.',
  '99': 'Unexpected Error.',
};
