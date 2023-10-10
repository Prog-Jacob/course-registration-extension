import fetchCourseParams from './fetch_course_params';
import { DOMResponse } from '../types/DOM_messages';
import { fetchCoursesBody } from './fetch_courses';
import { Course } from '../types/course';

export default async function POST_Courses(courses: Course[]): Promise<DOMResponse> {
  const params = await fetchCourseParams();
  if (!params.every(Boolean)) {
    return ['01'];
  }

  const body = await fetchCoursesBody(...params);
  // Parse the body and structure the courses in a way
  // that can be used to iterate and compare it against
  // the courses provided by the user.
  if (courses.length === 0) {
    return ['10'];
  }
  return courses.map((course, idx) => {
    // find the target course in the document that matches the course code.
    if (true) {
      // find the target session that matches the course group, section, and dates.
      if (true) {
        // call the register function.
        if (true) {
          return '19' + idx;
        }
        return '13' + idx;
      }
      return '12' + idx;
    }
    return '11' + idx;
  });
}
