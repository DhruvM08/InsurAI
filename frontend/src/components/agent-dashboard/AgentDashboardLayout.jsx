import React, { useState } from 'react';
import {
    HiHome,
    HiCalendar,
    HiClipboardList,
    HiDocumentText,
    HiCog,
    HiShieldCheck,
    HiMenu,
    HiX,
    HiPlusCircle,
    HiChatAlt2,
    HiClock,
} from 'react-icons/hi';
import { NavLink, useLocation } from 'react-router-dom';
import './AgentDashboardLayout.css';

const NAV_ITEMS = [
    { id: 'home', label: 'Dashboard Overview', icon: HiHome, path: '/agent-dashboard' },
    { id: 'calendar', label: 'Work Calendar', icon: HiCalendar, path: '/agent-dashboard/calendar' },
    { id: 'requests', label: 'Appointment Requests', icon: HiClipboardList, path: '/agent-dashboard/requests' },
    { id: 'availability', label: 'Availability', icon: HiClock, path: '/agent-dashboard/availability' },
    { id: 'policies', label: 'Policy Reviews', icon: HiDocumentText, path: '/agent-dashboard/policies' },
    { id: 'publish', label: 'Publish Policy', icon: HiPlusCircle, path: '/agent-dashboard/publish' },
    { id: 'feedback', label: 'Client Feedback', icon: HiChatAlt2, path: '/agent-dashboard/feedback' },
];

const AgentDashboardLayout = ({ children, userEmail, userName, onLogout, notifications }) => {  // Added notifications prop
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="ad-layout">
            <aside className={`ad-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="ad-sidebar-header">
                    <div className="ad-sidebar-brand">
                        <HiShieldCheck className="brand-icon" />
                        <span>InsurAI Agent</span>
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
                    <div className="ad-topbar-brand">Agent Workspace</div>
                    <div className="ad-topbar-actions">
                        {notifications}  {/* Added: Renders the Bell Icon */}
                        <span className="ad-user-name">{userName || userEmail || 'Agent'}</span>
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
                    onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
                    role="button"
                    tabIndex={0}
                    aria-label="Close overlay"
                />
            )}
        </div>
    );
};

export default AgentDashboardLayout;
export { NAV_ITEMS };