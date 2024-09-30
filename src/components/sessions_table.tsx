import { useEffect, useRef } from 'react';
import { Course } from '../types/course';
import '../styles/tooltip.css';
import React from 'react';

const table = [
  ['Course Code', 'code'],
  ['Credits', 'credits'],
  ['Group', 'sessions.0.group'],
  ['Section', 'sessions.0.section'],
  ['Notes', 'sessions.0.sectionNotes'],
];

export const SessionTable = ({ courses }: { courses: Course[] }) => {
  const creditsSum = useRef(0);

  useEffect(() => {
    creditsSum.current = 0;
  });

  return (
    <table className='course-table' style={{ width: '100%' }}>
      <thead>
        <tr>
          {table.map(([header, id]) => (
            <th key={id}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className='course-table-body'>
        <>
          {courses.map((course, idx) => {
            creditsSum.current += course.credits;
            return (
              <tr key={`${idx}`}>
                {table.map(([header, id]) => (
                  <td
                    key={`${idx}_${id}`}
                    {...(id == 'code' ? { className: 'tooltip', 'data-text': course.name } : {})}
                  >
                    {(() => {
                      const component =
                        id.split('.').reduce((obj, key) => obj[+key >= 0 ? +key : key], course) ??
                        '';
                      return header == 'Group' || header == 'Section'
                        ? (component || []).join('&')
                        : component;
                    })()}
                  </td>
                ))}
              </tr>
            );
          })}
          <tr>
            <th style={{ backgroundColor: 'var(--secondary)', color: '#FFF' }}>
              <b>Total Credits</b>
            </th>
            <td colSpan={table.length - 1} style={{ textAlign: 'center' }}>
              <b>{creditsSum.current}</b>
            </td>
          </tr>
        </>
      </tbody>
    </table>
  );
};
