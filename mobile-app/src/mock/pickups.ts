import { PickupRequest } from '../../../shared/types';

export const mockPickupsList: PickupRequest[] = [
  {
    id: 'PU-8821',
    customerId: 'CUST-001',
    customerName: 'Kasun Perera',
    customerPhone: '+94 77 123 4567',
    pickerId: 'PICK-001',
    pickerName: 'Nuwan Fernando',
    items: [
      { category: 'plastic', estimatedWeightKg: 10, actualWeightKg: 12, pricePerKg: 40 },
      { category: 'paper', estimatedWeightKg: 5, actualWeightKg: 5, pricePerKg: 25 }
    ],
    totalEstimatedWeight: 15,
    totalActualWeight: 17,
    estimatedPoints: 300,
    earnedPoints: 340,
    status: 'in_progress',
    scheduledDate: '2026-08-06',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    address: { street: '15/A Havelock Road', city: 'Colombo 05', latitude: 6.891, longitude: 79.858 },
    createdAt: '2026-08-06T08:00:00Z'
  },
  {
    id: 'PU-8820',
    customerId: 'CUST-001',
    customerName: 'Kasun Perera',
    customerPhone: '+94 77 123 4567',
    pickerId: 'PICK-001',
    pickerName: 'Nuwan Fernando',
    items: [
      { category: 'metal', estimatedWeightKg: 20, actualWeightKg: 22, pricePerKg: 70 },
      { category: 'glass', estimatedWeightKg: 10, actualWeightKg: 10, pricePerKg: 15 }
    ],
    totalEstimatedWeight: 30,
    totalActualWeight: 32,
    estimatedPoints: 750,
    earnedPoints: 800,
    status: 'completed',
    scheduledDate: '2026-08-02',
    scheduledTimeSlot: '02:00 PM - 04:00 PM',
    address: { street: '15/A Havelock Road', city: 'Colombo 05', latitude: 6.891, longitude: 79.858 },
    createdAt: '2026-08-01T15:00:00Z',
    completedAt: '2026-08-02T15:30:00Z'
  }
];
