import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  UserCheck, 
  Gift, 
  BarChart3, 
  Settings, 
  LogOut,
  Recycle
} from 'lucide-react';
import { adminTheme } from '../../theme/admin';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Pickups Management', path: '/pickups', icon: Truck },
  { label: 'Pickers', path: '/pickers', icon: UserCheck },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Rewards Program', path: '/rewards', icon: Gift },
  { label: 'Analytics & Reports', path: '/reports', icon: BarChart3 },
  { label: 'System Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: adminTheme.colors.primary,
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
      boxShadow: adminTheme.shadows.lg
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: `1px solid rgba(255, 255, 255, 0.1)`
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: adminTheme.colors.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <Recycle size={24} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>EcoCollect</h2>
          <span style={{ fontSize: '11px', color: adminTheme.colors.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Dashboard</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: adminTheme.borderRadius.md,
                color: isActive ? '#FFFFFF' : adminTheme.colors.textMuted,
                backgroundColor: isActive ? adminTheme.colors.secondary : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? adminTheme.colors.accent : adminTheme.colors.textMuted} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: adminTheme.colors.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#FFFFFF'
          }}>
            AD
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>System Admin</div>
            <div style={{ fontSize: '11px', color: adminTheme.colors.textMuted }}>admin@ecocollect.lk</div>
          </div>
        </div>
        <Link to="/login" title="Logout" style={{ color: adminTheme.colors.textMuted, cursor: 'pointer' }}>
          <LogOut size={18} />
        </Link>
      </div>
    </aside>
  );
};
