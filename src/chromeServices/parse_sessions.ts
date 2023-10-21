import { clean } from '../modules/DOM';
import { Session } from '../types/course';

const days = { su: 0, mo: 1, tu: 2, we: 3, th: 4 };
const today = '2023-10-17 ';
const dates = [
  new Date(today + '09:45 AM'),
  new Date(today + '10:30 AM'),
  new Date(today + '11:30 AM'),
  new Date(today + '12:15 PM'),
  new Date(today + '01:15 PM'),
  new Date(today + '02:00 PM'),
  new Date(today + '03:00 PM'),
  new Date(today + '03:45 PM'),
];

export default function parseSessions(body: string): Session[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(body, 'text/html');
  const table = doc.getElementById('ctl00_cntphmaster_ucRegisterAddReplaceCourseDirect_grdCourseSections');
  const rows = table.querySelectorAll('.table_Row, .table_AlternatingRow');
  const sessionDates: Set<number> = new Set();
  const sections: Set<number> = new Set();
  const groups: Set<number> = new Set();
  const sessions: Object = {};
  let isDisabled = false;
  let sessionState = '';

  Object.values(rows).forEach((row) => {
    const check = row.querySelector(`[id$="_cbSelectGroup"]`) as HTMLInputElement;
    const status = clean(row.querySelector(`[id$="_lblSecStatus"]`).innerHTML).toLowerCase();

    if (check) {
      AddSessions();
      sessionState = status;
      isDisabled = check.disabled;
    }
    if (isDisabled && sessionState == 'schedule conflict') return;

    const day = clean(row.querySelector(`[id$="_lblDays"]`).innerHTML).toLocaleLowerCase();
    const from = new Date(today + clean(row.querySelector(`[id$="_lblFrom"]`).innerHTML));
    const to = new Date(today + clean(row.querySelector(`[id$="_lblTo"]`).innerHTML));
    const section = clean(row.querySelector(`[id$="_lblSection"]`).innerHTML);

    Array.from(day.matchAll(/[a-z]{2}/gi)).forEach((d) => {
      dates.forEach((date, idx) => {
        if (date > from && date <= to) sessionDates.add(days[d[0]] * 8 + idx);
      });
    });

    const regexSection = /(?:s|sec|section)\s?(\d{1,2}(?:\s?(?:and|&amp;|&|,|-)\s?\d{1,2})*)/i;
    const regexGroup = /(?:g|group)\s?(\d{1,2}(?:\s?(?:and|&amp;|&|,|-)\s?\d{1,2})*)/i;
    const matchSection = section.match(regexSection);
    const matchGroup = section.match(regexGroup);

    if (matchSection) Array.from(matchSection[1].matchAll(/\d+/g)).forEach((elem) => sections.add(+elem[0]));
    if (matchGroup) Array.from(matchGroup[1].matchAll(/\d+/g)).forEach((elem) => groups.add(+elem[0]));
  });

  AddSessions();
  return Object.values(sessions);

  function AddSessions() {
    if (!sessionDates.size) return;
    const sectionsArr = Array.from(sections);

    for (let sec = 0; sec < Math.max(1, sectionsArr.length); sec++) {
      const groupsArr = Array.from(groups);

      for (let gr = 0; gr < Math.max(1, groupsArr.length); gr++) {
        const session: Session = {
          group: groupsArr[gr],
          section: sectionsArr[sec],
          dates: Array.from(sessionDates),
          isDisabled: isDisabled,
        };
        sessions[JSON.stringify(session)] = session;
      }
    }

    groups.clear();
    sections.clear();
    sessionDates.clear();
  }
}
