import { Course, ScheduleOptions } from '../types/course';
import TipsAndTricks from '../components/tips_and_tricks';
import { FormOptions } from '../components/form_options';
import { useEffect, useState, useRef } from 'react';
import { Table } from '../components/courses/main';
import { CourseGroups } from '../types/course';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import React from 'react';

export const defaultData = {
  groups: {},
  courses: [],
  scheduleOptions: {
    maxCredits: 20,
    minCredits: 14,
    priorities: [
      { id: 'preferShortWeek', label: 'I do [NOT] prefer short weeks.' },
      { id: 'preferShortDays', label: 'I do [NOT] prefer short days.' },
      {
        id: 'preferLateSessions',
        label: 'I do [NOT] prefer attending late sessions.',
        reverse: true,
      },
      {
        id: 'preferEarlySessions',
        label: 'I do [NOT] prefer attending early sessions.',
        reverse: true,
      },
      { id: 'preferLessDays', label: 'I do [NOT] prefer attending less days.' },
    ],
    group: 0,
    section: 0,
    preferMin: false,
    considerDisabled: true,
    exclude_dates: new Array(40).fill(false),
  },
};

function SetOptions() {
  const [originalData, setOriginalData] = useState<Course[]>(
    JSON.parse(localStorage.getItem('state:courses')) || defaultData.courses
  );
  const [isMaxExceeded, setIsMaxExceeded] = useState<boolean>(false);
  const [shouldUpdateCourses, setShouldUpdateCourses] = useState(0);

  const scheduleOptions = useRef<ScheduleOptions>(
    JSON.parse(localStorage.getItem('state:scheduleOptions')) || defaultData.scheduleOptions
  );
  const groups = useRef<CourseGroups>(
    JSON.parse(localStorage.getItem('state:groups')) || defaultData.groups
  );
  const navigate = useNavigate();

  useEffect(() => {
    setOriginalData((old) =>
      old.map((course) => ({
        ...course,
        options: {
          group: scheduleOptions.current.group ?? course.options.group,
          section: scheduleOptions.current.section ?? course.options.section,
        },
      }))
    );
  }, [shouldUpdateCourses]);

  const submitForm = () => {
    const leveledCourses: Course[][] = [];

    originalData.forEach((course, idx) =>
      course.priority == originalData[idx - 1]?.priority
        ? leveledCourses[leveledCourses.length - 1].push(course)
        : leveledCourses.push([course])
    );

    if (leveledCourses.length > 30) {
      if (!isMaxExceeded) {
        setIsMaxExceeded(true);
        setTimeout(() => {
          setIsMaxExceeded(false);
        }, 5000);
      }
      return;
    }

    localStorage.setItem('state:courses', JSON.stringify(originalData));
    localStorage.setItem('state:groups', JSON.stringify(groups.current));
    localStorage.setItem('state:scheduleOptions', JSON.stringify(scheduleOptions.current));

    navigate('/schedules', {
      state: {
        courses: leveledCourses,
        options: scheduleOptions.current,
        groups: groups.current,
      },
    });
  };

  return (
    <>
      {isMaxExceeded && (
        <Alert
          sx={{
            zIndex: 50,
            position: 'fixed',
            top: '0',
            alignItems: 'center',
            fontSize: '14px',
            borderRadius: '0px',
          }}
          severity='error'
        >
          Maximum number of courses reached, use Must Include, Must Exclude, or Co-Requisites to
          group courses together!
        </Alert>
      )}
      <FormOptions
        scheduleOptions={scheduleOptions}
        onClick={submitForm}
        updateCourses={setShouldUpdateCourses}
      />
      <TipsAndTricks />
      <Table originalData={originalData} setOriginalData={setOriginalData} groups={groups} />
    </>
  );
}

export default SetOptions;
