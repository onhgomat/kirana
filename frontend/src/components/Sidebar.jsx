import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, UploadCloud } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="sidebar" style={{ justifyContent: 'flex-start' }}>
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
    );
}
