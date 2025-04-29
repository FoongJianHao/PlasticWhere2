// components/Header.tsx
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';

export default function Header() {
  const logo = require('../assets/images/logo.png'); // Import the logo image

  return (
    <ImageBackground
      source={require('../assets/images/PLBG.png')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={5} // Stronger blur
    >
      {/* Semi-transparent white or bluish overlay */}
      <View style={styles.overlay} />

      {/* Foreground: Logo + Title */}
      <View style={styles.headerContent}>
        <Image
          source={logo}
          style={styles.logo}
        />
        <Text style={styles.title}>PlasticWhere</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill the entire background
    backgroundColor: 'rgba(45, 45, 45, 0.95)', // Light white tint with 30% opacity
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1, // Bring content above overlay
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 5,
    color: 'white', // Black text looks better on lighter overlay
  },
});
