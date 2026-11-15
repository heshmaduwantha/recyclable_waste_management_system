import * as Location from "expo-location";
import { Linking } from "react-native";
export async function locate() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted")
    throw Error(
      "Allow location permission to capture the collection location.",
    );
  const p = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  if (p.coords.accuracy === null)
    throw Error("GPS accuracy is unavailable. Please try outdoors.");
  return {
    latitude: p.coords.latitude,
    longitude: p.coords.longitude,
    accuracy: p.coords.accuracy,
  };
}
export async function navigate(latitude: number, longitude: number) {
  await Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate`,
  );
}
