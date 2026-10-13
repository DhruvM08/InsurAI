import React, { useEffect, useState, useMemo } from 'react';
import { HiStar, HiBadgeCheck, HiOfficeBuilding, HiMail } from 'react-icons/hi';
import { fetchAllAgents } from '../../services/api';
import './shared.css';
import './SystemAgents.css';

const SystemAgents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadAgents = async () => {
            setLoading(true);
            const result = await fetchAllAgents();
            if (result.success) {
                setAgents(result.agents || []);
            } else {
                setError(result.message || 'Failed to load agents');
            }
            setLoading(false);
        };
        loadAgents();
    }, []);

    const filteredAgents = useMemo(() => {
        const q = (searchQuery || '').toLowerCase();
        return agents.filter(agent =>
            (agent.name || '').toLowerCase().includes(q) ||
            (agent.email || '').toLowerCase().includes(q) ||
            (agent.company || '').toLowerCase().includes(q) ||
            (agent.specialization || '').toLowerCase().includes(q)
        );
    }, [agents, searchQuery]);

    if (loading) return <div className="ud-loading">Loading System Agents...</div>;

    return (
        <div className="system-agents-container">
            <header className="ud-page-header">
                <div>
                    <h1 className="ud-page-title">System Agents</h1>
                    <p className="ud-page-subtitle">Meet our certified insurance professionals ready to assist you.</p>
                </div>
                <div className="search-bar" style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search by name, company, or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ud-input"
                    />
                    <button className="ud-btn-secondary" onClick={() => window.location.reload()}>Refresh</button>
                </div>
            </header>

            {error && <div className="ud-message error">{error}</div>}

            {filteredAgents.length === 0 ? (
                <div className="ud-empty">
                    <p>No agents found matching your search.</p>
                </div>
            ) : (
                <div className="agents-grid">
                    {filteredAgents.map((agent) => (
                        <div key={agent.id || agent.email} className="agent-card">
                            <div className="agent-card-inner">
                                <div className="agent-avatar-container">
                                    <div className="agent-avatar">
                                        {(agent.name || agent.email || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="agent-status-dot active"></div>
                                </div>
                                <div className="agent-info">
                                    <div className="agent-name-row">
                                        <h3>{agent.name || 'Anonymous Agent'}</h3>
                                        <HiBadgeCheck className="verified-icon" />
                                    </div>
                                    <div className="agent-specialization">{agent.specialization || 'Insurance Specialist'}</div>

                                    <div className="agent-details">
                                        <div className="detail-item">
                                            <HiOfficeBuilding />
                                            <span>{agent.company || 'InsurAI Corp'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <HiMail />
                                            <span>{agent.email}</span>
                                        </div>
                                    </div>

                                    <div className="agent-stats">
                                        <div className="stat">
                                            {agent.rating > 0 ? (
                                                <>
                                                    <HiStar className="star-icon" />
                                                    <span style={{ color: 'white' }}>{agent.rating?.toFixed(1)}</span>
                                                </>
                                            ) : (
                                                <span className="ud-new-badge">NEW</span>
                                            )}
                                        </div>
                                        <div className="stat-divider"></div>
                                        <div className="stat">
                                            <span className="stat-label">Experience</span>
                                            <span className="stat-value">No Experience</span>
                                        </div>
                                    </div>

                                    <button className="view-profile-btn">
                                        Connect with Agent
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SystemAgents;
