// Import custom Template component for background or shared UI
import Template from '@/components/Template';
// Import CameraView and related hooks/types from expo-camera for camera functionality
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// Import React hooks for state and ref management
import { useRef, useState } from 'react';
// Import React Native components for UI and animations
import { Animated, Button, StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
// Import expo-location for accessing device location
import * as Location from 'expo-location';
// Import Firebase modules for storage operations
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, updateMetadata } from "firebase/storage";

// Firebase configuration object with project-specific details
const firebaseConfig = {
  apiKey: "AIzaSyCla7gYr0TU4W6FjrXrqoP0cuWQDjGIOVk",
  authDomain: "plasticwhere-e55a0.firebaseapp.com",
  projectId: "plasticwhere-e55a0",
  storageBucket: "plasticwhere-e55a0.firebasestorage.app",
  messagingSenderId: "142116929131",
  appId: "1:142116929131:web:7e8552652379eb31b1bb2e",
  measurementId: "G-ZHYFYGWBP2"
};

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);
// Initialize Firebase Storage
const storage = getStorage(app);

// Define the main App component (likely the Camera screen)
export default function App() {
  // State to toggle between back and front camera
  const [facing, setFacing] = useState<CameraType>('back');
  // Hook to manage camera permissions
  const [permission, requestPermission] = useCameraPermissions();
  // Hook to manage foreground location permissions
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  // State to store the URI of the captured photo
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  // State to store the image URI for Firebase upload
  const [image, setImage] = useState('');
  // State to store the captured location (latitude and longitude)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  // Ref to access the CameraView component
  const cameraRef = useRef<CameraView>(null);
  // Animation value for Flip Camera button scale
  const flipScale = useRef(new Animated.Value(1)).current;
  // Animation value for Take Picture button scale
  const takePictureScale = useRef(new Animated.Value(1)).current;
  // Animation value for Retake button scale
  const retakeScale = useRef(new Animated.Value(1)).current;
  // Animation value for Submit button scale
  const submitScale = useRef(new Animated.Value(1)).current;
  // Load reverse camera icon from assets
  const reverseCamera = require('../../assets/images/reverseCamera.png');
  // Load background image from assets (same as Template.tsx)
  const backgroundImage = require('../../assets/images/PLBG.png');

  // Handle case where camera permissions are still loading
  if (!permission) {
    return <View style={styles.safeArea} />; // Empty view while loading
  }

  // Handle case where camera permissions are not granted
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.templateContainer}>
          <Template /> {/* Render Template as background */}
        </View>
        <View style={styles.foregroundContainer}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" /> {/* Button to request camera permission */}
        </View>
      </View>
    );
  }

  // Handle case where location permissions are not granted
  if (!locationPermission?.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.templateContainer}>
          <Template /> {/* Render Template as background */}
        </View>
        <View style={styles.foregroundContainer}>
          <Text style={styles.message}>We need your permission to access your location</Text>
          <Button onPress={requestLocationPermission} title="grant location permission" /> {/* Button to request location permission */}
        </View>
      </View>
    );
  }

  // Function to toggle between front and back camera
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Function to capture a photo and get the current location
  async function takePicture() {
    if (!cameraRef.current) {
      console.error('Camera ref is null');
      return;
    }
    try {
      // Get current location with high accuracy
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      });
      console.log('Location captured:', locationResult);

      // Capture photo with 80% quality
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      console.log('Photo captured:', photo);
      if (photo && photo.uri) {
        setPhotoUri(photo.uri); // Store photo URI for preview
        setImage(photo.uri); // Store for Firebase upload
      } else {
        console.error('Photo or photo.uri is undefined');
      }
    } catch (error) {
      console.error('Failed to take picture or get location:', error);
    }
  }

  // Function to upload the captured photo to Firebase Storage
  async function submitImage() {
    if (image) {
      try {
        const fileName = `photos/${Date.now()}.jpg`; // Generate unique file name with timestamp
        const storageRef = ref(storage, fileName); // Create Firebase Storage reference
        const response = await fetch(image); // Fetch the image as a blob
        const blob = await response.blob();
        await uploadBytes(storageRef, blob); // Upload image to Firebase

        // Set metadata with location and date
        const metadata = {
          customMetadata: {
            location: location
              ? `Lat: ${location.latitude.toFixed(2)}, Lon: ${location.longitude.toFixed(2)}`
              : 'Location: Unknown', // Fallback if location is unavailable
            date: new Date().toISOString(), // Store upload date
          },
        };
        console.log('Metadata to be set:', metadata);
        await updateMetadata(storageRef, metadata); // Update file metadata

        const downloadURL = await getDownloadURL(storageRef); // Get downloadable URL
        console.log('Photo uploaded to Firebase:', downloadURL);
        setPhotoUri(null); // Clear photo to return to camera
        setImage(''); // Clear image state
        setLocation(null); // Clear location state
      } catch (error) {
        console.error('Failed to upload to Firebase:', error);
      }
    }
  }

  // Function to clear the captured photo and return to camera
  function retakeImage() {
    setPhotoUri(null); // Clear photo URI
    setLocation(null); // Clear location
  }

  // Animation handler for button press-in (shrink effect)
  const handlePressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.95, // Slightly shrink button
      useNativeDriver: true, // Use native driver for performance
    }).start();
  };

  // Animation handler for button press-out (return to original size)
  const handlePressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1, // Return to original size
      friction: 3, // Controls bounciness
      useNativeDriver: true, // Use native driver for performance
    }).start();
  };

  return (
    // Background image with blur effect
    <ImageBackground
      source={backgroundImage} // Same image as in Template.tsx
      style={styles.background}
      resizeMode="cover" // Cover the entire container
      blurRadius={5} // Apply blur effect to match Template.tsx
    >
      <View style={styles.overlay} /> {/* Semi-transparent overlay */}
      <View style={styles.container}>
        <View style={styles.templateContainer}>
          <Template /> {/* Render Template as background */}
        </View>
        <View style={styles.foregroundContainer}>
          <View style={styles.cameraContainer}>
            {photoUri ? (
              // Display captured photo if available
              <Image
                source={{ uri: photoUri }}
                style={styles.camera}
                resizeMode="cover" // Ensure image fills container
              />
            ) : (
              // Display camera view if no photo is captured
              <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            )}
          </View>
          <View style={styles.buttonContainer}>
            {photoUri ? (
              <>
                {/* Retake button (shown after capturing a photo) */}
                <Animated.View style={[styles.button, { transform: [{ scale: retakeScale }] }]}>
                  <TouchableOpacity
                    onPress={retakeImage}
                    onPressIn={() => handlePressIn(retakeScale)}
                    onPressOut={() => handlePressOut(retakeScale)}
                  >
                    <Text style={styles.text}>Retake Image</Text>
                  </TouchableOpacity>
                </Animated.View>
                {/* Submit button (shown after capturing a photo) */}
                <Animated.View style={[styles.button, { transform: [{ scale: submitScale }] }]}>
                  <TouchableOpacity
                    onPress={submitImage}
                    onPressIn={() => handlePressIn(submitScale)}
                    onPressOut={() => handlePressOut(submitScale)}
                  >
                    <Text style={styles.text}>Submit Image</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              // Take Picture button (shown when camera is active)
              <Animated.View style={[styles.button, { transform: [{ scale: takePictureScale }] }]}>
                <TouchableOpacity
                  onPress={takePicture}
                  onPressIn={() => handlePressIn(takePictureScale)}
                  onPressOut={() => handlePressOut(takePictureScale)}
                >
                  <Text style={styles.text}>Take Picture</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
          {/* Flip camera button (shown only when camera is active) */}
          {!photoUri && (
            <View style={styles.flipButtonContainer}>
              <Animated.View style={[{ transform: [{ scale: flipScale }] }]}>
                <TouchableOpacity
                  onPress={toggleCameraFacing}
                  onPressIn={() => handlePressIn(flipScale)}
                  onPressOut={() => handlePressOut(flipScale)}
                >
                  <Image
                    source={reverseCamera}
                    style={styles.reverseCamera}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

// Define styles using StyleSheet for performance
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill entire background
    backgroundColor: 'rgba(45, 45, 45, 0.9)', // Semi-transparent dark overlay to match Template.tsx
  },
  background: {
    flex: 1, // Fill entire screen
    width: '100%', // Ensure full width
  },
  container: {
    flex: 1, // Fill entire screen
    backgroundColor: 'transparent', // Transparent to show ImageBackground
  },
  templateContainer: {
    position: 'absolute', // Position Template in background
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Lower z-index for background
    backgroundColor: 'transparent',
  },
  safeArea: {
    backgroundColor: 'transparent', // Transparent for background visibility
  },
  foregroundContainer: {
    flex: 1, // Fill remaining space
    justifyContent: 'flex-start', // Align content to top
    alignItems: 'center', // Center content horizontally
    marginTop: 110, // Offset to avoid overlap with Template
    zIndex: 2, // Ensure foreground is above Template
    backgroundColor: 'transparent',
  },
  message: {
    textAlign: 'center', // Center text
    paddingBottom: 10, // Space below text
    color: 'white', // White text for visibility
  },
  cameraContainer: {
    width: '90%', // Camera width (90% of screen)
    height: '75%', // Camera height (75% of screen)
    borderRadius: 20, // Rounded corners
    overflow: 'hidden', // Clip content to rounded corners
    borderWidth: 4, // Visible border
    borderColor: 'black', // Black border
  },
  camera: {
    width: '100%', // Fill container
    height: '100%', // Fill container
  },
  buttonContainer: {
    position: 'absolute', // Position at bottom
    bottom: 120, // Offset from bottom
    width: '100%', // Full width for centering
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'center', // Center buttons horizontally
    alignItems: 'center', // Align buttons vertically
    backgroundColor: 'transparent',
  },
  flipButtonContainer: {
    position: 'absolute', // Position inside camera view
    top: 10, // Align with top of camera (marginTop: 110 + padding)
    right: 30, // Position near right edge of camera
    zIndex: 3, // Ensure above CameraView
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark background
    borderRadius: 50, // Rounded corners
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    marginHorizontal: 15, // Space between buttons
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    alignItems: 'center', // Center text
  },
  text: {
    fontSize: 16, // Standard button text size
    fontWeight: '600', // Medium-bold text
    color: 'white', // White text
  },
  reverseCamera: {
    width: 70, // Reverse camera icon width
    height: 70, // Reverse camera icon height
  },
});