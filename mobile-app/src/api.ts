import { Platform } from "react-native";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
const host =
  Constants.expoConfig?.hostUri?.split(":")[0] ||
  (Platform.OS === "web" ? globalThis.location?.hostname : "localhost") ||
  "localhost";
export const base =
  process.env.EXPO_PUBLIC_API_URL || `http://${host}:4000/api/v1`;
let token = "";
let expired = () => {};
export const onExpired = (fn: () => void) => {
  expired = fn;
};
export async function session(value?: string) {
  if (value !== undefined) {
    token = value;
    if (Platform.OS === "web") {
      value
        ? sessionStorage.setItem("eco-token", value)
        : sessionStorage.removeItem("eco-token");
    } else {
      value
        ? await SecureStore.setItemAsync("eco-token", value)
        : await SecureStore.deleteItemAsync("eco-token");
    }
    return value;
  }
  token =
    Platform.OS === "web"
      ? sessionStorage.getItem("eco-token") || ""
      : (await SecureStore.getItemAsync("eco-token")) || "";
  return token;
}
export async function api<T = any>(
  path: string,
  body?: any,
  method = body ? "POST" : "GET",
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const form = body instanceof FormData;
    const r = await fetch(base + path, {
      method,
      headers: {
        ...(body && !form ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? (form ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal,
    });
    const d = await r.json();
    if (!r.ok) {
      if (r.status === 401 && !path.startsWith("/auth/")) expired();
      throw Error(d.error || "Request failed.");
    }
    return d;
  } catch (e: any) {
    if (e.name === "AbortError")
      throw Error("The request timed out. Check your connection and retry.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
export const evidenceSource = (id: string) => ({
  uri: base + "/evidence/" + id,
  headers: { Authorization: `Bearer ${token}` },
});
