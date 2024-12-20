import React, { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import { useEffect } from "react";
import Headerbar from "./Headerbar";
import Sidebar from "./Sidebar";

const TrafficAnalysis = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alertText, setAlertText] = useState(localStorage.getItem("alertText") || "");
  const [alertColor, setAlertColor] = useState("text-yellow-500");
  const [debug, setDebug] = useState(false);
  const [filter, setFilter] = useState("");
  const [graphs, setGraphs] = useState({});
  const [file, setFile] = useState(null);

  function toggleNav() {
    setIsNavOpen(!isNavOpen);
  }

  useEffect(() => {
    fetchGraphs();
  }, []);

  // save alertText in local storage
  useEffect(() => {
    localStorage.setItem("alertText", alertText);
  }, [alertText]);

  const fetchGraphs = async () => {
    try {
      const response = await axios.get("http://localhost:3060/api/pcap-analysis/");
      if (response.data.error) {
        setAlertText(response.data.error);
        setAlertColor("text-red-500");
        return;
      }
      setGraphs(response.data.graphs);
      if (response.data.status === 'clean') {
        setAlertText(response.data.file_name + " is clean.");
        setAlertColor("text-green-500");
      }
      else if (response.data.status === 'suspicious') {
        setAlertText(response.data.file_name +" is sus.");
        setAlertColor("text-red-500");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    if (isAnalyzing) return;  // Prevent multiple requests
    e.preventDefault();
    if (!file) {
      setAlertText("Please select a file to upload.");
      return;
    }
    
    setIsAnalyzing(true);
    setAlertText("Analyzing file...");
    setAlertColor("text-yellow-500");
    const formData = new FormData();
    formData.append("pcap_file", file);
    formData.append("filter", filter);
    formData.append("debug", debug);

    try {
      const response = await axios.post(
        "http://localhost:3060/api/pcap-analysis/",
        formData
      );
      if (response.data.error) {
        setAlertText(response.data.error);
        setAlertColor("text-red-500");
        setIsAnalyzing(false);
        return;
      }
      // console.log(response.data);
      setGraphs(response.data.graphs);
      if (response.data.status === 'clean') {
        setAlertText(file.name+" is clean.");
        setAlertColor("text-green-500");
      }
      else if (response.data.status === 'suspicious') {
        setAlertText(file.name+" is sus.");
        setAlertColor("text-red-500");
      }
      setIsAnalyzing(false);
    } catch (err) {
      console.error(err);
      setAlertText("Error analyzing the file. Please try again.");
      setAlertColor("text-red-500");
    }
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar isNavOpen={isNavOpen} />
      <div className="rounded-lg shadow-lg flex-grow space-y-6">
        <Headerbar toggleNav={toggleNav} headerContent={"Traffic Analysis"}/>
        <div className="bg-gray-800 p-4 rounded-lg space-y-6 max-w-md m-auto">
          <h1 className="text-2xl font-bold text-center">
            PCAP File Analysis 🦈
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Upload File</label>
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>{file ? file.name : "Choose a PCAP file"}</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pcap"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Capture Filter</label>
              <input
                type="text"
                placeholder="Enter filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="debug-checkbox"
                type="checkbox"
                checked={debug}
                onChange={(e) => setDebug(e.target.checked)}
                className="h-5 w-5 text-blue-500 focus:ring-blue-400 rounded"
              />
              <label htmlFor="debug-checkbox" className="text-sm">
                Enable Debug
              </label>
            </div>

            <button
              type="submit"
              className={`w-full p-2 rounded text-white ${isAnalyzing ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
              disabled={isAnalyzing}
            >
              Analyze File
            </button>
          </form>
        </div>

        {alertText && (
          <div className={`p-3 rounded text-3xl flex items-center justify-center ${alertColor}`}>
            {alertText}
          </div>
        )}

        {graphs.graph1 || graphs.graph2 || graphs.graph3 || graphs.graph4 ? (
          <div className="space-y-4 m-auto max-w-[1220px] px-20 pb-20">
            <div className="flex space-x-4">
              {graphs.graph1 && (
                <div className="w-1/2">
                  <h2 className="text-2xl font-bold text-center pb-2">Identified Attacks 🚨​​</h2>
                  <a href={`data:image/png;base64,${graphs.graph1}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`data:image/png;base64,${graphs.graph1}`}
                      alt="Graph 1"
                      className="w-full rounded-lg"
                    />
                  </a>
                </div>
              )}
              {graphs.graph2 && (
                <div className="w-1/2">
                  <h2 className="text-2xl font-bold text-center pb-2">Protocols 🔎</h2>
                  <a href={`data:image/png;base64,${graphs.graph2}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`data:image/png;base64,${graphs.graph2}`}
                      alt="Graph 2"
                      className="w-full rounded-lg"
                    />
                  </a>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              {graphs.graph3 && (
                <div className="w-1/2">
                  <h2 className="text-2xl font-bold text-center pb-2">Network Endpoints 🌐</h2>
                  <a href={`data:image/png;base64,${graphs.graph3}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`data:image/png;base64,${graphs.graph3}`}
                      alt="Graph 3"
                      className="w-full rounded-lg"
                    />
                  </a>
                </div>
              )}
              {graphs.graph4 && (
                <div className="w-1/2">
                  <h2 className="text-2xl font-bold text-center pb-2">TCP Ports 🛜</h2>
                  <a href={`data:image/png;base64,${graphs.graph4}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`data:image/png;base64,${graphs.graph4}`}
                      alt="Graph 4"
                      className="w-full rounded-lg"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400">
            Upload a file to view graphs
          </p>
        )}
      </div>
    </div>
  );
};

export default TrafficAnalysis;
