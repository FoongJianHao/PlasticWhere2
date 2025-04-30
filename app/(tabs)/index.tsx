import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '@/components/header';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    // <SafeAreaView style={styles.screen}>

      <View>
      <Header/>
        <Text style={styles.text}>Home</Text>
      </View>
    // </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  text: {
    fontSize: 24,
    color: 'white', // Ensure visibility against the dark background
    textAlign: 'center',
  },
});