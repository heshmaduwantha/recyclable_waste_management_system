import React, { useState } from 'react';
import { Header } from '../../components/Header/Header';
import { mockPickups } from '../../mock/data';
import { adminTheme } from '../../theme/admin';
import { Filter, Plus, Search, Truck, MapPin, Calendar, Clock } from 'lucide-react';

export const Pickups: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredPickups = mockPickups.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <>
      <Header title="Pickups Management" subtitle="Track, assign, and verify waste pickup jobs" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Actions bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'pending', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: adminTheme.borderRadius.md,
                  border: `1px solid ${filter === status ? adminTheme.colors.primary : adminTheme.colors.border}`,
                  backgroundColor: filter === status ? adminTheme.colors.primary : '#FFFFFF',
                  color: filter === status ? '#FFFFFF' : adminTheme.colors.textSecondary,
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

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
            <span>Create Pickup Request</span>
          </button>
        </div>

        {/* Pickups Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredPickups.map((pickup) => (
            <div key={pickup.id} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: adminTheme.borderRadius.lg,
              padding: '24px',
              border: `1px solid ${adminTheme.colors.border}`,
              boxShadow: adminTheme.shadows.sm,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: adminTheme.colors.primary, fontSize: '16px' }}>{pickup.id}</span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  backgroundColor: 
                    pickup.status === 'completed' ? '#10B98115' :
                    pickup.status === 'in_progress' ? '#3B82F615' : '#F59E0B15',
                  color:
                    pickup.status === 'completed' ? adminTheme.colors.accent :
                    pickup.status === 'in_progress' ? adminTheme.colors.accentBlue : '#F59E0B'
                }}>
                  {pickup.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: adminTheme.colors.textPrimary }}>{pickup.customerName}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: adminTheme.colors.textSecondary, marginTop: '4px' }}>
                  <MapPin size={14} color={adminTheme.colors.textMuted} />
                  <span>{pickup.address.street}, {pickup.address.city}</span>
                </div>
              </div>

              <div style={{
                backgroundColor: adminTheme.colors.background,
                padding: '12px',
                borderRadius: adminTheme.borderRadius.md,
                fontSize: '13px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ color: adminTheme.colors.textMuted, fontSize: '11px', fontWeight: 600 }}>ITEMS</div>
                  <div style={{ fontWeight: 600 }}>{pickup.items.map(i => i.category).join(', ')}</div>
                </div>
                <div>
                  <div style={{ color: adminTheme.colors.textMuted, fontSize: '11px', fontWeight: 600 }}>WEIGHT</div>
                  <div style={{ fontWeight: 700, color: adminTheme.colors.accent }}>{pickup.totalEstimatedWeight} kg</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${adminTheme.colors.border}`, fontSize: '12px', color: adminTheme.colors.textSecondary }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  <span>{pickup.scheduledDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  <span>{pickup.scheduledTimeSlot}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
