import React from 'react';
import { Header } from '../../components/Header/Header';
import { mockPickers } from '../../mock/data';
import { adminTheme } from '../../theme/admin';
import { UserCheck, Phone, Mail, MapPin, Award, Plus } from 'lucide-react';

export const Pickers: React.FC = () => {
  return (
    <>
      <Header title="Collector Fleets (Pickers)" subtitle="Manage eco-collectors, routes, and performance" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: adminTheme.colors.textPrimary }}>Registered Eco-Pickers</h3>
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
            <span>Onboard New Picker</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {mockPickers.map((picker) => (
            <div key={picker.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: adminTheme.borderRadius.lg,
              padding: '24px',
              border: `1px solid ${adminTheme.colors.border}`,
              boxShadow: adminTheme.shadows.sm,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src={picker.avatarUrl || 'https://via.placeholder.com/60'} 
                  alt={picker.name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: adminTheme.colors.textPrimary }}>{picker.name}</h4>
                  <span style={{ fontSize: '12px', color: adminTheme.colors.accent, fontWeight: 600 }}>Verified Collector</span>
                  <div style={{ fontSize: '12px', color: adminTheme.colors.textMuted, marginTop: '2px' }}>ID: {picker.id}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: adminTheme.colors.textSecondary }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color={adminTheme.colors.textMuted} />
                  <span>{picker.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color={adminTheme.colors.textMuted} />
                  <span>{picker.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color={adminTheme.colors.textMuted} />
                  <span>{picker.address?.city} Region</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '12px',
                backgroundColor: adminTheme.colors.background,
                borderRadius: adminTheme.borderRadius.md,
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: adminTheme.colors.textMuted, fontWeight: 600 }}>JOBS DONE</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: adminTheme.colors.primary }}>128</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: adminTheme.colors.textMuted, fontWeight: 600 }}>RATING</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#F59E0B' }}>4.9 ★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
