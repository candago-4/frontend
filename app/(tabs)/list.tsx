import { Container } from '@/components/ui/Container';
import { TabBarIcon } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { metricsService, Metric } from '@/services/metricsService';
import { useAuth } from '@/contexts/AuthContext';
import { useDevices } from '@/contexts/DeviceContext';

interface DeviceFormData {
  name: string;
}

export default function ListScreen() {
  const { user } = useAuth();
  const { devices, isLoading, error, fetchDevices, addDevice, updateDevice, deleteDevice } = useDevices();
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWelcomeModalVisible, setIsWelcomeModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeviceFormData>({ name: '' });
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      fetchMetrics(selectedDevice);
    } else {
      setMetrics([]);
    }
  }, [selectedDevice]);

  useEffect(() => {
    // Show welcome modal if user has no devices
    if (!isLoading && devices.length === 0) {
      setIsWelcomeModalVisible(true);
    }
  }, [isLoading, devices]);

  const fetchMetrics = async (deviceId: string) => {
    try {
      setIsLoadingMetrics(true);
      const fetchedMetrics = await metricsService.getMetrics(deviceId);
      setMetrics(fetchedMetrics);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      Alert.alert('Error', 'Failed to fetch device metrics. Please try again later.');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsDropdownOpen(false);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({ name: '' });
    setIsModalVisible(true);
    setIsWelcomeModalVisible(false); // Close welcome modal if open
  };

  const openEditModal = (device: any) => {
    setIsEditing(true);
    setFormData({ name: device.name });
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && selectedDevice) {
        await updateDevice(selectedDevice, formData.name);
        Alert.alert('Success', 'Device updated successfully');
      } else {
        await addDevice(formData.name);
        Alert.alert('Success', 'Device created successfully');
      }
      setIsModalVisible(false);
      fetchDevices(); // Refresh the list
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to save device'
      );
    }
  };

  const handleDelete = async (deviceId: string) => {
    Alert.alert(
      'Delete Device',
      'Are you sure you want to delete this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoadingDelete(true);
              await deleteDevice(deviceId);
              if (selectedDevice === deviceId) {
                setSelectedDevice(null);
              }
              fetchDevices(); // Refresh the list
            } catch (err) {
              console.log('Delete error:', err);
              Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to delete device'
              );
            } finally {
              setIsLoadingDelete(false);
            }
          },
        },
      ]
    );
  };

  const renderMetrics = () => {
    if (!selectedDevice) return null;

    if (isLoadingMetrics) {
      return (
        <View style={styles.metricsContainer}>
          <ActivityIndicator size="large" color="#9747FF" />
        </View>
      );
    }

    if (!metrics || metrics.length === 0) {
      return (
        <View style={styles.metricsContainer}>
          <Text style={styles.noMetricsText}>No metrics available for this device</Text>
        </View>
      );
    }

    // Get the latest metric
    const latestMetric = metrics[metrics.length - 1];
    if (!latestMetric) {
      return (
        <View style={styles.metricsContainer}>
          <Text style={styles.noMetricsText}>Error loading latest metrics</Text>
        </View>
      );
    }

    return (
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsTitle}>Latest Metrics</Text>
        <View style={styles.metricCard}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Speed:</Text>
            <Text style={styles.metricValue}>{latestMetric.speed?.toFixed(1) ?? 'N/A'} km/h</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Location:</Text>
            <Text style={styles.metricValue}>
              {latestMetric.latitude?.toFixed(6) ?? 'N/A'}, {latestMetric.longitude?.toFixed(6) ?? 'N/A'}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Last Update:</Text>
            <Text style={styles.metricValue}>
              {latestMetric.datetime ? new Date(latestMetric.datetime).toLocaleString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Container style={styles.content}>
          <Text style={styles.title}>Loading devices...</Text>
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

  return (
    <View style={styles.container}>
      <Container style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {user?.name}</Text>
          <Pressable 
            style={styles.addButton}
            onPress={openCreateModal}
          >
            <TabBarIcon name="add" color="#F7ECE1" size={24} />
            <Text style={styles.addButtonText}>Add Device</Text>
          </Pressable>
        </View>
        
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
                  onPress={() => handleDeviceSelect(device.id)}
                >
                  <Text style={styles.dropdownItemText}>
                    {device.name} || {device.id}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {renderMetrics()}

        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItemContainer}>
              <Pressable 
                style={styles.listItem}
                onPress={() => handleDeviceSelect(item.id)}
              >
                <Text style={styles.listItemText}>
                  {item.name} || {item.id}
                </Text>
                <TabBarIcon name="chevron-right" color="#9747FF" size={24} />
              </Pressable>
              <View style={styles.listItemActions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => openEditModal(item)}
                >
                  <TabBarIcon name="edit" color="#9747FF" size={20} />
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                  disabled={isLoadingDelete}
                >
                  <TabBarIcon name="delete" color="#FF6B6B" size={20} />
                </Pressable>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={fetchDevices}
        />

        {/* Device Form Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Device' : 'Add New Device'}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Device Name"
                placeholderTextColor="#666"
                value={formData.name}
                onChangeText={(text) => setFormData({ name: text })}
              />

              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.modalButtonText}>
                    {isEditing ? 'Update' : 'Create'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Welcome Modal */}
        <Modal
          visible={isWelcomeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsWelcomeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Welcome to Device Manager!</Text>
              <Text style={styles.welcomeText}>
                It looks like you don&apos;t have any devices yet. Let&apos;s add your first device to start tracking metrics.
              </Text>
              
              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={openCreateModal}
                >
                  <Text style={styles.modalButtonText}>Add Your First Device</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#9747FF" />
          </View>
        )}

        <Text style={styles.version}>Version 1.0</Text>
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
  listContent: {
    gap: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  listItemText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: '#FF6B6B',
  },
  version: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 'auto',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9747FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#242038',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#9747FF',
    borderRadius: 8,
    padding: 12,
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  submitButton: {
    backgroundColor: '#9747FF',
  },
  modalButtonText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  metricsContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9747FF',
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    marginBottom: 12,
  },
  metricCard: {
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    opacity: 0.8,
  },
  metricValue: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
  noMetricsText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    opacity: 0.8,
  },
  welcomeText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
}); 