import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';

function Header() {
  return (
    <AppBar position='static' sx={{ marginBottom: '1rem', backgroundColor: 'var(--secondary)' }}>
      <Toolbar>
        <Typography sx={{ margin: 'auto' }} variant='h6' color='inherit'>
          Course Registration Assistant
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
