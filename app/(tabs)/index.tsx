import { Dimensions, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Template from '@/components/Template';
import { getStorage, ref, listAll, getDownloadURL, getMetadata, deleteObject } from 'firebase/storage';
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DataEntry {
  imageUri: string;
  date: string;
  location: string;
  label: string;
  timestamp?: number; // Optional for keyExtractor
}

const storage = getStorage();

const DataTab: React.FC<DataEntry & { onPress: () => void; onDelete: () => void }> =
  ({ imageUri, date, location, label, onPress, onDelete }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.tabContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.dataImage}
        />
        <View style={styles.textContainer}>
          <View style={styles.leftText}>
            <Text style={styles.date} numberOfLines={1}>{date}</Text>
            <View style={styles.rightText}>
              <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={styles.location} numberOfLines={2}>{location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.crossIconContainer} onPress={onDelete}>
          <Text style={styles.crossIconText}>X</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

export default function Data() {
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataEntry | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (!locationPermission?.granted) {
          const { status } = await requestLocationPermission();
          if (status !== 'granted') {
            console.error('Location permission denied');
            const photosRef = ref(storage, 'photos');
            const result = await listAll(photosRef);
            const entries = await Promise.all(
              result.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                const metadata = await getMetadata(itemRef);
                const timestamp = parseInt(itemRef.name.replace('.jpg', ''), 10);
                const isoDate = metadata.customMetadata?.date || new Date(timestamp).toISOString();
                const date = new Date(isoDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                const location = metadata.customMetadata?.location || 'Location: Unknown';
                return {
                  imageUri: url,
                  date,
                  location,
                  label: 'Plastic Waste',
                  timestamp,
                };
              })
            );
            entries.sort((a, b) => {
              const dateA = new Date(a.timestamp || 0);
              const dateB = new Date(b.timestamp || 0);
              return dateB.getTime() - dateA.getTime();
            });
            setDataEntries(entries);
            return;
          }
        }

        const photosRef = ref(storage, 'photos');
        const result = await listAll(photosRef);
        const entries = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);
            const timestamp = parseInt(itemRef.name.replace('.jpg', ''), 10);
            const isoDate = metadata.customMetadata?.date || new Date(timestamp).toISOString();
            const date = new Date(isoDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const locationStr = metadata.customMetadata?.location || 'Location: Unknown';
            let address = locationStr;
            if (locationStr.startsWith('Lat: ')) {
              const [lat, lon] = locationStr
                .replace('Lat: ', '')
                .replace('Lon: ', '')
                .split(', ')
                .map(parseFloat);
              if (!isNaN(lat) && !isNaN(lon)) {
                const geocodeResult = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                const result = geocodeResult[0];
                address = result
                  ? `${result.street || ''}${result.street ? ', ' : ''}${result.city || ''}${result.city ? ', ' : ''}${result.country || ''}`.trim()
                  : 'Address Not Found';
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

        entries.sort((a, b) => {
          const dateA = new Date(a.timestamp || 0);
          const dateB = new Date(b.timestamp || 0);
          return dateB.getTime() - dateA.getTime();
        });

        setDataEntries(entries);
      } catch (error) {
        console.error('Failed to fetch images or geocode:', error);
      }
    };
    fetchImages();
  }, [locationPermission]);

  const deleteEntry = async (entry: DataEntry) => {
    try {
      // Delete from Firebase Storage
      const fileRef = ref(storage, `photos/${entry.timestamp}.jpg`);
      await deleteObject(fileRef);
      console.log(`Deleted image from Firebase: ${entry.timestamp}.jpg`);

      // Update local state
      setDataEntries((prevEntries) => prevEntries.filter((item) => item.timestamp !== entry.timestamp));
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const ModalView = ({ item, onClose }) => {
    return (
      <View style={styles.modalContainer}>
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.modalContent}>
          <Image source={{ uri: item.imageUri }} style={styles.modalImage} />
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalLabel}>{item.label}</Text>
            <Text style={styles.modalDateLabel}>Date:</Text>
            <Text style={styles.modalDateValue}>{item.date}</Text>
            <Text style={styles.modalLocationLabel}>Location:</Text>
            <Text style={styles.modalLocationValue}>{item.location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.templateContainer}>
        <Template />
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.shadowEffect]} accessibilityLabel="Data and Images Header">
          Reports
        </Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.contentContainer}>
        <FlatList
          data={dataEntries}
          renderItem={({ item }) => (
            <DataTab
              imageUri={item.imageUri}
              date={item.date}
              location={item.location}
              label={item.label}
              onPress={() => {
                setSelectedItem(item);
                setIsModalVisible(true);
              }}
              onDelete={() => deleteEntry(item)}
            />
          )}
          keyExtractor={(item) => item.timestamp?.toString() || Math.random().toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 280 }}
        />
      </View>
      {isModalVisible && selectedItem && (
        <ModalView
          item={selectedItem}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedItem(null);
          }}
        />
      )}
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
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  headerContainer: {
    marginTop: 120,
    zIndex: 2,
  },
  contentContainer: {
    marginTop: 10,
    zIndex: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    height: SCREEN_HEIGHT * 0.2,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(81, 81, 81, 0.8)',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    color: 'white',
    fontSize: 36,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 20,
  },
  horizontalLine: {
    height: 4,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    width: '100%',
    zIndex: 2,
  },
  dataImage: {
    width: '40%',
    height: '100%',
    borderRadius: 15,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    justifyContent: 'space-between',
  },
  leftText: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rightText: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  location: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  label: {
    fontSize: 26,
    fontWeight: '600',
    color: 'white',
  },
  shadowEffect: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 5,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: 'rgba(171, 171, 171, 0.8)',
    borderRadius: 25,
    padding: 25,
    width: '85%',
    height: '70%', // Increased from 65% to accommodate text
    marginBottom: 90, // Adjusted to ensure space for button and navigation bar
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden', // Ensure content (including image) respects borders
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: '100%',
    height: '70%',
    borderRadius: 10,
    // resizeMode: 'contain',
    overflow: 'hidden', // Ensure image corners are clipped
  },
  modalTextContainer: {
    padding: 15,
    maxHeight: '30%', // Limit text container height
  },
  modalLabel: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    color: 'rgb(54, 103, 43)',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  modalDateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
  },
  modalDateValue: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalLocationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
  },
  modalLocationValue: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  closeButtonContainer: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    backgroundColor: '#E98787',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  crossIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 33, 33, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});