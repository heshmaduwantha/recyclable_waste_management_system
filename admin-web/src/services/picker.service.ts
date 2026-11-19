import { apiCall } from './api';
import { User } from '../../../shared/types';

export interface AdminPickerData extends User {
  jobsDone: number;
  activeJobs?: number;
  rating: number;
  vehicleNumber?: string;
  vehicleType?: string;
  isActive?: boolean;
}

export const pickerService = {
  getPickers: () => apiCall<AdminPickerData[]>('/admin/pickers'),
};
