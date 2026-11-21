import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { adminTheme } from '../../theme/admin';
import { Plus, Edit2, Save, Scale, X } from 'lucide-react';
import { rewardService } from '../../services/reward.service';
import { Reward } from '../../../../shared/types';
import { apiCall } from '../../services/api';

export interface MaterialRateItem {
  id: string;
  category: string;
  materialName: string;
  pricePerKgLkr: number;
  pointsPerKg: number;
  icon: string;
}

export const Rewards: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [materialRates, setMaterialRates] = useState<MaterialRateItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editPoints, setEditPoints] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  // Voucher Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsRequired, setPointsRequired] = useState<number>(100);
  const [partnerName, setPartnerName] = useState('');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [submittingVoucher, setSubmittingVoucher] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [rewardsList, ratesList] = await Promise.all([
          rewardService.getRewards(),
          fetchMaterialRates()
        ]);
        if (isMounted) {
          setRewards(rewardsList);
          setMaterialRates(ratesList);
        }
      } catch (err) {
        console.error('Failed to load rewards:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  async function fetchMaterialRates(): Promise<MaterialRateItem[]> {
    return apiCall<MaterialRateItem[]>('/materials/rates');
  }

  const handleStartEdit = (rate: MaterialRateItem) => {
    setEditingId(rate.id);
    setEditPrice(rate.pricePerKgLkr);
    setEditPoints(rate.pointsPerKg);
  };

  const handleSaveRate = async (id: string) => {
    setSaving(true);
    try {
      await apiCall(`/materials/rates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pricePerKgLkr: editPrice,
          pointsPerKg: editPoints
        })
      });
      setMaterialRates(materialRates.map(m => m.id === id ? { ...m, pricePerKgLkr: editPrice, pointsPerKg: editPoints } : m));
    } catch (err) {
      alert(`Could not update rate: ${(err as Error).message}`);
    } finally {
      setSaving(false);
      setEditingId(null);
    }
  };

  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingVoucher(true);
    try {
      const newReward = await apiCall<Reward>('/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          pointsRequired,
          partnerName,
          expiryDate: expiryDate || undefined
        })
      });
      setRewards([newReward, ...rewards]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setPartnerName('');
    } catch (err) {
      alert(`Could not create reward: ${(err as Error).message}`);
    } finally {
      setSubmittingVoucher(false);
    }
  };

  return (
    <>
      <Header title="Rewards & Material Unit Prices" subtitle="Configure material unit prices per 1kg and manage eco-rewards store" />

      <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Material Unit Prices Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: adminTheme.borderRadius.lg,
          padding: '28px',
          border: `1px solid ${adminTheme.colors.border}`,
          boxShadow: adminTheme.shadows.sm
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color={adminTheme.colors.accent} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: adminTheme.colors.textPrimary }}>
                  Material Unit Pricing Schedule (Per 1 Kg)
                </h3>
              </div>
              <span style={{ fontSize: '13px', color: adminTheme.colors.textSecondary, marginTop: '2px', display: 'block' }}>
                Live active payout rates per 1kg for glass, plastic, paper, metal and e-waste
              </span>
            </div>

            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: adminTheme.colors.accent,
              backgroundColor: '#10B98115',
              padding: '6px 14px',
              borderRadius: '20px'
            }}>
              ● Live Pricing Active
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${adminTheme.colors.border}`, color: adminTheme.colors.textSecondary }}>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Material Name</th>
                <th style={{ padding: '12px 16px' }}>Price per 1kg (LKR)</th>
                <th style={{ padding: '12px 16px' }}>Eco Points per 1kg</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materialRates.map((rate) => (
                <tr key={rate.id} style={{ borderBottom: `1px solid ${adminTheme.colors.border}` }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: adminTheme.colors.primary }}>
                    <span style={{ fontSize: '18px', marginRight: '8px' }}>{rate.icon}</span>
                    <span style={{ textTransform: 'capitalize' }}>{rate.category}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{rate.materialName}</td>
                  
                  <td style={{ padding: '14px 16px' }}>
                    {editingId === rate.id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                        style={{
                          width: '100px',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: `1.5px solid ${adminTheme.colors.accent}`,
                          fontWeight: 700
                        }}
                      />
                    ) : (
                      <span style={{ fontWeight: 800, color: adminTheme.colors.primary }}>LKR {rate.pricePerKgLkr} / kg</span>
                    )}
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    {editingId === rate.id ? (
                      <input
                        type="number"
                        value={editPoints}
                        onChange={(e) => setEditPoints(parseInt(e.target.value, 10) || 0)}
                        style={{
                          width: '100px',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: `1.5px solid ${adminTheme.colors.accentYellow}`,
                          fontWeight: 700
                        }}
                      />
                    ) : (
                      <span style={{ fontWeight: 800, color: '#D97706' }}>⭐ {rate.pointsPerKg} pts / kg</span>
                    )}
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {editingId === rate.id ? (
                      <button
                        onClick={() => handleSaveRate(rate.id)}
                        disabled={saving}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: adminTheme.colors.accent,
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: adminTheme.borderRadius.md,
                          padding: '8px 14px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Save size={14} />
                        <span>Save Rate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(rate)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#F1F5F9',
                          color: adminTheme.colors.primary,
                          border: 'none',
                          borderRadius: adminTheme.borderRadius.md,
                          padding: '8px 14px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Edit2 size={14} />
                        <span>Edit Unit Price</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Active Catalog Rewards Store */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: adminTheme.colors.textPrimary }}>Active Catalog Rewards Vouchers</h3>
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
              <span>Add Reward Voucher</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {rewards.map((reward) => (
              <div key={reward.id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: adminTheme.borderRadius.lg,
                padding: '24px',
                border: `1px solid ${adminTheme.colors.border}`,
                boxShadow: adminTheme.shadows.sm,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: adminTheme.colors.accentBlue, backgroundColor: '#2563EB15', padding: '4px 10px', borderRadius: '12px' }}>
                    {reward.partnerName}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>
                    {reward.pointsRequired} Points
                  </span>
                </div>

                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: adminTheme.colors.textPrimary }}>{reward.title}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: adminTheme.colors.textSecondary }}>{reward.description}</p>
                </div>

                <div style={{ fontSize: '12px', color: adminTheme.colors.textMuted, borderTop: `1px solid ${adminTheme.colors.border}`, paddingTop: '10px' }}>
                  Expires on: {reward.expiryDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Reward Voucher Modal */}
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Add New Reward Voucher</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleAddVoucher} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Voucher Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Dialog LKR 250 Reload" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Description</label>
                <input required value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Instant airtime reload for Dialog numbers" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Points Required</label>
                <input required type="number" value={pointsRequired} onChange={e => setPointsRequired(parseInt(e.target.value, 10) || 0)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Partner Company Name</label>
                <input required value={partnerName} onChange={e => setPartnerName(e.target.value)} placeholder="e.g. Dialog Axiata PLC" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Expiry Date</label>
                <input required value={expiryDate} onChange={e => setExpiryDate(e.target.value)} placeholder="2026-12-31" style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}` }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${adminTheme.colors.border}`, backgroundColor: '#F8FAFC', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submittingVoucher} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: adminTheme.colors.accent, color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>{submittingVoucher ? 'Saving...' : 'Create Reward Voucher'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
