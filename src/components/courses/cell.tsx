import { Column, Row, Table } from '@tanstack/react-table';
import { ChangeEvent, useEffect, useState } from 'react';
import { Course } from '../../types/course';
import '../../styles/tooltip.css';
import React from 'react';

export const TableCell = ({
  getValue,
  row,
  column,
  table,
}: {
  getValue: any;
  row: Row<Course>;
  column: Column<Course>;
  table: Table<Course>;
}) => {
  const initialValue = getValue();
  const tableMeta = table.options.meta;
  const columnMeta = column.columnDef.meta;
  const [value, setValue] = useState<number | string | undefined>(initialValue);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setValue(isNaN(value) || value <= 0 ? undefined : value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    tableMeta?.updateData(row.index, column.id, value);
  }, [value]);

  return columnMeta?.editable && tableMeta?.editedRows[row.id] ? (
    <input value={value || ''} type={columnMeta?.type || 'text'} onChange={handleOnChange} />
  ) : (
    <span
      {...(columnMeta?.tooltip ? { className: 'tooltip', 'data-text': row.original.name } : {})}
    >
      {value || undefined}
    </span>
  );
};
