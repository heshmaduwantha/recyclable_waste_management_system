import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { adminSession } from '../services/session';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { adminTheme } from '../theme/admin';

export const DashboardLayout: React.FC = () => {
  if (!adminSession.get()) return <Navigate to="/login" replace />;
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: adminTheme.colors.background }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
    </div>
  );
};
