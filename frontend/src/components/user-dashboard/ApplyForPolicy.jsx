import React, { useState, useEffect } from 'react';
import { applyForPolicy, getPolicyOfferings } from '../../services/api';
import PolicyApplicationForm from './PolicyApplicationForm';
import { getSession } from '../../services/session';
import { HiShieldCheck, HiOutlineOfficeBuilding, HiUserCircle } from 'react-icons/hi';
import './shared.css';
import './ApplyForPolicy.css';

const TYPE_ICONS = {
  'Health': '🏥',
  'Life': '🛡️',
  'Auto': '🚗',
  'Home': '🏠',
  'General': '🌐'
};

const ApplyForPolicy = ({ onApply }) => {
  const [offerings, setOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfferings = async () => {
      setLoading(true);
      const res = await getPolicyOfferings();
      if (res.success) {
        setOfferings(res.offerings || []);
      } else {
        setError(res.message);
      }
      setLoading(false);
    };
    fetchOfferings();
  }, []);

  const handleApplyClick = (offering) => {
    setError(null);
    setSelectedOffering(offering);
  }

  const handleFormSubmit = async (formData) => {
    setSubmitLoading(true);
    setError(null);
    const { email: userEmail } = getSession('User');
    if (!userEmail) {
      setError("User email not found. Please log in again.");
      setSubmitLoading(false);
      return;
    }

    const result = await applyForPolicy(
      userEmail,
      selectedOffering.agentEmail,
      selectedOffering.id,
      selectedOffering.policyName,
      formData
    );

    if (result.success) {
      onApply?.(result.policy);
      setSelectedOffering(null);
    } else {
      setError(result.message);
    }
    setSubmitLoading(false);
  };

  const handleCancel = () => {
    setSelectedOffering(null);
    setError(null);
  }

  if (selectedOffering) {
    return (
      <div className="ud-apply">
        <h1 className="ud-page-title">Policy Application</h1>
        {error && <p className="ud-error-msg" style={{ maxWidth: '800px', margin: '0 auto 20px auto' }}>{error}</p>}
        <PolicyApplicationForm
          policy={{
            id: selectedOffering.type.toLowerCase(),
            name: selectedOffering.policyName,
            icon: TYPE_ICONS[selectedOffering.type] || '📄'
          }}
          onCancel={handleCancel}
          onSubmit={handleFormSubmit}
          loading={submitLoading}
        />
      </div>
    );
  }

  return (
    <div className="ud-apply">
      <h1 className="ud-page-title">Explore Professional Insurance Policies</h1>
      <p className="ud-page-subtitle">
        Directly access policies published by our verified experts and top-tier organizations.
      </p>

      {loading ? (
        <div className="ud-loading">Loading available policies...</div>
      ) : offerings.length === 0 ? (
        <div className="ud-empty">
          <HiShieldCheck style={{ fontSize: '3rem', color: '#64748b', marginBottom: '1rem' }} />
          <h3>No policies published yet.</h3>
          <p>Check back later or contact support for assistance.</p>
        </div>
      ) : (
        <div className="ud-policy-grid">
          {offerings.map((p) => (
            <div
              key={p.id}
              className="ud-policy-card dynamic-card"
              onClick={() => handleApplyClick(p)}
            >
              <div className="ud-policy-tag">{p.type}</div>
              <div className="ud-policy-icon">{TYPE_ICONS[p.type] || '📄'}</div>
              <h3 className="ud-policy-name">{p.policyName}</h3>
              <p className="ud-policy-desc">{p.description}</p>

              <div className="ud-policy-meta">
                <div className="ud-policy-meta-item">
                  <span className="ud-policy-meta-label">Coverage</span>
                  <span className="ud-policy-meta-value">{p.coverageAmount}</span>
                </div>
                <div className="ud-policy-meta-item">
                  <span className="ud-policy-meta-label">Premium</span>
                  <span className="ud-policy-meta-value">{p.premium}</span>
                </div>
              </div>

              <div className="ud-offered-by">
                <div className="offered-item">
                  <HiOutlineOfficeBuilding className="offered-icon" />
                  <span>{p.companyName}</span>
                </div>
                <div className="offered-item">
                  <HiUserCircle className="offered-icon" />
                  <span>Agent: {p.agentName}</span>
                </div>
              </div>

              <ul className="ud-policy-features">
                {p.features?.slice(0, 3).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <button
                type="button"
                className="ud-btn-primary ud-policy-apply-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyClick(p);
                }}
              >
                Apply with {p.agentName.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplyForPolicy;
