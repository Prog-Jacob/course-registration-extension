import { Course, CourseOptions, ScheduleOptions } from '../types/course';
import TipsAndTricks from '../components/tips_and_tricks';
import { FormOptions } from '../components/form_options';
import { useEffect, useState, useRef } from 'react';
import { Table } from '../components/courses/main';
import { CourseGroups } from '../types/course';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import React from 'react';

export const levelCourses = (courses: Course[]) => {
  const leveledCourses: Course[][] = [];

  courses.forEach((course, idx) =>
    course.priority == courses[idx - 1]?.priority
      ? leveledCourses[leveledCourses.length - 1].push(course)
      : leveledCourses.push([course])
  );

  return leveledCourses;
};

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

function SetOptions({ submitForm, children }: { submitForm?; children?: React.ReactNode }) {
  const [originalData, setOriginalData] = useState<Course[]>(
    JSON.parse(localStorage.getItem('state:courses')) || defaultData.courses
  );
  const [isMaxExceeded, setIsMaxExceeded] = useState<boolean>(false);
  const [courseOptions, setCourseOptions] = useState<CourseOptions>({});

  const scheduleOptions = useRef<ScheduleOptions>(
    JSON.parse(sessionStorage.getItem('state:options')) || defaultData.scheduleOptions
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
          group: courseOptions.group ?? course.options.group,
          section: courseOptions.section ?? course.options.section,
        },
      }))
    );
  }, [courseOptions]);

  submitForm =
    submitForm ??
    ((courses, groups, options, isMaxExceeded, setIsMaxExceeded) => {
      const leveledCourses = levelCourses(courses);
      if (leveledCourses.length > 30) {
        if (!isMaxExceeded) {
          setIsMaxExceeded(true);
          setTimeout(() => {
            setIsMaxExceeded(false);
          }, 5000);
        }
        return;
      }

      localStorage.setItem('state:groups', JSON.stringify(groups));
      localStorage.setItem('state:courses', JSON.stringify(courses));
      sessionStorage.setItem('state:options', JSON.stringify(options));

      navigate('/schedules', {
        state: {
          courses: leveledCourses,
          options,
          groups,
        },
      });
    });

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
        onClick={() =>
          submitForm(
            originalData,
            groups.current,
            scheduleOptions.current,
            isMaxExceeded,
            setIsMaxExceeded
          )
        }
        setCourseOptions={setCourseOptions}
      >
        {children}
      </FormOptions>
      <TipsAndTricks />
      <Table originalData={originalData} setOriginalData={setOriginalData} groups={groups} />
    </>
  );
}

export default SetOptions;
