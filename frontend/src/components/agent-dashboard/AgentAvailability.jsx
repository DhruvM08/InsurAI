import React, { useState } from 'react';
import { agentScheduling } from '../../services/api';
import { getSession } from '../../services/session';
import './AgentDashboardLayout.css';

const AgentAvailability = () => {
    const [schedule, setSchedule] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        appointmentType: 'Consultation',
        status: 'Available'
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setSchedule({ ...schedule, [name]: value });
    };

    const handleSetAvailability = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const { email } = getSession('Agent');
        if (!email) {
            setMessage({ text: 'Error: User email not found. Please relogin.', type: 'error' });
            setLoading(false);
            return;
        }

        const formatTime = (time) => time && time.length === 5 ? `${time}:00` : time;

        const payload = {
            ...schedule,
            startTime: formatTime(schedule.startTime),
            endTime: formatTime(schedule.endTime)
        };

        const result = await agentScheduling(payload, email);

        if (result.success) {
            setMessage({ text: 'Availability set successfully!', type: 'success' });
        } else {
            setMessage({ text: result.message, type: 'error' });
        }
        setLoading(false);
    };

    return (
        <div className="agent-subpage" >
            <h2 className="subpage-title">Availability Scheduling</h2>
            <div className="card availability-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                <form onSubmit={handleSetAvailability}>
                    <div className="form-group">
                        <label>Availability Date</label>
                        <input
                            type="date"
                            name="date"
                            value={schedule.date}
                            onChange={handleScheduleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label>Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={schedule.startTime}
                                onChange={handleScheduleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={schedule.endTime}
                                onChange={handleScheduleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Appointment Type</label>
                        <select
                            name="appointmentType"
                            value={schedule.appointmentType}
                            onChange={handleScheduleChange}
                            className="form-select"
                        >
                            <option value="Consultation">Consultation</option>
                            <option value="Policy Review">Policy Review</option>
                            <option value="Claims">Claims Discussion</option>
                            <option value="Urgent Support">Urgent Support</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={schedule.status}
                            onChange={handleScheduleChange}
                            className="form-select"
                        >
                            <option value="Available">Available</option>
                            <option value="Busy">Busy</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                        style={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        {loading ? "Updating..." : "Update Availability"}
                    </button>


                    {message.text && (
                        <p className={message.type === 'success' ? 'success-msg' : 'error-msg'}>
                            {message.text}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AgentAvailability;
