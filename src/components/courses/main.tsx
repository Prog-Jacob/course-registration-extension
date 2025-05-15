import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { flexRender, useReactTable, getCoreRowModel, Row } from '@tanstack/react-table';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  ChangeEvent,
  MutableRefObject,
} from 'react';
import { modifyObject } from '../../modules/object';
import { CourseGroups } from '../../types/course';
import { Course } from '../../types/course';
import { hashToHex } from '../../modules/hash';
import '../../styles/course_table.css';
import { columns } from './columns';
import { Box } from '@mui/material';
import React from 'react';

export const flatten = (sortedArr: Course[]) => {
  let priority = 1;

  return sortedArr.map((course, idx) =>
    course.priority % 1000 == 0
      ? course
      : {
          ...course,
          priority: course.priority == sortedArr[idx + 1]?.priority ? priority : priority++,
        }
  );
};

export const Table = ({
  originalData,
  setOriginalData,
  groups,
}: {
  originalData: Course[];
  setOriginalData: Dispatch<SetStateAction<Course[]>>;
  groups: MutableRefObject<CourseGroups>;
}) => {
  const [editPriority, setEditPriority] = useState<number[]>([]);
  const [data, setData] = useState<Course[]>([...originalData]);
  const [editedRows, setEditedRows] = useState<object>({});

  useEffect(() => {
    setData([...originalData]);
    setEditPriority([]);
  }, [originalData]);

  const reorder = (startIndex: number, endIndex: number) => {
    const movedElementPriority = data[startIndex].priority;
    const destElementPriority = (() => {
      if (startIndex > endIndex) endIndex--;
      if (endIndex < 0) return 1;
      if (data[endIndex].priority == 1000) return 999;
      return data[endIndex].priority + 1;
    })();

    const movedElements = data
      .filter((course) => course.priority == movedElementPriority)
      .map((course) => ({ ...course, priority: destElementPriority }));
    const otherElements = data
      .filter((course) => course.priority != movedElementPriority)
      .map((course) => ({
        ...course,
        priority:
          course.priority % 1000 == 0 || course.priority < destElementPriority
            ? course.priority
            : course.priority + 1,
      }));
    return flatten([...otherElements, ...movedElements].sort((a, b) => a.priority - b.priority));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const update = reorder(source.index, destination.index);
    setData(update);
    setOriginalData(update);
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = await e.target.files[0]?.text();
      const { courses, groups: importedGroups } = JSON.parse(file);
      groups.current = importedGroups || {};
      setOriginalData(courses || []);

      localStorage.setItem('state:groups', JSON.stringify(importedGroups || {}));
      localStorage.setItem('state:courses', JSON.stringify(courses || []));
      e.target.value = '';
    } catch (error) {
      alert('Error parsing JSON file!');
    }
  };

  const handleExport = (e) => {
    try {
      const json = JSON.stringify({ courses: originalData, groups: groups.current }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      e.target.href = URL.createObjectURL(blob);
    } catch (error) {
      alert(`Error exporting file!`);
    }
  };

  const isDragDisabled = (row: Row<Course>) => {
    return (
      row.original.priority % 1000 == 0 ||
      editPriority.length != 0 ||
      Object.values(editedRows).some((v) => v)
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      groups,
      editedRows,
      setEditedRows,
      editPriority,
      setEditPriority,
      setOriginalData,
      revertPriority: (revert: boolean) => {
        if (!revert) {
          const [action, ...indices] = editPriority;
          indices.sort();

          if (action % 1000 == 1)
            setOriginalData((old) => {
              const newData = [...old];
              indices.forEach((i) => (newData[i].priority = action % 1001));
              return flatten(newData.sort((a, b) => a.priority - b.priority));
            });
          else if (action == 1003) {
            if (indices.length < 2) return;
            setOriginalData((old) => {
              const maxPriority = indices.reduce((acc, i) => {
                if (old[i].priority < acc) return old[i].priority;
                return acc;
              }, 1000);

              if (maxPriority == 1000) return [...old];

              const newData = old.map((course, idx) => {
                if (indices.indexOf(idx) != -1) return { ...course, priority: maxPriority };
                if (course.priority >= maxPriority)
                  return { ...course, priority: Math.min(course.priority + 1, 1000) };
                return course;
              });

              return flatten(newData.sort((a, b) => a.priority - b.priority));
            });
          } else if (action == 1002) {
            setOriginalData((old) => {
              const n = indices.length;
              let dx = 1;

              const newData = old.map((course, idx) => {
                if (indices.indexOf(idx) != -1) return { ...course, priority: dx++ };
                if (course.priority % 1000 == 0) return course;
                return { ...course, priority: course.priority + n };
              });

              return flatten(newData.sort((a, b) => a.priority - b.priority));
            });
          } else {
            const name = hashToHex(indices.reduce((acc, i) => acc + originalData[i].code, ''));
            indices.forEach((i) => (groups.current[originalData[i].code] = name));

            const map = new Map();
            Object.values(groups.current).forEach((v) => map.set(v, (map.get(v) || 0) + 1));
            Object.entries(groups.current).forEach(([k, v]) => {
              if (map.get(v) == 1) {
                delete groups.current[k];
              }
            });

            setEditPriority([]);
          }
        } else {
          setEditPriority([]);
        }
      },
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row))
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          );
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return modifyObject(old[rowIndex], columnId.split('.'), value) as Course;
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <Box>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '1rem' }}
      >
        <label className='form-submit' htmlFor='import-courses'>
          Import
        </label>
        <input
          id='import-courses'
          type='file'
          accept='.json'
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <a
          className='form-submit'
          download='courses.json'
          onClick={handleExport}
          style={{ textDecoration: 'none' }}
        >
          Export
        </a>
      </Box>
      <table className='course-table'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={'dndTableBody'}>
            {(provided) => (
              <tbody
                className='course-table-body'
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {table.getRowModel().rows.map((row, index) => (
                  <Draggable
                    draggableId={`${row.original.code}_${row.id}`}
                    key={`${row.original.code}_${row.id}`}
                    isDragDisabled={isDragDisabled(row)}
                    index={index}
                  >
                    {(provided) => (
                      <tr
                        key={row.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={`${row.id}_${cell.id}`}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </table>
    </Box>
  );
};

export default Table;
