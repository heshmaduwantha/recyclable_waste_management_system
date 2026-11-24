import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, PickupProvider } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PickupProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </PickupProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
