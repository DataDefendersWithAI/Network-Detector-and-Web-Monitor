import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeviceDashboard from './components/Dashboard';
import DeviceDetails from './components/DeviceDetails';
import Speedtest from './components/Speedtest';
import PacketCapture from './components/Packetcapture';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeviceDashboard />} />
        <Route path="/deviceDetails" element={<DeviceDetails />} />
        <Route path="/web-services" element={<Speedtest />} />
        <Route path="/package-capture" element={<PacketCapture />} />
      </Routes>
    </Router>
  );
};

export default App;