import React, { useState, useEffect, useRef } from 'react';
import { HiBell, HiX, HiInformationCircle } from 'react-icons/hi';
import axios from 'axios';
import './AgentNotification.css';

const AgentNotification = ({ userEmail }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!userEmail) return;
    try {
      const response = await axios.get(`http://localhost:9090/InsureAi/notifications/${userEmail}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching agent notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [userEmail]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await axios.put(`http://localhost:9090/InsureAi/notifications/read/${id}`);
    } catch (error) {
      console.error("Failed to mark read");
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await Promise.all(unreadIds.map(id => axios.put(`http://localhost:9090/InsureAi/notifications/read/${id}`)));
    } catch (error) {
      console.error("Failed to mark all read");
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await axios.delete(`http://localhost:9090/InsureAi/notifications/${id}`);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="agent-notification-wrapper" ref={dropdownRef}>
      <button
        className={`agent-notification-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <HiBell />
        {unreadCount > 0 && <span className="agent-notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="agent-notification-dropdown">
          <div className="agent-notification-header">
            <h3>System Alerts</h3>
            <button
              className="agent-mark-all-read"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Clear All
            </button>
          </div>

          <div className="agent-notification-list">
            {notifications.length === 0 ? (
              <div className="agent-notification-empty">
                <HiBell />
                <p>No new alerts</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`agent-notification-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => markAsRead(n.id, n.isRead)}
                >
                  <div className="agent-notification-icon-wrap">
                    <HiInformationCircle />
                  </div>
                  <div className="agent-notification-content">
                    <div className="agent-notification-title">
                      {n.title}
                      {!n.isRead && <span className="agent-unread-dot"></span>}
                    </div>
                    <div className="agent-notification-message">{n.message}</div>
                    <div className="agent-notification-time">
                      {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </div>
                  </div>
                  <button
                    className="agent-notification-close"
                    onClick={(e) => deleteNotification(n.id, e)}
                  >
                    <HiX />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentNotification;
