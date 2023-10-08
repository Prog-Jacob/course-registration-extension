import { Course } from '../../utilities/course.types';
import { Row, Table } from '@tanstack/react-table';
import { MouseEvent } from 'react';
import React from 'react';

export const EditCell = ({ row, table }: { row: Row<Course>; table: Table<Course> }) => {
  const meta = table.options.meta;

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old: []) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    if (elName !== 'edit') {
      meta?.revertData(row.index, e.currentTarget.name === 'cancel');
    }
  };

  return (
    <div className='edit-cell-container'>
      {meta?.editedRows[row.id] ? (
        <div className='edit-cell'>
          <button onClick={setEditedRows} name='cancel'>
            {' '}
            X{' '}
          </button>
          <button onClick={setEditedRows} name='done'>
            {' '}
            ✔{' '}
          </button>
        </div>
      ) : (
        <button disabled={meta.editPriority.length != 0} onClick={setEditedRows} name='edit'>
          {' '}
          ✐{' '}
        </button>
      )}
    </div>
  );
};
