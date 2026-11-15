export type Role = "admin" | "customer" | "picker";
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  address: string;
  latitude: number | null;
  longitude: number | null;
  active: boolean;
}
export interface Material {
  category: string;
  name: string;
  points_per_kg: string;
}
export interface Item {
  category: string;
  estimated_weight: string;
  actual_weight: string | null;
  rate_snapshot: string | null;
  points: string | null;
}
export interface Pickup {
  id: string;
  customer_id: string;
  picker_id: string | null;
  customer_name: string;
  customer_phone: string;
  picker_name: string | null;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  items: Item[];
  evidence: { id: string; mime_type: string }[];
  notes: string;
  earned_points: string;
  created_at: string;
  completed_at: string | null;
  review_reason?: string;
  review_note?: string;
  distance_meters?: number;
}
export interface Badge {
  id: string;
  name: string;
  criterion: string;
  threshold: string;
  description: string;
  awarded_at: string | null;
}
export interface Wallet {
  balance: number;
  weight: number;
  collections: number;
  transactions: {
    id: string;
    pickup_id: string;
    points: string;
    created_at: string;
    items: Item[];
  }[];
}
export interface Notice {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  pickup_id: string;
}
export const statusLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
