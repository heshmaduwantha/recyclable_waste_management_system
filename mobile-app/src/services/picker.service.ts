import { apiCall, apiPost } from './api';
import { PickupRequest } from '../../../shared/types';

export type PickerJob = PickupRequest & {
  customer: string;
  addressText: string;
  details: string;
  jobStatus: 'Assigned' | 'Accepted';
  pickerStatus: string;
};
export type PickerHistoryItem = PickupRequest & { categories: string; completedLabel: string; pickerCommissionLkr: number };
export interface PickerStats {
  rating: number; vehicleNumber: string; vehicleType: string;
  totalJobsDone: number; totalKg: number; totalEarningsLkr: number; onTimeRate: number; activeJobs: number;
  week: { jobs: number; kg: number; earningsLkr: number };
  today: { jobs: number; kg: number; earningsLkr: number };
  daily: { date: string; label: string; jobs: number; kg: number; earningsLkr: number }[];
}
export interface CompleteResult { earnedPoints: number; actualWeightKg: number; commissionLkr: number }

export const pickerService = {
  jobs: () => apiCall<PickerJob[]>('/picker/jobs'),
  accept: (id: string) => apiPost(`/picker/jobs/${id}/accept`, undefined, 'PUT'),
  reject: (id: string, reason: string) => apiPost(`/picker/jobs/${id}/reject`, { reason }, 'PUT'),
  complete: (id: string, actualWeightKg: number, verificationPhoto?: string) =>
    apiPost<CompleteResult>(`/picker/jobs/${id}/complete`, { actualWeightKg, verificationPhoto }, 'PUT'),
  history: () => apiCall<PickerHistoryItem[]>('/picker/history'),
  stats: () => apiCall<PickerStats>('/picker/stats'),
};

export const formatLkr = (n: number) => `LKR ${Math.round(n).toLocaleString()}`;
