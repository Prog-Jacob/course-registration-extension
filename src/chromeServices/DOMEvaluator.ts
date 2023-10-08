import fetchCourseParams from './fetch_course_params';
import fetchCourses from './fetch_courses';

async function getCourses() {
  if (window.location.protocol !== 'chrome-extension:') {
    const params = await fetchCourseParams();
    await fetchCourses(...params);
    const btn = document.createElement('BUTTON');
    const t = document.createTextNode('CLICK ME');
    btn.appendChild(t);
    document.body.appendChild(btn);
  }
}

getCourses();

// const messagesFromReactAppListener = (
//     msg: any,
//     sender: chrome.runtime.MessageSender,
//     sendResponse: (response: any) => void) => {

//     const response: any = {
//         // The desired content of the page.
//         // Grap the content from the DOM (document).
//     };

//     sendResponse(response);
// }

// chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
export default 'hello';
