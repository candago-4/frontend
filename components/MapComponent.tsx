// SEU ARQUIVO MapComponent.tsx MODIFICADO

// 1. Importe o 'React' completo e a View/Image se for usar pino customizado
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

// ... suas interfaces (DeviceLocation, NativeMapProps) ...
interface DeviceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  speed?: number;
  lastUpdate?: string;
}

interface NativeMapProps {
  devices: DeviceLocation[];
  selectedDeviceId: string | null;
  darkStyle?: any[];
  isDarkMode?: boolean;
}

// 2. Mude a definição do componente para usar React.forwardRef
//    Isso adiciona o argumento 'ref' à sua função
export const MapComponent = React.forwardRef<MapView, NativeMapProps>(
  ({ devices, selectedDeviceId, darkStyle, isDarkMode }, ref) => {

    // State to track current region and whether it's been initialized
    const [currentRegion, setCurrentRegion] = useState<Region>({
      latitude: -23.29495040178083,
      longitude: -45.96673651375307,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    const [isInitialized, setIsInitialized] = useState(false);
    const internalMapRef = useRef<MapView>(null);

    // Combine external ref with internal ref
    const mapRef = (node: MapView | null) => {
      internalMapRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Handle region change to track current position
    const handleRegionChangeComplete = (region: Region) => {
      setCurrentRegion(region);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    };

    return (
      // 3. Passe a 'ref' para o componente MapView
      //    Use currentRegion instead of initialRegion to maintain position
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={isDarkMode ? darkStyle : []}
        region={currentRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {devices.map(device => (
          <Marker
            key={device.id}
            coordinate={{
              latitude: device.latitude,
              longitude: device.longitude,
            }}
            title={device.name}
            description={device.speed ? `Speed: ${device.speed.toFixed(1)} km/h` : undefined}
            pinColor={device.id === selectedDeviceId ? "#9747FF" : "#FF6B6B"}
          />
        ))}
      </MapView>
    );
  }
);

// Add display name to fix the lint warning
MapComponent.displayName = 'MapComponent';

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});