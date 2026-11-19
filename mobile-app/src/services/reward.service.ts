import { apiCall, apiPost } from './api';

export interface CatalogueReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: string;
  partnerName: string;
  icon: string;
  color: string;
  expiryDate: string;
}

export interface RedeemResult {
  success: boolean;
  redemptionId: string;
  reward: CatalogueReward;
  newBalance: number;
  cashEquivalentLkr: number;
}

export const rewardService = {
  getRewards: () => apiCall<CatalogueReward[]>('/rewards/catalogue'),
  redeem: (rewardId: string, mobileNumber: string) => apiPost<RedeemResult>('/wallet/redeem', { rewardId, mobileNumber }),
};
