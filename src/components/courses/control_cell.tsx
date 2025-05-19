import { Row, Table } from '@tanstack/react-table';
import { MdDragIndicator } from 'react-icons/md';
import { Course } from '../../types/course';
import { Checkbox } from '@mui/material';
import { ChangeEvent } from 'react';
import React from 'react';

export function ControlCell({ row, table }: { row: Row<Course>; table: Table<Course> }) {
  const meta = table.options.meta;

  const setEditPriority = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.checked) {
      meta.setEditPriority(meta.editPriority.filter((idx: number) => idx != row.index));
    } else {
      meta.setEditPriority([...meta.editPriority, row.index]);
    }
  };

  return meta?.editPriority.length ? (
    <Checkbox
      onChange={setEditPriority}
      sx={{ padding: 0, '& .MuiSvgIcon-root': { fontSize: 18, fill: 'var(--secondary)' } }}
    />
  ) : (
    <MdDragIndicator style={{ color: 'var(--secondary)', fontSize: 18 }} />
  );
}
