import { Course, ScheduleOptions } from '../../types/course';
import '../../styles/schedule.css';
import { RefObject } from 'react';
import { Cell } from './cell';
import React from 'react';

const seed = '&g![a8#>p'.toUpperCase();
const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
const timeSlots: string[] = [
  '09:00',
  '09:45',
  '10:45',
  '11:30',
  '12:30',
  '01:15',
  '02:15',
  '03:00',
];

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
  const schedule: string[][] = days.map(() => new Array(timeSlots.length).fill(''));

  if (!toggler) {
    for (const course of courses!) {
      for (let i = 0; i < 40; i++) {
        const slot = i % 8;
        const day = Math.floor(i / 8);
        const oldName = schedule[day][slot];
        let name = course.name.toUpperCase();

        if (course.dates[i]) {
          if (oldName.startsWith(seed)) {
            let newName = name.split('-')[0] + '-';

            for (const ch of 'GS') {
              const regex = new RegExp(ch + '([0-9&]+)');
              const newGroups = (name.match(regex) ?? ['', ''])[1].split('&');
              const oldGroups = (oldName.match(regex) ?? ['', ''])[1].split('&');
              const allGroups = new Set([...newGroups, ...oldGroups]);
              const groups = [...allGroups]
                .filter((g) => g != '')
                .sort()
                .join('&');
              if (groups.length) newName += ch + groups + ' ';
            }
            newName = newName.trim();
            if (newName.endsWith('-')) newName += 'NA';
            name = newName;
          }

          schedule[day][slot] = name;
        }
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
                        name={slot.startsWith(seed) ? slot.split('-')[1] : slot}
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
