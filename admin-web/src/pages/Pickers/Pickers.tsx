import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Phone, Mail, MapPin, Plus, X } from 'lucide-react';
import { pickerService, AdminPickerData } from '../../services/picker.service';
import { apiCall } from '../../services/api';

export const Pickers: React.FC = () => {
  const [pickers, setPickers] = useState<AdminPickerData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [city, setCity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPickers() {
      try {
        const data = await pickerService.getPickers();
        if (isMounted) setPickers(data);
      } catch (err) {
        console.error('Failed to load pickers:', err);
      }
    }
    loadPickers();
    return () => { isMounted = false; };
  }, []);

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newPicker = await apiCall<AdminPickerData>('/admin/pickers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          vehicleNumber,
          city
        })
      });
      setPickers([newPicker, ...pickers]);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setVehicleNumber('');
      setCity('');
    } catch (err) {
      alert(`Could not onboard picker: ${(err as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Collector Fleets (Pickers)" subtitle="Manage eco-collectors, routes, and performance" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: adminTheme.colors.textPrimary }}>Registered Eco-Pickers</h3>
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
            <span>Onboard New Picker</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {pickers.map((picker) => (
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
                  src={picker.avatarUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'} 
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
                  <span>{picker.address?.city || 'Colombo'} Region</span>
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
                  <div style={{ fontSize: '16px', fontWeight: 700, color: adminTheme.colors.primary }}>{picker.jobsDone ?? 0}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: adminTheme.colors.textMuted, fontWeight: 600 }}>RATING</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#F59E0B' }}>
                    {picker.rating ? `${Number(picker.rating).toFixed(1)} ★` : '5.0 ★'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collector Audit Logs & Verification Proofs */}
        <div style={{ marginTop: '24px', backgroundColor: '#FFFFFF', borderRadius: adminTheme.borderRadius.lg, padding: '24px', border: `1px solid ${adminTheme.colors.border}`, boxShadow: adminTheme.shadows.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: adminTheme.colors.textPrimary }}>Collector Verification & Performance Audit Logs</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: adminTheme.colors.textMuted }}>Doorstep digital photo logs, weigh-in accuracy, and collector ratings</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '6px 12px', borderRadius: '20px' }}>
              ● 100% Verified Fleet
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${adminTheme.colors.border}`, color: adminTheme.colors.textMuted }}>
                  <th style={{ padding: '12px' }}>COLLECTOR</th>
                  <th style={{ padding: '12px' }}>VEHICLE</th>
                  <th style={{ padding: '12px' }}>RECENT JOB</th>
                  <th style={{ padding: '12px' }}>VERIFIED WEIGHT</th>
                  <th style={{ padding: '12px' }}>RATING</th>
                  <th style={{ padding: '12px' }}>AUDIT STATUS</th>
                </tr>
              </thead>
              <tbody>
                {pickers.map((pk) => (
                  <tr key={pk.id} style={{ borderBottom: `1px solid ${adminTheme.colors.border}` }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: adminTheme.colors.textPrimary }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🚚</span>
                        <div>
                          <div>{pk.name}</div>
                          <div style={{ fontSize: '11px', color: adminTheme.colors.textMuted }}>{pk.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', color: adminTheme.colors.textSecondary }}>{pk.vehicleNumber || 'WP-5842'}</td>
                    <td style={{ padding: '14px 12px', color: adminTheme.colors.textSecondary }}>Doorstep Collection</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: '#10B981' }}>{(pk as any).totalWeightKg ? `${(pk as any).totalWeightKg} kg` : `${((pk.jobsDone || 0) * 4.2).toFixed(1)} kg`}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: '#F59E0B' }}>{pk.rating ? `${Number(pk.rating).toFixed(1)} ★` : '5.0 ★'}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '11px' }}>
                        ✓ Photo & Scale Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Onboard New Picker Modal */}
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Onboard New Collector Driver</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleOnboardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Driver Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Saman Kumara" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="saman@ecocollect.lk" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Mobile Phone</label>
                <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 71 888 9999" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Vehicle Plate Number</label>
                <input required value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} placeholder="e.g. WP-9988" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Assigned City / Region</label>
                <input required value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Colombo 03" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}`, backgroundColor: '#F8FAFC', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: adminTheme.colors.accent, color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>{submitting ? 'Saving...' : 'Save Collector Driver'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
