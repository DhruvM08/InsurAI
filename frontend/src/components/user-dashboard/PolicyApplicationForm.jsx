import React, { useState } from 'react';
import './InsuranceForms.css';

const PolicyApplicationForm = ({ policy, onCancel, onSubmit, loading }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderHealthForm = () => (
        <>
            <div className="form-group">
                <label>Policy Type</label>
                <select name="policyType" onChange={handleChange} required>
                    <option value="">Select Policy Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                </select>
            </div>
            <div className="form-group">
                <label>Coverage Type</label>
                <select name="coverageType" onChange={handleChange} required>
                    <option value="">Select Coverage Type</option>
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Basic">Basic</option>
                    <option value="Critical Illness">Critical Illness</option>
                </select>
            </div>
            <div className="form-group">
                <label>Current Health Conditions</label>
                <textarea name="healthConditions" onChange={handleChange} placeholder="List any existing conditions..." />
            </div>
            <div className="form-group">
                <label>Medications</label>
                <textarea name="medications" onChange={handleChange} placeholder="List any current medications..." />
            </div>

            <div className="form-section">
                <h3>Emergency Contact Information</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="emergencyName" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Relationship</label>
                        <input type="text" name="emergencyRelationship" onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="emergencyPhone" onChange={handleChange} required />
                </div>
            </div>

            <div className="form-group checkbox-group">
                <input type="checkbox" id="healthConsent" name="healthConsent" onChange={handleChange} required />
                <label htmlFor="healthConsent">I consent to the use of my medical history for policy evaluation.</label>
            </div>
        </>
    );

    const renderAutoForm = () => (
        <>
            <div className="form-section">
                <h3>Vehicle Information</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>Make</label>
                        <input type="text" name="vehicleMake" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Model</label>
                        <input type="text" name="vehicleModel" onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Year</label>
                        <input type="number" name="vehicleYear" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>VIN</label>
                        <input type="text" name="vehicleVIN" onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>License Plate Number</label>
                    <input type="text" name="licensePlate" onChange={handleChange} required />
                </div>
            </div>

            <div className="form-group">
                <label>Policy Type</label>
                <select name="autoPolicyType" onChange={handleChange} required>
                    <option value="">Select Policy Type</option>
                    <option value="Third-Party">Third-Party</option>
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Collision">Collision</option>
                </select>
            </div>

            <div className="form-group">
                <label>Driving History</label>
                <div className="form-row">
                    <input type="number" name="drivingExperience" placeholder="Years of Experience" onChange={handleChange} required />
                    <input type="text" name="trafficViolations" placeholder="Traffic Violations (if any)" onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label>No-Claim Bonus</label>
                <input type="text" name="noClaimBonus" onChange={handleChange} />
            </div>
        </>
    );

    const renderLifeForm = () => (
        <>
            <div className="form-group">
                <label>Coverage Amount (Sum Assured)</label>
                <input type="text" name="coverageAmount" onChange={handleChange} required />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Beneficiary Name</label>
                    <input type="text" name="beneficiaryName" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Beneficiary Relationship</label>
                    <input type="text" name="beneficiaryRelationship" onChange={handleChange} required />
                </div>
            </div>

            <div className="form-section">
                <h3>Health Information</h3>
                <div className="form-group">
                    <label>Current Health Conditions</label>
                    <textarea name="lifeHealthConditions" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Lifestyle</label>
                    <input type="text" name="lifestyle" placeholder="Smoker, Alcohol Use, Hobbies..." onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label>Income Details</label>
                <select name="incomeRange" onChange={handleChange} required>
                    <option value="">Select Monthly/Annual Range</option>
                    <option value="below-5l">Below ₹5 Lakhs</option>
                    <option value="5l-10l">₹5 Lakhs - ₹10 Lakhs</option>
                    <option value="10l-20l">₹10 Lakhs - ₹20 Lakhs</option>
                    <option value="above-20l">Above ₹20 Lakhs</option>
                </select>
            </div>
        </>
    );

    const renderHomeForm = () => (
        <>
            <div className="form-section">
                <h3>Property Information</h3>
                <div className="form-group">
                    <label>Address</label>
                    <textarea name="propertyAddress" onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Type of Home</label>
                        <select name="homeType" onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Detached">Detached</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Condo">Condo</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Year of Construction</label>
                        <input type="number" name="constructionYear" onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Square Footage</label>
                    <input type="number" name="squareFootage" onChange={handleChange} required />
                </div>
            </div>

            <div className="form-group">
                <label>Coverage Type</label>
                <select name="homeCoverageType" onChange={handleChange} required>
                    <option value="">Select Coverage Type</option>
                    <option value="Building">Building Only</option>
                    <option value="Contents">Contents Only</option>
                    <option value="Combined">Combined</option>
                </select>
            </div>

            <div className="form-group">
                <label>Additional Coverage</label>
                <div className="checkbox-grid">
                    <label><input type="checkbox" name="floodCoverage" onChange={handleChange} /> Flood</label>
                    <label><input type="checkbox" name="fireCoverage" onChange={handleChange} /> Fire</label>
                    <label><input type="checkbox" name="theftCoverage" onChange={handleChange} /> Theft</label>
                </div>
            </div>

            <div className="form-group">
                <label>Upload Property Documents</label>
                <input type="file" name="propertyDocs" onChange={handleChange} className="file-input" />
            </div>
        </>
    );

    const renderFormContent = () => {
        switch (policy.id) {
            case 'health': return renderHealthForm();
            case 'auto': return renderAutoForm();
            case 'life': return renderLifeForm();
            case 'home': return renderHomeForm();
            default: return <p>Form not available for this policy type.</p>;
        }
    };

    return (
        <div className="insurance-form-container">
            <div className="form-header">
                <div className="policy-icon-small">{policy.icon}</div>
                <h2>{policy.name} Application</h2>
            </div>
            <form onSubmit={handleSubmit}>
                {renderFormContent()}
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="ud-btn-secondary" disabled={loading}>
                        Back
                    </button>
                    <button type="submit" className="ud-btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PolicyApplicationForm;
