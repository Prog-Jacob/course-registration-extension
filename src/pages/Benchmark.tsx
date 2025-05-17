import { Checkbox, FormControlLabel } from '@mui/material';
import SetOptions, { levelCourses } from './SetOptions';
import { benchmark } from '../services/benchmarker';
import React, { ChangeEvent } from 'react';

function Benchmark() {
  const [loading, setLoading] = React.useState(false);
  const [saveFiles, setSaveFiles] = React.useState(false);

  const submitForm = async (courses, groups, options, isMaxExceeded, setIsMaxExceeded) => {
    const leveledCourses = levelCourses(courses);
    if (leveledCourses.length > 30) {
      if (!isMaxExceeded) {
        setIsMaxExceeded(true);
        setTimeout(() => {
          setIsMaxExceeded(false);
        }, 5000);
      }
      return;
    }

    localStorage.setItem('state:groups', JSON.stringify(groups));
    localStorage.setItem('state:courses', JSON.stringify(courses));
    sessionStorage.setItem('state:options', JSON.stringify(options));

    setLoading(true);
    await benchmark(leveledCourses, groups, options, saveFiles);
    setLoading(false);
  };

  const handleSaveFiles = (e: ChangeEvent<HTMLInputElement>) => {
    setSaveFiles(e.target.checked);
  };

  return loading ? (
    <>
      <p style={{ textAlign: 'center' }}>Loading...</p>
      <p style={{ textAlign: 'center' }}>Open Console for a few insights</p>
      <p style={{ textAlign: 'center' }}>
        Start profiling the moment you click `Generate Schedules`
      </p>
    </>
  ) : (
    <SetOptions submitForm={submitForm}>
      <FormControlLabel
        className='form-option'
        control={
          <Checkbox
            checked={saveFiles}
            onChange={handleSaveFiles}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 18, fill: 'var(--secondary)' } }}
          />
        }
        label='Save Solutions'
        labelPlacement='start'
      />
    </SetOptions>
  );
}
export default Benchmark;
