import {
  FormControlLabel,
  FormControl,
  FormGroup,
  FormLabel,
  Checkbox,
  TextField,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ChangeEvent, Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CourseOptions, ScheduleOptions } from '../types/course';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import reactStringReplace from 'react-string-replace';
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
  const [preferMin, setPreferMin] = useState(options.preferMin);
  const [priorities, setPriorities] = useState([...options.priorities]);
  const [considerDisabled, setConsiderDisabled] = useState(options.considerDisabled);
  const [creditRange, setCreditRange] = useState([options.minCredits, options.maxCredits]);
  const [showSchedule, setShowSchedule] = useState(false);

  const toggleSchedule = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSchedule(!showSchedule);
  };

  const handleSliderChange = (_: unknown, newValue: number | number[]) => {
    if (typeof newValue == 'number') return;
    options.minCredits = newValue[0];
    options.maxCredits = newValue[1];
    setCreditRange(newValue);
  };

  const handlePreferMin = (e: ChangeEvent<HTMLInputElement>) => {
    options.preferMin = e.target.checked;
    setPreferMin(options.preferMin);
  };

  const handleConsiderDisabled = (e: ChangeEvent<HTMLInputElement>) => {
    options.considerDisabled = e.target.checked;
    setConsiderDisabled(options.considerDisabled);
  };

  const handlePriorityReverse = (i: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      priorities[i].reverse = e.target.checked;
      setPriorities([...priorities]);
    };
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!source || !destination) return;

    const e = destination.index;
    const s = source.index;
    if (s === e) return;

    const destinationPriority = priorities.splice(s, 1);
    priorities.splice(e, 0, ...destinationPriority);
    setPriorities([...priorities]);
  };

  useEffect(() => {
    options.priorities = priorities;
  }, [priorities]);

  return (
    <FormControl
      component='fieldset'
      sx={{ padding: '15px', width: '520px', border: '1px solid var(--secondary)' }}
    >
      <FormLabel
        component='legend'
        sx={{ color: 'var(--secondary) !important', fontWeight: 'bold' }}
      >
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
                '.MuiSlider-thumb:hover': {
                  boxShadow: '0 0 0 6px rgba(var(--secondary-rgb), .2) !important',
                },
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
            <div
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {['group', 'section'].map((label) => {
                return (
                  <TextField
                    label={label[0].toUpperCase() + label.slice(1) + ':'}
                    type='number'
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
                    onChange={(e) =>
                      setCourseOptions((old) => ({
                        ...old,
                        [label]: +e.target.value > 0 ? +e.target.value : 0,
                      }))
                    }
                    focused
                  />
                );
              })}
            </div>
          }
          label='Where should you attend? '
          labelPlacement='start'
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={'dndScheduleOptions'}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  bgcolor: '#f9f9f9',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '16px',
                  margin: '1rem 5px 10px 1rem',
                }}
              >
                {priorities.map((priority, index) => (
                  <Draggable draggableId={`${priority.id}`} key={`${priority.id}`} index={index}>
                    {(provided) => (
                      <ListItem
                        className='form-option'
                        sx={{
                          bgcolor: '#fff',
                          outline: '1px solid #ddd',
                          padding: '5px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'background-color 0.2s ease',
                          '&:hover, &:active': {
                            backgroundColor: 'var(--background)',
                          },
                        }}
                        disablePadding
                        key={priority.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <FontAwesomeIcon
                          icon={faGripLines}
                          style={{ color: 'var(--secondary)', fontSize: 18 }}
                        />
                        <ListItemText
                          primary={reactStringReplace(priority.label, '[NOT]', () => (
                            <FormControlLabel
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: 'var(--background)',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '3px',
                                margin: 0,
                                '&:hover': {
                                  backgroundColor: '#e0e0e0',
                                },
                              }}
                              key={index}
                              control={
                                <Checkbox
                                  checked={priority.reverse}
                                  onChange={handlePriorityReverse(index)}
                                  sx={{
                                    '& .MuiSvgIcon-root': {
                                      fontSize: 18,
                                      fill: 'var(--secondary)',
                                    },
                                    padding: 0,
                                  }}
                                />
                              }
                              label={
                                <span
                                  style={{
                                    textDecoration: priority.reverse ? 'none' : 'line-through',
                                    color: priority.reverse ? 'black' : '#888',
                                  }}
                                >
                                  NOT
                                </span>
                              }
                            />
                          ))}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <FormControlLabel
          className='form-option'
          control={
            <Checkbox
              checked={considerDisabled}
              onChange={handleConsiderDisabled}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 18, fill: 'var(--secondary)' } }}
            />
          }
          label='Consider Full Sessions:'
          labelPlacement='start'
        />
        <FormControlLabel
          className='form-option'
          control={
            <Checkbox
              checked={preferMin}
              onChange={handlePreferMin}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 18, fill: 'var(--secondary)' } }}
            />
          }
          label='Get a light schedule:'
          labelPlacement='start'
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginTop: '1rem',
          }}
        >
          <div>
            {showSchedule && (
              <div className='popup popup-schedule'>
                <button className='popup-schedule-close' onClick={toggleSchedule}>
                  X
                </button>
                <Schedule options={scheduleOptions} />
              </div>
            )}
            <button className='form-submit' onClick={toggleSchedule}>
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
