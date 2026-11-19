import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Plus, MapPin, Calendar, Clock, X, AlertTriangle, UserCheck } from 'lucide-react';
import { pickupService } from '../../services/pickup.service';
import { pickerService, AdminPickerData } from '../../services/picker.service';
import { PickupRequest } from '../../../../shared/types';
import { apiCall } from '../../services/api';
import { customerService, AdminCustomerData } from '../../services/customer.service';

const tomorrowIso = () => new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export const Pickups: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [pickups, setPickups] = useState<any[]>([]);
  const [pickers, setPickers] = useState<AdminPickerData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [customers, setCustomers] = useState<AdminCustomerData[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(tomorrowIso());
  const [formError, setFormError] = useState<string | null>(null);
  const [category, setCategory] = useState('plastic');
  const [weightKg, setWeightKg] = useState<number>(10);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reassign Modal State
  const [reassignPickupId, setReassignPickupId] = useState<string | null>(null);
  const [selectedPickerId, setSelectedPickerId] = useState('');
  const [submittingReassign, setSubmittingReassign] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [pickupList, pickerList] = await Promise.all([
          pickupService.getPickups(),
          pickerService.getPickers()
        ]);
        if (isMounted) {
          setPickups(pickupList);
          setPickers(pickerList);
        }
      } catch (err) {
        console.error('Failed to load pickups:', err);
      }
    }
    loadData();
    customerService.getCustomers().then(list => isMounted && setCustomers(list)).catch(err => console.error(err));

    // Auto-poll for new mobile app pickup requests every 5s
    const timer = setInterval(() => {
      loadData();
    }, 5000);

    return () => { isMounted = false; clearInterval(timer); };
  }, []);

  const handleCreatePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newPickup = await apiCall<PickupRequest>('/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          items: [{ category, estimatedWeightKg: weightKg }],
          scheduledDate,
          scheduledTimeSlot: '10:00 AM - 12:00 PM',
          address: street ? { street, city } : undefined
        })
      });
      setPickups([newPickup, ...pickups]);
      setIsModalOpen(false);
      setFormError(null);
      setStreet('');
      setCity('');
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignPickupId) return;
    setSubmittingReassign(true);
    try {
      const chosenPicker = pickers.find(p => p.id === selectedPickerId) || pickers[0];
      await apiCall(`/admin/pickups/${reassignPickupId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickerId: chosenPicker?.id || 'PICK-001',
          pickerName: chosenPicker?.name || 'Suresh Kumar'
        })
      });

      setPickups(pickups.map(p => {
        if (p.id === reassignPickupId) {
          return {
            ...p,
            pickerId: chosenPicker?.id,
            pickerName: chosenPicker?.name,
            status: 'assigned',
            pickerStatus: 'assigned',
            rejectionReason: null
          };
        }
        return p;
      }));

      setReassignPickupId(null);
    } catch (err) {
      console.warn('Reassign error:', err);
    } finally {
      setSubmittingReassign(false);
    }
  };

  const filteredPickups = pickups.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return p.pickerStatus === 'rejected' || p.rejectionReason;
    return p.status === filter;
  });

  return (
    <>
      <Header title="Pickups Management" subtitle="Track, assign, and verify waste pickup jobs" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Actions bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'pending', 'in_progress', 'completed', 'flagged'].map((status) => (
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
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {status === 'flagged' && <AlertTriangle size={14} color={filter === 'flagged' ? '#FFFFFF' : '#EF4444'} />}
                <span>{status === 'flagged' ? 'Flagged / Rejected' : status.replace('_', ' ')}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
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
            }}
          >
            <Plus size={18} />
            <span>Create Pickup Request</span>
          </button>
        </div>

        {/* Pickups Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredPickups.map((pickup) => {
            const isRejected = pickup.pickerStatus === 'rejected' || !!pickup.rejectionReason;
            return (
              <div key={pickup.id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: adminTheme.borderRadius.lg,
                padding: '24px',
                border: isRejected ? '2px solid #EF4444' : `1px solid ${adminTheme.colors.border}`,
                boxShadow: adminTheme.shadows.sm,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
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
                      isRejected ? '#FEF2F2' :
                      pickup.status === 'completed' ? '#10B98115' :
                      pickup.status === 'in_progress' ? '#3B82F615' : '#F59E0B15',
                    color:
                      isRejected ? '#EF4444' :
                      pickup.status === 'completed' ? adminTheme.colors.accent :
                      pickup.status === 'in_progress' ? adminTheme.colors.accentBlue : '#F59E0B'
                  }}>
                    {isRejected ? '⚠️ Collector Rejected' : pickup.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: adminTheme.colors.textPrimary }}>{pickup.customerName}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: adminTheme.colors.textSecondary, marginTop: '4px' }}>
                    <MapPin size={14} color={adminTheme.colors.textMuted} />
                    <span>{pickup.address?.street}, {pickup.address?.city}</span>
                  </div>
                </div>

                {/* Rejection Reason Alert Box (Admin View Only) */}
                {isRejected && (
                  <div style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '12px',
                    color: '#991B1B'
                  }}>
                    <div style={{ fontWeight: 800, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={14} color="#DC2626" />
                      <span>Rejection Comment (Collector Review Only):</span>
                    </div>
                    <div>"{pickup.rejectionReason || pickup.rejection_reason || 'Vehicle breakdown / Capacity full'}"</div>
                  </div>
                )}

                <div style={{
                  backgroundColor: adminTheme.colors.background,
                  padding: '12px',
                  borderRadius: adminTheme.borderRadius.md,
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ color: adminTheme.colors.textMuted, fontSize: '11px', fontWeight: 600 }}>ASSIGNED DRIVER</div>
                    <div style={{ fontWeight: 600, color: pickup.pickerName ? adminTheme.colors.primary : adminTheme.colors.textMuted }}>
                      {pickup.pickerName || 'Unassigned'}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: adminTheme.colors.textMuted, fontSize: '11px', fontWeight: 600 }}>EST. WEIGHT</div>
                    <div style={{ fontWeight: 700, color: adminTheme.colors.accent }}>{pickup.totalEstimatedWeight} kg</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: `1px solid ${adminTheme.colors.border}`, fontSize: '12px', color: adminTheme.colors.textSecondary }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    <span>{pickup.scheduledDate}</span>
                  </div>

                  {isRejected ? (
                    <button
                      onClick={() => setReassignPickupId(pickup.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <UserCheck size={14} />
                      <span>Reassign Driver</span>
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      <span>{pickup.scheduledTimeSlot}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Create Pickup Modal */}
      {isModalOpen && (
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Create New Pickup Request</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleCreatePickup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Customer</label>
                <select required value={customerId} onChange={e => setCustomerId(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }}>
                  <option value="">Select a registered customer…</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Scheduled Date</label>
                <input required type="date" min={tomorrowIso()} value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Material Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }}>
                  <option value="plastic">Plastic (PET Bottles)</option>
                  <option value="paper">Paper & Cardboard</option>
                  <option value="glass">Glass Bottles & Jars</option>
                  <option value="metal">Metal & Steel Scrap</option>
                  <option value="e-waste">E-Waste & Electronics</option>
                  <option value="polythene">Polythene & Soft Plastics</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Estimated Weight (Kg)</label>
                <input required type="number" value={weightKg} onChange={e => setWeightKg(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Street Address (optional — defaults to customer's home)</label>
                <input value={street} onChange={e => setStreet(e.target.value)} placeholder="e.g. 15/A Havelock Road" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>City</label>
                <input required={!!street} value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Colombo 05" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>

              {formError && <div role="alert" style={{ color: '#DC2626', fontSize: '13px', fontWeight: 600 }}>⚠️ {formError}</div>}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}`, backgroundColor: '#F8FAFC', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: adminTheme.colors.accent, color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>{submitting ? 'Saving...' : 'Create Pickup Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Driver Modal */}
      {reassignPickupId && (
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Reassign Driver for {reassignPickupId}</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setReassignPickupId(null)} />
            </div>

            <form onSubmit={handleConfirmReassign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Select New Collector Driver</label>
                <select value={selectedPickerId} onChange={e => setSelectedPickerId(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }}>
                  {pickers.map(pk => (
                    <option key={pk.id} value={pk.id}>{pk.name} ({pk.phone}) - {pk.address?.city || 'Colombo'}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setReassignPickupId(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}`, backgroundColor: '#F8FAFC', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submittingReassign} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: adminTheme.colors.accent, color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>{submittingReassign ? 'Reassigning...' : 'Reassign Driver'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
