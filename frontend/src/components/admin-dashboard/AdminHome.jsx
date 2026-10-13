import React from 'react';
import {
    HiShieldCheck,
    HiUserGroup,
    HiDocumentReport,
    HiLightningBolt,
    HiCubeTransparent,
    HiCollection,
    HiLockClosed,
    HiArrowRight
} from 'react-icons/hi';
import './AdminHome.css';

const AdminHome = ({ userName, onNavigate, stats, notifications }) => {
    const displayStats = [
        {
            label: 'Pending Approvals',
            value: stats?.pendingApprovals || '0',
            icon: HiShieldCheck,
            color: '#f59e0b',
            trend: 'Requires Action'
        },
        {
            label: 'Upcoming Meetings',
            value: stats?.totalAppointments || '0',
            icon: HiCollection,
            color: '#8b5cf6',
            trend: 'Agent Schedule'
        },
        {
            label: 'System Reach',
            value: (stats?.totalUsers + stats?.totalAgents) || '0',
            icon: HiCubeTransparent,
            color: '#3b82f6',
            trend: 'Active Accounts'
        },
    ];

    const actions = [
        {
            id: 'policies',
            title: 'Policy Clearance',
            desc: 'Review enterprise policy applications approved by specialized agents. Final administrative authorization required.',
            icon: HiCollection,
            class: 'item-large'
        },
        {
            id: 'appointments',
            title: 'Appointments Control',
            desc: 'Monitor and oversee all scheduled interactions between system agents and potential policyholders.',
            icon: HiCollection,
            class: 'item-small'
        },
        {
            id: 'users',
            title: 'User Audit',
            desc: 'Global user identity management.',
            icon: HiUserGroup,
            class: 'item-small'
        },
        {
            id: 'agents',
            title: 'Agent Audit',
            desc: 'Manage specialized insurance agents and monitor professional certifications.',
            icon: HiUserGroup,
            class: 'item-medium-left'
        },
        {
            id: 'analytics',
            title: 'System Intelligence',
            desc: 'Monitor health and API performance metrics.',
            icon: HiDocumentReport,
            class: 'item-medium-right'
        }
    ];

    return (
        <div className="admin-home-premium">
            {/* Hero Section */}
            <header className="admin-welcome-hero">
                <div className="hero-content">
                    <span className="hero-tag">Core System Authority</span>
                    <h1 className="hero-title">InsurAI Control Center</h1>
                    <p className="hero-subtitle">
                        Authenticated as <strong>{userName}</strong>. Your administrative session is active with level-1 root permissions.
                    </p>
                </div>
            </header>

            {/* Stats Grid with Intersection Design */}
            <div className="premium-stats-wrap">
                {displayStats.map((s, i) => (
                    <div key={i} className="premium-stat-card">
                        <div className="premium-stat-icon" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                            <s.icon />
                        </div>
                        <div className="stat-body">
                            <span className="stat-value-large">{s.value}</span>
                            <span className="stat-label-small">{s.label}</span>
                            <div style={{ marginTop: '12px', fontSize: '11px', color: '#475569', fontWeight: 'bold' }}>
                                {s.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bento Grid Actions */}
            <div className="admin-quick-actions">
                <div className="admin-section-header">
                    <h2>Administrative Modules</h2>
                </div>

                <div className="bento-grid">
                    {actions.map((action) => (
                        <div
                            key={action.id}
                            className={`bento-item ${action.class}`}
                            onClick={() => onNavigate(action.id)}
                        >
                            <div className="bento-text">
                                <h3>{action.title}</h3>
                                <p>{action.desc}</p>
                            </div>
                            <action.icon className="bento-icon" />
                            <div style={{ alignSelf: 'flex-start', color: '#60a5fa', marginTop: '10px' }}>
                                <HiArrowRight />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications Management Section */}
            <div className="admin-notifications-section" style={{ marginTop: '40px' }}>
                <div className="admin-section-header">
                    <h2>Recent System Notifications</h2>
                </div>
                <div className="notifications-container-flat" style={{ background: '#0f172a', borderRadius: '12px', padding: '20px', border: '1px solid #1e293b' }}>
                    {notifications}
                </div>
            </div>

            <div style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '12px' }}>
                <span>InsurAI Enterprise Console v2.4.0-stable</span>
                <span>System Security Level: High</span>
            </div>
        </div>
    );
};

export default AdminHome;
