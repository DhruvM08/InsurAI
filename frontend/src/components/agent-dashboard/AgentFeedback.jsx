import React, { useState, useEffect } from 'react';
import { fetchAgentFeedback } from '../../services/api';
import StarRating from '../StarRating';
import { HiUser, HiCalendar, HiChatAlt2 } from 'react-icons/hi';
import './AgentFeedback.css';

const AgentFeedback = ({ userEmail }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeedback = async () => {
            setLoading(true);
            const res = await fetchAgentFeedback(userEmail);
            if (res.success) {
                setFeedbacks(res.feedback || []);
            }
            setLoading(false);
        };
        if (userEmail) loadFeedback();
    }, [userEmail]);

    if (loading) return <div className="ud-page-loading">Loading feedback...</div>;

    return (
        <div className="agent-feedback-container">
            <h1 className="ud-page-title">Client Feedback</h1>
            <p className="ud-page-subtitle">Understand how your clients feel about your service.</p>

            {feedbacks.length === 0 ? (
                <div className="ud-empty">
                    <strong>No feedback yet</strong>
                    Feedback from completed appointments will appear here.
                </div>
            ) : (
                <div className="feedback-grid">
                    {feedbacks.map((f) => (
                        <div key={f.id} className="feedback-card">
                            <div className="feedback-card-header">
                                <div className="user-info">
                                    <HiUser className="icon" />
                                    <span>{f.userEmail}</span>
                                </div>
                                <div className="date-info">
                                    <HiCalendar className="icon" />
                                    <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="rating-section">
                                <StarRating rating={f.rating} readOnly={true} />
                                <span className="rating-text">{f.rating}/5</span>
                            </div>
                            <div className="comment-section">
                                <HiChatAlt2 className="icon" />
                                <p>&quot;{f.comment || 'No comment provided'}&quot;</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgentFeedback;
