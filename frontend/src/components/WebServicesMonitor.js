import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import '../App.css';
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';
import axios from 'axios';

const WebServicesMonitor = ({ onDeviceClick }) => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [webMonitorResults, setWebMonitorResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(5);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newWebsite, setNewWebsite] = useState({ url: '', tag: '', monitorEvents: 'all' });

    // Is web services monitor started
    const [isMonitorStarted, setIsMonitorStarted] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const server = "http://localhost:3060/api/web-monitor";

    // Fetch brief monitor results when component mounts or limit changes
    useEffect(() => {
        fetchBriefResults(limit);
    }, [limit]);

    const fetchBriefResults = async (limit) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${server}/`, {
                params: {
                    action: 'brief',
                    limit: limit
                }
            });
            setWebMonitorResults(response.data);
        } catch (error) {
            console.error("Error fetching brief results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddWebsite = async () => {
        try {
            await axios.post(`${server}/add/`, {
                url: newWebsite.url,
                tag: newWebsite.tag,
                monitor_all_events: newWebsite.monitorEvents === 'all',
                monitor_down_events: newWebsite.monitorEvents === 'down',
            });
            setShowAddPopup(false);
            fetchBriefResults(limit);
            setNewWebsite({ url: '', tag: '', monitorEvents: 'all' });
        } catch (error) {
            console.error("Error adding website:", error);
        }
    };

    // Run the monitor at /api/web-monitor/run/
    const handleRunMonitor = async () => {
        try {
            await axios.get(`${server}/run/`);
            fetchBriefResults(limit);
            setIsMonitorStarted(true);
        } catch (error) {
            console.error("Error running monitor:", error);
        }
        finally {
            setIsMonitorStarted(false);
        }
    }

    const between = (x, min, max) => {
        return x >= min && x <= max;
      }

    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            {/* Sidebar */}
            <Sidebar isNavOpen={isNavOpen} />
            <div className="flex-grow">
                {/* Headerbar */}
                <Headerbar toggleNav={toggleNav} headerContent={"Web Services"} syncCallback={handleRunMonitor} syncDisabled={isMonitorStarted} />
                <main className="p-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                        {/* Content */}
                        <div className="space-y-6">
                            {/* Web Services Section */}
                            <div className="rounded-lg shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Web Monitor Results</h2>
                                    <div className="flex gap-4">
                                        <div>
                                            <label htmlFor="limit-select" className="mr-2">Results Limit:</label>
                                            <select
                                                id="limit-select"
                                                className="bg-gray-700 text-white rounded p-2"
                                                value={limit}
                                                onChange={(e) => setLimit(Number(e.target.value))}
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => setShowAddPopup(true)}
                                            className="bg-blue-500 text-white rounded-full p-2 flex items-center"
                                        >
                                            <Plus className="w-5 h-5 mr-1" /> Add Website
                                        </button>
                                    </div>
                                </div>
                                {/* Loading Spinner */}
                                {isLoading ? (
                                    <div className="text-center text-gray-400">Loading...</div>
                                ) : (
                                    <table className="min-w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4">URL</th>
                                                <th className="py-2 px-4">Tag</th>
                                                <th className='py-2 px-4'>Monitor Down</th>
                                                <th className="py-2 px-4">Last {limit} Scanned</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {webMonitorResults.map((item, index) => (
                                                <tr key={index}>
                                                    <td className={`py-2 px-4 ${
                                                        between(item.results[item.results.length - 1], 200, 299) ? "text-green-500": 
                                                        between(item.results[item.results.length - 1], 500, 599) ? "text-red-500": 
                                                            "text-blue-400"
                                                        } hover:underline cursor-pointer`} onClick={() => window.location.href = `/web-services/${item.website.url}`}>
                                                        {item.website.url}
                                                    </td>
                                                    <td className="py-2 px-4">{item.website.tag || "-"}</td>
                                                    <td className="py-2 px-4">{item.website.monitor_down_events ? "Yes" : "No"}</td>
                                                    <td className="py-2 px-4 flex gap-1">
                                                        {item.results.slice(-10).map((code, idx) => (
                                                            between(code, 200, 299) ? (
                                                                <CheckCircle
                                                                    key={idx}
                                                                    className="text-green-500 w-5 h-5"
                                                                />
                                                            ) : between(code, 400, 599) ? (
                                                                <XCircle
                                                                    key={idx}
                                                                    className="text-red-500 w-5 h-5"
                                                                />
                                                            ) : (
                                                                <MinusCircle
                                                                    key={idx}
                                                                    className="text-gray-500 w-5 h-5"
                                                                />
                                                            )
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                </div>
                                </div>
                                </div>
                    {showAddPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-gray-800 p-6 rounded-lg text-white w-96">
                                <h3 className="text-lg font-bold mb-4">Add Website</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="url" className="block">URL:</label>
                                        <input
                                            type="text"
                                            id="url"
                                            className="w-full bg-gray-700 text-white rounded p-2"
                                            value={newWebsite.url}
                                            onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="tag" className="block">Tag:</label>
                                        <input
                                            type="text"
                                            id="tag"
                                            className="w-full bg-gray-700 text-white rounded p-2"
                                            value={newWebsite.tag}
                                            onChange={(e) => setNewWebsite({ ...newWebsite, tag: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block">Monitor Events:</label>
                                        <div className="flex gap-4">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="monitorEvents"
                                                    value="all"
                                                    checked={newWebsite.monitorEvents === 'all'}
                                                    onChange={(e) => setNewWebsite({ ...newWebsite, monitorEvents: e.target.value })}
                                                /> All Events
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="monitorEvents"
                                                    value="down"
                                                    checked={newWebsite.monitorEvents === 'down'}
                                                    onChange={(e) => setNewWebsite({ ...newWebsite, monitorEvents: e.target.value })}
                                                /> Down Events
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => setShowAddPopup(false)}
                                            className="bg-gray-600 px-4 py-2 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddWebsite}
                                            className="bg-blue-500 px-4 py-2 rounded"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default WebServicesMonitor;
