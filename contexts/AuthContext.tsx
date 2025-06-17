import { API_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize auth by checking for existing token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if there's an existing token
        const token = await AsyncStorage.getItem('token');
        console.log('Auth initialization - Token found:', !!token);
        
        if (token) {
          console.log('Attempting to validate token with API:', `${API_URL}/validate-token`);
          // Validate the token with the backend
          const response = await fetch(`${API_URL}/validate-token`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          console.log('Token validation response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Token validation successful, user:', data.user);
            // Token is valid, restore user session
            const { password: _, ...userWithoutPassword } = data.user;
            setUser(userWithoutPassword);
            setIsAuthenticated(true);
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.log('Token validation failed, status:', response.status, 'error:', errorData);
            // Token is invalid, clear it
            await AsyncStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('No token found, user needs to login');
          // No token found, user needs to login
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // On error, clear token and require login
        await AsyncStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with API:', `${API_URL}/login`);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: email,
          password: password,
        }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Store the token
      await AsyncStorage.setItem('token', data.token);
      console.log('Token stored successfully');
      
      // Set user data (excluding password)
      const { password: _, ...userWithoutPassword } = data.user;
      setUser(userWithoutPassword);
      
      router.replace('/home');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          mail: email,
          password,
          role: 'user',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      // After successful registration, automatically sign in
      await signIn(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Clear the stored token
      await AsyncStorage.removeItem('token');
      
      // Clear user data
      setUser(null);
      
      // Navigate to login
      router.replace('/');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearToken = async () => {
    setIsLoading(true);
    try {
      // Clear the stored token
      await AsyncStorage.removeItem('token');
      
      // Clear user data
      setUser(null);
      
      // Navigate to login
      router.replace('/');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Clear token error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, isInitialized, user, signIn, signUp, signOut, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 