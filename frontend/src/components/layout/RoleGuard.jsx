import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const RoleGuard = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading, role } = useAuth();
  const toast = useToast();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          backgroundColor: '#F8FAFC'
        }}
      >
        <div className="spinner spinner-dark" style={{ width: '36px', height: '36px', borderWidth: '3px' }} />
        <div style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 500 }}>
          Authenticating SkillMate AI session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to user's authorized dashboard
    let target = '/student/dashboard';
    if (role === 'ADMIN') target = '/admin/dashboard';
    if (role === 'MENTOR') target = '/mentor/dashboard';

    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
