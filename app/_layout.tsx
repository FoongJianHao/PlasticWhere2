// Import navigation theme providers and utilities from react-navigation
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// Import hook for loading custom fonts in Expo
import { useFonts } from 'expo-font';
// Import Stack navigator from expo-router for navigation
import { Stack } from 'expo-router';
// Import splash screen utilities from Expo
import * as SplashScreen from 'expo-splash-screen';
// Import StatusBar component for controlling status bar appearance
import { StatusBar } from 'expo-status-bar';
// Import useEffect hook for side effects
import { useEffect } from 'react';
// Import reanimated for animations (used elsewhere in the app)
import 'react-native-reanimated';

// Import custom hook for accessing the device's color scheme (light/dark mode)
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding until assets are loaded
SplashScreen.preventAutoHideAsync();

// Define the root layout component
export default function RootLayout() {
  // Get the current color scheme (light or dark)
  const colorScheme = useColorScheme();
  // Load custom font (SpaceMono) and track loading status
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Effect to hide splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hide splash screen when fonts are ready
    }
  }, [loaded]);

  // Return null while fonts are loading to prevent rendering
  if (!loaded) {
    return null;
  }

  return (
    // Apply theme based on device color scheme (light or dark)
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Define the main tab navigation screen (tabs layout) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Define a not-found route for unmatched paths */}
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* Set StatusBar style to auto (adapts to theme) */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}