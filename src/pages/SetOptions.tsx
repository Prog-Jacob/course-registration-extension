import { Course, CourseOptions, ScheduleOptions } from '../utilities/course.types';
import { FormOptions } from '../components/form_options';
import { CourseGroups } from '../utilities/course.types';
import { useEffect, useState, useRef } from 'react';
import { Table } from '../components/courses/main';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import React from 'react';

function SetOptions({ data }: { data: Course[] }) {
  data = data.map((course, index) => ({ ...course, priority: index + 1 }));
  const {
    courses,
    options,
    groups,
    retrievedCourseOptions,
  }: {
    courses: Course[];
    options: ScheduleOptions;
    groups: CourseGroups;
    retrievedCourseOptions: CourseOptions;
  } = history.state.usr ?? {
    courses: [...data],
    options: {
      exclude_dates: new Array(40).fill(false),
      maxCredits: 20,
      minCredits: 14,
    },
    groups: {},
    retrievedCourseOptions: {
      group: 0,
      section: 0,
    },
  };
  const [courseOptions, setCourseOptions] = useState<CourseOptions>(retrievedCourseOptions ?? {});
  const [originalData, setOriginalData] = useState<Course[]>(courses);
  const scheduleOptions = useRef<ScheduleOptions>(options);
  const groupsRef = useRef<CourseGroups>(groups);
  const navigate = useNavigate();

  useEffect(() => {
    setOriginalData((old) =>
      old.map((course) => ({
        ...course,
        options: {
          group: courseOptions.group ?? course.options.group,
          section: courseOptions.section ?? course.options.section,
        },
      })),
    );
  }, [courseOptions]);

  const submitForm = () => {
    const leveledCourses: Course[][] = [];

    originalData.forEach((course, idx) =>
      course.priority == originalData[idx - 1]?.priority
        ? leveledCourses[leveledCourses.length - 1].push(course)
        : leveledCourses.push([course]),
    );

    if (leveledCourses.length > 30) {
      const alert = document.getElementById('SubmitAlert');
      if (alert) {
        alert.style.display = 'flex';
        setTimeout(() => {
          alert.style.display = 'none';
        }, 5000);
      }
      return;
    }

    navigate('/schedules', {
      state: {
        courses: leveledCourses,
        options: scheduleOptions.current,
        groups: groupsRef.current,
      },
    });
  };

  return (
    <>
      <Alert
        id='SubmitAlert'
        sx={{
          zIndex: 50,
          position: 'fixed',
          top: '0',
          display: 'none',
          alignItems: 'center',
          fontSize: '14px',
          borderRadius: '0px',
        }}
        severity='error'
      >
        Maximum number of courses reached, use Must Include, Must Exclude, or Co-Requisites to group courses together!
      </Alert>
      <FormOptions scheduleOptions={scheduleOptions} setCourseOptions={setCourseOptions} onClick={submitForm} />
      <div>
        <br />
      </div>
      <Table originalData={originalData} setOriginalData={setOriginalData} groups={groupsRef} />
    </>
  );
}

export default SetOptions;
