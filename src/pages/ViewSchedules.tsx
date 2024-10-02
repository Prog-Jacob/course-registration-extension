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
  const [page, setPage] = useState(1);

  const schedules = useRef<Scheduler | string>(
    (() => {
      try {
        return new Scheduler([...courses], { ...options }, { ...groups });
      } catch (e) {
        return (e as Error).message;
      }
    })()
  );
  const componentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSolution();
  }, []);

  const getSolution = async () => {
    setSolutions(undefined);
    const solutions = (async () => {
      if (typeof schedules.current != 'string') {
        try {
          return await schedules.current.getSolutions();
        } catch (e: unknown) {
          return (e as Error).message;
        }
      }
      return schedules.current;
    })();
    setSolutions(await solutions);
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
