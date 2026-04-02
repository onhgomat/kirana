import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Inventory() {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        axios.get('/inventory').then(res => setInventory(res.data)).catch(console.error);
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Inventory Health</h1>
                <p className="page-subtitle">Current stock levels vs predicted AI forecasts.</p>
            </div>

            <div className="glass-panel">
                <table className="table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Optimal Stock</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>No inventory data found.</td></tr>
                        )}
                        {inventory.map(item => {
                            let status = 'success';
                            if (item.current_stock < item.optimal_stock) status = 'warning';
                            if (item.alerts && item.alerts.some(a => a.is_critical)) status = 'critical';

                            return (
                                <tr key={item.id}>
                                    <td><strong>{item.sku}</strong></td>
                                    <td>{item.name}</td>
                                    <td>{item.current_stock}</td>
                                    <td>{item.optimal_stock}</td>
                                    <td>
                                        <span className={`badge ${status}`}>
                                            {status === 'critical' ? 'REORDER NOW' : status === 'warning' ? 'LOW STOCK' : 'HEALTHY'}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
