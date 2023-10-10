import { Course, ScheduleOptions } from '../../types/course';
import { RefObject, useEffect, useState } from 'react';
import { hashToHexColor } from '../../modules/hash';
import { MouseEvent } from 'react';
import React from 'react';

export const Cell = ({
  name,
  toggler,
  colSpan,
  options,
  courseOptions,
  idx,
}: {
  name: string;
  colSpan: number;
  toggler?: number;
  options?: RefObject<ScheduleOptions>;
  courseOptions?: RefObject<Course>;
  idx?: number;
}) => {
  const bgColor = name ? hashToHexColor(name) : '';
  const color = name ? (parseInt(bgColor.slice(1), 16) >> 23 ? '' : 'white') : '';
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (toggler == undefined) return;
    if (options?.current) setChecked(options.current.exclude_dates[toggler]);
    else if (courseOptions?.current) setChecked(courseOptions.current.sessions[idx!].dates[toggler] !== undefined);
  }, []);

  const handleCheck = (e: MouseEvent<HTMLTableDataCellElement>) => {
    e.preventDefault();
    setChecked(!checked);
    if (options?.current) options.current.exclude_dates[toggler!] = !checked;
    else if (courseOptions?.current) courseOptions.current.sessions[idx!].dates[toggler!] = !checked ? toggler ?? 0 : undefined;
  };

  return toggler != undefined ? (
    <td className='cell toggler' onClick={handleCheck} style={{ backgroundColor: checked ? 'var(--check-schedule)' : '' }}></td>
  ) : (
    <td className='cell' colSpan={colSpan} style={{ backgroundColor: bgColor, color: color }}>
      {name}
    </td>
  );
};
