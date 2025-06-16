import { StyleSheet, View } from 'react-native';

interface DeviceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  speed?: number;
  lastUpdate?: string;
}

interface WebMapProps {
  devices: DeviceLocation[];
  selectedDeviceId?: string | null;
  zoom?: number;
}

export function WebMap({ devices, selectedDeviceId, zoom = 10 }: WebMapProps) {
  if (devices.length === 0) {
    return (
      <View style={styles.container}>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-46.7,-23.6,-46.6,-23.5&layer=mapnik"
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
            borderRadius: 12,
          }}
          title="Map"
        />
      </View>
    );
  }

  // Calculate bounding box to include all devices
  const latitudes = devices.map(d => d.latitude);
  const longitudes = devices.map(d => d.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  // Add some padding to the bounding box
  const latPadding = (maxLat - minLat) * 0.1;
  const lonPadding = (maxLon - minLon) * 0.1;

  // Create markers for all devices
  const markers = devices.map(device => 
    `${device.latitude},${device.longitude}`
  ).join('&marker=');

  // If a device is selected, center the map on it
  const selectedDevice = selectedDeviceId ? devices.find(d => d.id === selectedDeviceId) : null;
  const centerLat = selectedDevice ? selectedDevice.latitude : (minLat + maxLat) / 2;
  const centerLon = selectedDevice ? selectedDevice.longitude : (minLon + maxLon) / 2;

  // Calculate zoom level based on the spread of devices
  const latDelta = (maxLat - minLat + latPadding * 2);
  const lonDelta = (maxLon - minLon + lonPadding * 2);
  const dynamicZoom = Math.min(
    Math.floor(19 - Math.log2(Math.max(latDelta, lonDelta) * 100)),
    zoom
  );

  return (
    <View style={styles.container}>
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLon-lonDelta/2},${centerLat-latDelta/2},${centerLon+lonDelta/2},${centerLat+latDelta/2}&layer=mapnik&marker=${markers}`}
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          borderRadius: 12,
        }}
        title="Map"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#242f3e',
  },
}); 