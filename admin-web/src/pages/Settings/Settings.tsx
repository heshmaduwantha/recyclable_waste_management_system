import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Scale, Award, Bell, Plus, Save } from 'lucide-react';
import { apiCall } from '../../services/api';

export interface MaterialRateItem {
  id: string;
  category: string;
  materialName: string;
  pricePerKgLkr: number;
  pointsPerKg: number;
  icon: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredRecycledKg: number;
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'badges' | 'notifications'>('materials');

  // 1. Materials State
  const [materials, setMaterials] = useState<MaterialRateItem[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatKey, setNewCatKey] = useState('');
  const [newCatPrice, setNewCatPrice] = useState<number>(50);
  const [newCatPoints, setNewCatPoints] = useState<number>(20);
  const [newCatIcon, setNewCatIcon] = useState('♻️');

  // 2. Badges State
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [badgeName, setBadgeName] = useState('');
  const [badgeDesc, setBadgeDesc] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('🎖️');
  const [badgeReqKg, setBadgeReqKg] = useState<number>(25);

  // 3. Notifications State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSentStatus, setNotifSentStatus] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [mRates, bList] = await Promise.all([
        apiCall<MaterialRateItem[]>('/materials/rates'),
        apiCall<BadgeItem[]>('/badges')
      ]);
      setMaterials(mRates);
      setBadges(bList);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }

  // Add New Material Category
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await apiCall<MaterialRateItem>('/materials/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCatKey || newCatName.toLowerCase().replace(/\s+/g, '-'),
          materialName: newCatName,
          pricePerKgLkr: newCatPrice,
          pointsPerKg: newCatPoints,
          icon: newCatIcon
        })
      });
      setMaterials([...materials, created]);
      setNewCatName('');
      setNewCatKey('');
    } catch (err) {
      alert(`Could not add material: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add New Badge
  const handleAddBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await apiCall<BadgeItem>('/admin/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: badgeName,
          description: badgeDesc,
          icon: badgeIcon,
          requiredRecycledKg: badgeReqKg
        })
      });
      setBadges([...badges, created]);
      setBadgeName('');
      setBadgeDesc('');
    } catch (err) {
      alert(`Could not add badge: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Broadcast Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sent = await apiCall<{ recipients: number }>('/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage
        })
      });
      setNotifSentStatus(`Notification broadcast to ${sent.recipients} customers!`);
      setNotifTitle('');
      setNotifMessage('');
      setTimeout(() => setNotifSentStatus(null), 4000);
    } catch (err) {
      alert(`Could not send notification: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Admin Configuration Hub" subtitle="Manage material prices, badges, and push system notifications" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: `2px solid ${adminTheme.colors.border}`, paddingBottom: '12px' }}>
          {[
            { id: 'materials', label: 'Material Costs & Unit Prices', icon: Scale },
            { id: 'badges', label: 'Eco Badges & Achievements', icon: Award },
            { id: 'notifications', label: 'System Push Notifications', icon: Bell }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: isActive ? adminTheme.colors.primary : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : adminTheme.colors.textSecondary,
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Material Costs & Rates */}
        {activeTab === 'materials' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: adminTheme.borderRadius.lg, padding: '24px', border: `1px solid ${adminTheme.colors.border}` }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800 }}>Active Material Categories</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${adminTheme.colors.border}` }}>
                    <th style={{ padding: '10px' }}>Category</th>
                    <th style={{ padding: '10px' }}>LKR / Kg</th>
                    <th style={{ padding: '10px' }}>Eco Points / Kg</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(m => (
                    <tr key={m.id} style={{ borderBottom: `1px solid ${adminTheme.colors.border}` }}>
                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                        <span style={{ marginRight: '8px' }}>{m.icon}</span> {m.materialName}
                      </td>
                      <td style={{ padding: '12px 10px', color: adminTheme.colors.accent, fontWeight: 700 }}>LKR {m.pricePerKgLkr}</td>
                      <td style={{ padding: '12px 10px', color: '#D97706', fontWeight: 700 }}>⭐ {m.pointsPerKg} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: adminTheme.borderRadius.lg, padding: '24px', border: `1px solid ${adminTheme.colors.border}` }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800 }}>Add New Material</h3>
              <form onSubmit={handleAddMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Material Name</label>
                  <input required value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Copper Wire Scrap" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Price Per Kg (LKR)</label>
                  <input required type="number" value={newCatPrice} onChange={e => setNewCatPrice(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Eco Points Per Kg</label>
                  <input required type="number" value={newCatPoints} onChange={e => setNewCatPoints(parseInt(e.target.value, 10) || 0)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Icon Emoji</label>
                  <input value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder="e.g. ⚙️" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
                </div>

                <button type="submit" disabled={loading} style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: adminTheme.colors.accent, color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={16} style={{ display: 'inline', marginRight: '6px' }} /> Save Material Category
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: Eco Badges */}
        {activeTab === 'badges' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: adminTheme.borderRadius.lg, padding: '24px', border: `1px solid ${adminTheme.colors.border}` }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800 }}>Active Eco Badges</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {badges.map(b => (
                  <div key={b.id} style={{ border: `1px solid ${adminTheme.colors.border}`, borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '32px' }}>{b.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: adminTheme.colors.primary }}>{b.name}</div>
                      <div style={{ fontSize: '12px', color: adminTheme.colors.textSecondary }}>{b.description}</div>
                      <div style={{ fontSize: '11px', color: adminTheme.colors.accent, fontWeight: 700, marginTop: '4px' }}>Target: {b.requiredRecycledKg} kg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: adminTheme.borderRadius.lg, padding: '24px', border: `1px solid ${adminTheme.colors.border}` }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 800 }}>Create New Eco Badge</h3>
              <form onSubmit={handleAddBadge} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Badge Title</label>
                  <input required value={badgeName} onChange={e => setBadgeName(e.target.value)} placeholder="e.g. Glass Master" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Description</label>
                  <input required value={badgeDesc} onChange={e => setBadgeDesc(e.target.value)} placeholder="e.g. Recycled 50kg of glass bottles" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Required Recycled Kg</label>
                  <input required type="number" value={badgeReqKg} onChange={e => setBadgeReqKg(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Icon Emoji</label>
                  <input value={badgeIcon} onChange={e => setBadgeIcon(e.target.value)} placeholder="e.g. 🏆" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
                </div>

                <button type="submit" disabled={loading} style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: adminTheme.colors.accent, color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={16} style={{ display: 'inline', marginRight: '6px' }} /> Save Eco Badge
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: Notifications */}
        {activeTab === 'notifications' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: adminTheme.borderRadius.lg, padding: '32px', maxWidth: '640px', border: `1px solid ${adminTheme.colors.border}` }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800 }}>Broadcast Push System Notification</h3>
            <p style={{ fontSize: '13px', color: adminTheme.colors.textSecondary, marginBottom: '24px' }}>Send real-time activity and promotion alerts to mobile app users</p>

            {notifSentStatus && (
              <div style={{ padding: '12px', backgroundColor: '#ECFDF5', color: '#059669', borderRadius: '8px', fontWeight: 700, marginBottom: '16px' }}>
                ✓ {notifSentStatus}
              </div>
            )}

            <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Notification Header Title</label>
                <input required value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="e.g. 🌟 Bonus Eco Points Day!" style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Message Content</label>
                <textarea required rows={4} value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="Earn 2x Eco Points on all paper recycling collections scheduled today!" style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}`, fontFamily: 'inherit' }} />
              </div>

              <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: adminTheme.colors.primary, color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Bell size={18} />
                <span>Broadcast Notification to Mobile App</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  );
};
