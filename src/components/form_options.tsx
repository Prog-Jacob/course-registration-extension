import { FormControlLabel, FormControl, FormGroup, FormLabel, Checkbox, TextField } from '@mui/material';
import { CourseOptions, ScheduleOptions } from '../utilities/course.types';
import { Dispatch, RefObject, SetStateAction, useState } from 'react';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import Slider from '@mui/material/Slider';
import Schedule from './schedule/main';
import '../styles/popup_schedule.css';
import Box from '@mui/material/Box';
import '../styles/form_options.css';
import { MouseEvent } from 'react';
import React from 'react';

export function FormOptions({
  scheduleOptions,
  setCourseOptions,
  onClick,
}: {
  scheduleOptions: RefObject<ScheduleOptions>;
  setCourseOptions: Dispatch<SetStateAction<CourseOptions>>;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const options = scheduleOptions.current;
  const [showSchedule, setShowSchedule] = useState(false);
  const [checked, setChecked] = useState(!!options?.preferMin);
  const [creditRange, setCreditRange] = useState([options?.minCredits ?? 14, options?.maxCredits ?? 20]);

  const toggleSchedule = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.body.style.overflow = showSchedule ? 'auto' : 'hidden';
    setShowSchedule(!showSchedule);
  };

  const handleSliderChange = (_: unknown, newValue: number | number[]) => {
    if (typeof newValue == 'number') return;
    options!.minCredits = newValue[0];
    options!.maxCredits = newValue[1];
    setCreditRange(newValue);
  };

  const handleCheckbox = () => {
    setChecked(!checked);
    options!.preferMin = !checked;
  };

  return (
    <FormControl component='fieldset' sx={{ padding: '15px', width: '520px', border: '1px solid var(--secondary)' }}>
      <FormLabel component='legend' sx={{ color: 'var(--secondary) !important', fontWeight: 'bold' }}>
        Options:
      </FormLabel>
      <FormGroup aria-label='position' row={false}>
        <FormControlLabel
          className='form-option'
          control={
            <Box
              sx={{
                flex: 1,
                '.MuiSlider-root': { color: 'var(--secondary) !important' },
                '.MuiSlider-thumb:hover': { boxShadow: '0 0 0 6px rgba(var(--secondary-rgb), .2) !important' },
                '.MuiSlider-thumb': { boxShadow: 'none !important' },
              }}
            >
              <Slider
                getAriaLabel={() => 'Required Credit Hours Range'}
                value={creditRange}
                min={1}
                step={1}
                max={30}
                onChange={handleSliderChange}
                valueLabelDisplay='auto'
                getAriaValueText={(value) => `${value}CH`}
              />
            </Box>
          }
          label='How many CH to register? '
          labelPlacement='start'
        />
        <FormControlLabel
          className='form-option'
          control={
            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              {['group', 'section'].map((label) => {
                return (
                  <TextField
                    label={label[0].toUpperCase() + label.slice(1) + ':'}
                    key={label}
                    placeholder='0'
                    variant='filled'
                    color='success'
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    sx={{
                      flex: 1,
                      width: 100,
                      '& .MuiFilledInput-root::after': { borderColor: 'var(--secondary)' },
                      '& .MuiInputLabel-root': { color: 'var(--secondary) !important' },
                    }}
                    onChange={(e) => setCourseOptions((old) => ({ ...old, [label]: +e.target.value > 0 ? +e.target.value : 0 }))}
                    focused
                  />
                );
              })}
            </div>
          }
          label='Where should you attend? '
          labelPlacement='start'
        />
        <FormControlLabel
          className='form-option'
          control={
            <Checkbox
              checked={checked}
              onChange={handleCheckbox}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 18, fill: 'var(--secondary)' } }}
            />
          }
          label='Get a light schedule:'
          labelPlacement='start'
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '1rem' }}>
          <div>
            <div className='popup popup-schedule' style={{ display: showSchedule ? '' : 'none' }}>
              <button className='popup-schedule-close' onClick={toggleSchedule}>
                X
              </button>
              <Schedule options={scheduleOptions} />
            </div>
            <button className='form-submit' onClick={() => setShowSchedule(true)}>
              Exclude Dates
            </button>
          </div>
          <button onClick={onClick} className='form-submit'>
            Generate Schedules <BsFillArrowRightCircleFill />
          </button>
        </div>
      </FormGroup>
    </FormControl>
  );
}
