import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Extract developer host IP from Expo manifest if available
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.developer?.tool;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:4000/api/v1`;
    }
  }

  // Android Emulator default host mapping
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api/v1';
  }

  // iOS Simulator & Web
  return 'http://localhost:4000/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000
};
