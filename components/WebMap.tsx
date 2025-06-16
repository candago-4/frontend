import { useEffect, useRef } from 'react';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  
  console.log('WebMap received devices:', devices);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    loadLeaflet();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return;

    // Initialize map
    const map = window.L.map(mapRef.current).setView([0, 0], zoom);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for devices
    updateMarkers();
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.L || devices.length === 0) return;

    const map = mapInstanceRef.current;
    const markers = markersRef.current;

    // Clear existing markers
    markers.forEach(marker => {
      map.removeLayer(marker);
    });
    markers.clear();

    // Add new markers
    devices.forEach(device => {
      const marker = window.L.marker([device.latitude, device.longitude])
        .addTo(map)
        .bindPopup(`
          <div style="font-family: monospace; color: #333;">
            <strong>${device.name}</strong><br>
            Speed: ${device.speed ? `${device.speed.toFixed(1)} km/h` : 'N/A'}<br>
            Location: ${device.latitude.toFixed(6)}, ${device.longitude.toFixed(6)}<br>
            Last Update: ${device.lastUpdate ? new Date(device.lastUpdate).toLocaleString() : 'N/A'}
          </div>
        `);
      
      markers.set(device.id, marker);
    });

    // Fit map to show all markers
    if (devices.length > 0) {
      const bounds = window.L.latLngBounds(devices.map(d => [d.latitude, d.longitude]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    // Center on selected device if specified
    if (selectedDeviceId) {
      const selectedDevice = devices.find(d => d.id === selectedDeviceId);
      if (selectedDevice) {
        map.setView([selectedDevice.latitude, selectedDevice.longitude], zoom);
      }
    }
  };

  // Update markers when devices change
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [devices, selectedDeviceId, zoom]);

  if (devices.length === 0) {
    return (
      <View style={styles.container}>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
            backgroundColor: '#242f3e',
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
        }}
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

// Add Leaflet types to window
declare global {
  interface Window {
    L: any;
  }
} 