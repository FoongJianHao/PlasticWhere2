// Import React for defining components with JSX
import React from 'react';
// Import core React Native components for UI rendering
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
// Import custom Template component, likely for background or shared UI
import Template from '@/components/Template';

// Get the window width for responsive design
const { width } = Dimensions.get('window');
// Create a Date object for the current date
const now = new Date();
// Get the current month as a full name (e.g., "January")
const month = now.toLocaleString('en-US', { month: 'long' });
// Get the current year (e.g., 2025)
const currentYear = now.getFullYear();
// Calculate the previous year (e.g., 2024)
const previousYear = currentYear - 1;
// Example data: Total pickups (replace with actual data)
const pickupCount = 945;
// Example data: Total global litter reported (replace with actual data)
const totalGlobalLitterReported = 283596;
// Example data: Total global litter picked up (replace with actual data)
const totalGlobalLitterPickUp = 195056;
// Example data: User's monthly litter reported (replace with actual data)
const myMonthlyLitterReported = 43;
// Example data: User's monthly litter picked up (replace with actual data)
const myMonthlyLitterPickUp = 25;

// Define an array of months with sample data for bar chart
const months = [
  { name: 'Jan', days: 19 }, // Month name and value for bar height
  { name: 'Feb', days: 28 },
  { name: 'Mar', days: 5 },
  { name: 'Apr', days: 14 },
  { name: 'May', days: 31 },
  { name: 'Jun', days: 21 },
  { name: 'Jul', days: 7 },
  { name: 'Aug', days: 17 },
  { name: 'Sep', days: 9 },
  { name: 'Oct', days: 31 },
  { name: 'Nov', days: 13 },
  { name: 'Dec', days: 27 },
];

