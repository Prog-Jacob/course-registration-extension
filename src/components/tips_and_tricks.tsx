import { Accordion, AccordionDetails, AccordionSummary, Box, FormLabel } from '@mui/material';
import { IoIosAddCircle, IoMdArrowDropdown } from 'react-icons/io';
import { RiGroup2Fill } from 'react-icons/ri';
import { BsCircleFill } from 'react-icons/bs';
import { MdExpandMore } from 'react-icons/md';
import React from 'react';

function TipsAndTricks() {
  return (
    <Accordion sx={{ margin: '20px 0 10px', width: '520px', border: '1px solid var(--secondary)' }} square>
      <AccordionSummary
        expandIcon={<MdExpandMore />}
        aria-controls='panel1-content'
        id='panel1-header'
        sx={{ color: 'var(--secondary)', fontWeight: '500' }}
      >
        Tips and Tricks
      </AccordionSummary>
      <AccordionDetails sx={{ maxWidth: '520px' }}>
        <div>
          <strong>Schedule Options:</strong>
        </div>
        <ul style={{ marginLeft: '15px' }}>
          <li>
            Select <code>Consider Full Sessions</code> when a certain section is <em>Full</em>, but the advisor should register it.
          </li>
          <li>
            Select <code>Get a Light Schedule</code> to search for as few CHs as possible.
          </li>
          <li>
            Click <code>Exclude Dates</code> button, then select the slots you don't want to attend in. E.g. free up a certain day, early
            slots, and/or late slots.
          </li>
        </ul>
        <div>
          <strong>Course Table:</strong>
        </div>
        <ul style={{ marginLeft: '15px' }}>
          <li>
            <em>Drag and Drop</em> courses to prioritize them in your schedule.
          </li>
          <li>
            Click the <IoIosAddCircle color='var(--secondary)' /> button to add/modify a course manually. To modify a course, type its{' '}
            <em>Course Code</em>.
          </li>
          <li>
            Click the <span style={{ color: 'var(--secondary)' }}>✐</span> icon to modify group/section for individual courses.
          </li>
          <li>
            Click the <IoMdArrowDropdown color='var(--secondary)' /> button and choose any of the options:
            <ul style={{ marginLeft: '15px' }}>
              <li>
                <code>Must Include:</code> the marked courses will be in your schedule.
              </li>
              <li>
                <code>Must Exclude:</code> the marked courses won't be in your schedule.
              </li>
              <li>
                <code>Co-requisite:</code> the marked courses are mutually inclusive; if one course is in the schedule, the other must be
                in.
              </li>
              <li>
                <code>Just Include:</code> use this to revert the previous options.
              </li>
              <li>
                <code>Group:</code> the marked courses are mutually exclusive; if one course is in the schedule, the others must{' '}
                <strong>NOT</strong> be in! (e.g. LRAxxx). <strong>Note:</strong> to remove a course from a group, group it with itself.
              </li>
            </ul>
          </li>
          <li>
            <code>The State Cell</code>:
            <ul style={{ marginLeft: '15px' }}>
              <li>Click to view all groups/sections with their respective dates.</li>
              <li>
                Courses within the same group have a common color <RiGroup2Fill color='var(--secondary)' /> icon.
              </li>
              <li>
                Co-requisites have a common color <BsCircleFill style={{ color: 'var(--secondary)', fontSize: 12 }} /> icon.
              </li>
            </ul>
          </li>
        </ul>
      </AccordionDetails>
    </Accordion>
  );
}

export default TipsAndTricks;
