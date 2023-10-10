import { createColumnHelper } from '@tanstack/react-table';
import { Course } from '../../types/course';
import { PriorityCell } from './priority_cell';
import { ControlCell } from './control_cell';
import { StateCell } from './state_cell';
import { EditCell } from './edit_cell';
import { TableCell } from './cell';
import { AddCell } from './add_cell';

const columnHelper = createColumnHelper<Course>();

export const columns = [
  columnHelper.display({
    header: PriorityCell,
    cell: ControlCell,
    id: 'priority',
  }),
  columnHelper.accessor('code', {
    cell: TableCell,
    header: 'Course Code',
    meta: { type: 'text' },
  }),
  columnHelper.accessor('credits', {
    cell: TableCell,
    header: 'Credits',
    meta: { type: 'number' },
  }),
  columnHelper.accessor('options.group', {
    header: 'Group',
    id: 'options.group',
    cell: TableCell,
    meta: {
      type: 'number',
      editable: true,
    },
  }),
  columnHelper.accessor('options.section', {
    cell: TableCell,
    id: 'options.section',
    header: 'Section',
    meta: {
      type: 'number',
      editable: true,
    },
  }),
  columnHelper.display({
    cell: StateCell,
    header: 'State',
    id: 'state',
  }),
  columnHelper.display({
    cell: EditCell,
    header: AddCell,
    id: 'edit',
  }),
];
