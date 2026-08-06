import React from 'react';
import { Header } from '../../components/Header/Header';
import { mockCustomers } from '../../mock/data';
import { adminTheme } from '../../theme/admin';
import { Users, Phone, Mail, MapPin } from 'lucide-react';

export const Customers: React.FC = () => {
  return (
    <>
      <Header title="Customers Directory" subtitle="Household and commercial recycling user accounts" />

      <main style={{ padding: '32px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: adminTheme.borderRadius.lg,
          padding: '24px',
          border: `1px solid ${adminTheme.colors.border}`,
          boxShadow: adminTheme.shadows.sm
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${adminTheme.colors.border}`, color: adminTheme.colors.textSecondary }}>
                <th style={{ padding: '12px 16px' }}>Customer ID</th>
                <th style={{ padding: '12px 16px' }}>Name</th>
                <th style={{ padding: '12px 16px' }}>Contact</th>
                <th style={{ padding: '12px 16px' }}>Address</th>
                <th style={{ padding: '12px 16px' }}>Joined Date</th>
                <th style={{ padding: '12px 16px' }}>Eco Rating</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((cust) => (
                <tr key={cust.id} style={{ borderBottom: `1px solid ${adminTheme.colors.border}` }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: adminTheme.colors.primary }}>{cust.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{cust.name}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div>{cust.phone}</div>
                    <div style={{ fontSize: '12px', color: adminTheme.colors.textMuted }}>{cust.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: adminTheme.colors.textSecondary }}>
                    {cust.address?.street}, {cust.address?.city}
                  </td>
                  <td style={{ padding: '14px 16px', color: adminTheme.colors.textMuted }}>{cust.createdAt.split('T')[0]}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: '#10B98115', color: adminTheme.colors.accent, borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                      Level 3 Hero
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
