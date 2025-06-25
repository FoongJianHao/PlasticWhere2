// Import React Native components for UI rendering and interaction
import { Dimensions, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// Import React hooks and context utilities
import React, { createContext, useContext, useEffect, useState } from 'react';
// Import custom Template component for background or shared UI
import Template from '@/components/Template';
// Import Firebase Storage functions for fetching and deleting images
import { getStorage, ref, listAll, getDownloadURL, getMetadata, deleteObject } from 'firebase/storage';
// Import expo-location for reverse geocoding
import * as Location from 'expo-location';
// Import BlurView for modal background blur effect
import { BlurView } from 'expo-blur';
// Import custom data context hook for managing shared state
import { useData } from '@/context/dataContext';

// Get screen height for responsive design
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define TypeScript interface for data entries
interface DataEntry {
  imageUri: string; // URI of the image
  date: string; // Formatted date string
  location: string; // Location string (address or coordinates)
  label: string; // Label for the entry (e.g., "Plastic Waste")
  timestamp?: number; // Optional timestamp for sorting
}

// Initialize Firebase Storage
const storage = getStorage();

// Define DataTab component to render individual data entries
const DataTab: React.FC<DataEntry & { onPress: () => void; onDelete: () => void }> = ({
  imageUri,
  date,
  location,
  label,
  onPress,
  onDelete,
}) => {
  return (
    // Touchable container for the data entry
    <TouchableOpacity onPress={onPress} style={styles.tabContainer}>
      <Image source={{ uri: imageUri }} style={styles.dataImage} /> {/* Display image */}
      <View style={styles.textContainer}>
        <View style={styles.leftText}>
          <Text style={styles.date} numberOfLines={1}>
            {date} {/* Display date */}
          </Text>
          <View style={styles.rightText}>
            <Text style={styles.label}>{label}</Text> {/* Display label */}
          </View>
          <Text style={styles.location} numberOfLines={2}>
            {location} {/* Display location, limited to 2 lines */}
          </Text>
        </View>
      </View>
      {/* Delete button with cross icon */}
      <TouchableOpacity style={styles.crossIconContainer} onPress={onDelete}>
        <Text style={styles.crossIconText}>X</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Define the main Data component
export default function Data() {
  // Access data entries and loading state from DataContext
  const { dataEntries, setDataEntries, setIsLoading } = useData();
  // Hook to manage foreground location permissions
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  // State to control modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State to store the selected item for the modal
  const [selectedItem, setSelectedItem] = useState<DataEntry | null>(null);

  // Effect to fetch images from Firebase Storage when component mounts or locationPermission changes
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true); // Set loading state to true
        // Check if location permission is granted
        if (!locationPermission?.granted) {
          const { status } = await requestLocationPermission();
          if (status !== 'granted') {
            console.error('Location permission denied');
            // Fetch images without geocoding if permission is denied
            const photosRef = ref(storage, 'photos');
            const result = await listAll(photosRef);
            const entries = await Promise.all(
              result.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef); // Get image URL
                const metadata = await getMetadata(itemRef); // Get metadata
                const timestamp = parseInt(itemRef.name.replace('.jpg', ''), 10); // Extract timestamp from file name
                const isoDate = metadata.customMetadata?.date || new Date(timestamp).toISOString(); // Use metadata date or fallback to timestamp
                const date = new Date(isoDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }); // Format date
                const location = metadata.customMetadata?.location || 'Location: Unknown'; // Use metadata location or default
                return {
                  imageUri: url,
                  date,
                  location,
                  label: 'Plastic Waste', // Hardcoded label
                  timestamp,
                };
              })
            );
            // Sort entries by timestamp in descending order (newest first)
            entries.sort((a, b) => {
              const dateA = new Date(a.timestamp || 0);
              const dateB = new Date(b.timestamp || 0);
              return dateB.getTime() - dateA.getTime();
            });
            setDataEntries(entries); // Update context with fetched entries
            setIsLoading(false);
            return;
          }
        }

        // Fetch images with geocoding if location permission is granted
        const photosRef = ref(storage, 'photos');
        const result = await listAll(photosRef);
        const entries = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef); // Get image URL
            const metadata = await getMetadata(itemRef); // Get metadata
            const timestamp = parseInt(itemRef.name.replace('.jpg', ''), 10); // Extract timestamp
            const isoDate = metadata.customMetadata?.date || new Date(timestamp).toISOString(); // Use metadata date or fallback
            const date = new Date(isoDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }); // Format date
            let address = metadata.customMetadata?.location || 'Location: Unknown'; // Default location
            // Parse location if it contains coordinates
            if (address.startsWith('Lat: ')) {
              const [lat, lon] = address
                .replace('Lat: ', '')
                .replace('Lon: ', '')
                .split(', ')
                .map(parseFloat);
              if (!isNaN(lat) && !isNaN(lon)) {
                // Perform reverse geocoding to get address
                const geocodeResult = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                const result = geocodeResult[0];
                address = result
                  ? `${result.street || ''}${result.street ? ', ' : ''}${result.city || ''}${
                      result.city ? ', ' : ''
                    }${result.country || ''}`.trim()
                  : 'Address Not Found'; // Format address or fallback
              }
            }
            return {
              imageUri: url,
              date,
              location: address,
              label: 'Plastic Waste',
              timestamp,
            };
          })
        );

        // Sort entries by timestamp in descending order (newest first)
        entries.sort((a, b) => {
          const dateA = new Date(a.timestamp || 0);
          const dateB = new Date(b.timestamp || 0);
          return dateB.getTime() - dateA.getTime();
        });

        console.log('Fetched entries:', entries); // Log fetched data for debugging
        setDataEntries(entries); // Update context with fetched entries
        setIsLoading(false); // Set loading state to false
      } catch (error) {
        console.error('Failed to fetch images or geocode:', error);
        setIsLoading(false);
      }
    };
    fetchImages(); // Run fetchImages on mount or when locationPermission changes
  }, [locationPermission]);

  // Function to delete an entry from Firebase Storage and update context
  const deleteEntry = async (entry: DataEntry) => {
    try {
      const fileRef = ref(storage, `photos/${entry.timestamp}.jpg`); // Reference to the file
      await deleteObject(fileRef); // Delete file from Firebase
      console.log(`Deleted image from Firebase: ${entry.timestamp}.jpg`);
      // Update context by filtering out the deleted entry
      setDataEntries((prevEntries) => prevEntries.filter((item) => item.timestamp !== entry.timestamp));
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  // Define ModalView component for displaying selected item details
  const ModalView = ({ item, onClose }) => {
    return (
      <View style={styles.modalContainer}>
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} /> {/* Blur background */}
        <View style={styles.modalContent}>
          <Image source={{ uri: item.imageUri }} style={styles.modalImage} /> {/* Display image */}
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalLabel}>{item.label}</Text> {/* Display label */}
            <Text style={styles.modalDateLabel}>Date:</Text>
            <Text style={styles.modalDateValue}>{item.date}</Text> {/* Display date */}
            <Text style={styles.modalLocationLabel}>Location:</Text>
            <Text style={styles.modalLocationValue}>{item.location}</Text> {/* Display location */}
          </View>
        </View>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    // Main container for the screen
    <View style={styles.container}>
      <View style={styles.templateContainer}>
        <Template /> {/* Render Template as background */}
      </View>
      <View style={styles.headerContainer}>
        <Text
          style={[styles.headerText, styles.shadowEffect]} // Apply header text style and shadow
          accessibilityLabel="Data and Images Header" // Accessibility label
        >
          Reports
        </Text>
      </View>
      <View style={styles.horizontalLine} /> {/* Horizontal separator */}
      <View style={styles.contentContainer}>
        <FlatList
          data={dataEntries} // Data source from context
          renderItem={({ item }) => (
            <DataTab
              imageUri={item.imageUri}
              date={item.date}
              location={item.location}
              label={item.label}
              onPress={() => {
                setSelectedItem(item); // Set selected item for modal
                setIsModalVisible(true); // Show modal
              }}
              onDelete={() => deleteEntry(item)} // Delete entry on press
            />
          )}
          keyExtractor={(item) => item.timestamp?.toString() || Math.random().toString()} // Unique key for each item
          showsVerticalScrollIndicator={false} // Hide scroll indicator
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 280 }} // Padding for content
        />
      </View>
      {/* Render modal if visible */}
      {isModalVisible && selectedItem && (
        <ModalView
          item={selectedItem}
          onClose={() => {
            setIsModalVisible(false); // Hide modal
            setSelectedItem(null); // Clear selected item
          }}
        />
      )}
    </View>
  );
}

