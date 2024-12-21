import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2, Monitor } from "lucide-react";
import Sidebar from "./Sidebar";
import Headerbar from "./Headerbar";
import axios from "axios";
import {confirm} from "react-confirm-box";



const WebServiceDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlParam = queryParams.get("url");
  const navigator = useNavigate();
  const [websiteDetails, setWebsiteDetails] = useState(null);
  const [monitorHistory, setMonitorHistory] = useState([]);
  const [monitorHistoryInfo, setMonitorHistoryInfo] = useState({ from: 0, to: 0, total: 0 });
  const [pagination, setPagination] = useState({ page: 1, entries: 5, total: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  const [isNavOpen, setIsNavOpen] = useState(true);
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const server = "http://localhost:3060";

  useEffect(() => {
    if (urlParam) {
      fetchWebsiteDetails();
      fetchMonitorHistory();
    }
  }, [urlParam, pagination.page, pagination.entries]);

  const fetchWebsiteDetails = async () => {
    try {
      const response = await axios.get(`${server}/api/web-monitor/`, {
        params: { action: "detail", url: urlParam },
      });
      setWebsiteDetails(response.data);
      console.log("Website details:", response.data);
    } catch (error) {
      console.error("Error fetching website details:", error);
    }
  };

  const fetchMonitorHistory = async () => {
    try {
      const response = await axios.get(`${server}/api/web-monitor/`, {
        params: {
          action: "list-partial",
          url: urlParam,
          page: pagination.page,
          entries: pagination.entries,
        },
      });
      setMonitorHistory(response.data.results);
      setMonitorHistoryInfo({
        from: response.data.from,
        to: response.data.to,
        total: response.data.total,
      });
      setPagination((prev) => ({ ...prev, total: response.data.total }));
    } catch (error) {
      console.error("Error fetching monitor history:", error);
    }
  };

  const updateWebsiteDetails = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`${server}/api/web-monitor/add/`, websiteDetails);
      if (response.status === 200) {
        alert("Website details updated successfully");
      }
      else {
        alert("Failed to update website details");
      }
    } catch (error) {
      console.error("Error updating website details:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteWebsite = async () => {
    try {
      const confirm_result = await confirm("Are you sure you want to delete this website?");
      if (!confirm_result) return;
      const response = await axios.delete(`${server}/api/web-monitor/add/`, {
        data: { url: urlParam },
      });
      if (response.status === 200) {
        alert("Website deleted successfully");
        window.location.href = "/web-services";
      }
      else {
        alert("Failed to delete website");
      }
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };

  const handleMonitorNow = async () => {
    try {
      await axios.get(`${server}/api/web-monitor/run/`, {
        params: { url: urlParam },
      });
      alert("Website monitoring started.");
      fetchMonitorHistory();
    } catch (error) {
      console.error("Error running website monitor:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setWebsiteDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaginationChange = (field, value) => {
    setPagination((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar isNavOpen={isNavOpen}/>
      <div className="flex-grow">
        <Headerbar backCallback={() => navigator("/web-services")} toggleNav={toggleNav} headerContent={`Web Service Details: ${urlParam || "Unknown"}`} />
        <main className="p-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            {websiteDetails ? (
              <div>
                {/* Website Details */}
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Website Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">URL</label>
                      <input
                        type="text"
                        value={websiteDetails.url}
                        onChange={(e) => handleInputChange("url", e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Tag</label>
                      <input
                        type="text"
                        value={websiteDetails.tag}
                        onChange={(e) => handleInputChange("tag", e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Destination IP</label>
                      <input
                        type="text"
                        value={websiteDetails.dest_ip}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Note</label>
                      <textarea
                        value={websiteDetails.note || ""}
                        onChange={(e) => handleInputChange("note", e.target.value)}
                        className="w-full p-2 bg-gray-700 text-white rounded"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block mb-2">Monitor Events</label>
                      <div className="flex items-center gap-4">
                        <label>
                          <input
                            type="radio"
                            checked={websiteDetails.monitor_all_events}
                            onChange={() => {
                              handleInputChange("monitor_all_events", true);
                              handleInputChange("monitor_down_events", false);
                            }}
                          />
                          All Events
                        </label>
                        <label>
                          <input
                            type="radio"
                            checked={!websiteDetails.monitor_all_events}
                            onChange={() => {
                              handleInputChange("monitor_all_events", false);
                              handleInputChange("monitor_down_events", true);
                            }}
                          />
                          Down Events Only
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={updateWebsiteDetails}
                      className="bg-blue-500 text-white p-2 rounded"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update Details"}
                    </button>
                    <button
                      onClick={deleteWebsite}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Delete Website
                    </button>
                    <button
                      onClick={handleMonitorNow}
                      className="bg-green-500 text-white p-2 rounded"
                    >
                      Monitor Now
                    </button>
                  </div>
                </section>

                {/* Monitor History Table */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">Monitor History</h2>
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
                        <th className="py-2 px-4">Time</th>
                        <th className="py-2 px-4">Status Code</th>
                        <th className="py-2 px-4">Latency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monitorHistory.map((record, index) => (
                        <tr key={index}>
                          <td className="py-1">{new Date(record.created_at).toLocaleString()}</td>
                          <td>{record.status_code}</td>
                          <td>{record.latency.toFixed(3)} ms</td>
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
                        Showing {monitorHistoryInfo.from} to {monitorHistoryInfo.to} of {pagination.total}
                    </span>
                  </div>
                </section>
              </div>
            ) : (
              <p>Loading website details...</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WebServiceDetails;
