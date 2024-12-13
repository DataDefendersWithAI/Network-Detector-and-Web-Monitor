import React, {useState, useEffect} from "react";
import {Plus, Trash2 } from "lucide-react";
import '../App.css'
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';
import axios from 'axios';

const InternetSpeedtest = ({ onDeviceClick }) => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [speedTestHistory, setSpeedTestHistory] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    // Function to fetch the speed test history
    const fetchSpeedTestHistory = async () => {
        try {
            const response = await axios.get('http://localhost:3060/api/speedtest/?action=list');
            setSpeedTestHistory(response.data);
        } catch (error) {
            console.error('Error fetching speed test history:', error);
        }
    };

    // Function to initiate a new speed test
    const handleSpeedTest = async () => {
        setIsRunning(true); // Show "Running..." state
        try {
            await axios.get('http://localhost:3060/api/speedtest/');
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
            await axios.delete(`http://localhost:3060/api/speedtest/?date=${created_at}/`);
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
                <Headerbar onToggleNav={toggleNav} headerContent={"Internet Speedtest"} />
                
                {/* Main content */}
                <main className="p-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        {/* Speedtest Section */}
                        <div className="rounded-lg shadow">
                            <div className="flex justify-start items-center mb-4 *:mr-5">
                                <h2 className="text-xl font-semibold">Speedtest</h2>
                                <button className="bg-blue-500 text-white rounded-full p-1 px-3" onClick={handleSpeedTest} disabled={isRunning}>
                                    <Plus className="w-5 h-5" />
                                </button>
                                {isRunning && <span className="ml-2 text-gray-500">Running...</span>}
                            </div>
                            <table className="min-w-full text-left">
                            <thead className="w-full">
                                <tr>
                                <th className="py-2 px-4 ">Tested Time</th>
                                <th className="py-2 px-4 ">Download</th>
                                <th className="py-2 px-4 ">Upload</th>
                                <th className="py-2 px-4 ">Ping</th>
                                <th className="py-2 px-4 ">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {speedTestHistory.map((test, index) => (
                                    <tr key={index}>
                                    <td className="py-2 px-4 ">{new Date(test.created_at).toLocaleString()}</td>
                                    <td className="py-2 px-4 ">{test.download_speed}</td>
                                    <td className="py-2 px-4 ">{test.upload_speed}</td>
                                    <td className="py-2 px-4 ">{test.ping}</td>
                                    <td className="py-2 px-4 ">
                                    <button className="bg-red-500 text-white rounded-full p-2 flex items-center" onClick={() => {deleteSpeedTest(test.created_at)}}>
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    </td>
                                    </tr>
                                ))}
                                {/* Additional rows can be added dynamically here */}
                            </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default InternetSpeedtest;