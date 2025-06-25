// Import Link for navigation and Stack for screen configuration from expo-router
import { Link, Stack } from 'expo-router';
// Import StyleSheet for creating styles
import { StyleSheet } from 'react-native';

// Import custom themed text component for consistent text styling
import { ThemedText } from '@/components/ThemedText';
// Import custom themed view component for consistent view styling
import { ThemedView } from '@/components/ThemedView';

// Define the NotFoundScreen component
export default function NotFoundScreen() {
  return (
    <>
      {/* Configure the screen with a title for the navigation header */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      {/* Main container using ThemedView for theme-aware styling */}
      <ThemedView style={styles.container}>
        {/* Display error message using ThemedText with title styling */}
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        {/* Link to navigate back to the home screen */}
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

// Define styles using StyleSheet for performance
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill entire screen
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    padding: 20, // Internal padding
  },
  link: {
    marginTop: 15, // Space above link
    paddingVertical: 15, // Vertical padding for touch area
  },
});