

import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Template from '@/components/Template';

const { width } = Dimensions.get('window');
const now = new Date();
const month = now.toLocaleString('en-US', { month: 'long' });
const currentYear = now.getFullYear();
const previousYear = currentYear - 1;
const pickupCount = 945; // Example pickup count, replace with actual data
const totalGlobalLitterReported = 283596; // Example total global litter content, replace with actual data
const totalGlobalLitterPickUp = 195056
const myMonthlyLitterReported = 43; // Example monthly litter reported, replace with actual data
const myMonthlyLitterPickUp = 25; // Example monthly litter pickup, replace with actual data

const months = [
  { name: 'Jan', days: 19 },
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

export default function Activities() {
  return (
    <View style={styles.container}>
      <View style={styles.templateContainer}>
        <Template />
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.shadowEffect]} accessibilityLabel="Activities and Impact Header">
          Activities & Impacts
        </Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.contentContainer}>
        <View style={styles.totalGlobalLitterContainer}>
          <Text style={[styles.totalGlobalLitterText, styles.shadowEffect]}>
            Total Global Litter Content:
            <Text style={styles.enlargeNumbers}>{totalGlobalLitterReported.toLocaleString()}</Text>
          </Text>
          <Text style={[styles.totalGlobalLitterText, styles.shadowEffect]}>
            Pick-Up:
            <Text style={styles.enlargeNumbers}>
              {totalGlobalLitterPickUp.toLocaleString()}
              </Text>
          </Text>
        </View>
        <View style={styles.overallPickupContainer}>
          <Text style={[styles.overallPickupText, styles.shadowEffect]}>
            Overall Pickup for {month} {previousYear} - {month} {currentYear}:
          </Text>
          <Text style={[styles.pickupNumber, styles.shadowEffect,]} accessibilityLabel={`Overall pickup count: ${pickupCount.toLocaleString()}`}>
            {pickupCount}
          </Text>
        </View>
        <View style={styles.barChartContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.monthsScrollView}
            contentContainerStyle={styles.monthsContentContainer}
          >
            {months.map((month, index) => (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (month.days / 31) * 200, // Scale height from 0 to 200 based on days (max 31)
                    },
                  ]}
                />
                <Text style={[styles.monthText, styles.shadowEffect]}>{month.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.myMonthlyLitterContainer}>
          <Text style={[styles.myMonthlyLitterText, styles.shadowEffect]}>
            My Monthly Litter Reports:
            <Text style={styles.enlargeNumbers}>{myMonthlyLitterReported.toLocaleString()}</Text>
          </Text>
          <Text style={[styles.myMonthlyLitterText, styles.shadowEffect]}>Pick-up:
            <Text style={styles.enlargeNumbers}>{myMonthlyLitterPickUp.toLocaleString()}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  templateContainer: {
    position: 'absolute', // THIS IS IMPORTANT TO MAKE THE TEMPLATE STAY IN THE BACKGROUND
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // Extend to the bottom of the screen
    backgroundColor: 'transparent', // Keep transparent
    zIndex: 1, // Ensure Template is below the text
  },
  headerContainer: {
    marginTop: 120, // Space below the logo/title from Template
    zIndex: 2,
    // backgroundColor: 'rgba(226, 130, 130, 0.75)', // Temporary
  },
  horizontalLine: {
    height: 4, // Slightly thicker for better visibility
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Changed to black
    width: '100%',
    zIndex: 2, // Ensure line is above the Template
  },
  contentContainer: {
    flex: 1,
    zIndex: 2,
    // backgroundColor: 'rgba(143, 65, 65, 0.75)',
  },
  totalGlobalLitterContainer: {
    flex: 1.5,
    justifyContent: 'center',
    // backgroundColor: 'rgba(190, 74, 74, 0.75)',
  },
  overallPickupContainer: {
    flex: 1.5,
    zIndex: 2,
    // backgroundColor: 'rgba(78, 38, 94, 0.75)',
  },
  barChartContainer: {
    flex: 3,
    zIndex: 2,
    // backgroundColor: 'rgba(182, 120, 125, 0.75)',
    justifyContent: 'flex-end',
  },
  monthsScrollView: {
    flexGrow: 0,
  },
  monthsContentContainer: {
    alignItems: 'center',
  },
  barContainer: {
    width: width / 6, // Show 5 bars at a time
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-end', // Align bars to the bottom
    height: 200, // Fixed height for the chart area
  },
  bar: {
    width: 30, // Fixed width for each bar
    backgroundColor: 'rgba(37, 37, 37, 0.95)', // White with some transparency
    borderRadius: 10, // Rounded corners for bars
    marginBottom: 5, // Space between bar and label
  },
  monthItem: {
    width: width / 6, // Show 5 months at a time
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 50,
  },
  monthText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  myMonthlyLitterContainer: {
    flex: 2.5,
    zIndex: 2,
    // backgroundColor: 'rgba(94, 75, 182, 0.75)',
  },
  headerText: {
    color: 'white',
    fontSize: 36,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 20,
  },
  totalGlobalLitterText: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'flex-end',
    marginRight: 40,
  },
  overallPickupText: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 15,
  },
  pickupNumber: {
    color: 'white',
    fontSize: width * 0.12,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: width * 0.025,
  },
  myMonthlyLitterText: {
    color: 'white',
    fontSize: width * 0.05,
    alignSelf: 'flex-end',
    marginRight: 80,
    marginTop: 5,
  },
  shadowEffect: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Add shadow for readability
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 5,
  },
  enlargeNumbers: {
    fontSize: 28,
    fontWeight: '500',
    color: 'white'
  }
});