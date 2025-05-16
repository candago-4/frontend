import { Container } from '@/components/ui/Container';
import { TabBarIcon } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

interface Device {
  id: string;
  name: string;
}

export default function ListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Example data - replace with actual data
  const devices: Device[] = [
    { id: 'DEV-001', name: 'Device 1' },
    { id: 'DEV-002', name: 'Device 2' },
  ];

  return (
    <View style={styles.container}>
      <Container style={styles.content}>
        <Text style={styles.title}>[org_name] List</Text>
        
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

        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable 
              style={styles.listItem}
              onPress={() => {
                setSelectedDevice(item.id);
                setIsDropdownOpen(false);
              }}
            >
              <Text style={styles.listItemText}>
                {item.name} || {item.id}
              </Text>
              <TabBarIcon name="chevron-right" color="#9747FF" size={24} />
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
        />

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
  listItem: {
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
  version: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 'auto',
  },
}); 