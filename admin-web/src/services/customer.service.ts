import { apiCall } from './api';
import { User } from '../../../shared/types';
import { mockCustomers } from '../mock/data';

export interface AdminCustomerData extends User {
  ecoRatingTag?: string;
}

export const customerService = {
  async getCustomers(): Promise<AdminCustomerData[]> {
    try {
      return await apiCall<AdminCustomerData[]>('/admin/customers');
    } catch {
      return mockCustomers.map((cust) => ({
        ...cust,
        ecoRatingTag: 'Level 3 Hero'
      }));
    }
  }
};
