import React from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { BarChart3, Download, Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  return (
    <>
      <Header title="Analytics & Impact Reports" subtitle="ESG compliance metrics, carbon reduction, and waste audits" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: adminTheme.colors.textPrimary }}>Environmental Impact Summary</h3>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: adminTheme.colors.primary,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: adminTheme.borderRadius.md,
            padding: '10px 18px',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            <Download size={18} />
            <span>Export ESG CSV Report</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { label: 'CO2 Emissions Avoided', value: '54.2 Tons', note: 'Equivalent to 2,400 trees planted' },
            { label: 'Landfill Diversion Rate', value: '96.8%', note: 'Exceeding municipal target by 12%' },
            { label: 'Water Saved', value: '184,000 Liters', note: 'Through paper & glass recycling' }
          ].map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: adminTheme.borderRadius.lg,
              padding: '24px',
              border: `1px solid ${adminTheme.colors.border}`,
              boxShadow: adminTheme.shadows.sm
            }}>
              <div style={{ fontSize: '13px', color: adminTheme.colors.textSecondary, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: adminTheme.colors.accent, margin: '12px 0 6px 0' }}>{item.value}</div>
              <div style={{ fontSize: '12px', color: adminTheme.colors.textMuted }}>{item.note}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
