import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiBell, HiRefresh, HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiTrash } from 'react-icons/hi';
import './AdminNotificationManagement.css';

const AdminNotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9090/InsureAi/admin/notifications');
      // Sort by newest first
      const sorted = (response.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);
    } catch (err) {
      console.error('Error fetching admin notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Wait 1 min for auto-refresh
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'SUCCESS': return <HiCheckCircle className="type-icon success" />;
      case 'WARNING': return <HiExclamationCircle className="type-icon warning" />;
      case 'ERROR': return <HiExclamationCircle className="type-icon error" />;
      default: return <HiInformationCircle className="type-icon info" />;
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:9090/InsureAi/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="admin-notif-container">
      <div className="admin-notif-header">
        <div className="header-title">
          <HiBell className="title-icon" />
          <div>
            <h1>System Notifications</h1>
            <p>Real-time audit log of all system activity</p>
          </div>
        </div>
        <button className="refresh-btn" onClick={fetchNotifications} disabled={loading}>
          <HiRefresh className={loading ? 'spinning' : ''} />
          <span>Refresh Log</span>
        </button>
      </div>

      <div className="admin-notif-content">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <HiBell />
            <p>No system activity recorded yet.</p>
          </div>
        ) : (
          <div className="notif-grid">
            <div className="notif-table-header">
              <span>Event</span>
              <span>Recipient</span>
              <span>Message</span>
              <span>Time</span>
              <span>Actions</span>
            </div>
            {notifications.map((note) => (
              <div key={note.id} className={`notif-card ${note.type?.toLowerCase()}`}>
                <div className="col-event">
                  {getIcon(note.type)}
                  <span className="notif-title">{note.title}</span>
                </div>
                <div className="col-user">
                  <span className="user-badge">{note.userId}</span>
                </div>
                <div className="col-message">
                  <p>{note.message}</p>
                </div>
                <div className="col-time">
                  {note.createdAt ? new Date(note.createdAt).toLocaleString([], {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : 'N/A'}
                </div>
                <div className="col-actions">
                  <button className="delete-log-btn" onClick={() => deleteNotification(note.id)} aria-label="Delete log">
                    <HiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationManagement;