import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { analyticsClient } from './services/analyticsClient';
import ViewSchedules from './pages/ViewSchedules';
import SetOptions from './pages/SetOptions';
import packageInfo from '../package.json';
import Benchmark from './pages/Benchmark';
import Header from './components/header';
import Footer from './components/footer';
import React, { useEffect } from 'react';
import Home from './pages/Home';

function App() {
  useEffect(() => {
    analyticsClient.register({
      app_version: packageInfo.version,
      env: process.env.NODE_ENV,
      platform: process.env.REACT_APP_DEBUG_ENV === 'benchmark' ? 'website' : 'extension',
      browser: navigator.userAgent,
    });
  }, []);

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
