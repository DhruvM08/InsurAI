import React, { useState, useEffect } from 'react';
import './Home.css';
import {
    FiArrowRight,
    FiShield,
    FiZap,
    FiTrendingUp,
    FiLock,
    FiCpu,
    FiCheckCircle,
    FiUsers,
    FiCalendar,
    FiMic,
    FiBriefcase,
    FiAperture,
    FiActivity
} from 'react-icons/fi';
// Using the generated premium hero image
import heroImage from '../assets/insure_ai_hero.png';

import axios from 'axios';

const StatItem = ({ end, label, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return (
        <div className="stat-item">
            <div className="stat-number">{count}{typeof end === 'number' && end > 1000 ? '+' : ''}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

const Home = ({ onGetStarted, onSignIn }) => {
    const [scrolled, setScrolled] = useState(false);
    const [stats, setStats] = useState({ users: 0, policies: 0, agents: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Fetch real-time stats
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:9090/InsureAi/landing-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                // Fallback dummy data if server is down
                setStats({ users: 120, policies: 450, agents: 25 });
            }
        };
        fetchStats();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="home-page">
            {/* Navigation */}
            <nav className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-content">
                    <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <FiShield size={28} />
                        <span>InsurAI</span>
                    </div>

                    <div className="nav-links">
                        <a href="#features" className="nav-item">Features</a>
                        <a href="#solutions" className="nav-item">Solutions</a>
                        <a href="#about" className="nav-item">About Us</a>
                    </div>

                    <div className="nav-actions">
                        <span className="login-link" onClick={onSignIn}>Sign In</span>
                        <button className="signup-btn" onClick={onGetStarted}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-grid">
                    <div className="hero-content">
                        <div className="badge">
                            <FiZap style={{ marginRight: '8px' }} />
                            Next-Gen Insurance Intelligence
                        </div>
                        <h1 className="hero-title">
                            <span className="gradient-text">Intelligent</span> <br />
                            Insurance for the <br />
                            Modern Enterprise
                        </h1>
                        <p className="hero-description">
                            Elevate your risk management with InsurAI. We combine advanced AI automation with
                            deep industry intelligence to streamline your corporate policy management.
                        </p>
                        <div className="hero-actions">
                            <button className="primary-btn" onClick={onGetStarted}>
                                Start Your Journey <FiArrowRight />
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-image-container">
                            <img src={heroImage} alt="InsurAI Intelligence" className="hero-image" />
                        </div>

                        <div className="floating-card card-1">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ background: '#22c55e', width: '12px', height: '12px', borderRadius: '50%' }}></div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Precision & Speed</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>+97.9%</div>
                                </div>
                            </div>
                        </div>

                        <div className="floating-card card-2">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FiLock color="#818cf8" size={20} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Security Level</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '700' }}>Enterprise-Grade</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <StatItem end={stats.users} label="Corporate Clients" />
                    <StatItem end={stats.policies} label="Policies Managed" />
                    <StatItem end={stats.agents} label="Expert Agents" />
                    <StatItem end={99} label="SLA Guarantee %" />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <div className="badge">Core Capabilities</div>
                    <h2 className="section-title">Everything you need to <br /> scale your insurance</h2>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><FiCalendar /></div>
                        <h3 className="feature-title">Appointment Scheduling</h3>
                        <p className="feature-desc">Effortlessly book and manage meetings with dedicated insurance experts at your convenience.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"><FiCpu /></div>
                        <h3 className="feature-title">AI Assistant</h3>
                        <p className="feature-desc">24/7 intelligent support to guide you through complex policy selection and management processes.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"><FiMic /></div>
                        <h3 className="feature-title">Voice Recognition</h3>
                        <p className="feature-desc">Resolve your insurance queries instantly using our advanced AI-driven voice recognition technology.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"><FiUsers /></div>
                        <h3 className="feature-title">Smart Collaboration</h3>
                        <p className="feature-desc">Seamless communication between agents, admins, and users on a unified, real-time platform.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"><FiLock /></div>
                        <h3 className="feature-title">Compliance Guard</h3>
                        <p className="feature-desc">Ensuring all policies follow regional and global insurance regulations automatically and securely.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"><FiCheckCircle /></div>
                        <h3 className="feature-title">Instant Onboarding</h3>
                        <p className="feature-desc">Get your entire workforce covered in minutes with our highly streamlined digital setup process.</p>
                    </div>
                </div>
            </section>

            {/* Solutions Section */}
            <section id="solutions" className="solutions-section">
                <div className="section-header">
                    <div className="badge">Tailored Solutions</div>
                    <h2 className="section-title">Designed for every <br /> level of the ecosystem</h2>
                </div>

                <div className="solutions-grid">
                    <div className="solution-card">
                        <div className="solution-visual">
                            <FiUsers className="solution-icon" />
                        </div>
                        <div className="solution-content">
                            <h3 className="solution-title">User (Corporate Client)</h3>
                            <p className="solution-desc">Simplified insurance management for customers and corporate entities.</p>
                            <ul className="solution-list">
                                <li>Browse and select insurance policies</li>
                                <li>Schedule appointments with agents</li>
                                <li>Ask questions via AI voice support</li>
                                <li>Get personalized recommendations</li>
                            </ul>
                        </div>
                    </div>

                    <div className="solution-card">
                        <div className="solution-visual">
                            <FiBriefcase className="solution-icon" />
                        </div>
                        <div className="solution-content">
                            <h3 className="solution-title">Agent</h3>
                            <p className="solution-desc">Powerful tools for advisors to deliver exceptional client services.</p>
                            <ul className="solution-list">
                                <li>Manage client schedules & bookings</li>
                                <li>Provide policy advice and support</li>
                                <li>Track clients and follow-ups</li>
                                <li>AI-assisted service insights</li>
                            </ul>
                        </div>
                    </div>

                    <div className="solution-card">
                        <div className="solution-visual">
                            <FiShield className="solution-icon" />
                        </div>
                        <div className="solution-content">
                            <h3 className="solution-title">Admin</h3>
                            <p className="solution-desc">Full spectrum control over system operations and security.</p>
                            <ul className="solution-list">
                                <li>Oversee users, agents, and policies</li>
                                <li>Manage approvals and workflows</li>
                                <li>Monitor SLA and performance</li>
                                <li>Ensure security and compliance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            {/* About Us Section */}
            <section id="about" className="about-section">
                <div className="about-grid">
                    <div className="about-visual">
                        <div className="about-image-wrapper">
                            <FiShield className="about-bg-icon" />
                            <div className="experience-badge">
                                <span className="years">10+</span>
                                <span className="exp-text">Years of Innovation</span>
                            </div>
                        </div>
                    </div>
                    <div className="about-text-content">
                        <div className="badge">Our Story</div>
                        <h2 className="section-title" style={{ textAlign: 'left' }}>
                            <span className="gradient-text">Empowering Corporates</span> <br />
                            with Intelligent Insurance
                        </h2>
                        <p className="about-paragraph">
                            Founded at the intersection of Finance and Artificial Intelligence, InsurAi was born
                            from a simple vision: to make complex corporate insurance management as intuitive as
                            sending a message.
                        </p>
                        <p className="about-paragraph">
                            Our platform empowers enterprises to navigate the complex landscape of risk management
                            through data-driven intelligence and seamless human collaboration. We don't just
                            automate processes; we build trust through transparency and technological excellence.
                        </p>
                        <div className="about-features">
                            <div className="about-feature-item">
                                <FiCheckCircle className="check-icon" />
                                <span>Global Compliance Standards</span>
                            </div>
                            <div className="about-feature-item">
                                <FiCheckCircle className="check-icon" />
                                <span>24/7 AI-Powered Intelligence</span>
                            </div>
                            <div className="about-feature-item">
                                <FiCheckCircle className="check-icon" />
                                <span>Scalable Enterprise Solutions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <div className="logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <FiShield /> <span>InsurAI</span>
                </div>
                <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    Reimagining insurance through the lens of artificial intelligence and human-centric design.
                </p>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                    &copy; 2026 InsurAI Corporate. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
