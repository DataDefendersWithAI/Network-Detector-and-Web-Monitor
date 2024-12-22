import React, { useEffect, useState } from 'react';
import { X, ChevronDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import '../App.css'
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';
import axios from 'axios';

const DeviceDetails = ({ device }) => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const queryParams = new URLSearchParams(window.location.search);
    const idParam = queryParams.get('id');
    const [deviceDetails, setDeviceDetails] = useState({});
    const [editedDetails, setEditedDetails] = useState({});

    const [isRunningDefaultScan, setIsRunningDefaultScan] = useState(false);
    const [isRunningFastScan, setIsRunningFastScan] = useState(false);
    const [isRunningFullScan, setIsRunningFullScan] = useState(false);

    const [defaultScanResult, setDefaultScanResult] = useState("");
    const [fastScanResult, setFastScanResult] = useState("");
    const [fullScanResult, setFullScanResult] = useState("");

    const [pagination, setPagination] = useState({ page: 1, entries: 5, total: 0 });
    const [events, setEvents] = useState([]);

    const serverUrl = 'http://localhost:3060';

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const fetchIPDetail = async (id) => {
        try {
            const response = await axios.get(`${serverUrl}/api/ip/${id}`);
            console.log('IP Detail:', response.data);
            setDeviceDetails(response.data);
            setEditedDetails(response.data); // Initialize editable fields with fetched data
            setEvents(response.data.events);
            setPagination((prev) => ({ ...prev, total: response.data.events.length }));
        } catch (error) {
            console.error('Error fetching IP detail:', error);
        }
    };

    const handlePaginationChange = (field, value) => {
        setPagination((prev) => ({ ...prev, [field]: Number(value), page: 1 }));
    };

    const paginatedEvents = React.useMemo(() => {
        const start = (pagination.page - 1) * pagination.entries;
        const end = start + pagination.entries;
        return events.slice(start, end);
    }, [events, pagination]);

    const StatusCard = ({ title, value, color }) => (
        <Card className={`bg-${color}-500 text-white`}>
            <CardContent className="p-4">
                <h3 className="text-xl font-bold">{value}</h3>
                <p>{title}</p>
            </CardContent>
        </Card>
    );
    const handleInputChange = (field, value) => {
        console.log('Field:', field, 'Value:', value);
        setEditedDetails((prev) => ({ ...prev, [field]: value }));
    };
    
    const InfoSection = ({ title, fields }) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">{title}</h3>
            <div className="grid grid-cols-2 gap-4">
                {fields.map((field, index) => (
                    <div key={index} className="flex flex-col">
                        <label className="text-sm text-gray-400">{field.label}</label>
                        {field.type === 'select' ? (
                            <div className="flex items-center">
                                <Input value={field.value} readOnly className="bg-gray-700 text-white" />
                                <Button variant="ghost" size="icon" className="ml-2">
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Input value={field.value} readOnly className="bg-gray-700 text-white" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );


    const saveChanges = async () => {
        try {
            const response = await axios.post(`${serverUrl}/api/ip/${idParam}`, editedDetails);
            setDeviceDetails(response.data); // Update displayed details after save
            alert('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes.');
        }
    };

    const makeDefaultScan = async () => {
        try {
            setDefaultScanResult("");
            setIsRunningDefaultScan(true);
            const response = await axios.get(`${serverUrl}/api/ip/${idParam}/defaultscan`);
            console.log('Default scan response:', response.data);
            setDefaultScanResult(response.data.open_ports);
        } catch (error) {
            console.error('Error running default scan:', error);
            alert('Failed to run default scan.');
        } finally {
            setIsRunningDefaultScan(false);
        }
    };

    const makeFastScan = async () => {
        try {
            setFastScanResult("");
            setIsRunningFastScan(true);
            const response = await axios.get(`${serverUrl}/api/ip/${idParam}/fastscan`);
            console.log('Fast scan response:', response.data);
            setFastScanResult(response.data.open_ports);
        } catch (error) {
            console.error('Error running fast scan:', error);
            alert('Failed to run fast scan.');
        } finally {
            setIsRunningFastScan(false);
        }
    };

    const makeFullScan = async () => {
        try {
            setFullScanResult("");
            setIsRunningFullScan(true);
            const response = await axios.get(`${serverUrl}/api/ip/${idParam}/fullscan`);
            console.log('Full scan response:', response.data);
            setFullScanResult(response.data.open_ports);
        } catch (error) {
            console.error('Error running full scan:', error);
            alert('Failed to run full scan.');
        } finally {
            setIsRunningFullScan(false);
        }
    };

    const deleteDevice = async () => {
        try {
            const response = await axios.delete(`${serverUrl}/api/ip/${idParam}`);
            console.log('Delete response:', response.data);
            alert('Device deleted successfully!');
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting device:', error);
            alert('Failed to delete device.');
        }
    };


    const resetChanges = () => {
        setEditedDetails(deviceDetails); // Revert to original data
    };

    useEffect(() => {
        fetchIPDetail(idParam);
    }, [idParam]);

    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            <Sidebar isNavOpen={isNavOpen}/>
            <div className="flex-grow">
                <Headerbar toggleNav={toggleNav} headerContent={`Device Details`} />
                <main className="p-6">
                    <div className="bg-gray-800 text-white p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{deviceDetails.ip_address}</h2>
                            <div className="flex items-center space-x-2">
                                <div className={`h-3 w-3 rounded-full ${deviceDetails.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span>{deviceDetails.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <StatusCard title="Current Status" value={deviceDetails.is_active? "Online": "Offline"} color="blue" />
                            <StatusCard title="Down Alerts" value="0" color="red" />
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="tools">Tools</TabsTrigger>
                                <TabsTrigger value="events">Events</TabsTrigger>
                            </TabsList>

                           

                            <TabsContent value="details" className="mt-6">
                                <div className="grid grid-rows-2 gap-6">
                                    <div>
                                        {/* <InfoSection title="Main Info" fields={[
                                            { label: 'MAC', value: deviceDetails.mac_address, isReadOnly: true, key: "mac" },
                                            { label: 'Name', value: '(unknown)' },
                                            { label: 'Vendor', value: deviceDetails.vendor, key: "vendor" },
                                            { label: 'Device', value: deviceDetails.device, key: "device" },
                                            { label: 'OS', value: deviceDetails.os, key: "os" },
                                            
                                            // { label: 'Owner', value: '(unknown)', type: 'select' },
                                            // { label: 'Type', value: '', type: 'select' },
                                            
                                            // { label: 'Model', value: '' },
                                            // { label: 'Serial', value: '' },
                                            // { label: 'Group', value: '', type: 'select' },
                                            // { label: 'Location', value: '', type: 'select' },
                                            // { label: 'Comments', value: '' },
                                        ]} /> */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                            <label className="block mb-2">MAC Address</label>
                                            <input
                                                type="text"
                                                value={editedDetails.mac_address}
                                                onChange={(e) => handleInputChange("mac_address", e.target.value)}
                                                className="w-full p-2 bg-gray-700 text-white rounded"
                                                disabled
                                            />
                                            </div>
                                            {/* <div>
                                            <label className="block mb-2">Name</label>
                                            <input
                                                type="text"
                                                value="(unknown)"
                                                // onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="w-full p-2 bg-gray-700 text-white rounded"
                                            />
                                            </div> */}
                                            <div>
                                            <label className="block mb-2">Vendor</label>
                                            <input
                                                type="text"
                                                value={editedDetails.vendor}
                                                onChange={(e) => handleInputChange("vendor", e.target.value)}
                                                className="w-full p-2 bg-gray-700 text-white rounded"
                                                
                                            />
                                            </div>
                                            <div>
                                            <label className="block mb-2">Device</label>
                                            <input
                                                value={editedDetails.device}
                                                onChange={(e) => handleInputChange("device", e.target.value)}
                                                className="w-full p-2 bg-gray-700 text-white rounded"
                                            ></input>
                                            </div>
                                            <div>
                                            <label className="block mb-2">OS</label>
                                            <input
                                                value={editedDetails.os}
                                                onChange={(e) => handleInputChange("os", e.target.value)}
                                                className="w-full p-2 bg-gray-700 text-white rounded"
                                            ></input>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <InfoSection title="Session Info" fields={[
                                            { label: 'Status', value: deviceDetails.is_active? "Online": "Offline" },
                                            // { label: 'First Session', value: '2024-10-15 11:35' },
                                            { label: 'Last Session', value: new Date(deviceDetails.scan_date).toLocaleString("vi-VN") },
                                            { label: 'Last IP', value: deviceDetails.ip_address },
                                        ]} />
                                        {/* <InfoSection title="Network" fields={[
                                            { label: 'Uplink Target', value: '', type: 'select' },
                                            { label: 'Target Port Number', value: '' },
                                            { label: 'Connection Type', value: '', type: 'select' },
                                            { label: 'Link Speed', value: '', type: 'select' },
                                        ]} /> */}
                                    </div>
                                </div>
                                {/* <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Events & Alerts config</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span>Scan Cycle</span>
                                                <div className="flex items-center">
                                                    <Input value="1" className="w-16 bg-gray-700 text-white mr-2" />
                                                    <Button variant="ghost" size="icon">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Checkbox id="alertAllEvents" />
                                                <label htmlFor="alertAllEvents">Alert All Events</label>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Checkbox id="alertDown" />
                                                <label htmlFor="alertDown">Alert Down</label>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span>Skip repeated notifications during</span>
                                                <div className="flex items-center">
                                                    <Input value="0 h (notify all events)" className="w-40 bg-gray-700 text-white mr-2" />
                                                    <Button variant="ghost" size="icon">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Checkbox id="newDevice" checked />
                                                <label htmlFor="newDevice">New Device:</label>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Checkbox id="favorite" />
                                                <label htmlFor="favorite">Favorite</label>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Checkbox id="archived" />
                                                <label htmlFor="archived">Archived:</label>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Checkbox id="showOnPresence" checked />
                                                <label htmlFor="showOnPresence">Show on "Presence"</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span>Random MAC:</span>
                                                <Button variant="ghost" size="icon">
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <AlertTriangle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="flex justify-end space-x-4 mt-6">
                                    {/* <Button variant="destructive">Delete Events - pls make backend this thing...</Button> */}
                                    <Button variant="destructive" onClick={deleteDevice}>Delete Device</Button>
                                    <Button variant="secondary" onClick={resetChanges}>Reset Changes</Button>
                                    <Button variant="primary" onClick={saveChanges} className='bg-blue-500'>Save</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="tools" className="mt-6">
                                {/* 3 buttons: default scan, fast scan, full scan */}
                                <div className="grid grid-cols-1 grid gap-4">
                                    <div>
                                        <Button onClick={makeDefaultScan} disabled={isRunningDefaultScan} className='bg-blue-500 mr-3'>Default Scan</Button>
                                        {isRunningDefaultScan && <span>Running default scan...</span>}
                                        {defaultScanResult && <span>Open ports: {defaultScanResult}</span>}
                                    </div>
                                    <div>
                                        <Button onClick={makeFastScan} disabled={isRunningFastScan} className='bg-blue-500 mr-3'>Fast Scan</Button>
                                        {isRunningFastScan && <span>Running fast scan...</span>}
                                        {fastScanResult && <span>Open ports: {fastScanResult}</span>}
                                    </div>
                                    <div>
                                        <Button onClick={makeFullScan} disabled={isRunningFullScan} className='bg-blue-500 mr-3'>Full Scan</Button>
                                        {isRunningFullScan && <span>Running full scan...</span>}
                                        {fullScanResult && <span>Open ports: {fullScanResult}</span>}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="events" className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold mb-4">Events</h2>
                                <div className="ml-auto">
                                <label className="mr-2">Entries per page:</label>
                                <select
                                    value={pagination.entries}
                                    onChange={(e) => handlePaginationChange("entries", e.target.value)}
                                    className="bg-gray-700 text-white p-2 rounded"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                </div>
                            </div>
                            <table className="w-full table-auto mb-4">
                                <thead>
                                <tr className="text-left">
                                    <th className="py-2 px-4">Event Date</th>
                                    <th className="py-2 px-4">Is Active?</th>
                                    <th className="py-2 px-4">Additional Info</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedEvents.map((record, index) => (
                                    <tr key={index}>
                                    <td className="py-1">{new Date(record.event_date).toLocaleString()}</td>
                                    <td>{record.is_active? "Yes": "No"}</td>
                                    <td>{record.additional_info}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="flex items-center mb-4">
                                <div>
                                <button
                                    disabled={pagination.page <= 1}
                                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                    className="mr-2 bg-gray-700 text-white p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {pagination.page} of {Math.ceil(pagination.total / pagination.entries)}
                                </span>
                                <button
                                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.entries)}
                                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                    className="ml-2 bg-gray-700 text-white p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                                </div>
                                <span className="ml-auto">
                                    Showing {paginatedEvents.length} of {pagination.total} entries
                                </span>
                            </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DeviceDetails;