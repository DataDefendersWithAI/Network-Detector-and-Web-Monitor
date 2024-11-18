// Headerbar.js
import React from 'react';
import { Menu } from 'lucide-react';

const Headerbar = ({ toggleNav, headerContent }) => (
  <header className="bg-blue-600 p-4 flex justify-between items-center">
    <div className="flex items-center">
      <button onClick={toggleNav} className="text-white mr-4">
        <Menu size={24} />
      </button>
      <h1 className="text-white text-2xl">{headerContent}</h1>
    </div>
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span>Active</span>
      </div>
      <div>Load: 1.56 1.18 1.21</div>
      <div>Memory usage: 63.5%</div>
      <div>Temp: 61.0°C</div>
    </div>
  </header>
);

export default Headerbar;
