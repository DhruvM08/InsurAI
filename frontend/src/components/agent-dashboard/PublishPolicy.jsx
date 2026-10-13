import React, { useState } from 'react';
import { HiPlusCircle, HiClipboardCheck, HiShieldCheck } from 'react-icons/hi';
import { createPolicyOffering } from '../../services/api';
import './PublishPolicy.css';

const PublishPolicy = ({ userEmail, specialization, company }) => {
    const [formData, setFormData] = useState({
        policyName: '',
        type: specialization || 'Life',
        description: '',
        coverageAmount: '',
        premium: '',
        features: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const offering = {
            ...formData,
            features: formData.features.split('\n').filter(f => f.trim() !== '')
        };

        const result = await createPolicyOffering(offering, userEmail);

        if (result.success) {
            setMessage({ text: 'Policy published successfully! It is now visible to users.', type: 'success' });
            setFormData({
                policyName: '',
                type: specialization || 'Life',
                description: '',
                coverageAmount: '',
                premium: '',
                features: ''
            });
        } else {
            setMessage({ text: result.message || 'Failed to publish policy.', type: 'error' });
        }
        setLoading(false);
    };

    return (
        <div className="publish-policy-container">
            <div className="publish-header">
                <HiShieldCheck className="header-icon" />
                <div>
                    <h1>Publish New Policy</h1>
                    <p>Create and offer new insurance products to your clients</p>
                </div>
            </div>

            {message.text && (
                <div className={`message-banner ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form className="publish-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Policy Name</label>
                        <input
                            type="text"
                            name="policyName"
                            value={formData.policyName}
                            onChange={handleChange}
                            placeholder="e.g. Premium Health Shield"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Policy Type (Based on Expertise)</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            disabled
                            className="readonly-select"
                        >
                            <option value={specialization}>{specialization}</option>
                        </select>
                        <small>Locked to your specialization: {specialization}</small>
                    </div>
                    <div className="form-group">
                        <label>Coverage Amount</label>
                        <input
                            type="text"
                            name="coverageAmount"
                            value={formData.coverageAmount}
                            onChange={handleChange}
                            placeholder="e.g. ₹5,00,000"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Monthly Premium</label>
                        <input
                            type="text"
                            name="premium"
                            value={formData.premium}
                            onChange={handleChange}
                            placeholder="e.g. ₹1,200/mo"
                            required
                        />
                    </div>
                </div>

                <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description of the policy..."
                        rows="3"
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label>Key Features (One per line)</label>
                    <textarea
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        placeholder="Free annual checkup&#10;Cashless hospitalization&#10;Instant claim settlement"
                        rows="4"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Publishing...' : (
                            <>
                                <HiPlusCircle className="btn-icon" />
                                <span>Publish Policy Offering</span>
                            </>
                        )}
                    </button>
                    <div className="publishing-info">
                        <HiClipboardCheck />
                        <span>Published under: <strong>{company}</strong> by <strong>{userEmail}</strong></span>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PublishPolicy;
