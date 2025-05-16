import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator } from 'react-native';
import 'react-native-reanimated';


export default function RootLayout() {
  // 1. Theme Management
  const colorScheme = useColorScheme(); // Custom hook for detecting system theme
  
  // 2. Font Loading
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 3. Loading State Handling
  // Add a better loading state
if (!loaded) {
  return <ActivityIndicator size="large" />;
}

  return (
    // 4. Theme Provider Setup
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      
      {/* 5. Navigation Stack */}
      <Stack>
        {/* Main tabs screen with hidden header */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        
        {/* Catch-all route for 404 errors */}
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* 6. Status Bar Configuration */}
<StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}