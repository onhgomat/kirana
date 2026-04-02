import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        // API logic will execute provided it's running
        axios.get('http://localhost:8000/inventory').then(res => setInventory(res.data)).catch(console.error);
    }, []);

    const totalSKUs = inventory.length;
    const criticalItems = inventory.filter(i => i.alerts?.some(a => a.is_critical)).length;
    const lowStockItems = inventory.filter(i => i.current_stock < i.optimal_stock && !i.alerts?.some(a => a.is_critical)).length;
    const healthyItems = totalSKUs - criticalItems - lowStockItems;

    const chartData = [
        { name: 'Healthy', value: healthyItems, fill: '#10b981' },
        { name: 'Low Stock', value: lowStockItems, fill: '#f59e0b' },
        { name: 'Critical', value: criticalItems, fill: '#ef4444' }
    ];

    const allAlerts = [];
    inventory.forEach(i => {
        i.alerts?.forEach(a => {
            allAlerts.push({ ...a, sku: i.sku, name: i.name });
        });
    });

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">Overview</h1>
                    <p className="page-subtitle">AI-Powered Kirana Store Operations</p>
                </div>
                <button className="btn" onClick={() => window.location.reload()}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-4" style={{ marginBottom: 32 }}>
                <div className="glass-panel stat-card">
                    <span className="stat-title">Total SKUs</span>
                    <span className="stat-value">{totalSKUs}</span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="stat-title">Healthy</span>
                    <span className="stat-value" style={{ color: 'var(--success)' }}>{healthyItems}</span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="stat-title">Warning</span>
                    <span className="stat-value" style={{ color: 'var(--warning)' }}>{lowStockItems}</span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="stat-title">Critical</span>
                    <span className="stat-value" style={{ color: 'var(--critical)' }}>{criticalItems}</span>
                </div>
            </div>

            <div className="grid grid-cols-2">
                <div className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: 24, fontSize: '1.25rem' }}>Inventory Status</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: 24, fontSize: '1.25rem' }}>Reorder Alerts</h3>
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {allAlerts.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: 40 }}>All stock levels are optimal.</p>
                        ) : (
                            allAlerts.map((alert, i) => (
                                <div key={i} className={`alert-item ${alert.is_critical ? 'critical' : 'warning'}`}>
                                    <AlertCircle size={24} style={{ color: alert.is_critical ? 'var(--critical)' : 'var(--warning)', flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0' }}>{alert.sku} - {alert.name}</h4>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{alert.message}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
