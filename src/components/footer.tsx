import { FaGithub, FaLinkedin, FaChess, FaEnvelope, FaPhone } from 'react-icons/fa';
import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';

const Footer = () => {
  const resources = [
    {
      name: <FaGithub />,
      link: 'https://github.com/Prog-Jacob/',
    },
    {
      name: <FaLinkedin />,
      link: 'https://www.linkedin.com/in/ahmd-abdelaziz/',
    },
    {
      name: <FaChess />,
      link: 'https://lichess.org/@/Prog_Jacob',
    },
    {
      name: <FaEnvelope />,
      link: 'mailto:Ahmed.Abdelaziz.GM@google.com',
    },
  ];
  return (
    <AppBar position='static' sx={{ marginTop: '1rem', backgroundColor: 'var(--secondary)' }}>
      <Toolbar>
        {resources.map((resource, index) => (
          <Typography key={index} sx={{ margin: 'auto' }} variant='h6' color='inherit'>
            <a style={{ color: 'white' }} href={resource.link}>
              {resource.name}
            </a>
          </Typography>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
