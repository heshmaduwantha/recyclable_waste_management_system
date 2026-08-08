import { apiCall } from './api';
import { Reward } from '../../../shared/types';
import { mockRewardsList } from '../mock/data';

export const rewardService = {
  async getRewards(): Promise<Reward[]> {
    try {
      return await apiCall<Reward[]>('/admin/rewards');
    } catch {
      return mockRewardsList;
    }
  },

  async getRewardRates(): Promise<{ category: string; pointsPerKg: number }[]> {
    try {
      return await apiCall<{ category: string; pointsPerKg: number }[]>('/admin/reward-rates');
    } catch {
      return [
        { category: 'plastic', pointsPerKg: 50 },
        { category: 'paper', pointsPerKg: 25 },
        { category: 'metal', pointsPerKg: 70 },
        { category: 'glass', pointsPerKg: 15 },
        { category: 'e-waste', pointsPerKg: 100 }
      ];
    }
  }
};
