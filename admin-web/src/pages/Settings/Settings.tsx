import React from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <>
      <Header title="System Settings" subtitle="Configure pricing rates, waste categories, and system thresholds" />

      <main style={{ padding: '32px', maxWidth: '800px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: adminTheme.borderRadius.lg,
          padding: '32px',
          border: `1px solid ${adminTheme.colors.border}`,
          boxShadow: adminTheme.shadows.sm,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: adminTheme.colors.textPrimary }}>Waste Category Pricing (per Kg)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { category: 'Plastic Bottles (PET)', rate: '40' },
              { category: 'Paper & Cardboard', rate: '25' },
              { category: 'Metals & Aluminum', rate: '70' },
              { category: 'Glass Bottles', rate: '15' },
              { category: 'Electronic Waste (E-Waste)', rate: '100' },
              { category: 'Organic Compostables', rate: '10' }
            ].map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: adminTheme.colors.textSecondary }}>{cat.category}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: adminTheme.colors.textMuted }}>LKR</span>
                  <input
                    type="number"
                    defaultValue={cat.rate}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: adminTheme.borderRadius.md,
                      border: `1px solid ${adminTheme.colors.border}`,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: adminTheme.colors.accent,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: adminTheme.borderRadius.md,
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '16px'
          }}>
            <Save size={18} />
            <span>Save Pricing Configurations</span>
          </button>
        </div>
      </main>
    </>
  );
};
