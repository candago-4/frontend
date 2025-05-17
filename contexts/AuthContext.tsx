import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const API_URL = 'http://192.168.0.227:3001'; // Your local IP address

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing token on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Validate token and get user data
          const response = await fetch(`${API_URL}/validate-token`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            router.replace('/(tabs)/home');
          } else {
            // If token is invalid, remove it
            await AsyncStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await AsyncStorage.removeItem('token');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Store the token
      await AsyncStorage.setItem('token', data.token);
      
      // Set user data (excluding password)
      const { password: _, ...userWithoutPassword } = data.user;
      setUser(userWithoutPassword);
      
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
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
    try {
      setIsLoading(true);
      
      // Clear the stored token
      await AsyncStorage.removeItem('token');
      
      // Clear user data
      setUser(null);
      
      // Navigate to login
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
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
    <AuthContext.Provider value={{ user, isLoading, isInitialized, signIn, signUp, signOut }}>
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