import { API_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DashboardMetrics {
  metrosPercorridos: number;
  mediaMetrosDia: number;
  mediaVelocidade: number;
  downTimeProbability: number;
  latestPosition?: {
    latitude: number;
    longitude: number;
    datetime: string;
  };
}

export const dashboardService = {
  async getMetrics(deviceId: string): Promise<DashboardMetrics> {
    const token = await AsyncStorage.getItem('token');
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
        // Return default values if no data found
        return {
          metrosPercorridos: 0,
          mediaMetrosDia: 0,
          mediaVelocidade: 0,
          downTimeProbability: 0,
        };
      }
      throw new Error('Failed to fetch dashboard metrics');
    }

    const data = await response.json();
    
    // Convert the backend response to our frontend metrics format
    return {
      metrosPercorridos: data.totalDistance * 1000, // Convert km to meters
      mediaMetrosDia: data.averageDistancePerDay * 1000, // Convert km to meters
      mediaVelocidade: data.averageSpeed,
      downTimeProbability: data.downtimeProbability / 100, // Convert percentage to decimal
      latestPosition: data.resultPosition || undefined,
    };
  },

  calculateMetrics(data: any[]): DashboardMetrics {
    if (!data || data.length === 0) {
      return {
        metrosPercorridos: 0,
        mediaMetrosDia: 0,
        mediaVelocidade: 0,
        downTimeProbability: 0,
      };
    }

    // Calculate total distance (in meters)
    let totalDistance = 0;
    let totalSpeed = 0;
    let downTimeCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group data by day for daily average
    const dailyDistances = new Map<string, number>();

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      
      // Calculate distance between points using Haversine formula
      const distance = this.calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
      
      totalDistance += distance;
      totalSpeed += curr.speed;

      // Check for downtime (speed = 0)
      if (curr.speed === 0) {
        downTimeCount++;
      }

      // Group by day for daily average
      const date = new Date(curr.datetime);
      const dateKey = date.toISOString().split('T')[0];
      dailyDistances.set(dateKey, (dailyDistances.get(dateKey) || 0) + distance);
    }

    // Calculate averages
    const avgSpeed = totalSpeed / data.length;
    const downTimeProbability = downTimeCount / data.length;

    // Calculate daily average
    let totalDailyDistance = 0;
    dailyDistances.forEach(distance => {
      totalDailyDistance += distance;
    });
    const avgDailyDistance = totalDailyDistance / dailyDistances.size;

    return {
      metrosPercorridos: Math.round(totalDistance),
      mediaMetrosDia: Math.round(avgDailyDistance),
      mediaVelocidade: Number(avgSpeed.toFixed(1)),
      downTimeProbability: Number(downTimeProbability.toFixed(2)),
    };
  },

  // Haversine formula to calculate distance between two points
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },
}; 