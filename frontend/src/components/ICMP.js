import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Star, PlusCircle, AlertTriangle, Archive, ChevronUp, ChevronDown,CircleAlert,LucidePlugZap2,Trash2 } from 'lucide-react';
import '../App.css'
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';
import axios from "axios";

const ICMP = ({ onEventClick}) => {
    const [scan, setscan]  = useState([
        
    ]);
    const fetchICMPData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3060/api/icmp_list/');
            setscan(response.data); // Cập nhật state với dữ liệu JSON từ API
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        } 
    };

    

    const handlepostandreload = async () => {
            // if (!scanquery) {
            //     alert('Please enter ip address');
            //     return;
            // }
            try {
                setLoading(true);
                const postdata = {
                        ip : scanquery
                    };
                    console.log(postdata);
                const response = await axios.post('http://localhost:3060/api/icmp_scan/', postdata);
                if (response.status === 200) {
                    // After posting, reload the data
                    await fetchICMPData(); // Fetch the new data after POST
                } else {
                    throw new Error('Failed to post data');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }  
        };

        const handleDelete = async (id) => {
            try {
                setLoading(true);
            const response = await axios.delete(`http://localhost:3060/api/icmp_detail/${id}`);
            if (response.status === 200) {
                // After deleting, reload the data
                await fetchICMPData(); // Fetch the new data after DELETE
                window.location.reload(); // Reload the page
            } else {
                throw new Error('Failed to delete data');
            }
            setLoading(false);
            } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            fetchICMPData();
            }
        };
        
    useEffect(() => {
        fetchICMPData();
    }, []);    
    //     **Response:**

    // ```
    // {
    //     "id": "int",
    //     "ip_address": "string (ip address)",
    //     "scan_date": "string of date",
    //     "is_active": "boolean (true of false),
    //     "max_rtt": "float (or 0 when fail)",
    //     "min_rtt": "float (or 0 when fail)",
    //     "avg_rtt": "float (or 0 when fail)"
    // }

    


