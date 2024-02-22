import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import { DOMResponse } from '../types/DOM_messages';
import React, { useEffect, useState } from 'react';
import { DOMErrors } from '../types/DOM_messages';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types/course';

function Home() {
  const navigate = useNavigate();
  const [response, setResponse] = useState<DOMResponse>(['00']);

  const navigateToCourses = (courses: Course[]) => {
    if (chrome.tabs != undefined) {
      chrome.tabs.create({ url: document.URL + '#/courses' });
    } else {
      navigate('/courses');
    }

    localStorage.setItem(
      'state',
      JSON.stringify({
        courses,
        options: { exclude_dates: new Array(40).fill(false), maxCredits: 20, minCredits: 14 },
        retrievedCourseOptions: { group: 0, section: 0 },
      }),
    );
  };

  useEffect(() => {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const url = tab.url;

        if (url?.includes('sis.ejust.edu.eg')) {
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
      ) : response.length && typeof response[0] != 'string' ? (
        navigateToCourses(response as Course[])
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
          {' or '}
          {
            <Button
              onClick={() => navigateToCourses([])}
              sx={{ margin: '.5rem', backgroundColor: 'var(--secondary)', color: 'white', '&:hover': { color: 'inherit' } }}
            >
              Proceed Manually
            </Button>
          }
        </Alert>
      )}
    </>
  );
}

export default Home;
