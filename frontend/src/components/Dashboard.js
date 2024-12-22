import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Star, PlusCircle, AlertTriangle, Archive, ChevronUp, ChevronDown } from 'lucide-react';
import '../App.css';
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';
import axios from 'axios';

const DeviceDashboard = ({ onDeviceClick }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [devices, setDevices] = useState([]); // Devices will be here
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [activeFilters, setActiveFilters] = useState([]);
  const serverUrl = 'http://localhost:3060';

  const handleDeviceClick = (device) => {
    // if (onDeviceClick) {
    //   onDeviceClick(device);
    // }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/ip/`);
      setDevices(response.data);
      console.log('Devices:', response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const changeHost = async () => { 
    try {
      const newHost = document.querySelector('input').value;
      console.log('New host:', newHost);
      const response = axios.post(`${serverUrl}/api/ip/changehost`, {
        host: newHost
      });
      console.log('Response:', response);
      alert('Host changed successfully!');
      fetchDevices();
    }
    catch (error) {
      console.error('Error changing host:', error);
    }
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
        case 'is_active': return device.is_active;
        // case 'favorites': return device.favorite;
        // case 'new': return device.status === 'new';
        // case 'down-alerts': return device.status === 'offline';
        // case 'archived': return device.archived;
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

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar isNavOpen={isNavOpen}/>
      <div className="flex-grow">
        <Headerbar toggleNav={toggleNav} headerContent={"Devices"}/>

        <main className="p-6">
          <div className="grid grid-cols-6 gap-4 mb-6">
            <FilterButton label="All Devices" count={devices.length} color="bg-teal-600" icon={ArrowUpDown} filter="all" />
            <FilterButton label="Connected" count={devices.filter(d => d.is_active == true).length} color="bg-green-700" icon={ArrowUpDown} filter="is_active" />
            {/* <FilterButton label="Favorites" count={devices.filter(d => d.favorite).length} color="bg-yellow-600" icon={Star} filter="favorites" /> */}
            {/* <FilterButton label="New Devices" count={devices.filter(d => d.status === 'new').length} color="bg-yellow-600" icon={PlusCircle} filter="new" /> */}
            {/* <FilterButton label="Down Alerts" count={devices.filter(d => d.is_active == false).length} color="bg-red-700" icon={AlertTriangle} filter="down-alerts" /> */}
            {/* <FilterButton label="Archived" count={devices.filter(d => d.archived).length} color="bg-gray-600" icon={Archive} filter="archived" /> */}
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">All Devices</h2>
              {/* <div className="flex items-center">
                <span className="mr-2">Show</span>
                <select className="bg-gray-700 text-white px-2 py-1 rounded">
                  <option>10</option>
                </select>
                <span className="ml-2">entries</span>
              </div> */}
              <div className="flex items-center">
                <span className="mr-2">Change host</span>
                <input type="text" className="bg-gray-700 text-white px-2 py-1 rounded" placeholder="192.168.1.0/24" />
                <button className="bg-blue-500 text-white px-4 py-1 rounded ml-2" onClick={changeHost}>Change</button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  {/* <th>Name <SortButton column="name" /></th>
                  <th>Owner <SortButton column="owner" /></th>
                  <th>Type <SortButton column="type" /></th> */}
                  <th>IP <SortButton column="lastIP" /></th>
                  <th>MAC <SortButton column="mac" /></th>
                  <th>Last Scan Date<SortButton column="lastSession" /></th>
                  <th>Open Port(s)</th>
                  <th>Is Active?<SortButton column="status" /></th>
                </tr>
              </thead>
              <tbody>
                {sortedDevices.map((device, index) => (
                  <tr key={index} className="hover:bg-gray-700 cursor-pointer" onClick={() => window.location.href = `/device-details/?id=${device.id}`}>
                    <td className="py-2 text-blue-400">{device.ip_address}</td>
                    <td>{device.mac_address}</td>
                    <td>{new Date(device.scan_date).toLocaleString("vi-VN")}</td>
                    <td>{device.open_ports}</td>
                    <td>{device.is_active? "Yes":"No"}</td>
                    {/* <td>
                      <span className={`px-2 py-1 rounded ${getStatusStyle(device.status)}`}>
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-sm">
              Showing {sortedDevices.length} entries
            </div>
          </div>
        </main>
        <footer className="p-4 text-center text-sm text-gray-500">
          © 2024 Not.Detector, J4ckP0t
        </footer>
      </div>
    </div>
  );
};

export default DeviceDashboard;