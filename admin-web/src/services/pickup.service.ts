import { apiCall } from './api';
import { PickupRequest } from '../../../shared/types';

export const pickupService = {
  getPickups: () => apiCall<PickupRequest[]>('/admin/pickups'),
};