// Define styles using StyleSheet for performance
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill entire screen
  },
  templateContainer: {
    position: 'absolute', // Position Template in background
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent', // Transparent to show Template
    zIndex: 1, // Lower z-index for background
  },
  headerContainer: {
    marginTop: 120, // Space below Template's header
    zIndex: 2, // Above Template
  },
  contentContainer: {
    marginTop: 10, // Space below header
    zIndex: 2, // Above Template
  },
  tabContainer: {
    flexDirection: 'row', // Arrange image and text horizontally
    height: SCREEN_HEIGHT * 0.2, // Responsive height
    marginHorizontal: 16, // Side margins
    marginTop: 16, // Top margin
    borderRadius: 20, // Rounded corners
    backgroundColor: 'rgba(81, 81, 81, 0.8)', // Semi-transparent gray background
    padding: 12, // Internal padding
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  headerText: {
    color: 'white', // White text
    fontSize: 36, // Large font
    fontWeight: '600', // Bold
    marginBottom: 10, // Space below
    marginLeft: 20, // Left margin
  },
  horizontalLine: {
    height: 4, // Thick line
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Dark with slight transparency
    width: '100%', // Full width
    zIndex: 2, // Above Template
  },
  dataImage: {
    width: '40%', // 40% of container width
    height: '100%', // Fill container height
    borderRadius: 15, // Rounded corners
    resizeMode: 'cover', // Cover image
  },
  textContainer: {
    flex: 1, // Fill remaining space
    flexDirection: 'column', // Stack text vertically
    paddingLeft: 12, // Space from image
    justifyContent: 'space-between', // Space text evenly
  },
  leftText: {
    flex: 1, // Fill container
    justifyContent: 'space-between', // Space text vertically
  },
  rightText: {
    justifyContent: 'center', // Center label vertically
    alignItems: 'flex-end', // Align label to right
  },
  date: {
    fontSize: 16, // Medium font
    fontWeight: 'bold', // Bold
    color: 'white', // White text
  },
  location: {
    fontSize: 14, // Smaller font
    color: 'white', // White text
    lineHeight: 20, // Line spacing
  },
  label: {
    fontSize: 26, // Large font
    fontWeight: '600', // Bold
    color: 'white', // White text
  },
  shadowEffect: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Black shadow
    textShadowOffset: { width: 1.5, height: 1.5 }, // Shadow offset
    textShadowRadius: 5, // Shadow blur
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject, // Fill entire screen
    justifyContent: 'center', // Center content
    alignItems: 'center', // Center content
    zIndex: 10, // Above all other content
  },
  modalContent: {
    backgroundColor: 'rgba(171, 171, 171, 0.8)', // Semi-transparent gray
    borderRadius: 25, // Rounded corners
    padding: 25, // Internal padding
    width: '85%', // 85% of screen width
    height: '70%', // 70% of screen height
    marginBottom: 90, // Space for close button
    justifyContent: 'space-between', // Space content
    alignItems: 'center', // Center content
    overflow: 'hidden', // Clip content
    shadowColor: '#000', // Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  modalImage: {
    width: '100%', // Fill container
    height: '70%', // 70% of modal height
    borderRadius: 10, // Rounded corners
    overflow: 'hidden', // Clip image
  },
  modalTextContainer: {
    padding: 15, // Internal padding
    maxHeight: '30%', // Limit text area height
  },
  modalLabel: {
    fontSize: 40, // Large font
    fontWeight: 'bold', // Bold
    fontFamily: 'sans-serif', // Font family
    color: 'rgb(54, 103, 43)', // Green color
    textAlign: 'center', // Center text
    marginBottom: 15, // Space below
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Light shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  modalDateLabel: {
    fontSize: 16, // Medium font
    fontWeight: '600', // Bold
    color: '#444', // Dark gray
    textAlign: 'center', // Center text
    marginBottom: 2, // Space below
  },
  modalDateValue: {
    fontSize: 18, // Slightly larger font
    color: '#333', // Darker gray
    textAlign: 'center', // Center text
    marginBottom: 10, // Space below
  },
  modalLocationLabel: {
    fontSize: 16, // Medium font
    fontWeight: '600', // Bold
    color: '#444', // Dark gray
    textAlign: 'center', // Center text
    marginBottom: 2, // Space below
  },
  modalLocationValue: {
    fontSize: 18, // Slightly larger font
    color: '#333', // Darker gray
    textAlign: 'center', // Center text
  },
  closeButtonContainer: {
    position: 'absolute', // Position at bottom
    bottom: 120, // Offset from bottom
    alignSelf: 'center', // Center horizontally
    backgroundColor: '#E98787', // Light red background
    padding: 12, // Padding
    borderRadius: 12, // Rounded corners
    shadowColor: '#000', // Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Shadow for Android
  },
  closeButtonText: {
    color: 'white', // White text
    fontSize: 18, // Medium font
    fontWeight: 'bold', // Bold
    textAlign: 'center', // Center text
  },
  crossIconContainer: {
    position: 'absolute', // Position in top-right corner
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 33, 33, 0.6)', // Semi-transparent red
    borderRadius: 12, // Rounded corners
    width: 24, // Fixed size
    height: 24,
    justifyContent: 'center', // Center icon
    alignItems: 'center', // Center icon
  },
  crossIconText: {
    color: 'white', // White text
    fontSize: 16, // Medium font
    fontWeight: 'bold', // Bold
  },
});