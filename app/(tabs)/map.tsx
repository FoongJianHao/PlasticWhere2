// Import React hooks for state, effects, and refs
import React, { useEffect, useRef, useState } from 'react';
// Import MapView and related components for map rendering
import MapView, { Marker, Callout } from 'react-native-maps';
// Import React Native components for UI and interaction
import { Alert, StyleSheet, View, Image, Pressable, Text, ActivityIndicator } from 'react-native';
// Import expo-location for accessing device location
import * as Location from 'expo-location';
// Import Reanimated for animations
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
// Import custom Template component for background or shared UI
import Template from '@/components/Template';
// Import custom data context hook for accessing shared state
import { useData } from '@/context/dataContext';

// Define TypeScript interface for data entries
interface DataEntry {
  imageUri: string; // URI of the image
  date: string; // Formatted date string
  location: string; // Location string (address or coordinates)
  label: string; // Label for the entry (e.g., "Plastic Waste")
  timestamp?: number; // Optional timestamp for sorting
}

// Define TypeScript interface for grouped marker data
interface MarkerData {
  coords: { latitude: number; longitude: number }; // Marker coordinates
  entries: DataEntry[]; // Array of entries at this location
}

// Define the main Map component
export default function Map() {
  // Access data entries and loading state from DataContext
  const { dataEntries, isLoading } = useData();
  // State to store the user's current location
  const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);
  // State for the map's region (viewable area)
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default latitude (San Francisco)
    longitude: -122.4324, // Default longitude
    latitudeDelta: 0.0922, // Zoom level (latitude)
    longitudeDelta: 0.0421, // Zoom level (longitude)
  });
  // State to track map loading status
  const [isMapLoading, setIsMapLoading] = useState(false);
  // State for grouped markers (clustered by coordinates)
  const [groupedMarkers, setGroupedMarkers] = useState<MarkerData[]>([]);
  // State to track the current index for each marker's entries
  const [currentIndices, setCurrentIndices] = useState<{ [key: number]: number }>({});
  // Ref to access the MapView component
  const mapRef = useRef<MapView>(null);

  // Function to request foreground location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

  // Function to animate the map to a new region
  const animateMap = (region, duration) => {
    return new Promise((resolve) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, duration); // Animate to new region
        setTimeout(resolve, duration); // Resolve after animation completes
      } else {
        resolve(); // Resolve immediately if mapRef is not available
      }
    });
  };

  // Function to get the user's current location and animate the map
  const getCurrentLocation = async () => {
    setIsMapLoading(true); // Show loading indicator
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Location Permission Denied', 'Location permission is required to show your position.');
      setIsMapLoading(false);
      return;
    }

    try {
      // Get current location with balanced accuracy
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Zoom out animation
      await animateMap(
        {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 50,
          longitudeDelta: 50,
        },
        1500
      );

      // Get location coordinates
      const { coords } = await locationPromise;
      const { latitude, longitude } = coords;
      setLocation({ latitude, longitude }); // Update location state

      // Animate to user's location (intermediate zoom)
      await animateMap(
        {
          latitude,
          longitude,
          latitudeDelta: 50,
          longitudeDelta: 50,
        },
        1500
      );

      // Zoom in to precise location
      await animateMap(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1500
      );

      // Update region state
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setIsMapLoading(false); // Hide loading indicator
    } catch (error) {
      Alert.alert('Error', error.message); // Show error to user
      setIsMapLoading(false);
    }
  };

  // Function to parse location string into coordinates
  const parseLocation = async (locationStr: string): Promise<{ latitude: number; longitude: number } | null> => {
    console.log('Parsing location string:', locationStr);
    if (!locationStr || typeof locationStr !== 'string') {
      console.warn('Invalid location string:', locationStr);
      return null;
    }

    // Try parsing "Lat: X, Lon: Y" format
    if (locationStr.startsWith('Lat: ')) {
      const [lat, lon] = locationStr
        .replace('Lat: ', '')
        .replace('Lon: ', '')
        .split(', ')
        .map(parseFloat);
      if (!isNaN(lat) && !isNaN(lon)) {
        console.log('Parsed coords successfully:', { latitude: lat, longitude: lon });
        return { latitude: lat, longitude: lon };
      } else {
        console.warn('Invalid parsed coordinates for:', locationStr);
      }
    } else {
      // Try geocoding the address
      try {
        const [address] = await Location.geocodeAsync(locationStr);
        if (address) {
          console.log('Geocoded coords successfully:', { latitude: address.latitude, longitude: address.longitude });
          return { latitude: address.latitude, longitude: address.longitude };
        } else {
          console.warn('No geocode result for:', locationStr);
        }
      } catch (error) {
        console.warn('Geocoding failed for:', locationStr, 'Error:', error);
      }
    }
    console.warn('Location parsing failed for:', locationStr);
    return null;
  };

  // Request location permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Effect to process data entries and group markers by coordinates
  useEffect(() => {
    const resolveCoordinates = async () => {
      console.log('Initial Data Entries in Map:', dataEntries);
      if (!dataEntries || dataEntries.length === 0) {
        console.warn('Data Entries is empty or undefined in Map');
        setGroupedMarkers([]); // Clear markers if no data
        return;
      }

      // Parse coordinates for each entry
      const entriesWithCoords = await Promise.all(
        dataEntries.map(async (entry, index) => {
          console.log(`Processing entry ${index}:`, entry);
          if (!entry || typeof entry !== 'object' || !entry.location) {
            console.warn(`Invalid entry at index ${index}:`, entry);
            return null;
          }
          const coords = await parseLocation(entry.location);
          return coords ? { ...entry, coords } : null;
        })
      );

      // Filter out invalid entries
      const validEntries = entriesWithCoords.filter((entry) => entry !== null) as DataEntry[];
      console.log('Valid Entries with Coords:', validEntries);

      // Group entries by coordinates
      const groupedByCoords = validEntries.reduce((acc, entry) => {
        if (!entry.coords) {
          console.warn('Entry with no coords skipped:', entry);
          return acc;
        }
        const key = `${entry.coords.latitude},${entry.coords.longitude}`;
        if (!acc[key]) {
          acc[key] = {
            coords: entry.coords,
            entries: [],
          };
        }
        acc[key].entries.push(entry);
        return acc;
      }, {} as Record<string, MarkerData>);

      const groupedArray = Object.values(groupedByCoords);
      console.log('Final Grouped Markers:', groupedArray);
      setGroupedMarkers(groupedArray); // Update grouped markers
      setCurrentIndices({}); // Reset indices
    };
    if (!isLoading) {
      resolveCoordinates(); // Run when data is not loading
    }
  }, [dataEntries, isLoading]);

  // Function to navigate to the previous entry for a marker
  const handlePrevious = (markerIndex: number, entriesLength: number) => {
    console.log('Handle Previous triggered for marker:', markerIndex);
    setCurrentIndices((prev) => {
      const current = prev[markerIndex] || 0;
      const newIndex = current > 0 ? current - 1 : entriesLength - 1;
      console.log('Previous - Marker Index:', markerIndex, 'Current Index:', current, 'New Index:', newIndex);
      return { ...prev, [markerIndex]: newIndex };
    });
  };

  // Function to navigate to the next entry for a marker
  const handleNext = (markerIndex: number, entriesLength: number) => {
    console.log('Handle Next triggered for marker:', markerIndex);
    setCurrentIndices((prev) => {
      const current = prev[markerIndex] || 0;
      const newIndex = current < entriesLength - 1 ? current + 1 : 0;
      console.log('Next - Marker Index:', markerIndex, 'Current Index:', current, 'New Index:', newIndex);
      return { ...prev, [markerIndex]: newIndex };
    });
  };

  // Animated button component for navigation
  const AnimatedButton = ({ onPress, text }: { onPress: () => void; text: string }) => {
    const scale = useSharedValue(1); // Animation scale value
    const opacity = useSharedValue(1); // Animation opacity value

    // Define animated style
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    // Handle press-in animation
    const handlePressIn = () => {
      scale.value = withTiming(0.85, { duration: 100 }); // Shrink button
      opacity.value = withTiming(0.65, { duration: 100 }); // Fade button
    };

    // Handle press-out animation
    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 }); // Return to original size
      opacity.value = withTiming(1, { duration: 200 }); // Return to full opacity
    };

    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          console.log(`${text} button pressed`);
          onPress(); // Trigger callback
        }}
        style={{ pointerEvents: 'auto' }} // Ensure button is interactive
        accessibilityLabel={text === '←' ? 'Previous Image' : 'Next Image'} // Accessibility
      >
        <Animated.View style={[styles.navButton, animatedStyle]}>
          <Text style={styles.navButtonText}>{text}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  // Render loading screen if data is loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" /> {/* Loading indicator */}
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    // Main container for the screen
    <View style={styles.container}>
      <View style={styles.templateContainer}>
        <Template /> {/* Render Template as background */}
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region} // Current map region
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Update region on change
      >
        {/* Marker for user's current location */}
        {location && (
          <Marker coordinate={location} title="My Location" description="You are here" />
        )}
        {/* Markers for grouped data entries */}
        {groupedMarkers.length > 0 ? (
          groupedMarkers.map((marker, index) => {
            const currentIndex = currentIndices[index] || 0;
            const currentEntry = marker.entries[currentIndex];
            console.log('Rendering Marker:', index, 'Current Index:', currentIndex, 'Entry:', currentEntry);

            return (
              <Marker
                key={`${index}-${currentEntry?.timestamp || index}-${currentIndex}`} // Unique key
                coordinate={marker.coords}
                title={`Plastic Waste (${marker.entries.length})`} // Show number of entries
              >
                <Callout onPress={() => console.log('Callout pressed for marker:', index)}>
                  <View style={styles.calloutContainer}>
                    {currentEntry ? (
                      <>
                        <Image
                          key={`${currentEntry.imageUri}-${currentIndex}`} // Unique key for image
                          source={{ uri: currentEntry.imageUri }}
                          style={styles.calloutImage}
                          onError={(e) => console.warn('Callout image load error:', e.nativeEvent.error)}
                          onLoad={() => console.log('Image loaded for Marker:', index)}
                        />
                        <Text style={styles.calloutLabel}>{currentEntry.label || 'No Label'}</Text>
                        <Text style={styles.calloutDate}>{currentEntry.date || 'No Date'}</Text>
                        <Text style={styles.calloutLocation}>{currentEntry.location || 'No Location'}</Text>
                        {/* Navigation buttons for multiple entries */}
                        {marker.entries.length > 1 && (
                          <View style={styles.buttonContainer} pointerEvents="auto">
                            <AnimatedButton
                              onPress={() => handlePrevious(index, marker.entries.length)}
                              text="←"
                            />
                            <Text style={styles.indexText}>
                              {currentIndex + 1}/{marker.entries.length} {/* Show current entry index */}
                            </Text>
                            <AnimatedButton
                              onPress={() => handleNext(index, marker.entries.length)}
                              text="→"
                            />
                          </View>
                        )}
                      </>
                    ) : (
                      <Text style={styles.calloutText}>No data available</Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            );
          })
        ) : (
          // Display message if no markers are available
          <Text style={styles.noDataText}>No plastic waste data available</Text>
        )}
      </MapView>
      {/* Button to get current location */}
      <View style={styles.getLocationButtonContainer}>
        {isMapLoading ? (
          <ActivityIndicator size="large" color="#fff" /> // Loading indicator during location fetch
        ) : (
          <Pressable
            style={styles.getMyLocationButton}
            onPress={getCurrentLocation}
            accessibilityLabel="Get My Current Location"
          >
            <Image
              source={require('../../assets/icons/getMyLocation.png')}
              style={styles.getMyLocationIcon}
              onError={(e) => console.warn('Image load error:', e.nativeEvent.error)}
            />
            <Text style={styles.getMyLocationText}>Get My Location</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Define styles using StyleSheet for performance
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill entire screen
  },
  loadingContainer: {
    flex: 1, // Fill screen
    justifyContent: 'center', // Center content
    alignItems: 'center', // Center content
  },
  loadingText: {
    marginTop: 10, // Space below indicator
    fontSize: 16, // Medium font
    color: '#333', // Dark text
  },
  templateContainer: {
    position: 'absolute', // Position Template in background
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Lower z-index for background
  },
  map: {
    width: '100%', // Fill width
    height: '100%', // Fill height
  },
  getLocationButtonContainer: {
    position: 'absolute', // Position at bottom
    bottom: 100, // Offset from bottom
    left: 20, // Left margin
    right: 20, // Right margin
    zIndex: 10, // Above map
    justifyContent: 'center', // Center content
    alignItems: 'center', // Center content
  },
  getMyLocationIcon: {
    width: 30, // Icon size
    height: 30,
    marginRight: 8, // Space from text
  },
  getMyLocationText: {
    fontSize: 16, // Medium font
    fontWeight: 'bold', // Bold
    color: '#fff', // White text
  },
  getMyLocationButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)', // Blue with transparency
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
    paddingVertical: 7, // Vertical padding
    width: '50%', // Half screen width
    borderRadius: 15, // Rounded corners
  },
  calloutContainer: {
    width: 250, // Fixed width
    maxHeight: 350, // Max height
    alignItems: 'center', // Center content
    backgroundColor: 'white', // White background
    borderRadius: 12, // Rounded corners
    padding: 12, // Internal padding
    overflow: 'hidden', // Clip content
    shadowColor: '#000', // Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    zIndex: 1000, // Ensure above map
  },
  calloutImage: {
    width: '100%', // Fill width
    height: 140, // Fixed height
    borderRadius: 8, // Rounded corners
    resizeMode: 'cover', // Cover image
    marginBottom: 8, // Space below
  },
  calloutLabel: {
    fontSize: 16, // Medium font
    fontWeight: 'bold', // Bold
    color: '#333', // Dark text
    marginVertical: 6, // Vertical spacing
    textAlign: 'center', // Center text
  },
  calloutDate: {
    fontSize: 14, // Smaller font
    color: '#555', // Gray text
    textAlign: 'center', // Center text
    marginBottom: 4, // Space below
  },
  calloutLocation: {
    fontSize: 14, // Smaller font
    color: '#555', // Gray text
    textAlign: 'center', // Center text
    marginBottom: 8, // Space below
  },
  buttonContainer: {
    flexDirection: 'row', // Horizontal layout
    justifyContent: 'space-between', // Space buttons
    alignItems: 'center', // Center vertically
    width: '100%', // Full width
    paddingHorizontal: 16, // Side padding
    marginTop: 8, // Space above
    marginBottom: 8, // Space below
  },
  navButton: {
    backgroundColor: '#007AFF', // Blue background
    borderColor: '#005BB5', // Darker blue border
    borderWidth: 1, // Border width
    borderRadius: 12, // Rounded corners
    width: 50, // Fixed width
    height: 50, // Fixed height
    alignItems: 'center', // Center content
    justifyContent: 'center', // Center content
    shadowColor: '#000', // Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // Shadow for Android
  },
  navButtonText: {
    fontSize: 24, // Large font
    fontWeight: '700', // Bold
    color: '#fff', // White text
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Light shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  indexText: {
    fontSize: 16, // Medium font
    color: '#333', // Dark text
    fontWeight: '600', // Bold
  },
  calloutText: {
    fontSize: 14, // Smaller font
    color: '#333', // Dark text
    textAlign: 'center', // Center text
    padding: 10, // Padding
  },
  noDataText: {
    position: 'absolute', // Center on map
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -20 }], // Center alignment
    color: '#fff', // White text
    fontSize: 16, // Medium font
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 10, // Padding
    borderRadius: 5, // Rounded corners
  },
});