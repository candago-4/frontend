import { Container } from '@/components/ui/Container';
import { TabBarIcon } from '@/components/ui/IconSymbol';
import { WebMap } from '@/components/WebMap';
import { useDevices } from '@/contexts/DeviceContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { dashboardService } from '@/services/dashboardService';
import React, { useCallback, useEffect, useState } from 'react';

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

// Default coordinates for São Paulo (will be used as fallback)
const DEFAULT_LOCATION = {
  latitude: -23.29495040178083,
  longitude: -45.96673651375307, 
};

// Refresh interval in milliseconds (30 seconds)
const REFRESH_INTERVAL = 30000;

interface DeviceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  speed?: number;
  lastUpdate?: string;
}

export default function MapScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { devices, isLoading, error, fetchDevices } = useDevices();
  const [deviceLocations, setDeviceLocations] = useState<DeviceLocation[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Fetch locations for all devices using dashboard metrics
  const fetchAllDeviceLocations = useCallback(async () => {
    setIsLoadingMetrics(true);
    setMetricsError(null);
    try {
      const locations: DeviceLocation[] = [];
      
      // Fetch location for each device using dashboard service
      for (const device of devices) {
        try {
          const metrics = await dashboardService.getMetrics(device.id);
          if (metrics.latestPosition) {
            const location = {
              id: device.id,
              name: device.name,
              latitude: metrics.latestPosition.latitude,
              longitude: metrics.latestPosition.longitude,
              speed: metrics.mediaVelocidade,
              lastUpdate: metrics.latestPosition.datetime
            };
            locations.push(location);
            console.log(`Device ${device.name} location updated:`, location);
          } else {
            console.log(`No latest position for device ${device.name}`);
          }
        } catch (err) {
          console.error(`Error fetching location for device ${device.id}:`, err);
          // Continue with other devices even if one fails
        }
      }
      
      console.log('All device locations updated:', locations);
      setDeviceLocations(locations);
    } catch (err) {
      setMetricsError(err instanceof Error ? err.message : 'Failed to fetch device locations');
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [devices]);

  // Initial devices fetch
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Fetch locations when devices change
  useEffect(() => {
    if (devices.length > 0) {
      fetchAllDeviceLocations();
    }
  }, [devices, fetchAllDeviceLocations]);

  // Set up periodic refresh
  useEffect(() => {
    if (devices.length === 0) return;

    const refreshInterval = setInterval(() => {
      fetchAllDeviceLocations();
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [devices, fetchAllDeviceLocations]);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsDropdownOpen(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Container style={styles.mapContainer}>
        <Text style={styles.title}>Mapa</Text>
        
        <View style={styles.dropdownContainer}>
          <Pressable 
            style={styles.dropdown}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownText}>
              {selectedDevice 
                ? `${devices.find(d => d.id === selectedDevice)?.name || selectedDevice}`
                : 'Selecione um dispositivo'
              }
            </Text>
            <TabBarIcon 
              name={isDropdownOpen ? "arrow-drop-up" : "arrow-drop-down"} 
              color="#9747FF" 
              size={24} 
            />
          </Pressable>

          {isDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {devices.map((device) => (
                <Pressable
                  key={device.id}
                  style={styles.dropdownItem}
                  onPress={() => handleDeviceSelect(device.id)}
                >
                  <Text style={styles.dropdownItemText}>
                    {device.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {isLoadingMetrics ? (
          <View style={[styles.mapWrapper, styles.centered]}>
            <ActivityIndicator size="large" color="#9747FF" />
          </View>
        ) : metricsError ? (
          <View style={[styles.mapWrapper, styles.centered]}>
            <Text style={styles.errorText}>{metricsError}</Text>
          </View>
        ) : (
          <View style={styles.mapWrapper}>
            <WebMap 
              devices={deviceLocations}
              selectedDeviceId={selectedDevice}
            />
            {selectedDevice && (
              <View style={styles.deviceInfoContainer}>
                {(() => {
                  const device = deviceLocations.find(d => d.id === selectedDevice);
                  if (!device) return null;
                  
                  return (
                    <>
                      <View style={styles.deviceInfoRow}>
                        <Text style={styles.deviceInfoLabel}>Device:</Text>
                        <Text style={styles.deviceInfoValue}>{device.name}</Text>
                      </View>
                      <View style={styles.deviceInfoRow}>
                        <Text style={styles.deviceInfoLabel}>Speed:</Text>
                        <Text style={styles.deviceInfoValue}>
                          {device.speed ? `${device.speed.toFixed(1)} km/h` : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.deviceInfoRow}>
                        <Text style={styles.deviceInfoLabel}>Location:</Text>
                        <Text style={styles.deviceInfoValue}>
                          {device.latitude.toFixed(6)}, {device.longitude.toFixed(6)}
                        </Text>
                      </View>
                      <View style={styles.deviceInfoRow}>
                        <Text style={styles.deviceInfoLabel}>Last Update:</Text>
                        <Text style={styles.deviceInfoValue}>
                          {device.lastUpdate ? new Date(device.lastUpdate).toLocaleString() : 'N/A'}
                        </Text>
                      </View>
                    </>
                  );
                })()}
              </View>
            )}
          </View>
        )}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mapContainer: {
    flex: 1,
    gap: 16,
    position: 'relative',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    zIndex: 1000,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  dropdownText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#242038',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9747FF',
    marginTop: 4,
    elevation: 5, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(151, 71, 255, 0.3)',
  },
  dropdownItemText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4747',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  lastUpdateContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  lastUpdateText: {
    color: '#F7ECE1',
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  deviceInfoContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deviceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfoLabel: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.8,
  },
  deviceInfoValue: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
}); 