import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { View, StyleSheet } from 'react-native';

interface DeviceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  speed?: number;
  lastUpdate?: string;
}

interface MapComponentProps {
  devices: DeviceLocation[];
  selectedDeviceId: string | null;
}

const API_KEY = 'AIzaSyA4c2gNgMfvqUJ1q7jEFA6LZDBV9Bgwlqs';
const MAP_ID = 'SEU_MAP_ID_OPCIONAL_AQUI';

export function MapComponent({ devices, selectedDeviceId }: MapComponentProps) {
  const selectedDeviceLocation = devices.find(device => device.id === selectedDeviceId);

  const centerPosition = {
    lat: selectedDeviceLocation ? selectedDeviceLocation.latitude : -23.29495040178083,
    lng: selectedDeviceLocation ? selectedDeviceLocation.longitude : -45.96673651375307,
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <View style={styles.container}>
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={centerPosition}
          defaultZoom={12}
          mapId={MAP_ID}
          gestureHandling={'greedy'}
        >
          {devices.map(device => {
            const isSelected = device.id === selectedDeviceId;
            const pinColor = isSelected ? '#725AC1' : '#242038';
            const pinScale = isSelected ? 1.4 : 1;

            return (
              <AdvancedMarker
                key={device.id}
                position={{ lat: device.latitude, lng: device.longitude }}
                title={device.name}
              >
                <Pin
                  background={pinColor}      
                  borderColor={'#2c3e50'}  
                  glyphColor={'#ecf0f1'}    
                  scale={pinScale}          
                />
              </AdvancedMarker>
            );
          })}
        </Map>
      </View>
    </APIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    minHeight: '400px',
  },
});