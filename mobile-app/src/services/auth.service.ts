import { User, UserRole } from '../../../shared/types';
import { mockCustomerUser, mockPickerUser } from '../mock/users';

export const authService = {
  async login(email: string, role: UserRole): Promise<User> {
    // Simulated API response delay
    await new Promise(res => setTimeout(res, 400));
    return role === 'customer' ? mockCustomerUser : mockPickerUser;
  },

  async register(userData: Partial<User>): Promise<User> {
    await new Promise(res => setTimeout(res, 400));
    return {
      id: `USER-${Date.now()}`,
      name: userData.name || 'New Eco User',
      email: userData.email || 'user@example.com',
      phone: userData.phone || '+94 77 000 0000',
      role: userData.role || 'customer',
      createdAt: new Date().toISOString()
    };
  }
};
