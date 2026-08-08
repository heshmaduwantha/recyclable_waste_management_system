import React, { useEffect, useState } from 'react';
import { Bell, Search, AlertTriangle, CheckCircle2, Gift, Truck, Clock, X } from 'lucide-react';
import { adminTheme } from '../../theme/admin';
import { apiCall } from '../../services/api';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await apiCall<any[]>('/notifications');
      setNotifications(data);
    } catch {
      setNotifications([
        { id: '1', title: '⚠️ Driver Rejected Job PU-8821', message: 'Suresh Kumar rejected pickup (Vehicle breakdown). Comment saved for Admin.', timestamp: '5m ago', category: 'flagged', isRead: false },
        { id: '2', title: '🎁 Voucher Redeemed', message: 'Kasun Perera redeemed 100 Eco Points for Dialog LKR 100 Reload.', timestamp: '15m ago', category: 'rewards', isRead: false },
        { id: '3', title: '🚚 Unassigned Pickup Request', message: 'New pickup PU-8822 submitted for Havelock Road. Requires driver allocation.', timestamp: '30m ago', category: 'pending', isRead: false },
        { id: '4', title: '✅ Pickup Completed', message: 'Collector Saman verified 12.5 kg plastic waste for PU-8820 (+625 pts credited).', timestamp: '1h ago', category: 'ops', isRead: true }
      ]);
    }
  }

  const filteredNotifs = notifications.filter(n => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'pending') return n.category === 'pending' || n.title.includes('Unassigned') || n.title.includes('Pickup');
    if (activeCategory === 'flagged') return n.category === 'flagged' || n.title.includes('Rejected') || n.title.includes('⚠️');
    if (activeCategory === 'rewards') return n.category === 'rewards' || n.title.includes('Voucher') || n.title.includes('Redeemed');
    if (activeCategory === 'ops') return n.category === 'ops' || n.title.includes('Completed') || n.title.includes('Accepted');
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
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

        {/* Real-time Categorized Notification Dropdown Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: adminTheme.borderRadius.md,
            border: `1px solid ${isOpen ? adminTheme.colors.accent : adminTheme.colors.border}`,
            backgroundColor: isOpen ? '#ECFDF5' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={18} color={isOpen ? adminTheme.colors.accent : adminTheme.colors.textSecondary} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 800,
              borderRadius: '10px',
              padding: '1px 5px',
              lineHeight: '12px'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Categorized Notifications Panel Overlay */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            width: '420px',
            backgroundColor: '#FFFFFF',
            borderRadius: adminTheme.borderRadius.lg,
            boxShadow: adminTheme.shadows.lg,
            border: `1px solid ${adminTheme.colors.border}`,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${adminTheme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: adminTheme.colors.textPrimary }}>
                System Alerts & Activity
              </div>
              <X size={18} style={{ cursor: 'pointer', color: adminTheme.colors.textMuted }} onClick={() => setIsOpen(false)} />
            </div>

            {/* Category Tabs Bar */}
            <div style={{
              display: 'flex',
              gap: '4px',
              padding: '10px 14px',
              borderBottom: `1px solid ${adminTheme.colors.border}`,
              backgroundColor: '#FFFFFF',
              overflowX: 'auto'
            }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'flagged', label: 'Flagged ⚠️' },
                { id: 'rewards', label: 'Rewards 🎁' },
                { id: 'ops', label: 'Driver Ops 🚚' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: activeCategory === cat.id ? adminTheme.colors.primary : '#F1F5F9',
                    color: activeCategory === cat.id ? '#FFFFFF' : adminTheme.colors.textSecondary,
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {filteredNotifs.length > 0 ? (
                filteredNotifs.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '14px 20px',
                      borderBottom: `1px solid ${adminTheme.colors.border}`,
                      backgroundColor: n.isRead ? '#FFFFFF' : '#F0FDFA',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>
                      {n.title.includes('Rejected') || n.title.includes('⚠️') ? (
                        <AlertTriangle size={18} color="#EF4444" />
                      ) : n.title.includes('Voucher') || n.title.includes('Redeemed') ? (
                        <Gift size={18} color="#F59E0B" />
                      ) : n.title.includes('Completed') ? (
                        <CheckCircle2 size={18} color="#10B981" />
                      ) : (
                        <Truck size={18} color="#0284C7" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: adminTheme.colors.textPrimary }}>{n.title}</div>
                      <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary, marginTop: '2px', lineHeight: '16px' }}>{n.message}</div>
                      <div style={{ fontSize: '10px', color: adminTheme.colors.textMuted, marginTop: '6px' }}>{n.timestamp}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', fontSize: '13px', color: adminTheme.colors.textMuted }}>
                  No alerts in this category.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
