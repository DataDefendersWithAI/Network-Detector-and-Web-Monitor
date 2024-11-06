import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeviceDashboard from './components/Dashboard';
import DeviceDetails from './components/DeviceDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeviceDashboard />} />
        <Route path="/deviceDetails" element={<DeviceDetails />} />
      </Routes>
    </Router>
  );
};

export default App;