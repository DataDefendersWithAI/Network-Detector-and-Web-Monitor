import React, { useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";
import "../App.css";
import Sidebar from "./Sidebar";
import Headerbar from "./Headerbar";
import axios from "axios";

const Notifications = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "good":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "important":
        return "text-red-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-white";
    }
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3060/api/notifications"
      );
      // console.log(response.data.notifications);
      setNotifications(Array.isArray(response.data.notifications) ? response.data.notifications.reverse() : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Function to mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:3060/api/notifications/${notificationId}/`,
        { action: 'read' }
      );
      fetchNotifications(); // Refresh the notification list
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:3060/api/notifications/${notificationId}/`
      );
      fetchNotifications(); // Refresh the notification list
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
    const ws = new WebSocket("ws://localhost:3060/ws/notifications/");
    ws.onmessage = () => {
      fetchNotifications();
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* Sidebar */}
      <Sidebar isNavOpen={isNavOpen} />
      <div className="flex-grow">
        {/* Headerbar */}
        <Headerbar toggleNav={toggleNav} headerContent={"Notifications"} />
        <main className="p-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="space-y-6">
              <div className="rounded-lg shadow">
                <div className="flex justify-start items-center mb-4">
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <span className="ml-4 bg-blue-500 text-white rounded-full px-3 py-1 text-sm">
                    {notifications.filter((n) => !(n.status === "Read")).length} Unread
                  </span>
                </div>
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">Message</th>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notification) => (
                      <tr key={notification.id}>
                        <td className={"py-2 px-4 " + getSeverityClass(notification.severity)}>{notification.message}</td>
                        <td className="py-2 px-4">
                          {new Date(notification.date).toLocaleString()}
                        </td>
                        <td className="py-2 px-4">
                          {notification.status === "Read" ? (
                            <span className="text-green-500">Read</span>
                          ) : (
                            <span className="text-yellow-500">Unread</span>
                          )}
                        </td>
                        <td className="py-2 px-4 flex space-x-2">
                          {/* Mark as Read */}
                          {!(notification.status === "Read") && (
                            <button
                              className="bg-green-500 text-white rounded-full p-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {/* Delete Notification */}
                          <button
                            className="bg-red-500 text-white rounded-full p-2"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {notifications.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-4 text-center text-gray-400"
                        >
                          No notifications available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
