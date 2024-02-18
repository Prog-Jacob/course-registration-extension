import { faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Course } from '../../types/course';
import { hashToHexColor } from '../../modules/hash';
import { Row, Table } from '@tanstack/react-table';
import { RiGroup2Fill } from 'react-icons/ri';
import { BsCircleFill } from 'react-icons/bs';
import '../../styles/popup_schedule.css';
import Schedule from '../schedule/main';
import { Button } from '@mui/material';
import { MouseEvent } from 'react';
import { useState } from 'react';
import React from 'react';

export const StateCell = ({ table, row }: { table: Table<Course>; row: Row<Course> }) => {
  return (() => {
    // '-' is not allowed in the seed.
    const seed = '&g![a8#>p';
    const meta = table.options.meta;
    const curr = row.original.priority;
    const rows = table.getRowModel().rows;
    const next = rows[row.index + 1]?.original.priority;
    const prev = rows[row.index - 1]?.original.priority;
    const [showSchedule, setShowSchedule] = useState(false);

    const toggleSchedule = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      document.body.style.overflow = showSchedule ? 'auto' : 'hidden';
      setShowSchedule(!showSchedule);
    };

    return (
      <div>
        <div className='popup popup-schedule' style={{ display: showSchedule ? '' : 'none' }}>
          <button className='popup-schedule-close' onClick={toggleSchedule}>
            X
          </button>
          <Schedule
            courses={(row.original as Course).sessions.map((session, idx) => {
              return {
                name: `${seed}${idx}-${(() => {
                  if (session.section?.length) return `S${session.section.join('&')}`;
                  if (session.group?.length) return `G${session.group.join('&')}`;
                  return 'NA';
                })()}`,
                dates: (() => {
                  const ans = new Array(40).fill(false);
                  session.dates.forEach((date) => (ans[date] = true));
                  return ans;
                })(),
              };
            })}
          />
        </div>

        <Button
          sx={{
            height: 20,
            backgroundColor: 'rgba(var(--secondary-rgb), .1)',
          }}
          onClick={toggleSchedule}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', gap: 5 }}>
            {curr == 0 ? (
              <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 16, color: 'green' }} />
            ) : curr == 1000 ? (
              <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: 16, color: 'red' }} />
            ) : curr == next || curr == prev ? (
              <BsCircleFill
                style={{
                  fontSize: 16,
                  color: hashToHexColor(curr.toString()),
                }}
              />
            ) : null}
            {meta?.groups.current[row.original.code] ? (
              <RiGroup2Fill
                style={{
                  fontSize: 18,
                  color: hashToHexColor(meta.groups.current[row.original.code]),
                }}
              />
            ) : null}
          </div>
        </Button>
      </div>
    );
  })();
};
