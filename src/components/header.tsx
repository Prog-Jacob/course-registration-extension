import { AppBar, Toolbar, Typography } from '@mui/material';
import packageInfo from '../../package.json';
import { benchmark } from '../benchmark';
import { ChangeEvent } from 'react';
import React from 'react';

function Header() {
  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = await e.target.files[0];
      benchmark(file);
    } catch (error) {
      alert('Error parsing JSON file!');
    }
  };

  return (
    <AppBar position='static' sx={{ marginBottom: '1rem', backgroundColor: 'var(--secondary)' }}>
      <Toolbar>
        <Typography sx={{ margin: 'auto' }} variant='h6' color='inherit'>
          <label htmlFor='benchmark-courses' style={{ cursor: 'pointer' }}>
            Course Registration Assistant{' '}
            <span style={{ fontSize: '0.8rem' }}>v{packageInfo.version}</span>
          </label>
          {process.env.NODE_ENV === 'development' && (
            <input
              id='benchmark-courses'
              type='file'
              accept='.json'
              style={{ display: 'none' }}
              onChange={handleImport}
            />
          )}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
