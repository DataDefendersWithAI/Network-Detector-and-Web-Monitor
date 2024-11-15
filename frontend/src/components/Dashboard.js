import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Star, PlusCircle, AlertTriangle, Archive, ChevronUp, ChevronDown } from 'lucide-react';
import '../App.css'
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';

const DeviceDashboard = ({ onDeviceClick }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [devices, setDevices] = useState([
    { name: 'JakeClark-Sep21st', owner: '(unknown)', type: '', favorite: false, group: '', firstSession: '2024-10-14 22:45', lastSession: '2024-10-14 22:45', lastIP: '10.0.226.199', mac: '', status: 'new', connected: true, archived: false },
    { name: 'Internet', owner: '(unknown)', type: '', favorite: true, group: '', firstSession: '2024-10-14 22:45', lastSession: '2024-10-14 22:45', lastIP: '125.235.239.73', mac: '', status: 'online', connected: true, archived: false },
    { name: '(unknown)', owner: '(unknown)', type: '', favorite: false, group: '', firstSession: '2024-10-14 22:55', lastSession: '2024-10-14 22:55', lastIP: '192.168.76.21', mac: '', status: 'offline', connected: false, archived: false },
  ]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [activeFilters, setActiveFilters] = useState([]);

  const handleDeviceClick = (device) => {
    if (onDeviceClick) {
      onDeviceClick(device);
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const applyFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const filteredDevices = devices.filter(device => {
    if (activeFilters.length === 0) return true;
    return activeFilters.some(filter => {
      switch (filter) {
        case 'connected': return device.connected;
        case 'favorites': return device.favorite;
        case 'new': return device.status === 'new';
        case 'down-alerts': return device.status === 'offline';
        case 'archived': return device.archived;
        default: return true;
      }
    });
  });

  const sortedDevices = React.useMemo(() => {
    let sortableDevices = [...filteredDevices];
    if (sortConfig.key !== null) {
      sortableDevices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDevices;
  }, [filteredDevices, sortConfig]);

  

  const SortButton = ({ column }) => (
    <button onClick={() => sortData(column)} className="ml-1 focus:outline-none">
      {sortConfig.key === column ? (
        sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
      ) : (
        <ArrowUpDown size={14} />
      )}
    </button>
  );

  const FilterButton = ({ label, count, color, icon: Icon, filter }) => (
    <button
      onClick={() => applyFilter(filter)}
      className={`${color} p-4 rounded-lg flex flex-col items-center justify-center ${activeFilters.includes(filter) ? 'ring-2 ring-white' : ''}`}
    >
      <span className="text-3xl font-bold">{count}</span>
      <span className="text-sm">{label}</span>
      <Icon size={24} />
    </button>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'new': return 'bg-green-500 text-white';
      case 'online': return 'bg-blue-500 text-white';
      case 'offline': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar isNavOpen={isNavOpen}/>
      <div className="flex-grow">
        <Headerbar toggleNav={toggleNav} />

        <main className="p-6">
          <div className="grid grid-cols-6 gap-4 mb-6">
            <FilterButton label="All Devices" count={devices.length} color="bg-teal-600" icon={ArrowUpDown} filter="all" />
            <FilterButton label="Connected" count={devices.filter(d => d.connected).length} color="bg-green-700" icon={ArrowUpDown} filter="connected" />
            <FilterButton label="Favorites" count={devices.filter(d => d.favorite).length} color="bg-yellow-600" icon={Star} filter="favorites" />
            <FilterButton label="New Devices" count={devices.filter(d => d.status === 'new').length} color="bg-yellow-600" icon={PlusCircle} filter="new" />
            <FilterButton label="Down Alerts" count={devices.filter(d => d.status === 'offline').length} color="bg-red-700" icon={AlertTriangle} filter="down-alerts" />
            <FilterButton label="Archived" count={devices.filter(d => d.archived).length} color="bg-gray-600" icon={Archive} filter="archived" />
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All Devices</h2>
              <div className="flex items-center">
                <span className="mr-2">Show</span>
                <select className="bg-gray-700 text-white px-2 py-1 rounded">
                  <option>10</option>
                </select>
                <span className="ml-2">entries</span>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th>Name <SortButton column="name" /></th>
                  <th>Owner <SortButton column="owner" /></th>
                  <th>Type <SortButton column="type" /></th>
                  <th>Favorite <SortButton column="favorite" /></th>
                  <th>Group <SortButton column="group" /></th>
                  <th>First Session <SortButton column="firstSession" /></th>
                  <th>Last Session <SortButton column="lastSession" /></th>
                  <th>Last IP <SortButton column="lastIP" /></th>
                  <th>MAC <SortButton column="mac" /></th>
                  <th>Status <SortButton column="status" /></th>
                </tr>
              </thead>
              <tbody>
                {sortedDevices.map((device, index) => (
                  <tr key={index} className="hover:bg-gray-700 cursor-pointer" onClick={() => handleDeviceClick(device)}>
                    <td className="py-2 text-blue-400">{device.name}</td>
                    <td>{device.owner}</td>
                    <td>{device.type}</td>
                    <td>{device.favorite ? 'Yes' : 'No'}</td>
                    <td>{device.group}</td>
                    <td>{device.firstSession}</td>
                    <td>{device.lastSession}</td>
                    <td>{device.lastIP}</td>
                    <td>{device.mac}</td>
                    <td>
                      <span className={`px-2 py-1 rounded ${getStatusStyle(device.status)}`}>
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-sm">
              Showing 1 to {sortedDevices.length} of {sortedDevices.length} entries
            </div>
          </div>
        </main>
        <footer className="p-4 text-center text-sm text-gray-500">
          © 2024 JakeClark
        </footer>
      </div>
    </div>
  );
};

export default DeviceDashboard;