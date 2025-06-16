import { API_URL } from '@/constants/config';

export interface Metric {
  id: string;
  device_id: string;
  latitude: number;
  longitude: number;
  speed: number;
  datetime: string;
}

export const metricsService = {
  async getMetrics(deviceId: string): Promise<Metric[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/deviceStats?deviceId=${deviceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // Return empty array if no data found
      }
      throw new Error('Failed to fetch metrics');
    }

    return response.json();
  },
}; 