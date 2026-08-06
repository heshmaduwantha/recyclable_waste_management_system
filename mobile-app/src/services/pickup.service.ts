import { PickupRequest } from '../../../shared/types';
import { mockPickupsList } from '../mock/pickups';

export const pickupService = {
  async fetchPickups(): Promise<PickupRequest[]> {
    await new Promise(res => setTimeout(res, 300));
    return mockPickupsList;
  },

  async requestPickup(data: Partial<PickupRequest>): Promise<PickupRequest> {
    await new Promise(res => setTimeout(res, 400));
    return {
      id: `PU-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'CUST-001',
      customerName: 'Kasun Perera',
      customerPhone: '+94 77 123 4567',
      items: data.items || [],
      totalEstimatedWeight: data.totalEstimatedWeight || 10,
      estimatedPoints: 200,
      status: 'pending',
      scheduledDate: data.scheduledDate || '2026-08-07',
      scheduledTimeSlot: data.scheduledTimeSlot || '09:00 AM - 11:00 AM',
      address: data.address || { street: '15/A Havelock Road', city: 'Colombo 05', latitude: 6.891, longitude: 79.858 },
      createdAt: new Date().toISOString()
    };
  }
};
