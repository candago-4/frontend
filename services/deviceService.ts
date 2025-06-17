import { API_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Device {
  id: string;
  name: string;
  user_id: string;
}

export const deviceService = {
  async getDevices(user_id: string | number): Promise<Device[]> {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_URL}/api/devices?user_id=${user_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    return response.json();
  },

  async createDevice(user_id: string | number, name: string): Promise<void> {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_URL}/api/devices?user_id=${user_id}&name=${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to create device');
    }
  },

  async updateDevice(id: string, name: string, user_id: string | number): Promise<void> {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_URL}/api/devices`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name, user_id }),
    });
    if (!response.ok) {
      throw new Error('Failed to update device');
    }
  },

  async deleteDevice(id: string): Promise<void> {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_URL}/api/devices?id=${Number(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete device');
    }
  },
}; 