import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';

export default function RoleProtectedRoute({ permission }) {
    const { user } = useAuth();
    const { canAccess } = usePermission();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If permission is required and user does not have it, redirect to unauthorized
    if (permission && !canAccess(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
