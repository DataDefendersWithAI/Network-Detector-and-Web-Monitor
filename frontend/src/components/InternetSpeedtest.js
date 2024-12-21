import React, { useState, useEffect } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import Sidebar from "./Sidebar";
import Headerbar from "./Headerbar";
import axios from "axios";

const InternetSpeedtest = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [briefStats, setBriefStats] = useState(null);
  const [partialData, setPartialData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, entries: 5, total: 0 });
  const [sortOptions, setSortOptions] = useState({
    field: "created_at",
    ascending: false,
  });
  const [isRunning, setIsRunning] = useState(false);
  const server = "http://localhost:3060";

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  // 1. Fetch Brief Stats
  const fetchBriefStats = async () => {
    try {
      const response = await axios.get(`${server}/api/speedtest-history/`, {
        params: { action: "brief" },
      });
      setBriefStats(response.data);
    } catch (error) {
      console.error("Error fetching brief stats:", error);
    }
  };

  // 2. Fetch Paginated Partial Data
  const fetchPartialData = async (page = 1, entries = 5) => {
    try {
      const response = await axios.get(`${server}/api/speedtest-history/`, {
        params: {
          action: "partial",
          page,
          entries,
          sortby: sortOptions.field,
          asc: sortOptions.ascending,
        },
      });
      setPartialData(response.data.results);
      setPagination({ page, entries, total: response.data.total });
    } catch (error) {
      console.error("Error fetching partial data:", error);
    }
  };

  // 3. Run Speed Test
  const handleSpeedTest = async () => {
    setIsRunning(true);
    try {
      await axios.get(`${server}/api/speedtest/`);
      fetchBriefStats(); // Refresh brief stats
      fetchPartialData(); // Refresh paginated data
    } catch (error) {
      console.error("Error running speed test:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // 4. Delete a Speed Test Record
  const deleteSpeedTest = async (created_at) => {
    try {
      await axios.delete(`${server}/api/speedtest/`, {
        params: { date: created_at },
      });
      fetchBriefStats();
      fetchPartialData();
    } catch (error) {
      console.error("Error deleting speed test:", error);
    }
  };

  // 5. Handle Sorting Options Change
  const handleSort = (column) => {
    setSortOptions((prev) => ({
      field: column,
      ascending: prev.field === column ? !prev.ascending : true,
    }));
  };

  // Fetch data on component mount or when sort/pagination changes
  useEffect(() => {
    fetchBriefStats();
    fetchPartialData(pagination.page, pagination.entries);
  }, [sortOptions]);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar isNavOpen={isNavOpen} />
      <div className="flex-grow">
        <Headerbar onToggleNav={toggleNav} headerContent={"Internet Speedtest"} syncCallback={handleSpeedTest} syncDisabled={isRunning} />
        <main className="p-6">
          <div className="bg-gray-800 p-4 rounded-lg">

            {/* Brief Stats Table */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Brief Statistics</h2>
              {briefStats && (
                <table className="w-full table-auto mt-4">
                    <thead>
                        <tr className="text-left">
                            <th>Criteria</th>
                            <th>Maximum (Mbps)</th>
                            <th>Minimum (Mbps)</th>
                            <th>Average (Mbps)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2">Download Speed</td>
                            <td>{briefStats.max_download_speed}</td>
                            <td>{briefStats.min_download_speed}</td>
                            <td>{briefStats.avg_download_speed}</td>
                        </tr>
                        <tr>
                            <td className="py-2">Upload Speed</td>
                            <td>{briefStats.max_upload_speed}</td>
                            <td>{briefStats.min_upload_speed}</td>
                            <td>{briefStats.avg_upload_speed}</td>
                        </tr>
                        <tr>
                            <td className="py-2">Ping</td>
                            <td>{briefStats.max_ping}</td>
                            <td>{briefStats.min_ping}</td>
                            <td>{briefStats.avg_ping}</td>
                        </tr>
                    </tbody>
                </table>
              )}
            </section>

            {/* Partial Data Table */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Speedtest History</h2>
                {/* <button
                  className="bg-blue-500 text-white rounded-full px-4 py-1 flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSpeedTest}
                  disabled={isRunning}
                >
                  <Plus className="mr-2" />
                  {isRunning ? "Running..." : "Test Now"}
                </button> */}
                <div className="ml-auto">
                  <label className="mr-2">Entries per page:</label>
                  <select
                    value={pagination.entries}
                    onChange={(e) => fetchPartialData(1, parseInt(e.target.value))}
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
                    {/* Column Headers with Sort Controls */}
                    <th className="py-2 px-4 *:m-2">
                      <div className="inline-flex items-center cursor-pointer" onClick={() => handleSort("created_at")}>
                        <span className="mr-2">Tested Time</span>
                        {sortOptions.field === "created_at" ? (
                          sortOptions.ascending ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                            <ArrowUpDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="py-2 px-4">
                      <div className="inline-flex items-center cursor-pointer" onClick={() => handleSort("download_speed")}>
                        <span className="mr-2">Download</span>
                        {sortOptions.field === "download_speed" ? (
                          sortOptions.ascending ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                            <ArrowUpDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="py-2 px-4">
                      <div className="inline-flex items-center cursor-pointer" onClick={() => handleSort("upload_speed")}>
                        <span className="mr-2">Upload</span>
                        {sortOptions.field === "upload_speed" ? (
                          sortOptions.ascending ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                          <ArrowUpDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="py-2 px-4">
                      <div className="inline-flex items-center cursor-pointer" onClick={() => handleSort("ping")}>
                        <span className="mr-2">Ping</span>
                        {sortOptions.field === "ping" ? (
                          sortOptions.ascending ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                            <ArrowUpDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="py-2 px-4">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {partialData.map((test, index) => (
                    <tr key={index}>
                      <td>{new Date(test.created_at).toLocaleString()}</td>
                      <td>{test.download_speed}</td>
                      <td>{test.upload_speed}</td>
                      <td>{test.ping}</td>
                      <td>
                        <button
                          className="bg-red-500 p-2 rounded-full"
                          onClick={() => deleteSpeedTest(test.created_at)}
                        >
                          <Trash2 className="text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex items-center mb-4">
                <div>
                    <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchPartialData(pagination.page - 1, pagination.entries)}
                    className="mr-2 bg-gray-700 text-white p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Previous
                    </button>
                    <span>
                    Page {pagination.page} of {Math.ceil(pagination.total / pagination.entries)}
                    </span>
                    <button
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.entries)}
                    onClick={() => fetchPartialData(pagination.page + 1, pagination.entries)}
                    className="ml-2 bg-gray-700 text-white p-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Next
                    </button>
                </div>
                <span className="ml-auto">
                    Showing {partialData.length} of {pagination.total}
                </span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InternetSpeedtest;