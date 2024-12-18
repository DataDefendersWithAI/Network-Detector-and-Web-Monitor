import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const WebsiteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [urlDetails, setUrlDetails] = useState({});
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const server = "http://localhost:3060/api/web-monitor";

    useEffect(() => {
        fetchURLDetails();
        fetchHistory();
    }, [id]);

    const fetchURLDetails = async () => {
        try {
            const response = await axios.get(`${server}/details/${id}`);
            setUrlDetails(response.data);
        } catch (error) {
            console.error("Error fetching URL details:", error);
        }
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${server}/history/${id}`);
            setHistory(response.data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${server}/delete/${id}`);
            alert("Website deleted successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error deleting URL:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            const newTag = prompt("Enter new tag for the website:", urlDetails.tag || "");
            if (newTag !== null) {
                await axios.put(`${server}/update/${id}`, { tag: newTag });
                fetchURLDetails();
                alert("Website updated successfully!");
            }
        } catch (error) {
            console.error("Error updating URL:", error);
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentHistory = history.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-6 text-white bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">URL Details</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="space-y-4 mb-6">
                            <p><strong>URL:</strong> {urlDetails.url}</p>
                            <p><strong>Tag:</strong> {urlDetails.tag || "-"}</p>
                            <div className="flex gap-4">
                                <button onClick={handleUpdate} className="bg-blue-500 px-4 py-2 rounded">
                                    Update
                                </button>
                                <button onClick={handleDelete} className="bg-red-500 px-4 py-2 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* History Table */}
                        <h3 className="text-xl font-bold mb-2">History</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4">Timestamp</th>
                                    <th className="py-2 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentHistory.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4">{entry.timestamp}</td>
                                        <td className="py-2 px-4">
                                            {entry.status === 200 ? (
                                                <span className="text-green-500">200 OK</span>
                                            ) : (
                                                <span className="text-red-500">{entry.status}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-center gap-2 mt-4">
                            {Array.from({ length: Math.ceil(history.length / itemsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500' : 'bg-gray-700'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WebsiteDetails;
