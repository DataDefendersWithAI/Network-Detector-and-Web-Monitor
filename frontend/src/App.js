import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeviceDashboard from './components/Dashboard';
import DeviceDetails from './components/DeviceDetails';
import Speedtest from './components/Speedtest';
import Events from './components/event';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeviceDashboard />} />
        <Route path="/deviceDetails" element={<DeviceDetails />} />
        <Route path="/web-services" element={<Speedtest />} />
        <Route path="/event" element={<Events />} />
      </Routes>
    </Router>
  );
};

export default App;