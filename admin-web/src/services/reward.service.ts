import { apiCall } from './api';
import { Reward } from '../../../shared/types';

export const rewardService = {
  getRewards: () => apiCall<Reward[]>('/admin/rewards'),
  getRewardRates: () => apiCall<{ category: string; pointsPerKg: number }[]>('/admin/reward-rates'),
};
