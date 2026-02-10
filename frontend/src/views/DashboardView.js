import React from 'react';

export default function DashboardView() {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-700">Welcome {user ? user.name : 'Guest'}! This is a simple dashboard placeholder.</p>
        </div>
    );
}
