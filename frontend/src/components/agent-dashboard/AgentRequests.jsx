import React, { useState, useEffect } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import { fetchAgentRequests, updateScheduleStatus } from '../../services/api';
import { getSession } from '../../services/session';
import './AgentDashboardLayout.css';

const AgentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(null); // id of item being processed

    const loadRequests = async () => {
        const { email } = getSession('Agent');
        if (!email) return;
        setLoading(true);
        setError('');
        const result = await fetchAgentRequests(email);
        if (result.success) {
            setRequests(result.requests || []);
        } else {
            setRequests([]);
            setError(result.message || 'Failed to load requests');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleStatusUpdate = async (scheduleId, newStatus) => {
        const { email } = getSession('Agent');
        if (!email) return;

        setProcessing(scheduleId);

        const result = await updateScheduleStatus(email, scheduleId, newStatus);

        if (result.success) {
            // Update local state
            setRequests(prev => prev.map(req =>
                req.id === scheduleId || (req.id && req.id.timestamp && req.id.toHexString && req.id.toHexString() === scheduleId) // Handle ID nuances
                    ? { ...req, status: newStatus }
                    : req
            ));
            // Reload to be sure
            loadRequests();
        } else {
            alert('Failed to update status: ' + result.message);
        }
        setProcessing(null);
    };

    const getStatusBadgeClass = (status) => {
        const st = (status || '').toLowerCase();
        if (st === 'booked' || st === 'pending') return 'status-pending';
        if (st === 'confirmed' || st === 'approved') return 'status-approved'; // Reuse existing class if available
        if (st === 'rejected' || st === 'cancelled') return 'status-rejected'; // Reuse existing class if available
        return 'status-pending';
    };

    const StatusBadge = ({ status }) => {
        let text = status || 'Booked';
        let color = '#854d0e';
        let bg = '#fef9c3';

        if (['confirmed', 'approved'].includes(text.toLowerCase())) {
            color = '#166534';
            bg = '#dcfce7';
        } else if (['completed'].includes(text.toLowerCase())) {
            color = '#1e3a8a';
            bg = '#dbeafe';
        } else if (['rejected', 'cancelled'].includes(text.toLowerCase())) {
            color = '#991b1b';
            bg = '#fee2e2';
        }

        return (
            <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: color,
                backgroundColor: bg
            }}>
                {text}
            </span>
        );
    };

    return (
        <div className="agent-subpage">
            <h2 className="subpage-title">Appointment Request Management</h2>
            <div className="card requests-card">
                <div className="requests-list">
                    {loading && <p>Loading requests...</p>}
                    {!loading && error && <p className="error-msg">{error}</p>}
                    {!loading && !error && requests.length === 0 && (
                        <p>No appointment requests yet.</p>
                    )}
                    {!loading && !error && requests.map((req, idx) => {
                        // ID handling: API from Mongo might return id as object or string
                        const reqId = req.id && typeof req.id === 'object' && req.id.timestamp ? req.id.toString() : req.id;
                        // Note: Mongo ID in Spring Boot sometimes serializes as {timestamp:..., date:...} if not configured with ObjectId serializer.
                        // But usually it's fine. We'll assume we can use the object or its string rep.
                        // Actually `req.id` might be complex object. Let's hope our API wrapper handled it or Schedule object structure is simple.
                        // In AgentService, it calls `s.getId().toHexString()`. 
                        // If JSON returns generic object, we need to be careful. 
                        // Ideally we rely on the backend serialization.

                        const isActionable = (req.status || 'Booked').toLowerCase() === 'booked';

                        return (
                            <div key={idx} className="request-item">
                                <div className="user-info">
                                    <h3>{req.bookedByUserEmail || 'User'}</h3>
                                    <p>
                                        {req.day} {req.date} • {req.startTime} - {req.endTime} • {req.appointmentType}
                                    </p>
                                    {req.userNote && (
                                        <div style={{
                                            marginTop: 10,
                                            padding: 10,
                                            background: '#1f2937',
                                            borderRadius: 8,
                                            fontSize: '0.85rem',
                                            color: '#94a3b8',
                                            borderLeft: '3px solid #60a5fa'
                                        }}>
                                            <strong>Note:</strong> {req.userNote}
                                        </div>
                                    )}
                                </div>
                                <div className="actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                    <StatusBadge status={req.status} />

                                    {isActionable && (
                                        <div className="policy-actions">
                                            <button
                                                className="policy-action-btn btn-approve"
                                                onClick={() => handleStatusUpdate(req.id?.toString(), 'Confirmed')}
                                                disabled={processing}
                                            >
                                                <HiCheck size={16} />
                                                Approve
                                            </button>
                                            <button
                                                className="policy-action-btn btn-reject"
                                                onClick={() => handleStatusUpdate(req.id?.toString(), 'Rejected')}
                                                disabled={processing}
                                            >
                                                <HiX size={16} />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {req.status === 'Confirmed' && (
                                        <div className="policy-actions" style={{ marginTop: '0px' }}>
                                            <button
                                                className="policy-action-btn btn-approve"
                                                style={{ backgroundColor: '#3b82f6', borderColor: '#2563eb' }}
                                                onClick={() => handleStatusUpdate(req.id?.toString(), 'Completed')}
                                                disabled={processing}
                                            >
                                                <HiCheck size={16} />
                                                Mark as Complete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AgentRequests;
