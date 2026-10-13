import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAgentsWithAvailability, fetchMyPolicies } from '../services/api';
import DashboardLayout from './user-dashboard/DashboardLayout';
import DashboardHome from './user-dashboard/DashboardHome';
import BookAppointment from './user-dashboard/BookAppointment';
import ApplyForPolicy from './user-dashboard/ApplyForPolicy';
import MyAppointments from './user-dashboard/MyAppointments';
import MyPolicies from './user-dashboard/MyPolicies';
import Support from './user-dashboard/Support';
import Settings from './user-dashboard/Settings';
import { POLICY_TYPES, TOTAL_POLICIES } from './user-dashboard/policyTypes';
import './user-dashboard/shared.css';

import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { getSession } from '../services/session';

const Dashboard = ({ onLogout }) => {
  const { email: userEmail, name: userName } = getSession('User');
  const navigate = useNavigate();
  const location = useLocation();

  // Determine activeView from path
  // If the path is just /dashboard or /dashboard/, use 'home'
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPath = pathParts[pathParts.length - 1];
  const activeView = (currentPath === 'dashboard' || !currentPath) ? 'home' : currentPath;

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myPolicies, setMyPolicies] = useState([]);

  // Persist chat messages across views
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Hello ${userName || 'there'}! I'm your InsuAI Assistant. I can see your active policies and appointments, so feel free to ask me anything about your insurance status or our offerings.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const loadPolicies = useCallback(async () => {
    if (!userEmail) return;
    try {
      const result = await fetchMyPolicies(userEmail);
      if (result.success) {
        setMyPolicies(result.policies);
      }
    } catch (e) {
      console.error("Failed to load policies", e);
    }
  }, [userEmail]);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    const result = await fetchAgentsWithAvailability();
    if (result.success) setAgents(result.agents || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAgents();
    loadPolicies();
  }, [loadAgents, loadPolicies]);

  const myAppointments = useMemo(() => {
    const list = [];
    const email = (userEmail || '').trim().toLowerCase();
    if (!email || email === 'user') return list;
    for (const a of agents || []) {
      for (const s of a.agentSchedule || []) {
        const status = (s.status || '').toLowerCase();
        if (status === 'available') continue;

        const bookedBy = (s.bookedByUserEmail || '').trim().toLowerCase();
        if (bookedBy === email && bookedBy !== '') {
          list.push({ agent: a, slot: s });
        }
      }
    }
    return list;
  }, [agents, userEmail]);

  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);

  const handleApplyPolicy = useCallback((newPolicy) => {
    loadPolicies();
    navigate('/dashboard/policies');
  }, [loadPolicies, navigate]);

  const handleReschedule = useCallback((appointment) => {
    setReschedulingAppointment(appointment);
    navigate('/dashboard/book');
  }, [navigate]);

  const handleNavigate = (view) => {
    if (view === 'home') {
      navigate('/dashboard');
    } else {
      // Clear rescheduling if moving away from book
      if (view !== 'book') setReschedulingAppointment(null);
      navigate(`/dashboard/${view}`);
    }
  };

  return (
    <DashboardLayout
      activeView={activeView}
      onNavigate={handleNavigate}
      userEmail={userEmail}
      userName={userName}
      onLogout={onLogout}
    >
      <Routes>
        <Route
          index
          element={
            <DashboardHome
              userName={userName}
              totalAgents={agents.length}
              totalPolicies={TOTAL_POLICIES}
              myPoliciesCount={myPolicies.length}
              myAppointmentsCount={myAppointments.length}
              onNavigate={handleNavigate}
            />
          }
        />
        <Route
          path="home"
          element={
            <DashboardHome
              userName={userName}
              totalAgents={agents.length}
              totalPolicies={TOTAL_POLICIES}
              myPoliciesCount={myPolicies.length}
              myAppointmentsCount={myAppointments.length}
              onNavigate={handleNavigate}
            />
          }
        />
        <Route
          path="book"
          element={
            <BookAppointment
              userEmail={userEmail}
              onBooked={() => {
                loadAgents();
                setReschedulingAppointment(null);
              }}
              reschedulingAppointment={reschedulingAppointment}
              onCancelReschedule={() => setReschedulingAppointment(null)}
            />
          }
        />
        <Route path="apply" element={<ApplyForPolicy onApply={handleApplyPolicy} />} />
        <Route
          path="appointments"
          element={
            <MyAppointments
              appointments={myAppointments}
              onReschedule={handleReschedule}
              userEmail={userEmail}
              onFeedbackSubmitted={loadAgents}
            />
          }
        />
        <Route path="policies" element={<MyPolicies policies={myPolicies} />} />
        <Route
          path="support"
          element={
            <Support
              messages={chatMessages}
              setMessages={setChatMessages}
              userContext={{
                name: userName,
                email: userEmail,
                policies: myPolicies,
                appointments: myAppointments
              }}
            />
          }
        />
        <Route path="settings" element={<Settings userName={userName} userEmail={userEmail} />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
