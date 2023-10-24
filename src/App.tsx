import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ViewSchedules from './pages/ViewSchedules';
import SetOptions from './pages/SetOptions';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/Home';
import React from 'react';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '500px', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
      <Header />
      <Router>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path='/courses' element={<SetOptions />} />
          <Route path='/schedules' element={<ViewSchedules />}></Route>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
