import { NativeMap } from '@/components/NativeMap';
import { Container } from '@/components/ui/Container';
import { TabBarIcon } from '@/components/ui/IconSymbol';
import { WebMap } from '@/components/WebMap';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// Example coordinates for São Paulo
const INITIAL_LOCATION = {
  latitude: -23.5505,
  longitude: -46.6333,
};

// Dark map style for native maps
const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
];

export default function MapScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Temporary device data - replace with your actual data
  const devices = [
    { id: 'DEV-001', name: 'Device 1' },
    { id: 'DEV-002', name: 'Device 2' },
  ];

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.mapWrapper}>
          <WebMap 
            latitude={INITIAL_LOCATION.latitude} 
            longitude={INITIAL_LOCATION.longitude} 
          />
        </View>
      );
    }

    return (
      <View style={styles.mapWrapper}>
        <NativeMap
          location={INITIAL_LOCATION}
          darkStyle={darkMapStyle}
          isDarkMode={colorScheme === 'dark'}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Container style={styles.mapContainer}>
        <Text style={styles.title}>[org_name] Mapa</Text>
        
        <View>
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

        {renderMap()}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
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
    zIndex: 1,
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
    zIndex: 2,
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
  },
  map: {
    flex: 1,
  },
}); 