import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
}
