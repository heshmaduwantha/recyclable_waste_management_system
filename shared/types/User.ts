export type UserRole = 'customer' | 'picker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: string;
}
