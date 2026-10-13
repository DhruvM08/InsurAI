import React, { useState, useEffect } from 'react';
import { HiCheck, HiX, HiInformationCircle } from 'react-icons/hi';
import { fetchAllPolicies, updatePolicyStatus } from '../../services/api';
import '../agent-dashboard/AgentDashboardLayout.css';

const AdminPolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(null);
    const [actionPolicy, setActionPolicy] = useState(null);

    const loadPolicies = async () => {
        setLoading(true);
        setError('');
        const result = await fetchAllPolicies();
        if (result.success) {
            // Admin mostly cares about Agent Approved or Pending final
            setPolicies(result.policies || []);
        } else {
            setError(result.message || 'Failed to load policies');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPolicies();
    }, []);

    const handleFinalAction = async (policyId, status) => {
        setUpdating(policyId);
        const result = await updatePolicyStatus(policyId, status, 'Final administrative approval complete.');
        if (result.success) {
            setPolicies(policies.map(p => p.id === policyId ? result.policy : p));
            setActionPolicy(null);
        } else {
            alert('Failed to update policy: ' + result.message);
        }
        setUpdating(null);
    };

    return (
        <div className="agent-subpage">
            <h2 className="subpage-title">All Policies</h2>
            <div className="card">
                {loading && <p>Loading system records...</p>}
                {!loading && error && <p className="error-msg">{error}</p>}

                {!loading && policies.length === 0 && <p>No policies found in system.</p>}

                <div className="admin-policy-table-wrap" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Type</th>
                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Applicant</th>
                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {policies.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #0f172a' }}>
                                    <td style={{ padding: '16px 12px' }}>
                                        <div style={{ color: '#f1f5f9', fontWeight: '600' }}>{p.policyTypeName}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#475569' }}>Applied {new Date(p.appliedAt).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '16px 12px', color: '#cbd5e1', fontSize: '0.875rem' }}>{p.userEmail}</td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            backgroundColor: p.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                                            color: p.status === 'APPROVED' ? '#10b981' : '#94a3b8'
                                        }}>
                                            {p.status}
                                        </span>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPolicies;
