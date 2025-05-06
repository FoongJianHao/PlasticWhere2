import Template from '@/components/Template';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null); // State to store the photo URI
  const cameraRef = useRef<CameraView>(null); // Reference to CameraView
  const flipScale = useRef(new Animated.Value(1)).current; // Animation scale for Flip Camera button
  const takePictureScale = useRef(new Animated.Value(1)).current; // Animation scale for Take Picture button
  const retakeScale = useRef(new Animated.Value(1)).current; // Animation scale for Retake button
  const reverseCamera = require('../../assets/images/reverseCamera.png'); // Image for reverse camera icon

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.safeArea} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <View style={styles.templateContainer}>
          {/* <SafeAreaView style={styles.safeArea}> */}
            <Template />
          {/* </SafeAreaView> */}
        </View>
        <View style={styles.foregroundContainer}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        setPhotoUri(photo.uri); // Store the photo URI
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  }

  function retakeImage() {
    setPhotoUri(null); // Clear photo URI to show camera again
  }

  // Animation handlers
  const handlePressIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.95, // Slightly shrink button
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1, // Return to original size
      friction: 3, // Controls bounciness
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/PLBG.png')} // Same image as Template.tsx
      style={styles.background}
      resizeMode="cover"
      blurRadius={5} // Matches Template.tsx
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.templateContainer}>
          {/* <SafeAreaView> */}
            <Template />
          {/* </SafeAreaView> */}
        </View>
        <View style={styles.foregroundContainer}>
          <View style={styles.cameraContainer}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.camera}
                resizeMode="cover" // Ensure image fills the container
              />
            ) : (
              <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
            )}
          </View>
          <View style={styles.buttonContainer}>
            {photoUri ? (
              <Animated.View style={[styles.button, { transform: [{ scale: retakeScale }] }]}>
                <TouchableOpacity
                  onPress={retakeImage}
                  onPressIn={() => handlePressIn(retakeScale)}
                  onPressOut={() => handlePressOut(retakeScale)}
                >
                  <Text style={styles.text}>Retake Image</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
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

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill the entire background
    backgroundColor: 'rgba(45, 45, 45, 0.9)', // Matches Template.tsx overlay
  },
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Transparent to show ImageBackground
  },
  templateContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Lower z-index for background
    backgroundColor: 'transparent',
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  foregroundContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 110, // Offset to avoid overlap with Template
    zIndex: 2, // Higher z-index for foreground
    backgroundColor: 'transparent',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  cameraContainer: {
    width: '90%', // Match camera width
    height: '75%', // Match camera height
    borderRadius: 20, // Curved border radius
    overflow: 'hidden', // Clip camera content to rounded corners
    borderWidth: 4, // Visible border
    borderColor: 'black', // Border color
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute', // Position at the bottom
    bottom: 120, // Offset from the bottom
    width: '100%', // Full width to center buttons
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'center', // Center buttons horizontally
    alignItems: 'center', // Align buttons vertically
    backgroundColor: 'transparent',
  },
  flipButtonContainer: {
    position: 'absolute',
    top: 10, // Align with top of CameraView (marginTop: 110 + padding)
    right: 30, // Position inside CameraView's right edge
    zIndex: 3, // Ensure it’s above CameraView
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
    alignItems: 'center',
  },
  text: {
    fontSize: 16, // Standard button text size
    fontWeight: '600', // Medium-bold text
    color: 'white', // White text
  },
  reverseCamera: { //reverseCamera icon size
    width: 70,
    height: 70,
  },
});