// app/(tabs)/index.tsx
import { Container } from '@/components/ui/Container';
import { TabBarIcon } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { dashboardService, DashboardMetrics } from '@/services/dashboardService';
import { router } from 'expo-router';
import { useDevices } from '@/contexts/DeviceContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const { devices, isLoading, error, fetchDevices } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      fetchMetrics(selectedDevice);
    } else {
      setMetrics(null);
    }
  }, [selectedDevice]);

  const fetchMetrics = async (deviceId: string) => {
    try {
      setIsLoadingMetrics(true);
      const fetchedMetrics = await dashboardService.getMetrics(deviceId);
      setMetrics(fetchedMetrics);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      Alert.alert('Error', 'Failed to fetch device metrics. Please try again later.');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const renderMetricCard = (label: string, value: number | string, isRed?: boolean) => (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, isRed && styles.redValue]}>
        {value}
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  const handleExport = () => {
    if (!selectedDevice || !metrics) {
      Alert.alert('Error', 'Please select a device first');
      return;
    }
    // TODO: Implement export logic
    console.log('Export pressed for device:', selectedDevice);
  };

  const handleAddDevice = () => {
    // Use modal or navigation as needed
    Alert.alert('Add Device', 'Use the device modal or list screen to add a device.');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Container style={styles.content}>
          <Text style={styles.title}>Loading...</Text>
          <ActivityIndicator size="large" color="#9747FF" />
        </Container>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Container style={styles.content}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable 
            style={styles.retryButton}
            onPress={fetchDevices}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </Container>
      </View>
    );
  }

  if (devices.length === 0) {
    // Show popup when there are no devices
    Alert.alert(
      "Welcome to LynchArea!",
      "You don't have any devices yet. Would you like to add your first device?",
      [
        {
          text: "Not Now",
          style: "cancel"
        },
        {
          text: "Add Device",
          onPress: handleAddDevice
        }
      ]
    );

    return (
      <View style={styles.container}>
        <Container style={styles.content}>
          <Text style={styles.title}>Welcome to Lynch Area</Text>
          <Text style={styles.noDevicesText}>
            Add your first device to start tracking metrics and monitoring your equipment.
          </Text>
          <Pressable 
            style={styles.addDeviceButton}
            onPress={handleAddDevice}
          >
            <Text style={styles.addDeviceButtonText}>Add Your First Device</Text>
          </Pressable>
        </Container>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Container style={styles.content}>
        <Text style={styles.title}>Welcome, {user?.name}</Text>
        
        <View style={styles.dropdownContainer}>
          <Pressable 
            style={styles.dropdown}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownText}>
              {selectedDevice 
                ? `${devices.find(d => d.id === selectedDevice)?.name} || ${selectedDevice}`
                : 'Select a device'
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
                  onPress={() => {
                    setSelectedDevice(device.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {device.name} || {device.id}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {isLoadingMetrics ? (
          <View style={styles.metricsContainer}>
            <ActivityIndicator size="large" color="#9747FF" />
          </View>
        ) : metrics ? (
          <View style={styles.metricsContainer}>
            {renderMetricCard('Metros Percorridos', metrics.metrosPercorridos)}
            {renderMetricCard('Media de Metros/Dia', metrics.mediaMetrosDia)}
            {renderMetricCard('Media de Velocidade', metrics.mediaVelocidade)}
            {renderMetricCard('Provabilidade de Down Time', 
              `${(metrics.downTimeProbability * 100).toFixed(1)}%`, 
              true
            )}
          </View>
        ) : (
          <View style={styles.metricsContainer}>
            <Text style={styles.noMetricsText}>No metrics available for this device</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.exportButton,
              pressed && styles.exportButtonPressed,
              (!selectedDevice || !metrics) && styles.exportButtonDisabled
            ]}
            onPress={handleExport}
            disabled={!selectedDevice || !metrics}
          >
            <Text style={styles.exportText}>Export</Text>
          </Pressable>

          <Text style={styles.version}>Version 1.0</Text>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
  },
  dropdownContainer: {
    zIndex: 1,
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
  metricsContainer: {
    gap: 16,
  },
  metricCard: {
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9747FF',
    fontFamily: 'SpaceMono',
  },
  redValue: {
    color: '#F04438',
  },
  metricLabel: {
    fontSize: 14,
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    gap: 8,
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#9747FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  exportButtonPressed: {
    opacity: 0.8,
  },
  exportText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#F04438',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
  version: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.7,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#9747FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  noDevicesText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 16,
  },
  noMetricsText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    opacity: 0.8,
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  addDeviceButton: {
    backgroundColor: '#9747FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  addDeviceButtonText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
});