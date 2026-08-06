import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminTheme } from '../../theme/admin';
import { Recycle, Lock, Mail, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ecocollect.lk');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '420px',
      backgroundColor: '#FFFFFF',
      borderRadius: adminTheme.borderRadius.lg,
      padding: '40px',
      boxShadow: adminTheme.shadows.lg,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          backgroundColor: adminTheme.colors.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          margin: '0 auto 16px auto'
        }}>
          <Recycle size={32} />
        </div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: adminTheme.colors.primary }}>EcoCollect Admin</h2>
        <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: adminTheme.colors.textSecondary }}>Sign in to manage waste management operations</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: adminTheme.colors.textPrimary }}>Email Address</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: `1px solid ${adminTheme.colors.border}`,
            borderRadius: adminTheme.borderRadius.md,
            padding: '10px 14px'
          }}>
            <Mail size={18} color={adminTheme.colors.textMuted} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: adminTheme.colors.textPrimary }}>Password</label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: `1px solid ${adminTheme.colors.border}`,
            borderRadius: adminTheme.borderRadius.md,
            padding: '10px 14px'
          }}>
            <Lock size={18} color={adminTheme.colors.textMuted} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
              required
            />
          </div>
        </div>

        <button type="submit" style={{
          marginTop: '8px',
          backgroundColor: adminTheme.colors.primary,
          color: '#FFFFFF',
          border: 'none',
          borderRadius: adminTheme.borderRadius.md,
          padding: '14px',
          fontWeight: 700,
          fontSize: '15px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span>Sign In to Dashboard</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};
