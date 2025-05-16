import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import packageInfo from '../../package.json';
import React from 'react';

function Header() {
  const goHome = () => {
    window.location.href = '';
  };

  return (
    <AppBar position='static' sx={{ marginBottom: '1rem', backgroundColor: 'var(--secondary)' }}>
      <Toolbar>
        <IconButton edge='start' color='inherit' onClick={goHome} sx={{ mr: 2 }}>
          <img
            alt='Extension Icon'
            src='/favicon-32x32.png'
            style={{ width: 32, height: 32, padding: 0, borderRadius: '50%' }}
          />
        </IconButton>
        <Typography
          sx={{ margin: 'auto', textDecoration: 'none' }}
          variant='h6'
          component='a'
          color='inherit'
          target='_blank'
          rel='noopener noreferrer'
          href='https://github.com/Prog-Jacob/course-registration-extension/tree/master/releases'
        >
          Course Registration Assistant{' '}
          <span style={{ fontSize: '0.8rem' }}>v{packageInfo.version}</span>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
