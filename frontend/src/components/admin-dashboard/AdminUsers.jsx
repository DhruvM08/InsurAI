import React, { useState, useEffect } from 'react';
import './AdminHome.css';
import { fetchAllUsers } from '../../services/api';
import {
    HiRefresh
} from 'react-icons/hi';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const result = await fetchAllUsers();
            if (result.success) {
                setUsers(result.users);
                setError(null);
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agent-subpage">
            <div className="subpage-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 className="subpage-title" style={{ marginBottom: '4px' }}>User Management</h2>
                    <p style={{ color: '#94a3b8', margin: 0 }} className="subpage-subtitle">View and manage all registered users with Role: User</p>
                </div>
                <button className="refresh-btnUser" onClick={fetchUsers} disabled={loading}>
                    <HiRefresh className={loading ? 'spinning' : ''} />
                    <span style={{ color: 'white', fontWeight: 500 }}>Refresh</span>
                </button>
            </div>

            {loading ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Fetching users from database...</p>
                </div>
            ) : error ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <p style={{ color: '#ef4444' }}>{error}</p>
                    <button className="btn-primary" onClick={fetchUsers} style={{ marginTop: '1rem' }}>Retry</button>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: '600', fontSize: '0.875rem' }}>Name</th>
                                    <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: '600', fontSize: '0.875rem' }}>Email</th>
                                    <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: '600', fontSize: '0.875rem' }}>Role</th>
                                    <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                            No users found with role 'User'.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.id || index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                        {(user.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: '500' }}>{user.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: '#94a3b8' }}>{user.email}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .table-row-hover:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(99, 102, 241, 0.1);
                    border-radius: 50%;
                    border-top-color: #6366f1;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
};

export default AdminUsers;
