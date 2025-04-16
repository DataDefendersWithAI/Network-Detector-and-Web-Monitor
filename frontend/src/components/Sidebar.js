// Sidebar.js
import React from 'react';
import { Monitor, Network, Gauge, Globe, Radio, Calendar, Users, FileText, Settings, HelpCircle, RefreshCw, FileSearch, ChartNetwork, Bell} from 'lucide-react';
import '../App.css';
// Import REST API
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const NavItem = ({ icon: Icon, label, badge, isNavOpen, path }) => {
  const navigate = useNavigate();
  return (
    <div className="relative flex items-center text-gray-300 hover:bg-gray-700 px-4 py-2 cursor-pointer group" onClick={() => navigate(path)}>
      <Icon size={20} className="mr-2" />
      <span className={`transition-opacity duration-300 ${isNavOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>{label}</span>
      {badge > 0 && <span className={`ml-auto bg-green-500 text-black text-xs px-2 py-1 rounded transition-opacity duration-300 ${isNavOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>{badge}</span>}
      {!isNavOpen && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};



const Sidebar = ({ isNavOpen }) => {
    const [newCount, setNewCount] = React.useState(localStorage.getItem("newCount") || 0);

    const fetchNewNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:3060/api/new-notifications/");
        setNewCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch new notifications:", error);
      }
    };

    // Fetch notifications when the component mounts
    useEffect(() => {
      fetchNewNotifications();
      const ws = new WebSocket("ws://localhost:3060/ws/new-notifications/");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNewCount(parseInt(data.count));
      };
      ws.onerror = (error) => {console.error("WebSocket error:", error);};
      return () => ws.close();
    }, []);

    // Save the newCount in the local storage
    useEffect(() => {
      localStorage.setItem("newCount", newCount);
    }, [newCount]);

  const navigate = useNavigate();
  return (
    <nav className={`bg-gray-800 flex flex-col transition-all duration-300 ease-in-out ${isNavOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className="p-4 flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <h1 className={`text-2xl font-bold transition-opacity duration-300 ${isNavOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>Not.Detector</h1>
      </div>
      <div className="flex-grow">
        <h2 className={`px-4 py-2 text-sm font-semibold text-gray-400 uppercase transition-opacity duration-300 ${isNavOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>Main Menu</h2>
        <NavItem icon={Monitor} label="Devices" isNavOpen={isNavOpen} path={"/"}/>
        {/* <NavItem icon={Network} label="Network" isNavOpen={isNavOpen}/> */}
        {/* When user click on Web Service button, redirect to /web-services */}
        <NavItem icon={Globe} label="Web Services" isNavOpen={isNavOpen} path={"/web-services"}/>
        <NavItem icon={Gauge} label="Internet Speedtest" isNavOpen={isNavOpen} path={"/speedtest"}/>
        <NavItem icon={Radio} label="ICMP Monitoring" isNavOpen={isNavOpen} path={"/ICMP"}/>
        <NavItem icon={FileSearch} label="Packet Capture" isNavOpen={isNavOpen} path={"/packet-capture"}/>
        <NavItem icon={ChartNetwork} label="Traffic Analysis" isNavOpen={isNavOpen} path={"/traffic-analysis"}/>
        <NavItem icon={Bell} label="Notifications" badge={newCount} isNavOpen={isNavOpen} path={"/notifications"}/>
        <h2 className={`px-4 py-2 text-sm font-semibold text-gray-400 uppercase mt-4 transition-opacity duration-300 ${isNavOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>Events & Journal</h2>
        <NavItem icon={Calendar} label="Events" isNavOpen={isNavOpen} path={"/event"}/>
        {/* <NavItem icon={Users} label="Presence" badge="3/0" isNavOpen={isNavOpen}/> */}
        {/* <NavItem icon={FileText} label="Pi.Alert Journal" isNavOpen={isNavOpen}/> */}
        {/* <h2 className={`px-4 py-2 text-sm font-semibold text-gray-400 uppercase mt-4 transition-opacity duration-300 ${isNavOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>Settings & Help</h2>
        {/* <NavItem icon={Settings} label="Settings" isNavOpen={isNavOpen}/>
        <NavItem icon={HelpCircle} label="Help / FAQ" isNavOpen={isNavOpen}/>
        <NavItem icon={RefreshCw} label="Update Check" isNavOpen={isNavOpen}/> */}
        {/* Coming soon... */}
      </div>
    </nav>
  );
}

export default Sidebar;
