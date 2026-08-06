import { User, PickupRequest, Reward } from '../../../shared/types';

export const mockStats = {
  totalPickups: 1420,
  activePickers: 38,
  totalCustomers: 5890,
  wasteCollectedKg: 42850,
  recycledRate: '94.2%',
  ecoPointsIssued: 857000
};

export const mockPickups: PickupRequest[] = [
  {
    id: 'PU-1001',
    customerId: 'CUST-01',
    customerName: 'Kasun Perera',
    customerPhone: '+94 77 123 4567',
    pickerId: 'PICK-01',
    pickerName: 'Nuwan Fernando',
    items: [
      { category: 'plastic', estimatedWeightKg: 12, actualWeightKg: 13.5, pricePerKg: 40 },
      { category: 'paper', estimatedWeightKg: 8, actualWeightKg: 8, pricePerKg: 25 }
    ],
    totalEstimatedWeight: 20,
    totalActualWeight: 21.5,
    estimatedPoints: 400,
    earnedPoints: 430,
    status: 'completed',
    scheduledDate: '2026-08-06',
    scheduledTimeSlot: '09:00 AM - 11:00 AM',
    address: { street: '15/A Havelock Road', city: 'Colombo 05', latitude: 6.891, longitude: 79.858 },
    createdAt: '2026-08-05T14:30:00Z',
    completedAt: '2026-08-06T10:15:00Z'
  },
  {
    id: 'PU-1002',
    customerId: 'CUST-02',
    customerName: 'Dilini Jayawardena',
    customerPhone: '+94 71 987 6543',
    pickerId: 'PICK-02',
    pickerName: 'Saman Kumara',
    items: [
      { category: 'e-waste', estimatedWeightKg: 5, pricePerKg: 100 },
      { category: 'metal', estimatedWeightKg: 15, pricePerKg: 70 }
    ],
    totalEstimatedWeight: 20,
    estimatedPoints: 650,
    status: 'in_progress',
    scheduledDate: '2026-08-06',
    scheduledTimeSlot: '11:00 AM - 01:00 PM',
    address: { street: '42 Baseline Road', city: 'Colombo 09', latitude: 6.918, longitude: 79.877 },
    createdAt: '2026-08-06T07:10:00Z'
  },
  {
    id: 'PU-1003',
    customerId: 'CUST-03',
    customerName: 'Mahesh Wickramasinghe',
    customerPhone: '+94 76 555 1234',
    items: [
      { category: 'glass', estimatedWeightKg: 10, pricePerKg: 15 },
      { category: 'plastic', estimatedWeightKg: 5, pricePerKg: 40 }
    ],
    totalEstimatedWeight: 15,
    estimatedPoints: 220,
    status: 'pending',
    scheduledDate: '2026-08-07',
    scheduledTimeSlot: '02:00 PM - 04:00 PM',
    address: { street: '88 Galle Road', city: 'Dehiwala', latitude: 6.852, longitude: 79.865 },
    createdAt: '2026-08-06T08:00:00Z'
  }
];

export const mockPickers: User[] = [
  {
    id: 'PICK-01',
    name: 'Nuwan Fernando',
    email: 'nuwan.f@ecocollect.lk',
    phone: '+94 77 333 4444',
    role: 'picker',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    address: { street: 'Main St', city: 'Colombo 03', zipCode: '00300' },
    createdAt: '2025-11-10T00:00:00Z'
  },
  {
    id: 'PICK-02',
    name: 'Saman Kumara',
    email: 'saman.k@ecocollect.lk',
    phone: '+94 71 888 9999',
    role: 'picker',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    address: { street: 'High Level Rd', city: 'Nugegoda', zipCode: '10250' },
    createdAt: '2026-01-15T00:00:00Z'
  }
];

export const mockCustomers: User[] = [
  {
    id: 'CUST-01',
    name: 'Kasun Perera',
    email: 'kasun.perera@gmail.com',
    phone: '+94 77 123 4567',
    role: 'customer',
    address: { street: '15/A Havelock Road', city: 'Colombo 05', zipCode: '00500' },
    createdAt: '2025-10-01T00:00:00Z'
  },
  {
    id: 'CUST-02',
    name: 'Dilini Jayawardena',
    email: 'dilini.j@gmail.com',
    phone: '+94 71 987 6543',
    role: 'customer',
    address: { street: '42 Baseline Road', city: 'Colombo 09', zipCode: '00900' },
    createdAt: '2026-02-12T00:00:00Z'
  }
];

export const mockRewardsList: Reward[] = [
  {
    id: 'REW-01',
    title: 'LKR 500 Supermarket Voucher',
    description: 'Valid at Cargills Food City islandwide',
    pointsRequired: 500,
    category: 'voucher',
    partnerName: 'Cargills Food City',
    expiryDate: '2026-12-31'
  },
  {
    id: 'REW-02',
    title: 'Reusable Eco-Tote Bag Set',
    description: 'Set of 3 organic cotton bags',
    pointsRequired: 350,
    category: 'eco_product',
    partnerName: 'EcoLife LK',
    expiryDate: '2026-10-30'
  },
  {
    id: 'REW-03',
    title: 'Plant 5 Trees Donation',
    description: 'We will plant 5 native trees in your name',
    pointsRequired: 200,
    category: 'donation',
    partnerName: 'Forest Trust LK',
    expiryDate: '2027-01-01'
  }
];
