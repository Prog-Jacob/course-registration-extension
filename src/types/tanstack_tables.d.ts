import { Dispatch } from 'react';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData, Course> {
    groups: CourseGroups;
    editedRows: object;
    setEditedRows: Dispatch<SetState<object>>;
    editPriority: number[];
    setEditPriority: Dispatch<SetState<number[]>>;
    setOriginalData: Dispatch<SetState<Course[]>>;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;
    tooltip?: boolean;
    type: 'text' | 'number';
  }
}
