import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersView from './customer/OrdersView';
import AdminDashboard from './admin/AdminDashboard';

export default function DashboardView() {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect based on user role
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (user.role === 'restaurant') {
            navigate('/restaurant/dashboard');
        }
        // Customer stays on customer dashboard
    }, [user, navigate]);

    // Show customer orders dashboard for customers
    if (user && user.role === 'customer') {
        return <OrdersView />;
    }

    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-700">Loading dashboard...</p>
        </div>
    );
}
