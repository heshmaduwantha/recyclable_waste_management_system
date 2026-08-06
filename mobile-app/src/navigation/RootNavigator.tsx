import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../store/auth/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { CustomerTabs } from './CustomerTabs';
import { PickerTabs } from './PickerTabs';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : role === 'picker' ? (
        <PickerTabs />
      ) : (
        <CustomerTabs />
      )}
    </NavigationContainer>
  );
};
