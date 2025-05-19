import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Alert, StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location'; // Use expo-location for location services
import Template from '@/components/Template';

export default function Map({ dataEntries }) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default location (San Francisco)
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state for location fetching

  // Reference to the MapView for animations
  const mapRef = useRef(null);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const animateMap = (region, duration) => {
    return new Promise((resolve) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, duration);
        setTimeout(resolve, duration);
      } else {
        resolve();
      }
    });
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Location Permission Denied', "Location permission is required to show your position.");
      setIsLoading(false);
      return;
    }

    try {
      // Start location fetch immediately
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Step 1: Zoom out
      await animateMap(
        {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 50,
          longitudeDelta: 50,
        },
        1500
      );

      // Wait for location fetch to complete
      const { coords } = await locationPromise;
      const { latitude, longitude } = coords;
      setLocation({ latitude, longitude });

      // Step 2: Move to location
      await animateMap(
        {
          latitude,
          longitude,
          latitudeDelta: 50,
          longitudeDelta: 50,
        },
        1500
      );

      // Step 3: Zoom in
      await animateMap(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1500
      );

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      setIsLoading(false);
    }
  };

  // Parse location string into coordinates
  const parseLocation = async (locationStr) => {
    console.log('Parsing location:', locationStr);
    if (locationStr.startsWith('Lat: ')) {
      const [lat, lon] = locationStr
        .replace('Lat: ', '')
        .replace('Lon: ', '')
        .split(', ')
        .map(parseFloat);
      if (!isNaN(lat) && !isNaN(lon)) {
        console.log('Parsed coords:', { latitude: lat, longitude: lon });
        return { latitude: lat, longitude: lon };
      }
    } else {
      // Attempt reverse geocoding for addresses (simplified)
      try {
        const [address] = await Location.geocodeAsync(locationStr);
        if (address) {
          console.log('Geocoded coords:', { latitude: address.latitude, longitude: address.longitude });
          return { latitude: address.latitude, longitude: address.longitude };
        }
      } catch (error) {
        console.warn('Geocoding failed:', error);
      }
    }
    console.warn('Invalid location format, skipping:', locationStr);
    return null;
  };

  // Request permission on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.templateContainer}>
        <Template />
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {location && (
          <Marker
            coordinate={location}
            title="My Location"
            description="You are here"
          />
        )}
        {dataEntries && dataEntries.length > 0 ? (
          dataEntries.map((entry, index) => {
            const coords = parseLocation(entry.location);
            if (coords) {
              return (
                <Marker
                  key={index}
                  coordinate={coords}
                  title={entry.label}
                >
                  <Callout>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutLabel}>{entry.label}</Text>
                      <Text style={styles.calloutLocation}>{entry.location}</Text>
                    </View>
                  </Callout>
                </Marker>
              );
            }
            return null;
          })
        ) : (
          <Text style={styles.noDataText}>No plastic waste data available</Text>
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.getMyLocationButton}
          onPress={getCurrentLocation}
          accessibilityLabel='Get My Current Location'
        >
          <Image
            source={require('../../assets/icons/getMyLocation.png')}
            style={styles.getMyLocationIcon}
          />
          <Text style={styles.getMyLocationText}>Get My Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  templateContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  map: {
    width: '100%',
    height: '100%',
    paddingTop: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 10, // Higher zIndex to ensure button is clickable
    justifyContent: 'center',
    alignItems: 'center',
  },
  getMyLocationIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  getMyLocationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Text color
  },
  getMyLocationButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)', // Semi-transparent blue background
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    width: '50%',
    borderRadius: 15,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    alignItems: 'center',
  },
  calloutLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calloutLocation: {
    fontSize: 14,
    color: '#666',
  },
  noDataText: {

    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -20 }],
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
});