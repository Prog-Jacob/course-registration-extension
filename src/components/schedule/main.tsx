import { Course, ScheduleOptions } from '../../types/course';
import '../../styles/schedule.css';
import { RefObject } from 'react';
import { Cell } from './cell';
import React from 'react';

const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
const timeSlots: string[] = ['09:00', '09:45', '10:45', '11:30', '12:30', '01:15', '02:15', '03:00'];

const Schedule = ({
  courses,
  options,
  courseOptions,
  idx,
}: {
  courses?: { name: string; dates: boolean[] }[];
  options?: RefObject<ScheduleOptions>;
  courseOptions?: RefObject<Course>;
  idx?: number;
}) => {
  const toggler = !courses;
  const schedule = days.map(() => new Array(timeSlots.length).fill(''));

  if (!toggler) {
    for (const course of courses!) {
      for (let i = 0; i < 40; i++) {
        if (course.dates[i]) schedule[Math.floor(i / 8)][i % 8] = course.name.toUpperCase();
      }
    }
  }

  return (
    <div className='container'>
      <table className='schedule'>
        <thead>
          <tr>
            <th style={{ all: 'unset' }}></th>
            {timeSlots.map((slot) => (
              <th style={{ height: 20 }} key={slot}>
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.map((day, i) => {
            let span = 1;
            return (
              <tr key={i}>
                <th style={{ width: 50 }}>{days[i]}</th>
                {day.map((slot, j) => {
                  if (slot && slot === day[j + 1]) span++;
                  else {
                    let temp: number;
                    [temp, span] = [span, 1];
                    return (
                      <Cell
                        key={`${i}-${j}`}
                        toggler={toggler ? i * 8 + j : undefined}
                        name={slot}
                        colSpan={temp}
                        options={options}
                        courseOptions={courseOptions}
                        idx={idx}
                      />
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
