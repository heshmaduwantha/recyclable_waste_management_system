import { apiCall } from './api';
import { User } from '../../../shared/types';

export interface AdminCustomerData extends User {
  ecoRatingTag?: string;
  totalPoints?: number;
  completedPickups?: number;
  recycledKg?: number;
}

export const customerService = {
  getCustomers: () => apiCall<AdminCustomerData[]>('/admin/customers'),
};
