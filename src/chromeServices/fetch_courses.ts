import { parseCourses } from './parse_courses';
import { Course } from '../types/course';

export default async function fetchCourses(
  viewState: string,
  eventValidation: string
): Promise<Course[]> {
  const body = await fetchCoursesBody(viewState, eventValidation);
  const courses = await parseCourses(body);
  return courses.map((course, index) => ({ ...course, priority: index + 1 }));
}

export async function fetchCoursesBody(
  viewState: string,
  eventValidation: string
): Promise<string> {
  viewState = encodeURIComponent(viewState);
  eventValidation = encodeURIComponent(eventValidation);
  try {
    const response = await fetch(
      'https://sis.ejust.edu.eg/UI/StudentViewAdmin/STD_CRS_REG_PLN_Grouping.aspx',
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-microsoftajax': 'Delta=true',
          'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://sis.ejust.edu.eg/UI/StudentViewAdmin/STD_CRS_REG_PLN_Grouping.aspx',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `ctl00%24ScriptManager1=ctl00%24cntphmaster%24updPnlStudCourseReg%7Cctl00%24cntphmaster%24lnkAddNewReg&__EVENTTARGET=ctl00%24cntphmaster%24lnkAddNewReg&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATEGENERATOR=8143B670&__VIEWSTATEENCRYPTED=&ctl00_ASPxPopupControl1WS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A-10000%3A-10000%3A1&ctl00%24FixNumericBoxProblem=&ctl00%24txtFixCalendarProblem=&ctl00%24MaskedBirthDate_ClientState=&ctl00%24txtSearch=&ctl00%24cntphmaster%24hdnchkconfirm=&ctl00%24cntphmaster%24hdnRegMthdFlg=1&ctl00%24cntphmaster%24hdnRegNewCourse=&ctl00_cntphmaster_AspPopubReptdCrsWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A850px%3A-10000%3A1&ctl00%24cntphmaster%24AspPopubReptdCrs%24txtRepeatedCrs=&ctl00%24cntphmaster%24hdnExceptional=&ctl00_cntphmaster_OtherCoursePopUpWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A850px%3A-10000%3A1&ctl00%24cntphmaster%24OtherCoursePopUp%24txtCourseCode=&ctl00%24cntphmaster%24ucRegisteredCourses%24hidIndex=&ctl00%24cntphmaster%24ucRegisteredCourses%24hdnOldCourse=&ctl00%24cntphmaster%24ucRegisteredCourses%24hdnCourseRegId=&ctl00%24cntphmaster%24ucRegisteredCourses%24hdnGroupFlg=0&ctl00_cntphmaster_ucRegisteredCourses_ReplaceCoursePopUpWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A850px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24ReplaceCoursePopUp%24txtcrscode=&ctl00%24cntphmaster%24ucRegisteredCourses%24ReplaceCoursePopUp%24HdnNewcrsid=&ctl00_cntphmaster_ucRegisteredCourses_PopupCommentWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A850px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupComment%24txtComment=&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupComment%24hdnEdStudCourseRegId=&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupComment%24hdnCommentRowIndex=&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupComment%24hdnActionType=&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupComment%24hdnChngResnId=&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupComment%24hdnCommentSavedSuccess=&ctl00_cntphmaster_ucRegisteredCourses_NotePopupWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A950px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24NotePopup%24txtNotes=&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseReplaceWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A800px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupCourseReplace%24txtCourseCode=&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseChangeReasonWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupCourseChangeReason%24drpChangeReason=0&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseUnDropWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupCourseUnDrop%24UCRegisterAddReplaceCourseDirect_Grouping1%24Select=rdbAcadPlan&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupCourseUnDrop%24UCRegisterAddReplaceCourseDirect_Grouping1%24txtCourseCode=&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseUnDrop_UCRegisterAddReplaceCourseDirect_Grouping1_PopupCourseChangeReasonWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupCourseUnDrop%24UCRegisterAddReplaceCourseDirect_Grouping1%24PopupCourseChangeReason%24drpChangeReason=0&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseUnDrop_UCRegisterAddReplaceCourseDirect_Grouping1_NotePopupWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupCourseUnDrop%24UCRegisterAddReplaceCourseDirect_Grouping1%24NotePopup%24txtNotes=&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseUnDrop_UCRegisterAddReplaceCourseDirect_Grouping1_PopupAddCourseWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A600px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseUnDrop_UCRegisterAddReplaceCourseDirect_Grouping1_PopupTimeTableWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A600px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseUnDrop_UCRegisterAddReplaceCourseDirect_Grouping1_PopupCourseSectionConWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_PopupSrchCourseSectionWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A999px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupSrchCourseSection%24ucRegisterAddReplaceCourse%24Select=rdbAcadPlan&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupSrchCourseSection%24ucRegisterAddReplaceCourse%24txtCourseCode=&ctl00_cntphmaster_ucRegisteredCourses_PopupSrchCourseSection_ucRegisterAddReplaceCourse_PopupCourseChangeReasonWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupSrchCourseSection%24ucRegisterAddReplaceCourse%24PopupCourseChangeReason%24drpChangeReason=0&ctl00_cntphmaster_ucRegisteredCourses_PopupSrchCourseSection_ucRegisterAddReplaceCourse_NotePopupWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24PopupSrchCourseSection%24ucRegisterAddReplaceCourse%24NotePopup%24txtNotes=&ctl00_cntphmaster_ucRegisteredCourses_PopupSrchCourseSection_ucRegisterAddReplaceCourse_PopupAddCourseWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A600px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_PopupSrchCourseSection_ucRegisterAddReplaceCourse_PopupTimeTableWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A600px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_PopupSrchCourseSection_ucRegisterAddReplaceCourse_PopupCourseSectionConWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_popupDirectCoursesWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A999px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24popupDirectCourses%24ucDirectRegisterAddReplaceCourse%24Select=rdbAcadPlan&ctl00%24cntphmaster%24ucRegisteredCourses%24popupDirectCourses%24ucDirectRegisterAddReplaceCourse%24txtCourseCode=&ctl00_cntphmaster_ucRegisteredCourses_popupDirectCourses_ucDirectRegisterAddReplaceCourse_PopupCourseChangeReasonWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24popupDirectCourses%24ucDirectRegisterAddReplaceCourse%24PopupCourseChangeReason%24drpChangeReason=0&ctl00_cntphmaster_ucRegisteredCourses_popupDirectCourses_ucDirectRegisterAddReplaceCourse_NotePopupWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24cntphmaster%24ucRegisteredCourses%24popupDirectCourses%24ucDirectRegisterAddReplaceCourse%24NotePopup%24txtNotes=&ctl00_cntphmaster_ucRegisteredCourses_popupDirectCourses_ucDirectRegisterAddReplaceCourse_PopupAddCourseWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A600px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_popupDirectCourses_ucDirectRegisterAddReplaceCourse_PopupTimeTableWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A600px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_popupDirectCourses_ucDirectRegisterAddReplaceCourse_PopupCourseSectionConWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_PopupTimeTableWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A600px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_PopupCourseSectionConWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00_cntphmaster_ucRegisteredCourses_PopupFindCoursesWS=0%3A0%3A-1%3A-10000%3A-10000%3A0%3A500px%3A-10000%3A1&ctl00%24txthdndegreeclassctrl_Ids=0&DXScript=1_42%2C1_74%2C1_67%2C1_64&__ASYNCPOST=true&__VIEWSTATE=${viewState}&__EVENTVALIDATION=${eventValidation}&`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      }
    );
    return response.text();
  } catch {
    return '';
  }
}
