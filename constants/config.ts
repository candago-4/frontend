import { Platform } from 'react-native';

// API URL for backend requests
// For mobile development, you need to use your machine's IP address instead of localhost

// IMPORTANT: This is the WiFi IP address that mobile devices can reach
// Make sure this matches your machine's WiFi IP address
const WIFI_IP = '192.168.1.101';
const BACKEND_PORT = '3000';

// API URL configuration - Force the correct IP
const MOBILE_API_URL = `http://${WIFI_IP}:${BACKEND_PORT}`;
const WEB_API_URL = `http://localhost:${BACKEND_PORT}`;

// Force the correct API URL based on platform
export const API_URL = Platform.OS === 'web' ? WEB_API_URL : MOBILE_API_URL;

// Comprehensive debug logging
console.log('=== API CONFIG DEBUG ===');
console.log(`Platform: ${Platform.OS}`);
console.log(`WIFI_IP: ${WIFI_IP}`);
console.log(`BACKEND_PORT: ${BACKEND_PORT}`);
console.log(`MOBILE_API_URL: ${MOBILE_API_URL}`);
console.log(`WEB_API_URL: ${WEB_API_URL}`);
console.log(`Final API_URL: ${API_URL}`);
console.log('========================');

// Note: Make sure to:
// 1. Your mobile device is on the same WiFi network as your development machine
// 2. The backend is accessible at http://192.168.1.101:3000
// 3. No firewall is blocking port 3000
// 4. If the IP changes, update the WIFI_IP constant above

// For development with Docker, you might want to use one of these alternatives:
// export const API_URL = 'http://localhost:3000';  // If running on same machine
// export const API_URL = 'http://host.docker.internal:3000';  // If using Docker Desktop
// export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';  // For environment variable 