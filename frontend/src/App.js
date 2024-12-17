import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeviceDashboard from './components/Dashboard';
import DeviceDetails from './components/DeviceDetails';
import WebServicesMonitor from './components/WebServicesMonitor';
import PacketCapture from './components/PacketCapture';
import TrafficAnalysis from './components/TrafficAnalysis';
import Notifications from './components/Notifications';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeviceDashboard />} />
        <Route path="/deviceDetails" element={<DeviceDetails />} />
        <Route path="/web-services" element={<WebServicesMonitor />} />
        <Route path="/package-capture" element={<PacketCapture />} />
        <Route path="/traffic-analysis" element={<TrafficAnalysis />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
};

export default App;