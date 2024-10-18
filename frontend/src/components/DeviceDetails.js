import React, { useState } from 'react';
import { X, ChevronDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import '../App.css'

const DeviceDetails = ({ device }) => {
  const [activeTab, setActiveTab] = useState('details');

  const StatusCard = ({ title, value, color }) => (
    <Card className={`bg-${color}-500 text-white`}>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">{value}</h3>
        <p>{title}</p>
      </CardContent>
    </Card>
  );

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

  return (
    <div className="bg-gray-800 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">MSI-4 ((unknown))</h2>
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 h-3 w-3 rounded-full"></div>
          <span>Active</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatusCard title="Current Status" value="Offline" color="blue" />
        <StatusCard title="Sessions" value="1" color="green" />
        <StatusCard title="Presence" value="0 h." color="yellow" />
        <StatusCard title="Down Alerts" value="0" color="red" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="presence">Presence</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <InfoSection title="Main Info" fields={[
                { label: 'MAC', value: 'e8:84:a5:19:0d:d9' },
                { label: 'Name', value: 'MSI-4' },
                { label: 'Owner', value: '(unknown)', type: 'select' },
                { label: 'Type', value: '', type: 'select' },
                { label: 'Vendor', value: 'Intel Corporate' },
                { label: 'Model', value: '' },
                { label: 'Serial', value: '' },
                { label: 'Group', value: '', type: 'select' },
                { label: 'Location', value: '', type: 'select' },
                { label: 'Comments', value: '' },
              ]} />
            </div>
            <div>
              <InfoSection title="Session Info" fields={[
                { label: 'Status', value: 'Offline' },
                { label: 'First Session', value: '2024-10-15 11:35' },
                { label: 'Last Session', value: '2024-10-15 11:35' },
                { label: 'Last IP', value: '172.30.2.12' },
              ]} />
              <InfoSection title="Network" fields={[
                { label: 'Uplink Target', value: '', type: 'select' },
                { label: 'Target Port Number', value: '' },
                { label: 'Connection Type', value: '', type: 'select' },
                { label: 'Link Speed', value: '', type: 'select' },
              ]} />
            </div>
          </div>
          <div className="mt-6">
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
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="destructive">Delete Events</Button>
            <Button variant="destructive">Delete Device</Button>
            <Button variant="secondary">Reset Changes</Button>
            <Button variant="primary">Save</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDetails;