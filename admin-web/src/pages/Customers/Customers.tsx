import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Users, Phone, Mail, MapPin, RefreshCw } from 'lucide-react';
import { customerService, AdminCustomerData } from '../../services/customer.service';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<AdminCustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
    // Auto-poll for newly registered mobile app customers every 5s
    const timer = setInterval(() => {
      loadCustomers(true);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  async function loadCustomers(silent = false) {
    if (!silent) setLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.warn('Failed to load customers:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  return (
    <>
      <Header title="Customers Directory" subtitle="Household and commercial recycling user accounts (Registered via Mobile App & Web)" />

      <main style={{ padding: '32px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: adminTheme.borderRadius.lg,
          padding: '24px',
          border: `1px solid ${adminTheme.colors.border}`,
          boxShadow: adminTheme.shadows.sm
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: adminTheme.colors.textPrimary }}>
              Registered Customer Accounts ({customers.length})
            </h3>
            <button
              onClick={() => loadCustomers()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: adminTheme.borderRadius.md,
                border: `1px solid ${adminTheme.colors.border}`,
                backgroundColor: '#F8FAFC',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} /> Refresh Directory
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${adminTheme.colors.border}`, color: adminTheme.colors.textSecondary }}>
                <th style={{ padding: '12px 16px' }}>Customer ID</th>
                <th style={{ padding: '12px 16px' }}>Name</th>
                <th style={{ padding: '12px 16px' }}>Contact</th>
                <th style={{ padding: '12px 16px' }}>Address</th>
                <th style={{ padding: '12px 16px' }}>Joined Date</th>
                <th style={{ padding: '12px 16px' }}>Role / Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id} style={{ borderBottom: `1px solid ${adminTheme.colors.border}` }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: adminTheme.colors.primary }}>{cust.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{cust.name}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div>{cust.phone || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: adminTheme.colors.textMuted }}>{cust.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: adminTheme.colors.textSecondary }}>
                    {cust.address?.street || 'Main Street'}, {cust.address?.city || 'Colombo'}
                  </td>
                  <td style={{ padding: '14px 16px', color: adminTheme.colors.textMuted }}>
                    {cust.createdAt ? cust.createdAt.split('T')[0] : '2026-08-01'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: '#10B98115', color: adminTheme.colors.accent, borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                      {cust.ecoRatingTag || 'Green Warrior (Customer)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};
