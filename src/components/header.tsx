import { AppBar, Toolbar, Typography } from '@mui/material';
import packageInfo from '../../package.json';
import React from 'react';

function Header() {
  return (
    <AppBar position='static' sx={{ marginBottom: '1rem', backgroundColor: 'var(--secondary)' }}>
      <Toolbar>
        <Typography sx={{ margin: 'auto' }} variant='h6' color='inherit'>
          Course Registration Assistant{' '}
          <span style={{ fontSize: '0.8rem' }}>v{packageInfo.version}</span>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
