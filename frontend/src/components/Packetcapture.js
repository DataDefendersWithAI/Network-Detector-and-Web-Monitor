import React, { useState, useEffect } from "react";
import { Play, StopCircle, Save, FolderOpen, RefreshCw } from "lucide-react";
import Sidebar from "./Sidebar";
import "../App.css";
import Headerbar from "./Headerbar";
import {
  downloadPcapWithFilename,
  fetchPackets,
  startCaptureCall,
  stopCaptureCall,
  getNetworkInterfaces,
} from "./Api_call";

const PacketCapture = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [filter, setFilter] = useState("");
  const [filteredPacketsShow, setFilteredPacketsShow] = useState([]);
  const [filteredPacketsSummary, setFilteredPacketsSummary] = useState([]);
  const [selectedPacketIndex, setSelectedPacketIndex] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [file, setFile] = useState(null);
  const [networkInterface, setNetworkInterface] = useState("");
  const [networkInterfaces, setNetworkInterfaces] = useState([]);
  const [saveMessage, setSaveMessage] = useState(""); // Save notification state

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Add event listener to stop capturing on page unload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      stopCaptureCall();
      console.log("Capture stopped on page unload");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleBeforeUnload);
    };
  }, []);

  // Function to reload network interfaces
  const reloadInterfaces = () => {
    try {
      getNetworkInterfaces(setNetworkInterfaces); // Replace with your API call to fetch interfaces
      if (!networkInterfaces.includes(networkInterface)) {
        setNetworkInterface(networkInterfaces[0] || "");
        console.log(networkInterfaces);
      }
    } catch (error) {
      console.error("Failed to reload interfaces:", error);
    }
  };

  // function handle start capture button
  const handleStartCapture = () => {
    if (networkInterface === "") {
      setSaveMessage("Select an interface to start capturing");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    if (!isCapturing) {
      setIsCapturing(true);
      setFile(null);
      setFilteredPacketsShow([]);
      setFilteredPacketsSummary([]);
      setSaveMessage("Capturing packets...");
      console.log("filter", filter);
      console.log("interface", networkInterface);
      startCaptureCall(filter, networkInterface);
    }
  };

  // function handle stop capture button
  const handleStopCapture = async () => {
    if (isCapturing) {
      // make the last fetch call to get the last packets
      setIsCapturing(false);
      await fetchPackets(
        null,
        filter,
        setFilteredPacketsShow,
        setFilteredPacketsSummary
      ).then(() => {
        stopCaptureCall();
      });

      setSaveMessage("Stopped capturing packets");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // function handle save capture button
  const handleSaveCapture = () => {
    if (isCapturing) {
      setSaveMessage("Cannot save live packets");
      setTimeout(() => setSaveMessage(""), 3000);
    } else if (filteredPacketsShow.length > 0 && file === null) {
      console.log("saving");
      downloadPcapWithFilename();
    }
  };

  const handlePacketSelectIndex = (index) => {
    setSelectedPacketIndex(index);
  };

  const handleOpenPcap = async (event) => {
    if (isCapturing) {
      setSaveMessage("Cannot open PCAP file while capturing");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
    setFile(event.target.files[0]);
    if (file) {
      fetchPackets(
        file,
        filter,
        setFilteredPacketsShow,
        setFilteredPacketsSummary
      );
    } else if (!file) {
      setSaveMessage("No file selected");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleApplyFilter = () => {
    if (isCapturing) {
      setSaveMessage("Cannot apply filter to live packets");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    } else if (file) {
      fetchPackets(
        file,
        filter,
        setFilteredPacketsShow,
        setFilteredPacketsSummary
      );
    } else if (!file) {
      fetchPackets(
        null,
        filter,
        setFilteredPacketsShow,
        setFilteredPacketsSummary
      );
    }
  };

  const handleUpdateButton = () => {
    if (isCapturing) {
      fetchPackets(
        null,
        filter,
        setFilteredPacketsShow,
        setFilteredPacketsSummary
      );
    }
    else {
      setSaveMessage("Cannot update while not capturing");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  }

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar isNavOpen={isNavOpen} />
      <div className="flex-grow flex flex-col w-2/3">
        <Headerbar toggleNav={toggleNav} />
        <main className="p-6 flex-grow flex max-h-screen space-x-4">
          <div className="w-2/3 flex flex-col space-y-4 max-h-screen overflow-y-auto">
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
              <div>
                <label>Interface</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={networkInterface}
                    onChange={(e) => setNetworkInterface(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                  >
                    {networkInterfaces.map((iface, index) => (
                      <option key={index} value={iface}>
                        {iface}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={reloadInterfaces}
                    className="bg-blue-500 p-2 rounded flex items-center"
                    title="Reload interfaces"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label>Filter</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Filter"
                    value={filter}
                    onChange={handleFilterChange}
                    className="flex-grow p-2 bg-gray-700 text-white rounded"
                  />
                  <button
                    onClick={handleApplyFilter}
                    className="bg-blue-500 p-2 rounded"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div className="flex space-x-2 items-center">
                <button
                  onClick={handleStartCapture}
                  className={`${
                    isCapturing ? "bg-gray-500" : "bg-green-500"
                  } p-2 rounded`}
                >
                  Start
                </button>
                <button
                  onClick={handleStopCapture}
                  className={`${
                    isCapturing ? "bg-red-500" : "bg-gray-500"
                  } p-2 rounded`}
                >
                  Stop
                </button>
                <button
                  onClick={handleSaveCapture}
                  className="bg-blue-500 p-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleUpdateButton}
                  className="bg-yellow-500 p-2 rounded"
                >
                  Update
                </button>
                {saveMessage && (
                  <span className="bg-yellow-400 text-black p-1 rounded text-xs ml-6">
                    {saveMessage}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="pcap-upload"
                  className="bg-gray-500 text-white rounded-full p-2 cursor-pointer flex items-center space-x-2"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span>Open PCAP</span>
                </label>
                <input
                  id="pcap-upload"
                  type="file"
                  accept=".pcap"
                  onChange={handleOpenPcap}
                  className="hidden"
                />
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg overflow-auto">
              <h2 className="text-xl font-bold mb-4">Captured Packets</h2>
              <ul className="space-y-2">
                {filteredPacketsSummary.map((packet, index) => (
                  <li
                    key={index}
                    onClick={() => handlePacketSelectIndex(index)}
                    className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                  >
                    {packet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-3/5 bg-gray-800 p-4 rounded-lg overflow-auto">
            {selectedPacketIndex != -1 ? (
              <>
                <h2 className="text-xl font-bold mb-2">Packet Details</h2>
                <div>
                  <h3 className="text-lg font-semibold">Scapy Show</h3>
                  <pre>{filteredPacketsShow[selectedPacketIndex]}</pre>
                </div>
              </>
            ) : (
              <p>Select a packet to view details</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PacketCapture;
