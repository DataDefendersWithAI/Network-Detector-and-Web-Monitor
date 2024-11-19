import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Star, PlusCircle, AlertTriangle, Archive, ChevronUp, ChevronDown,CircleAlert,LucidePlugZap2 } from 'lucide-react';
import '../App.css'
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';

const Events = ({ onEventClick }) => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [selectedValue, setSelectedValue] = useState(10);
    const [currebtPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; 
    const [selectedItem, setSelectedItem] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: 'Alan', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sepst', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sepst', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
        { name: 'JakeClark-Sep21st', owner: '(unknown)', Date: '2024-10-14 14:30',Eventtype: 'voided sesstion', IP: '10.0.226.199',Status : 'new', connected: true},
    ]);

    

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [activeFilters, setActiveFilters] = useState('');
    const handleEventClick = (events) => {
        if (onEventClick) {
            onEventClick(events);
        }
    };

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

        // --------code ví dụ phiên bản đầu --------------------------------

        // const applyFilter = (filter) => {
        //     if (activeFilters.includes(filter)) {
        //     setActiveFilters(activeFilters.filter(f => f !== filter));
        //     } else {
        //     setActiveFilters([...activeFilters, filter]);
        //     }
        // };
        // -------------------------------------------------------------------

    // không sử dụng mãng chỉ đưa một giá trị vô trong đó thôi 
    const applyFilter = (filter) => {
        setActiveFilters(prevFilter => (prevFilter === filter ? null : filter));
    };
    
        // --------code ví dụ phiên bản đầu --------------------------------

        // const filteredDevices = devices.filter(device => {
        //     if (activeFilters.length === 0) return true;
        //     return activeFilters.some(filter => {
        //     switch (filter) {
        //         case 'connected': return device.connected;
        //         case 'favorites': return device.favorite;
        //         case 'new': return device.status === 'new';
        //         case 'down-alerts': return device.status === 'offline';
        //         case 'archived': return device.archived;
        //         default: return true;
        //     }
        //     });
        // });
        // -------------------------------------------------------------------
    
    // -  ko sử dụng mãng nên ta ko sử dụng cách cú pháp như .includes và .some để làm 
    const filteredEvents = events.filter(event => {

        if (!searchQuery) {
            if (!activeFilters) return true;
        switch (activeFilters) {
            // - Filter by event type and status (ask for more case if you need)
            case 'connected': return event.connected; 
            case 'new': return event.Status === 'new';
            case 'down-alerts': return event.Status === 'offline';
            default: return true;
        }
        }
        // [selectedItem]?.toLowerCase().includes(searchQuery.toLowerCase()) dùng để query theo thứ đã chọn trong input search 
        else {
            if(!selectedItem)   return Object.values(event).some(value =>
                typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase()));
            else {
                if (!activeFilters) return event[selectedItem]?.toLowerCase().includes(searchQuery.toLowerCase());
                switch (activeFilters) {
                    // - Filter by event type and status (ask for more case if you need)
                    case 'connected': return event.connected[selectedItem]?.toLowerCase().includes(searchQuery.toLowerCase()); 
                    case 'new': return (event.Status === 'new')[selectedItem]?.toLowerCase().includes(searchQuery.toLowerCase());
                    case 'down-alerts': return (event.Status === 'offline')[selectedItem]?.toLowerCase().includes(searchQuery.toLowerCase());
                    default: return event[selectedItem]?.toLowerCase().includes(searchQuery.toLowerCase());
            }
           
        }
        }
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
    const FilterButton = ({ label, count, color, icon: Icon, filter }) => (
        <button
          onClick={() => applyFilter(filter)}
          className={`${color} p-4 rounded-lg flex flex-col items-center justify-center ${activeFilters === filter ? 'ring-2 ring-white' : ''}`}
        >
          <span className="text-3xl font-bold">{count}</span>
          <span className="text-sm">{label}</span>
          <Icon size={24} />
        </button>
    );
    const getStatusStyle = (status) => {
        switch (status) {
          case 'new': return 'bg-green-500 text-white';
          case 'online': return 'bg-blue-500 text-white';
          case 'offline': return 'bg-red-500 text-white';
          default: return 'bg-gray-500 text-white';
        }
    };
    const handleInputChange = (e) => {
         const query = e.target.value;
         setSearchQuery(query);
    };
        
    //     // Lọc sự kiện theo giá trị của query và trường đã chọn
    //     setFilteredEvents(events.filter(event => {
    //         if (!query) return true; // Nếu không có tìm kiếm, không lọc
    //         return event[selectedItem]?.toLowerCase().includes(query.toLowerCase());
    //     }));
    // };

    // -------------------------------------------- Pagination -----------------------------------------------

        // lấy danh sách cách items sẽ xuất hiện trên trang 
        const paginatedEvents = React.useMemo(() => {
            const startIndex = (currebtPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            return sortedEvents.slice(startIndex, endIndex);
        }, [sortedEvents, currebtPage]);
        
        // Tính tổng số trang
        const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);

        const handleNextPage = () => {
            if (currebtPage < totalPages) setCurrentPage(currebtPage + 1);
        };

        const handlePreviousPage = () => {
            if (currebtPage > 1) setCurrentPage(currebtPage - 1);
        };



    // -------------------------------------------------------------------------------------------------------
    
    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            <Sidebar isNavOpen={isNavOpen}/>
            <div className="flex-grow">
                <Headerbar toggleNav={toggleNav} />
                <main className="p-6">
                    <div className="grid grid-cols-6 gap-4 mb-6">
                        <FilterButton label="All Devices" count={events.length } color="bg-teal-600" icon={ArrowUpDown} filter="all" />
                        <FilterButton label="Conected" count={events.filter(d => d.connected).length } color="bg-green-700" icon={LucidePlugZap2} filter="voided session" />
                        <FilterButton label="New Devices" count={events.filter(d => d.Status === 'new').length } color="bg-yellow-600" icon={PlusCircle} filter="new"  />
                        <FilterButton label="Down Alerts" count={events.filter(d => d.Status === 'offline').length } color="bg-red-700" icon={AlertTriangle} filter="down-alerts"  /> 
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-2 justify-between mb-4">

                            <h2 className="text-xl font-bold">All Devices</h2>
                            <div></div>
                            <div className="flex items-center">
                                <span className="mr-2">Show</span>
                                <select className="bg-gray-700 text-white px-2 py-1 rounded" value={selectedValue} 
                                onChange={(e) => setSelectedValue(Number(e.target.value))} >
                                    <option value={0}   >0</option>
                                    <option value={10}  >10</option>
                                    <option value={25}  >25</option>
                                    <option value={50}  >50</option>
                                    <option value={100} >100</option>
                                </select>
                                <span className="ml-2">entries</span>
                            </div>
                            <div className='flex justify-end'>
                                <div className='flex items-center mr-2'>Search</div> 
                                <select className="bg-gray-700 text-white px-2 py-1 rounded mr-2" value={selectedItem}
                                onChange={(e) => setSelectedItem(e.target.value)}>
                                    <option value={''}      >None</option>
                                    <option value={'name'}  >name</option>
                                    <option value={'owner'} >owner</option>
                                    <option value={'Date'}  >Date</option>
                                    <option value={'IP'}    >IP</option>
                                </select>
                                <input type="text" className="bg-gray-700 text-white px-2 py-1 rounded mr-2"value={searchQuery} onChange={handleInputChange} />
                            </div>
                            
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">Name<SortButton column="name" /></th>
                                    <th className="text-left">Owner<SortButton column="owner" /></th>
                                    <th className="text-left">Date<SortButton column="Date" /></th>
                                    <th className="text-left">Eventtype<SortButton column="Event type" /></th>
                                    <th className="text-left">IP<SortButton column="IP" /></th>
                                    <th className="text-left">Status<SortButton column="Status" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEvents.slice(0,Math.min(selectedValue,paginatedEvents.length)).map((event, index) => (
                                    <tr key={index} className="hover:bg-gray-700 cursor-pointer" onClick={() => handleEventClick(event)} >
                                        <td className="py-2 text-blue-400"  >{event.name}</td>
                                        <td>{event.owner}</td>
                                        <td>{event.Date}</td>
                                        <td>{event.Eventtype}</td>
                                        <td>{event.IP}</td>
                                        <td>{event.Status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> 
                        <div className="mt-4 text-sm">
                            Showing {Math.min(sortedEvents.length,selectedValue)} of {sortedEvents.length} entries
                        </div> 
                    </div>         
                </main>
            </div>
        </div>
    );
};




export default Events;