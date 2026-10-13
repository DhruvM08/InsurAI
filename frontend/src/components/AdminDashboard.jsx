import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AdminDashboardLayout from './admin-dashboard/AdminDashboardLayout';
import AdminHome from './admin-dashboard/AdminHome';
import AdminPolicies from './admin-dashboard/AdminPolicies';
import AdminUsers from './admin-dashboard/AdminUsers';
import AdminAppointments from './admin-dashboard/AdminAppointments';
import SystemAgents from './user-dashboard/SystemAgents';
import SystemIntelligence from './admin-dashboard/SystemIntelligence';
import AdminFeedback from './admin-dashboard/AdminFeedback';
import AdminNotificationManagement from './AdminNotificationManagement'; // Add this import for notification table
import AgentNotification from './AgentNotification';

import { getSession } from '../services/session';

import { fetchAllPolicies, fetchAllUsers, fetchAllAgents, fetchAllAppointments } from '../services/api';

const AdminDashboard = ({ onLogout }) => {
    const { email: userEmail, name: userName } = getSession('Admin');
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        pendingApprovals: 0,
        totalUsers: 0,
        totalAgents: 0,
        totalAppointments: 0
    });

    const loadStats = async () => {
        try {
            const [policiesRes, usersRes, agentsRes, appointmentsRes] = await Promise.all([
                fetchAllPolicies(),
                fetchAllUsers(),
                fetchAllAgents(),
                fetchAllAppointments()
            ]);

            const pendingCount = (policiesRes.policies || []).filter(p => p.status === 'Pending').length;

            const filteredAppointments = (appointmentsRes.appointments || []).filter(app => {
                const s = (app.status || '').toLowerCase();
                return s === 'approved' || s === 'confirmed' || s === 'booked' || s === 'pending';
            });

            setStats({
                pendingApprovals: pendingCount,
                totalUsers: (usersRes.users || []).length,
                totalAgents: (agentsRes.agents || []).length,
                totalAppointments: filteredAppointments.length
            });
        } catch (error) {
            console.error("Failed to load admin stats", error);
        }
    };

    useEffect(() => {
        if (!userEmail) {
            navigate('/signin');
        }
        loadStats();
    }, [userEmail, navigate]);

    const handleNavigate = useCallback((view) => {
        if (view === 'home') {
            navigate('/admin-dashboard');
        } else {
            navigate(`/admin-dashboard/${view}`);
        }
    }, [navigate]);

    return (
        <AdminDashboardLayout
            userEmail={userEmail}
            userName={userName}
            onLogout={onLogout}
            notifications={<AgentNotification userEmail={userEmail} />}
        >
            <Routes>
                <Route index element={<AdminHome userName={userName} onNavigate={handleNavigate} stats={stats} notifications={<AdminNotificationManagement />} />} />
                <Route path="home" element={<AdminHome userName={userName} onNavigate={handleNavigate} stats={stats} notifications={<AdminNotificationManagement />} />} />
                <Route path="policies" element={<AdminPolicies />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="agents" element={<SystemAgents />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="analytics" element={<SystemIntelligence />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
        </AdminDashboardLayout>
    );
};

export default AdminDashboard;