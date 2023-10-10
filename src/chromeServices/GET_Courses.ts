import fetchCourseParams from './fetch_course_params';
import { DOMResponse } from '../types/DOM_messages';
import fetchCourses from './fetch_courses';

export default async function GET_Courses(): Promise<DOMResponse> {
  const params = await fetchCourseParams();
  if (!params.every(Boolean)) {
    return ['01'];
  }

  const courses = await fetchCourses(...params);
  if (courses.length === 0) {
    return ['02'];
  }

  return courses;
}
