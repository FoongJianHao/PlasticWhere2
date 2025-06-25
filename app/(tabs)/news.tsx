// Import React Native components for UI rendering and interaction
import { Dimensions, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Import React for component creation
import React from 'react';
// Import custom Template component for background or shared UI
import Template from '@/components/Template';

// Get screen height for responsive design
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define TypeScript interface for news articles
interface NewsArticle {
  title: string; // Article title
  description: string; // Article summary
  imageUri: string; // URI of the article image
  linkUrl: string; // URL to the full article
}

// Hardcoded array of news articles
const newsArticles: NewsArticle[] = [
  {
    title: "New report reveals Europe is leading the charge in plastic waste management",
    description: "In the past three decades, there has been a surge in inventions to recover and recycle plastic waste, advancing a more circular economy.",
    imageUri: "https://www.innovationnewsnetwork.com/wp-content/uploads/2025/05/shutterstock_2434462445.jpg",
    linkUrl: "https://www.innovationnewsnetwork.com/new-report-reveals-europe-leading-charge-plastic-waste-management/57675/",
  },
  {
    title: "Govt to develop progressive plastic waste policy",
    description: "PUTRAJAYA, May 8 — The government is exploring the best approach to introduce a more progressive policy on plastic waste management, which has become the country’s biggest challenge, said Natural Resources and Environmental Sustainability Minister Nik Nazmi Nik Ahmad.",
    imageUri: "https://selangorjournal.my/wp-content/uploads/2021/03/2021-03-30T113916Z_1_LYNXMPEH2T0PW_RTROPTP_4_MALAYSIA-ENVIRONMENT-PLASTIC.jpg",
    linkUrl: "https://selangorjournal.my/2025/05/govt-to-develop-progressive-plastic-waste-policy/",
  },
  {
    title: "Second marine waste collection vessel launched in Kota Kinabalu",
    description: "KOTA KINABALU: Sabah will use data from collected marine debris to better manage plastic pollution in its waters.",
    imageUri: "https://assets.nst.com.my/images/articles/MAHA0825_1746604237.jpg",
    linkUrl: "https://www.nst.com.my/news/nation/2025/05/1212821/second-marine-waste-collection-vessel-launched-kota-kinabalu",
  },
  {
    title: "Answering ten pressing questions about plastic pollution",
    description: "The world generated an estimated 400 million tonnes of plastic waste last year. This torrent of water and shampoo bottles, dispensing containers, polyester shirts, PVC piping and other plastic products weighed as much as 40,000 Eiffel Towers",
    imageUri: "https://eco-business.imgix.net/clients/featured_images/AFP__20240620__34XR84G__v4__HighRes__TopshotIndonesiaEnvironmentPlasticPollution.jpg?ar=16%3A10&auto=format&dpr=2&fit=crop&ixlib=django-1.2.0&q=45&width=1200",
    linkUrl: "https://www.eco-business.com/press-releases/answering-ten-pressing-questions-about-plastic-pollution/",
  },
  {
    title: "Skimmer boat to combat marine plastic pollution in KK",
    description: "Plastics and waste materials that accumulate in our drainage systems and eventually flow into the sea are damaging marine ecosystems, threatening biodiversity, and kindising livelihoods that depend on a clean marine environment.",
    imageUri: "https://www.theborneopost.com/newsimages/2025/05/6ae4e93c-e419-4f59-a0f8-d1f5645587f1.jpeg",
    linkUrl: "https://www.theborneopost.com/2025/05/07/skimmer-boat-to-combat-marine-plastic-pollution-in-kk/",
  },
];

// Reusable NewsTab component to render individual articles
const NewsTab: React.FC<NewsArticle> = ({ title, description, imageUri, linkUrl }) => {
  // Function to handle link press
  const handleLinkPress = () => {
    console.log(`Navigating to: ${linkUrl}`); // Log URL for debugging
  };

  return (
    <View style={styles.tabContainer}>
      <Image
        source={{ uri: imageUri }} // Load article image
        style={styles.articleImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={3}>
          {title} {/* Display title, limited to 3 lines */}
        </Text>
        <Text style={styles.description} numberOfLines={4} ellipsizeMode="tail">
          {description} {/* Display description, limited to 4 lines */}
        </Text>
        <TouchableOpacity
          onPress={() => {
            handleLinkPress();
            Linking.openURL(linkUrl); // Open article URL in browser
          }}
        >
          <Text style={styles.link}>Read More</Text> {/* Link to full article */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Define the main news component
export default function news() {
  return (
    // Main container for the screen
    <View style={styles.container}>
      <View style={styles.templateContainer}>
        <Template /> {/* Render Template as background */}
      </View>
      <View style={styles.headerContainer}>
        <Text
          style={[styles.headerText, styles.shadowEffect]} // Apply header text style and shadow
          accessibilityLabel="Activities and Impact Header" // Accessibility label
        >
          News & Articles
        </Text>
      </View>
      <View style={styles.horizontalLine} /> {/* Horizontal separator */}
      <View style={styles.contentContainer}>
        <FlatList
          data={newsArticles} // Data source
          renderItem={({ item }) => (
            <NewsTab
              title={item.title}
              description={item.description}
              imageUri={item.imageUri}
              linkUrl={item.linkUrl}
            />
          )}
          keyExtractor={(item, index) => index.toString()} // Use index as key
          showsVerticalScrollIndicator={false} // Hide scroll indicator
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 280 }} // Padding to avoid tab bar overlap
        />
      </View>
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
    bottom: 0, // Extend to bottom
    backgroundColor: 'transparent', // Transparent to show Template
    zIndex: 1, // Lower z-index for background
  },
  headerContainer: {
    marginTop: 120, // Space below Template header
    zIndex: 2, // Above Template
    // backgroundColor: 'rgba(226, 130, 130, 0.6)', // Commented out (debugging)
  },
  contentContainer: {
    marginTop: 10, // Space below header
    zIndex: 2, // Above Template
  },
  tabContainer: {
    flexDirection: 'row', // Arrange image and text horizontally
    height: SCREEN_HEIGHT * 0.25, // ~25% of screen height
    marginHorizontal: 16, // Side margins
    marginTop: 16, // Top margin
    borderRadius: 20, // Rounded corners
    backgroundColor: 'rgba(81, 81, 81, 0.7)', // Semi-transparent gray
    padding: 12, // Internal padding
    shadowColor: '#000', // Shadow
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
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Dark with transparency
    width: '100%', // Full width
    zIndex: 2, // Above Template
  },
  articleImage: {
    width: 60, // Fixed width
    height: 60, // Fixed height
    borderRadius: 15, // Rounded corners
    resizeMode: 'cover', // Cover image
},
  textContainer: {
    flex: 1, // Fill remaining space
    paddingLeft: 16, // Space from image
    justifyContent: 'space-between', // Space text evenly
  },
  title: {
    fontSize: 16, // Medium font
    fontWeight: 'bold', // Bold
    color: 'white', // White text
  },
  description: {
    fontSize: 14, // Smaller font
    color: 'white', // White text
    lineHeight: 20, // Line spacing
  },
  link: {
    fontSize: 14, // Smaller font
    color: '#007AFF', // Blue hyperlink
    fontWeight: '600', // Bold
  },
  shadowEffect: {
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Black shadow
    textShadowOffset: { width: 1.5, height: 1.5 }, // Shadow offset
    textShadowRadius: 5, // Shadow blur
  },
);