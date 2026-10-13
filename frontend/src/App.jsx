import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import AgentDashboard from './components/AgentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';
import { getSession, clearSession } from './services/session';

const ProtectedRoute = ({ children, role }) => {
  const session = getSession(role);

  if (!session.email) {
    return <Navigate to="/signin" replace />;
  }

  if (role && session.role !== role) {
    // This part is tricky because we might have multiple sessions.
    // However, if the user specifically asked for role isolation,
    // we should just redirect to signin if the requested role session is not active.
    return <Navigate to="/signin" replace />;
  }

  return children;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (role) => {
    clearSession(role);
    navigate('/signin');
  };

  return (
    <Routes>
      <Route path="/" element={<Home onGetStarted={() => navigate('/signup')} onSignIn={() => navigate('/signin')} />} />

      <Route
        path="/signup"
        element={
          <Signup
            onSwitchToSignin={() => navigate('/signin')}
            onSignupSuccess={() => navigate('/signin')}
          />
        }
      />

      <Route
        path="/signin"
        element={
          <Signin
            onSwitchToSignup={() => navigate('/signup')}
            onSigninSuccess={(user) => {
              const role = user?.role || 'User';
              if (role === 'Admin') {
                navigate('/admin-dashboard');
              } else if (role === 'Agent') {
                navigate('/agent-dashboard');
              } else {
                navigate('/dashboard');
              }
            }}
          />
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute role="User">
            <Dashboard onLogout={() => handleLogout('User')} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard/*"
        element={
          <ProtectedRoute role="Admin">
            <AdminDashboard onLogout={() => handleLogout('Admin')} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent-dashboard/*"
        element={
          <ProtectedRoute role="Agent">
            <AgentDashboard onLogout={() => handleLogout('Agent')} />
          </ProtectedRoute>
        }
      />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
