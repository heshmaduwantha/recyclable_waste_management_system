import { Platform } from "react-native";
import Constants from "expo-constants";
import { api } from "./api";
// Native FCM tokens require an installed development/production build and Firebase configuration.
export async function registerPush() {
  if (Platform.OS === "web" || Constants.appOwnership === "expo") return null;
  const config = await api("/config");
  if (!config.pushConfigured) return null;
  const Notifications = await import("expo-notifications");
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("default", {
      name: "Collection jobs",
      importance: Notifications.AndroidImportance.HIGH,
    });
  const permission = await Notifications.requestPermissionsAsync();
  if (permission.status !== "granted") return null;
  const token = await Notifications.getDevicePushTokenAsync();
  if (Platform.OS !== "android") return null;
  await api("/devices", { token: token.data });
  return token.data as string;
}
