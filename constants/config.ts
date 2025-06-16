// API URL for backend requests
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Note: Make sure to create a .env file in your project root with:
// EXPO_PUBLIC_API_URL=http://your-docker-container-ip:3000

// For development with Docker, you might want to use one of these alternatives:
// export const API_URL = 'http://localhost:3000';  // If running on same machine
// export const API_URL = 'http://host.docker.internal:3000';  // If using Docker Desktop
// export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';  // For environment variable 