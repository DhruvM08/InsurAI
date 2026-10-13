import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  HiHome, HiCalendar, HiDocumentText, HiClipboardList,
  HiLibrary, HiSupport, HiCog, HiMenu, HiX, HiBell, HiShieldCheck,
} from 'react-icons/hi';
import { NavLink, useLocation } from 'react-router-dom';
import './DashboardLayout.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: HiHome, path: '/dashboard' },
  { id: 'book', label: 'Book Appointment', icon: HiCalendar, path: '/dashboard/book' },
  { id: 'apply', label: 'Apply for Policy', icon: HiDocumentText, path: '/dashboard/apply' },
  { id: 'appointments', label: 'My Appointments', icon: HiClipboardList, path: '/dashboard/appointments' },
  { id: 'policies', label: 'My Policies', icon: HiLibrary, path: '/dashboard/policies' },
  { id: 'support', label: 'Support / Help', icon: HiSupport, path: '/dashboard/support' },
  { id: 'settings', label: 'Settings', icon: HiCog, path: '/dashboard/settings' },
];

const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 60000);
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const DashboardLayout = ({ children, userEmail, userName, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);
  const location = useLocation();

  // 1. Fetch Notifications
  const fetchNotifications = async () => {
    if (!userEmail) return;
    try {
      const response = await axios.get(`http://localhost:9090/InsureAi/notifications/${userEmail}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [userEmail]);

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Mark Single as Read
  const markAsRead = async (id, currentStatus) => {
    if (currentStatus) return;
    // Optimistic UI Update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await axios.put(`http://localhost:9090/InsureAi/notifications/read/${id}`);
    } catch (error) {
      console.error("Failed to mark read");
    }
  };

  // 3. Mark All as Read
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;

    // Optimistic UI Update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      await Promise.all(unreadIds.map(id => axios.put(`http://localhost:9090/InsureAi/notifications/read/${id}`)));
    } catch (error) {
      console.error("Failed to mark all read");
    }
  };

  // 4. Delete Notification (The 'X' Button)
  const deleteNotification = async (id, e) => {
    e.stopPropagation(); // Stop click from triggering "markAsRead"

    // Optimistic UI Update (Remove instantly)
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      await axios.delete(`http://localhost:9090/InsureAi/notifications/${id}`);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="ud-layout">
      <aside className={`ud-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="ud-sidebar-header">
          <div className="ud-sidebar-brand"><HiShieldCheck className="brand-icon" /><span>InsurAI</span></div>
          <button className="ud-sidebar-close" onClick={() => setSidebarOpen(false)}><HiX /></button>
        </div>
        <nav className="ud-sidebar-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
            <NavLink key={id} to={path} end={id === 'home'} className={({ isActive }) => `ud-nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Icon className="ud-nav-icon" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="ud-main">
        <header className="ud-topbar">
          <button className="ud-menu-toggle" onClick={() => setSidebarOpen(true)}><HiMenu /></button>
          <div className="ud-topbar-brand"><HiShieldCheck className="brand-icon" />InsurAI</div>
          <div className="ud-topbar-actions">

            {/* NOTIFICATION UI */}
            <div className="ud-notification-wrapper" ref={notificationRef}>
              <button className="ud-notification-btn" onClick={() => setNotificationOpen(!notificationOpen)}>
                <HiBell />
                {unreadCount > 0 && <span className="ud-notification-badge">{unreadCount}</span>}
              </button>

              {notificationOpen && (
                <div className="ud-notification-dropdown">
                  <div className="ud-notification-header">
                    <h3>Notifications</h3>
                    <button
                      className="ud-mark-all-read"
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      style={{ opacity: unreadCount === 0 ? 0.5 : 1, cursor: unreadCount === 0 ? 'default' : 'pointer' }}
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="ud-notification-list">
                    {notifications.length === 0 ? (
                      <div className="ud-notification-empty"><HiBell /><p>No notifications</p></div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`ud-notification-item ${!n.isRead ? 'unread' : ''}`} onClick={() => markAsRead(n.id, n.isRead)}>
                          <div className="ud-notification-content">
                            <div className="ud-notification-title">
                              {n.title}
                              {!n.isRead && <span className="ud-unread-dot"></span>}
                            </div>
                            <div className="ud-notification-message">{n.message}</div>
                            <div className="ud-notification-time">{formatRelativeTime(n.createdAt)}</div>
                          </div>
                          {/* DELETE BUTTON */}
                          <button className="ud-notification-close" onClick={(e) => deleteNotification(n.id, e)}>
                            <HiX />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="ud-user-name">{userName || userEmail || 'User'}</span>
            <button className="ud-logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </header>
        <main className="ud-content">{children}</main>
      </div>
      {sidebarOpen && <div className="ud-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;