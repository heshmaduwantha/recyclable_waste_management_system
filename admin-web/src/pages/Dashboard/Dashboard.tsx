import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Truck, Users, Scale, Award, TrendingUp, CheckCircle, Clock, Recycle, X } from 'lucide-react';
import { adminService, AdminDashboardStats, MonthlyChartItem, FleetStatusData } from '../../services/admin.service';
import { pickupService } from '../../services/pickup.service';
import { pickerService, AdminPickerData } from '../../services/picker.service';
import { PickupRequest } from '../../../../shared/types';
import { apiCall } from '../../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [chartData, setChartData] = useState<MonthlyChartItem[]>([]);
  const [fleetStatus, setFleetStatus] = useState<FleetStatusData | null>(null);
  const [recentPickups, setRecentPickups] = useState<PickupRequest[]>([]);
  const [pickers, setPickers] = useState<AdminPickerData[]>([]);

  // Assign Driver Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPickupId, setSelectedPickupId] = useState('');
  const [selectedPickerId, setSelectedPickerId] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      const [statsData, chartList, fleet, pickupsList, pickersList] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getMonthlyChartData(),
        adminService.getFleetStatus(),
        pickupService.getPickups(),
        pickerService.getPickers()
      ]);
      if (isMounted) {
        setStats(statsData);
        setChartData(chartList);
        setFleetStatus(fleet);
        setRecentPickups(pickupsList);
        setPickers(pickersList);
      }
    }
    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  const handleAssignDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAssign(true);
    try {
      const chosenPicker = pickers.find(p => p.id === selectedPickerId) || pickers[0];
      await apiCall(`/admin/pickups/${selectedPickupId || recentPickups[0]?.id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickerId: chosenPicker?.id || 'PICK-001',
          pickerName: chosenPicker?.name || 'Suresh Kumar'
        })
      });

      setRecentPickups(recentPickups.map(p => {
        if (p.id === (selectedPickupId || recentPickups[0]?.id)) {
          return { ...p, pickerId: chosenPicker?.id, pickerName: chosenPicker?.name, status: 'in_progress' };
        }
        return p;
      }));

      setIsAssignModalOpen(false);
    } catch (err) {
      console.warn('Assign driver error:', err);
    } finally {
      setSubmittingAssign(false);
    }
  };

  const totalPickupsVal = stats?.totalPickups !== undefined ? stats.totalPickups.toLocaleString() : '1,420';
  const totalWasteTons = stats?.wasteCollectedKg !== undefined ? (stats.wasteCollectedKg / 1000).toFixed(1) : '42.9';
  const totalCustomersVal = stats?.totalCustomers !== undefined ? stats.totalCustomers.toLocaleString() : '5,890';
  const totalPointsVal = stats?.ecoPointsIssued !== undefined ? stats.ecoPointsIssued.toLocaleString() : '857,000';
  const recycledRateVal = stats?.recycledRate || '94.2%';

  const activeDriversVal = fleetStatus ? `${fleetStatus.activeDrivers} / ${fleetStatus.totalDrivers}` : '38 / 42';
  const pendingPickupsVal = fleetStatus ? `${fleetStatus.pendingPickups} Waiting` : '14 Waiting';

  const maxWeightKg = 200;

  return (
    <>
      <Header title="EcoCollect Admin Dashboard" subtitle="Overview of waste collection, drivers, and user rewards" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: adminTheme.typography.fontFamily }}>
        {/* Top KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {[
            { label: 'Total Pickups', value: totalPickupsVal, icon: Truck, color: adminTheme.colors.accentGreen, change: stats?.totalPickupsChange || '+12.5% this week' },
            { label: 'Total Waste Collected', value: `${totalWasteTons} Tons`, icon: Scale, color: adminTheme.colors.accentYellow, change: stats?.wasteCollectedChange || '+8.4% this month' },
            { label: 'Registered Recyclers', value: totalCustomersVal, icon: Users, color: '#3B82F6', change: stats?.customersChange || '+142 new users' },
            { label: 'Reward Points Earned', value: totalPointsVal, icon: Award, color: adminTheme.colors.accentYellow, change: stats?.pointsChange || '+45.2k redeemed' }
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
          {/* Chart Container */}
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

              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#D97706',
                backgroundColor: adminTheme.colors.accentYellowLight,
                padding: '6px 14px',
                borderRadius: '20px',
                border: `1px solid ${adminTheme.colors.accentYellow}`
              }}>
                ★ {recycledRateVal} Target Met
              </span>
            </div>

            {/* Chart */}
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
              {chartData.map((item, i) => (
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
                  <span style={{ fontWeight: 800, fontSize: '16px', color: adminTheme.colors.accentGreen }}>{activeDriversVal}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: adminTheme.borderRadius.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={18} color={adminTheme.colors.accentYellow} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Pending Pickups</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '16px', color: adminTheme.colors.accentYellow }}>{pendingPickupsVal}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAssignModalOpen(true)}
              style={{
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
              }}
            >
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
            <span
              onClick={() => navigate('/admin/pickups')}
              style={{ fontSize: '13px', color: adminTheme.colors.accentGreen, fontWeight: 700, cursor: 'pointer' }}
            >
              View All →
            </span>
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
              {recentPickups.map((pickup) => (
                <tr key={pickup.id} style={{ borderBottom: `1px solid ${adminTheme.colors.border}` }}>
                  <td style={{ padding: '16px 16px', fontWeight: 800, color: adminTheme.colors.primary }}>{pickup.id}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ fontWeight: 700 }}>{pickup.customerName}</div>
                    <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary }}>{pickup.address?.city}</div>
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

      {/* Assign Driver Modal */}
      {isAssignModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: adminTheme.borderRadius.lg,
            padding: '32px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: adminTheme.shadows.lg
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Assign Driver to Pickup</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsAssignModalOpen(false)} />
            </div>

            <form onSubmit={handleAssignDriver} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Select Pickup Request</label>
                <select value={selectedPickupId} onChange={e => setSelectedPickupId(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }}>
                  {recentPickups.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {p.customerName} ({p.totalEstimatedWeight} kg)</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Select Collector Driver</label>
                <select value={selectedPickerId} onChange={e => setSelectedPickerId(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }}>
                  {pickers.map(pk => (
                    <option key={pk.id} value={pk.id}>{pk.name} ({pk.phone})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsAssignModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}`, backgroundColor: '#F8FAFC', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submittingAssign} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: adminTheme.colors.accent, color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>{submittingAssign ? 'Assigning...' : 'Assign Collector'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
