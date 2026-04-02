import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return setError('Email and password required');
        setLoading(true);
        try {
            // OAuth2PasswordRequestForm expects form-urlencoded
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/login`, formData);

            login(res.data.access_token, res.data.user);
            navigate('/');
        } catch (err) {
            setError('Login failed: ' + (err.response?.data?.detail || err.message));
        }
        setLoading(false);
    };

    return (
        <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
                <Package size={48} color="var(--accent)" style={{ marginBottom: 16 }} />
                <h1 className="page-title">KiranaAI</h1>
                <p className="page-subtitle" style={{ marginBottom: 32 }}>Sign in to your account</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ padding: 12, borderRadius: 8, border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ padding: 12, borderRadius: 8, border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
                    />
                    <button type="submit" className="btn" style={{ justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {error && <div style={{ color: 'var(--critical)', marginTop: 16, fontSize: '0.875rem' }}>{error}</div>}
            </div>
        </div>
    );
}
