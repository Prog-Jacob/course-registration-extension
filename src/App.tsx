import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ViewSchedules from './pages/ViewSchedules';
import SetOptions from './pages/SetOptions';
import Benchmark from './pages/Benchmark';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/Home';
import React from 'react';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Header />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Router>
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path='/courses' element={<SetOptions />} />
            <Route path='/schedules' element={<ViewSchedules />}></Route>
            {process.env.REACT_APP_DEBUG_ENV === 'benchmark' && (
              <Route path='/benchmark' element={<Benchmark />} />
            )}
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
