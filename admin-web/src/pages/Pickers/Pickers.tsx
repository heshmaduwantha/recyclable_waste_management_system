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
      const data = await pickerService.getPickers();
      if (isMounted) {
        setPickers(data);
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
          name: name || 'Saman Kumara',
          email: email || 'saman@ecocollect.lk',
          phone: phone || '+94 71 888 9999',
          vehicleNumber: vehicleNumber || 'WP-9988',
          city: city || 'Colombo 03'
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
      console.warn('Onboarding error:', err);
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
                  <div style={{ fontSize: '16px', fontWeight: 700, color: adminTheme.colors.primary }}>{picker.jobsDone || 128}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: adminTheme.colors.textMuted, fontWeight: 600 }}>RATING</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#F59E0B' }}>{picker.rating || 4.9} ★</div>
                </div>
              </div>
            </div>
          ))}
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
