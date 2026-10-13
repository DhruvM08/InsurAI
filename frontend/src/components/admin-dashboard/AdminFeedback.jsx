import React, { useState, useEffect } from 'react';
import { fetchAllFeedback } from '../../services/api';
import StarRating from '../StarRating';
import { HiUser, HiUserGroup, HiCalendar, HiChatAlt2, HiSearch } from 'react-icons/hi';
import './AdminFeedback.css';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadAllFeedback = async () => {
            setLoading(true);
            const res = await fetchAllFeedback();
            if (res.success) {
                setFeedbacks(res.feedback || []);
                setFiltered(res.feedback || []);
            }
            setLoading(false);
        };
        loadAllFeedback();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFiltered(
            feedbacks.filter(f =>
                f.userEmail.toLowerCase().includes(term) ||
                f.agentEmail.toLowerCase().includes(term) ||
                (f.comment && f.comment.toLowerCase().includes(term))
            )
        );
    }, [searchTerm, feedbacks]);

    if (loading) return <div className="ud-page-loading">Loading all feedback...</div>;

    return (
        <div className="admin-feedback-container">
            <div className="admin-feedback-header">
                <div>
                    <h1 className="ud-page-title">Service Quality Review</h1>
                    <p className="ud-page-subtitle">Monitor feedback across all agents and users.</p>
                </div>
                <div className="search-box">
                    <HiSearch />
                    <input
                        type="text"
                        placeholder="Search by user, agent, or comment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="ud-empty">
                    <strong>No matches found</strong>
                    No feedback entries match your current search.
                </div>
            ) : (
                <div className="feedback-list">
                    {filtered.map((f) => (
                        <div key={f.id} className="admin-feedback-row">
                            <div className="col-user">
                                <HiUser className="label-icon" />
                                <div className="info">
                                    <span className="label">Client</span>
                                    <span className="value">{f.userEmail}</span>
                                </div>
                            </div>
                            <div className="col-agent">
                                <HiUserGroup className="label-icon" />
                                <div className="info">
                                    <span className="label">Agent</span>
                                    <span className="value">{f.agentEmail}</span>
                                </div>
                            </div>
                            <div className="col-rating">
                                <StarRating rating={f.rating} readOnly={true} />
                                <span className="rating-num">{f.rating}/5</span>
                            </div>
                            <div className="col-comment">
                                <HiChatAlt2 className="label-icon" />
                                <p>&quot;{f.comment || 'No comment'}&quot;</p>
                            </div>
                            <div className="col-date">
                                <HiCalendar className="label-icon" />
                                <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminFeedback;
