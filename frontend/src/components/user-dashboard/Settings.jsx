import React from 'react';
import { HiCog } from 'react-icons/hi';
import './shared.css';

const Settings = ({ userName, userEmail }) => (
  <div className="ud-settings">
    <h1 className="ud-page-title">Settings</h1>
    <p className="ud-page-subtitle">
      Manage your account and preferences.
    </p>

    <div className="ud-card ud-settings-card" style={{ marginBottom: '24px' }}>
      <h3 className="ud-section-title" style={{ marginBottom: '24px' }}>
        Profile Information
      </h3>
      <div className="ud-profile-info">
        <div className="ud-profile-field">
          <label>Full Name</label>
          <div className="ud-profile-value">{userName || 'User'}</div>
        </div>
        <div className="ud-profile-field">
          <label>Email Address</label>
          <div className="ud-profile-value">{userEmail || 'user@example.com'}</div>
        </div>
      </div>
    </div>

    <div className="ud-card ud-settings-card">
      <div className="ud-metric-icon slate" style={{ marginBottom: 16 }}>
        <HiCog />
      </div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.125rem', fontWeight: 800, color: '#f1f5f9' }}>
        More Settings
      </h3>
      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9375rem', lineHeight: 1.6 }}>
        Notification preferences and security settings will be available here soon.
      </p>
    </div>
  </div>
);

export default Settings;
