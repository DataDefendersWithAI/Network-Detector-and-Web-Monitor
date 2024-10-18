// Import ./components/Dashboard.js
import DeviceDashboard from './components/Dashboard';
import DeviceDetails from './components/DeviceDetails';

const App = () => {
  const handleDeviceClick = (deviceName) => {
    console.log(`Clicked device: ${deviceName.name}`);
    // Handle navigation or other actions here
    // Redirect to DeviceDetails page

  };

  // return <DeviceDashboard onDeviceClick={handleDeviceClick} />;
  return <DeviceDetails device={{ name: 'JakeClark-Sep21st', owner: '(unknown)', type: '', favorite: false, group: '', firstSession: '2024-10-14 22:45', lastSession: '2024-10-14 22:45', lastIP: '100.0.0.0', mac: '', status: 'new', connected: true, archived: false }} />;
};

export default App;