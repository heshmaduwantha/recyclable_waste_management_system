import { PickupRequest } from '../../../shared/types';
import { apiCall } from './api';

export const pickupService = {
  async fetchPickups(): Promise<PickupRequest[]> {
    try {
      const data = await apiCall<PickupRequest[]>('/pickups');
      return data;
    } catch {
      return [];
    }
  },

  async requestPickup(data: Partial<PickupRequest>): Promise<PickupRequest> {
    const payload = {
      customerId: data.customerId || 'CUST-001',
      customerName: data.customerName || 'Kasun Perera',
      customerPhone: data.customerPhone || '+94 77 123 4567',
      items: data.items || [],
      totalEstimatedWeight: data.totalEstimatedWeight || 10,
      estimatedPoints: (data.totalEstimatedWeight || 10) * 20,
      scheduledDate: data.scheduledDate || '2026-08-07',
      scheduledTimeSlot: data.scheduledTimeSlot || '09:00 AM - 11:00 AM',
      address: data.address || { street: '15/A Havelock Road', city: 'Colombo 05', latitude: 6.891, longitude: 79.858 }
    };

    try {
      const created = await apiCall<PickupRequest>('/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return created;
    } catch (err) {
      return {
        id: `PU-${Math.floor(1000 + Math.random() * 9000)}`,
        ...payload,
        status: 'pending',
        createdAt: new Date().toISOString()
      } as PickupRequest;
    }
  }
};
