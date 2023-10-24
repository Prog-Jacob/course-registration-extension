import { Dispatch, RefObject, SetStateAction, useRef, useState } from 'react';
import { Alert, Button, IconButton } from '@mui/material';
import { Course } from '../types/course';
import { createRoot } from 'react-dom/client';
import { SlCalender } from 'react-icons/sl';
import { flatten } from './courses/main';
import Schedule from './schedule/main';
import '../styles/popup_schedule.css';
import { MouseEvent } from 'react';
import '../styles/add_course.css';
import React from 'react';

const table: [string, string][] = [
  ['Course Name', 'name'],
  ['Course Code', 'code'],
  ['Credits', 'credits'],
];

const nestedTable = (idx: number): [string, number, string][] => [
  ['Group', idx, 'group'],
  ['Section', idx, 'section'],
  ['Schedule', idx, 'dates'],
];

export const AddCourseTable = ({ setData }: { setData: Dispatch<SetStateAction<Course[]>> }) => {
  const rowIdx = useRef<number>(0);
  const course = useRef<Course>({
    name: '',
    code: '',
    credits: 0,
    priority: 999,
    sessions: [],
    options: {},
  });

  const insertSession = () => {
    const tableElement = document.getElementById('add-course-table') as HTMLTableElement;
    const idx = rowIdx.current;
    const row = tableElement.insertRow(-1);
    row.setAttribute('key', 'row_' + idx);
    course.current.sessions[idx] = {
      dates: [],
      group: [],
      section: [],
    };
    createRoot(row).render(<CreateRow rowIdx={idx} course={course} />);
    ++rowIdx.current;
  };

  const submitCourse = () => {
    const copyCourse = { ...course.current };
    copyCourse.sessions.forEach((session) => {
      session.dates = session.dates.filter((date) => date != undefined);
    });
    copyCourse.sessions = copyCourse.sessions.filter((session) => session.dates.length > 0);
    if (copyCourse.code && copyCourse.name && copyCourse.credits && copyCourse.sessions.length) {
      setData((old) => flatten([...old, copyCourse].sort((a, b) => a.priority - b.priority)));
      closeWindow();
    } else {
      const alert = document.getElementById('SubmitCourseAlert');
      if (alert) {
        alert.style.display = 'flex';
        setTimeout(() => {
          alert.style.display = 'none';
        }, 5000);
      }
      return;
    }
  };

  const closeWindow = () => {
    document.getElementById('add-course-container')!.remove();
  };

  const CreateRow = ({ rowIdx, course }: { rowIdx: number; course: RefObject<Course> }) => {
    const [showSchedule, setShowSchedule] = useState(false);

    const toggleSchedule = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      document.body.style.overflow = showSchedule ? 'auto' : 'hidden';
      setShowSchedule(!showSchedule);
    };

    return (
      <>
        {nestedTable(rowIdx).map(([_, __, id]) => (
          <td key={`cell_${id}`}>
            {id != 'dates' ? (
              <input
                key={`input_${id}`}
                type={'number'}
                onChange={(e) => {
                  const value = e.target.value;
                  if (+value > 0) course.current!.sessions[rowIdx][id].push(+value);
                }}
              />
            ) : (
              <div>
                <div className='popup popup-schedule' style={{ zIndex: 200, display: showSchedule ? '' : 'none' }}>
                  <button className='popup-schedule-close' onClick={toggleSchedule}>
                    X
                  </button>
                  <Schedule idx={rowIdx} courseOptions={course} />
                </div>
                <IconButton className='required-input' onClick={toggleSchedule} sx={{ margin: 0, padding: 0, height: 25 }}>
                  <SlCalender color='black' size={20} />
                </IconButton>
              </div>
            )}
          </td>
        ))}
      </>
    );
  };

  return (
    <div id='add-course-container' className='popup'>
      <Alert
        id='SubmitCourseAlert'
        sx={{
          zIndex: 250,
          position: 'fixed',
          top: '0',
          display: 'none',
          alignItems: 'center',
          fontSize: '14px',
          borderRadius: '0px',
        }}
        severity='error'
      >
        Complete all required fields or cancel instead!
      </Alert>

      <Button onClick={closeWindow} sx={{ margin: '.5rem', backgroundColor: 'red !important' }} variant='contained'>
        Cancel
      </Button>
      <table id='add-course-table'>
        <thead>
          <tr>
            {table.map(([header, id]) => (
              <th key={id}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className='course-table-body'>
          <tr key='body' style={{ background: '#EEE', border: 'none', margin: '0' }}>
            {table.map(([_, id]) => (
              <td className='required-input' key={`cell_${id}`}>
                <input
                  required
                  key={'input_' + id}
                  type={id == 'credits' ? 'number' : 'text'}
                  min={1}
                  onChange={(e) => {
                    const value = e.target.value;
                    course.current[id] = +value > 0 ? +value : value.toUpperCase();
                  }}
                />
              </td>
            ))}
          </tr>
          <tr key='header'>
            {nestedTable(0).map(([header, _, id]) => (
              <th key={`header_${id}`}>{header}</th>
            ))}
          </tr>
        </tbody>
      </table>
      <div style={{ display: 'flex', width: '500px', alignItems: 'center', justifyContent: 'space-around', margin: '.5rem 0' }}>
        <Button onClick={insertSession} sx={{ backgroundColor: 'var(--secondary) !important' }} variant='contained'>
          Add session
        </Button>
        <Button onClick={submitCourse} sx={{ backgroundColor: 'var(--secondary) !important' }} variant='contained'>
          Submit Course
        </Button>
      </div>
    </div>
  );
};
