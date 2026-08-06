import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { CustomerHome } from '../screens/customer/Home/Home';
import { CustomerPickup } from '../screens/customer/Pickup/Pickup';
import { CustomerTracking } from '../screens/customer/Tracking/Tracking';
import { CustomerWallet } from '../screens/customer/Wallet/Wallet';
import { CustomerRewards } from '../screens/customer/Rewards/Rewards';
import { CustomerHistory } from '../screens/customer/History/History';
import { CustomerNotification } from '../screens/customer/Notification/Notification';
import { CustomerProfile } from '../screens/customer/Profile/Profile';

import { CustomerPickupDetails } from '../screens/customer/PickupDetails/PickupDetails';
import { CustomerPickupSuccess } from '../screens/customer/PickupSuccess/PickupSuccess';
import { CustomerRewardSuccess } from '../screens/customer/RewardSuccess/RewardSuccess';
import { CustomerBadgeDetails } from '../screens/customer/BadgeDetails/BadgeDetails';
import { CustomerEditProfile } from '../screens/customer/EditProfile/EditProfile';
import { CustomerSettings } from '../screens/customer/Settings/Settings';
import { CustomerSavedAddresses } from '../screens/customer/SavedAddresses/SavedAddresses';
import { HelpSupport } from '../screens/shared/HelpSupport/HelpSupport';
import { AboutApp } from '../screens/shared/AboutApp/AboutApp';
import { Feedback } from '../screens/shared/Feedback/Feedback';
import { ErrorScreen } from '../screens/shared/ErrorScreen/ErrorScreen';
import { EmptyStateScreen } from '../screens/shared/EmptyStateScreen/EmptyStateScreen';
import { SkeletonLoading } from '../screens/shared/SkeletonLoading/SkeletonLoading';

import { AIScanner } from '../screens/customer/AIScanner/AIScanner';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={CustomerHome} />
    <Stack.Screen name="AIScanner" component={AIScanner} />
    <Stack.Screen name="CustomerPickup" component={CustomerPickup} />
    <Stack.Screen name="CustomerTracking" component={CustomerTracking} />
    <Stack.Screen name="CustomerRewards" component={CustomerRewards} />
    <Stack.Screen name="Notification" component={CustomerNotification} />
    <Stack.Screen name="CustomerNotification" component={CustomerNotification} />
    <Stack.Screen name="History" component={CustomerHistory} />
    <Stack.Screen name="PickupDetails" component={CustomerPickupDetails} />
    <Stack.Screen name="PickupSuccess" component={CustomerPickupSuccess} />
    <Stack.Screen name="RewardSuccess" component={CustomerRewardSuccess} />
    <Stack.Screen name="BadgeDetails" component={CustomerBadgeDetails} />
    <Stack.Screen name="EditProfile" component={CustomerEditProfile} />
    <Stack.Screen name="Settings" component={CustomerSettings} />
    <Stack.Screen name="SavedAddresses" component={CustomerSavedAddresses} />
    <Stack.Screen name="HelpSupport" component={HelpSupport} />
    <Stack.Screen name="AboutApp" component={AboutApp} />
    <Stack.Screen name="Feedback" component={Feedback} />
    <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
    <Stack.Screen name="EmptyStateScreen" component={EmptyStateScreen} />
    <Stack.Screen name="SkeletonLoading" component={SkeletonLoading} />
  </Stack.Navigator>
);



export const CustomerTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#10B981', // Clean Emerald Green
        tabBarInactiveTintColor: '#94A3B8', // Mono Slate Gray
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.05,
          shadowRadius: 8
        },
        tabBarIcon: ({ color, focused, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'RequestsTab') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="RequestsTab" component={CustomerPickup} options={{ title: 'Pickup' }} />
      <Tab.Screen name="Wallet" component={CustomerWallet} options={{ title: 'Wallet' }} />
      <Tab.Screen name="Profile" component={CustomerProfile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};


