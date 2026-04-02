import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/google-login`, {
                token: credentialResponse.credential
            });

            login(res.data.access_token, res.data.user);
            navigate('/');
        } catch (err) {
            setError('Login failed: ' + (err.response?.data?.detail || err.message));
        }
    };

    return (
        <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
                <Package size={48} color="var(--accent)" style={{ marginBottom: 16 }} />
                <h1 className="page-title">KiranaAI</h1>
                <p className="page-subtitle" style={{ marginBottom: 32 }}>Sign in to manage your inventory</p>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => setError('Google Authentication Failed')}
                        useOneTap
                    />
                </div>

                {error && <div style={{ color: 'var(--critical)', marginTop: 16, fontSize: '0.875rem' }}>{error}</div>}
            </div>
        </div>
    );
}
