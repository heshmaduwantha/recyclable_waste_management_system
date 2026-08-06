import React from 'react';
import { Header } from '../../components/Header/Header';
import { mockRewardsList } from '../../mock/data';
import { adminTheme } from '../../theme/admin';
import { Gift, Plus, Award } from 'lucide-react';

export const Rewards: React.FC = () => {
  return (
    <>
      <Header title="Rewards & Vouchers" subtitle="Configure points redemption store and partner offers" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: adminTheme.colors.textPrimary }}>Active Catalog Rewards</h3>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: adminTheme.colors.accent,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: adminTheme.borderRadius.md,
            padding: '10px 18px',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            <Plus size={18} />
            <span>Add Reward Voucher</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {mockRewardsList.map((reward) => (
            <div key={reward.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: adminTheme.borderRadius.lg,
              padding: '24px',
              border: `1px solid ${adminTheme.colors.border}`,
              boxShadow: adminTheme.shadows.sm,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: adminTheme.colors.accentBlue, backgroundColor: '#2563EB15', padding: '4px 10px', borderRadius: '12px' }}>
                  {reward.partnerName}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>
                  {reward.pointsRequired} Points
                </span>
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: adminTheme.colors.textPrimary }}>{reward.title}</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: adminTheme.colors.textSecondary }}>{reward.description}</p>
              </div>

              <div style={{ fontSize: '12px', color: adminTheme.colors.textMuted, borderTop: `1px solid ${adminTheme.colors.border}`, paddingTop: '10px' }}>
                Expires on: {reward.expiryDate}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
