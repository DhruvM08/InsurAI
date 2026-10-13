import React, { useState } from 'react';
import { HiChevronRight, HiExclamation } from 'react-icons/hi';
import { POLICY_TYPES } from './policyTypes';
import './shared.css';
import './MyPolicies.css';

const getPolicyMeta = (typeId) => POLICY_TYPES.find((p) => p.id === typeId) || { name: typeId, icon: '📄' };

// Helper to determine tracking state based on status string
const getTrackingState = (policy) => {
  const status = (policy.status || '').toUpperCase();
  const isQuery = status.includes('QUERY') || status.includes('CLARIFICATION') || status.includes('CHANGES_REQUESTED');
  const isFinalApproved = status === 'APPROVED' || status === 'FINAL_APPROVED';

  const stages = [
    { id: 1, label: 'Application Submitted', desc: 'Your application has been received.' },
    { id: 2, label: 'Under Review', desc: 'Our team is reviewing your details.' },
    // Only show stage 3 if currently in query state
    ...(isQuery ? [{ id: 3, label: 'Clarification Needed', desc: 'Agent has requested more information.' }] : []),
    { id: 4, label: 'Approved', desc: 'Policy has been verified and approved.' }
  ];

  let currentStep = 1;
  let percent = 20;

  if (isFinalApproved) {
    currentStep = 5; // Beyond last step to mark all as completed
    percent = 100;
  } else if (isQuery) {
    currentStep = 3;
    percent = 60;
  } else if (status.includes('REVIEW') || status.includes('PROCESS') || status.includes('RECEIVED')) {
    currentStep = 2;
    percent = 40;
  } else {
    // Default PENDING or SUBMITTED
    currentStep = 1;
    percent = 20;
  }

  return { stages, currentStep, percent };
};

const MyPolicies = ({ policies }) => {
  const [detail, setDetail] = useState(null);

  return (
    <div className="ud-my-policies">
      <h1 className="ud-page-title">My policies</h1>
      <p className="ud-page-subtitle">
        Track your policy applications and their status in real-time. Click to view detailed timeline.
      </p>

      {!policies || policies.length === 0 ? (
        <div className="ud-empty">
          <strong>No policies yet</strong>
          Apply for a policy from the &quot;Apply for Policy&quot; section to get started.
        </div>
      ) : (
        <div className="ud-policy-list">
          {policies.map((pol) => {
            const meta = getPolicyMeta(pol.typeId);
            const { percent } = getTrackingState(pol);

            return (
              <div
                key={pol.id}
                className="ud-policy-item ud-card"
                role="button"
                tabIndex={0}
                onClick={() => setDetail(pol)}
                onKeyDown={(e) => e.key === 'Enter' && setDetail(pol)}
              >
                <div className="ud-policy-item-header">
                  <span className="ud-policy-item-icon">{meta.icon}</span>
                  <div className="ud-policy-item-info">
                    <h3>{meta.name}</h3>
                    <span className="ud-policy-item-id">#{String(pol.id).slice(0, 8)}</span>
                  </div>
                  <span className={`ud-status ${pol.status}`}>{pol.status}</span>
                  <HiChevronRight className="ud-policy-item-arrow" />
                </div>
                <div className="ud-progress-wrap">
                  <div className="ud-progress-bar">
                    <div
                      className={`ud-progress-fill ${percent >= 100 ? 'green' : 'amber'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Progress</span>
                    <span style={{ fontSize: '0.75rem', color: '#f1f5f9', fontWeight: 'bold' }}>{percent}%</span>
                  </div>
                </div>
                <p className="ud-policy-item-date">Applied {new Date(pol.appliedAt).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      )}

      {detail && (
        <div className="ud-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{getPolicyMeta(detail.typeId).name}</h3>
            <p className="ud-modal-subtitle">Tracking ID: #{String(detail.id).slice(0, 8)}</p>

            {/* Timeline */}
            <div className="ud-timeline">
              {getTrackingState(detail).stages.map((stage) => {
                const { currentStep } = getTrackingState(detail);

                let stepState = '';
                if (stage.id < currentStep) stepState = 'completed';
                if (stage.id === currentStep) stepState = 'active';

                const isQueryStep = stage.id === 3;
                const showQueryBox = isQueryStep && (stepState === 'active' || stepState === 'completed') && detail.agentComments;

                return (
                  <div key={stage.id} className={`ud-timeline-step ${stepState}`}>
                    <div className="ud-timeline-marker"></div>
                    <div className="ud-timeline-content">
                      <div className="ud-timeline-title">
                        <span>{stage.label}</span>
                        {stepState === 'completed' && <span style={{ color: '#22c55e' }}>✓</span>}
                      </div>
                      <p className="ud-timeline-desc">{stage.desc}</p>

                      {/* Show Query Feedback if applicable */}
                      {showQueryBox && (
                        <div className="ud-query-box">
                          <div className="ud-query-title">
                            <HiExclamation /> Agent Feedback
                          </div>
                          <p className="ud-query-text">
                            "{detail.agentComments}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application Data View */}
            {detail.formData && (
              <div className="ud-app-details">
                <h4 className="ud-section-title">Application Details</h4>
                <div className="ud-details-grid">
                  {Object.entries(detail.formData).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) return null; // Skip complex objects
                    // Prettify labels
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase());

                    return (
                      <div key={key} className="ud-detail-item">
                        <span className="ud-detail-label">{label}</span>
                        <span className="ud-detail-value">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="ud-modal-actions">
              <button type="button" className="ud-btn-primary" onClick={() => setDetail(null)}>
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
