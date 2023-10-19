import { Column, Row, Table } from '@tanstack/react-table';
import { Course } from '../../types/course';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  return columnMeta?.editable && tableMeta?.editedRows[row.id] ? (
    <input
      value={value}
      onBlur={onBlur}
      type={columnMeta?.type || 'text'}
      onChange={(e) => setValue(((value = e.target.value) => (+value > 0 ? +value : undefined))())}
    />
  ) : (
    <span {...(columnMeta?.tooltip ? { className: 'tooltip', 'data-text': row.original.name } : {})}>{value || undefined}</span>
  );
};
