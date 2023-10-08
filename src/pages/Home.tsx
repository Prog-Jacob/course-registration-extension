import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>This is the home page.</h1>
      <Link to='/courses' className='btn btn-primary'>
        Set Options
      </Link>
      <hr />
      <Link to='/schedules' className='btn btn-primary'>
        View Schedules
      </Link>
    </div>
  );
}

export default Home;
