// app/(tabs)/index.tsx
import { Container } from '@/components/ui/Container';
import { TabBarIcon } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

interface Device {
  id: string;
  name: string;
}

interface Metrics {
  metrosPercorridos: number;
  mediaMetrosDia: number;
  mediaVelocidade: number;
  downTimeProbability: number;
}

export default function HomeScreen() {
  const { signOut } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Example data - replace with actual data
  const devices: Device[] = [
    { id: 'DEV-001', name: 'Device 1' },
    { id: 'DEV-002', name: 'Device 2' },
  ];

  const metrics: Metrics = {
    metrosPercorridos: 1234,
    mediaMetrosDia: 123.4,
    mediaVelocidade: 45.6,
    downTimeProbability: 0.15,
  };

  const renderMetricCard = (label: string, value: number | string, isRed?: boolean) => (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, isRed && styles.redValue]}>
        Value
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  const handleExport = () => {
    // Implement export logic here
    console.log('Export pressed');
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Container style={styles.content}>
        <Text style={styles.title}>[org_name] Dashboard</Text>
        
        <View style={styles.dropdownContainer}>
          <Pressable 
            style={styles.dropdown}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownText}>
              {selectedDevice 
                ? `${devices.find(d => d.id === selectedDevice)?.name} || ${selectedDevice}`
                : '[Device_name || Id]'
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

        <View style={styles.metricsContainer}>
          {renderMetricCard('Metros Percorridos', metrics.metrosPercorridos)}
          {renderMetricCard('Media de Metros/Dia', metrics.mediaMetrosDia)}
          {renderMetricCard('Media de Velocidade', metrics.mediaVelocidade)}
          {renderMetricCard('Provabilidade de Down Time', 
            `${(metrics.downTimeProbability * 100).toFixed(1)}%`, 
            true
          )}
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.exportButton,
              pressed && styles.exportButtonPressed
            ]}
            onPress={handleExport}
          >
            <Text style={styles.exportText}>Export</Text>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
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
});