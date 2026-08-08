import { apiCall } from './api';
import { PickupRequest } from '../../../shared/types';
import { mockPickups } from '../mock/data';

export const pickupService = {
  async getPickups(): Promise<PickupRequest[]> {
    try {
      return await apiCall<PickupRequest[]>('/admin/pickups');
    } catch {
      return mockPickups;
    }
  }
};
