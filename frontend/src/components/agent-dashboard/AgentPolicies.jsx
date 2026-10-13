import React, { useState, useEffect } from 'react';
import { HiCheck, HiX, HiChatAlt } from 'react-icons/hi';
import { fetchAllPolicies, updatePolicyStatus } from '../../services/api';
import './AgentDashboardLayout.css';
// import './AgentPolicies.css'; // If we need specific styles

const AgentPolicies = ({ userEmail }) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null); // ID of policy being updated
    const [comment, setComment] = useState('');
    const [actionPolicyId, setActionPolicyId] = useState(null); // Policy ID currently being acted upon
    const [actionType, setActionType] = useState(''); // 'approve', 'reject', 'comment'

    const loadPolicies = async () => {
        setLoading(true);
        setError('');
        const result = await fetchAllPolicies(userEmail);
        if (result.success) {
            setPolicies(result.policies || []);
        } else {
            setPolicies([]);
            setError(result.message || 'Failed to load policies');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPolicies();
    }, []);

    const handleAction = (policyId, type) => {
        setActionPolicyId(policyId);
        setActionType(type);
        setComment('');
    };

    const submitAction = async () => {
        if (!actionPolicyId) return;

        setUpdating(actionPolicyId);
        let status = 'PENDING';
        if (actionType === 'approve') status = 'APPROVED';
        else if (actionType === 'reject') status = 'REJECTED';
        else if (actionType === 'comment') status = 'CHANGES_REQUESTED';

        const result = await updatePolicyStatus(actionPolicyId, status, comment);

        if (result.success) {
            // Update local list
            setPolicies(policies.map(p => p.id === actionPolicyId ? result.policy : p));
            setActionPolicyId(null);
            setActionType('');
        } else {
            alert('Failed to update policy: ' + result.message);
        }
        setUpdating(null);
    };

    const cancelAction = () => {
        setActionPolicyId(null);
        setActionType('');
        setComment('');
    };

    return (
        <div className="agent-subpage">
            <h2 className="subpage-title">Policy Application Review</h2>
            <div className="card">
                {loading && <p>Loading policies...</p>}
                {!loading && error && <p className="error-msg">{error}</p>}

                {!loading && !error && policies.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
                        <p>No policy applications submitted for review yet.</p>
                    </div>
                )}

                <div className="policies-list">
                    {!loading && policies.map(policy => (
                        <div key={policy.id} className="policy-item" style={{
                            borderBottom: '1px solid #374151',
                            padding: '16px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', color: '#f1f5f9' }}>{policy.policyTypeName}</h3>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
                                        Applicant: {policy.userEmail}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                                        Applied: {new Date(policy.appliedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`status-badge ${policy.status.toLowerCase()}`} style={{
                                    backgroundColor: (policy.status === 'APPROVED' || policy.status === 'AGENT_APPROVED') ? '#dcfce7' :
                                        policy.status === 'REJECTED' ? '#fee2e2' : '#fef9c3',
                                    color: (policy.status === 'APPROVED' || policy.status === 'AGENT_APPROVED') ? '#166534' :
                                        policy.status === 'REJECTED' ? '#991b1b' : '#854d0e'
                                }}>
                                    {policy.status}
                                </span>
                            </div>

                            {policy.agentComments && (
                                <div style={{ background: '#111827', padding: '12px', borderRadius: '8px', border: '1px solid #374151', fontSize: '0.875rem', color: '#cbd5e1' }}>
                                    <strong style={{ color: '#60a5fa', display: 'block', marginBottom: '4px' }}>Latest Feedback:</strong> {policy.agentComments}
                                </div>
                            )}

                            {/* Application Data (Form Data) */}
                            {policy.formData && (
                                <div style={{
                                    background: 'rgba(15, 23, 42, 0.4)',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #1e293b'
                                }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                                        Application Data
                                    </h4>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                        gap: '12px'
                                    }}>
                                        {Object.entries(policy.formData).map(([key, value]) => {
                                            if (typeof value === 'object' && value !== null) return null;
                                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                            return (
                                                <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{label}</span>
                                                    <span style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: '500' }}>{String(value)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {actionPolicyId !== policy.id && (
                                <div className="policy-actions">
                                    <button
                                        className="policy-action-btn btn-approve"
                                        onClick={() => handleAction(policy.id, 'approve')}
                                    >
                                        <HiCheck size={18} />
                                        Approve
                                    </button>
                                    <button
                                        className="policy-action-btn btn-changes"
                                        onClick={() => handleAction(policy.id, 'comment')}
                                    >
                                        <HiChatAlt size={18} />
                                        Request Changes
                                    </button>
                                    <button
                                        className="policy-action-btn btn-reject"
                                        onClick={() => handleAction(policy.id, 'reject')}
                                    >
                                        <HiX size={18} />
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* Action Form */}
                            {actionPolicyId === policy.id && (
                                <div style={{ marginTop: '12px', background: '#111827', padding: '16px', borderRadius: '8px' }}>
                                    <h4 style={{ margin: '0 0 12px 0', color: '#e2e8f0' }}>
                                        {actionType === 'approve' ? 'Approve Policy' :
                                            actionType === 'reject' ? 'Reject Policy' : 'Request Changes'}
                                    </h4>

                                    <div className="form-group">
                                        <label style={{ fontSize: '0.875rem' }}>Comments (Optional for approval)</label>
                                        <textarea
                                            className="form-input"
                                            rows="3"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Add a note to the user..."
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button
                                            className="policy-action-btn btn-cancel"
                                            onClick={cancelAction}
                                            disabled={updating === policy.id}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="submit-btn"
                                            style={{ width: 'auto', marginTop: 0 }}
                                            onClick={submitAction}
                                            disabled={updating === policy.id}
                                        >
                                            {updating === policy.id ? 'Submitting...' : 'Confirm'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgentPolicies;
