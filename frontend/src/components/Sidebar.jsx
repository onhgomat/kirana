import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, UploadCloud, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const { logout, user } = useAuth();
    return (
        <div className="sidebar" style={{ justifyContent: 'space-between' }}>
            <div>
                <div className="sidebar-logo">
                    <Package size={28} />
                    KiranaAI
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/inventory" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Package size={20} /> Inventory
                    </NavLink>
                    <NavLink to="/upload" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <UploadCloud size={20} /> Data Upload
                    </NavLink>
                </nav>
            </div>

            <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16 }}>
                    Signed in as<br /><strong>{user?.name}</strong>
                </div>
                <button className="btn" onClick={logout} style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );
}
