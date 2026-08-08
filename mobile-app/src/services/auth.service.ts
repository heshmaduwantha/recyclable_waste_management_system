import { apiCall } from './api';
import { User, UserRole } from '../../../shared/types';
import { mockCustomerUser, mockPickerUser } from '../mock/users';

export const authService = {
  async login(email: string, role: UserRole): Promise<User> {
    try {
      return await apiCall<User>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
    } catch {
      return role === 'customer' ? mockCustomerUser : mockPickerUser;
    }
  },

  async register(userData: Partial<User>): Promise<User> {
    try {
      return await apiCall<User>('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch {
      return {
        id: `USER-${Date.now()}`,
        name: userData.name || 'Kasun Perera',
        email: userData.email || 'kasun@gmail.com',
        phone: userData.phone || '+94 77 123 4567',
        role: userData.role || 'customer',
        createdAt: new Date().toISOString()
      };
    }
  }
};
