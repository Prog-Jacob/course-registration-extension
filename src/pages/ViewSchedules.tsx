import { SessionTable } from '../components/sessions_table';
import { Alert, Box, Button, Slider } from '@mui/material';
import { Course, ScheduleOptions } from '../types/course';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { IoArrowBackCircle } from 'react-icons/io5';
import Schedule from '../components/schedule/main';
import { Combination } from '../types/combination';
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

  const [solution, setSolution] = useState<Combination | string>();
  const schedules = useRef<Scheduler | string>(
    (() => {
      try {
        return new Scheduler([...courses], { ...options }, { ...groups });
      } catch (e) {
        return (e as Error).message;
      }
    })(),
  );
  const referenceCourses = useRef<Course[][]>(
    (() => {
      if (schedules.current instanceof Scheduler) return schedules.current.getCourses();
      return null;
    })(),
  );
  const validSchedules = useRef<Course[][]>();
  const componentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getSolution();
  }, []);

  const getSolution = () => {
    setSolution(undefined);
    setSolution(() => {
      if (typeof schedules.current != 'string') {
        try {
          unpackSolution(schedules.current.getCombinations());
          return schedules.current.getCombinations();
        } catch (e: unknown) {
          return (e as Error).message;
        }
      }
      return schedules.current;
    });
  };

  const unpackSolution = ({ courses, schedules }: Combination) => {
    validSchedules.current = [];

    for (const schedule of schedules) {
      let i = 0,
        j = 0;
      let mask = courses;
      const solution = [];

      while (mask) {
        if ((mask & 1) == 1) {
          for (const course of referenceCourses.current![i]) {
            const session = course.sessions[schedule.sessions[j]];
            solution.push({
              ...course,
              sessions: [session],
            });
            j++;
          }
        }
        i++;
        mask >>= 1;
      }

      validSchedules.current.push(solution);
    }
  };

  const backToCourses = () => {
    navigate('/courses');
  };

  const handlePrint = useReactToPrint({
    onPrintError: (error) => console.log(error),
    content: () => componentRef.current ?? null,
    removeAfterPrint: true,
  });

  return (
    <>
      {!solution ? (
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
          {typeof schedules.current == 'string' ? (
            <Alert sx={{ margin: '2rem 0', width: 520 }} severity='warning'>
              {schedules.current}
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
                    if (schedules.current instanceof Scheduler) {
                      schedules.current.prev();
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
                    '.MuiSlider-thumb:hover': { boxShadow: '0 0 0 6px rgba(var(--secondary-rgb), .2) !important' },
                    '.MuiSlider-thumb': { boxShadow: 'none !important' },
                  }}
                >
                  <Slider
                    step={1}
                    valueLabelDisplay='auto'
                    min={options.minCredits}
                    max={options.maxCredits}
                    value={schedules.current.getRange()}
                    getAriaValueText={(value) => `${value}CH`}
                    getAriaLabel={() => 'Current Credit Hours Schedules'}
                    onChange={(e) => {
                      if (schedules.current instanceof Scheduler) {
                        schedules.current.setRange(+(e.target as HTMLInputElement).value);
                        getSolution();
                      }
                    }}
                  />
                </Box>
                <Button
                  onClick={() => {
                    if (schedules.current instanceof Scheduler) {
                      schedules.current.next();
                      getSolution();
                    }
                  }}
                  sx={{ backgroundColor: 'var(--secondary) !important' }}
                  variant='contained'
                >
                  Next
                </Button>
              </div>
              {typeof solution == 'string' ? (
                <Alert sx={{ width: 520 }} severity='info'>
                  {solution}
                </Alert>
              ) : (
                <>
                  <Button
                    sx={{ backgroundColor: 'red', float: 'right', marginBottom: '10px' }}
                    endIcon={<AiFillPrinter />}
                    onClick={handlePrint}
                    variant='contained'
                  >
                    Print
                  </Button>
                  <div ref={componentRef}>
                    {validSchedules.current?.map((courses, idx) => (
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
