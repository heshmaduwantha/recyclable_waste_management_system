import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Splash } from '../screens/auth/Splash/Splash';
import { Onboarding } from '../screens/auth/Onboarding/Onboarding';
import { Login } from '../screens/auth/Login/Login';
import { Register } from '../screens/auth/Register/Register';
import { OTP } from '../screens/auth/OTP/OTP';
import { ForgotPassword } from '../screens/auth/ForgotPassword/ForgotPassword';
import { ResetPasswordSuccess } from '../screens/auth/ResetPasswordSuccess/ResetPasswordSuccess';
import { CameraPermission } from '../screens/auth/CameraPermission/CameraPermission';

const Stack = createNativeStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPasswordSuccess" component={ResetPasswordSuccess} />
      <Stack.Screen name="CameraPermission" component={CameraPermission} />
    </Stack.Navigator>
  );
};


