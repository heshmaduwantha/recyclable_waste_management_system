import { apiCall, apiPost } from './api';
import { PickupRequest } from '../../../shared/types';

export interface Tier { tierName: string; badgePillTxt: string; nextTierName: string; targetPoints: number; percentage: number }
export interface CustomerDashboard {
  user: { id: string; name: string; email: string; phone: string; avatarInitials: string };
  wallet: { totalPoints: number; cashEquivalentLkr: number; totalEarned: number; totalRedeemed: number };
  tier: Tier;
  stats: { recycledKg: number; completedPickups: number; cityRank: number | null };
  monthly: { weightKg: number; completed: number; pointsEarned: number; label: string };
  nextPickup: (PickupRequest & { pickerName?: string; pickerStatus?: string }) | null;
  unreadNotifications: number;
}
export interface WalletTxn { id: string; title: string; date: string; points: string; pointsValue: number; type: 'earn' | 'redeem'; icon: string }
export interface WalletSummary { totalPoints: number; cashEquivalentLkr: number }
export interface WalletStats { totalEarned: number; totalRedeemed: number; totalPickups: number }
export interface UserBadge { id: string; name: string; description: string; icon: string; isUnlocked: boolean; unlockedAt?: string; requiredRecycledKg: number; criteria?: string; perksAndMultipliers?: string; progressKg?: number }
export interface SavedAddress { id: string; title: string; street: string; city: string; isDefault: boolean }
export interface MaterialRate { id: string; category: string; materialName: string; pricePerKgLkr: number; pointsPerKg: number; icon: string }
export interface CustomerProfile {
  id: string; name: string; email: string; phone: string; recycledKg: number; completedPickups: number;
  cityRank: number | null; tierName: string; badgePillTxt: string;
}

export const customerService = {
  dashboard: () => apiCall<CustomerDashboard>('/customer/dashboard'),
  profile: () => apiCall<CustomerProfile>('/customer/profile'),
  updateProfile: (body: { name?: string; email?: string; phone?: string }) => apiPost('/customer/profile', body, 'PUT'),
  wallet: () => apiCall<WalletSummary>('/wallet'),
  walletStats: () => apiCall<WalletStats>('/wallet/stats'),
  transactions: (type?: 'earn' | 'redeem') => apiCall<WalletTxn[]>(`/wallet/transactions${type ? `?type=${type}` : ''}`),
  badges: () => apiCall<UserBadge[]>('/badges'),
  addresses: () => apiCall<SavedAddress[]>('/customer/addresses'),
  addAddress: (a: { title: string; street: string; city: string; isDefault?: boolean }) => apiPost<SavedAddress>('/customer/addresses', a),
  setDefaultAddress: (id: string) => apiPost(`/customer/addresses/${id}`, { isDefault: true }, 'PUT'),
  deleteAddress: (id: string) => apiCall(`/customer/addresses/${id}`, { method: 'DELETE' }),
  materialRates: () => apiCall<MaterialRate[]>('/materials/rates'),
};