// Define the Activities component
export default function Activities() {
  return (
    // Main container for the screen
    <View style={styles.container}>
      {/* Template container for background (positioned absolutely) */}
      <View style={styles.templateContainer}>
        <Template /> {/* Renders the Template component (e.g., background image or UI) */}
      </View>
      {/* Header section for "Activities & Impacts" title */}
      <View style={styles.headerContainer}>
        <Text
          style={[styles.headerText, styles.shadowEffect]} // Apply header text style and shadow
          accessibilityLabel="Activities and Impact Header" // Accessibility label for screen readers
        >
          Activities & Impacts
        </Text>
      </View>
      {/* Horizontal line separator */}
      <View style={styles.horizontalLine} />
      {/* Main content container */}
      <View style={styles.contentContainer}>
        {/* Section for global litter statistics */}
        <View style={styles.totalGlobalLitterContainer}>
          <Text style={[styles.totalGlobalLitterText, styles.shadowEffect]}>
            Total Global Litter Content:
            <Text style={styles.enlargeNumbers}>
              {totalGlobalLitterReported.toLocaleString()} {/* Format number with commas */}
            </Text>
          </Text>
          <Text style={[styles.totalGlobalLitterText, styles.shadowEffect]}>
            Pick-Up:
            <Text style={styles.enlargeNumbers}>
              {totalGlobalLitterPickUp.toLocaleString()} {/* Format number with commas */}
            </Text>
          </Text>
        </View>
        {/* Section for overall pickup count */}
        <View style={styles.overallPickupContainer}>
          <Text style={[styles.overallPickupText, styles.shadowEffect]}>
            Overall Pickup for {month} {previousYear} - {month} {currentYear}:
          </Text>
          <Text
            style={[styles.pickupNumber, styles.shadowEffect]}
            accessibilityLabel={`Overall pickup count: ${pickupCount.toLocaleString()}`} // Accessibility for pickup count
          >
            {pickupCount} {/* Display raw number (no commas) */}
          </Text>
        </View>
        {/* Bar chart section */}
        <View style={styles.barChartContainer}>
          <ScrollView
            horizontal={true} // Horizontal scrolling for months
            showsHorizontalScrollIndicator={false} // Hide horizontal scroll bar
            showsVerticalScrollIndicator={false} // Hide vertical scroll bar
            style={styles.monthsScrollView} // ScrollView styling
            contentContainerStyle={styles.monthsContentContainer} // Content container styling
          >
            {months.map((month, index) => ( // Map over months array to create bars
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (month.days / 31) * 200, // Scale bar height (0-200px) based on days (max 31)
                    },
                  ]}
                />
                <Text style={[styles.monthText, styles.shadowEffect]}>
                  {month.name} {/* Display month name (e.g., Jan) */}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Section for user's monthly litter stats */}
        <View style={styles.myMonthlyLitterContainer}>
          <Text style={[styles.myMonthlyLitterText, styles.shadowEffect]}>
            My Monthly Litter Content:
            <Text style={styles.enlargeNumbers}>
              {myMonthlyLitterReported.toLocaleString()} {/* Format number with commas */}
            </Text>
          </Text>
          <Text style={[styles.myMonthlyLitterText, styles.shadowEffect]}>
            Pick-up:
            <Text style={styles.enlargeNumbers}>
              {myMonthlyLitterPickUp.toLocaleString()} {/* Format number with commas */}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

// Define styles using StyleSheet for performance
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the entire screen
  },
  templateContainer: {
    position: 'absolute', // Position Template in the background
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // Extend to the bottom of the screen
    backgroundColor: 'transparent', // Keep transparent to show Template content
    zIndex: 1, // Ensure Template is below other content
  },
  headerContainer: {
    marginTop: 120, // Space below Template's logo/title
    zIndex: 2, // Ensure header is above Template
    // backgroundColor: 'rgba(226, 130, 130, 0.75)', // Commented out (used for debugging)
  },
  horizontalLine: {
    height: 4, // Thicker line for visibility
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Dark line with slight transparency
    width: '100%', // Full width
    zIndex: 2, // Ensure line is above Template
  },
  contentContainer: {
    flex: 1, // Fill remaining space
    zIndex: 2, // Ensure content is above Template
    // backgroundColor: 'rgba(143, 65, 65, 0.75)', // Commented out (used for debugging)
  },
  totalGlobalLitterContainer: {
    flex: 1.5, // Allocate 1.5 parts of available space
    justifyContent: 'center', // Center content vertically
    // backgroundColor: 'rgba(190, 74, 74, 0.75)', // Commented out (used for debugging)
  },
  overallPickupContainer: {
    flex: 1.5, // Allocate 1.5 parts of available space
    zIndex: 2, // Ensure above Template
    // backgroundColor: 'rgba(78, 38, 94, 0.75)', // Commented out (used for debugging)
  },
  barChartContainer: {
    flex: 3, // Allocate 3 parts of available space
    zIndex: 2, // Ensure above Template
    // backgroundColor: 'rgba(182, 120, 125, 0.75)', // Commented out (used for debugging)
    justifyContent: 'flex-end', // Align bars to the bottom
  },
  monthsScrollView: {
    flexGrow: 0, // Prevent ScrollView from expanding unnecessarily
  },
  monthsContentContainer: {
    alignItems: 'center', // Center bars horizontally
  },
  barContainer: {
    width: width / 6, // Each bar takes 1/6 of screen width (shows ~5 bars at a time)
    paddingHorizontal: 10, // Space between bars
    alignItems: 'center', // Center bar and text
    justifyContent: 'flex-end', // Align bars to the bottom
    height: 200, // Fixed height for chart area
  },
  bar: {
    width: 30, // Fixed bar width
    backgroundColor: 'rgba(37, 37, 37, 0.95)', // Dark bar with slight transparency
    borderRadius: 10, // Rounded corners for bars
    marginBottom: 5, // Space between bar and month name
  },
  monthItem: {
    width: width / 6, // Same width as barContainer (unused in current code)
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 50,
  },
  monthText: {
    color: 'white', // White text for month names
    fontSize: 20, // Font size
    textAlign: 'center', // Center text
    marginBottom: 30, // Space below text
  },
  myMonthlyLitterContainer: {
    flex: 2.5, // Allocate 2.5 parts of available space
    zIndex: 2, // Ensure above Template
    // backgroundColor: 'rgba(94, 75, 182, 0.75)', // Commented out (used for debugging)
  },
  headerText: {
    color: 'white', // White text
    fontSize: 36, // Large font for header
    fontWeight: '600', // Bold text
    marginBottom: 10, // Space below header
    marginLeft: 20, // Left margin
  },
  totalGlobalLitterText: {
    color: 'white', // White text
    fontSize: 20, // Medium font size
    alignSelf: 'flex-end', // Align to the right
    marginRight: 40, // Right margin
  },
  overallPickupText: {
    color: 'white', // White text
    fontSize: 20, // Medium font size
    alignSelf: 'center', // Center horizontally
    marginTop: 15, // Top margin
  },
  pickupNumber: {
    fontSize: width * 0.12, // Responsive font size based on screen width
    fontWeight: 'bold', // Bold text
    alignSelf: 'center', // Center horizontally
    marginTop: width * 0.025, // Responsive top margin
    color: '#4CAF50', // Green color for emphasis
  },
  myMonthlyLitterText: {
    color: 'white', // White text
    fontSize: width * 0.05, // Responsive font size
    alignSelf: 'flex-end', // Align to the right
    marginRight: 80, // Larger right margin
    marginTop: 5, // Small top margin
  },
  shadowEffect: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Black shadow with opacity
    textShadowOffset: { width: 1.5, height: 1.5 }, // Shadow offset
    textShadowRadius: 5, // Shadow blur radius
  },
  enlargeNumbers: {
    fontSize: 28, // Larger font for numbers
    fontWeight: '500', // Medium-bold weight
    color: '#4CAF50' // Green color for emphasis
  }
});