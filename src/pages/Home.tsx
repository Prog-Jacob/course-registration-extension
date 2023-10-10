import { DOMResponse } from '../types/DOM_messages';
import React, { useEffect, useState } from 'react';
import { DOMErrors } from '../types/DOM_messages';
import { Navigate } from 'react-router-dom';
import { Alert, CircularProgress, Stack } from '@mui/material';

function Home() {
  const [response, setResponse] = useState<DOMResponse>(['00']);

  useEffect(() => {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const url = tab.url;

        if (url.includes('sis.ejust.edu.eg')) {
          setResponse(undefined);
          chrome.tabs.sendMessage(tab.id, { type: 'GET_Courses' }, (response: DOMResponse) => {
            setResponse(response);
          });
        }
      });
    }
  }, []);

  return (
    <>
      {!response ? (
        <Stack sx={{ color: 'var(--secondary)' }} spacing={2} direction='row'>
          <CircularProgress color='inherit' />
        </Stack>
      ) : response.length > 1 ? (
        <Navigate
          to='/courses'
          state={{
            courses: [...response],
            options: {
              exclude_dates: new Array(40).fill(false),
              maxCredits: 20,
              minCredits: 14,
            },
            retrievedCourseOptions: {
              group: 0,
              section: 0,
            },
          }}
        />
      ) : (
        <Alert
          id='SubmitAlert'
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
          }}
          severity='warning'
        >
          {DOMErrors[response[0] as string]}
        </Alert>
      )}
    </>
  );
}

export default Home;
