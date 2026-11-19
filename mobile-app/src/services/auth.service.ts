import { apiPost } from './api';
import { User, UserRole } from '../../../shared/types';

export type AuthUser = User & { token: string; avatarInitials?: string; rating?: number; vehicleNumber?: string; vehicleType?: string };

export const authService = {
  login(email: string, password: string, role: UserRole): Promise<AuthUser> {
    return apiPost<AuthUser>('/auth/login', { email: email.trim(), password, role });
  },

  register(userData: Partial<User> & { password: string }): Promise<AuthUser> {
    return apiPost<AuthUser>('/auth/register', userData);
  },
};
