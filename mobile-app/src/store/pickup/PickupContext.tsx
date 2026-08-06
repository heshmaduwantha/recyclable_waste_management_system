import React, { createContext, useContext, useState } from 'react';
import { PickupRequest } from '../../../../shared/types';
import { mockPickupsList } from '../../mock/pickups';

interface PickupContextType {
  pickups: PickupRequest[];
  createPickup: (pickup: Partial<PickupRequest>) => void;
  updateStatus: (pickupId: string, status: PickupRequest['status'], actualWeight?: number) => void;
}

const PickupContext = createContext<PickupContextType | undefined>(undefined);

export const PickupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pickups, setPickups] = useState<PickupRequest[]>(mockPickupsList);

  const createPickup = (newPickupData: Partial<PickupRequest>) => {
    const newPickup: PickupRequest = {
      id: `PU-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'CUST-001',
      customerName: 'Kasun Perera',
      customerPhone: '+94 77 123 4567',
      items: newPickupData.items || [],
      totalEstimatedWeight: newPickupData.totalEstimatedWeight || 10,
      estimatedPoints: (newPickupData.totalEstimatedWeight || 10) * 20,
      status: 'pending',
      scheduledDate: newPickupData.scheduledDate || '2026-08-07',
      scheduledTimeSlot: newPickupData.scheduledTimeSlot || '09:00 AM - 11:00 AM',
      address: newPickupData.address || { street: '15/A Havelock Road', city: 'Colombo 05', latitude: 6.891, longitude: 79.858 },
      createdAt: new Date().toISOString()
    };

    setPickups(prev => [newPickup, ...prev]);
  };

  const updateStatus = (pickupId: string, status: PickupRequest['status'], actualWeight?: number) => {
    setPickups(prev => prev.map(item => {
      if (item.id === pickupId) {
        return {
          ...item,
          status,
          totalActualWeight: actualWeight || item.totalEstimatedWeight,
          earnedPoints: (actualWeight || item.totalEstimatedWeight) * 20,
          completedAt: status === 'completed' ? new Date().toISOString() : item.completedAt
        };
      }
      return item;
    }));
  };

  return (
    <PickupContext.Provider value={{ pickups, createPickup, updateStatus }}>
      {children}
    </PickupContext.Provider>
  );
};

export const usePickup = () => {
  const context = useContext(PickupContext);
  if (!context) {
    throw new Error('usePickup must be used within a PickupProvider');
  }
  return context;
};
