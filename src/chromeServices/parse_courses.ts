import { clean } from '../modules/DOM';
import { Course } from '../types/course';
import { fetchSessions } from './fetch_sessions';

export async function parseCourses(body: string, studentId: string): Promise<Course[]> {
  const courses: Course[] = [];
  const parser = new DOMParser();
  const viewState = body.match(/__VIEWSTATE\|(.*?)\|/)[1];
  const eventValidation = body.match(/__EVENTVALIDATION\|(.*?)\|/)[1];

  const doc = parser.parseFromString(body, 'text/html');
  const table = doc.getElementById('ctl00_cntphmaster_grdData');
  const rows = Object.values(table.querySelectorAll('.table_Row, .table_AlternatingRow'));
  let rest = Object.values(doc.querySelectorAll(`[id$="hdnENTCDEPKGTYPEID"]`)).reduce(
    (acc, elem: HTMLInputElement) => `${acc}${encodeURIComponent(elem.name)}=${encodeURIComponent(elem.value)}&`,
    '',
  );
  rest = Object.values(doc.querySelectorAll(`[name$="txtNote"]`)).reduce(
    (acc, elem: HTMLInputElement) => `${acc}${encodeURIComponent(elem.name)}=${encodeURIComponent(elem.value)}&`,
    rest,
  );

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('span');
    const name = (rows[i].querySelector(`[id$="_cbSelect"]`) as HTMLInputElement).name;

    try {
      const sessions = await fetchSessions(name, viewState, eventValidation, studentId, rest);
      courses.push({
        code: clean(cells[0].innerHTML),
        name: clean(cells[1].innerHTML),
        credits: parseInt(cells[5].innerHTML),
        sessions: sessions,
        priority: i + 1,
        options: {},
      });
    } catch (error) {
      console.log(error);
    }
  }

  return courses;
}
