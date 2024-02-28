export default async function fetchCourseParams(): Promise<[viewState: string, eventValidation: string]> {
  const response = await fetch('https://sis.ejust.edu.eg/UI/StudentViewAdmin/STD_CRS_REG_PLN_Grouping.aspx', {
    referrer: 'https://sis.ejust.edu.eg/UI/StudentView/Home.aspx',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
  if (response.redirected) return [null, null];
  const body = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(body, 'text/html');
  const viewState = (doc.getElementById('__VIEWSTATE') as HTMLInputElement)?.value;
  const eventValidation = (doc.getElementById('__EVENTVALIDATION') as HTMLInputElement)?.value;
  return [cleanString(viewState), cleanString(eventValidation)];
}

export function cleanString(str: string): string {
  return str.replace(/^"|"$/g, '').trim();
}
