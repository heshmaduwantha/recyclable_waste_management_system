import { User } from '../../../shared/types';

export const mockCustomerUser: User = {
  id: 'CUST-001',
  name: 'Kasun Perera',
  email: 'kasun@gmail.com',
  phone: '+94 77 123 4567',
  role: 'customer',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  address: {
    street: '15/A Havelock Road',
    city: 'Colombo 05',
    zipCode: '00500',
    latitude: 6.891,
    longitude: 79.858
  },
  createdAt: '2025-10-01T00:00:00Z'
};

export const mockPickerUser: User = {
  id: 'PICK-001',
  name: 'Nuwan Fernando',
  email: 'nuwan@ecocollect.lk',
  phone: '+94 77 333 4444',
  role: 'picker',
  avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  address: {
    street: 'Main Street',
    city: 'Colombo 03',
    zipCode: '00300'
  },
  createdAt: '2025-11-10T00:00:00Z'
};
