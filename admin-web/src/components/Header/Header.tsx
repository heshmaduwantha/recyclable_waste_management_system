import React from 'react';
import { Bell, Search, Filter } from 'lucide-react';
import { adminTheme } from '../../theme/admin';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header style={{
      height: '70px',
      backgroundColor: '#FFFFFF',
      borderBottom: `1px solid ${adminTheme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: adminTheme.colors.textPrimary }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: adminTheme.colors.textSecondary }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: adminTheme.colors.background,
          padding: '8px 14px',
          borderRadius: adminTheme.borderRadius.md,
          border: `1px solid ${adminTheme.colors.border}`,
          width: '240px'
        }}>
          <Search size={16} color={adminTheme.colors.textMuted} />
          <input 
            type="text" 
            placeholder="Search records..." 
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              width: '100%',
              color: adminTheme.colors.textPrimary
            }}
          />
        </div>

        {/* Notifications Icon */}
        <button style={{
          width: '38px',
          height: '38px',
          borderRadius: adminTheme.borderRadius.md,
          border: `1px solid ${adminTheme.colors.border}`,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <Bell size={18} color={adminTheme.colors.textSecondary} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: adminTheme.colors.accent
          }} />
        </button>
      </div>
    </header>
  );
};
