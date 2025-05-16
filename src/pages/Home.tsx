import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { DOMResponse } from '../types/DOM_messages';
import React, { useEffect, useState } from 'react';
import { DOMErrors } from '../types/DOM_messages';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types/course';
import TestData from '../TestData.json';

const chrome = window.chrome;

function Home() {
  const navigate = useNavigate();
  const [response, setResponse] = useState<DOMResponse>(['00']);

  const navigateToBenchmark = () => {
    if (chrome?.tabs?.create) {
      chrome.tabs.create({ url: document.URL + '#/benchmark' });
    } else {
      navigate('/benchmark');
    }
  };

  const navigateToCourses = (courses: Course[]) => {
    if (chrome?.tabs?.create) {
      chrome.tabs.create({ url: document.URL + '#/courses' });
    } else {
      localStorage.setItem('state:courses', JSON.stringify(TestData.courses));
      localStorage.setItem('state:groups', JSON.stringify(TestData.groups));
      navigate('/courses');
    }

    if (courses) {
      localStorage.setItem('state:groups', JSON.stringify({}));
      localStorage.setItem('state:courses', JSON.stringify(courses));
    }
  };

  useEffect(() => {
    if (chrome?.tabs) {
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
  }, [chrome?.tabs?.sendMessage, chrome?.tabs?.query, chrome?.runtime?.onMessage]);

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
        </Alert>
      )}
      {'\nor\n'}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {process.env.REACT_APP_DEBUG_ENV === 'benchmark' && (
          <Button
            onClick={navigateToBenchmark}
            sx={{
              margin: '.5rem',
              backgroundColor: 'var(--secondary)',
              color: 'white',
              '&:hover': { color: 'inherit' },
            }}
          >
            Benchmark
          </Button>
        )}
        <Button
          onClick={() => navigateToCourses(null)}
          sx={{
            margin: '.5rem',
            backgroundColor: 'var(--secondary)',
            color: 'white',
            '&:hover': { color: 'inherit' },
          }}
        >
          Proceed Manually
        </Button>
      </Box>
    </>
  );
}

export default Home;
