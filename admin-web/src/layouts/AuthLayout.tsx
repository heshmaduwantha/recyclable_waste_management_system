import React from 'react';
import { Outlet } from 'react-router-dom';
import { adminTheme } from '../theme/admin';

export const AuthLayout: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: adminTheme.colors.primary,
      backgroundImage: 'radial-gradient(circle at 50% 50%, #334155 0%, #1E293B 100%)',
      padding: '20px'
    }}>
      <Outlet />
    </div>
  );
};
