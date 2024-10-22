import { DOMMessage, DOMResponse } from '../types/DOM_messages';
import POST_Courses from './POST_Courses';
import GET_Courses from './GET_Courses';

async function handleAsyncResponse(msg: DOMMessage): Promise<DOMResponse> {
  return msg.type === 'GET_Courses'
    ? await GET_Courses()
    : msg.courses && msg.type === 'POST_Courses'
      ? await POST_Courses(msg.courses)
      : ['98'];
}

function messagesFromReactAppListener(
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMResponse) => void
) {
  new Promise((resolve) => resolve(handleAsyncResponse(msg)))
    .then((response) => sendResponse(response as DOMResponse))
    .catch(() => {
      sendResponse(['99']);
    });

  return true;
}

if (typeof chrome != 'undefined')
  chrome?.runtime?.onMessage?.addListener?.(messagesFromReactAppListener);
