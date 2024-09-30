import { Course } from '../../types/course';
import { AddCourseTable } from '../add_course_table';
import { IoIosAddCircle } from 'react-icons/io';
import { Table } from '@tanstack/react-table';
import { createRoot } from 'react-dom/client';
import { IconButton } from '@mui/material';
import { MouseEvent } from 'react';
import React from 'react';

export function AddCell({ table }: { table: Table<Course> }) {
  const meta = table.options.meta;

  const toggleTable = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const root = createRoot(document.getElementById('add-course')!);
    root.render(<AddCourseTable setData={meta.setOriginalData} />);
  };

  const isButtonDisabled = () => {
    return meta.editPriority.length != 0 || Object.values(meta.editedRows).some((v) => v);
  };

  return (
    <>
      <IconButton
        disabled={isButtonDisabled()}
        onClick={toggleTable}
        sx={{ margin: 0, padding: 0, height: 25 }}
      >
        <IoIosAddCircle color='var(--primary)' size={25} />
      </IconButton>
      <div id='add-course'></div>
    </>
  );
}
