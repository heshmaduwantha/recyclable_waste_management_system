import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  MapPin,
  Users, 
  UserCheck, 
  Gift, 
  BarChart3, 
  Settings, 
  LogOut,
  Recycle,
  Globe2
} from 'lucide-react';
import { adminTheme } from '../../theme/admin';
import { adminSession } from '../../services/session';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Driver Allocation', path: '/admin/allocations', icon: MapPin },
  { label: 'Pickups Management', path: '/admin/pickups', icon: Truck },
  { label: 'Pickers Directory', path: '/admin/pickers', icon: UserCheck },
  { label: 'Customers Directory', path: '/admin/customers', icon: Users },
  { label: 'Rewards Program', path: '/admin/rewards', icon: Gift },
  { label: 'Analytics & Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'System Settings', path: '/admin/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#18181B',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
      fontFamily: "'Poppins', sans-serif",
      borderRight: '1.5px solid #18181B',
      boxShadow: '3px 0px 0px #18181B'
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
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: '#22C55E',
          border: '1.5px solid #18181B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '2px 2px 0px #18181B'
        }}>
          <Recycle size={26} color="#FFFFFF" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 900, letterSpacing: '-0.5px', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>
            Eco<span style={{ color: '#22C55E' }}>Collect</span>
          </h2>
          <span style={{ fontSize: '10px', color: '#22C55E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Admin Portal
          </span>
        </div>
      </div>

      {/* Commercial Web Link */}
      <div style={{ padding: '12px 16px 0 16px' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            color: '#22C55E',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          <Globe2 size={15} />
          <span>View Commercial Site →</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                borderRadius: '12px',
                color: isActive ? '#22C55E' : '#A1A1AA',
                backgroundColor: isActive ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                borderLeft: isActive ? '4px solid #22C55E' : '4px solid transparent',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '14px',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#22C55E' : '#71717A'} />
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
            borderRadius: '18px',
            backgroundColor: '#22C55E',
            border: '1.5px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#FFFFFF',
            fontSize: '13px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            AD
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}>{adminSession.get()?.name || 'System Admin'}</div>
            <div style={{ fontSize: '11px', color: '#A1A1AA' }}>{adminSession.get()?.email}</div>
          </div>
        </div>
        <Link to="/login" title="Logout" onClick={() => adminSession.clear()} style={{ color: '#A1A1AA', cursor: 'pointer' }}>
          <LogOut size={18} />
        </Link>
      </div>
    </aside>
  );
};
