import React, { useState, useEffect } from 'react';
import { HiCalendar, HiClock } from 'react-icons/hi';
import { fetchAllAppointments } from '../../services/api';
import '../agent-dashboard/AgentDashboardLayout.css';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadAppointments = async () => {
        setLoading(true);
        setError('');
        const result = await fetchAllAppointments();
        if (result.success) {
            // Show all appointments that are Approved, Confirmed (Agent Approved), or Booked (Pending at Agents Side)
            const upcoming = (result.appointments || []).filter(app => {
                const s = (app.status || '').toLowerCase();
                return s === 'approved' || s === 'confirmed' || s === 'booked' || s === 'pending';
            });
            setAppointments(upcoming);
        } else {
            setError(result.message || 'Failed to load appointments');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAppointments();
        // Set up interval for realtime fetching (every 30 seconds)
        const interval = setInterval(loadAppointments, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="agent-subpage">
            <div className="subpage-header" style={{ marginBottom: '24px' }}>
                <h2 className="subpage-title">System Appointments</h2>
                <p className="subpage-subtitle" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Monitoring all upcoming interactions between agents and clients.
                </p>
            </div>

            <div className="card">
                {loading && appointments.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="loader" style={{ borderTopColor: '#3b82f6' }}></div>
                        <p style={{ marginTop: '16px', color: '#94a3b8' }}>Synchronizing with database...</p>
                    </div>
                )}

                {!loading && error && (
                    <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '16px' }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {!loading && appointments.length === 0 && !error && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        <HiCalendar style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }} />
                        <p>No upcoming booked or confirmed appointments found.</p>
                    </div>
                )}

                {(appointments.length > 0) && (
                    <div className="admin-policy-table-wrap" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Schedule</th>
                                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent</th>
                                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client</th>
                                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meeting Type</th>
                                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((app, idx) => (
                                    <tr key={app.id?.toString() || idx} className="table-row-hover" style={{ borderBottom: '1px solid #0f172a', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px 12px' }}>
                                            <div style={{ color: '#f1f5f9', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <HiCalendar style={{ color: '#3b82f6' }} /> {app.day} {app.date ? `(${app.date})` : ''}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                                                <HiClock style={{ color: '#64748b' }} /> {app.startTime} - {app.endTime}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <div style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: '500' }}>{app.agentEmail}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#475569' }}>Primary Consultant</div>
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <div style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{app.bookedByUserEmail}</div>
                                            {app.userNote && (
                                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic', marginTop: '6px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    Admin Note: "{app.userNote}"
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: '#f1f5f9',
                                                background: '#1e293b',
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                border: '1px solid #334155'
                                            }}>
                                                {app.appointmentType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: (app.status === 'Approved' || app.status === 'Confirmed') ? '#10b981' : '#eab308'
                                                }}></span>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: (app.status === 'Approved' || app.status === 'Confirmed') ? '#10b981' : '#eab308',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .table-row-hover:hover {
                    background-color: rgba(30, 41, 59, 0.4);
                }
                .loader {
                    border: 3px solid #1e293b;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    display: inline-block;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default AdminAppointments;
