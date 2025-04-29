import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/header';

const now = new Date();
const month = now.toLocaleString('en-US', { month: 'long' });
const currentYear = now.getFullYear();
const previousYear = currentYear - 1;

export default function Activities() {
    return (
        <ImageBackground
            source={require('../../assets/images/PLBG.png')} // Same image as Header.tsx
            style={styles.background}
            resizeMode="cover"
            blurRadius={5} // Matches Header.tsx
        >
            {/* Semi-transparent grey overlay to match Header.tsx */}
            <View style={styles.overlay} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerWrapper}>
                    <Header />
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        {/* Header Section */}
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Activities & Impacts</Text>
                        </View>

                        {/* Main Content Section */}
                        <View style={styles.mainContent}>
                            <Text style={styles.contentText}>Total Global Litter Content:</Text>
                            <Text style={styles.contentText}>Pick Up:</Text>
                            <Text style={styles.overallPickupText}>
                                Overall Pickup for {month} {previousYear} - {currentYear}:
                            </Text>
                            <Text style={styles.pickupNumber}>945</Text>
                        </View>

                        {/* Footer Section */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Footer Section</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Fill the entire background
        backgroundColor: 'rgba(45, 45, 45, 0.95)', // Matches Header.tsx overlay
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent', // Transparent to show ImageBackground
    },
    headerWrapper: {
        height: 60, // Constrains Header height
        width: '100%',
        overflow: 'hidden', // Clips Header content to fixed height
    },
    scrollContainer: {
        flexGrow: 1, // Ensures ScrollView content takes full height
    },
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 20, // Reduced from 100 for better spacing
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    headerText: {
        color: 'red', // Set to red as requested
        fontSize: 30,
        fontWeight: '600', // Numeric weight for compatibility
    },
    mainContent: {
        flex: 3, // Adjusted for better space distribution
        padding: 20,
    },
    contentText: {
        color: 'red', // Set to red as requested
        fontSize: 20,
        alignSelf: 'flex-end',
        marginRight: 20, // Responsive margin instead of paddingRight: 150
        marginVertical: 10,
    },
    overallPickupText: {
        color: 'red', // Set to red as requested
        fontSize: 22,
        alignSelf: 'center',
        marginTop: 30,
    },
    pickupNumber: {
        color: 'red', // Set to red as requested
        fontSize: 50,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 10,
    },
    footer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: 'red', // Set to red as requested
        fontSize: 20,
    },
});