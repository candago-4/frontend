import React, { createContext, useContext, useState, useCallback } from 'react';
import { deviceService, Device } from '@/services/deviceService';
import { useAuth } from './AuthContext';

interface DeviceContextType {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  fetchDevices: () => Promise<void>;
  addDevice: (name: string) => Promise<void>;
  updateDevice: (id: string, name: string) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await deviceService.getDevices(user.id);
      setDevices(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const addDevice = useCallback(async (name: string) => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      await deviceService.createDevice(user.id, name);
      await fetchDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add device');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchDevices]);

  const updateDevice = useCallback(async (id: string, name: string) => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      await deviceService.updateDevice(id, name, user.id);
      await fetchDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update device');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchDevices]);

  const deleteDevice = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deviceService.deleteDevice(id);
      await fetchDevices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete device');
    } finally {
      setIsLoading(false);
    }
  }, [fetchDevices]);

  return (
    <DeviceContext.Provider value={{ devices, isLoading, error, fetchDevices, addDevice, updateDevice, deleteDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};

export function useDevices() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error('useDevices must be used within a DeviceProvider');
  return ctx;
} 