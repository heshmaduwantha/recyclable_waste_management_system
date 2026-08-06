import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { PickerHome } from '../screens/picker/Home/Home';
import { PickerJobs } from '../screens/picker/Jobs/Jobs';
import { PickerJobDetails } from '../screens/picker/JobDetails/JobDetails';
import { PickerWeight } from '../screens/picker/Weight/Weight';
import { PickerCamera } from '../screens/picker/Camera/Camera';
import { PickerGPS } from '../screens/picker/GPS/GPS';
import { PickerHistory } from '../screens/picker/History/History';
import { PickerProfile } from '../screens/picker/Profile/Profile';

import { PickerCameraUpload } from '../screens/picker/CameraUpload/CameraUpload';
import { PickerCollectionSuccess } from '../screens/picker/CollectionSuccess/CollectionSuccess';
import { PickerEarnings } from '../screens/picker/Earnings/Earnings';
import { PickerVehicleDetails } from '../screens/picker/VehicleDetails/VehicleDetails';
import { PickerShiftSummary } from '../screens/picker/ShiftSummary/ShiftSummary';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PickerHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PickerHomeMain" component={PickerHome} />
    <Stack.Screen name="PickerJobs" component={PickerJobs} />
    <Stack.Screen name="PickerJobDetails" component={PickerJobDetails} />
    <Stack.Screen name="PickerWeight" component={PickerWeight} />
    <Stack.Screen name="PickerCamera" component={PickerCamera} />
    <Stack.Screen name="PickerGPS" component={PickerGPS} />
    <Stack.Screen name="CameraUpload" component={PickerCameraUpload} />
    <Stack.Screen name="CollectionSuccess" component={PickerCollectionSuccess} />
    <Stack.Screen name="Earnings" component={PickerEarnings} />
    <Stack.Screen name="VehicleDetails" component={PickerVehicleDetails} />
    <Stack.Screen name="ShiftSummary" component={PickerShiftSummary} />
  </Stack.Navigator>
);


export const PickerTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0284C7',
        tabBarInactiveTintColor: '#94A3B8',
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
        tabBarIcon: ({ color, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'navigate-outline';
          if (route.name === 'PickerHomeTab') {
            iconName = focused ? 'navigate' : 'navigate-outline';
          } else if (route.name === 'PickerJobsTab') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'PickerHistoryTab') {
            iconName = focused ? 'archive' : 'archive-outline';
          } else if (route.name === 'PickerProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        }
      })}
    >
      <Tab.Screen name="PickerHomeTab" component={PickerHomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="PickerJobsTab" component={PickerJobs} options={{ title: 'Jobs' }} />
      <Tab.Screen name="PickerHistoryTab" component={PickerHistory} options={{ title: 'History' }} />
      <Tab.Screen name="PickerProfileTab" component={PickerProfile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};


