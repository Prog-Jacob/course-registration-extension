import { useAnalytics, ANALYTICS_EVENTS, trackAsyncPerformance } from '../services/analytics';
import { SessionTable } from '../components/sessions_table';
import { Alert, Box, Button, Slider } from '@mui/material';
import { Course, ScheduleOptions } from '../types/course';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { IoArrowBackCircle } from 'react-icons/io5';
import Schedule from '../components/schedule/main';
import { useReactToPrint } from 'react-to-print';
import { CourseGroups } from '../types/course';
import { AiFillPrinter } from 'react-icons/ai';
import Scheduler from '../services/scheduler';
import React from 'react';

function ViewSchedules() {
  const {
    courses,
    options,
    groups,
  }: {
    courses: Course[][];
    options: ScheduleOptions;
    groups: CourseGroups;
  } = history.state.usr ?? {};
  if (!courses || !options || !groups) return <Navigate to='/courses' />;

  const [solutions, setSolutions] = useState<Course[][] | string>();
  const [schedules, setSchedules] = useState<Scheduler | string>();
  const [page, setPage] = useState(1);

  const componentRef = useRef(null);
  const navigate = useNavigate();
  const { track } = useAnalytics();

  // Track page view
  useEffect(() => {
    track(ANALYTICS_EVENTS.PAGE_NAVIGATED, {
      page: 'view_schedules',
      timestamp: Date.now(),
      course_count: courses.flat().length,
      course_groups: courses.length,
      has_groups: Object.keys(groups).length > 0,
    });
  }, [track, courses, groups]);

  useEffect(() => {
    async function setScheduler() {
      try {
        // Use performance tracking utility for scheduler initialization
        const { result: scheduler, duration } = await trackAsyncPerformance(
          'scheduler_init',
          async () => {
            const scheduler = new Scheduler([...courses], { ...options }, { ...groups });
            await scheduler.init();
            return scheduler;
          },
          {
            trackEvent: true,
            eventName: ANALYTICS_EVENTS.SCHEDULING_PERFORMANCE,
            additionalProperties: {
              course_count: courses.flat().length,
              timestamp: Date.now(),
            },
          }
        );

        setSchedules(scheduler);

        // Track successful scheduler initialization
        track(ANALYTICS_EVENTS.SCHEDULE_GENERATION_SUCCESS, {
          operation: 'scheduler_init',
          duration_ms: duration,
          course_count: courses.flat().length,
          timestamp: Date.now(),
        });
      } catch (e) {
        setSchedules((e as Error).message);

        // Track scheduler initialization error
        track(ANALYTICS_EVENTS.SCHEDULE_GENERATION_FAILED, {
          error_type: 'scheduler_init_failed',
          error_message: (e as Error).message,
          course_count: courses.flat().length,
          timestamp: Date.now(),
        });
      }
    }
    setScheduler();
  }, []);

  useEffect(() => {
    getSolution();
  }, [schedules]);

  const getSolution = async () => {
    setSolutions(undefined);
    const solutions = (async () => {
      if (schedules instanceof Scheduler) {
        try {
          // Use performance tracking utility for solution generation
          const { result, duration } = await trackAsyncPerformance(
            'get_solutions',
            async () => await schedules.getSolutions(),
            {
              trackEvent: true,
              eventName: ANALYTICS_EVENTS.SCHEDULING_PERFORMANCE,
              additionalProperties: {
                course_count: courses.flat().length,
                timestamp: Date.now(),
              },
            }
          );

          // Track successful schedule generation
          if (Array.isArray(result)) {
            track(ANALYTICS_EVENTS.SCHEDULE_GENERATION_SUCCESS, {
              solution_count: result.length,
              course_count: courses.flat().length,
              timestamp: Date.now(),
            });
          }

          return result;
        } catch (e: unknown) {
          // Track solution generation error
          track(ANALYTICS_EVENTS.SCHEDULE_GENERATION_FAILED, {
            error_type: 'solution_generation_failed',
            error_message: (e as Error).message,
            course_count: courses.flat().length,
            timestamp: Date.now(),
          });
          return (e as Error).message;
        }
      }
      return schedules;
    })();
    setSolutions(await solutions);
  };

  const backToCourses = () => {
    track(ANALYTICS_EVENTS.PAGE_NAVIGATED, {
      from_page: 'view_schedules',
      to_page: 'set_options',
      navigation_method: 'button_click',
      timestamp: Date.now(),
    });
    navigate('/courses');
  };

  const handlePrint = useReactToPrint({
    onPrintError: (error) => {
      console.log(error);
      track(ANALYTICS_EVENTS.ERROR_OCCURRED, {
        error_type: 'print_failed',
        error_message: error,
        timestamp: Date.now(),
      });
    },
    onAfterPrint: () => {
      track(ANALYTICS_EVENTS.SCHEDULE_PRINTED, {
        timestamp: Date.now(),
        course_count: courses.flat().length,
      });
    },
    content: () => componentRef.current ?? null,
    removeAfterPrint: true,
  });

  return (
    <>
      {!solutions ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <div style={{ flex: 1 }}>
          <Button
            onClick={backToCourses}
            sx={{ backgroundColor: 'var(--secondary) !important' }}
            variant='contained'
            startIcon={<IoArrowBackCircle />}
          >
            Back to courses
          </Button>
          {typeof schedules == 'string' ? (
            <Alert sx={{ margin: '2rem 0', width: 520 }} severity='warning'>
              {schedules}
            </Alert>
          ) : (
            <>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '1rem 0',
                }}
              >
                <Button
                  onClick={() => {
                    if (schedules instanceof Scheduler) {
                      schedules.prev();
                      getSolution();
                    }
                  }}
                  sx={{ backgroundColor: 'var(--secondary) !important' }}
                  variant='contained'
                >
                  Previous
                </Button>
                <Box
                  sx={{
                    width: '50%',
                    '.MuiSlider-root': { color: 'var(--secondary) !important' },
                    '.MuiSlider-thumb:hover': {
                      boxShadow: '0 0 0 6px rgba(var(--secondary-rgb), .2) !important',
                    },
                    '.MuiSlider-thumb': { boxShadow: 'none !important' },
                  }}
                >
                  <Slider
                    step={1}
                    valueLabelDisplay='auto'
                    min={options.minCredits}
                    max={options.maxCredits}
                    value={schedules.getRange()}
                    getAriaValueText={(value) => `${value}CH`}
                    getAriaLabel={() => 'Current Credit Hours Schedules'}
                    onChange={(e) => {
                      if (schedules instanceof Scheduler) {
                        schedules.setRange(+(e.target as HTMLInputElement).value);
                        getSolution();
                      }
                    }}
                  />
                </Box>
                <Button
                  onClick={() => {
                    if (schedules instanceof Scheduler) {
                      schedules.next();
                      getSolution();
                    }
                  }}
                  sx={{ backgroundColor: 'var(--secondary) !important' }}
                  variant='contained'
                >
                  Next
                </Button>
              </div>
              {typeof solutions == 'string' ? (
                <Alert sx={{ width: 520 }} severity='info'>
                  {solutions}
                </Alert>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      sx={{ backgroundColor: 'red', marginBottom: '10px' }}
                      endIcon={<AiFillPrinter />}
                      onClick={handlePrint}
                      variant='contained'
                    >
                      Print
                    </Button>
                  </div>
                  <div
                    ref={componentRef}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    {solutions.slice(0, page * 10).map((courses, idx) => (
                      <div key={idx} style={{ margin: '1rem 0' }}>
                        <Schedule
                          key={`schedule_${idx}`}
                          courses={courses.map((course) => ({
                            name: course.code,
                            dates: (() => {
                              const ans = new Array(40).fill(false);
                              course.sessions[0].dates.forEach((date) => (ans[date] = true));
                              return ans;
                            })(),
                          }))}
                        />
                        <br />
                        <SessionTable key={`table_${idx}`} courses={courses} />
                      </div>
                    ))}
                  </div>
                  {page * 10 < solutions.length && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button className='form-submit' onClick={() => setPage((p) => p + 1)}>
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ViewSchedules;
