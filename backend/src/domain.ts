import { z } from "zod";
export const categories = ["plastic", "glass", "polythene", "metal"] as const;
export const coordinates = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function requireCondition(
  ok: unknown,
  status: number,
  message: string,
): asserts ok {
  if (!ok) throw new HttpError(status, message);
}
// Haversine great-circle distance in metres; the server enforces the radius.
export function distanceMeters(a: number, b: number, c: number, d: number) {
  const r = Math.PI / 180;
  const x =
    Math.sin(((c - a) * r) / 2) ** 2 +
    Math.cos(a * r) * Math.cos(c * r) * Math.sin(((d - b) * r) / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
// Calculate from hundredths to avoid accumulating binary floating-point drift.
export function rewardPoints(weight: number, rate: number) {
  return (
    Math.round((Math.round(weight * 100) * Math.round(rate * 100)) / 100) / 100
  );
}
export const publicUser = (u: any) => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  email: u.email,
  role: u.role,
  address: u.address,
  latitude: u.latitude,
  longitude: u.longitude,
  active: u.active,
});
