import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post('http://localhost:8000/upload-sales', formData);
            setMessage(res.data.message);
            // Automatically trigger forecast generation
            await axios.get('http://localhost:8000/forecast');
            setMessage(res.data.message + " - Forecast generated successfully!");
        } catch (err) {
            setMessage('Upload failed. ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Data Upload</h1>
                <p className="page-subtitle">Upload historical CSV sales data to train models.</p>
            </div>

            <div className="glass-panel" style={{ textAlign: 'center', padding: '64px 24px' }}>
                <UploadCloud size={64} style={{ marginBottom: 16, color: 'var(--accent)' }} />
                <h2>Select a CSV file</h2>
                <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} style={{ margin: '24px 0' }} />
                <br />
                <button className="btn" onClick={handleUpload} disabled={!file || loading}>
                    {loading ? 'Processing...' : 'Upload & Train Model'}
                </button>

                {message && (
                    <div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
