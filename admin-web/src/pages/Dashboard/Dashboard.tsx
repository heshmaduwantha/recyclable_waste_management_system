import React from 'react';
import { Header } from '../../components/Header/Header';
import { mockStats, mockPickups } from '../../mock/data';
import { adminTheme } from '../../theme/admin';
import { Truck, Users, Scale, Award, TrendingUp, CheckCircle, Clock, Recycle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Max scale calculation for normalized bar heights (max 100%)
  const maxWeightKg = 200;

  return (
    <>
      <Header title="EcoCollect Admin Dashboard" subtitle="Overview of waste collection, drivers, and user rewards" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: adminTheme.typography.fontFamily }}>
        {/* Top KPI Cards with 3XL Rounded Corners */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {[
            { label: 'Total Pickups', value: mockStats.totalPickups.toLocaleString(), icon: Truck, color: adminTheme.colors.accentGreen, change: '+12.5% this week' },
            { label: 'Total Waste Collected', value: `${(mockStats.wasteCollectedKg / 1000).toFixed(1)} Tons`, icon: Scale, color: adminTheme.colors.accentYellow, change: '+8.4% this month' },
            { label: 'Registered Recyclers', value: mockStats.totalCustomers.toLocaleString(), icon: Users, color: '#3B82F6', change: '+142 new users' },
            { label: 'Reward Points Earned', value: mockStats.ecoPointsIssued.toLocaleString(), icon: Award, color: adminTheme.colors.accentYellow, change: '+45.2k redeemed' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: adminTheme.borderRadius.xl3,
                padding: '24px',
                border: `1px solid ${adminTheme.colors.border}`,
                boxShadow: adminTheme.shadows.sm,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: adminTheme.colors.textSecondary, fontWeight: 600 }}>{card.label}</span>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    backgroundColor: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color
                  }}>
                    <Icon size={20} />
                  </div>
                </div>

                <div style={{ fontSize: '28px', fontWeight: 800, color: adminTheme.colors.textPrimary, letterSpacing: '-0.5px' }}>
                  {card.value}
                </div>

                <div style={{ fontSize: '12px', color: card.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} />
                  <span>{card.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collection Chart & Driver Operations */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Fixed Chart Container - No Overflowing Bars */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: adminTheme.borderRadius.xl3,
            padding: '28px',
            border: `1px solid ${adminTheme.colors.border}`,
            boxShadow: adminTheme.shadows.sm,
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: adminTheme.colors.textPrimary }}>Monthly Waste Collected</h3>
                <span style={{ fontSize: '13px', color: adminTheme.colors.textSecondary }}>Weight of recyclables collected each month (in Kg)</span>
              </div>

              {/* Target Pill */}
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#D97706',
                backgroundColor: adminTheme.colors.accentYellowLight,
                padding: '6px 14px',
                borderRadius: '20px',
                border: `1px solid ${adminTheme.colors.accentYellow}`
              }}>
                ★ 94.2% Target Met
              </span>
            </div>

            {/* Normalized Chart Area with Height Limit */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '20px',
              height: '180px',
              paddingTop: '20px',
              paddingBottom: '8px',
              borderBottom: `1px solid ${adminTheme.colors.border}`,
              overflow: 'hidden',
              position: 'relative'
            }}>
              {[
                { month: 'Jan', plastic: 60, paper: 40, glass: 25 },
                { month: 'Feb', plastic: 75, paper: 50, glass: 30 },
                { month: 'Mar', plastic: 90, paper: 65, glass: 45 },
                { month: 'Apr', plastic: 110, paper: 80, glass: 50 },
                { month: 'May', plastic: 130, paper: 95, glass: 60 },
                { month: 'Jun', plastic: 160, paper: 110, glass: 70 }
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '4px', width: '100%', alignItems: 'flex-end', justifyContent: 'center', height: '100%', maxHeight: '140px' }}>
                    <div style={{ height: `${(item.plastic / maxWeightKg) * 100}%`, width: '12px', backgroundColor: adminTheme.colors.accentGreen, borderRadius: '6px 6px 0 0' }} title={`Plastics: ${item.plastic}kg`} />
                    <div style={{ height: `${(item.paper / maxWeightKg) * 100}%`, width: '12px', backgroundColor: adminTheme.colors.accentBlue, borderRadius: '6px 6px 0 0' }} title={`Paper: ${item.paper}kg`} />
                    <div style={{ height: `${(item.glass / maxWeightKg) * 100}%`, width: '12px', backgroundColor: adminTheme.colors.accentYellow, borderRadius: '6px 6px 0 0' }} title={`Glass: ${item.glass}kg`} />
                  </div>
                  <span style={{ fontSize: '12px', color: adminTheme.colors.textSecondary, fontWeight: 700 }}>{item.month}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '20px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: adminTheme.colors.accentGreen, borderRadius: '3px' }} />
                <span>Plastics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: adminTheme.colors.accentBlue, borderRadius: '3px' }} />
                <span>Paper & Cardboard</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: adminTheme.colors.accentYellow, borderRadius: '3px' }} />
                <span>Glass & Electronics</span>
              </div>
            </div>
          </div>

          {/* Driver Fleet Box */}
          <div style={{
            backgroundColor: adminTheme.colors.primary,
            color: '#FFFFFF',
            borderRadius: adminTheme.borderRadius.xl3,
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: adminTheme.shadows.md
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Recycle size={24} color={adminTheme.colors.accentGreen} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Collector Fleet</h3>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: adminTheme.colors.textMuted }}>Live driver status</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: adminTheme.borderRadius.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={18} color={adminTheme.colors.accentGreen} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Active Drivers</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: adminTheme.colors.accentGreen }}>38 / 42</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: adminTheme.borderRadius.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={18} color={adminTheme.colors.accentYellow} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Pending Pickups</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: adminTheme.colors.accentYellow }}>14 Waiting</span>
                </div>
              </div>
            </div>

            <button style={{
              marginTop: '24px',
              backgroundColor: adminTheme.colors.accentGreen,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '20px',
              padding: '14px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: adminTheme.typography.fontFamily
            }}>
              Assign Drivers
            </button>
          </div>
        </div>

        {/* Recent Pickup Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: adminTheme.borderRadius.xl3,
          padding: '28px',
          border: `1px solid ${adminTheme.colors.border}`,
          boxShadow: adminTheme.shadows.sm
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: adminTheme.colors.textPrimary }}>Recent Pickups</h3>
            <span style={{ fontSize: '13px', color: adminTheme.colors.accentGreen, fontWeight: 700, cursor: 'pointer' }}>View All →</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${adminTheme.colors.border}`, color: adminTheme.colors.textSecondary }}>
                <th style={{ padding: '12px 16px' }}>Request ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Assigned Driver</th>
                <th style={{ padding: '12px 16px' }}>Est. Weight</th>
                <th style={{ padding: '12px 16px' }}>Scheduled Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPickups.map((pickup) => (
                <tr key={pickup.id} style={{ borderBottom: `1px solid ${adminTheme.colors.border}` }}>
                  <td style={{ padding: '16px 16px', fontWeight: 800, color: adminTheme.colors.primary }}>{pickup.id}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ fontWeight: 700 }}>{pickup.customerName}</div>
                    <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary }}>{pickup.address.city}</div>
                  </td>
                  <td style={{ padding: '16px 16px' }}>{pickup.pickerName || <span style={{ color: adminTheme.colors.textMuted }}>Unassigned</span>}</td>
                  <td style={{ padding: '16px 16px', fontWeight: 700, color: adminTheme.colors.accentGreen }}>{pickup.totalEstimatedWeight} kg</td>
                  <td style={{ padding: '16px 16px', color: adminTheme.colors.textSecondary }}>{pickup.scheduledDate}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'capitalize',
                      backgroundColor: 
                        pickup.status === 'completed' ? '#DCFCE7' :
                        pickup.status === 'in_progress' ? '#E0F2FE' : '#FEF3C7',
                      color:
                        pickup.status === 'completed' ? adminTheme.colors.accentGreen :
                        pickup.status === 'in_progress' ? adminTheme.colors.accentBlue : '#D97706'
                    }}>
                      {pickup.status.replace('_', ' ')}
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
