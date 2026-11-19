import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole } from '../../../../shared/types';
import { AuthUser } from '../../services/auth.service';
import { session } from '../../services/session';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (selectedRole: UserRole, userObj: AuthUser) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole>('customer');

  const login = (selectedRole: UserRole, userObj: AuthUser) => {
    session.set(userObj.id, userObj.token);
    setRole(selectedRole);
    setUser(userObj);
  };

  const updateUser = (patch: Partial<AuthUser>) => setUser((u) => (u ? { ...u, ...patch } : u));

  const logout = () => {
    session.set(null);
    setUser(null);
  };

  useEffect(() => {
    session.onExpired(() => setUser(null));
    return () => session.onExpired(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, login, updateUser, logout }}>
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
