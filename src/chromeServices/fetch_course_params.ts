export default async function fetchCourseParams(): Promise<[viewState: string, eventValidation: string, studentId: string]> {
  const response = await fetch('https://sis.ejust.edu.eg/UI/StudentViewAdmin/STD_CRS_REG_PLN_Grouping.aspx', {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9,ar;q=0.8',
      'sec-ch-ua': '"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
    },
    referrer: 'https://sis.ejust.edu.eg/UI/StudentView/Home.aspx',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
  const body = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(body, 'text/html');
  const viewState = (doc.getElementById('__VIEWSTATE') as HTMLInputElement)?.value;
  const eventValidation = (doc.getElementById('__EVENTVALIDATION') as HTMLInputElement)?.value;
  const studentId = (
    doc.getElementById(
      'ctl00_cntphmaster_ucStudDataGeneralControl_StudentDtlPopup_ucStudDtlsTabsGnrlCtrl_TabHeader1_Tab_UcStudentBasicDataTabs_0_ucTabHeader_Tab_StudBasicData_View_0_txtStudId',
    ) as HTMLInputElement
  )?.value;
  return [viewState?.replace(/^"|"$/g, '').trim(), eventValidation?.replace(/^"|"$/g, '').trim(), studentId?.replace(/^"|"$/g, '').trim()];
}
