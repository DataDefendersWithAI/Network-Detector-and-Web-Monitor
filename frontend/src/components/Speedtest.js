import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import '../App.css'
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';

const Speedtest = ({ onDeviceClick }) => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            {/* Sidebar */}
            <Sidebar isNavOpen={isNavOpen} />
            <div className="flex-grow">
                {/* Headerbar */}
                <Headerbar toggleNav={toggleNav} />
                <main className="p-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                        {/* Content */}
                        <div className="space-y-6">
                        {/* Web Services Section */}
                        <div className="rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Web Services</h2>
                                <button className="bg-blue-500 text-black rounded-full p-1 px-3">+</button>
                            </div>
                            <table className="min-w-full text-left border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="py-2 px-4 border-b">URL</th>
                                <th className="py-2 px-4 border-b">Device</th>
                                <th className="py-2 px-4 border-b">Last 10 Scanned</th>
                                <th className="py-2 px-4 border-b">Scan Now</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="py-2 px-4 border-b">
                                    <a href="/web-services/details?url=localhost:5000" className="text-blue-600 hover:underline">
                                    localhost:5000
                                    </a>
                                </td>
                                <td className="py-2 px-4 border-b">Server</td>
                                <td className="py-2 px-4 border-b">
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

                        {/* Speedtest Section */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Speedtest</h2>
                            <button className="bg-blue-500 text-white rounded-full p-2">+</button>
                            </div>
                            <table className="min-w-full text-left border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                <th className="py-2 px-4 border-b">Tested Time</th>
                                <th className="py-2 px-4 border-b">Download</th>
                                <th className="py-2 px-4 border-b">Upload</th>
                                <th className="py-2 px-4 border-b">Ping</th>
                                <th className="py-2 px-4 border-b">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="py-2 px-4 border-b">26/04/2024 18:36:25</td>
                                <td className="py-2 px-4 border-b">8 Mbps</td>
                                <td className="py-2 px-4 border-b">8 Mbps</td>
                                <td className="py-2 px-4 border-b">8 ms</td>
                                <td className="py-2 px-4 border-b">
                                <button className="bg-red-500 text-white rounded-full p-2 flex items-center">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                </td>
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

export default Speedtest;