// Constants
// const API_URL = "http://localhost:8000/api/icmp/";
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [scanquery, setScanQuery] = useState('');
    const ITEMS_PER_PAGE = 10;
    const [loading, setLoading] = useState(true);
    const handleEventClick = (scan) => {
        if (onEventClick) {
            onEventClick(scan);
        }
    };
    // 

    // function script

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };


    const filteredEvents = scan.filter(scan => {
            return Object.values(scan).some(value =>{ 
                if (value === null || value === undefined) {
                    return false;
                   
                }
            const stringValue = value.toString().toLowerCase();
            return stringValue.includes(searchQuery.toLowerCase());
            });      
           
    });





    const sortedEvents = React.useMemo(() => {
        let sortableEvents = [...filteredEvents];
        if (sortConfig.key !== null) {
            sortableEvents.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableEvents;
    }, [filteredEvents, sortConfig]);

    const SortButton = ({ column }) => (
        <button onClick={() => sortData(column)} className="ml-1 focus:outline-none">
          {sortConfig.key === column ? (
            sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
          ) : (
            <ArrowUpDown size={14} />
          )}
        </button>
    );
    const getStatusStyle = (status) => {
        switch (status) {
          case true: return 'bg-green-500 text-white';
          case false: return 'bg-red-500 text-white';
        }
    };
    const handleInputChange = (e) => {  
        const { name, value } = e.target;
        const regex = /[^\w.\-_]/;
        if (value === null || value === undefined || regex.test(value)  ) return;
        if (name === 'searchQuery') setSearchQuery(value);
        if (name === 'scanquery') {
            const parts = value.split('.');
            if (parts.length > 4) return;
            if (parts.some(part => parseInt(part) > 255 || parseInt(part) < 0) ) return;
            setScanQuery(value);
        }
        
   };

    // Phân trang

    const paginatedEvents = React.useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return sortedEvents.slice(startIndex, endIndex);
    }, [sortedEvents, currentPage]);
    
    // // Tính tổng số trang
    const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    
    

    const renderPagination = () => {
        const pages = [];
        if (currentPage + 5 >= totalPages) {
            if( totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                        <button
                            onClick={() => setCurrentPage(i)}
                            className={`px-2 py-1 rounded ml-1 w-8 ${
                                currentPage === i ? 'bg-gray-500 text-white' : 'bg-gray-700 text-white'
                            }`}
                        >
                            {i}
                        </button>
                    );
                }
            }
            else {
                if(totalPages - currentPage > 4 )
                {
                    for (let i = totalPages - 5; i <= totalPages; i++) {
                        pages.push(
                            <button
                                onClick={() => setCurrentPage(i)}
                                className={`px-2 py-1 rounded ml-1 w-8 ${
                                    currentPage === i ? 'bg-gray-500 text-white' : 'bg-gray-700 text-white'
                                }`}
                            >
                                {i}
                            </button>
                        );
                    }
                }
                else {
                    const a = totalPages - currentPage;
                    for (let i = totalPages - a; i <= totalPages; i++) {
                        if(i === totalPages - a)
                        {   
                            pages.push(
                                <span  className="ml-1">...</span>
                            );
                            pages.push(
                                <button
                                    
                                    onClick={() => setCurrentPage(i)}
                                    className={`px-2 py-1 rounded ml-1 w-8 ${
                                        currentPage === i ? 'bg-gray-500 text-white' : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    {i}
                                </button>
                            );
                        }
                        else
                        {
                            pages.push(
                                <button
                                   
                                    onClick={() => setCurrentPage(i)}
                                    className={`px-2 py-1 rounded ml-1 w-8 ${
                                        currentPage === i ? 'bg-gray-500 text-white' : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    {i}
                                </button>
                            );
                        }
                    }
                }
            }
        }
        else 
        {
            for(let i = currentPage; i <= currentPage + 5; i++) {
                if ( i!== currentPage +2 )
                {
                    pages.push(
                        <button
                            
                            onClick={() => setCurrentPage(i)}
                            className={`px-2 py-1 rounded ml-1 w-8 ${
                                currentPage === i ? 'bg-gray-500 text-white' : 'bg-gray-700 text-white'
                            }`}
                        >
                            {i}
                        </button>
                    );
                }
                else 
                {
                    pages.push(
                        <button
                            
                            onClick={() => setCurrentPage(i)}
                            className={`px-2 py-1 rounded ml-1 w-8 ${
                                currentPage === i ? 'bg-gray-500 text-white' : 'bg-gray-700 text-white'
                            }`}
                        >
                            {i}
                        </button>
                    );
                    pages.push(
                        <span  className="ml-1 ">...</span>
                    );
                }
            }
        }
        return pages;
    };
    
    //

    // icmp scanning input 


    //


    // UI script 
    return (
        

        <div className="flex bg-gray-900 text-white min-h-screen ">
                <Sidebar isNavOpen={isNavOpen}/>
                <div className="flex-grow">
                    <Headerbar toggleNav={toggleNav} headerContent={"ICMP Monitoring"}/>
                    <main className="p-6">
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                         
                            <div className=" mb-4 flex justify-between"> 
                                <div>
                                <h2 className="text-3xl font-bold mb-4">Monitoring </h2>
                                <div className='flex items-center '>
                                    <h2 className='mr-3'>Search :</h2>
                                    <input type="text" className="bg-gray-700 text-white px-2 py-1 rounded  mr-2" name="searchQuery" value={searchQuery} onChange={handleInputChange}/>
                                </div>
                                </div>
                                
                                <div className="">
                                    <h2 className='mr-24  mb-4'> ICMP scanning IP :</h2>
                                    <div className='flex items-center '>
                                        <input  type="text" className="bg-gray-700 text-white px-2 py-1 rounded  mr-2" name="scanquery"  value={scanquery}  onChange={handleInputChange}  />
                                        <button className='ml-3 bg-gray-700 text-white px-2 py-1 rounded' onClick={handlepostandreload}  disabled={loading} >Scan</button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {loading ? (
                                <div className="loading-screen">
                                    <p>Data is being updated, please wait...</p>
                                </div>
                                ) : 
                                (
                                    <div>
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left">Ip_address<SortButton column="ip_address" /></th>
                                                <th className="text-left">Scan_date<SortButton column="scan_date" /></th>
                                                <th className="text-left">Status<SortButton column="is_active" /></th>
                                               
                                                <th className="text-left">Min_rtt<SortButton column="min_rtt" /></th>
                                                <th className="text-left">Max_rtt<SortButton column="max_rtt" /></th>
                                                <th className="text-left">Avg_rtt<SortButton column="avg_rtt" /></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedEvents.slice(0,paginatedEvents.length).map((scan, index) => (
                                                <tr key={index} className="hover:bg-gray-700 cursor-pointer" onClick={() => handleEventClick(scan)} >
                                                    <td className="py-2 text-blue-400">{scan.ip_address}</td>
                                                    <td>{scan.scan_date}</td>
                                                    <td>
                                                        <span className={`px-2 py-1 rounded ${getStatusStyle(scan.is_active)}`}>
                                                        {scan.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>{scan.min_rtt}</td>
                                                    <td>{scan.max_rtt}</td>
                                                    <td>{scan.avg_rtt}</td>
                                                    <td>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Ngăn không cho kích hoạt handleEventClick
                                                            handleDelete(scan.id);
                                                        }}
                                                        className="flex justify-center w-8 h-8 mr-2text-white bg-red-500 rounded hover:bg-red-600">
                                                        <Trash2 className="w-5 h-5 mt-1 " />
                                                    </button>
                                                     </td>                                   
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table> 
                                    <div className='flex justify-center'>
                                     
                                            <div className="flex items-center mt-3 text-sm" >
                                                <button className="flex items-center justify-center bg-gray-700 text-white px-2 py-1 rounded mr-1 w-16  " onClick={handlePreviousPage}>Previous</button>
                                                {renderPagination()}
                                                <button className="flex items-center justify-center bg-gray-700 text-white px-2 py-1 rounded ml-2 mr-2 w-16" onClick={handleNextPage}>Next</button>
                                            </div>
                                    </div>  
                                    </div>
                                )}
                            </div>

                        </div>
                    </main>
                </div>
        </div>
    );
};

export default ICMP;