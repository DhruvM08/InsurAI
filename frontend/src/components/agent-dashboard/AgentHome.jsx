import React from 'react';
import { HiClipboardList, HiCalendar, HiDocumentText, HiPlusCircle } from 'react-icons/hi';
import './AgentDashboardLayout.css';

const AgentHome = ({ userName, specialization, company, onNavigate }) => {
    return (
        <div className="dashboard-home">
            <h1 style={{ marginBottom: '0.75rem', color: 'white' }}>Welcome, {userName}</h1>
            <div className="agent-representation">
                {specialization && (
                    <div className="representation-capsule spec-capsule">
                        <span className="capsule-dot"></span>
                        <span className="capsule-text">{specialization} Expert</span>
                    </div>
                )}
                {company && (
                    <div className="representation-capsule company-capsule">
                        <span className="capsule-dot"></span>
                        <span className="capsule-text">{company}</span>
                    </div>
                )}
            </div>
            <div className="home-stats-grid" style={{ marginTop: '2rem' }}>
                <div
                    className="stat-card"
                    onClick={() => onNavigate('requests')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon-wrapper">
                        <HiClipboardList />
                    </div>
                    <div className="stat-info">
                        <h3>Appointment Requests</h3>
                        <p>Manage pending appointments</p>
                    </div>
                </div>

                <div
                    className="stat-card"
                    onClick={() => onNavigate('availability')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon-wrapper">
                        <HiCalendar />
                    </div>
                    <div className="stat-info">
                        <h3>My Availability</h3>
                        <p>Set or block time slots</p>
                    </div>
                </div>

                <div
                    className="stat-card"
                    onClick={() => onNavigate('policies')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon-wrapper">
                        <HiDocumentText />
                    </div>
                    <div className="stat-info">
                        <h3>Policy Reviews</h3>
                        <p>Review submitted policies</p>
                    </div>
                </div>

                <div
                    className="stat-card"
                    onClick={() => onNavigate('publish')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' }}>
                        <HiPlusCircle />
                    </div>
                    <div className="stat-info">
                        <h3>Publish Policy</h3>
                        <p>Create new policy offerings</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentHome;