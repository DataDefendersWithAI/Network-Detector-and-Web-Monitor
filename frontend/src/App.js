import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeviceDashboard from './components/Dashboard';
import DeviceDetails from './components/DeviceDetails';
import WebServicesMonitor from './components/WebServicesMonitor';
import PacketCapture from './components/PacketCapture';
import TrafficAnalysis from './components/TrafficAnalysis';
import Notifications from './components/Notifications';
import Events from './components/Events';
import ICMP from './components/ICMP';
import InternetSpeedtest from './components/InternetSpeedtest';
import WebsiteDetails from './components/WebsiteDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeviceDashboard />} />
        <Route path="/device-details" element={<DeviceDetails />} />
        <Route path="/web-services" element={<WebServicesMonitor />} />
        <Route path="/package-capture" element={<PacketCapture />} />
        <Route path="/traffic-analysis" element={<TrafficAnalysis />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/speedtest" element={<InternetSpeedtest />} />
        <Route path="/ICMP" element={<ICMP />} />
        <Route path="/event" element={<Events />} />
        <Route path="/web-services/details" element={<WebsiteDetails/>} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/event" element={<Events />} />
      </Routes>
    </Router>
  );
};

export default App;