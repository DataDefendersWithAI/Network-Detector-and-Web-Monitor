// Import ./components/Dashboard.js
import DeviceDashboard from './components/Dashboard';

const App = () => {
  const handleDeviceClick = (deviceName) => {
    console.log(`Clicked device: ${deviceName}`);
    // Handle navigation or other actions here
  };

  return <DeviceDashboard onDeviceClick={handleDeviceClick} />;
};

export default App;