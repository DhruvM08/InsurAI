import React, { useEffect, useState } from 'react';
import {
    HiStatusOnline,
    HiChip,
    HiDatabase,
    HiLightningBolt,
    HiRefresh,
    HiClock
} from 'react-icons/hi';
import { fetchSystemHealth, fetchSystemMetrics } from '../../services/api';
import './SystemIntelligence.css';

const SystemIntelligence = () => {
    const [health, setHealth] = useState(null);
    const [metrics, setMetrics] = useState({
        jvmMemory: null,
        cpuUsage: null,
        uptime: null,
        httpRequests: null
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const loadData = async () => {
        setLoading(true);
        try {
            const healthRes = await fetchSystemHealth();
            if (healthRes.success) setHealth(healthRes.health);

            const [memRes, cpuRes, uptimeRes, httpRes] = await Promise.all([
                fetchSystemMetrics('jvm.memory.used'),
                fetchSystemMetrics('system.cpu.usage'),
                fetchSystemMetrics('process.uptime'),
                fetchSystemMetrics('http.server.requests')
            ]);

            setMetrics({
                jvmMemory: memRes.success ? memRes.metrics : null,
                cpuUsage: cpuRes.success ? cpuRes.metrics : null,
                uptime: uptimeRes.success ? uptimeRes.metrics : null,
                httpRequests: httpRes.success ? httpRes.metrics : null
            });
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to load system intelligence data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds) => {
        if (!seconds) return '0s';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="system-intelligence-container">
            <header className="si-header">
                <div>
                    <h2 className="subpage-title">System Intelligence</h2>
                    <p style={{ color: '#94a3b8' }} className="subpage-subtitle">Real-time monitoring of application health and API performance metrics.</p>
                </div>
                <button className="refresh-btn" onClick={loadData} disabled={loading}>
                    <HiRefresh className={loading ? 'spinning' : ''} />
                    <span>Refresh</span>
                </button>
            </header>

            <div className="si-grid">
                {/* Health Status */}
                <div className="si-card health-card">
                    <div className="si-card-header">
                        <HiStatusOnline className={`status-icon ${health?.status?.toLowerCase()}`} />
                        <h3>System Health</h3>
                    </div>
                    <div className="si-card-body">
                        <div className="health-status">
                            <span className="status-label">Overall Status:</span>
                            <span className={`status-badge ${health?.status?.toLowerCase()}`}>
                                {health?.status || 'UNKNOWN'}
                            </span>
                        </div>
                        <div className="health-details">
                            <div className="detail-row">
                                <span>Database:</span>
                                <span className={health?.components?.db?.status?.toLowerCase()}>
                                    {health?.components?.db?.status || 'UP'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span>Disk Space:</span>
                                <span className={health?.components?.diskSpace?.status?.toLowerCase()}>
                                    {health?.components?.diskSpace?.status || 'UP'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span>Mongo Connectivity:</span>
                                <span className={health?.components?.mongo?.status?.toLowerCase()}>
                                    {health?.components?.mongo?.status || 'UP'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resource Usage */}
                <div className="si-card metrics-card">
                    <div className="si-card-header">
                        <HiChip />
                        <h3>Resource Allocation</h3>
                    </div>
                    <div className="si-card-body">
                        <div className="metric-item">
                            <label>JVM Memory Used</label>
                            <span className="metric-value">
                                {formatBytes(metrics.jvmMemory?.measurements?.[0]?.value)}
                            </span>
                        </div>
                        <div className="metric-item">
                            <label>System CPU Usage</label>
                            <span className="metric-value">
                                {(metrics.cpuUsage?.measurements?.[0]?.value * 100).toFixed(2)}%
                            </span>
                        </div>
                        <div className="metric-item">
                            <label>Process Uptime</label>
                            <span className="metric-value">
                                {formatUptime(metrics.uptime?.measurements?.[0]?.value)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* API Performance */}
                <div className="si-card performance-card">
                    <div className="si-card-header">
                        <HiLightningBolt />
                        <h3>API Intelligence</h3>
                    </div>
                    <div className="si-card-body">
                        <div className="metric-item">
                            <label>Total HTTP Requests</label>
                            <span className="metric-value">
                                {metrics.httpRequests?.measurements?.find(m => m.statistic === 'COUNT')?.value || 0}
                            </span>
                        </div>
                        <div className="metric-item">
                            <label>Max Request Latency</label>
                            <span className="metric-value">
                                {(metrics.httpRequests?.measurements?.find(m => m.statistic === 'MAX')?.value || 0).toFixed(4)}s
                            </span>
                        </div>
                        <div className="metric-item">
                            <label>Active Threads</label>
                            <span className="metric-value">Detecting...</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="si-footer">
                <HiClock />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <span className="auto-refresh-label">(Auto-refreshing every 30s)</span>
            </footer>
        </div>
    );
};

export default SystemIntelligence;
