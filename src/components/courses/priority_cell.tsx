import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Course } from '../../utilities/course.types';
import FormControl from '@mui/material/FormControl';
import { Table } from '@tanstack/react-table';
import MenuItem from '@mui/material/MenuItem';
import '../../styles/course_table.css';
import { MouseEvent } from 'react';
import React from 'react';

const selectItems = [
  { value: -1, label: '' },
  { value: 1001, label: 'Must Include' },
  { value: 2001, label: 'Must Exclude' },
  { value: 1002, label: 'Just Include' },
  { value: 1003, label: 'Co-Requisites' },
  { value: 1005, label: 'Group' },
];

export const PriorityCell = ({ table }: { table: Table<Course> }) => {
  const meta = table.options.meta;

  const changeSelection = (event: SelectChangeEvent) => {
    meta?.setEditPriority([event.target.value]);
  };

  const applyChanges = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    if (elName !== 'edit') {
      meta?.revertPriority(e.currentTarget.name === 'cancel');
    }
  };

  return (
    <div className='priority-cell-container'>
      {meta?.editPriority.length ? (
        <div className='edit-cell'>
          <button onClick={applyChanges} name='cancel'>
            {' '}
            X{' '}
          </button>
          <button onClick={applyChanges} name='done'>
            {' '}
            ✔{' '}
          </button>
        </div>
      ) : (
        <FormControl disabled={Object.values(meta.editedRows).some((v) => v)} sx={{ width: '100%', height: 26 }}>
          <Select
            sx={{
              width: '50%',
              margin: 'auto',
              height: '100%',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
              },
              '.MuiSvgIcon-root ': {
                fill: 'var(--primary) !important',
                left: 0,
                right: 0,
                margin: '0 auto',
              },
            }}
            value={meta?.editPriority[0] ?? -1}
            onChange={changeSelection}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {selectItems.map((item, i) => (
              <MenuItem key={`item_${i}`} sx={{ display: item.value == -1 ? 'none' : '' }} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};
