import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Truck, MapPin, UserCheck, CheckCircle, AlertTriangle, Send, Calendar, Clock, RefreshCw } from 'lucide-react';
import { pickupService } from '../../services/pickup.service';
import { pickerService, AdminPickerData } from '../../services/picker.service';
import { apiCall } from '../../services/api';

export const Allocations: React.FC = () => {
  const [pickups, setPickups] = useState<any[]>([]);
  const [pickers, setPickers] = useState<AdminPickerData[]>([]);
  const [selectedPickupId, setSelectedPickupId] = useState<string | null>(null);
  const [selectedPickerId, setSelectedPickerId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  async function loadData() {
    const [pickupList, pickerList] = await Promise.all([
      pickupService.getPickups(),
      pickerService.getPickers()
    ]);
    setPickups(pickupList);
    setPickers(pickerList);
    const unassigned = pickupList.find(p => p.status === 'pending');
    if (unassigned) {
      setSelectedPickupId(unassigned.id);
    } else if (pickupList.length > 0) {
      setSelectedPickupId(pickupList[0].id);
    }
    if (pickerList.length > 0) {
      setSelectedPickerId(pickerList[0].id);
    }
  }

  const activePickup = pickups.find(p => p.id === selectedPickupId);

  const handleDispatchAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickupId || !selectedPickerId) return;
    setSubmitting(true);
    setSuccessMessage(null);

    const chosenPicker = pickers.find(pk => pk.id === selectedPickerId) || pickers[0];

    try {
      await apiCall(`/admin/pickups/${selectedPickupId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickerId: chosenPicker.id,
          pickerName: chosenPicker.name
        })
      });

      setSuccessMessage(`Driver ${chosenPicker.name} dispatched successfully for Job ${selectedPickupId}! Allocation notification sent to driver's app.`);

      setPickups(pickups.map(p => {
        if (p.id === selectedPickupId) {
          return {
            ...p,
            pickerId: chosenPicker.id,
            pickerName: chosenPicker.name,
            status: 'in_progress',
            pickerStatus: 'assigned',
            rejectionReason: null
          };
        }
        return p;
      }));

    } catch (err) {
      console.warn('Allocation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const pendingPickups = pickups.filter(p => p.status === 'pending' || p.pickerStatus === 'rejected');
  const assignedPickups = pickups.filter(p => p.status === 'in_progress' && p.pickerStatus !== 'rejected');

  return (
    <>
      <Header title="Collector Allocation & Dispatch" subtitle="Real-time driver assignment, route planning, and fleet dispatch" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Success Alert Banner */}
        {successMessage && (
          <div style={{
            backgroundColor: '#ECFDF5',
            border: '1.5px solid #10B981',
            borderRadius: adminTheme.borderRadius.lg,
            padding: '16px 20px',
            color: '#065F46',
            fontWeight: 700,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle size={20} color="#10B981" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Top Summary Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: adminTheme.borderRadius.lg, border: `1px solid ${adminTheme.colors.border}` }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: adminTheme.colors.textMuted }}>UNASSIGNED PICKUPS</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>{pendingPickups.length}</div>
            <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary, marginTop: '2px' }}>Awaiting driver dispatch</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: adminTheme.borderRadius.lg, border: `1px solid ${adminTheme.colors.border}` }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: adminTheme.colors.textMuted }}>ACTIVE DISPATCHES</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: adminTheme.colors.accentBlue, marginTop: '4px' }}>{assignedPickups.length}</div>
            <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary, marginTop: '2px' }}>En route by collectors</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: adminTheme.borderRadius.lg, border: `1px solid ${adminTheme.colors.border}` }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: adminTheme.colors.textMuted }}>COLLECTORS ON DUTY</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: adminTheme.colors.accent, marginTop: '4px' }}>{pickers.length}</div>
            <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary, marginTop: '2px' }}>Registered drivers ready</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: adminTheme.borderRadius.lg, border: `1px solid ${adminTheme.colors.border}` }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: adminTheme.colors.textMuted }}>FLAGGED REJECTIONS</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#EF4444', marginTop: '4px' }}>
              {pickups.filter(p => p.pickerStatus === 'rejected').length}
            </div>
            <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary, marginTop: '2px' }}>Requires re-allocation</div>
          </div>
        </div>

        {/* 2-Column Main Allocation Hub */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
          {/* Left Column: Pickup Requests List */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: adminTheme.borderRadius.lg, padding: '24px', border: `1px solid ${adminTheme.colors.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: adminTheme.colors.textPrimary }}>
                1. Select Pickup Request
              </h3>
              <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', color: adminTheme.colors.textMuted }}>
                <RefreshCw size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {pickups.map((pickup) => {
                const isSelected = pickup.id === selectedPickupId;
                const isRejected = pickup.pickerStatus === 'rejected';

                return (
                  <div
                    key={pickup.id}
                    onClick={() => setSelectedPickupId(pickup.id)}
                    style={{
                      padding: '16px',
                      borderRadius: adminTheme.borderRadius.md,
                      border: isSelected
                        ? `2px solid ${adminTheme.colors.primary}`
                        : isRejected
                        ? '1.5px solid #EF4444'
                        : `1px solid ${adminTheme.colors.border}`,
                      backgroundColor: isSelected ? '#F0FDFA' : isRejected ? '#FEF2F2' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: adminTheme.colors.primary, fontSize: '15px' }}>{pickup.id}</span>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isRejected ? '#EF444415' : pickup.status === 'pending' ? '#F59E0B15' : '#10B98115',
                        color: isRejected ? '#EF4444' : pickup.status === 'pending' ? '#F59E0B' : '#10B981'
                      }}>
                        {isRejected ? '⚠️ Driver Rejected' : pickup.status}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '6px', color: adminTheme.colors.textPrimary }}>
                      {pickup.customerName}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: adminTheme.colors.textSecondary, marginTop: '4px' }}>
                      <MapPin size={13} color={adminTheme.colors.textMuted} />
                      <span>{pickup.address?.street}, {pickup.address?.city}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: adminTheme.colors.textMuted }}>
                      <span>Payload: <strong>{pickup.totalEstimatedWeight} kg</strong></span>
                      <span>Assigned: <strong>{pickup.pickerName || 'None'}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Driver Selection & Dispatch Form */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: adminTheme.borderRadius.lg, padding: '24px', border: `1px solid ${adminTheme.colors.border}`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: adminTheme.colors.textPrimary }}>
              2. Allocate Collector & Dispatch
            </h3>

            {activePickup ? (
              <form onSubmit={handleDispatchAllocation} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Active Pickup Preview Card */}
                <div style={{ backgroundColor: adminTheme.colors.background, padding: '16px', borderRadius: adminTheme.borderRadius.md, border: `1px solid ${adminTheme.colors.border}` }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: adminTheme.colors.textMuted, letterSpacing: '0.5px' }}>SELECTED TARGET PICKUP</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: adminTheme.colors.primary, marginTop: '2px' }}>{activePickup.id} — {activePickup.customerName}</div>
                  <div style={{ fontSize: '13px', color: adminTheme.colors.textSecondary, marginTop: '4px' }}>📍 {activePickup.address?.street}, {activePickup.address?.city}</div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '12px', color: adminTheme.colors.textSecondary }}>
                    <span>📦 Weight: <strong>{activePickup.totalEstimatedWeight} kg</strong></span>
                    <span>🗓️ Date: <strong>{activePickup.scheduledDate}</strong></span>
                    <span>⏰ Slot: <strong>{activePickup.scheduledTimeSlot}</strong></span>
                  </div>

                  {activePickup.rejectionReason && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '12px', color: '#991B1B' }}>
                      <AlertTriangle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      <strong>Previous Driver Rejection Comment:</strong> "{activePickup.rejectionReason}"
                    </div>
                  )}
                </div>

                {/* Collector Driver Selector */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: adminTheme.colors.textPrimary, marginBottom: '8px', display: 'block' }}>
                    Select Available Collector Driver
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                    {pickers.map((pk) => {
                      const isSelected = pk.id === selectedPickerId;
                      return (
                        <div
                          key={pk.id}
                          onClick={() => setSelectedPickerId(pk.id)}
                          style={{
                            padding: '14px',
                            borderRadius: adminTheme.borderRadius.md,
                            border: isSelected ? `2px solid ${adminTheme.colors.accent}` : `1px solid ${adminTheme.colors.border}`,
                            backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: adminTheme.colors.textPrimary }}>{pk.name}</div>
                            <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary, marginTop: '2px' }}>
                              🚚 Truck: <strong>{(pk as any).vehicleNumber || 'WP-5842'}</strong> | 📍 City: {pk.address?.city || 'Colombo'}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: adminTheme.colors.accent }}>⭐ {pk.rating || 4.9}</div>
                            <div style={{ fontSize: '11px', color: adminTheme.colors.textMuted }}>On Duty</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dispatch Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: adminTheme.colors.accent,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: adminTheme.borderRadius.md,
                    padding: '14px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '8px'
                  }}
                >
                  <Send size={18} />
                  <span>{submitting ? 'Dispatching Collector...' : 'Confirm Allocation & Push Notification'}</span>
                </button>
              </form>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: adminTheme.colors.textMuted }}>
                Select a pickup request from the left column to allocate a driver.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
