import React, { createContext, useContext, useEffect, useState } from 'react';
import { PickupRequest } from '../../../../shared/types';
import { pickupService } from '../../services/pickup.service';
import { useAuth } from '../auth/AuthContext';

interface PickupContextType {
  pickups: PickupRequest[];
  createPickup: (pickup: Partial<PickupRequest>) => Promise<void>;
  updateStatus: (pickupId: string, status: PickupRequest['status'], actualWeight?: number) => void;
  refreshPickups: () => Promise<void>;
}

const PickupContext = createContext<PickupContextType | undefined>(undefined);

export const PickupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);

  useEffect(() => {
    refreshPickups();
  }, []);

  const refreshPickups = async () => {
    try {
      const data = await pickupService.fetchPickups();
      setPickups(data);
    } catch (err) {
      console.warn('Failed to load pickups:', err);
    }
  };

  const createPickup = async (newPickupData: Partial<PickupRequest>) => {
    const customerName = user?.name || 'Kasun Perera';
    const customerPhone = user?.phone || '+94 77 123 4567';

    const payload = {
      ...newPickupData,
      customerName,
      customerPhone
    };

    const created = await pickupService.requestPickup(payload);
    setPickups(prev => [created, ...prev]);
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
    <PickupContext.Provider value={{ pickups, createPickup, updateStatus, refreshPickups }}>
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
