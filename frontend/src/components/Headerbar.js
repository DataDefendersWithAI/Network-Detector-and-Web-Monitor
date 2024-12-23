// Headerbar.js
import React from 'react';
import { Menu, RefreshCcw, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Headerbar = ({ toggleNav, headerContent, syncCallback, backCallback, syncDisabled }) => {
  const [systemInfo, setSystemInfo] = useState(null);

  const fetchSystemInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3060/api/system/');
      // console.log(res.data);
      setSystemInfo(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch systemInfo when component is mounted and set up an interval to refresh it
  useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <header className="bg-blue-600 p-1 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleNav} className="text-white p-4 pr-2 cursor-pointer">
          <Menu size={24} />
        </button>
        {backCallback && (
          <button onClick={backCallback} className="text-white p-4 pl-2 cursor-pointer">
            <ArrowLeft size={24} />
          </button>
        )}
        {/* Button to call sync */}
        {syncCallback && (
          <button onClick={syncCallback} className="text-white mr-4 -4 pl-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={syncDisabled}>
            <RefreshCcw size={24} />
          </button>
        )}
        <h1 className="text-white text-2xl">{headerContent}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active</span>
          </div>
          {systemInfo && (
            <>
              <div>Load: {systemInfo.avgload}</div>
              <div>Memory usage: {systemInfo.memusage}%</div>
              <div>Temp: {systemInfo.cputemp}°C</div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Headerbar;


