import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { useAnalytics, ANALYTICS_EVENTS } from '../services/analytics';
import { DOMResponse } from '../types/DOM_messages';
import React, { useEffect, useState } from 'react';
import { DOMErrors } from '../types/DOM_messages';
import { useNavigate } from 'react-router-dom';
import packageInfo from '../../package.json';
import { Course } from '../types/course';
import TestData from '../TestData.json';

const chrome = window.chrome;

function Home() {
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [response, setResponse] = useState<DOMResponse>(['00']);

  // Track extension activation
  useEffect(() => {
    track(ANALYTICS_EVENTS.EXTENSION_ACTIVATED, {
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      app_version: packageInfo.version,
    });
  }, [track]);

  const navigateToBenchmark = () => {
    track(ANALYTICS_EVENTS.PAGE_NAVIGATED, {
      from_page: 'home',
      to_page: 'benchmark',
      navigation_method: 'button_click',
    });

    if (chrome?.tabs?.create) {
      chrome.tabs.create({ url: document.URL + '#/benchmark' });
    } else {
      navigate('/benchmark');
    }
  };

  const navigateToCourses = (courses: Course[]) => {
    track(ANALYTICS_EVENTS.PAGE_NAVIGATED, {
      from_page: 'home',
      to_page: 'courses',
      navigation_method: 'button_click',
      has_courses: !!courses,
      course_count: courses?.length || 0,
    });

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

  // If DOM scraping returned courses, navigate programmatically (do not render void in JSX)
  useEffect(() => {
    if (response && response.length && typeof response[0] !== 'string') {
      navigateToCourses(response as Course[]);
    }
  }, [response]);

  useEffect(() => {
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const url = tab.url;

        if (url?.includes('sis.ejust.edu.eg')) {
          setResponse(undefined);
          chrome.tabs.sendMessage(tab.id, { type: 'GET_Courses' }, (response: DOMResponse) => {
            setResponse(response);

            // Track course loading result
            if (response && response.length > 0) {
              if (typeof response[0] === 'string') {
                // Error occurred
                track(ANALYTICS_EVENTS.DOM_PARSE_FAILED, {
                  error_code: response[0],
                  error_message: DOMErrors[response[0] as string],
                  url: url,
                  timestamp: Date.now(),
                });
              } else {
                // Success - courses loaded
                track(ANALYTICS_EVENTS.COURSES_LOADED, {
                  course_count: response.length,
                  url: url,
                  timestamp: Date.now(),
                  source: 'sis_page',
                });
              }
            }
          });
        }
      });
    }
  }, [chrome?.tabs?.sendMessage, chrome?.tabs?.query, chrome?.runtime?.onMessage, track]);

  return (
    <>
      {!response ? (
        <Stack sx={{ color: 'var(--secondary)' }} spacing={2} direction='row'>
          <CircularProgress color='inherit' />
        </Stack>
      ) : typeof response[0] === 'string' ? (
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
      ) : null}
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
