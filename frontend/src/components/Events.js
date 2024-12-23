import React, { useState, useEffect } from "react";
import {
  ArrowUpDown,
  Star,
  PlusCircle,
  AlertTriangle,
  Archive,
  ChevronUp,
  ChevronDown,
  CircleAlert,
  LucidePlugZap2,
} from "lucide-react";
import "../App.css";
import axios from "axios";
import Sidebar from "./Sidebar";
import Headerbar from "./Headerbar";

const Events = ({ onEventClick }) => {
  const fetchdevicedata = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3060/api/ip/");
      const device = response.data;
      setDevices(device);
      const eventPromises = device.map((device) =>
        axios
          .get(`http://localhost:3060/api/ip/${device.id}/events`)
          .then((reseventResponseonse) =>
            reseventResponseonse.data.map((event) => ({
              ...event, // Dữ liệu sự kiện
              vendor: device.vendor, // Thêm `vendor` từ API đầu tiên
            }))
          )
      );
      const enrichedEvents = await Promise.all(eventPromises);
      const flattenedEvents = enrichedEvents.flat();
      //console.log(enrichedEvents);
      setEvents(flattenedEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdevicedata();
  }, []);

  const [isNavOpen, setIsNavOpen] = useState(true);
  const [selectedValue, setSelectedValue] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [selectedItem, setSelectedItem] = useState("None");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  //console.log("events", events.length);
  // example data  events

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [activeFilters, setActiveFilters] = useState("");
  const handleEventClick = (events) => {
    if (onEventClick) {
      onEventClick(events);
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
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
    setActiveFilters((prevFilter) => (prevFilter === filter ? null : filter));
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
  const filteredEvents = events.filter((event) => {
    if (!searchQuery) {
      if (!activeFilters) return true;
      switch (activeFilters) {
        // - Filter by event type and status (ask for more case if you need)
        case "connected":
          return event.is_active === true;
        case "down-alerts":
          return event.is_active === false;
        default:
          return true;
      }
    }
    // [selectedItem]?.toLowerCase().includes(searchQuery.toLowerCase()) dùng để query theo thứ đã chọn trong input search
    else {
      if (!selectedItem)
        return Object.values(event).some((value) => {
          if (value === null || value === undefined) {
            return false;
          }
          const stringValue = value.toString().toLowerCase();
          return stringValue.includes(searchQuery.toLowerCase());
        });
      else {
        if (!activeFilters)
          return event[selectedItem]
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());
        switch (activeFilters) {
          // - Filter by event type and status (ask for more case if you need)
          case "connected": {
            return (event.is_active === true)[selectedItem]
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase());
          }
          case "down-alerts": {
            return (event.is_active === false)[selectedItem]
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase());
          }
          default: {
            return event[selectedItem]
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase());
          }
        }
      }
    }
  });
  //console.log("filteredEvents", filteredEvents.length);

  const sortedEvents = React.useMemo(() => {
    let sortableEvents = [...filteredEvents];
    if (sortConfig.key !== null) {
      sortableEvents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEvents;
  }, [filteredEvents, sortConfig]);
  //console.log("sortedevent", sortedEvents);

  const SortButton = ({ column }) => (
    <button
      onClick={() => sortData(column)}
      className="ml-1 focus:outline-none"
    >
      {sortConfig.key === column ? (
        sortConfig.direction === "ascending" ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        )
      ) : (
        <ArrowUpDown size={14} />
      )}
    </button>
  );
  const FilterButton = ({ label, count, color, icon: Icon, filter }) => (
    <button
      onClick={() => applyFilter(filter)}
      className={`${color} p-4 rounded-lg flex flex-col items-center justify-center ${
        activeFilters === filter ? "ring-2 ring-white" : ""
      }`}
    >
      <span className="text-3xl font-bold">{count}</span>
      <span className="text-sm">{label}</span>
      <Icon size={24} />
    </button>
  );

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
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedEvents.slice(startIndex, endIndex);
  }, [sortedEvents, currentPage]);
  // Check if it's 126

  // Tính tổng số trang
  const totalPages = Math.ceil(
    Math.min(sortedEvents.length, selectedValue) / ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Tạo nút phân trang

  // const paginationContainer = document.getElementById('pagination_container');
  // if (paginationContainer) {
  //     const fragment = document.createDocumentFragment(); // DOM ảo
  //     paginationContainer.innerHTML = '';
  //     if (currentPage + 5 >= totalPages) {
  //         if( totalPages <= 5) {
  //             for (let i = 1; i <= totalPages; i++) {
  //                 const button = createPaginationButton(i, currentPage);
  //                 fragment.appendChild(button);
  //             }
  //         }
  //         else {
  //             if(totalPages - currentPage > 4 )
  //             {
  //                 for (let i = totalPages - 5; i <= totalPages; i++) {
  //                     const button = createPaginationButton(i, currentPage);
  //                     fragment.appendChild(button);
  //                 }
  //             }
  //             else {
  //                 const a = totalPages - currentPage;
  //                 for (let i = totalPages - a; i <= totalPages; i++) {
  //                     if(i === totalPages - a)
  //                     {
  //                         const dots = document.createElement("span");
  //                         dots.textContent = "...";
  //                         dots.className = "ml-1";
  //                         fragment.appendChild(dots);
  //                         const button = createPaginationButton(i, currentPage);
  //                         fragment.appendChild(button);
  //                     }
  //                     else
  //                     {
  //                     const button = createPaginationButton(i, currentPage);
  //                     fragment.appendChild(button);
  //                     }
  //                 }
  //             }
  //         }
  //     }
  //     else
  //     {
  //         for(let i = currentPage; i <= currentPage + 5; i++) {
  //             if ( i!= currentPage +2 )
  //             {
  //                 const button = createPaginationButton(i, currentPage);
  //                 fragment.appendChild(button);
  //             }
  //             else
  //             {
  //                 const button = createPaginationButton(i, currentPage);
  //                 fragment.appendChild(button);

  //                 const dots = document.createElement("span");
  //                 dots.textContent = "...";
  //                 dots.className = "ml-1";
  //                 fragment.appendChild(dots);
  //             }

  //         }
  //     }
  //     paginationContainer.appendChild(fragment); // Thêm tất cả vào DOM cùng lúc
  // };

  // function createPaginationButton(page, currentPage) {
  //     const button = document.createElement('button');
  //     button.textContent = page;
  //     button.className = `px-2 py-1 rounded ml-1 w-8 ${page === currentPage ? 'bg-gray-500 text-white' : 'bg-gray-700 text-white'}`;
  //     button.addEventListener('click', () => setCurrentPage(page));
  //     return button;
  // }
  //
  const renderPagination = () => {
    const pages = [];
    if (currentPage + 5 >= totalPages) {
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <button
              onClick={() => setCurrentPage(i)}
              className={`px-2 py-1 rounded ml-1 w-8 ${
                currentPage === i
                  ? "bg-gray-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {i}
            </button>
          );
        }
      } else {
        if (totalPages - currentPage > 4) {
          for (let i = totalPages - 5; i <= totalPages; i++) {
            pages.push(
              <button
                onClick={() => setCurrentPage(i)}
                className={`px-2 py-1 rounded ml-1 w-8 ${
                  currentPage === i
                    ? "bg-gray-500 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {i}
              </button>
            );
          }
        } else {
          const a = totalPages - currentPage;
          for (let i = totalPages - a; i <= totalPages; i++) {
            if (i === totalPages - a) {
              pages.push(<span className="ml-1">...</span>);
              pages.push(
                <button
                  onClick={() => setCurrentPage(i)}
                  className={`px-2 py-1 rounded ml-1 w-8 ${
                    currentPage === i
                      ? "bg-gray-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {i}
                </button>
              );
            } else {
              pages.push(
                <button
                  onClick={() => setCurrentPage(i)}
                  className={`px-2 py-1 rounded ml-1 w-8 ${
                    currentPage === i
                      ? "bg-gray-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {i}
                </button>
              );
            }
          }
        }
      }
    } else {
      for (let i = currentPage; i <= currentPage + 5; i++) {
        if (i !== currentPage + 2) {
          pages.push(
            <button
              onClick={() => setCurrentPage(i)}
              className={`px-2 py-1 rounded ml-1 w-8 ${
                currentPage === i
                  ? "bg-gray-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {i}
            </button>
          );
        } else {
          pages.push(
            <button
              onClick={() => setCurrentPage(i)}
              className={`px-2 py-1 rounded ml-1 w-8 ${
                currentPage === i
                  ? "bg-gray-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {i}
            </button>
          );
          pages.push(<span className="ml-1 ">...</span>);
        }
      }
    }
    return pages;
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case true:
        return "bg-green-500 text-white";
      case false:
        return "bg-red-500 text-white";
    }
  };

  // -------------------------------------------------------------------------------------------------------

  return (
    <div className="flex bg-gray-900 text-white min-h-screen ">
      <Sidebar isNavOpen={isNavOpen} />
      <div className="flex-grow">
        <Headerbar toggleNav={toggleNav} headerContent={"Events tracking"} />
        <main className="p-6">
          <div className="grid grid-cols-6 gap-4 mb-6">
            <FilterButton
              label="All Devices"
              count={devices.length}
              color="bg-teal-600"
              icon={ArrowUpDown}
              filter="all"
            />
            <FilterButton
              label="Conected"
              count={devices.filter((d) => d.is_active).length}
              color="bg-green-700"
              icon={LucidePlugZap2}
              filter=" Conected"
            />
            <FilterButton
              label="Down Alerts"
              count={events.filter((d) => !d.is_active).length}
              color="bg-red-700"
              icon={AlertTriangle}
              filter="down-alerts"
            />
          </div>
          {loading ? (
            <div className="loading-screen">
              <p>Data is being updated, please wait...</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 justify-between mb-4">
                <h2 className="text-xl font-bold">All Devices</h2>
                <div></div>
                <div className="flex items-center">
                  <span className="mr-2">Show</span>
                  <select
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(Number(e.target.value))}
                  >
                    <option value={0}>0</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="ml-2">entries</span>
                </div>
                <div className="flex justify-end">
                  <div className="flex items-center mr-2">Search</div>
                  <select
                    className="bg-gray-700 text-white px-2 py-1 rounded mr-2"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    <option value={""}>None</option>
                    <option value={"vendor"}>name</option>
                    <option value={"event_date"}>Date</option>
                    <option value={"ip_address"}>IP</option>
                  </select>
                  <input
                    type="text"
                    className="bg-gray-700 text-white px-2 py-1 rounded  mr-2"
                    value={searchQuery}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">
                      Name
                      <SortButton column="name" />
                    </th>
                    <th className="text-left">
                      Owner
                      <SortButton column="owner" />
                    </th>
                    <th className="text-left">
                      Date
                      <SortButton column="Date" />
                    </th>
                    <th className="text-left">
                      Infor
                      <SortButton column="Infor" />
                    </th>
                    <th className="text-left">
                      IP
                      <SortButton column="IP" />
                    </th>
                    <th className="text-left">
                      Status
                      <SortButton column="Status" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents
                    .slice(0, Math.min(selectedValue, paginatedEvents.length))
                    .map((event, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      >
                        <td className="py-2 text-blue-400">
                          {event.vendor === "" || event.vendor === "Unknown"
                            ? "Unknown"
                            : event.vendor}
                        </td>
                        <td>UnKnow</td>
                        <td>
                          {new Date(event.event_date).toLocaleString("vi-VN")}
                        </td>
                        <td>{event.additional_info}</td>
                        <td>{event.ip_address}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded ${getStatusStyle(
                              event.is_active
                            )}`}
                          >
                            {event.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-between">
                <div className="mt-4 text-sm">
                  Showing {Math.min(sortedEvents.length, selectedValue)} of{" "}
                  {sortedEvents.length} entries
                </div>
                <div className="flex items-start mt-3 text-sm">
                  <button
                    className="flex items-center justify-center bg-gray-700 text-white px-2 py-1 rounded mr-1 w-16  "
                    onClick={handlePreviousPage}
                  >
                    Previous
                  </button>
                  {/* <span id="pagination_container" className='' ></span> */}
                  {renderPagination()}
                  <button
                    className="flex items-center justify-center bg-gray-700 text-white px-2 py-1 rounded ml-2 mr-2 w-16"
                    onClick={handleNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
    // -------------------------------------------------------------------------------------------------------
    
    return (
        <div className="flex  bg-gray-900 text-white min-h-screen ">
            <Sidebar isNavOpen={isNavOpen}/>
            <div className="flex-grow">
                <Headerbar toggleNav={toggleNav} headerContent={"Events tracking"}/>
                <main className="p-6">
                    <div className="grid grid-cols-6 gap-4 mb-6">
                        <FilterButton label="All Devices" count={devices.length } color="bg-teal-600" icon={ArrowUpDown} filter="all" />
                        <FilterButton label="Conected" count={devices.filter(d => d.is_active).length } color="bg-green-700" icon={LucidePlugZap2} filter=" Conected" />
                        <FilterButton label="Down Alerts" count={events.filter(d => !d.is_active).length } color="bg-red-700" icon={AlertTriangle} filter="down-alerts"  /> 
                    </div>
                    {loading ? (
                                <div className="loading-screen">
                                    <p>Data is being updated, please wait...</p>
                                </div>
                                ) :
                                (
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
                                    <option value={'vendor'}  >name</option>
                                    <option value={'event_date'}  >Date</option>
                                    <option value={'ip_address'}    >IP</option>
                                </select>
                                <input type="text" className="bg-gray-700 text-white px-2 py-1 rounded  mr-2"value={searchQuery} onChange={handleInputChange} />
                            </div>
                            
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">Name<SortButton column="name" /></th>
                                    <th className="text-left">Owner<SortButton column="owner" /></th>
                                    <th className="text-left">Date<SortButton column="Date" /></th>
                                    <th className="text-left">Infor<SortButton column="Infor" /></th>
                                    <th className="text-left">IP<SortButton column="IP" /></th>
                                    <th className="text-left">Status<SortButton column="Status" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEvents.slice(0,Math.min(selectedValue,paginatedEvents.length)).map((event, index) => (
                                    <tr key={index} className="hover:bg-gray-700 cursor-pointer" onClick={() => handleEventClick(event)} >
                                        <td className="py-2 text-blue-400"  >{event.vendor === "" || event.vendor === "Unknown"  ? "Unknown" : event.vendor }</td>
                                        <td>UnKnow</td>
                                        <td>{new Date(event.event_date).toLocaleString("vi-VN")}</td>
                                        <td>{event.additional_info}</td>
                                        <td>{event.ip_address}</td>
                                        <td>
                                            <span className={`px-2 py-1 rounded ${getStatusStyle(event.is_active)}`}>
                                                        {event.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> 
                        <div className='flex justify-between'>
                           
                            <div className="mt-4 text-sm">
                                Showing {Math.min(sortedEvents.length,selectedValue)} of {sortedEvents.length} entries
                            </div> 
                            <div className="flex items-start mt-3 text-sm" >
                                <button className="flex items-center justify-center bg-gray-700 text-white px-2 py-1 rounded mr-1 w-16  " onClick={handlePreviousPage}>Previous</button>
                                {/* <span id="pagination_container" className='' ></span> */}
                                {renderPagination()}
                                <button className="flex items-center justify-center bg-gray-700 text-white px-2 py-1 rounded ml-2 mr-2 w-16" onClick={handleNextPage}>Next</button>
                            </div>
                        </div>
                       
                    </div>
                                )
                                }
                             
                </main>
            </div>
        </div>
    );
};

export default Events;
