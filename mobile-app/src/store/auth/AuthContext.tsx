import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../../../../shared/types';
import { mockCustomerUser, mockPickerUser } from '../../mock/users';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('customer');


  const login = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'customer') {
      setUser(mockCustomerUser);
    } else if (selectedRole === 'picker') {
      setUser(mockPickerUser);
    }
  };

  const switchRole = (selectedRole: UserRole) => {
    login(selectedRole);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAuthenticated: !!user,
      login,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
