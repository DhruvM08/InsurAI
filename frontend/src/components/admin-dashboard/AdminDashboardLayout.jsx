import React, { useState } from 'react';
import {
    HiHome,
    HiShieldCheck,
    HiUserGroup,
    HiChartBar,
    HiCog,
    HiMenu,
    HiX,
    HiCalendar,
    HiChatAlt2,
} from 'react-icons/hi';
import { NavLink, useLocation } from 'react-router-dom';
import '../agent-dashboard/AgentDashboardLayout.css'; // Reuse styles but with admin tweaks
import './AdminDashboardLayout.css';

const NAV_ITEMS = [
    { id: 'home', label: 'Admin Overview', icon: HiHome, path: '/admin-dashboard' },
    { id: 'policies', label: 'All Policies', icon: HiShieldCheck, path: '/admin-dashboard/policies' },
    { id: 'appointments', label: 'Appointments', icon: HiCalendar, path: '/admin-dashboard/appointments' },
    { id: 'users', label: 'System Users', icon: HiUserGroup, path: '/admin-dashboard/users' },
    { id: 'agents', label: 'System Agents', icon: HiUserGroup, path: '/admin-dashboard/agents' },
    { id: 'feedback', label: 'Quality Review', icon: HiChatAlt2, path: '/admin-dashboard/feedback' },
    { id: 'analytics', label: 'Core Analytics', icon: HiChartBar, path: '/admin-dashboard/analytics' },
];

const AdminDashboardLayout = ({ children, userEmail, userName, onLogout, notifications }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="ad-layout admin-theme">
            <aside className={`ad-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="ad-sidebar-header admin-brand">
                    <div className="ad-sidebar-brand">
                        <HiShieldCheck className="brand-icon" />
                        <span>InsurAI Admin</span>
                    </div>
                    <button
                        type="button"
                        className="ad-sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        <HiX />
                    </button>
                </div>
                <nav className="ad-sidebar-nav">
                    {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
                        <NavLink
                            key={id}
                            to={path}
                            end={id === 'home'}
                            className={({ isActive }) => `ad-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                setSidebarOpen(false);
                            }}
                        >
                            <Icon className="ad-nav-icon" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className="ad-main">
                <header className="ad-topbar">
                    <button
                        type="button"
                        className="ad-menu-toggle"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <HiMenu />
                    </button>
                    <div className="ad-topbar-brand">Administrative Authority</div>
                    <div className="ad-topbar-actions">
                        {notifications}
                        <div className="admin-status">
                            <span className="status-label">System Online</span>
                            <div className="pulse-dot"></div>
                        </div>
                        <span className="ad-user-name">{userName || userEmail || 'Admin'}</span>
                        <button type="button" className="ad-logout-btn" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="ad-content" key={location.pathname}>{children}</main>
            </div>

            {sidebarOpen && (
                <div
                    className="ad-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    role="button"
                    tabIndex={0}
                    aria-label="Close overlay"
                />
            )}
        </div>
    );
};

export default AdminDashboardLayout;
