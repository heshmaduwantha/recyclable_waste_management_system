import { PickupRequest } from '../../../shared/types';
import { apiCall, apiPost } from './api';

export const pickupService = {
  fetchPickups: () => apiCall<PickupRequest[]>('/pickups'),
  getPickup: (id: string) => apiCall<PickupRequest>(`/pickups/${id}`),
  requestPickup: (data: Partial<PickupRequest> & { notes?: string }) => apiPost<PickupRequest>('/pickups', data),
  cancel: (id: string) => apiPost(`/pickups/${id}/cancel`, undefined, 'PUT'),
};
