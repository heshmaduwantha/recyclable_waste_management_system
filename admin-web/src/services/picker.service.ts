import { apiCall } from './api';
import { User } from '../../../shared/types';
import { mockPickers } from '../mock/data';

export interface AdminPickerData extends User {
  jobsDone: number;
  rating: number;
}

export const pickerService = {
  async getPickers(): Promise<AdminPickerData[]> {
    try {
      return await apiCall<AdminPickerData[]>('/admin/pickers');
    } catch {
      return mockPickers.map((p) => ({
        ...p,
        jobsDone: 128,
        rating: 4.9
      }));
    }
  }
};
