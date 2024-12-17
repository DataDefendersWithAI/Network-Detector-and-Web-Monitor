import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import '../App.css'
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';
import axios from 'axios';

const WebServicesMonitor = ({ onDeviceClick }) => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [speedTestHistory, setSpeedTestHistory] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const server = "http://localhost:3060";

    // Function to fetch the speed test history
    const fetchSpeedTestHistory = async () => {
        try {
        const response = await axios.get(`${server}/api/speedtest/?action=list`);
        setSpeedTestHistory(response.data);
        } catch (error) {
        console.error('Error fetching speed test history:', error);
        }
    };

    // Function to initiate a new speed test
    const handleSpeedTest = async () => {
        setIsRunning(true); // Show "Running..." state
        try {
        await axios.get(`${server}/api/speedtest/`);
        await fetchSpeedTestHistory(); // Refresh the history after the speed test completes
        } catch (error) {
        console.error('Error running speed test:', error);
        } finally {
        setIsRunning(false); // Reset loading state
        }
    };

    // Function to delete a speed test record
    const deleteSpeedTest = async (created_at) => {
        try {
        await axios.delete(`${server}/api/speedtest/?date=${created_at}/`);
        await fetchSpeedTestHistory(); // Refresh the history after the speed test completes
        } catch (error) {
        console.error('Error deleting speed test:', error);
        }
    };

    // Fetch the speed test history initially when the component mounts
    useEffect(() => {
        fetchSpeedTestHistory();
    }, []);

    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            {/* Sidebar */}
            <Sidebar isNavOpen={isNavOpen} />
            <div className="flex-grow">
                {/* Headerbar */}
                <Headerbar toggleNav={toggleNav} headerContent={"Web Services"}/>
                <main className="p-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                        {/* Content */}
                        <div className="space-y-6">
                        {/* Web Services Section */}
                        <div className="rounded-lg shadow">
                            <div className="flex justify-start items-center mb-4 *:mr-5">
                                <h2 className="text-xl font-bold">Web Services</h2>
                                <button className="bg-blue-500 text-white rounded-full p-1 px-3">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <table className="min-w-full text-left">
                            <thead className="w-full">
                                <tr>
                                <th className="py-2 px-4">URL</th>
                                <th className="py-2 px-4">Device</th>
                                <th className="py-2 px-4">Last 10 Scanned</th>
                                <th className="py-2 px-4">Scan Now</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="py-2 px-4 ">
                                    <a href="/web-services/details?url=localhost:5000" className="text-blue-600 hover:underline">
                                    localhost:5000
                                    </a>
                                </td>
                                <td className="py-2 px-4 ">Server</td>
                                <td className="py-2 px-4 ">
                                    {'✔'.repeat(10).split('').map((check, index) => (
                                    <span key={index} className="text-green-500">✔</span>
                                    ))}
                                </td>
                                <button className="bg-green-500 text-white rounded-full p-2 flex items-center">
                                    <Plus className="w-5 h-5" />
                                </button>
                                </tr>
                                {/* Additional rows can be added dynamically here */}
                            </tbody>
                            </table>
                        </div>

                        
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default WebServicesMonitor;