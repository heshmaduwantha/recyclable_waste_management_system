import React, { createContext, useContext, useEffect, useState } from 'react';
import { PickupRequest } from '../../../../shared/types';
import { pickupService } from '../../services/pickup.service';
import { useAuth } from '../auth/AuthContext';
import { PickerJob } from '../../services/picker.service';

interface PickupContextType {
  pickups: PickupRequest[];
  lastCreated: PickupRequest | null;
  activeJob: PickerJob | null;
  setActiveJob: (job: PickerJob | null) => void;
  createPickup: (pickup: Partial<PickupRequest>) => Promise<PickupRequest>;
  refreshPickups: () => Promise<void>;
}

const PickupContext = createContext<PickupContextType | undefined>(undefined);

export const PickupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [lastCreated, setLastCreated] = useState<PickupRequest | null>(null);
  const [activeJob, setActiveJob] = useState<PickerJob | null>(null);

  useEffect(() => {
    setPickups([]);
    setActiveJob(null);
    if (user) refreshPickups();
  }, [user?.id]);

  const refreshPickups = async () => {
    try {
      setPickups(await pickupService.fetchPickups());
    } catch (err) {
      console.warn('Failed to load pickups:', (err as Error).message);
    }
  };

  const createPickup = async (newPickupData: Partial<PickupRequest>) => {
    const created = await pickupService.requestPickup(newPickupData);
    setPickups((prev) => [created, ...prev]);
    setLastCreated(created);
    return created;
  };

  return (
    <PickupContext.Provider value={{ pickups, lastCreated, activeJob, setActiveJob, createPickup, refreshPickups }}>
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
