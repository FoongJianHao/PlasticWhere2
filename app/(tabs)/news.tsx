import { Dimensions, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Template from '@/components/Template';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NewsArticle {
    title: string;
    description: string;
    imageUri: string;
    linkUrl: string;
}

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
        description: "Plastics and waste materials that accumulate in our drainage systems and eventually flow into the sea are damaging marine ecosystems, threatening biodiversity, and jeopardising livelihoods that depend on a clean marine environment.",
        imageUri: "https://www.theborneopost.com/newsimages/2025/05/6ae4e93c-e419-4f59-a0f8-d1f5645587f1.jpeg",
        linkUrl: "https://www.theborneopost.com/2025/05/07/skimmer-boat-to-combat-marine-plastic-pollution-in-kk/",
    },
]

// Reusable NewsTab component
const NewsTab: React.FC<NewsArticle> = ({ title, description, imageUri, linkUrl }) => {
    const handleLinkPress = () => {
        console.log(`Navigating to: ${linkUrl}`);
    };

    return (
        <View style={styles.tabContainer}>
            <Image
                source={{ uri: imageUri }}
                style={styles.articleImage}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={3}>{title}</Text>
                <Text style={styles.description} numberOfLines={4} ellipsizeMode="tail">
                    {description}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        handleLinkPress();
                        Linking.openURL(linkUrl);
                    }}
                >
                    <Text style={styles.link}>Read More</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function news() {
    return (
        <View style={styles.container}>
            <View style={styles.templateContainer}>
                <Template />
            </View>
            <View style={styles.headerContainer}>
                <Text style={[styles.headerText, styles.shadowEffect]} accessibilityLabel="Activities and Impact Header">
                    News & Articles
                </Text>
            </View>
            <View style={styles.horizontalLine} />
            <View style={styles.contentContainer}>
                <FlatList
                    data={newsArticles}
                    renderItem={({ item }) => (
                        <NewsTab
                            title={item.title}
                            description={item.description}
                            imageUri={item.imageUri}
                            linkUrl={item.linkUrl}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 280 }} // Avoid overlap with tab bar
                />
            </View>
        </View>
    );
}

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
        // backgroundColor: 'rgba(226, 130, 130, 0.6)', // Temporary
    },
    contentContainer: {
        marginTop: 10, // Space below the logo/title from Template
        zIndex: 2,
    },
    tabContainer: {
        flexDirection: 'row',
        height: SCREEN_HEIGHT * 0.25, // ~25% of screen height
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(81, 81, 81, 0.7)',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
    },
    headerText: {
        color: 'white',
        fontSize: 36,
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 20,
    },
    horizontalLine: {
        height: 4, // Slightly thicker for better visibility
        backgroundColor: 'rgba(30, 30, 30, 0.9)', // Changed to black
        width: '100%',
        zIndex: 2, // Ensure line is above the Template
    },
    articleImage: {
        width: '40%',
        height: '80%',
        borderRadius: 15,
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    description: {
        fontSize: 14,
        color: 'white',
        lineHeight: 20,
    },
    link: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    shadowEffect: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)', // Add shadow for readability
        textShadowOffset: { width: 1.5, height: 1.5 },
        textShadowRadius: 5,
    },
})