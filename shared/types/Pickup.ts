export type WasteCategory = 'plastic' | 'paper' | 'metal' | 'glass' | 'e-waste' | 'organic' | 'polythene';

export type PickupStatus = 
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface WasteItem {
  category: WasteCategory;
  estimatedWeightKg: number;
  actualWeightKg?: number;
  pricePerKg: number;
  photoUrl?: string;
}

export interface PickupRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickerId?: string;
  pickerName?: string;
  items: WasteItem[];
  totalEstimatedWeight: number;
  totalActualWeight?: number;
  estimatedPoints: number;
  earnedPoints?: number;
  status: PickupStatus;
  scheduledDate: string;
  scheduledTimeSlot: string;
  address: {
    street: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  notes?: string;
  createdAt: string;
  completedAt?: string;
}
